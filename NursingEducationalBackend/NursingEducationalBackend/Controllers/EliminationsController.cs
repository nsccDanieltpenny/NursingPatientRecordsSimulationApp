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
    public class EliminationsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public EliminationsController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Eliminations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Elimination>>> GetEliminations()
        {
            return await _context.Eliminations.ToListAsync();
        }

        // GET: api/Eliminations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Elimination>> GetElimination(int id)
        {
            var elimination = await _context.Eliminations.FindAsync(id);

            if (elimination == null)
            {
                return NotFound();
            }

            return elimination;
        }

        // PUT: api/Eliminations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutElimination(int id, Elimination elimination)
        {
            if (id != elimination.EliminationId)
            {
                return BadRequest();
            }

            _context.Entry(elimination).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EliminationExists(id))
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

        // POST: api/Eliminations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Elimination>> PostElimination(Elimination elimination)
        {
            _context.Eliminations.Add(elimination);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetElimination", new { id = elimination.EliminationId }, elimination);
        }

        // DELETE: api/Eliminations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteElimination(int id)
        {
            var elimination = await _context.Eliminations.FindAsync(id);
            if (elimination == null)
            {
                return NotFound();
            }

            _context.Eliminations.Remove(elimination);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EliminationExists(int id)
        {
            return _context.Eliminations.Any(e => e.EliminationId == id);
        }
    }
}
