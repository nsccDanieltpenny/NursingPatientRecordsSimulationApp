using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Utilities;
using System.Globalization;
using System.Security.Claims;

namespace NursingEducationalBackend.Controllers
{
    // Medication Administration Record routes
    [Route("api/patients/{patientId:int}")]
    [ApiController]
    [Authorize]
    public class MarController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public MarController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/patients/{patientId}/mar?date=2026-11-05
        [HttpGet("mar")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<MarDayDTO>> GetMar(int patientId, [FromQuery] string? date)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PatientId == patientId && p.CampusId == campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            // Which Halifax day to show (default: today)
            DateOnly day;
            if (string.IsNullOrEmpty(date))
            {
                day = AtlanticTime.Today();
            }
            else if (!DateOnly.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out day))
            {
                return BadRequest(new { errors = new[] { "date must be YYYY-MM-DD" } });
            }

            // That day as a UTC window: [dayStart, dayEnd)
            var dayStart = AtlanticTime.ToUtc(day, TimeOnly.MinValue);
            var dayEnd = AtlanticTime.ToUtc(day.AddDays(1), TimeOnly.MinValue);

            // Orders active at some point that day
            var orders = await _context.MedicationOrders
                .AsNoTracking()
                .Include(o => o.Drug)
                .Include(o => o.OrderedByNurse)
                .Where(o => o.PatientId == patientId
                    && o.StartAt < dayEnd
                    && (o.DiscontinuedAt == null || o.DiscontinuedAt > dayStart))
                .OrderBy(o => o.MedicationOrderId)
                .ToListAsync();

            // Every dose charted on those orders 
            var orderIds = orders.Select(o => o.MedicationOrderId).ToList();
            var doses = await _context.MedicationAdministrations
                .AsNoTracking()
                .Include(a => a.AdministeredByNurse)
                .Include(a => a.ResponseByNurse)
                .Where(a => orderIds.Contains(a.MedicationOrderId))
                .ToListAsync();

            var now = DateTime.UtcNow;
            var result = new MarDayDTO
            {
                PatientId = patient.PatientId,
                PatientName = patient.FullName,
                Allergies = patient.Allergies,
                Date = day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            };

            foreach (var order in orders)
            {
                var orderDoses = doses.Where(a => a.MedicationOrderId == order.MedicationOrderId).ToList();
                var dto = ToOrderDTO(order);

                if (dto.OrderType == "Scheduled")
                {
                    foreach (var dueTime in dto.DueTimes)
                    {
                        if (!TimeOnly.TryParseExact(dueTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var time))
                            continue;

                        var dueAt = AtlanticTime.ToUtc(day, time);

                        // No slot before the order started or after it was stopped
                        if (dueAt < order.StartAt || (order.DiscontinuedAt != null && dueAt >= order.DiscontinuedAt))
                            continue;

                        var charted = orderDoses.FirstOrDefault(a => a.DueAt == dueAt);
                        dto.Slots.Add(new MarSlotDTO
                        {
                            DueTime = dueTime,
                            DueAt = dueAt,
                            Dose = charted == null ? null : ToDoseDTO(charted),
                        });
                    }
                }
                else
                {
                    // PRN doses have no DueAt; list the ones given (or charted) that day
                    dto.PrnDoses = orderDoses
                        .Where(a => a.DueAt == null)
                        .Where(a => (a.GivenAt ?? a.ChartedAt) >= dayStart && (a.GivenAt ?? a.ChartedAt) < dayEnd)
                        .OrderBy(a => a.GivenAt ?? a.ChartedAt)
                        .Select(ToDoseDTO)
                        .ToList();

                    var givenTimes = orderDoses
                        .Where(a => a.DueAt == null && a.Status == "Given" && a.GivenAt != null)
                        .Select(a => a.GivenAt!.Value)
                        .ToList();

                    if (givenTimes.Count > 0)
                    {
                        var lastGiven = givenTimes.Max();
                        dto.LastGivenAt = AtlanticTime.AsUtc(lastGiven);
                        if (order.MinIntervalMinutes != null)
                            dto.NextAllowedAt = AtlanticTime.AsUtc(lastGiven.AddMinutes(order.MinIntervalMinutes.Value));
                    }

                    dto.DosesGivenLast24Hours = givenTimes.Count(t => t > now.AddHours(-24) && t <= now);
                }

                result.Orders.Add(dto);
            }

            return Ok(result);
        }

        // POST: api/patients/{patientId}/medication-orders
        // Instructors enter orders. Scheduled orders need due times; PRN orders need reasons and a min interval.
        [HttpPost("medication-orders")]
        [Authorize(Roles = "Admin, Instructor")]
        public async Task<ActionResult<MarOrderDTO>> CreateMedicationOrder(int patientId, [FromBody] MedicationOrderCreateDTO request)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patientExists = await _context.Patients
                .AnyAsync(p => p.PatientId == patientId && p.CampusId == campusId.Value);
            if (!patientExists)
                return NotFound("Patient not found");

            if (!TryGetNurseId(out int nurseId))
                return Unauthorized("Nurse record not found.");

            // Collect every problem so the form can show them all at once
            var errors = new List<string>();

            var drug = await _context.Drugs.FirstOrDefaultAsync(d => d.DrugId == request.DrugId);
            if (drug == null)
                errors.Add("drugId does not exist.");

            if (request.Dose == null || request.Dose <= 0)
                errors.Add("dose must be above 0.");
            else if (request.DoseMax != null && request.DoseMax <= request.Dose)
                errors.Add("doseMax must be more than dose.");

            if (string.IsNullOrWhiteSpace(request.DoseUnit)) errors.Add("doseUnit is required.");
            if (string.IsNullOrWhiteSpace(request.Form)) errors.Add("form is required.");
            if (string.IsNullOrWhiteSpace(request.Route)) errors.Add("route is required.");
            if (string.IsNullOrWhiteSpace(request.Frequency)) errors.Add("frequency is required.");
            if (request.StartAt == null) errors.Add("startAt is required.");

            var dueTimes = request.DueTimes.Select(t => t.Trim()).Distinct().OrderBy(t => t).ToList();
            var prnReasons = request.PrnReasons.Select(r => r.Trim()).Where(r => r.Length > 0).Distinct().ToList();

            if (request.OrderType == "Scheduled")
            {
                if (dueTimes.Count == 0)
                    errors.Add("dueTimes needs at least one time.");
                foreach (var t in dueTimes)
                {
                    if (!TimeOnly.TryParseExact(t, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        errors.Add($"\"{t}\" is not a 24-hour HH:MM time.");
                }
                if (prnReasons.Count > 0)
                    errors.Add("Scheduled orders can't have prnReasons.");
            }
            else if (request.OrderType == "PRN")
            {
                if (dueTimes.Count > 0)
                    errors.Add("PRN orders can't have dueTimes.");
                if (prnReasons.Count == 0)
                    errors.Add("prnReasons needs at least one reason.");
                if (prnReasons.Any(r => r.Contains(',')))
                    errors.Add("prnReasons can't contain commas.");
                if (request.MinIntervalMinutes == null || request.MinIntervalMinutes <= 0)
                    errors.Add("minIntervalMinutes must be above 0 for PRN orders.");
                if (request.MaxDosesPer24Hours != null && request.MaxDosesPer24Hours < 1)
                    errors.Add("maxDosesPer24Hours must be at least 1.");
            }
            else
            {
                errors.Add("orderType must be \"Scheduled\" or \"PRN\".");
            }

            if (errors.Count > 0)
                return BadRequest(new { errors });

            var isPrn = request.OrderType == "PRN";
            var order = new MedicationOrder
            {
                PatientId = patientId,
                DrugId = request.DrugId,
                OrderedByNurseId = nurseId,
                Dose = request.Dose,
                DoseMax = request.DoseMax,
                DoseUnit = request.DoseUnit!.Trim(),
                Form = request.Form!.Trim(),
                Route = request.Route!.Trim(),
                Frequency = request.Frequency!.Trim(),
                // Stored as text, for example "08:00,20:00"
                DueTimes = isPrn ? null : string.Join(",", dueTimes),
                PrnReasons = isPrn ? string.Join(",", prnReasons) : null,
                MinIntervalMinutes = isPrn ? request.MinIntervalMinutes : null,
                MaxDosesPer24Hours = isPrn ? request.MaxDosesPer24Hours : null,
                InstructorNote = string.IsNullOrWhiteSpace(request.InstructorNote) ? null : request.InstructorNote.Trim(),
                StartAt = request.StartAt!.Value.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow,
            };

            _context.MedicationOrders.Add(order);
            await _context.SaveChangesAsync();

            // Fill in the names for the reply
            order.Drug = drug;
            order.OrderedByNurse = await _context.Nurses.AsNoTracking().FirstOrDefaultAsync(n => n.NurseId == nurseId);

            return Created($"/api/patients/{patientId}/mar", ToOrderDTO(order));
        }

        // Mapping

        private static MarOrderDTO ToOrderDTO(MedicationOrder order)
        {
            var dueTimes = SplitList(order.DueTimes);
            return new MarOrderDTO
            {
                MedicationOrderId = order.MedicationOrderId,
                Drug = new MarDrugDTO { DrugId = order.DrugId, GenericName = order.Drug?.GenericName ?? "" },
                // No column for this: an order with due times is Scheduled, one without is PRN
                OrderType = dueTimes.Count > 0 ? "Scheduled" : "PRN",
                Dose = order.Dose,
                DoseMax = order.DoseMax,
                DoseUnit = order.DoseUnit,
                Form = order.Form,
                Route = order.Route,
                Frequency = order.Frequency,
                DueTimes = dueTimes,
                PrnReasons = SplitList(order.PrnReasons),
                MinIntervalMinutes = order.MinIntervalMinutes,
                MaxDosesPer24Hours = order.MaxDosesPer24Hours,
                InstructorNote = order.InstructorNote,
                StartAt = AtlanticTime.AsUtc(order.StartAt),
                DiscontinuedAt = AtlanticTime.AsUtc(order.DiscontinuedAt),
                OrderedBy = ToNurseDTO(order.OrderedByNurse, order.OrderedByNurseId),
            };
        }

        private static MarDoseDTO ToDoseDTO(MedicationAdministration a)
        {
            var hasResponse = a.ResponseEffective != null || a.ResponsePainScore != null
                || a.ResponseComment != null || a.ResponseAt != null;

            return new MarDoseDTO
            {
                AdministrationId = a.AdministrationId,
                Status = a.Status,
                DoseGiven = a.DoseGiven,
                GivenAt = AtlanticTime.AsUtc(a.GivenAt),
                PrnReason = a.PrnReason,
                NotGivenReason = a.NotGivenReason,
                Comment = a.Comment,
                WarningsOverridden = SplitList(a.WarningsOverridden),
                ChartedBy = ToNurseDTO(a.AdministeredByNurse, a.NurseId),
                ChartedAt = AtlanticTime.AsUtc(a.ChartedAt),
                Response = !hasResponse ? null : new MarResponseDTO
                {
                    Effective = a.ResponseEffective,
                    PainScore = a.ResponsePainScore,
                    Comment = a.ResponseComment,
                    RespondedAt = AtlanticTime.AsUtc(a.ResponseAt),
                    RespondedBy = a.ResponseByNurseId == null ? null : ToNurseDTO(a.ResponseByNurse, a.ResponseByNurseId.Value),
                },
            };
        }

        private static MarNurseDTO ToNurseDTO(Nurse? nurse, int nurseId)
        {
            return new MarNurseDTO { NurseId = nurseId, FullName = nurse?.FullName };
        }

        // "08:00,20:00" to ["08:00", "20:00"]
        private static List<string> SplitList(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return new List<string>();

            return value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        }

        // Campus scoping (same rules as PatientsController)

        private bool TryGetNurseId(out int nurseId)
        {
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out nurseId))
            {
                nurseId = 0;
                return false;
            }

            return true;
        }

        private async Task<int?> GetUserCampusIdAsync()
        {
            var adminCampusId = GetAdminCampusOverride();
            if (adminCampusId.HasValue)
                return adminCampusId.Value;

            if (!TryGetNurseId(out int nurseId))
                return null;

            var nurse = await _context.Nurses
                .AsNoTracking()
                .Include(n => n.Class)
                .FirstOrDefaultAsync(n => n.NurseId == nurseId);

            if (nurse?.Class?.CampusId != null)
                return nurse.Class.CampusId;

            if (nurse?.IsInstructor == true)
            {
                var instructorCampusId = await _context.Classes
                    .AsNoTracking()
                    .Where(c => c.InstructorId == nurseId)
                    .Select(c => c.CampusId)
                    .FirstOrDefaultAsync();

                return instructorCampusId > 0 ? instructorCampusId : null;
            }

            return null;
        }

        private int? GetAdminCampusOverride()
        {
            if (!IsAdminUser())
                return null;

            if (Request.Headers.TryGetValue("X-Campus-Id", out var campusHeader) &&
                int.TryParse(campusHeader.FirstOrDefault(), out int campusIdFromHeader))
                return campusIdFromHeader;

            if (Request.Query.TryGetValue("campusId", out var campusQuery) &&
                int.TryParse(campusQuery.FirstOrDefault(), out int campusIdFromQuery))
                return campusIdFromQuery;

            return null;
        }

        private bool IsAdminUser()
        {
            if (User.IsInRole("Admin"))
                return true;

            return User.Claims.Any(c =>
                (c.Type == "roles" || c.Type == "role" || c.Type == ClaimTypes.Role) &&
                string.Equals(c.Value, "Admin", StringComparison.OrdinalIgnoreCase));
        }
    }
}
