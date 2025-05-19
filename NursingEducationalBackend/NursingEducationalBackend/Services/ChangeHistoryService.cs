using Microsoft.AspNetCore.Http;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Security.Claims;
namespace NursingEducationalBackend.Services
{
    public class ChangeHistoryService : IChangeHistoryService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChangeHistoryService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Default constructor for backward compatibility
        public ChangeHistoryService()
        {
            _httpContextAccessor = null;
        }

        // Helper method to get the NurseId from HttpContext
        private string GetNurseId()
{
    if (_httpContextAccessor?.HttpContext == null)
    {
        return "System";
    }
    
    // First try to get the NurseId claim directly if it exists in the token
    var nurseIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("NurseId");
    if (nurseIdClaim != null)
    {
        return nurseIdClaim.Value;
    }
    
    // If not found, extract the username (email) which is the primary identifier
    var emailClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name) 
                  ?? _httpContextAccessor.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");
    
    if (emailClaim != null)
    {
        return emailClaim.Value; // Return the email as the identifier
    }
    
    // Last resort - use the authenticated user's name directly
    if (_httpContextAccessor.HttpContext.User.Identity?.IsAuthenticated == true)
    {
        var username = _httpContextAccessor.HttpContext.User.Identity.Name;
        return username ?? "System";
    }
    
    return "System";
}
        public async Task RecordChanges<TEntity>(NursingDbContext dbContext, TEntity oldEntity, TEntity newEntity, 
            int entityId, string entityType, int patientId, string source = "System") 
            where TEntity : class
        {
            if (oldEntity == null || newEntity == null)
                return;

            // Get NurseId from HttpContext
            string nurseId = GetNurseId();

            var changes = new List<ChangeHistory>();
            
            // Get all properties of the entity
            var properties = typeof(TEntity).GetProperties();
            
            foreach (var property in properties)
            {
                // Skip ID properties and navigation properties
                if (property.Name.EndsWith("Id") || 
                    (property.PropertyType.IsClass && !property.PropertyType.Equals(typeof(string))))
                    continue;
                    
                var oldValue = property.GetValue(oldEntity)?.ToString();
                var newValue = property.GetValue(newEntity)?.ToString();
                
                // Only record a change if the values are different
                if (!string.Equals(oldValue, newValue))
                {
                    Console.WriteLine($"Change detected in {entityType}.{property.Name}: old: '{oldValue}' new: '{newValue}'");
                    
                    changes.Add(new ChangeHistory
                    {
                        EntityType = entityType,
                        EntityId = entityId,
                        AttributeName = property.Name,
                        OldValue = oldValue ?? "(null)",
                        NurseId = nurseId,  // Use the actual NurseId from HttpContext
                        Source = source,
                        Operation = "UPDATE",
                        Metadata = JsonConvert.SerializeObject(new { PatientId = patientId })
                    });
                }
            }
            
            if (changes.Any())
            {
                await dbContext.AddRangeAsync(changes);
                await dbContext.SaveChangesAsync();
                Console.WriteLine($"Saved {changes.Count} change records for {entityType}");
            }
        }
        
        public async Task RecordCreation<TEntity>(NursingDbContext dbContext, TEntity entity, 
            int entityId, string entityType, int patientId, string source = "System") 
            where TEntity : class
        {
            // Get NurseId from HttpContext
            string nurseId = GetNurseId();

            var changes = new List<ChangeHistory>();
            
            // Record the creation event
            changes.Add(new ChangeHistory
            {
                EntityType = entityType,
                EntityId = entityId,
                AttributeName = "Creation",
                OldValue = "(new record)",
                NurseId = nurseId,  // Use the actual NurseId from HttpContext
                Source = source,
                Operation = "INSERT",
                Metadata = JsonConvert.SerializeObject(new { PatientId = patientId })
            });
            
            // Record initial values of all properties
            var properties = typeof(TEntity).GetProperties()
                .Where(p => !p.Name.EndsWith("Id") && 
                       !(p.PropertyType.IsClass && !p.PropertyType.Equals(typeof(string)))); // Skip ID properties and navigation properties
                
            foreach (var property in properties)
            {
                var value = property.GetValue(entity)?.ToString();
                
                if (value != null)
                {
                    changes.Add(new ChangeHistory
                    {
                        EntityType = entityType,
                        EntityId = entityId,
                        AttributeName = property.Name,
                        OldValue = "(initial value)",
                        NurseId = nurseId,  // Use the actual NurseId from HttpContext
                        Source = source,
                        Operation = "INSERT",
                        Metadata = JsonConvert.SerializeObject(new { 
                            PatientId = patientId,
                            InitialValue = value
                        })
                    });
                }
            }
            
            if (changes.Any())
            {
                await dbContext.AddRangeAsync(changes);
                await dbContext.SaveChangesAsync();
                Console.WriteLine($"Saved {changes.Count} creation records for {entityType}");
            }
        }
    }
}