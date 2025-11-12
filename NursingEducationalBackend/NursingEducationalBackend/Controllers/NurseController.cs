using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NursingEducationalBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using Microsoft.Identity.Client;

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

        [HttpGet("unassigned")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<NurseOverviewDTO>>> GetUnassignedNurses()
        {
            var nursesWithoutClass = await _context.Nurses.Where(n => n.ClassId == null).Select(n => new NurseOverviewDTO
            {
                NurseId = n.NurseId,
                FullName = n.FullName,
                StudentNumber = n.StudentNumber,
                Email = n.Email,
                ClassId = n.ClassId,
                Patients = n.Patients,
                PatientId = n.PatientId
            }).ToListAsync();

            return nursesWithoutClass;
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateNurse(int id, NurseOverviewDTO nurse)
        {
            if (id != nurse.NurseId)
            {
                return BadRequest();
            }

            Nurse editedNurse = await _context.Nurses.FindAsync(id);
            if (editedNurse == null)
            {
                return NotFound();
            }

            _context.Entry(editedNurse).State = EntityState.Modified;

            try
            {
                editedNurse.FullName = nurse.FullName;
                editedNurse.PatientId = nurse.PatientId;
                editedNurse.StudentNumber = nurse.StudentNumber;
                editedNurse.Email = nurse.Email;
                editedNurse.Patients = nurse.Patients;
                editedNurse.ClassId = nurse.ClassId;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest();
            }

            return NoContent();
        }

    }
}
