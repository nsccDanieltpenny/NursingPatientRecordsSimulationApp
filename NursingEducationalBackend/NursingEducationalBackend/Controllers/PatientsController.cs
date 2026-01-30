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
                .Select(ra => ra.AssessmentType.ComponentKey.ToLower())
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
                
                // Special handling for mobility and safety - both map to the same AssessmentType
                AssessmentType? assessmentType = null;
                if (assessmentKey == "mobility" || assessmentKey == "safety")
                {
                    assessmentType = await _context.AssessmentTypes
                        .FirstOrDefaultAsync(at => at.ComponentKey.ToLower().Contains("mobility") && at.ComponentKey.ToLower().Contains("safety"));
                    
                    // Check if this assessment type is allowed for the rotation
                    if (assessmentType != null && !allowedAssessments.Contains(assessmentType.ComponentKey.ToLower()))
                    {
                        continue;
                    }
                }
                else
                {
                    var componentKey = MapKeyToComponentKey(assessmentKey);
                    if (componentKey == null) continue;
                        
                    // Verify this is valid for this rotation
                    if (!allowedAssessments.Contains(componentKey.ToLower())) continue;

                    // Get the assessment type
                    assessmentType = await _context.AssessmentTypes
                        .FirstOrDefaultAsync(at => at.ComponentKey == componentKey);
                }
                
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


        // GET: api/Patients/history/{tableType}/{tableId}
        [HttpGet("history/{tableType}/{tableId}")]
        [Authorize]
        public async Task<ActionResult<object>> GetPatientByTableForNurse(string tableType, int tableId)
        {
            object tableData = null;
            switch (tableType.ToLower())
            {
                case "adl":
                    tableData = await _context.Adls.FirstOrDefaultAsync(a => a.AdlId == tableId);
                    break;
                case "behaviour":
                    tableData = await _context.Behaviours.FirstOrDefaultAsync(b => b.BehaviourId == tableId);
                    break;
                case "cognitive":
                    tableData = await _context.Cognitives.FirstOrDefaultAsync(c => c.CognitiveId == tableId);
                    break;
                case "elimination":
                    tableData = await _context.Eliminations.FirstOrDefaultAsync(e => e.EliminationId == tableId);
                    break;
                case "mobility":
                    tableData = await _context.Mobilities.FirstOrDefaultAsync(m => m.MobilityId == tableId);
                    break;
                case "nutrition":
                    tableData = await _context.Nutritions.FirstOrDefaultAsync(n => n.NutritionId == tableId);
                    break;
                case "progressnote":
                    tableData = await _context.ProgressNotes.FirstOrDefaultAsync(pn => pn.ProgressNoteId == tableId);
                    break;
                case "safety":
                    tableData = await _context.Safeties.FirstOrDefaultAsync(s => s.SafetyId == tableId);
                    break;
                case "skinandsensoryaid":
                    tableData = await _context.SkinAndSensoryAids.FirstOrDefaultAsync(s => s.SkinAndSensoryAidsId == tableId);
                    break;
                default:
                    return BadRequest(new { message = "Invalid table type" });
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
                .Select(r => new PatientHistoryRecordDTO
                {
                    RecordId = r.RecordId,
                    SubmittedDate = r.CreatedDate,
                    NurseId = r.NurseId,
                    SubmittedNurse = r.Nurse.FullName,
                })
                .ToListAsync();

            PatientHistoryDTO history = new PatientHistoryDTO
            {
                PatientId = id,
                PatientName = patient.FullName,
                History = patientRecords
            };

            return Ok(history);
        }

        //TEMPORARY MAPPING FUNCTION
        //Map current frontend keys to ComponentKey until I figure out a better way to handle these with dynamic lists
        private string MapKeyToComponentKey(string key)
        {
            return key.ToLower() switch
            {
                "adl" => "PatientADL",
                "behaviour" => "PatientBehaviour",
                "cognitive" => "PatientCognitive",
                "elimination" => "PatientElimination",
                "nutrition" => "PatientNutrition",
                "skin" => "PatientSkinSensoryAid",
                "progressnote" => "PatientProgressNote",
                "mobility" or "safety" => "PatientMobilityAndSafety",
                _ => null
            };
        }
    }
}