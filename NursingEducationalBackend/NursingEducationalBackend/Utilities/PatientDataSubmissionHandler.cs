using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Services;
using System;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Utilities
{
    public class PatientDataSubmissionHandler
    {
        private const int MinBedNumber = 0;
        private const int MaxBedNumber = 15;
        private readonly IChangeHistoryService _changeHistoryService;

        public PatientDataSubmissionHandler(IChangeHistoryService changeHistoryService)
        {
            _changeHistoryService = changeHistoryService;
        }
        
        // Default constructor for backward compatibility
        public PatientDataSubmissionHandler()
        {
            _changeHistoryService = new ChangeHistoryService();
        }

        // Helper method to validate bed number
        private void ValidateBedNumber(int? bedNumber)
        {
            if (bedNumber.HasValue && (bedNumber < MinBedNumber || bedNumber > MaxBedNumber))
            {
                throw new InvalidOperationException($"Bed number must be between {MinBedNumber} and {MaxBedNumber}.");
            }
        }

        // Generic submission method that handles all entity types in a consistent way
        private async Task<TEntity> SubmitGenericData<TEntity, TDto>(
            NursingDbContext context, 
            TDto dto, 
            Func<int, Task<TEntity>> findEntityAsync,
            Func<TEntity, int> getEntityId,
            string entityType,
            int patientId,
            string source = "System") where TEntity : class, new()
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var existingEntity = await findEntityAsync(patientId);
                
                if (existingEntity != null)
                {
                    // Create a new entity with updated values
                    var updatedEntity = new TEntity();
                    
                    // Copy ID from existing entity to updated entity
                    var idProperty = typeof(TEntity).GetProperty($"{entityType}Id");
                    idProperty?.SetValue(updatedEntity, getEntityId(existingEntity));
                    
                    // Copy all properties from DTO to updated entity
                    foreach (var property in typeof(TDto).GetProperties())
                    {
                        var entityProperty = typeof(TEntity).GetProperty(property.Name);
                        if (entityProperty != null)
                        {
                            entityProperty.SetValue(updatedEntity, property.GetValue(dto));
                        }
                    }
                    
                    // Record changes
                    await _changeHistoryService.RecordChanges(
                        context,
                        existingEntity,
                        updatedEntity,
                        getEntityId(existingEntity),
                        entityType,
                        patientId,
                        source
                    );
                    
                    // Update existing entity
                    var entityToUpdate = await findEntityAsync(patientId);
                    context.Entry(entityToUpdate).CurrentValues.SetValues(dto);
                    await context.SaveChangesAsync();
                    
                    await transaction.CommitAsync();
                    return entityToUpdate;
                }
                else
                {
                    // Create a new entity
                    var newEntity = new TEntity();
                    
                    // Copy all properties from DTO to new entity
                    foreach (var property in typeof(TDto).GetProperties())
                    {
                        var entityProperty = typeof(TEntity).GetProperty(property.Name);
                        if (entityProperty != null)
                        {
                            entityProperty.SetValue(newEntity, property.GetValue(dto));
                        }
                    }
                    
                    // Add to database
                    var dbSet = context.Set<TEntity>();
                    dbSet.Add(newEntity);
                    await context.SaveChangesAsync();
                    
                    // Record creation
                    await _changeHistoryService.RecordCreation(
                        context,
                        newEntity,
                        getEntityId(newEntity),
                        entityType,
                        patientId,
                        source
                    );
                    
                    await transaction.CommitAsync();
                    return newEntity;
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in Submit{entityType}Data: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        #region Patient Data Submission Methods

        public async Task SubmitEliminationData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var eliminationData = JsonConvert.DeserializeObject<PatientEliminationDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Elimination, PatientEliminationDTO>(
                context,
                eliminationData,
                async (id) => await context.Eliminations.AsNoTracking().FirstOrDefaultAsync(e => e.EliminationId == id),
                (e) => e.EliminationId,
                "Elimination",
                patientId,
                source
            );
            
            // Update record with the entity ID if it's a new entity
            if (record.EliminationId == 0)
            {
                record.EliminationId = entity.EliminationId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }
        
        public async Task SubmitMobilityData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var mobilityData = JsonConvert.DeserializeObject<PatientMobilityDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Mobility, PatientMobilityDTO>(
                context,
                mobilityData,
                async (id) => await context.Mobilities.AsNoTracking().FirstOrDefaultAsync(e => e.MobilityId == id),
                (e) => e.MobilityId,
                "Mobility",
                patientId,
                source
            );
            
            if (record.MobilityId == 0)
            {
                record.MobilityId = entity.MobilityId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitNutritionData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var nutritionData = JsonConvert.DeserializeObject<PatientNutritionDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Nutrition, PatientNutritionDTO>(
                context,
                nutritionData,
                async (id) => await context.Nutritions.AsNoTracking().FirstOrDefaultAsync(e => e.NutritionId == id),
                (e) => e.NutritionId,
                "Nutrition",
                patientId,
                source
            );
            
            if (record.NutritionId == 0)
            {
                record.NutritionId = entity.NutritionId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitCognitiveData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var cognitiveData = JsonConvert.DeserializeObject<PatientCognitiveDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Cognitive, PatientCognitiveDTO>(
                context,
                cognitiveData,
                async (id) => await context.Cognitives.AsNoTracking().FirstOrDefaultAsync(e => e.CognitiveId == id),
                (e) => e.CognitiveId,
                "Cognitive",
                patientId,
                source
            );
            
            if (record.CognitiveId == 0)
            {
                record.CognitiveId = entity.CognitiveId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitSafetyData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var safetyData = JsonConvert.DeserializeObject<PatientSafetyDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Safety, PatientSafetyDTO>(
                context,
                safetyData,
                async (id) => await context.Safeties.AsNoTracking().FirstOrDefaultAsync(e => e.SafetyId == id),
                (e) => e.SafetyId,
                "Safety",
                patientId,
                source
            );
            
            if (record.SafetyId == 0)
            {
                record.SafetyId = entity.SafetyId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitAdlData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var adlData = JsonConvert.DeserializeObject<PatientAdlDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Adl, PatientAdlDTO>(
                context,
                adlData,
                async (id) => await context.Adls.AsNoTracking().FirstOrDefaultAsync(e => e.AdlsId == id),
                (e) => e.AdlsId,
                "Adl",
                patientId,
                source
            );
            
            if (record.AdlsId == 0)
            {
                record.AdlsId = entity.AdlsId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitBehaviourData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var behaviourData = JsonConvert.DeserializeObject<PatientBehaviourDTO>(value.ToString());
            
            var entity = await SubmitGenericData<Behaviour, PatientBehaviourDTO>(
                context,
                behaviourData,
                async (id) => await context.Behaviours.AsNoTracking().FirstOrDefaultAsync(e => e.BehaviourId == id),
                (e) => e.BehaviourId,
                "Behaviour",
                patientId,
                source
            );
            
            if (record.BehaviourId == 0)
            {
                record.BehaviourId = entity.BehaviourId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitSkinAndSensoryAidData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            var skinData = JsonConvert.DeserializeObject<PatientSkinDTO>(value.ToString());
            
            var entity = await SubmitGenericData<SkinAndSensoryAid, PatientSkinDTO>(
                context,
                skinData,
                async (id) => await context.SkinAndSensoryAids.AsNoTracking().FirstOrDefaultAsync(e => e.SkinAndSensoryAidsId == id),
                (e) => e.SkinAndSensoryAidsId,
                "SkinAndSensoryAid",
                patientId,
                source
            );
            
            if (record.SkinId == 0)
            {
                record.SkinId = entity.SkinAndSensoryAidsId;
                context.Update(record);
                await context.SaveChangesAsync();
            }
        }

        public async Task SubmitProgressNoteData(NursingDbContext context, object value, Record record, int patientId, string source = "System")
        {
            // Progress notes are always created as new entities
            var progressNoteData = JsonConvert.DeserializeObject<PatientProgressNoteDTO>(value.ToString());
            
            var progressNoteEntity = new ProgressNote
            {
                Timestamp = progressNoteData.Timestamp,
                Note = progressNoteData.Note
            };
            
            context.ProgressNotes.Add(progressNoteEntity);
            await context.SaveChangesAsync();
            
            // Record the creation of a new entity
            await _changeHistoryService.RecordCreation(
                context,
                progressNoteEntity,
                progressNoteEntity.ProgressNoteId,
                "ProgressNote",
                patientId,
                source
            );
            
            record.ProgressNoteId = progressNoteEntity.ProgressNoteId;
            context.Update(record);
            await context.SaveChangesAsync();
        }

        public async Task SubmitProfileData(NursingDbContext context, object value, Patient patient, string source = "System")
        {
            // This method does not track changes for profile data
            dynamic profileData = JsonConvert.DeserializeObject(value.ToString());
            
            // Validate bed number
            if (profileData.BedNumber != null)
            {
                int? bedNumber = (int?)profileData.BedNumber;
                ValidateBedNumber(bedNumber);
                
                // Check for duplicate bed number
                bool duplicateExists = await context.Patients
                    .AnyAsync(p => p.PatientId != patient.PatientId && p.BedNumber == bedNumber);
                
                if (duplicateExists)
                {
                    throw new InvalidOperationException(
                        $"A patient is already assigned to Bed {bedNumber}. Bed number must be unique.");
                }
            }
            
            // Update patient directly using dynamic approach
            foreach (var prop in profileData)
            {
                var propertyName = prop.Name;
                var propertyValue = prop.Value;
                
                var patientProperty = typeof(Patient).GetProperty(propertyName);
                if (patientProperty != null && propertyName != "PatientId")
                {
                    try
                    {
                        var convertedValue = Convert.ChangeType(propertyValue.Value, patientProperty.PropertyType);
                        patientProperty.SetValue(patient, convertedValue);
                    }
                    catch
                    {
                        // Skip properties that can't be converted
                        Console.WriteLine($"Could not set property {propertyName}");
                    }
                }
            }
            
            context.Update(patient);
            await context.SaveChangesAsync();
        }
        
        #endregion
    }
}