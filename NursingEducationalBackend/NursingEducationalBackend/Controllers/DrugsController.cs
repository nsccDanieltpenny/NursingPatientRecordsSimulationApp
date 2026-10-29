using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class DrugsController : ControllerBase
{
    private readonly NursingDbContext _context;
    public DrugsController(NursingDbContext context)
    {
        _context = context;
    }

    // GET: api/Drug
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Drug>>> GetDrug()
    {
        return await _context.Drug.ToListAsync();
    }

    // GET: api/Drug/5
    [HttpGet("{drugid}")]
    public async Task<ActionResult<Drug>> GetDrug(int drugid)
    {
        var drug = await _context.Drug.FindAsync(drugid);

        if (drug == null)
        {
            return NotFound();
        }

        return drug;
    }

    // PUT: api/Drug/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{drugid}")]
    public async Task<IActionResult> PutDrug(int? drugid, Drug drug)
    {
        if (drugid != drug.DrugId)
        {
            return BadRequest();
        }

        _context.Entry(drug).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DrugExists(drugid))
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

    // POST: api/Drug
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Drug>> PostDrug(Drug drug)
    {
        _context.Drug.Add(drug);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetDrug", new { drugid = drug.DrugId }, drug);
    }

    // DELETE: api/Drug/5
    [HttpDelete("{drugid}")]
    public async Task<IActionResult> DeleteDrug(int? drugid)
    {
        var drug = await _context.Drug.FindAsync(drugid);
        if (drug == null)
        {
            return NotFound();
        }

        _context.Drug.Remove(drug);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool DrugExists(int? drugid)
    {
        return _context.Drug.Any(e => e.DrugId == drugid);
    }
}
