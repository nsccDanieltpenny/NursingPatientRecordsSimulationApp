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
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public PatientsController(NursingDbContext context)
        {
            _context = context;
        }

        //GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        //GET: api/patients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);
            return Ok(patient);
        }

        // GET: api/Patients/admin/ids
        [HttpGet("admin/ids")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientIds()
        {
            try
            {
                // For SQLite, use the standard query without FromSqlRaw
                var patients = await _context.Patients
                    .AsNoTracking()
                    .ToListAsync();

                if (!patients.Any())
                {
                    return Ok(new List<Patient>());
                }

                // Debug check for IDs
                if (patients.All(p => p.PatientId == 0))
                {
                    // If this happens, the entity mapping needs to be fixed
                    return StatusCode(500, new { message = "Error retrieving patient IDs - all IDs are 0" });
                }

                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving patients", error = ex.Message });
            }
        }

        // GET: api/Patients/nurse/ids
        [HttpGet("nurse/ids")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Patient>>> GetNursePatientIds()
        {
            try
            {
                // Get NurseId from claims
                var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
                if (nurseIdClaim == null)
                    return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

                int nurseId;
                if (!int.TryParse(nurseIdClaim.Value, out nurseId))
                    return BadRequest(new { message = "Invalid NurseId format" });

                // Use LINQ instead of SQL for SQLite compatibility
                var patients = await _context.Patients
                    .Where(p => p.NurseId == nurseId || p.NurseId == null)
                    .AsNoTracking()
                    .ToListAsync();

                // Debug check for IDs
                if (patients.Any() && patients.All(p => p.PatientId == 0))
                {
                    return StatusCode(500, new { message = "Error retrieving patient IDs - all IDs are 0" });
                }

                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving nurse patients", error = ex.Message });
            }
        }


        // GET: api/Patients/nurse/patient/{id}/{tableType}
        [HttpGet("nurse/patient/{id}/{tableType}")]
        //[Authorize]
        public async Task<ActionResult<object>> GetPatientByTableForNurse(int id, string tableType)
        {
            // Get NurseId from claims
            //var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            //if (nurseIdClaim == null)
            //    return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            //int nurseId;
            //if (!int.TryParse(nurseIdClaim.Value, out nurseId))
            //    return BadRequest(new { message = "Invalid NurseId format" });


            // Get the patient - only if assigned to this nurse or unassigned
            var patient = await _context.Patients
                .Include(p => p.Records)
                .FirstOrDefaultAsync(p => p.PatientId == id); 
            //&& (p.NurseId == nurseId || p.NurseId == null));



            if (patient == null)
            {
                return NotFound();
            }

            int? tableId = null;
            if (patient.Records != null && patient.Records.Count != 0)
            {
                var record = patient.Records.FirstOrDefault();

                tableId = tableType.ToLower() switch
                {
                    "adl" => record.AdlsId,
                    "behaviour" => record.BehaviourId,
                    "cognitive" => record.CognitiveId,
                    "elimination" => record.EliminationId,
                    "mobility" => record.MobilityId,
                    "nutrition" => record.NutritionId,
                    "progressnote" => record.ProgressNoteId,
                    "safety" => record.SafetyId,
                    "skinandsensoryaid" => record.SkinId,
                    _ => null

                };
            }

            object tableData = null;
            if (tableId != null)
            {
                switch (tableType.ToLower())
                {
                    case "adl":
                        tableData = await _context.Adls.FirstOrDefaultAsync(a => a.AdlsId == tableId);
                        break;
                    case "behaviour":
                        tableData = await _context.Behaviours.FirstOrDefaultAsync(b => b.BehaviourId == tableId);
                        break;
                    case "cognitive":
                        tableData = await _context.Cognitives.FirstOrDefaultAsync(c => c.CognitiveId == tableId);
                        break;
                    case "elimination":
                        tableData = await _context.Eliminations.FirstOrDefaultAsync(e => e.EliminationId == tableId);
                        break;
                    case "mobility":
                        tableData = await _context.Mobilities.FirstOrDefaultAsync(m => m.MobilityId == tableId);
                        break;
                    case "nutrition":
                        tableData = await _context.Nutritions.FirstOrDefaultAsync(n => n.NutritionId == tableId);
                        break;
                    case "progressnote":
                        tableData = await _context.ProgressNotes.FirstOrDefaultAsync(pn => pn.ProgressNoteId == tableId);
                        break;
                    case "safety":
                        tableData = await _context.Safeties.FirstOrDefaultAsync(s => s.SafetyId == tableId);
                        break;
                    case "skinandsensoryaid":
                        tableData = await _context.SkinAndSensoryAids.FirstOrDefaultAsync(s => s.SkinAndSensoryAidsId == tableId);
                        break;
                    default:
                        return BadRequest(new { message = "Invalid table type" });
                }
            }

            if (tableData == null)
            {
                return NotFound("Table not found");
            }

            return Ok(tableData);

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