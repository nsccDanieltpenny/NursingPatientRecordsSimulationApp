using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly NursingDbContext _context;
        public InstructorController(NursingDbContext context)
        {
            _context = context;
        }

        //register NOT SECURE, FOR NEXT SPRINT
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {

        }

        //get all
        //GET: api/Instructor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetInstructors()
        {
            var instructors = await _context.Nurses.Where(n => n.IsInstructor).ToListAsync();
            return Ok(instructors);
        }

        //get by id
        //GET: api/Instructor/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetInstructor(int id)
        {
            var instructor = await _context.Nurses.FindAsync(id);
            if (instructor == null || !instructor.IsInstructor)
            {
                return NotFound();
            }
            return Ok(instructor);
        }

        //get by W-number
        //GET: api/Instructor/wnumber/{wnumber}
        [HttpGet("wnumber/{wnumber}")]
        public async Task<ActionResult<Nurse>> GetInstructorByWNumber(string wnumber)
        {
            var instructor = await _context.Nurses.FirstOrDefaultAsync(n => n.StudentNumber == wnumber && n.IsInstructor);
            if (instructor == null)
            {
                return NotFound();
            }
            return Ok(instructor);
        }

        //validate instructor by W-number
        //PUT: api/Instructor/validate/{wnumber}
        [HttpPut("validate/{wnumber}")]
        public async Task<ActionResult<bool>> ValidateInstructorByWNumber(string wnumber)
        {
            var instructor = await _context.Nurses.FirstOrDefaultAsync(n => n.StudentNumber == wnumber);

            //set IsInstructor to true for this nurse, if not already
            if (!instructor.IsInstructor)
            {
                instructor.IsInstructor = true;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
                return Ok(instructor);
            } else
            {
                return Ok("Already Instructor, no changes made.");
            }
        }

        //invalidate instructor by W-number
        //PUT: api/Instructor/invalidate/{wnumber}
        [HttpPut("invalidate/{wnumber}")]
        public async Task<ActionResult> InvalidateInstructorByWN(string wnumber)
        {
            var instructor = await _context.Nurses.FirstOrDefaultAsync(n => n.StudentNumber == wnumber);

            //set IsInstructor to false for this nurse, if not already
            if (instructor.IsInstructor)
            {
                instructor.IsInstructor = false;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
                return Ok();
            } else
            {
                return Ok("That W-number already not Instructor, no changes made.");
            }
        }
    }
}
