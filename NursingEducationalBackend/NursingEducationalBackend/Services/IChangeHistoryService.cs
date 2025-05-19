using NursingEducationalBackend.Models;
using System;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Services
{
    public interface IChangeHistoryService
    {
        Task RecordChanges<TEntity>(NursingDbContext dbContext, TEntity oldEntity, TEntity newEntity, 
            int entityId, string entityType, int patientId, string source = "System") 
            where TEntity : class;
            
        Task RecordCreation<TEntity>(NursingDbContext dbContext, TEntity entity, 
            int entityId, string entityType, int patientId, string source = "System") 
            where TEntity : class;
    }
}