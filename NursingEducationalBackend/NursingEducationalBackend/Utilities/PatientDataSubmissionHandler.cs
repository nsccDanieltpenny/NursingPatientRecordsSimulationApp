using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Utilities
{
    public class PatientDataSubmissionHandler
    {
        private const int MinBedNumber = 0;
        private const int MaxBedNumber = 15;

        // Helper method to validate bed number
        private void ValidateBedNumber(int? bedNumber)
        {
            if (bedNumber.HasValue && (bedNumber < MinBedNumber || bedNumber > MaxBedNumber))
            {
                throw new InvalidOperationException($"Bed number must be between {MinBedNumber} and {MaxBedNumber}.");
            }
        }

        public async Task SubmitEliminationData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());            
                var existingEntry = await _context.Eliminations.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(eliminationData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var eliminationEntity = new Elimination
                    {
                        // Let DB auto-generate the ID
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
                    await _context.SaveChangesAsync();
                    
                    record.EliminationId = eliminationEntity.EliminationId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitEliminationData: {ex.Message}"); // Detailed logging
                throw;
            }
        }

        public async Task SubmitMobilityData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());            
                var existingEntry = await _context.Mobilities.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(mobilityData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var mobilityEntity = new Mobility
                    {
                        // Let DB auto-generate the ID
                        Transfer = mobilityData.Transfer,
                        Aids = mobilityData.Aids,
                        BedMobility = mobilityData.BedMobility
                    };

                    _context.Mobilities.Add(mobilityEntity);
                    await _context.SaveChangesAsync();
                    
                    record.MobilityId = mobilityEntity.MobilityId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitMobilityData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitNutritionData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());            
                var existingEntry = await _context.Nutritions.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(nutritionData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var nutritionEntity = new Nutrition
                    {
                        // Let DB auto-generate the ID
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
                    await _context.SaveChangesAsync();
                    
                    record.NutritionId = nutritionEntity.NutritionId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitNutritionData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitCognitiveData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());   
                var existingEntry = await _context.Cognitives.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(cognitiveData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var cognitiveEntity = new Cognitive
                    {
                        // Let DB auto-generate the ID
                        Speech = cognitiveData.Speech,
                        Loc = cognitiveData.Loc,
                        Mmse = cognitiveData.Mmse,
                        Confusion = cognitiveData.Confusion                      
                    };

                    _context.Cognitives.Add(cognitiveEntity);
                    await _context.SaveChangesAsync();
                    
                    record.CognitiveId = cognitiveEntity.CognitiveId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitCognitiveData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitSafetyData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var safetyData = JsonConvert.DeserializeObject<PatientSafetyDTO>(value.ToString());            
                var existingEntry = await _context.Safeties.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(safetyData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var safetyEntity = new Safety
                    {
                        // Let DB auto-generate the ID
                        HipProtectors = safetyData.HipProtectors,
                        SideRails = safetyData.SideRails,
                        FallRiskScale = safetyData.FallRiskScale,
                        CrashMats = safetyData.CrashMats,
                        BedAlarm = safetyData.BedAlarm
                    };

                    _context.Safeties.Add(safetyEntity);
                    await _context.SaveChangesAsync();
                    
                    record.SafetyId = safetyEntity.SafetyId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitSafetyData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitAdlData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());            
                var existingEntry = await _context.Adls.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(adlData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var adlEntity = new Adl
                    {
                        // Let DB auto-generate the ID
                        BathDate = adlData.BathDate,
                        TubShowerOther = adlData.TubShowerOther,
                        TypeOfCare = adlData.TypeOfCare,
                        TurningSchedule = adlData.TurningSchedule,
                        Teeth = adlData.Teeth,
                        FootCare = adlData.FootCare,
                        HairCare = adlData.HairCare
                    };

                    _context.Adls.Add(adlEntity);
                    await _context.SaveChangesAsync();
                    
                    record.AdlsId = adlEntity.AdlsId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitAdlData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitBehaviourData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());            
                var existingEntry = await _context.Behaviours.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(behaviourData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var behaviourEntity = new Behaviour
                    {
                        // Let DB auto-generate the ID
                        Report = behaviourData.Report
                    };

                    _context.Behaviours.Add(behaviourEntity);
                    await _context.SaveChangesAsync();
                    
                    record.BehaviourId = behaviourEntity.BehaviourId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitBehaviourData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitSkinAndSensoryAidData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());            
                var existingEntry = await _context.SkinAndSensoryAids.FindAsync(patientId);

                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(skinData);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var skinAndSensoryAidsEntity = new SkinAndSensoryAid
                    {
                        // Let DB auto-generate the ID
                        Glasses = skinData.Glasses,
                        Hearing = skinData.Hearing,
                        SkinIntegrityPressureUlcerRisk = skinData.SkinIntegrityPressureUlcerRisk,
                        SkinIntegrityTurningSchedule = skinData.SkinIntegrityTurningSchedule,
                        SkinIntegrityBradenScale = skinData.SkinIntegrityBradenScale,
                        SkinIntegrityDressings = skinData.SkinIntegrityDressings
                    };

                    _context.SkinAndSensoryAids.Add(skinAndSensoryAidsEntity);
                    await _context.SaveChangesAsync();
                    
                    record.SkinId = skinAndSensoryAidsEntity.SkinAndSensoryAidsId;
                    _context.Update(record);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitSkinAndSensoryAidData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitProgressNoteData(NursingDbContext _context, object value, Record record, int patientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());
                
                // Create a new progress note without specifying the ID
                var progressNoteEntity = new ProgressNote
                {
                    // Don't set ProgressNoteId - let the database generate it
                    Timestamp = progressNoteData.Timestamp,
                    Note = progressNoteData.Note
                };

                // Add to database first to get the auto-generated ID
                _context.ProgressNotes.Add(progressNoteEntity);
                await _context.SaveChangesAsync();
                
                // Now update the record with the generated ID
                record.ProgressNoteId = progressNoteEntity.ProgressNoteId;
                _context.Update(record);
                await _context.SaveChangesAsync();
                
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitProgressNoteData: {ex.Message}");
                throw;
            }
        }

        public async Task SubmitProfileData(NursingDbContext _context, object value, Patient patient)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var profileData = JsonConvert.DeserializeObject<PatientProfileDTO>(value.ToString());
                
                // Validate bed number is within the allowed range
                ValidateBedNumber(profileData.BedNumber);
                
                // Check for duplicate bed number in the database
                if (profileData.BedNumber.HasValue)
                {
                    bool duplicateExists = await _context.Patients
                        .AnyAsync(p => p.PatientId != patient.PatientId && 
                                      p.BedNumber == profileData.BedNumber);
                    
                    if (duplicateExists)
                    {
                        throw new InvalidOperationException(
                            $"A patient is already assigned to Bed {profileData.BedNumber}. Bed number must be unique.");
                    }
                }
                
                var existingEntry = await _context.Patients.FindAsync(patient.PatientId);
                
                if (existingEntry != null)
                {
                    _context.Entry(existingEntry).CurrentValues.SetValues(profileData);
                    await _context.SaveChangesAsync();
                }
                
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in SubmitProfileData: {ex.Message}");
                throw;
            }
        }
    }
}