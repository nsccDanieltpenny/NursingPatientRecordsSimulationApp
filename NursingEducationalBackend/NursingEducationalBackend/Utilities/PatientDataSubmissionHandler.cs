using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Utilities
{
    public class PatientDataSubmissionHandler
    {
        public async void SubmitEliminationData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());            
            var existingEntry = await _context.Eliminations.FindAsync(eliminationData.EliminationId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(eliminationData);
            }
            else
            {
                var eliminationEntity = new Elimination
                {
                    EliminationId = patientId,
                    IncontinentOfBladder = eliminationData.IncontinentOfBladder,
                    IncontinentOfBowel = eliminationData.IncontinentOfBowel,
                    DayOrNightProduct = eliminationData.DayOrNightProduct,
                    LastBowelMovement = eliminationData.LastBowelMovement,
                    BowelRoutine = eliminationData.BowelRoutine,
                    BladderRoutine = eliminationData.BladderRoutine,
                    CatheterInsertion = eliminationData.CatheterInsertion,
                    CatheterInsertionDate = eliminationData.CatheterInsertionDate
                };

                _context.Eliminations.Add(eliminationEntity);               
                record.EliminationId = eliminationEntity.EliminationId;
                
            }

            await _context.SaveChangesAsync();
            

        }

        public async void SubmitMobilityData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());            
            var existingEntry = await _context.Mobilities.FindAsync(mobilityData.MobilityId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(mobilityData);
            }
            else
            {
                var mobilityEntity = new Mobility
                {
                    MobilityId = patientId,
                    Transfer = mobilityData.Transfer,
                    Aids = mobilityData.Aids,
                    BedMobility = mobilityData.BedMobility
                };

                _context.Mobilities.Add(mobilityEntity);               
                record.MobilityId = mobilityEntity.MobilityId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitNutritionData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());            
            var existingEntry = await _context.Nutritions.FindAsync(nutritionData.NutritionId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(nutritionData);
            }
            else
            {
                var nutritionEntity = new Nutrition
                {
                    NutritionId = patientId,
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
                record.NutritionId = nutritionEntity.NutritionId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitCognitiveData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());           
            var existingEntry = await _context.Cognitives.FindAsync(cognitiveData.CognitiveId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(cognitiveData);
            }
            else
            {
                var cognitiveEntity = new Cognitive
                {
                    CognitiveId = patientId,
                    Speech = cognitiveData.Speech,
                    Loc = cognitiveData.Loc,
                    Mmse = cognitiveData.Mmse,
                    Confusion = cognitiveData.Confusion                      
                };

                _context.Cognitives.Add(cognitiveEntity);               
                record.CognitiveId = cognitiveEntity.CognitiveId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitSafetyData(NursingDbContext _context, object value,  Record record, int patientId)
        {
            var safetyData = JsonConvert.DeserializeObject<PatientSafetyDTO>(value.ToString());            
            var existingEntry = await _context.Safeties.FindAsync(safetyData.SafetyId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(safetyData);
            }
            else
            {
                var safetyEntity = new Safety
                {
                    SafetyId = patientId,
                    HipProtectors = safetyData.HipProtectors,
                    SideRails = safetyData.SideRails,
                    FallRiskScale = safetyData.FallRiskScale,
                    CrashMats = safetyData.CrashMats,
                    BedAlarm = safetyData.BedAlarm
                };

                _context.Safeties.Add(safetyEntity);               
                 record.SafetyId = safetyEntity.SafetyId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitAdlData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());            
            var existingEntry = await _context.Adls.FindAsync(adlData.AdlsId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(adlData);
            }
            else
            {
                var adlEntity = new Adl
                {
                    AdlsId = patientId,
                    BathDate = adlData.BathDate,
                    TubShowerOther = adlData.TubShowerOther,
                    TypeOfCare = adlData.TypeOfCare,
                    TurningSchedule = adlData.TurningSchedule,
                    Teeth = adlData.Teeth,
                    FootCare = adlData.FootCare,
                    HairCare = adlData.HairCare
                };

                _context.Adls.Add(adlEntity);               
                record.AdlsId = adlEntity.AdlsId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitBehaviourData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());            
            var existingEntry = await _context.Behaviours.FindAsync(behaviourData.BehaviourId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(behaviourData);
            }
            else
            {
                var behaviourEntity = new Behaviour
                {
                    BehaviourId = patientId,
                    Report = behaviourData.Report,
                   
                };

                _context.Behaviours.Add(behaviourEntity);               
                 record.BehaviourId = behaviourEntity.BehaviourId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitSkinAndSensoryAidData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());            
            var existingEntry = await _context.SkinAndSensoryAids.FindAsync(skinData.SkinAndSensoryAidsId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(skinData);
            }
            else
            {
                var skinAndSensoryAidsEntity = new SkinAndSensoryAid
                {
                    SkinAndSensoryAidsId = patientId,
                    Glasses = skinData.Glasses,
                    Hearing = skinData.Hearing,
                    SkinIntegrityPressureUlcerRisk = skinData.SkinIntegrityPressureUlcerRisk,
                    SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                    SkinIntegrityBradenScale = skinData.SkinIntegrityBradenScale,
                    SkinIntegrityDressings = skinData.SkinIntegrityDressings

                };

                _context.SkinAndSensoryAids.Add(skinAndSensoryAidsEntity);                
                 record.SkinId = skinAndSensoryAidsEntity.SkinAndSensoryAidsId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitProgressNoteData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());            
            var existingEntry = await _context.ProgressNotes.FindAsync(progressNoteData.ProgressNoteId);

            if (existingEntry != null)
            {
                _context.Entry(existingEntry).CurrentValues.SetValues(progressNoteData);
            }
            else
            {
                var progressNoteEntity = new ProgressNote
                {
                    ProgressNoteId = patientId,
                    Timestamp = progressNoteData.Timestamp,
                    Note = progressNoteData.Note
                };

                _context.ProgressNotes.Add(progressNoteEntity);               
                 record.ProgressNoteId = progressNoteEntity.ProgressNoteId;
                
            }

            await _context.SaveChangesAsync();
            
        }

        public async void SubmitProfileData(NursingDbContext _context, object value, Patient patient)
        {
            var profileData = JsonConvert.DeserializeObject<PatientProfileDTO>(value.ToString());           
            var existingEntry = await _context.Patients.FindAsync(patient.PatientId);          
            _context.Entry(existingEntry).CurrentValues.SetValues(profileData);          
            await _context.SaveChangesAsync();
            
        }
    }



    
}
