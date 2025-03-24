using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientCreateController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public PatientCreateController(NursingDbContext context)
        {
            _context = context;
        }

        public class PatientCreateRequest
        {
            // Patient data
            public Patient Patient { get; set; }

            // Behaviour data
            public string BehaviourReport { get; set; }

            // ADL data
            public Adl Adl { get; set; }

            // Cognitive data
            public Cognitive Cognitive { get; set; }

            // Elimination data
            public Elimination Elimination { get; set; }

            // Mobility data
            public Mobility Mobility { get; set; }

            // Nutrition data
            public Nutrition Nutrition { get; set; }

            // Progress Note data
            public ProgressNote ProgressNote { get; set; }

            // Safety data
            public Safety Safety { get; set; }

            // Skin and Sensory Aid data
            public SkinAndSensoryAid SkinAndSensoryAid { get; set; }
        }

        // POST: api/PatientCreate
        [HttpPost]
        public async Task<ActionResult<object>> Create(PatientCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate required patient fields
            if (string.IsNullOrEmpty(request.Patient.FullName) ||
                string.IsNullOrEmpty(request.Patient.Sex) ||
                string.IsNullOrEmpty(request.Patient.PatientWristId) ||
                string.IsNullOrEmpty(request.Patient.NextOfKin) ||
                string.IsNullOrEmpty(request.Patient.Height) ||
                string.IsNullOrEmpty(request.Patient.Allergies) ||
                string.IsNullOrEmpty(request.Patient.IsolationPrecautions))
            {
                return BadRequest("Missing required patient information");
            }

            // Validate behaviour report
            if (string.IsNullOrEmpty(request.BehaviourReport))
            {
                return BadRequest("Behaviour report is required");
            }

            // Validate ADL data
            if (request.Adl == null ||
                string.IsNullOrEmpty(request.Adl.TubShowerOther) ||
                string.IsNullOrEmpty(request.Adl.TypeOfCare) ||
                string.IsNullOrEmpty(request.Adl.TurningSchedule) ||
                string.IsNullOrEmpty(request.Adl.Teeth) ||
                string.IsNullOrEmpty(request.Adl.FootCare) ||
                string.IsNullOrEmpty(request.Adl.HairCare))
            {
                return BadRequest("ADL information is required");
            }

            // Validate Cognitive data
            if (request.Cognitive == null ||
                string.IsNullOrEmpty(request.Cognitive.Speech))
            {
                return BadRequest("Cognitive information is required");
            }

            // Validate Elimination data
            if (request.Elimination == null ||
                string.IsNullOrEmpty(request.Elimination.IncontinentOfBladder) ||
                string.IsNullOrEmpty(request.Elimination.IncontinentOfBowel) ||
                string.IsNullOrEmpty(request.Elimination.DayOrNightProduct) ||
                string.IsNullOrEmpty(request.Elimination.BowelRoutine) ||
                string.IsNullOrEmpty(request.Elimination.BladderRoutine) ||
                string.IsNullOrEmpty(request.Elimination.CatheterInsertion))
            {
                return BadRequest("Elimination information is required");
            }

            // Validate Mobility data
            if (request.Mobility == null ||
                string.IsNullOrEmpty(request.Mobility.Transfer) ||
                string.IsNullOrEmpty(request.Mobility.Aids) ||
                string.IsNullOrEmpty(request.Mobility.BedMobility))
            {
                return BadRequest("Mobility information is required");
            }

            // Validate Nutrition data
            if (request.Nutrition == null ||
                string.IsNullOrEmpty(request.Nutrition.Diet) ||
                string.IsNullOrEmpty(request.Nutrition.Assit) ||
                string.IsNullOrEmpty(request.Nutrition.Intake) ||
                string.IsNullOrEmpty(request.Nutrition.Time) ||
                string.IsNullOrEmpty(request.Nutrition.DietarySupplementInfo) ||
                string.IsNullOrEmpty(request.Nutrition.Method) ||
                string.IsNullOrEmpty(request.Nutrition.IvSolutionRate) ||
                string.IsNullOrEmpty(request.Nutrition.SpecialNeeds))
            {
                return BadRequest("Nutrition information is required");
            }

            // Validate Progress Note data
            if (request.ProgressNote == null ||
                string.IsNullOrEmpty(request.ProgressNote.Note))
            {
                return BadRequest("Progress note information is required");
            }

            // Validate Safety data
            if (request.Safety == null ||
                string.IsNullOrEmpty(request.Safety.HipProtectors) ||
                string.IsNullOrEmpty(request.Safety.SideRails) ||
                string.IsNullOrEmpty(request.Safety.FallRiskScale) ||
                string.IsNullOrEmpty(request.Safety.CrashMats) ||
                string.IsNullOrEmpty(request.Safety.BedAlarm))
            {
                return BadRequest("Safety information is required");
            }

            // Validate Skin and Sensory Aid data
            if (request.SkinAndSensoryAid == null ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.Glasses) ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.Hearing) ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.SkinIntegrityPressureUlcerRisk) ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.SkinIntegrityTurningSchedule) ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.SkinIntegrityBradenScale) ||
                string.IsNullOrEmpty(request.SkinAndSensoryAid.SkinIntegrityDressings))
            {
                return BadRequest("Skin and sensory aid information is required");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Set PatientId by finding the next available ID
                int nextPatientId = 1;
                if (_context.Patients.Any())
                {
                    nextPatientId = await _context.Patients.MaxAsync(p => p.PatientId) + 1;
                }
                request.Patient.PatientId = nextPatientId;

                // 2. Add patient to database
                // Ensure NurseId is not set
                request.Patient.NurseId = null;
                _context.Patients.Add(request.Patient);
                await _context.SaveChangesAsync();

                // 3. Create behaviour record
                var behaviour = new Behaviour
                {
                    Report = request.BehaviourReport
                };

                // Check if Behaviours DbSet exists
                if (_context.Behaviours == null)
                {
                    return StatusCode(500, "Behaviours DbSet is not configured in the database context");
                }

                _context.Behaviours.Add(behaviour);
                await _context.SaveChangesAsync();

                // 4. Add ADL information
                // Check if ADLs DbSet exists
                if (_context.Adls == null)
                {
                    return StatusCode(500, "Adls DbSet is not configured in the database context");
                }

                // Find next ADL ID
                int nextAdlId = 1;
                if (_context.Adls.Any())
                {
                    nextAdlId = await _context.Adls.MaxAsync(a => a.AdlsId) + 1;
                }
                request.Adl.AdlsId = nextAdlId;

                _context.Adls.Add(request.Adl);
                await _context.SaveChangesAsync();

                // 5. Add Cognitive information
                // Check if Cognitive DbSet exists
                if (_context.Cognitives == null)
                {
                    return StatusCode(500, "Cognitives DbSet is not configured in the database context");
                }

                // Find next Cognitive ID
                int nextCognitiveId = 1;
                if (_context.Cognitives.Any())
                {
                    nextCognitiveId = await _context.Cognitives.MaxAsync(c => c.CognitiveId) + 1;
                }
                request.Cognitive.CognitiveId = nextCognitiveId;

                _context.Cognitives.Add(request.Cognitive);
                await _context.SaveChangesAsync();

                // 6. Add Elimination information
                // Check if Elimination DbSet exists
                if (_context.Eliminations == null)
                {
                    return StatusCode(500, "Eliminations DbSet is not configured in the database context");
                }

                // Find next Elimination ID
                int nextEliminationId = 1;
                if (_context.Eliminations.Any())
                {
                    nextEliminationId = await _context.Eliminations.MaxAsync(e => e.EliminationId) + 1;
                }
                request.Elimination.EliminationId = nextEliminationId;

                _context.Eliminations.Add(request.Elimination);
                await _context.SaveChangesAsync();

                // 7. Add Mobility information
                // Check if Mobility DbSet exists
                if (_context.Mobilities == null)
                {
                    return StatusCode(500, "Mobilities DbSet is not configured in the database context");
                }

                // Find next Mobility ID
                int nextMobilityId = 1;
                if (_context.Mobilities.Any())
                {
                    nextMobilityId = await _context.Mobilities.MaxAsync(m => m.MobilityId) + 1;
                }
                request.Mobility.MobilityId = nextMobilityId;

                _context.Mobilities.Add(request.Mobility);
                await _context.SaveChangesAsync();

                // 8. Add Nutrition information
                // Check if Nutrition DbSet exists
                if (_context.Nutritions == null)
                {
                    return StatusCode(500, "Nutritions DbSet is not configured in the database context");
                }

                // Find next Nutrition ID
                int nextNutritionId = 1;
                if (_context.Nutritions.Any())
                {
                    nextNutritionId = await _context.Nutritions.MaxAsync(n => n.NutritionId) + 1;
                }
                request.Nutrition.NutritionId = nextNutritionId;

                _context.Nutritions.Add(request.Nutrition);
                await _context.SaveChangesAsync();

                // 9. Add Progress Note information
                // Check if ProgressNotes DbSet exists
                if (_context.ProgressNotes == null)
                {
                    return StatusCode(500, "ProgressNotes DbSet is not configured in the database context");
                }

                // Find next Progress Note ID
                int nextProgressNoteId = 1;
                if (_context.ProgressNotes.Any())
                {
                    nextProgressNoteId = await _context.ProgressNotes.MaxAsync(p => p.ProgressNoteId) + 1;
                }
                request.ProgressNote.ProgressNoteId = nextProgressNoteId;

                // Set timestamp to current time if not specified
                if (request.ProgressNote.Timestamp == default)
                {
                    request.ProgressNote.Timestamp = DateTime.Now;
                }

                _context.ProgressNotes.Add(request.ProgressNote);
                await _context.SaveChangesAsync();

                // 10. Add Safety information
                // Check if Safety DbSet exists
                if (_context.Safeties == null)
                {
                    return StatusCode(500, "Safeties DbSet is not configured in the database context");
                }

                // Find next Safety ID
                int nextSafetyId = 1;
                if (_context.Safeties.Any())
                {
                    nextSafetyId = await _context.Safeties.MaxAsync(s => s.SafetyId) + 1;
                }
                request.Safety.SafetyId = nextSafetyId;

                _context.Safeties.Add(request.Safety);
                await _context.SaveChangesAsync();

                // 11. Add Skin and Sensory Aid information
                // Check if SkinAndSensoryAids DbSet exists
                if (_context.SkinAndSensoryAids == null)
                {
                    return StatusCode(500, "SkinAndSensoryAids DbSet is not configured in the database context");
                }

                // Find next Skin and Sensory Aid ID
                int nextSkinId = 1;
                if (_context.SkinAndSensoryAids.Any())
                {
                    nextSkinId = await _context.SkinAndSensoryAids.MaxAsync(s => s.SkinAndSensoryAidsId) + 1;
                }
                request.SkinAndSensoryAid.SkinAndSensoryAidsId = nextSkinId;

                _context.SkinAndSensoryAids.Add(request.SkinAndSensoryAid);
                await _context.SaveChangesAsync();

                // 12. Create record entry to link patient with all other entities
                var record = new Record
                {
                    PatientId = request.Patient.PatientId,
                    BehaviourId = behaviour.BehaviourId,
                    AdlsId = request.Adl.AdlsId,
                    CognitiveId = request.Cognitive.CognitiveId,
                    EliminationId = request.Elimination.EliminationId,
                    MobilityId = request.Mobility.MobilityId,
                    NutritionId = request.Nutrition.NutritionId,
                    ProgressNoteId = request.ProgressNote.ProgressNoteId,
                    SafetyId = request.Safety.SafetyId,
                    SkinId = request.SkinAndSensoryAid.SkinAndSensoryAidsId
                };

                // Find next record ID
                int nextRecordId = 1;
                if (_context.Records.Any())
                {
                    nextRecordId = await _context.Records.MaxAsync(r => r.RecordId) + 1;
                }
                record.RecordId = nextRecordId;

                _context.Records.Add(record);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // Return all created entities to confirm successful creation
                return Created($"api/Patients/{request.Patient.PatientId}", new
                {
                    patient = request.Patient,
                    behaviour = behaviour,
                    adl = request.Adl,
                    cognitive = request.Cognitive,
                    elimination = request.Elimination,
                    mobility = request.Mobility,
                    nutrition = request.Nutrition,
                    progressNote = request.ProgressNote,
                    safety = request.Safety,
                    skinAndSensoryAid = request.SkinAndSensoryAid,
                    record = record
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Return more detailed error information
                return StatusCode(500, $"Internal server error: {ex.Message}\nStack trace: {ex.StackTrace}");
            }
        }
    }
}