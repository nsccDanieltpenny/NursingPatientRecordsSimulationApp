using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Identity.Client;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.DTOs.Assessments;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Models.Assessments;
using NursingEducationalBackend.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patients = await _context.Patients
                .Where(p => p.CampusId == campusId.Value)
                .ToListAsync();
            return Ok(patients);
        }

        //GET: api/patients/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult> GetPatientById(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        //POST: api/patients/clear-bed/{bedNumber}
        [HttpPost("clear-bed/{bedNumber}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ClearBed(int bedNumber)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.CampusId == campusId.Value && p.BedNumber == bedNumber);

            if (patient == null)
            {
                return NotFound("No patient found for this bed.");
            }

            patient.BedNumber = null;
            if (!patient.DischargeDate.HasValue)
            {
                patient.DischargeDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            _context.Update(patient);
            await _context.SaveChangesAsync();

            return Ok(new { patient.PatientId, bedNumber });
        }

        //POST: api/patients/{id}/clear-bed
        [HttpPost("{id}/clear-bed")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ClearBedByPatientId(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            patient.BedNumber = null;
            if (!patient.DischargeDate.HasValue)
            {
                patient.DischargeDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            _context.Update(patient);
            await _context.SaveChangesAsync();

            return Ok(new { patient.PatientId });
        }

        //Create patient
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> CreatePatient([FromBody] PatientCreateDTO patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Unable to create patient");
            }

            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var isAdminUser = IsAdminUser();
            if (!isAdminUser)
            {
                if (!TryGetNurseId(out int nurseId))
                {
                    return Unauthorized("Nurse not found for user.");
                }

                var nurse = await _context.Nurses
                    .AsNoTracking()
                    .FirstOrDefaultAsync(n => n.NurseId == nurseId);

                var isStudent = nurse != null && !nurse.IsInstructor && nurse.ClassId.HasValue && nurse.IsValid;
                if (isStudent)
                {
                    if (!patient.RotationId.HasValue)
                    {
                        return BadRequest("Rotation is required.");
                    }

                    if (patient.RotationId.Value == 1)
                    {
                        return StatusCode(403, "Students cannot create patients during LTC rotation.");
                    }
                }
            }

            if (patient.NurseId.HasValue)
            {
                var nurse = await _context.Nurses
                    .AsNoTracking()
                    .Include(n => n.Class)
                    .FirstOrDefaultAsync(n => n.NurseId == patient.NurseId.Value);

                if (nurse?.Class?.CampusId != campusId.Value)
                {
                    return BadRequest("Nurse is not in the same campus.");
                }
            }

            var newPatient = new Patient
            {
                NurseId = patient.NurseId,
                ImageFilename = patient.ImageFilename,
                BedNumber = patient.BedNumber,
                NextOfKin = patient.NextOfKin,
                NextOfKinPhone = patient.NextOfKinPhone,
                FullName = patient.FullName,
                Sex = patient.Sex,
                PatientWristId = patient.PatientWristId,
                Dob = patient.Dob,
                AdmissionDate = patient.AdmissionDate,
                DischargeDate = patient.DischargeDate,
                MaritalStatus = patient.MaritalStatus,
                MedicalHistory = patient.MedicalHistory,
                Weight = patient.Weight,
                Height = patient.Height,
                Allergies = patient.Allergies,
                IsolationPrecautions = patient.IsolationPrecautions,
                RoamAlertBracelet = patient.RoamAlertBracelet,
                AdmittingDiagnosis = patient.AdmittingDiagnosis,
                CurrentIllness = patient.CurrentIllness,
                CampusId = campusId.Value
            };

            _context.Patients.Add(newPatient);
            await _context.SaveChangesAsync();
            return Ok();
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
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            var nurse = await _context.Nurses
                .AsNoTracking()
                .Include(n => n.Class)
                .FirstOrDefaultAsync(n => n.NurseId == nurseId);

            if (nurse?.Class?.CampusId != campusId.Value)
            {
                return BadRequest("Nurse is not in the same campus.");
            }

            patient.NurseId = nurseId;
            _context.Update(patient);
            await _context.SaveChangesAsync();
            return Ok(new { patient.NurseId });
        }

        [HttpPost("{id}/submit-data")]
        [Authorize]
        public async Task<ActionResult> SubmitData(int id, SubmitDataDTO request)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null) return NotFound("Patient not found.");

            // Get nurse identity from claims
            if (!TryGetNurseId(out int nurseId))
            {
                return Unauthorized("Nurse record not found.");
            }

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
                NurseId = nurseId,
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
                case AssessmentTypeEnum.NEWS2:
                    tableData = await _context.NEWS2s.FirstOrDefaultAsync(n => n.News2Id == tableId);
                    break;
                case AssessmentTypeEnum.DischargeChecklist:
                    tableData = await _context.DischargeChecklists.FirstOrDefaultAsync(dc => dc.DischargeChecklistId == tableId);
                    break;
                case AssessmentTypeEnum.ConsultCurrentIllness:
                    tableData = await _context.Consults.FirstOrDefaultAsync(con => con.ConsultId == tableId);
                    break;
                    
                case AssessmentTypeEnum.LabsDiagnosticsAndBlood:
                    tableData = await _context.LabsDiagnosticsAndBloods.FirstOrDefaultAsync(lab => lab.LabsDiagnosticsAndBloodId == tableId);
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
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            Patient? patient = await GetScopedPatientAsync(id, campusId.Value);
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
                    NurseCampusId = r.Nurse.Class.CampusId,
                    SubmittedNurse = r.Nurse.FullName,
                    PatientId = r.PatientId,
                    PatientName = patient.FullName,
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

        //Labs and Diagnostics for Acure Care
        [HttpGet("{id}/labs")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<PatientLabsDiagnosticsAndBloodDTO>>> GetPatientLabs(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var pt = await GetScopedPatientAsync(id, campusId.Value);
            if (pt == null) return NotFound("Patient not found");

            var labs = await _context.LabsDiagnosticsAndBloods
                .Where(l => l.PatientId == id)
                .OrderBy(l => l.OrderedDate)
                .ToListAsync();

            return Ok(labs);
        }

        [HttpPut("{id}/labs")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<PatientLabsDiagnosticsAndBloodDTO>>> CreateUpdatePatientLabs(int id, [FromBody] PatientLabsDiagnosticsBloodUpsertDTO request)
        {
            LabsDiagnosticsAndBlood lastLab = null;
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null) return NotFound("Patient not found");

            //Get nurse identity from claims
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
            {
                return Unauthorized("Nurse record not found.");
            }

            //Create a record for history
            var record = new Record
            {
                PatientId = id,
                RotationId = request.RotationId,
                NurseId = nurseId,
                CreatedDate = DateTime.Now
            };
            _context.Records.Add(record);
            await _context.SaveChangesAsync();

            //Update/Insert each lab entry
            foreach (var dto in request.Labs)
            {
                if (dto.LabsDiagnosticsAndBloodId > 0)
                {
                    //UPDATE
                    var existing = await _context.LabsDiagnosticsAndBloods
                        .FirstOrDefaultAsync(l => l.LabsDiagnosticsAndBloodId == dto.LabsDiagnosticsAndBloodId && l.PatientId == id);

                    if (existing != null)
                    {
                        existing.Type = dto.Type;
                        existing.Value = dto.Value;
                        existing.OrderedDate = dto.OrderedDate;
                        existing.CompletedDate = dto.CompletedDate;
                        lastLab = existing;
                    }
                }
                else
                {
                    //INSERT
                    var newLab = new LabsDiagnosticsAndBlood
                    {
                        PatientId = id,
                        Type = dto.Type,
                        Value = dto.Value,
                        OrderedDate = dto.OrderedDate,
                        CompletedDate = dto.CompletedDate
                    };
                    _context.LabsDiagnosticsAndBloods.Add(newLab);
                    lastLab = newLab;
                }
            }

            await _context.SaveChangesAsync();

            //Handle AssessmentSubmission for history purposes
            var submission = new AssessmentSubmission
            {
                RecordId = record.RecordId,
                AssessmentTypeId = (int)AssessmentTypeEnum.LabsDiagnosticsAndBlood,
                TableRecordId = lastLab.LabsDiagnosticsAndBloodId
            };
            _context.AssessmentSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(new { recordId = record.RecordId, message = "Labs updated successfully." });
        }

        //Discharge Checklist
        [HttpGet("{id}/dischargechecklist")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<PatientDischargeChecklistDTO>> GetDischargeChecklist(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var pt = await GetScopedPatientAsync(id, campusId.Value);
            if (pt == null) return NotFound("Patient not found");

            var checklist = await _context.DischargeChecklists.FirstOrDefaultAsync(dc => dc.PatientId == id);
            
            if (checklist == null)
            {
                // Return empty DTO if no checklist exists yet
                return Ok(new PatientDischargeChecklistDTO { PatientId = id });
            }

            // Map the model to DTO
            var dto = new PatientDischargeChecklistDTO
            {
                PatientId = checklist.PatientId,
                TargetDischargeDate = checklist.TargetDischargeDate,
                HighRiskDischarge = checklist.HighRiskDischarge,
                CreateHomeChartInitiatedDate = checklist.CreateHomeChartInitiatedDate,
                CreateHomeChartCompletedDate = checklist.CreateHomeChartCompletedDate,
                CreateHomeChartComments = checklist.CreateHomeChartComments,
                CreateHomeChartNotApplicable = checklist.CreateHomeChartNotApplicable,
                ReturnHomeChartInitiatedDate = checklist.ReturnHomeChartInitiatedDate,
                ReturnHomeChartCompletedDate = checklist.ReturnHomeChartCompletedDate,
                ReturnHomeChartComments = checklist.ReturnHomeChartComments,
                ReturnHomeChartNotApplicable = checklist.ReturnHomeChartNotApplicable,
                NotifyPCNurseInitiatedDate = checklist.NotifyPCNurseInitiatedDate,
                NotifyPCNurseCompletedDate = checklist.NotifyPCNurseCompletedDate,
                NotifyPCNurseComments = checklist.NotifyPCNurseComments,
                NotifyPCNurseNotApplicable = checklist.NotifyPCNurseNotApplicable,
                NotifyContinuingCareInitiatedDate = checklist.NotifyContinuingCareInitiatedDate,
                NotifyContinuingCareCompletedDate = checklist.NotifyContinuingCareCompletedDate,
                NotifyContinuingCareComments = checklist.NotifyContinuingCareComments,
                NotifyContinuingCareNotApplicable = checklist.NotifyContinuingCareNotApplicable,
                FamilySupportInitiatedDate = checklist.FamilySupportInitiatedDate,
                FamilySupportCompletedDate = checklist.FamilySupportCompletedDate,
                FamilySupportComments = checklist.FamilySupportComments,
                FamilySupportNotApplicable = checklist.FamilySupportNotApplicable,
                GetAppointmentsInitiatedDate = checklist.GetAppointmentsInitiatedDate,
                GetAppointmentsCompletedDate = checklist.GetAppointmentsCompletedDate,
                GetAppointmentsComments = checklist.GetAppointmentsComments,
                GetAppointmentsNotApplicable = checklist.GetAppointmentsNotApplicable,
                ConsultGeriatricNavInitiatedDate = checklist.ConsultGeriatricNavInitiatedDate,
                ConsultGeriatricNavCompletedDate = checklist.ConsultGeriatricNavCompletedDate,
                ConsultGeriatricNavComments = checklist.ConsultGeriatricNavComments,
                ConsultGeriatricNavNotApplicable = checklist.ConsultGeriatricNavNotApplicable,
                ProvideFollowUpApptsInitiatedDate = checklist.ProvideFollowUpApptsInitiatedDate,
                ProvideFollowUpApptsCompletedDate = checklist.ProvideFollowUpApptsCompletedDate,
                ProvideFollowUpApptsComments = checklist.ProvideFollowUpApptsComments,
                ProvideFollowUpApptsNotApplicable = checklist.ProvideFollowUpApptsNotApplicable,
                ProvideRxInitiatedDate = checklist.ProvideRxInitiatedDate,
                ProvideRxCompletedDate = checklist.ProvideRxCompletedDate,
                ProvideRxComments = checklist.ProvideRxComments,
                ProvideRxNotApplicable = checklist.ProvideRxNotApplicable,
                AssessBlisterPackInitiatedDate = checklist.AssessBlisterPackInitiatedDate,
                AssessBlisterPackCompletedDate = checklist.AssessBlisterPackCompletedDate,
                AssessBlisterPackComments = checklist.AssessBlisterPackComments,
                AssessBlisterPackNotApplicable = checklist.AssessBlisterPackNotApplicable,
                ReturnOwnMedsInitiatedDate = checklist.ReturnOwnMedsInitiatedDate,
                ReturnOwnMedsCompletedDate = checklist.ReturnOwnMedsCompletedDate,
                ReturnOwnMedsComments = checklist.ReturnOwnMedsComments,
                ReturnOwnMedsNotApplicable = checklist.ReturnOwnMedsNotApplicable,
                ObtainAffordMedsInitiatedDate = checklist.ObtainAffordMedsInitiatedDate,
                ObtainAffordMedsCompletedDate = checklist.ObtainAffordMedsCompletedDate,
                ObtainAffordMedsComments = checklist.ObtainAffordMedsComments,
                ObtainAffordMedsNotApplicable = checklist.ObtainAffordMedsNotApplicable,
                PrepareMedCalendarInitiatedDate = checklist.PrepareMedCalendarInitiatedDate,
                PrepareMedCalendarCompletedDate = checklist.PrepareMedCalendarCompletedDate,
                PrepareMedCalendarComments = checklist.PrepareMedCalendarComments,
                PrepareMedCalendarNotApplicable = checklist.PrepareMedCalendarNotApplicable,
                TeachHighRiskMedsInitiatedDate = checklist.TeachHighRiskMedsInitiatedDate,
                TeachHighRiskMedsCompletedDate = checklist.TeachHighRiskMedsCompletedDate,
                TeachHighRiskMedsComments = checklist.TeachHighRiskMedsComments,
                TeachHighRiskMedsNotApplicable = checklist.TeachHighRiskMedsNotApplicable,
                OrderTeachVTEInitiatedDate = checklist.OrderTeachVTEInitiatedDate,
                OrderTeachVTECompletedDate = checklist.OrderTeachVTECompletedDate,
                OrderTeachVTEComments = checklist.OrderTeachVTEComments,
                OrderTeachVTENotApplicable = checklist.OrderTeachVTENotApplicable,
                DemonstrateAdminTechInitiatedDate = checklist.DemonstrateAdminTechInitiatedDate,
                DemonstrateAdminTechCompletedDate = checklist.DemonstrateAdminTechCompletedDate,
                DemonstrateAdminTechComments = checklist.DemonstrateAdminTechComments,
                DemonstrateAdminTechNotApplicable = checklist.DemonstrateAdminTechNotApplicable,
                FamilyAwareDischargeInitiatedDate = checklist.FamilyAwareDischargeInitiatedDate,
                FamilyAwareDischargeCompletedDate = checklist.FamilyAwareDischargeCompletedDate,
                FamilyAwareDischargeComments = checklist.FamilyAwareDischargeComments,
                FamilyAwareDischargeNotApplicable = checklist.FamilyAwareDischargeNotApplicable,
                EquipmentReadyInitiatedDate = checklist.EquipmentReadyInitiatedDate,
                EquipmentReadyCompletedDate = checklist.EquipmentReadyCompletedDate,
                EquipmentReadyComments = checklist.EquipmentReadyComments,
                EquipmentReadyNotApplicable = checklist.EquipmentReadyNotApplicable,
                CompletePASSInitiatedDate = checklist.CompletePASSInitiatedDate,
                CompletePASSCompletedDate = checklist.CompletePASSCompletedDate,
                CompletePASSComments = checklist.CompletePASSComments,
                CompletePASSNotApplicable = checklist.CompletePASSNotApplicable,
                CompleteTOAInitiatedDate = checklist.CompleteTOAInitiatedDate,
                CompleteTOACompletedDate = checklist.CompleteTOACompletedDate,
                CompleteTOAComments = checklist.CompleteTOAComments,
                CompleteTOANotApplicable = checklist.CompleteTOANotApplicable,
                ReturnValuablesInitiatedDate = checklist.ReturnValuablesInitiatedDate,
                ReturnValuablesCompletedDate = checklist.ReturnValuablesCompletedDate,
                ReturnValuablesComments = checklist.ReturnValuablesComments,
                ReturnValuablesNotApplicable = checklist.ReturnValuablesNotApplicable,
                ArrangeTransportationInitiatedDate = checklist.ArrangeTransportationInitiatedDate,
                ArrangeTransportationCompletedDate = checklist.ArrangeTransportationCompletedDate,
                ArrangeTransportationComments = checklist.ArrangeTransportationComments,
                ArrangeTransportationNotApplicable = checklist.ArrangeTransportationNotApplicable
            };

            return Ok(dto);
        }

        [HttpPut("{id}/dischargechecklist")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<PatientDischargeChecklistDTO>> CreateUpdateDischargeChecklist(int id, [FromBody] PatientDischargeChecklistDTO request)
        {

            DischargeChecklist checklist;

            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null) return NotFound("Patient not found");

            //Get nurse identity from claims
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
            {
                return Unauthorized("Nurse record not found.");
            }

            //Create a record for history
            var record = new Record
            {
                PatientId = id,
                RotationId = request.RotationId,
                NurseId = nurseId,
                CreatedDate = DateTime.Now
            };
            _context.Records.Add(record);
            await _context.SaveChangesAsync();

            //Update/Insert each lab entry
            //Check for existing checklist
            var existingChecklist = await _context.DischargeChecklists.FirstOrDefaultAsync(dc => dc.PatientId == id);

            if (existingChecklist != null)
            {
                checklist = existingChecklist;
                //UPDATE
                existingChecklist.TargetDischargeDate = request.TargetDischargeDate;
                existingChecklist.HighRiskDischarge = request.HighRiskDischarge;
                existingChecklist.CreateHomeChartInitiatedDate = request.CreateHomeChartInitiatedDate;
                existingChecklist.CreateHomeChartCompletedDate = request.CreateHomeChartCompletedDate;
                existingChecklist.CreateHomeChartComments = request.CreateHomeChartComments;
                existingChecklist.CreateHomeChartNotApplicable = request.CreateHomeChartNotApplicable;
                existingChecklist.ReturnHomeChartInitiatedDate = request.ReturnHomeChartInitiatedDate;
                existingChecklist.ReturnHomeChartCompletedDate = request.ReturnHomeChartCompletedDate;
                existingChecklist.ReturnHomeChartComments = request.ReturnHomeChartComments;
                existingChecklist.ReturnHomeChartNotApplicable = request.ReturnHomeChartNotApplicable;
                existingChecklist.NotifyPCNurseInitiatedDate = request.NotifyPCNurseInitiatedDate;
                existingChecklist.NotifyPCNurseCompletedDate = request.NotifyPCNurseCompletedDate;
                existingChecklist.NotifyPCNurseComments = request.NotifyPCNurseComments;
                existingChecklist.NotifyPCNurseNotApplicable = request.NotifyPCNurseNotApplicable;
                existingChecklist.NotifyContinuingCareInitiatedDate = request.NotifyContinuingCareInitiatedDate;
                existingChecklist.NotifyContinuingCareCompletedDate = request.NotifyContinuingCareCompletedDate;
                existingChecklist.NotifyContinuingCareComments = request.NotifyContinuingCareComments;
                existingChecklist.NotifyContinuingCareNotApplicable = request.NotifyContinuingCareNotApplicable;
                existingChecklist.FamilySupportInitiatedDate = request.FamilySupportInitiatedDate;
                existingChecklist.FamilySupportCompletedDate = request.FamilySupportCompletedDate;
                existingChecklist.FamilySupportComments = request.FamilySupportComments;
                existingChecklist.FamilySupportNotApplicable = request.FamilySupportNotApplicable;
                existingChecklist.GetAppointmentsInitiatedDate = request.GetAppointmentsInitiatedDate;
                existingChecklist.GetAppointmentsCompletedDate = request.GetAppointmentsCompletedDate;
                existingChecklist.GetAppointmentsComments = request.GetAppointmentsComments;
                existingChecklist.GetAppointmentsNotApplicable = request.GetAppointmentsNotApplicable;
                existingChecklist.ConsultGeriatricNavInitiatedDate = request.ConsultGeriatricNavInitiatedDate;
                existingChecklist.ConsultGeriatricNavCompletedDate = request.ConsultGeriatricNavCompletedDate;
                existingChecklist.ConsultGeriatricNavComments = request.ConsultGeriatricNavComments;
                existingChecklist.ConsultGeriatricNavNotApplicable = request.ConsultGeriatricNavNotApplicable;
                existingChecklist.ProvideFollowUpApptsInitiatedDate = request.ProvideFollowUpApptsInitiatedDate;
                existingChecklist.ProvideFollowUpApptsCompletedDate = request.ProvideFollowUpApptsCompletedDate;
                existingChecklist.ProvideFollowUpApptsComments = request.ProvideFollowUpApptsComments;
                existingChecklist.ProvideFollowUpApptsNotApplicable = request.ProvideFollowUpApptsNotApplicable;
                existingChecklist.ProvideRxInitiatedDate = request.ProvideRxInitiatedDate;
                existingChecklist.ProvideRxCompletedDate = request.ProvideRxCompletedDate;
                existingChecklist.ProvideRxComments = request.ProvideRxComments;
                existingChecklist.ProvideRxNotApplicable = request.ProvideRxNotApplicable;
                existingChecklist.AssessBlisterPackInitiatedDate = request.AssessBlisterPackInitiatedDate;
                existingChecklist.AssessBlisterPackCompletedDate = request.AssessBlisterPackCompletedDate;
                existingChecklist.AssessBlisterPackComments = request.AssessBlisterPackComments;
                existingChecklist.AssessBlisterPackNotApplicable = request.AssessBlisterPackNotApplicable;
                existingChecklist.ReturnOwnMedsInitiatedDate = request.ReturnOwnMedsInitiatedDate;
                existingChecklist.ReturnOwnMedsCompletedDate = request.ReturnOwnMedsCompletedDate;
                existingChecklist.ReturnOwnMedsComments = request.ReturnOwnMedsComments;
                existingChecklist.ReturnOwnMedsNotApplicable = request.ReturnOwnMedsNotApplicable;
                existingChecklist.ObtainAffordMedsInitiatedDate = request.ObtainAffordMedsInitiatedDate;
                existingChecklist.ObtainAffordMedsCompletedDate = request.ObtainAffordMedsCompletedDate;
                existingChecklist.ObtainAffordMedsComments = request.ObtainAffordMedsComments;
                existingChecklist.ObtainAffordMedsNotApplicable = request.ObtainAffordMedsNotApplicable;
                existingChecklist.PrepareMedCalendarInitiatedDate = request.PrepareMedCalendarInitiatedDate;
                existingChecklist.PrepareMedCalendarCompletedDate = request.PrepareMedCalendarCompletedDate;
                existingChecklist.PrepareMedCalendarComments = request.PrepareMedCalendarComments;
                existingChecklist.PrepareMedCalendarNotApplicable = request.PrepareMedCalendarNotApplicable;
                existingChecklist.TeachHighRiskMedsInitiatedDate = request.TeachHighRiskMedsInitiatedDate;
                existingChecklist.TeachHighRiskMedsCompletedDate = request.TeachHighRiskMedsCompletedDate;
                existingChecklist.TeachHighRiskMedsComments = request.TeachHighRiskMedsComments;
                existingChecklist.TeachHighRiskMedsNotApplicable = request.TeachHighRiskMedsNotApplicable;
                existingChecklist.OrderTeachVTEInitiatedDate = request.OrderTeachVTEInitiatedDate;
                existingChecklist.OrderTeachVTECompletedDate = request.OrderTeachVTECompletedDate;
                existingChecklist.OrderTeachVTEComments = request.OrderTeachVTEComments;
                existingChecklist.OrderTeachVTENotApplicable = request.OrderTeachVTENotApplicable;
                existingChecklist.DemonstrateAdminTechInitiatedDate = request.DemonstrateAdminTechInitiatedDate;
                existingChecklist.DemonstrateAdminTechCompletedDate = request.DemonstrateAdminTechCompletedDate;
                existingChecklist.DemonstrateAdminTechComments = request.DemonstrateAdminTechComments;
                existingChecklist.DemonstrateAdminTechNotApplicable = request.DemonstrateAdminTechNotApplicable;
                existingChecklist.FamilyAwareDischargeInitiatedDate = request.FamilyAwareDischargeInitiatedDate;
                existingChecklist.FamilyAwareDischargeCompletedDate = request.FamilyAwareDischargeCompletedDate;
                existingChecklist.FamilyAwareDischargeComments = request.FamilyAwareDischargeComments;
                existingChecklist.FamilyAwareDischargeNotApplicable = request.FamilyAwareDischargeNotApplicable;
                existingChecklist.EquipmentReadyInitiatedDate = request.EquipmentReadyInitiatedDate;
                existingChecklist.EquipmentReadyCompletedDate = request.EquipmentReadyCompletedDate;
                existingChecklist.EquipmentReadyComments = request.EquipmentReadyComments;
                existingChecklist.EquipmentReadyNotApplicable = request.EquipmentReadyNotApplicable;
                existingChecklist.CompletePASSInitiatedDate = request.CompletePASSInitiatedDate;
                existingChecklist.CompletePASSCompletedDate = request.CompletePASSCompletedDate;
                existingChecklist.CompletePASSComments = request.CompletePASSComments;
                existingChecklist.CompletePASSNotApplicable = request.CompletePASSNotApplicable;
                existingChecklist.CompleteTOAInitiatedDate = request.CompleteTOAInitiatedDate;
                existingChecklist.CompleteTOACompletedDate = request.CompleteTOACompletedDate;
                existingChecklist.CompleteTOAComments = request.CompleteTOAComments;
                existingChecklist.CompleteTOANotApplicable = request.CompleteTOANotApplicable;
                existingChecklist.ReturnValuablesInitiatedDate = request.ReturnValuablesInitiatedDate;
                existingChecklist.ReturnValuablesCompletedDate = request.ReturnValuablesCompletedDate;
                existingChecklist.ReturnValuablesComments = request.ReturnValuablesComments;
                existingChecklist.ReturnValuablesNotApplicable = request.ReturnValuablesNotApplicable;
                existingChecklist.ArrangeTransportationInitiatedDate = request.ArrangeTransportationInitiatedDate;
                existingChecklist.ArrangeTransportationCompletedDate = request.ArrangeTransportationCompletedDate;
                existingChecklist.ArrangeTransportationComments = request.ArrangeTransportationComments;
                existingChecklist.ArrangeTransportationNotApplicable = request.ArrangeTransportationNotApplicable;

                _context.Entry(existingChecklist).State = EntityState.Modified;
            }
            else
            {
                //INSERT
                checklist = new DischargeChecklist
                {
                    PatientId = id,
                    TargetDischargeDate = request.TargetDischargeDate,
                    HighRiskDischarge = request.HighRiskDischarge,
                    CreateHomeChartInitiatedDate = request.CreateHomeChartInitiatedDate,
                    CreateHomeChartCompletedDate = request.CreateHomeChartCompletedDate,
                    CreateHomeChartComments = request.CreateHomeChartComments,
                    CreateHomeChartNotApplicable = request.CreateHomeChartNotApplicable,
                    ReturnHomeChartInitiatedDate = request.ReturnHomeChartInitiatedDate,
                    ReturnHomeChartCompletedDate = request.ReturnHomeChartCompletedDate,
                    ReturnHomeChartComments = request.ReturnHomeChartComments,
                    ReturnHomeChartNotApplicable = request.ReturnHomeChartNotApplicable,
                    NotifyPCNurseInitiatedDate = request.NotifyPCNurseInitiatedDate,
                    NotifyPCNurseCompletedDate = request.NotifyPCNurseCompletedDate,
                    NotifyPCNurseComments = request.NotifyPCNurseComments,
                    NotifyPCNurseNotApplicable = request.NotifyPCNurseNotApplicable,
                    NotifyContinuingCareInitiatedDate = request.NotifyContinuingCareInitiatedDate,
                    NotifyContinuingCareCompletedDate = request.NotifyContinuingCareCompletedDate,
                    NotifyContinuingCareComments = request.NotifyContinuingCareComments,
                    NotifyContinuingCareNotApplicable = request.NotifyContinuingCareNotApplicable,
                    FamilySupportInitiatedDate = request.FamilySupportInitiatedDate,
                    FamilySupportCompletedDate = request.FamilySupportCompletedDate,
                    FamilySupportComments = request.FamilySupportComments,
                    FamilySupportNotApplicable = request.FamilySupportNotApplicable,
                    GetAppointmentsInitiatedDate = request.GetAppointmentsInitiatedDate,
                    GetAppointmentsCompletedDate = request.GetAppointmentsCompletedDate,
                    GetAppointmentsComments = request.GetAppointmentsComments,
                    GetAppointmentsNotApplicable = request.GetAppointmentsNotApplicable,
                    ConsultGeriatricNavInitiatedDate = request.ConsultGeriatricNavInitiatedDate,
                    ConsultGeriatricNavCompletedDate = request.ConsultGeriatricNavCompletedDate,
                    ConsultGeriatricNavComments = request.ConsultGeriatricNavComments,
                    ConsultGeriatricNavNotApplicable = request.ConsultGeriatricNavNotApplicable,
                    ProvideFollowUpApptsInitiatedDate = request.ProvideFollowUpApptsInitiatedDate,
                    ProvideFollowUpApptsCompletedDate = request.ProvideFollowUpApptsCompletedDate,
                    ProvideFollowUpApptsComments = request.ProvideFollowUpApptsComments,
                    ProvideFollowUpApptsNotApplicable = request.ProvideFollowUpApptsNotApplicable,
                    ProvideRxInitiatedDate = request.ProvideRxInitiatedDate,
                    ProvideRxCompletedDate = request.ProvideRxCompletedDate,
                    ProvideRxComments = request.ProvideRxComments,
                    ProvideRxNotApplicable = request.ProvideRxNotApplicable,
                    AssessBlisterPackInitiatedDate = request.AssessBlisterPackInitiatedDate,
                    AssessBlisterPackCompletedDate = request.AssessBlisterPackCompletedDate,
                    AssessBlisterPackComments = request.AssessBlisterPackComments,
                    AssessBlisterPackNotApplicable = request.AssessBlisterPackNotApplicable,
                    ReturnOwnMedsInitiatedDate = request.ReturnOwnMedsInitiatedDate,
                    ReturnOwnMedsCompletedDate = request.ReturnOwnMedsCompletedDate,
                    ReturnOwnMedsComments = request.ReturnOwnMedsComments,
                    ReturnOwnMedsNotApplicable = request.ReturnOwnMedsNotApplicable,
                    ObtainAffordMedsInitiatedDate = request.ObtainAffordMedsInitiatedDate,
                    ObtainAffordMedsCompletedDate = request.ObtainAffordMedsCompletedDate,
                    ObtainAffordMedsComments = request.ObtainAffordMedsComments,
                    ObtainAffordMedsNotApplicable = request.ObtainAffordMedsNotApplicable,
                    PrepareMedCalendarInitiatedDate = request.PrepareMedCalendarInitiatedDate,
                    PrepareMedCalendarCompletedDate = request.PrepareMedCalendarCompletedDate,
                    PrepareMedCalendarComments = request.PrepareMedCalendarComments,
                    PrepareMedCalendarNotApplicable = request.PrepareMedCalendarNotApplicable,
                    TeachHighRiskMedsInitiatedDate = request.TeachHighRiskMedsInitiatedDate,
                    TeachHighRiskMedsCompletedDate = request.TeachHighRiskMedsCompletedDate,
                    TeachHighRiskMedsComments = request.TeachHighRiskMedsComments,
                    TeachHighRiskMedsNotApplicable = request.TeachHighRiskMedsNotApplicable,
                    OrderTeachVTEInitiatedDate = request.OrderTeachVTEInitiatedDate,
                    OrderTeachVTECompletedDate = request.OrderTeachVTECompletedDate,
                    OrderTeachVTEComments = request.OrderTeachVTEComments,
                    OrderTeachVTENotApplicable = request.OrderTeachVTENotApplicable,
                    DemonstrateAdminTechInitiatedDate = request.DemonstrateAdminTechInitiatedDate,
                    DemonstrateAdminTechCompletedDate = request.DemonstrateAdminTechCompletedDate,
                    DemonstrateAdminTechComments = request.DemonstrateAdminTechComments,
                    DemonstrateAdminTechNotApplicable = request.DemonstrateAdminTechNotApplicable,
                    FamilyAwareDischargeInitiatedDate = request.FamilyAwareDischargeInitiatedDate,
                    FamilyAwareDischargeCompletedDate = request.FamilyAwareDischargeCompletedDate,
                    FamilyAwareDischargeComments = request.FamilyAwareDischargeComments,
                    FamilyAwareDischargeNotApplicable = request.FamilyAwareDischargeNotApplicable,
                    EquipmentReadyInitiatedDate = request.EquipmentReadyInitiatedDate,
                    EquipmentReadyCompletedDate = request.EquipmentReadyCompletedDate,
                    EquipmentReadyComments = request.EquipmentReadyComments,
                    EquipmentReadyNotApplicable = request.EquipmentReadyNotApplicable,
                    CompletePASSInitiatedDate = request.CompletePASSInitiatedDate,
                    CompletePASSCompletedDate = request.CompletePASSCompletedDate,
                    CompletePASSComments = request.CompletePASSComments,
                    CompletePASSNotApplicable = request.CompletePASSNotApplicable,
                    CompleteTOAInitiatedDate = request.CompleteTOAInitiatedDate,
                    CompleteTOACompletedDate = request.CompleteTOACompletedDate,
                    CompleteTOAComments = request.CompleteTOAComments,
                    CompleteTOANotApplicable = request.CompleteTOANotApplicable,
                    ReturnValuablesInitiatedDate = request.ReturnValuablesInitiatedDate,
                    ReturnValuablesCompletedDate = request.ReturnValuablesCompletedDate,
                    ReturnValuablesComments = request.ReturnValuablesComments,
                    ReturnValuablesNotApplicable = request.ReturnValuablesNotApplicable,
                    ArrangeTransportationInitiatedDate = request.ArrangeTransportationInitiatedDate,
                    ArrangeTransportationCompletedDate = request.ArrangeTransportationCompletedDate,
                    ArrangeTransportationComments = request.ArrangeTransportationComments,
                    ArrangeTransportationNotApplicable = request.ArrangeTransportationNotApplicable
                };
                _context.DischargeChecklists.Add(checklist);
            }
            
            await _context.SaveChangesAsync();

            //Handle AssessmentSubmission for history purposes
            var submission = new AssessmentSubmission
            {
                RecordId = record.RecordId,
                AssessmentTypeId = (int)AssessmentTypeEnum.DischargeChecklist,
                TableRecordId = checklist.DischargeChecklistId
            };
            _context.AssessmentSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(new { recordId = record.RecordId, message = "Discharge checklist updated successfully." });

        }

        [HttpGet("{id}/consults")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<PatientConsultDTO>>> GetConsults(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var pt = await GetScopedPatientAsync(id, campusId.Value);
            if (pt == null) return NotFound("Patient not found");

            var consults = await _context.Consults
                .Where(c => c.PatientId == id)
                .OrderBy(c => c.DateSent)
                .ToListAsync();
            
            return Ok(consults);
        }

        [HttpPut("{id}/consults")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<PatientConsultDTO>>> CreateUpdateConsults(int id, [FromBody] PatientConsultUpsertDTO request)
        {
            Consult lastConsult = null;
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
            {
                return Unauthorized("Campus not found for user.");
            }

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null) return NotFound("Patient not found");

            //Get nurse identity from claims
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
            {
                return Unauthorized("Nurse record not found.");
            }

            //Create a record for history
            var record = new Record
            {
                PatientId = id,
                RotationId = request.RotationId,
                NurseId = nurseId,
                CreatedDate = DateTime.Now
            };
            _context.Records.Add(record);
            await _context.SaveChangesAsync();

            //Update/Insert each lab entry
            foreach (var dto in request.Consults)
            {
                if (dto.ConsultId > 0)
                {
                    //UPDATE
                    var existing = await _context.Consults
                        .FirstOrDefaultAsync(c => c.ConsultId == dto.ConsultId && c.PatientId == id);

                    if (existing != null)
                    {
                        existing.ConsultType = dto.ConsultType;
                        existing.DateSent = dto.DateSent;
                        existing.DateReplied = dto.DateReplied;
                        existing.ConsultName = dto.ConsultName;

                        lastConsult = existing;
                    }
                }
                else
                {
                    //INSERT
                    var newConsult = new Consult
                    {
                        PatientId = id,
                        ConsultType = dto.ConsultType,
                        DateSent = dto.DateSent,
                        DateReplied = dto.DateReplied,
                        ConsultName = dto.ConsultName                        
                    };
                    _context.Consults.Add(newConsult);
                    lastConsult = newConsult;

                }
            }

            await _context.SaveChangesAsync();

            //Update current illness if provided
            if (request.CurrentIllness != null)
            {
                patient.CurrentIllness = request.CurrentIllness;
                _context.Entry(patient).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            //Handle AssessmentSubmission for history purposes
            var submission = new AssessmentSubmission
            {
                RecordId = record.RecordId,
                AssessmentTypeId = (int)AssessmentTypeEnum.ConsultCurrentIllness,
                TableRecordId = lastConsult.ConsultId
            };
            _context.AssessmentSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(new { recordId = record.RecordId, message = "Consults updated successfully." });
        }


        //TEMPORARY MAPPING FUNCTION
        //Map current frontend keys to RouteKey values that match the database
        private string? MapKeyToComponentKey(string key)
        {
            return key.ToLower() switch
            {
                "adl" => "ADL",
                "behaviour" => "Behaviour",
                "cognitive" => "Cognitive",
                "consult" => "Consult",
                "dischargechecklist" => "DischargeChecklist",
                "elimination" => "Elimination",
                "labsdiagnosticsblood" => "LabsDiagnosticsBlood",
                "news2" => "NEWS2",
                "nutrition" => "Nutrition",
                "skin" => "SkinSensoryAid",
                "progressnote" => "ProgressNote",
                "mobilityandsafety" => "MobilityAndSafety",
                "acuteprogress" => "AcuteProgress",
                _ => null
            };
        }

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
            {
                return adminCampusId.Value;
            }

            if (!TryGetNurseId(out int nurseId))
            {
                return null;
            }

            var nurse = await _context.Nurses
                .AsNoTracking()
                .Include(n => n.Class)
                .FirstOrDefaultAsync(n => n.NurseId == nurseId);

            if (nurse?.Class?.CampusId != null)
            {
                return nurse.Class.CampusId;
            }

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

        private async Task<Patient?> GetScopedPatientAsync(int patientId, int campusId)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(p => p.PatientId == patientId && p.CampusId == campusId);
        }

        private int? GetAdminCampusOverride()
        {
            if (!IsAdminUser())
            {
                return null;
            }

            if (Request.Headers.TryGetValue("X-Campus-Id", out var campusHeader) &&
                int.TryParse(campusHeader.FirstOrDefault(), out int campusIdFromHeader))
            {
                return campusIdFromHeader;
            }

            if (Request.Query.TryGetValue("campusId", out var campusQuery) &&
                int.TryParse(campusQuery.FirstOrDefault(), out int campusIdFromQuery))
            {
                return campusIdFromQuery;
            }

            return null;
        }

        private bool IsAdminUser()
        {
            if (User.IsInRole("Admin"))
            {
                return true;
            }

            return User.Claims.Any(c =>
                (c.Type == "roles" || c.Type == "role" || c.Type == ClaimTypes.Role) &&
                string.Equals(c.Value, "Admin", StringComparison.OrdinalIgnoreCase));
        }

        // GET: api/patients/{id}/doctororders
        [HttpGet("{id}/doctororders")]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<DoctorOrderDTO>>> GetDoctorOrders(int id)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            var orders = await _context.DoctorOrders
                .Where(o => o.PatientId == id)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            // Optionally join with nurse table for names
            var nurseIds = orders.Select(o => o.CreatedByNurseId).Concat(orders.Where(o => o.ReadByNurseId.HasValue).Select(o => o.ReadByNurseId.Value)).Distinct().ToList();
            var nurses = await _context.Nurses.Where(n => nurseIds.Contains(n.NurseId)).ToListAsync();

            var dtos = orders.Select(o => new DoctorOrderDTO
            {
                DoctorOrderId = o.DoctorOrderId,
                PatientId = o.PatientId,
                OrderText = o.OrderText,
                CreatedAt = o.CreatedAt,
                CreatedByNurseId = o.CreatedByNurseId,
                ReadAt = o.ReadAt,
                ReadByNurseId = o.ReadByNurseId,
                CreatedByName = nurses.FirstOrDefault(n => n.NurseId == o.CreatedByNurseId)?.FullName,
                ReadByName = o.ReadByNurseId.HasValue ? nurses.FirstOrDefault(n => n.NurseId == o.ReadByNurseId.Value)?.FullName : null
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/patients/{id}/doctororders
        [HttpPost("{id}/doctororders")]
        [Authorize(Roles = "Admin, Instructor")]
        public async Task<ActionResult<DoctorOrderDTO>> CreateDoctorOrder(int id, [FromBody] DoctorOrderUpsertDTO dto)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
                return Unauthorized("Nurse record not found.");


            // Use Atlantic Time for CreatedAt
            var atlanticZone = TimeZoneInfo.FindSystemTimeZoneById("Atlantic Standard Time");
            var atlanticNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, atlanticZone);
            var order = new DoctorOrder
            {
                PatientId = id,
                OrderText = dto.OrderText,
                CreatedAt = atlanticNow,
                CreatedByNurseId = nurseId
            };
            _context.DoctorOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new DoctorOrderDTO
            {
                DoctorOrderId = order.DoctorOrderId,
                PatientId = order.PatientId,
                OrderText = order.OrderText,
                CreatedAt = order.CreatedAt,
                CreatedByNurseId = order.CreatedByNurseId,
                CreatedByName = null // Optionally fill
            });
        }

        // PUT: api/patients/{id}/doctororders/{orderId}
        [HttpPut("{id}/doctororders/{orderId}")]
        [Authorize(Roles = "Admin, Instructor")]
        public async Task<ActionResult<DoctorOrderDTO>> UpdateDoctorOrder(int id, int orderId, [FromBody] DoctorOrderUpsertDTO dto)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            var order = await _context.DoctorOrders.FirstOrDefaultAsync(o => o.DoctorOrderId == orderId && o.PatientId == id);
            if (order == null)
                return NotFound("Order not found");

            order.OrderText = dto.OrderText;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new DoctorOrderDTO
            {
                DoctorOrderId = order.DoctorOrderId,
                PatientId = order.PatientId,
                OrderText = order.OrderText,
                CreatedAt = order.CreatedAt,
                CreatedByNurseId = order.CreatedByNurseId
            });
        }

        // POST: api/patients/{id}/doctororders/{orderId}/read
        [HttpPost("{id}/doctororders/{orderId}/read")]
        [Authorize(Roles = "Nurse, Student")]
        public async Task<ActionResult> MarkDoctorOrderRead(int id, int orderId)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            var order = await _context.DoctorOrders.FirstOrDefaultAsync(o => o.DoctorOrderId == orderId && o.PatientId == id);
            if (order == null)
                return NotFound("Order not found");

            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int nurseId))
                return Unauthorized("Nurse record not found.");

            // Use Atlantic Time for ReadAt
            var atlanticZone = TimeZoneInfo.FindSystemTimeZoneById("Atlantic Standard Time");
            order.ReadAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, atlanticZone);
            order.ReadByNurseId = nurseId;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/patients/{id}/doctororders/{orderId}
        [HttpDelete("{id}/doctororders/{orderId}")]
        [Authorize(Roles = "Admin, Instructor")]
        public async Task<ActionResult> DeleteDoctorOrder(int id, int orderId)
        {
            var campusId = await GetUserCampusIdAsync();
            if (campusId == null)
                return Unauthorized("Campus not found for user.");

            var patient = await GetScopedPatientAsync(id, campusId.Value);
            if (patient == null)
                return NotFound("Patient not found");

            var order = await _context.DoctorOrders.FirstOrDefaultAsync(o => o.DoctorOrderId == orderId && o.PatientId == id);
            if (order == null)
                return NotFound("Order not found");

            _context.DoctorOrders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}