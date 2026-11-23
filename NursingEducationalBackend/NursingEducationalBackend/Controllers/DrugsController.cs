using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend.Controllers
{
    // MAR drug list
    [Route("api/drugs")]
    [ApiController]
    [Authorize]
    public class DrugsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public DrugsController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/drugs?search=tyl
        // Matches the generic name or any brand name, up to 10 results.
        [HttpGet]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<DrugSearchResultDTO>>> SearchDrugs([FromQuery] string? search)
        {
            var text = (search ?? "").Trim();

            var query = _context.Drugs.AsNoTracking();
            if (text.Length > 0)
            {
                // SQL Server compares without case, so "tyl" finds "Tylenol"
                query = query.Where(d => d.GenericName.Contains(text)
                    || (d.BrandName != null && d.BrandName.Contains(text)));
            }

            var drugs = await query
                .OrderBy(d => d.GenericName)
                .Take(10)
                .ToListAsync();

            var results = drugs.Select(d =>
            {
                var brands = string.IsNullOrWhiteSpace(d.BrandName)
                    ? new List<string>()
                    : d.BrandName.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

                // Tell the frontend which brand matched, so it can show "Tylenol (acetaminophen)".
                // Null when the generic name matched.
                string? matchedBrand = null;
                if (text.Length > 0 && !d.GenericName.Contains(text, StringComparison.OrdinalIgnoreCase))
                {
                    matchedBrand = brands.FirstOrDefault(b => b.Contains(text, StringComparison.OrdinalIgnoreCase));
                }

                return new DrugSearchResultDTO
                {
                    DrugId = d.DrugId,
                    GenericName = d.GenericName,
                    BrandNames = brands,
                    MatchedBrand = matchedBrand,
                };
            }).ToList();

            return Ok(results);
        }
    }
}
