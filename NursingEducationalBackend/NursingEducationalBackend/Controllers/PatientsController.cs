using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<ActionResult<IEnumerable<object>>> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        //GET: api/patients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);
            return Ok(patient);
        }

        //Create patient
        [HttpPost("create")]
        //[Authorize]
        public async Task<ActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (ModelState.IsValid)
            {
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
                _context.Records.Add(new Record { PatientId = patient.PatientId });
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
        //[Authorize]
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
        public async Task<ActionResult> SubmitData(int id, [FromBody] Dictionary<string, object> patientData)
        {
            PatientDataSubmissionHandler handler = new PatientDataSubmissionHandler();

            foreach (var entry in patientData)
            {
                var key = entry.Key;
                var value = entry.Value;

                var tableType = key.Split('-')[1];
                var patientIdFromTitle = int.TryParse(key.Split('-')[2], out int patientId) ? patientId : -1;

                var patient = await _context.Patients
                                .Include(p => p.Records)
                                .FirstOrDefaultAsync(p => p.PatientId == id);

                var record = patient.Records.FirstOrDefault();


                if (value != null)
                {
                    switch (tableType)
                    {
                        case "elimination":
                            handler.SubmitEliminationData(_context, value, record, patientIdFromTitle);
                            break;
                        case "mobility":
                            handler.SubmitMobilityData(_context, value, record, patientIdFromTitle);
                            break;
                        case "nutrition":
                            handler.SubmitNutritionData(_context, value, record, patientIdFromTitle);
                            break;
                        case "cognitive":
                            handler.SubmitCognitiveData(_context, value, record, patientIdFromTitle);
                            break;
                        case "safety":
                            handler.SubmitSafetyData(_context, value, record, patientIdFromTitle);
                            break;
                        case "adl":
                            handler.SubmitAdlData(_context, value, record, patientIdFromTitle);
                            break;
                        case "behaviour":
                            handler.SubmitBehaviourData(_context, value, record, patientIdFromTitle);
                            break;
                        case "progressnote":
                            handler.SubmitProgressNoteData(_context, value, record, patientIdFromTitle);
                            break;
                        case "skinsensoryaid":
                            handler.SubmitSkinAndSensoryAidData(_context, value, record, patientIdFromTitle);
                            break;
                        case "profile":
                            handler.SubmitProfileData(_context, value, patient);
                            break;
                    }
                }
            }

            return Ok();
        }


        // GET: api/Patients/nurse/patient/{id}/{tableType}
        [HttpGet("nurse/patient/{id}/{tableType}")]
        //[Authorize]
        public async Task<ActionResult<object>> GetPatientByTableForNurse(int id, string tableType)
        {
            // Get NurseId from claims
            //var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            //if (nurseIdClaim == null)
            //    return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            //int nurseId;
            //if (!int.TryParse(nurseIdClaim.Value, out nurseId))
            //    return BadRequest(new { message = "Invalid NurseId format" });


            // Get the patient - only if assigned to this nurse or unassigned
            var patient = await _context.Patients
                .Include(p => p.Records)
                .FirstOrDefaultAsync(p => p.PatientId == id); 
            //&& (p.NurseId == nurseId || p.NurseId == null));



            if (patient == null)
            {
                return NotFound();
            }

            int? tableId = null;
            if (patient.Records != null && patient.Records.Count != 0)
            {
                var record = patient.Records.FirstOrDefault();

                tableId = tableType.ToLower() switch
                {
                    "adl" => record.AdlsId,
                    "behaviour" => record.BehaviourId,
                    "cognitive" => record.CognitiveId,
                    "elimination" => record.EliminationId,
                    "mobility" => record.MobilityId,
                    "nutrition" => record.NutritionId,
                    "progressnote" => record.ProgressNoteId,
                    "safety" => record.SafetyId,
                    "skinandsensoryaid" => record.SkinId,
                    _ => null

                };
            }

            object tableData = null;
            if (tableId != null)
            {
                switch (tableType.ToLower())
                {
                    case "adl":
                        tableData = await _context.Adls.FirstOrDefaultAsync(a => a.AdlsId == tableId);
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
            }

            if (tableData == null)
            {
                return NotFound("Table not found");
            }

            return Ok(tableData);

        }
    }
}