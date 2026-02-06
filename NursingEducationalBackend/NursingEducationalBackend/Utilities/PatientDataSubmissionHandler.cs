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
        public async Task SubmitAssessmentData(NursingDbContext context, object value, Record record, int assessmentTypeId, int patientId)
        {
            //Create the base submission
            var submission = new AssessmentSubmission
            {
                RecordId = record.RecordId,
                AssessmentTypeId = assessmentTypeId
            };

            context.AssessmentSubmissions.Add(submission);
            await context.SaveChangesAsync();

            int tableRecordId = 0;

            switch ((AssessmentTypeEnum)assessmentTypeId)
            {
                case AssessmentTypeEnum.ADL:
                    tableRecordId = await SubmitAdlData(context, value);
                    break;
                case AssessmentTypeEnum.Behaviour:
                    tableRecordId = await SubmitBehaviourData(context, value);
                    break;
                case AssessmentTypeEnum.Cognitive:
                    tableRecordId = await SubmitCognitiveData(context, value);
                    break;
                case AssessmentTypeEnum.Elimination:
                    tableRecordId = await SubmitEliminationData(context, value);
                    break;
                case AssessmentTypeEnum.MobilityAndSafety:
                    tableRecordId = await SubmitMobilitySafetyData(context, value);
                    break;
                case AssessmentTypeEnum.Nutrition:
                    tableRecordId = await SubmitNutritionData(context, value);
                    break;
                case AssessmentTypeEnum.ProgressNote:
                    tableRecordId = await SubmitProgressNoteData(context, value);
                    break;
                case AssessmentTypeEnum.SkinAndSensoryAid:
                    tableRecordId = await SubmitSkinSensoryData(context, value);
                    break;
                case AssessmentTypeEnum.AcuteProgress:
                    tableRecordId = await SubmitAcuteProgressData(context, value);
                    break;
            }

            submission.TableRecordId = tableRecordId;
            await context.SaveChangesAsync();
        }

        private async Task<int> SubmitAdlData(NursingDbContext context, object value)
        {
            var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());
            var adlEntity = new Adl
            {
                BathDate = adlData.BathDate,
                TubShowerOther = adlData.TubShowerOther,
                TypeOfCare = adlData.TypeOfCare,
                Turning = adlData.Turning,
                TurningFrequency = adlData.TurningFrequency,
                Teeth = adlData.Teeth,
                DentureType = adlData.DentureType,
                MouthCare = adlData.MouthCare,
                FootCare = adlData.FootCare,
                HairCare = adlData.HairCare
            };

            context.Adls.Add(adlEntity);
            await context.SaveChangesAsync();
            
            return adlEntity.AdlId;
        }

        private async Task<int> SubmitBehaviourData(NursingDbContext context, object value)
        {
            var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());
            var behaviourEntity = new Behaviour
            {
                Report = behaviourData.Report
            };

            context.Behaviours.Add(behaviourEntity);
            await context.SaveChangesAsync();
            
            return behaviourEntity.BehaviourId;
        }

        private async Task<int> SubmitCognitiveData(NursingDbContext context, object value)
        {
            var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());
            var cognitiveEntity = new Cognitive
            {
                Speech = cognitiveData.Speech,
                Loc = cognitiveData.Loc,
                Mmse = cognitiveData.Mmse,
                Confusion = cognitiveData.Confusion
            };

            context.Cognitives.Add(cognitiveEntity);
            await context.SaveChangesAsync();
            
            return cognitiveEntity.CognitiveId;
        }

        private async Task<int> SubmitEliminationData(NursingDbContext context, object value)
        {
            var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());
            var eliminationEntity = new Elimination
            {
                DayOrNightProduct = eliminationData.DayOrNightProduct,
                LastBowelMovement = eliminationData.LastBowelMovement,
                Routine = eliminationData.Routine,
                CatheterInsertionDate = eliminationData.CatheterInsertionDate,
                CatheterInsertion = eliminationData.CatheterInsertion,
                CatheterSize = eliminationData.CatheterSize
            };

            context.Eliminations.Add(eliminationEntity);
            await context.SaveChangesAsync();
            
            return eliminationEntity.EliminationId;
        }

        private async Task<int> SubmitMobilitySafetyData(NursingDbContext context, object value)
        {
            var mobilityAndSafetyData = JsonConvert.DeserializeObject<PatientMobilityAndSafetyDTO>(value.ToString());
            var mobilityAndSafetyEntity = new MobilityAndSafety
            {
                Transfer = mobilityAndSafetyData.Transfer,
                Aids = mobilityAndSafetyData.Aids,
                HipProtectors = mobilityAndSafetyData.HipProtectors,
                SideRails = mobilityAndSafetyData.SideRails,
                FallRiskScale = mobilityAndSafetyData.FallRiskScale,
                CrashMats = mobilityAndSafetyData.CrashMats,
                BedAlarm = mobilityAndSafetyData.BedAlarm
            };

            context.MobilityAndSafeties.Add(mobilityAndSafetyEntity);
            await context.SaveChangesAsync();
            
            return mobilityAndSafetyEntity.MobilityAndSafetyId;
        }

        private async Task<int> SubmitNutritionData(NursingDbContext context, object value)
        {
            var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());
            var nutritionEntity = new Nutrition
            {
                Diet = nutritionData.Diet,
                Assist = nutritionData.Assist,
                Intake = nutritionData.Intake,
                Weight = nutritionData.Weight,
                Date = nutritionData.Date,
                Method = nutritionData.Method,
                SpecialNeeds = nutritionData.SpecialNeeds,
                FeedingTube = nutritionData.FeedingTube,
                FeedingTubeDate = nutritionData.FeedingTubeDate,
                NGTube = nutritionData.NGTube,
                NGTubeDate = nutritionData.NGTubeDate
            };

            context.Nutritions.Add(nutritionEntity);
            await context.SaveChangesAsync();
            
            return nutritionEntity.NutritionId;
        }

        private async Task<int> SubmitAcuteProgressData(NursingDbContext context, object value)
        {
            var progressData = JsonConvert.DeserializeObject<PatientAcuteProgressDTO>(value.ToString());
            var progressEntity = new AcuteProgress
            {
                Timestamp = progressData.Timestamp,
                Note = progressData.Note,
                Treatment = progressData.Treatment,
                Procedures = progressData.Procedures,
                SpecialInstructions = progressData.SpecialInstructions
            };

            context.AcuteProgresses.Add(progressEntity);
            await context.SaveChangesAsync();

            return progressEntity.AcuteProgressId;
        }

        private async Task<int> SubmitProgressNoteData(NursingDbContext context, object value)
        {
            var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());
            var progressNoteEntity = new ProgressNote
            {
                Timestamp = progressNoteData.Timestamp,
                Note = progressNoteData.Note
            };

            context.ProgressNotes.Add(progressNoteEntity);
            await context.SaveChangesAsync();
            
            return progressNoteEntity.ProgressNoteId;
        }

        private async Task<int> SubmitSkinSensoryData(NursingDbContext context, object value)
        {
            var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());
            var skinEntity = new SkinAndSensoryAid
            {
                SkinIntegrity = skinData.SkinIntegrity,
                SkinIntegrityFrequency = skinData.SkinIntegrityFrequency,
                Glasses = skinData.Glasses,
                Hearing = skinData.Hearing,
                HearingAidSide = skinData.HearingAidSide,
                PressureUlcerRisk = skinData.PressureUlcerRisk,
                SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                TurningScheduleFrequency = skinData.TurningScheduleFrequency,
                SkinIntegrityDressings = skinData.SkinIntegrityDressings
            };

            context.SkinAndSensoryAids.Add(skinEntity);
            await context.SaveChangesAsync();
            
            return skinEntity.SkinAndSensoryAidsId;
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
