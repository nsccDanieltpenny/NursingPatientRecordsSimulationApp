using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MobilitiesController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public MobilitiesController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Mobilities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mobility>>> GetMobilities()
        {
            return await _context.Mobilities.ToListAsync();
        }

        // GET: api/Mobilities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mobility>> GetMobility(int id)
        {
            var mobility = await _context.Mobilities.FindAsync(id);

            if (mobility == null)
            {
                return NotFound();
            }

            return mobility;
        }

        // PUT: api/Mobilities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMobility(int id, Mobility mobility)
        {
            if (id != mobility.MobilityId)
            {
                return BadRequest();
            }

            _context.Entry(mobility).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MobilityExists(id))
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

        // POST: api/Mobilities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mobility>> PostMobility(Mobility mobility)
        {
            _context.Mobilities.Add(mobility);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMobility", new { id = mobility.MobilityId }, mobility);
        }

        // DELETE: api/Mobilities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMobility(int id)
        {
            var mobility = await _context.Mobilities.FindAsync(id);
            if (mobility == null)
            {
                return NotFound();
            }

            _context.Mobilities.Remove(mobility);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MobilityExists(int id)
        {
            return _context.Mobilities.Any(e => e.MobilityId == id);
        }
    }
}
