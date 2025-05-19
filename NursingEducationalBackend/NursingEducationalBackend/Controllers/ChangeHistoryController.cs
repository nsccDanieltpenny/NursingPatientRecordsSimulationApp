using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/history")]
    [ApiController]
    public class ChangeHistoryController : ControllerBase  // Removed [Authorize] to allow open access
    {
        private readonly NursingDbContext _context;

        public ChangeHistoryController(NursingDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all change history records ordered by date
        /// </summary>
        /// <returns>List of all change history records</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChangeHistory>>> GetAllChangeHistory()
        {
            try
            {
                // Retrieve all records from the ChangeHistory table
                var allChanges = await _context.ChangeHistory
                    .OrderByDescending(h => h.ChangeDate)
                    .ToListAsync();

                return Ok(allChanges);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving change history: {ex.Message}");
            }
        }

        /// <summary>
        /// Completely truncates the ChangeHistory table, removing all data
        /// </summary>
        /// <returns>Success message</returns>
        [HttpDelete("truncate")]  // Removed [Authorize(Roles = "Admin")] restriction
        public async Task<ActionResult> TruncateChangeHistory()
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Get count before deletion for reporting
                int recordCount = await _context.ChangeHistory.CountAsync();

                // For SQL Server, use TRUNCATE which is much faster for removing all records
                await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [dbo].[ChangeHistory]");
                // Alternative for other databases:
                // await _context.Database.ExecuteSqlRawAsync("DELETE FROM [dbo].[ChangeHistory]");

                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Successfully truncated ChangeHistory table. {recordCount} records were removed."
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error truncating ChangeHistory table: {ex.Message}");
            }
        }
    }
}
