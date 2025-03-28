using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;
using System.Collections.Generic;
using System.Linq;
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

        // GET: api/Patients/admin/ids
        [HttpGet("admin/ids")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientIds()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        // GET: api/Patients/nurse/ids
        [HttpGet("nurse/ids")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Patient>>> GetNursePatientIds()
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int nurseId;
            if (!int.TryParse(nurseIdClaim.Value, out nurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            // Get patients assigned to this nurse OR have NULL NurseId
            var patients = await _context.Patients
                                      .Where(p => p.NurseId == nurseId || p.NurseId == null)
                                      .ToListAsync();

            return Ok(patients);
        }

        // GET: api/Patients/admin/patient/{id}/cognitive
        [HttpGet("admin/patient/{id}/cognitive")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> GetPatientWithCognitive(int id)
        {
            // Get the patient
            var patient = await _context.Patients
                                    .Include(p => p.Records)
                                    .FirstOrDefaultAsync(p => p.PatientId == id);
            if (patient == null)
            {
                return NotFound();
            }

            // Prepare result object
            var result = new
            {
                Patient = patient,
                CognitiveData = new List<object>()
            };

            // Collect all Cognitive data for this patient
            if (patient.Records != null && patient.Records.Any())
            {
                foreach (var record in patient.Records)
                {
                    if (record.CognitiveId.HasValue)
                    {
                        var cognitive = await _context.Cognitives
                                              .FindAsync(record.CognitiveId.Value);
                        if (cognitive != null)
                        {
                            var cognitiveEntry = new
                            {
                                RecordId = record.RecordId,
                                Cognitive = cognitive
                            };
                            ((List<object>)result.CognitiveData).Add(cognitiveEntry);
                        }
                    }
                }
            }

            return Ok(result);
        }

        // GET: api/Patients/nurse/patient/{id}/cognitive
        [HttpGet("nurse/patient/{id}/cognitive")]
        [Authorize]
        public async Task<ActionResult<object>> GetPatientWithCognitiveForNurse(int id)
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int nurseId;
            if (!int.TryParse(nurseIdClaim.Value, out nurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            // Get the patient - only if assigned to this nurse or unassigned
            var patient = await _context.Patients
                                    .Include(p => p.Records)
                                    .FirstOrDefaultAsync(p => p.PatientId == id &&
                                                          (p.NurseId == nurseId || p.NurseId == null));
            if (patient == null)
            {
                return NotFound();
            }

            // Prepare result object
            var result = new
            {
                Patient = patient,
                CognitiveData = new List<object>()
            };

            // Collect all Cognitive data for this patient
            if (patient.Records != null && patient.Records.Any())
            {
                foreach (var record in patient.Records)
                {
                    if (record.CognitiveId.HasValue)
                    {
                        var cognitive = await _context.Cognitives
                                              .FindAsync(record.CognitiveId.Value);
                        if (cognitive != null)
                        {
                            var cognitiveEntry = new
                            {
                                RecordId = record.RecordId,
                                Cognitive = cognitive
                            };
                            ((List<object>)result.CognitiveData).Add(cognitiveEntry);
                        }
                    }
                }
            }

            return Ok(result);
        }

        // GET: api/Patients/nurse/patient/{id}/assessments
        [HttpGet("nurse/patient/{id}/assessments")]
        [Authorize]
        public async Task<ActionResult<object>> GetPatientWithAllAssessments(int id)
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int nurseId;
            if (!int.TryParse(nurseIdClaim.Value, out nurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            // Get the patient - only if assigned to this nurse or unassigned
            var patient = await _context.Patients
                                    .Include(p => p.Records)
                                    .FirstOrDefaultAsync(p => p.PatientId == id &&
                                                          (p.NurseId == nurseId || p.NurseId == null));
            if (patient == null)
            {
                return NotFound();
            }

            // Prepare result object with collections for all assessment types
            var result = new
            {
                Patient = patient,
                CognitiveData = new List<object>(),
                NutritionData = new List<object>(),
                EliminationData = new List<object>(),
                MobilityData = new List<object>(),
                SafetyData = new List<object>(),
                AdlData = new List<object>(),
                SkinData = new List<object>(),
                BehaviourData = new List<object>(),
                ProgressNoteData = new List<object>()
            };

            // Process all records for this patient
            if (patient.Records != null && patient.Records.Any())
            {
                foreach (var record in patient.Records)
                {
                    // Manually fetch each assessment type through appropriate repositories or methods
                    // For example, you could use a service that knows how to fetch these entities

                    // Get Cognitive data
                    if (record.CognitiveId.HasValue)
                    {
                        var cognitiveAssessment = await GetAssessmentById(record.CognitiveId.Value, "Cognitive");
                        if (cognitiveAssessment != null)
                        {
                            ((List<object>)result.CognitiveData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = cognitiveAssessment
                            });
                        }
                    }

                    // Get Nutrition data
                    if (record.NutritionId.HasValue)
                    {
                        var nutritionAssessment = await GetAssessmentById(record.NutritionId.Value, "Nutrition");
                        if (nutritionAssessment != null)
                        {
                            ((List<object>)result.NutritionData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = nutritionAssessment
                            });
                        }
                    }

                    // Get Elimination data
                    if (record.EliminationId.HasValue)
                    {
                        var eliminationAssessment = await GetAssessmentById(record.EliminationId.Value, "Elimination");
                        if (eliminationAssessment != null)
                        {
                            ((List<object>)result.EliminationData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = eliminationAssessment
                            });
                        }
                    }

                    // Get Mobility data
                    if (record.MobilityId.HasValue)
                    {
                        var mobilityAssessment = await GetAssessmentById(record.MobilityId.Value, "Mobility");
                        if (mobilityAssessment != null)
                        {
                            ((List<object>)result.MobilityData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = mobilityAssessment
                            });
                        }
                    }

                    // Get Safety data
                    if (record.SafetyId.HasValue)
                    {
                        var safetyAssessment = await GetAssessmentById(record.SafetyId.Value, "Safety");
                        if (safetyAssessment != null)
                        {
                            ((List<object>)result.SafetyData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = safetyAssessment
                            });
                        }
                    }

                    // Get ADL data
                    if (record.AdlsId.HasValue)
                    {
                        var adlAssessment = await GetAssessmentById(record.AdlsId.Value, "Adl");
                        if (adlAssessment != null)
                        {
                            ((List<object>)result.AdlData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = adlAssessment
                            });
                        }
                    }

                    // Get Skin data
                    if (record.SkinId.HasValue)
                    {
                        var skinAssessment = await GetAssessmentById(record.SkinId.Value, "SkinAndSensoryAid");
                        if (skinAssessment != null)
                        {
                            ((List<object>)result.SkinData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = skinAssessment
                            });
                        }
                    }

                    // Get Behaviour data
                    if (record.BehaviourId.HasValue)
                    {
                        var behaviourAssessment = await GetAssessmentById(record.BehaviourId.Value, "Behaviour");
                        if (behaviourAssessment != null)
                        {
                            ((List<object>)result.BehaviourData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = behaviourAssessment
                            });
                        }
                    }

                    // Get Progress Note data
                    if (record.ProgressNoteId.HasValue)
                    {
                        var progressNoteAssessment = await GetAssessmentById(record.ProgressNoteId.Value, "ProgressNote");
                        if (progressNoteAssessment != null)
                        {
                            ((List<object>)result.ProgressNoteData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = progressNoteAssessment
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        // GET: api/Patients/admin/patient/{id}/assessments
        [HttpGet("admin/patient/{id}/assessments")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> GetPatientWithAllAssessmentsForAdmin(int id)
        {
            // Get the patient
            var patient = await _context.Patients
                                    .Include(p => p.Records)
                                    .FirstOrDefaultAsync(p => p.PatientId == id);
            if (patient == null)
            {
                return NotFound();
            }

            // Prepare result object with collections for all assessment types
            var result = new
            {
                Patient = patient,
                CognitiveData = new List<object>(),
                NutritionData = new List<object>(),
                EliminationData = new List<object>(),
                MobilityData = new List<object>(),
                SafetyData = new List<object>(),
                AdlData = new List<object>(),
                SkinData = new List<object>(),
                BehaviourData = new List<object>(),
                ProgressNoteData = new List<object>()
            };

            // Process all records for this patient
            if (patient.Records != null && patient.Records.Any())
            {
                foreach (var record in patient.Records)
                {
                    // Get Cognitive data
                    if (record.CognitiveId.HasValue)
                    {
                        var cognitiveAssessment = await GetAssessmentById(record.CognitiveId.Value, "Cognitive");
                        if (cognitiveAssessment != null)
                        {
                            ((List<object>)result.CognitiveData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = cognitiveAssessment
                            });
                        }
                    }

                    // Get Nutrition data
                    if (record.NutritionId.HasValue)
                    {
                        var nutritionAssessment = await GetAssessmentById(record.NutritionId.Value, "Nutrition");
                        if (nutritionAssessment != null)
                        {
                            ((List<object>)result.NutritionData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = nutritionAssessment
                            });
                        }
                    }

                    // Get Elimination data
                    if (record.EliminationId.HasValue)
                    {
                        var eliminationAssessment = await GetAssessmentById(record.EliminationId.Value, "Elimination");
                        if (eliminationAssessment != null)
                        {
                            ((List<object>)result.EliminationData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = eliminationAssessment
                            });
                        }
                    }

                    // Get Mobility data
                    if (record.MobilityId.HasValue)
                    {
                        var mobilityAssessment = await GetAssessmentById(record.MobilityId.Value, "Mobility");
                        if (mobilityAssessment != null)
                        {
                            ((List<object>)result.MobilityData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = mobilityAssessment
                            });
                        }
                    }

                    // Get Safety data
                    if (record.SafetyId.HasValue)
                    {
                        var safetyAssessment = await GetAssessmentById(record.SafetyId.Value, "Safety");
                        if (safetyAssessment != null)
                        {
                            ((List<object>)result.SafetyData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = safetyAssessment
                            });
                        }
                    }

                    // Get ADL data
                    if (record.AdlsId.HasValue)
                    {
                        var adlAssessment = await GetAssessmentById(record.AdlsId.Value, "Adl");
                        if (adlAssessment != null)
                        {
                            ((List<object>)result.AdlData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = adlAssessment
                            });
                        }
                    }

                    // Get Skin data
                    if (record.SkinId.HasValue)
                    {
                        var skinAssessment = await GetAssessmentById(record.SkinId.Value, "SkinAndSensoryAid");
                        if (skinAssessment != null)
                        {
                            ((List<object>)result.SkinData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = skinAssessment
                            });
                        }
                    }

                    // Get Behaviour data
                    if (record.BehaviourId.HasValue)
                    {
                        var behaviourAssessment = await GetAssessmentById(record.BehaviourId.Value, "Behaviour");
                        if (behaviourAssessment != null)
                        {
                            ((List<object>)result.BehaviourData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = behaviourAssessment
                            });
                        }
                    }

                    // Get Progress Note data
                    if (record.ProgressNoteId.HasValue)
                    {
                        var progressNoteAssessment = await GetAssessmentById(record.ProgressNoteId.Value, "ProgressNote");
                        if (progressNoteAssessment != null)
                        {
                            ((List<object>)result.ProgressNoteData).Add(new
                            {
                                RecordId = record.RecordId,
                                Assessment = progressNoteAssessment
                            });
                        }
                    }
                }
            }

            return Ok(result);
        }

        // Helper method to get assessment by ID and type
        private async Task<object> GetAssessmentById(int id, string assessmentType)
        {
            // Use reflection or a switch case to get the appropriate entity
            switch (assessmentType)
            {
                case "Cognitive":
                    return await _context.Set<Cognitive>().FindAsync(id);
                case "Nutrition":
                    return await _context.Set<Nutrition>().FindAsync(id);
                case "Elimination":
                    return await _context.Set<Elimination>().FindAsync(id);
                case "Mobility":
                    return await _context.Set<Mobility>().FindAsync(id);
                case "Safety":
                    return await _context.Set<Safety>().FindAsync(id);
                case "Adl":
                    return await _context.Set<Adl>().FindAsync(id);
                case "SkinAndSensoryAid":
                    return await _context.Set<SkinAndSensoryAid>().FindAsync(id);
                case "Behaviour":
                    return await _context.Set<Behaviour>().FindAsync(id);
                case "ProgressNote":
                    return await _context.Set<ProgressNote>().FindAsync(id);
                default:
                    return null;
            }
        }
    }
}