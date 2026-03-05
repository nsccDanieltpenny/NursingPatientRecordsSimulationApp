using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampusController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public CampusController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Campus
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Campus>>> GetCampuses()
        {
            return await _context.Campuses.ToListAsync();
        }

        // GET: api/Campus/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Campus>> GetCampus(int id)
        {
            var campus = await _context.Campuses.FindAsync(id);
            if (campus == null) return NotFound();
            return campus;
        }

        // POST: api/Campus
        [HttpPost]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<Campus>> CreateCampus(Campus campus)
        {
            _context.Campuses.Add(campus);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCampus), new { id = campus.CampusId }, campus);
        }

        // PUT: api/Campus/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> UpdateCampus(int id, Campus campus)
        {
            if (id != campus.CampusId) return BadRequest();

            _context.Entry(campus).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Campus/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> DeleteCampus(int id)
        {
            var campus = await _context.Campuses.FindAsync(id);
            if (campus == null) return NotFound();

            _context.Campuses.Remove(campus);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}