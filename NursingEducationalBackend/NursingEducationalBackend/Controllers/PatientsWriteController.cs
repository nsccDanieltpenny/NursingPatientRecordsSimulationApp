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
            foreach (var entry in patientData)
            {
                var key = entry.Key;
                var value = entry.Value;

                var patientPrefix = key.Split('-')[1];  // nutrition, mobility, elimination
                var patientSuffix = int.TryParse(key.Split('-')[2], out int patientId) ? patientId : -1;

                if (patientSuffix != id)
                {
                    continue;
                }

                // Handle Elimination Data
                if (patientPrefix == "elimination" && value != null)
                {
                    var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());
                    if (eliminationData != null)
                    {
                        var existingEntry = await _context.Eliminations.FindAsync(eliminationData.EliminationId);

                        if (existingEntry != null)
                        {
                            _context.Entry(existingEntry).CurrentValues.SetValues(eliminationData);
                        }
                        else
                        {
                            var eliminationEntity = new Elimination
                            {
                                EliminationId = eliminationData.EliminationId,
                                IncontinentOfBladder = eliminationData.IncontinentOfBladder,
                                IncontinentOfBowel = eliminationData.IncontinentOfBowel,
                                DayOrNightProduct = eliminationData.DayOrNightProduct,
                                LastBowelMovement = (eliminationData.LastBowelMovement),
                                BowelRoutine = eliminationData.BowelRoutine,
                                BladderRoutine = eliminationData.BladderRoutine,
                                CatheterInsertion = eliminationData.CatheterInsertion
                            };

                            _context.Eliminations.Add(eliminationEntity);

                            var patient = await _context.Patients
                                .Include(p => p.Records)
                                .FirstOrDefaultAsync(p => p.PatientId == id);

                            var record = patient?.Records.FirstOrDefault();
                            if (record != null)
                            {
                                record.EliminationId = eliminationEntity.EliminationId;
                            }
                        }

                        await _context.SaveChangesAsync();
                    }
                }

                // Handle Mobility Data
                else if (patientPrefix == "mobility" && value != null)
                {
                    var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());
                    if (mobilityData != null)
                    {
                        var existingEntry = await _context.Mobilities.FindAsync(mobilityData.MobilityId);

                        if (existingEntry != null)
                        {
                            _context.Entry(existingEntry).CurrentValues.SetValues(mobilityData);
                        }
                        else
                        {
                            var mobilityEntity = new Mobility
                            {
                                MobilityId = mobilityData.MobilityId,
                                Transfer = mobilityData.Transfer,
                                Aids = mobilityData.Aids,
                                BedMobility = mobilityData.BedMobility
                            };

                            _context.Mobilities.Add(mobilityEntity);

                            var patient = await _context.Patients
                                .Include(p => p.Records)
                                .FirstOrDefaultAsync(p => p.PatientId == id);

                            var record = patient?.Records.FirstOrDefault();
                            if (record != null)
                            {
                                record.MobilityId = mobilityEntity.MobilityId;
                            }
                        }

                        await _context.SaveChangesAsync();
                    }
                }

                // Handle Nutrition Data
                else if (patientPrefix == "nutrition" && value != null)
                {
                    var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());
                    if (nutritionData != null)
                    {
                        var existingEntry = await _context.Nutritions.FindAsync(nutritionData.NutritionId);

                        if (existingEntry != null)
                        {
                            _context.Entry(existingEntry).CurrentValues.SetValues(nutritionData);
                        }
                        else
                        {
                            var nutritionEntity = new Nutrition
                            {
                                NutritionId = nutritionData.NutritionId,
                                Diet = nutritionData.Diet,
                                Assit = nutritionData.Assit,
                                Intake = nutritionData.Intake,
                                Time = nutritionData.Time,
                                DietarySupplementInfo = nutritionData.DietarySupplementInfo,
                                Weight = nutritionData.Weight,
                                Date = nutritionData.Date,
                                Method = nutritionData.Method,
                                IvSolutionRate = nutritionData.IvSolutionRate,
                                SpecialNeeds = nutritionData.SpecialNeeds
                            };

                            _context.Nutritions.Add(nutritionEntity);

                            var patient = await _context.Patients
                                .Include(p => p.Records)
                                .FirstOrDefaultAsync(p => p.PatientId == id);

                            var record = patient?.Records.FirstOrDefault();
                            if (record != null)
                            {
                                record.NutritionId = nutritionEntity.NutritionId;
                            }
                        }

                        await _context.SaveChangesAsync();
                    }
                }
            }

            return Ok();
        }
    }
}