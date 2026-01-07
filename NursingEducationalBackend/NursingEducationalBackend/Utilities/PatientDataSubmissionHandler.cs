using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System.Reflection;

namespace NursingEducationalBackend.Utilities
{
    public class PatientDataSubmissionHandler
    {
        public async Task SubmitEliminationData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());

            var eliminationEntity = new Elimination
            {
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
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.EliminationId = eliminationEntity.EliminationId;
            await _context.SaveChangesAsync();
            

        }

        public async Task SubmitMobilityData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());            
            var existingEntry = await _context.Mobilities.FindAsync(patientId);

            var mobilityEntity = new Mobility
            {
                Transfer = mobilityData.Transfer,
                Aids = mobilityData.Aids,
                BedMobility = mobilityData.BedMobility
            };

            _context.Mobilities.Add(mobilityEntity);

            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.MobilityId = mobilityEntity.MobilityId;         
            await _context.SaveChangesAsync();
        }

        public async Task SubmitNutritionData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());
            var nutritionEntity = new Nutrition
            {
                Diet = nutritionData.Diet,
                Assist = nutritionData.Assist,
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
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.NutritionId = nutritionEntity.NutritionId;
            await _context.SaveChangesAsync();
            
        }

        public async Task SubmitCognitiveData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());
            var cognitiveEntity = new Cognitive
            {
                Speech = cognitiveData.Speech,
                Loc = cognitiveData.Loc,
                Mmse = cognitiveData.Mmse,
                Confusion = cognitiveData.Confusion                      
            };

            _context.Cognitives.Add(cognitiveEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.CognitiveId = cognitiveEntity.CognitiveId;
            await _context.SaveChangesAsync();            
        }

        public async Task SubmitSafetyData(NursingDbContext _context, object value,  Record record, int patientId)
        {
            var safetyData = JsonConvert.DeserializeObject<PatientSafetyDTO>(value.ToString());            
            var existingEntry = await _context.Safeties.FindAsync(patientId);

            var safetyEntity = new Safety
            {
                HipProtectors = safetyData.HipProtectors,
                SideRails = safetyData.SideRails,
                FallRiskScale = safetyData.FallRiskScale,
                CrashMats = safetyData.CrashMats,
                BedAlarm = safetyData.BedAlarm
            };

            _context.Safeties.Add(safetyEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.SafetyId = safetyEntity.SafetyId;
            await _context.SaveChangesAsync();            
        }

        public async Task SubmitAdlData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());
            var adlEntity = new Adl
            {
                BathDate = adlData.BathDate,
                TubShowerOther = adlData.TubShowerOther,
                TypeOfCare = adlData.TypeOfCare,
                TurningSchedule = adlData.TurningSchedule,
                Teeth = adlData.Teeth,
                FootCare = adlData.FootCare,
                HairCare = adlData.HairCare
            };

            _context.Adls.Add(adlEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.AdlId = adlEntity.AdlId;
            await _context.SaveChangesAsync();            
        }

        public async Task SubmitBehaviourData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());
            var behaviourEntity = new Behaviour
            {
                Report = behaviourData.Report,
                   
            };

            _context.Behaviours.Add(behaviourEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.BehaviourId = behaviourEntity.BehaviourId;
            await _context.SaveChangesAsync();
        }

        public async Task SubmitSkinAndSensoryAidData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());
            var skinAndSensoryAidsEntity = new SkinAndSensoryAid
            {
                Glasses = skinData.Glasses,
                Hearing = skinData.Hearing,
                SkinIntegrityPressureUlcerRisk = skinData.SkinIntegrityPressureUlcerRisk,
                SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                SkinIntegrityBradenScale = skinData.SkinIntegrityBradenScale,
                SkinIntegrityDressings = skinData.SkinIntegrityDressings

            };

            _context.SkinAndSensoryAids.Add(skinAndSensoryAidsEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.SkinId = skinAndSensoryAidsEntity.SkinAndSensoryAidsId;
            await _context.SaveChangesAsync();
            
        }

        public async Task SubmitProgressNoteData(NursingDbContext _context, object value, Record record, int patientId)
        {
            var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());
            var progressNoteEntity = new ProgressNote
            {
                Timestamp = progressNoteData.Timestamp,
                Note = progressNoteData.Note
            };

            _context.ProgressNotes.Add(progressNoteEntity);
            //Save the new item so that we have an id to store in the record.
            await _context.SaveChangesAsync();

            record.ProgressNoteId = progressNoteEntity.ProgressNoteId;
            await _context.SaveChangesAsync();            
        }

        public async Task SubmitProfileData(NursingDbContext _context, object value, Patient patient)
        {
            var profileData = JsonConvert.DeserializeObject<PatientProfileDTO>(value.ToString());           
            var existingEntry = await _context.Patients.FindAsync(patient.PatientId);
            if (existingEntry == null) return;

            Type dtoType = typeof(PatientProfileDTO);
            Type entityType = typeof(Patient);

            foreach (PropertyInfo dtoProperty in dtoType.GetProperties())
            {
                var newVal = dtoProperty.GetValue(profileData);

                //Ignore nulls and 0001-01-01 dates
                if (newVal == null) continue;
                if (newVal is DateOnly dateValue && dateValue == DateOnly.MinValue) continue;

                PropertyInfo entityProperty = entityType.GetProperty(dtoProperty.Name);
                if (entityProperty != null && entityProperty.CanWrite)
                {
                    entityProperty.SetValue(existingEntry, newVal);
                }

                await _context.SaveChangesAsync();
            }
        }
    }



    
}
