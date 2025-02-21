using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NursesController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public NursesController(NursingDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Nurse nurse)
        {
            if (_context.Nurses.Any(n => n.Email == nurse.Email))
            {
                return BadRequest("Email is already registered.");
            }

            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();

            return Ok(nurse);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] NurseLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            var nurse = await _context.Nurses.FirstOrDefaultAsync(n => n.Email == request.Email);


            if (nurse == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (nurse.Password == request.Password)
            {
                return Ok(new { message = "Login successful", nurseId = nurse.NurseId });
            }
            else
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("AuthCookie");
            return Ok(new { message = "Logout successful" });
        }

        // GET: api/Nurses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetNurses()
        {
            return await _context.Nurses.ToListAsync();
        }

        // GET: api/Nurses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetNurse(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);

            if (nurse == null)
            {
                return NotFound();
            }

            return nurse;
        }

        // PUT: api/Nurses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNurse(int id, Nurse nurse)
        {
            if (id != nurse.NurseId)
            {
                return BadRequest();
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Nurse>> PostNurse(Nurse nurse)
        {
            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNurse", new { id = nurse.NurseId }, nurse);
        }

        // DELETE: api/Nurses/5
        [HttpDelete("{id}")]
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
