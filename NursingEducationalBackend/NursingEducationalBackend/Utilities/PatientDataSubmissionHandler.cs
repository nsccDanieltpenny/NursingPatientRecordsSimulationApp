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

            switch (assessmentTypeId)
            {
                case 1: //ADL
                    await SubmitAdlData(context, value, submission);
                    break;
                case 2: //Behaviour
                    await SubmitBehaviourData(context, value, submission);
                    break;
                case 3: //Cognitive
                    await SubmitCognitiveData(context, value, submission);
                    break;
                case 4: //Elimination
                    await SubmitEliminationData(context, value, submission);
                    break;
                case 5: //Mobility/Safety
                    await SubmitMobilitySafetyData(context, value, submission);
                    break;
                case 6: //Nutrition
                    await SubmitNutritionData(context, value, submission);
                    break;
                case 7: //Progress Note
                    await SubmitProgressNoteData(context, value, submission);
                    break;
                case 8: //Skin and Sensory Aid
                    await SubmitSkinSensoryData(context, value, submission);
                    break;
            }
        }

        private async Task SubmitAdlData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());
            var adlEntity = new Adl
            {
                AssessmentSubmissionId = submission.Id,
                BathDate = adlData.BathDate,
                TubShowerOther = adlData.TubShowerOther,
                TypeOfCare = adlData.TypeOfCare,
                TurningSchedule = adlData.TurningSchedule,
                Teeth = adlData.Teeth,
                FootCare = adlData.FootCare,
                HairCare = adlData.HairCare
            };

            context.Adls.Add(adlEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitBehaviourData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());
            var behaviourEntity = new Behaviour
            {
                AssessmentSubmissionId = submission.Id,
                Report = behaviourData.Report
            };

            context.Behaviours.Add(behaviourEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitCognitiveData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());
            var cognitiveEntity = new Cognitive
            {
                AssessmentSubmissionId = submission.Id,
                Speech = cognitiveData.Speech,
                Loc = cognitiveData.Loc,
                Mmse = cognitiveData.Mmse,
                Confusion = cognitiveData.Confusion
            };

            context.Cognitives.Add(cognitiveEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitEliminationData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());
            var eliminationEntity = new Elimination
            {
                AssessmentSubmissionId = submission.Id,
                IncontinentOfBladder = eliminationData.IncontinentOfBladder,
                IncontinentOfBowel = eliminationData.IncontinentOfBowel,
                DayOrNightProduct = eliminationData.DayOrNightProduct,
                LastBowelMovement = eliminationData.LastBowelMovement,
                BowelRoutine = eliminationData.BowelRoutine,
                BladderRoutine = eliminationData.BladderRoutine,
                CatheterInsertionDate = eliminationData.CatheterInsertionDate,
                CatheterInsertion = eliminationData.CatheterInsertion
            };

            context.Eliminations.Add(eliminationEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitMobilitySafetyData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            // Try to deserialize as Mobility first
            try
            {
                var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());
                if (mobilityData != null && (mobilityData.Transfer != null || mobilityData.Aids != null || mobilityData.BedMobility != null))
                {
                    var mobilityEntity = new Mobility
                    {
                        AssessmentSubmissionId = submission.Id,
                        Transfer = mobilityData.Transfer,
                        Aids = mobilityData.Aids,
                        BedMobility = mobilityData.BedMobility
                    };

                    context.Mobilities.Add(mobilityEntity);
                    await context.SaveChangesAsync();
                    return;
                }
            }
            catch { }

            // Try to deserialize as Safety
            try
            {
                var safetyData = JsonConvert.DeserializeObject<PatientSafetyDTO>(value.ToString());
                if (safetyData != null)
                {
                    var safetyEntity = new Safety
                    {
                        AssessmentSubmissionId = submission.Id,
                        HipProtectors = safetyData.HipProtectors,
                        SideRails = safetyData.SideRails,
                        FallRiskScale = safetyData.FallRiskScale,
                        CrashMats = safetyData.CrashMats,
                        BedAlarm = safetyData.BedAlarm
                    };

                    context.Safeties.Add(safetyEntity);
                    await context.SaveChangesAsync();
                }
            }
            catch { }
        }
        private async Task SubmitNutritionData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());
            var nutritionEntity = new Nutrition
            {
                AssessmentSubmissionId = submission.Id,
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

            context.Nutritions.Add(nutritionEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitProgressNoteData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());
            var progressNoteEntity = new ProgressNote
            {
                AssessmentSubmissionId = submission.Id,
                Timestamp = progressNoteData.Timestamp,
                Note = progressNoteData.Note
            };

            context.ProgressNotes.Add(progressNoteEntity);
            await context.SaveChangesAsync();
        }
        private async Task SubmitSkinSensoryData(NursingDbContext context, object value, AssessmentSubmission submission)
        {
            var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());
            var skinEntity = new SkinAndSensoryAid
            {
                AssessmentSubmissionId = submission.Id,
                Glasses = skinData.Glasses,
                Hearing = skinData.Hearing,
                SkinIntegrityPressureUlcerRisk = skinData.SkinIntegrityPressureUlcerRisk,
                SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                SkinIntegrityBradenScale = skinData.SkinIntegrityBradenScale,
                SkinIntegrityDressings = skinData.SkinIntegrityDressings
            };

            context.SkinAndSensoryAids.Add(skinEntity);
            await context.SaveChangesAsync();
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
