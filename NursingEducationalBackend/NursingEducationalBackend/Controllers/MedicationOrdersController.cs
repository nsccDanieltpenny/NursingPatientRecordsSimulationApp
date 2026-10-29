using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class MedicationOrdersController : ControllerBase
{
    private readonly NursingDbContext _context;
    public MedicationOrdersController(NursingDbContext context)
    {
        _context = context;
    }

    // GET: api/MedicationOrder
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicationOrder>>> GetMedicationOrder()
    {
        return await _context.MedicationOrders.ToListAsync();
    }

    // GET: api/MedicationOrder/5
    [HttpGet("{medicationorderid}")]
    public async Task<ActionResult<MedicationOrder>> GetMedicationOrder(int medicationorderid)
    {
        var medicationorder = await _context.MedicationOrders.FindAsync(medicationorderid);

        if (medicationorder == null)
        {
            return NotFound();
        }

        return medicationorder;
    }

    // PUT: api/MedicationOrder/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{medicationorderid}")]
    public async Task<IActionResult> PutMedicationOrder(int? medicationorderid, MedicationOrder medicationorder)
    {
        if (medicationorderid != medicationorder.MedicationOrderId)
        {
            return BadRequest();
        }

        _context.Entry(medicationorder).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MedicationOrderExists(medicationorderid))
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

    // POST: api/MedicationOrder
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MedicationOrder>> PostMedicationOrder(MedicationOrder medicationorder)
    {
        _context.MedicationOrders.Add(medicationorder);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetMedicationOrder", new { medicationorderid = medicationorder.MedicationOrderId }, medicationorder);
    }

    // DELETE: api/MedicationOrder/5
    [HttpDelete("{medicationorderid}")]
    public async Task<IActionResult> DeleteMedicationOrder(int? medicationorderid)
    {
        var medicationorder = await _context.MedicationOrders.FindAsync(medicationorderid);
        if (medicationorder == null)
        {
            return NotFound();
        }

        _context.MedicationOrders.Remove(medicationorder);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MedicationOrderExists(int? medicationorderid)
    {
        return _context.MedicationOrders.Any(e => e.MedicationOrderId == medicationorderid);
    }
}
