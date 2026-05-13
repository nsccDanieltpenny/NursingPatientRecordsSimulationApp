using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.DTOs;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public RecordsController(NursingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Instructor, Nurse")]
        public async Task<ActionResult<IEnumerable<PatientHistoryRecordDTO>>> GetRecords([FromQuery] DateOnly? date, [FromQuery] int? classId)
        {
            var query = _context.Records
                .AsNoTracking()
                .Include(r => r.Nurse)
                .Include(r => r.Patient)
                .Include(r => r.Rotation)
                .Include(r => r.AssessmentSubmissions)
                    .ThenInclude(asub => asub.AssessmentType)
                .AsQueryable();

            // Filter by date if provided
            if (date.HasValue)
            {
                query = query.Where(r => DateOnly.FromDateTime(r.CreatedDate) == date.Value);
            }

            // Filter by classId if provided
            if (classId.HasValue)
            {
                query = query.Where(r => r.Nurse.ClassId == classId.Value);
            }

            var records = await query
                .Select(r => new PatientHistoryRecordDTO
                {
                    RecordId = r.RecordId,
                    SubmittedDate = r.CreatedDate,
                    NurseId = r.NurseId,
                    SubmittedNurse = r.Nurse.FullName,
                    PatientId = r.PatientId,
                    PatientName = r.Patient.FullName,
                    RotationId = r.RotationId,
                    RotationName = r.Rotation.Name,
                    AssessmentSubmissions = r.AssessmentSubmissions.Select(asub => new AssessmentSubmissionSummaryDTO
                    {
                        SubmissionId = asub.Id,
                        AssessmentTypeId = asub.AssessmentTypeId,
                        AssessmentTypeName = asub.AssessmentType.Name,
                        TableRecordId = asub.TableRecordId
                    }).ToList()
                })
                .ToListAsync();

            return Ok(records);
        }

    }
}
