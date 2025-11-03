using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public ClassesController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Classes
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Class>>> GetClasses()
        {
            var overviews = await _context.Classes
                .AsNoTracking()
                .Select(c => new ClassOverviewDTO
                {
                    ID = c.ClassId,
                    Name = c.Name,
                    Description = c.Description,
                    JoinCode = c.JoinCode,
                    InstructorId = c.InstructorId,
                    StartDate = c.StartDate,
                    StudentCount = c.Students!.Count > 0 ? c.Students.Count : 0
                })
                .ToListAsync();

            return Ok(overviews);
        }

        // GET: api/Classes/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Class>> GetClass(int id)
        {
            var @class = await _context.Classes.FindAsync(id);

            if (@class == null)
            {
                return NotFound();
            }

            return @class;
        }


        // GET: /api/Class/{id}/students
        [HttpGet("{id}/students")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetClassStudents(int id)
        {
            //var classExists = await _context.Classes.FindAsync(id);
            //if (classExists == null) return NotFound(new { message = "Class not found" });

            var studentsFromClass = await _context.Nurses
                .Where(n => n.ClassId == id)
                .Select(n => new
                {
                    NurseId = n.NurseId,
                    FullName = n.FullName,
                    StudentNumber = n.StudentNumber,
                    Email = n.Email,
                    ClassId = n.ClassId,
                })
                .ToListAsync();

            return Ok(studentsFromClass);
        }

        //Verify join codes
        [HttpGet("verify/{id}")]
        public async Task<ActionResult> VerifyJoinCode(string id)
        {
            var classByCode = _context.Classes.Where(c => c.JoinCode == id).FirstOrDefault();
            if (classByCode == null)
            {
                return NotFound();
            }

            return Ok();
        }



        // PUT: api/Classes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutClass(int id, Class @class)
        {
            if (id != @class.ClassId)
            {
                return BadRequest();
            }

            _context.Entry(@class).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassExists(id))
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

        // POST: api/Classes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Class>> PostClass(Class @class)
        {
            _context.Classes.Add(@class);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClass", new { id = @class.ClassId }, @class);
        }

        // DELETE: api/Classes/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var @class = await _context.Classes.FindAsync(id);
            if (@class == null)
            {
                return NotFound();
            }

            _context.Classes.Remove(@class);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClassExists(int id)
        {
            return _context.Classes.Any(e => e.ClassId == id);
        }
    }
}
