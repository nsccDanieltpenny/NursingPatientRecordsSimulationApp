using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class MedicationAdministrationsController : ControllerBase
{
    private readonly NursingDbContext _context;
    public MedicationAdministrationsController(NursingDbContext context)
    {
        _context = context;
    }

    // GET: api/MedicationAdministration
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicationAdministration>>> GetMedicationAdministration()
    {
        return await _context.MedicationAdministrations.ToListAsync();
    }

    // GET: api/MedicationAdministration/5
    [HttpGet("{administrationid}")]
    public async Task<ActionResult<MedicationAdministration>> GetMedicationAdministration(int administrationid)
    {
        var medicationadministration = await _context.MedicationAdministrations.FindAsync(administrationid);

        if (medicationadministration == null)
        {
            return NotFound();
        }

        return medicationadministration;
    }

    // PUT: api/MedicationAdministration/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{administrationid}")]
    public async Task<IActionResult> PutMedicationAdministration(int? administrationid, MedicationAdministration medicationadministration)
    {
        if (administrationid != medicationadministration.AdministrationId)
        {
            return BadRequest();
        }

        _context.Entry(medicationadministration).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MedicationAdministrationExists(administrationid))
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

    // POST: api/MedicationAdministration
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MedicationAdministration>> PostMedicationAdministration(MedicationAdministration medicationadministration)
    {
        _context.MedicationAdministrations.Add(medicationadministration);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetMedicationAdministration", new { administrationid = medicationadministration.AdministrationId }, medicationadministration);
    }

    // DELETE: api/MedicationAdministration/5
    [HttpDelete("{administrationid}")]
    public async Task<IActionResult> DeleteMedicationAdministration(int? administrationid)
    {
        var medicationadministration = await _context.MedicationAdministrations.FindAsync(administrationid);
        if (medicationadministration == null)
        {
            return NotFound();
        }

        _context.MedicationAdministrations.Remove(medicationadministration);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MedicationAdministrationExists(int? administrationid)
    {
        return _context.MedicationAdministrations.Any(e => e.AdministrationId == administrationid);
    }
}
