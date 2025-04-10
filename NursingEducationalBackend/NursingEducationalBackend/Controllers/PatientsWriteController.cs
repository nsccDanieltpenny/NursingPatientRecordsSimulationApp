using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Utilities;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/patients")]
    [ApiController]
    //[Authorize]
    public class PatientsWriteController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public PatientsWriteController(NursingDbContext context)
        {
            _context = context;
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

                var patientPrefix = key.Split('-')[1];
                var patientSuffix = int.TryParse(key.Split('-')[2], out int patientId) ? patientId : -1;

                var patient = await _context.Patients
                                .Include(p => p.Records)
                                .FirstOrDefaultAsync(p => p.PatientId == id);

                var record = patient.Records.FirstOrDefault();


                if (value != null)
                {
                    switch (patientPrefix)
                    {
                        case "elimination":
                            handler.SubmitEliminationData(_context, value, record);
                            break;
                        case "mobility":
                            handler.SubmitMobilityData(_context, value, record);
                            break;
                        case "nutrition":
                            handler.SubmitNutritionData(_context, value, record);
                            break;
                        case "cognitive":
                            handler.SubmitCognitiveData(_context, value, record);
                            break;
                        case "safety":
                            handler.SubmitSafetyData(_context, value, record);
                            break;
                        case "adl":
                            handler.SubmitAdlData(_context, value, record);
                            break;
                        case "behaviour":
                            handler.SubmitBehaviourData(_context, value, record);
                            break;
                        case "progressnote":
                            handler.SubmitProgressNoteData(_context, value, record);
                            break;
                        case "skinandsensoryaid":
                            handler.SubmitSkinAndSensoryAidData(_context, value, record);
                            break;
                        case "profile":
                            handler.SubmitProfileData(_context, value, patient);
                            break;
                        default:
                            break;
                    }
                }
            }

            return Ok();
        }
    }
}