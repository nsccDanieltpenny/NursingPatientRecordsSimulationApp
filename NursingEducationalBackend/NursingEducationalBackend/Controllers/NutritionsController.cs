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
    public class NutritionsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public NutritionsController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Nutritions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nutrition>>> GetNutritions()
        {
            return await _context.Nutritions.ToListAsync();
        }

        // GET: api/Nutritions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nutrition>> GetNutrition(int id)
        {
            var nutrition = await _context.Nutritions.FindAsync(id);

            if (nutrition == null)
            {
                return NotFound();
            }

            return nutrition;
        }

        // PUT: api/Nutritions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNutrition(int id, Nutrition nutrition)
        {
            if (id != nutrition.NutritionId)
            {
                return BadRequest();
            }

            _context.Entry(nutrition).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NutritionExists(id))
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

        // POST: api/Nutritions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Nutrition>> PostNutrition(Nutrition nutrition)
        {
            _context.Nutritions.Add(nutrition);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNutrition", new { id = nutrition.NutritionId }, nutrition);
        }

        // DELETE: api/Nutritions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNutrition(int id)
        {
            var nutrition = await _context.Nutritions.FindAsync(id);
            if (nutrition == null)
            {
                return NotFound();
            }

            _context.Nutritions.Remove(nutrition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NutritionExists(int id)
        {
            return _context.Nutritions.Any(e => e.NutritionId == id);
        }
    }
}
