using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly NursingDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public InstructorController(
            NursingDbContext context,
            UserManager<IdentityUser> userManager
            )
        {
            _context = context;
            _userManager = userManager;
        }

        //register NOT SECURE, FOR NEXT SPRINT
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] InstRegisterRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //check for existing email
            var existingNurse = await _context.Nurses.FirstOrDefaultAsync(n => n.Email == model.Email);
            if (existingNurse != null)
            {
                return BadRequest("Email already in use.");
            }

            //create Identity user
            var identityUser = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            //create new Nurse record with IsInstructor = true
            var instructor = new Nurse
            {
                Email = model.Email,
                FullName = model.FullName,
                StudentNumber = model.StudentNumber,
                IsInstructor = true
            };

            try
            {
                await _context.Nurses.AddAsync(instructor);
                await _context.SaveChangesAsync();

                //update with NurseId claim
                await _userManager.AddClaimAsync(identityUser, new System.Security.Claims.Claim("NurseId", instructor.NurseId.ToString()));
            }
            catch (Exception ex)
            {
                //rollback user creation if nurse creation fails
                await _userManager.DeleteAsync(identityUser);
                return StatusCode(500, ex.Message);
            }

            return Ok("Instructor registered successfully.");

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
