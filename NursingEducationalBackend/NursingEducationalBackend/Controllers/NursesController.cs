using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints by default
    public class NursesController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public NursesController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Nurses/Profile
        [HttpGet("profile")]
        public async Task<ActionResult<Nurse>> GetNurseProfile()
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int nurseId;
            if (!int.TryParse(nurseIdClaim.Value, out nurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            var nurse = await _context.Nurses.FindAsync(nurseId);

            if (nurse == null)
            {
                return NotFound(new { message = "Nurse profile not found" });
            }

            return nurse;
        }

        // GET: api/Nurses
        [HttpGet]
        [Authorize(Roles = "Admin")] // Only admins can see all nurses
        public async Task<ActionResult<IEnumerable<Nurse>>> GetNurses()
        {
            return await _context.Nurses.ToListAsync();
        }

        // GET: api/Nurses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetNurse(int id)
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int currentNurseId;
            if (!int.TryParse(nurseIdClaim.Value, out currentNurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            // Check if user is admin or requesting their own profile
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentNurseId != id)
            {
                return Forbid();
            }

            var nurse = await _context.Nurses.FindAsync(id);

            if (nurse == null)
            {
                return NotFound();
            }

            return nurse;
        }

        // PUT: api/Nurses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNurse(int id, Nurse nurse)
        {
            // Get NurseId from claims
            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");
            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Invalid token or missing NurseId claim" });

            int currentNurseId;
            if (!int.TryParse(nurseIdClaim.Value, out currentNurseId))
                return BadRequest(new { message = "Invalid NurseId format" });

            // Check if user is admin or updating their own profile
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && currentNurseId != id)
            {
                return Forbid();
            }

            if (id != nurse.NurseId)
            {
                return BadRequest();
            }

            // Prevent modifying sensitive fields if not admin
            if (!isAdmin)
            {
                // Get existing nurse to preserve fields that shouldn't be modified
                var existingNurse = await _context.Nurses.AsNoTracking().FirstOrDefaultAsync(n => n.NurseId == id);
                if (existingNurse == null)
                {
                    return NotFound();
                }

                // Preserve the fields that should not be changed by regular users
                nurse.StudentNumber = existingNurse.StudentNumber;
                // Add any other fields that should be protected
            }

            _context.Entry(nurse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NurseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Nurses
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create nurses directly
        public async Task<ActionResult<Nurse>> PostNurse(Nurse nurse)
        {
            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNurse", new { id = nurse.NurseId }, nurse);
        }

        // DELETE: api/Nurses/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete nurses
        public async Task<IActionResult> DeleteNurse(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }

            _context.Nurses.Remove(nurse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NurseExists(int id)
        {
            return _context.Nurses.Any(e => e.NurseId == id);
        }
    }
}