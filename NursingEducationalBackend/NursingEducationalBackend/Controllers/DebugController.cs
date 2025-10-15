using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        private readonly NursingDbContext _context;
        public DebugController(NursingDbContext context)
        {
            _context = context;
        }


        // Debug endpoint to diagnose database issues
        [HttpGet("debug/tables")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> ListAllTables()
        {
            try
            {
                var tables = new List<string>();
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    // SQLite specific query to list all tables
                    command.CommandText = "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;";

                    if (command.Connection.State != System.Data.ConnectionState.Open)
                        await command.Connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tables.Add(reader.GetString(0));
                        }
                    }
                }

                // Get connection info to verify we're using the right database
                var connectionString = _context.Database.GetConnectionString() ?? "Not available";
                var sanitizedConnection = connectionString;
                // Simple sanitization to hide sensitive info
                if (connectionString.Contains("="))
                {
                    sanitizedConnection = string.Join(";",
                        connectionString.Split(';')
                        .Select(part => {
                            if (part.StartsWith("Password=") || part.StartsWith("User ID=") ||
                                part.StartsWith("Uid=") || part.StartsWith("Pwd="))
                                return part.Split('=')[0] + "=***";
                            return part;
                        }));
                }

                return Ok(new
                {
                    DatabaseProvider = _context.Database.ProviderName,
                    AvailableTables = tables,
                    ConnectionInfo = sanitizedConnection,
                    DbContextType = _context.GetType().FullName,
                    Models = new
                    {
                        PatientsDbSet = _context.Patients != null ? "Registered" : "Not registered",
                        PatientEntityType = _context.Model.FindEntityType(typeof(Patient))?.GetTableName()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error listing tables",
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }


    }
}
