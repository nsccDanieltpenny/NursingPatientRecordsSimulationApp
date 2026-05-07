using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System.Security.Claims;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Instructor, Nurse")]
    public class RotationsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public RotationsController(NursingDbContext context)
        {
            _context = context;
        }

        // GET api/rotations
        [HttpGet]
        public async Task <ActionResult<IEnumerable<RotationDTO>>> GetRotations()
        {
            var rotations = await _context.Rotations
                .AsNoTracking()
                .Include(r => r.RotationAssessments)
                    .ThenInclude(ra => ra.AssessmentType)
                .Select(r => new RotationDTO
                {
                    RotationId = r.RotationId,
                    Name = r.Name,
                    AssessmentNames = r.RotationAssessments
                        .Select(ra => ra.AssessmentType.Name)
                        .ToList()
                })
                .ToListAsync();

            return Ok(rotations);
        }

        // GET api/rotations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RotationDTO>> GetRotationById(int id)
        {
            var rotation = await _context.Rotations
                .AsNoTracking()
                .Include(r => r.RotationAssessments)
                    .ThenInclude(ra => ra.AssessmentType)
                .Where(r => r.RotationId == id)
                .Select(r => new RotationDTO
                {
                    RotationId = r.RotationId,
                    Name = r.Name,
                    AssessmentNames = r.RotationAssessments
                        .Select(ra => ra.AssessmentType.Name)
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (rotation == null)
            {
                return NotFound();
            }

            return Ok(rotation);            
        }

        // POST api/rotations
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Rotation>> CreateRotation([FromBody] RotationCreateDTO rotation)
        {
            var newRotation = new Rotation
            {
                Name = rotation.Name
            };

            await _context.Rotations.AddAsync(newRotation);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRotationById), new { id = newRotation.RotationId }, newRotation);            
        }

        // PUT api/rotations/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Rotation>> Updaterotation(int id, [FromBody] RotationCreateDTO rotation)
        {
            try
            {
                var existingRotation = await _context.Rotations.FindAsync(id);
                if (existingRotation == null)
                {
                    var newRotation = new Rotation
                    {
                        Name = rotation.Name
                    };

                    await _context.Rotations.AddAsync(newRotation);

                    await _context.SaveChangesAsync();

                    return CreatedAtAction(nameof(GetRotationById), new { id = newRotation.RotationId }, newRotation);
                }

                existingRotation.Name = rotation.Name;
                _context.Entry(existingRotation).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(existingRotation);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating rotation.");
            }
        }

        // DELETE api/rotations/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deleterotation(int id)
        {
            var rotation = await _context.Rotations.FindAsync(id);
            if (rotation == null)
            {
                return NotFound();
            }

            _context.Rotations.Remove(rotation);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET /api/rotations/1/assessments
        [HttpGet("{id}/assessments")]
        public async Task<ActionResult<IEnumerable<AssessmentType>>> GetAssessmentsForRotation(int id)
        {
            var rotation = await _context.Rotations
                .AsNoTracking()
                .Include(r => r.RotationAssessments)
                .ThenInclude(ra => ra.AssessmentType)
                .FirstOrDefaultAsync(r => r.RotationId == id);

            if (rotation == null)
            {
                return NotFound();
            }

            var assessmentTypes = rotation.RotationAssessments
                .Select(ra => ra.AssessmentType)
                .ToList();

            return Ok(assessmentTypes);
        }
    }
}
