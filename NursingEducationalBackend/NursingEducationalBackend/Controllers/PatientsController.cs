using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public PatientsController(NursingDbContext context)
        {
            _context = context;
        }

        //GET: api/patients
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        //GET: api/patients/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);
            return Ok(patient);
        }

        //Create patient
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (ModelState.IsValid)
            {
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest("Unable to create patient");
            }
        }

        // GET: api/Patients/admin/ids
        [HttpGet("admin/ids")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientIds()
        {
            try
            {
                // For SQLite, use the standard query without FromSqlRaw
                var patients = await _context.Patients
                    .AsNoTracking()
                    .ToListAsync();

                if (!patients.Any())
                {
                    return Ok(new List<Patient>());
                }

                // Debug check for IDs
                if (patients.All(p => p.PatientId == 0))
                {
                    // If this happens, the entity mapping needs to be fixed
                    return StatusCode(500, new { message = "Error retrieving patient IDs - all IDs are 0" });
                }

                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving patients", error = ex.Message });
            }
        }


        //Assign nurseId to patient
        [HttpPost("{id}/assign-nurse/{nurseId}")]
        [Authorize]
        public async Task<ActionResult> AssignNurseToPatient(int id, int nurseId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);

            if (patient != null)
            {
                patient.NurseId = nurseId;
                _context.Update(patient);
                await _context.SaveChangesAsync();
                return Ok(new { patient.NurseId });
            }
            else
            {
                return BadRequest("Nurse id unable to be assigned");
            }
        }

        [HttpPost("{id}/submit-data")]
        [Authorize]
        public async Task<ActionResult> SubmitData(int id, SubmitDataDTO request)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null) return NotFound("Patient not found.");

            // Get user identity from Entra token
            var entraUserId = User.FindFirst("oid")?.Value 
                ?? User.FindFirst("sub")?.Value;

            var email = User.FindFirst("preferred_username")?.Value
                ?? User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                ?? User.FindFirst("email")?.Value;

            // Look up nurse by EntraUserId or email
            Nurse? nurse = null;
            if (!string.IsNullOrEmpty(entraUserId))
            {
                nurse = await _context.Nurses.FirstOrDefaultAsync(n => n.EntraUserId == entraUserId);
            }
            if (nurse == null && !string.IsNullOrEmpty(email))
            {
                nurse = await _context.Nurses.FirstOrDefaultAsync(n => n.Email == email);
            }

            if (nurse == null) return Unauthorized("Nurse record not found");

            //Validate the rotation provided
            var rotation = await _context.Rotations
                .Include(r => r.RotationAssessments)
                .ThenInclude(ra => ra.AssessmentType)
                .FirstOrDefaultAsync(r => r.RotationId == request.RotationId);

            if (rotation == null) return BadRequest("Invalid rotation.");

            //Create and save the new record, then pass it to each report handler to update its foreign keys.
            var newRecord = new Record { 
                PatientId = id,
                RotationId = request.RotationId,
                NurseId = nurse.NurseId,
                CreatedDate = DateTime.Now
            };
            _context.Records.Add(newRecord);
            await _context.SaveChangesAsync();

            //Get the allowed AssessmentTypes for this rotation
            var allowedAssessments = rotation.RotationAssessments
                .Select(ra => ra.AssessmentType.RouteKey.ToLower())
                .ToHashSet();

            PatientDataSubmissionHandler handler = new PatientDataSubmissionHandler();

            foreach (var entry in request.AssessmentData)
            {
                var key = entry.Key;
                var value = entry.Value;

                //Parse key format: "patient-[assessmentType]-[patientId]"
                var parts = key.Split('-');
                if (parts.Length != 3) continue;

                var assessmentKey = parts[1].ToLower();
                
                // Handle profile data separately
                if (assessmentKey == "profile")
                {
                    await handler.SubmitProfileData(_context, value, patient);
                    continue;
                }
                
                var componentKey = MapKeyToComponentKey(assessmentKey);
                if (componentKey == null) continue;
                    
                // Verify this is valid for this rotation
                if (!allowedAssessments.Contains(componentKey.ToLower())) continue;

                // Get the assessment type
                var assessmentType = await _context.AssessmentTypes
                    .FirstOrDefaultAsync(at => at.RouteKey == componentKey);
                
                if (assessmentType == null) continue;

                //Submit the data
                await handler.SubmitAssessmentData(
                    _context,
                    value,
                    newRecord,
                    assessmentType.AssessmentTypeId,
                    id
                );
            }

            return Ok(new { recordId = newRecord.RecordId, message = "Data submitted successfully." });
        }


        // GET: api/Patients/history/assessment/{assessmentType}/{tableId}
        [HttpGet("history/assessment/{assessmentType}/{tableId}")]
        [Authorize]
        public async Task<ActionResult<object>> GetAssessmentData(int assessmentType, int tableId)
        {
            object tableData = null;
            switch ((AssessmentTypeEnum)assessmentType)
            {
                case AssessmentTypeEnum.ADL:
                    tableData = await _context.Adls.FirstOrDefaultAsync(a => a.AdlId == tableId);
                    break;
                case AssessmentTypeEnum.Behaviour:
                    tableData = await _context.Behaviours.FirstOrDefaultAsync(b => b.BehaviourId == tableId);
                    break;
                case AssessmentTypeEnum.Cognitive:
                    tableData = await _context.Cognitives.FirstOrDefaultAsync(c => c.CognitiveId == tableId);
                    break;
                case AssessmentTypeEnum.Elimination:
                    tableData = await _context.Eliminations.FirstOrDefaultAsync(e => e.EliminationId == tableId);
                    break;
                case AssessmentTypeEnum.MobilityAndSafety:
                    tableData = await _context.MobilityAndSafeties.FirstOrDefaultAsync(m => m.MobilityAndSafetyId == tableId);
                    break;
                case AssessmentTypeEnum.Nutrition:
                    tableData = await _context.Nutritions.FirstOrDefaultAsync(n => n.NutritionId == tableId);
                    break;
                case AssessmentTypeEnum.ProgressNote:
                    tableData = await _context.ProgressNotes.FirstOrDefaultAsync(pn => pn.ProgressNoteId == tableId);
                    break;
                case AssessmentTypeEnum.SkinAndSensoryAid:
                    tableData = await _context.SkinAndSensoryAids.FirstOrDefaultAsync(s => s.SkinAndSensoryAidsId == tableId);
                    break;
                case AssessmentTypeEnum.AcuteProgress:
                    tableData = await _context.AcuteProgresses.FirstOrDefaultAsync(ap => ap.AcuteProgressId == tableId);
                    break;
                case AssessmentTypeEnum.LabsDiagnosticsAndBlood:
                    tableData = await _context.LabsDiagnosticsAndBloods.FirstOrDefaultAsync(ldb => ldb.LabsDiagnosticsAndBloodId == tableId);
                    break;
                default:
                    return BadRequest(new { message = "Invalid assessment type" });
            }

            if (tableData == null)
            {
                return NotFound("Table not found");
            }   

            return Ok(tableData);
        }


        [HttpGet("{id}/history")]
        [Authorize]
        public async Task<ActionResult<PatientHistoryDTO>> GetPatientHistory(int id)
        {
            Patient? patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);
            if (patient == null)
            {
                return NotFound();
            }

            ICollection<PatientHistoryRecordDTO> patientRecords = await _context.Records
                .AsNoTracking()
                .Where(r => r.PatientId == id)
                .Include(r => r.Nurse)
                .Include(r => r.Rotation)
                .Include(r => r.AssessmentSubmissions)
                    .ThenInclude(asub => asub.AssessmentType)
                .Select(r => new PatientHistoryRecordDTO {
                    RecordId = r.RecordId,
                    SubmittedDate = r.CreatedDate,
                    NurseId = r.NurseId,
                    SubmittedNurse = r.Nurse.FullName,
                    RotationId = r.RotationId,
                    RotationName = r.Rotation.Name,
                    AssessmentSubmissions = r.AssessmentSubmissions.Select(asub => new AssessmentSubmissionSummaryDTO
                    {
                        SubmissionId = asub.Id,
                        AssessmentTypeId = asub.AssessmentTypeId,
                        AssessmentTypeName = asub.AssessmentType.Name,
                        TableRecordId = asub.TableRecordId
                    }).ToList()

                }).ToListAsync();

            PatientHistoryDTO history = new PatientHistoryDTO
            {
                PatientId = id,
                PatientName = patient.FullName,
                History = patientRecords
            };

            return Ok(history);
        }

        //TEMPORARY MAPPING FUNCTION
        //Map current frontend keys to RouteKey values that match the database
        private string MapKeyToComponentKey(string key)
        {
            return key.ToLower() switch
            {
                "adl" => "ADL",
                "behaviour" => "Behaviour",
                "cognitive" => "Cognitive",
                "elimination" => "Elimination",
                "labsdiagnosticsblood" => "LabsDiagnosticsBlood",
                "nutrition" => "Nutrition",
                "skin" => "SkinSensoryAid",
                "progressnote" => "ProgressNote",
                "mobilityandsafety" => "MobilityAndSafety",
                "acuteprogress" => "AcuteProgress",
                _ => null
            };
        }
    }
}