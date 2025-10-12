using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NursingEducationalBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NurseController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public NurseController(NursingDbContext context)
        {
            _context = context;
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

    }
}
