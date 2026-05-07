using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System.Reflection;

using AdlDto = NursingEducationalBackend.DTOs.PatientAdlDTO;
using BehaviourDto = NursingEducationalBackend.DTOs.PatientBehaviourDTO;
using CognitiveDto = NursingEducationalBackend.DTOs.PatientCognitiveDTO;
using EliminationDto = NursingEducationalBackend.DTOs.PatientEliminationDTO;
using NutritionDto = NursingEducationalBackend.DTOs.PatientNutritionDTO;
using ProgressNoteDto = NursingEducationalBackend.DTOs.PatientProgressNoteDTO;
using SkinDto = NursingEducationalBackend.DTOs.PatientSkinDTO;

using AdlEntity = NursingEducationalBackend.Models.Adl;
using BehaviourEntity = NursingEducationalBackend.Models.Behaviour;
using CognitiveEntity = NursingEducationalBackend.Models.Cognitive;
using EliminationEntity = NursingEducationalBackend.Models.Elimination;
using NutritionEntity = NursingEducationalBackend.Models.Nutrition;
using ProgressNoteEntity = NursingEducationalBackend.Models.ProgressNote;
using SkinEntity = NursingEducationalBackend.Models.SkinAndSensoryAid;

using AcuteProgressDto = NursingEducationalBackend.DTOs.Assessments.PatientAcuteProgressDTO;
using MobilityAndSafetyDto = NursingEducationalBackend.DTOs.Assessments.PatientMobilityAndSafetyDTO;
using News2Dto = NursingEducationalBackend.DTOs.Assessments.PatientNEWS2DTO;
using AcuteProgressEntity = NursingEducationalBackend.Models.Assessments.AcuteProgress;
using MobilityAndSafetyEntity = NursingEducationalBackend.Models.Assessments.MobilityAndSafety;
using News2Entity = NursingEducationalBackend.Models.Assessments.NEWS2;

namespace NursingEducationalBackend.Utilities
{
    public class PatientDataSubmissionHandler
    {
        private static T? DeserializeOrNull<T>(object value) where T : class
        {
            var raw = value?.ToString();
            if (string.IsNullOrWhiteSpace(raw))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<T>(raw);
        }

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
                case AssessmentTypeEnum.NEWS2:
                    tableRecordId = await SubmitNEWS2Data(context, value);
                    break;
            }

            submission.TableRecordId = tableRecordId;
            await context.SaveChangesAsync();
        }

        private async Task<int> SubmitAdlData(NursingDbContext context, object value)
        {
            var adlData = DeserializeOrNull<AdlDto>(value);
            if (adlData == null)
            {
                return 0;
            }

            var adlEntity = new AdlEntity
            {
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
            
            return adlEntity.AdlId;
        }

        private async Task<int> SubmitBehaviourData(NursingDbContext context, object value)
        {
            var behaviourData = DeserializeOrNull<BehaviourDto>(value);
            if (behaviourData == null)
            {
                return 0;
            }

            var behaviourEntity = new BehaviourEntity
            {
                Report = behaviourData.Report
            };

            context.Behaviours.Add(behaviourEntity);
            await context.SaveChangesAsync();
            
            return behaviourEntity.BehaviourId;
        }

        private async Task<int> SubmitCognitiveData(NursingDbContext context, object value)
        {
            var cognitiveData = DeserializeOrNull<CognitiveDto>(value);
            if (cognitiveData == null)
            {
                return 0;
            }

            var cognitiveEntity = new CognitiveEntity
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
            var eliminationData = DeserializeOrNull<EliminationDto>(value);
            if (eliminationData == null)
            {
                return 0;
            }

            var eliminationEntity = new EliminationEntity
            {
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
            
            return eliminationEntity.EliminationId;
        }

        private async Task<int> SubmitMobilitySafetyData(NursingDbContext context, object value)
        {
            var mobilityAndSafetyData = DeserializeOrNull<MobilityAndSafetyDto>(value);
            if (mobilityAndSafetyData == null)
            {
                return 0;
            }

            var mobilityAndSafetyEntity = new MobilityAndSafetyEntity
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

        private async Task<int> SubmitNEWS2Data(NursingDbContext context, object value)
        {
            var data = DeserializeOrNull<News2Dto>(value);
            if (data == null)
            {
                return 0;
            }

            var entry = new News2Entity
            {
                RespirationRate = data.RespirationRate,
                SpO2Scale1 = data.SpO2Scale1,
                SpO2Scale2 = data.SpO2Scale2,
                OnOxygen = data.OnOxygen,
                OxygenFlowRate = data.OxygenFlowRate,
                OxygenDevice = data.OxygenDevice,
                BPSystolic = data.BPSystolic,
                BPDiastolic = data.BPDiastolic,
                PulseBPM = data.PulseBPM,
                Consciousness = data.Consciousness,
                TemperatureC = data.TemperatureC,
                TotalScore = data.TotalScore,
                MonitoringFrequency = data.MonitoringFrequency,
                EscalationOfCare = data.EscalationOfCare
            };

            context.NEWS2s.Add(entry);
            await context.SaveChangesAsync();

            return entry.News2Id;
        }


        private async Task<int> SubmitNutritionData(NursingDbContext context, object value)
        {
            var nutritionData = DeserializeOrNull<NutritionDto>(value);
            if (nutritionData == null)
            {
                return 0;
            }

            var nutritionEntity = new NutritionEntity
            {
                Diet = nutritionData.Diet,
                Assist = nutritionData.Assist,
                Intake = nutritionData.Intake,
                Weight = nutritionData.Weight,
                Date = nutritionData.Date,
                Time = nutritionData.Time,
                Method = nutritionData.Method,
                DietarySupplementInfo = nutritionData.DietarySupplementInfo,
                IvSolutionRate = nutritionData.IvSolutionRate,
                SpecialNeeds = nutritionData.SpecialNeeds,
            };

            context.Nutritions.Add(nutritionEntity);
            await context.SaveChangesAsync();
            
            return nutritionEntity.NutritionId;
        }

        private async Task<int> SubmitAcuteProgressData(NursingDbContext context, object value)
        {
            var progressData = DeserializeOrNull<AcuteProgressDto>(value);
            if (progressData == null)
            {
                return 0;
            }

            var progressEntity = new AcuteProgressEntity
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
            var progressNoteData = DeserializeOrNull<ProgressNoteDto>(value);
            if (progressNoteData == null)
            {
                return 0;
            }

            var progressNoteEntity = new ProgressNoteEntity
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
            var skinData = DeserializeOrNull<SkinDto>(value);
            if (skinData == null)
            {
                return 0;
            }

            var skinEntity = new SkinEntity
            {
                Glasses = skinData.Glasses,
                Hearing = skinData.Hearing,
                SkinIntegrityPressureUlcerRisk = skinData.SkinIntegrityPressureUlcerRisk,
                SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                SkinIntegrityBradenScale = skinData.SkinIntegrityBradenScale,
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
