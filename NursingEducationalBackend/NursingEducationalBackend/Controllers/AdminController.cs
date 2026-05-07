using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Models.Assessments;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly NursingDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public AdminController(NursingDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Preview records deletion         
        [HttpPost("records/cleanup-preview")]
        public async Task<ActionResult<CleanupResultDTO>> PreviewRecordsCleanup([FromBody] CleanupFilterDTO filter)
        {
            try
            {
                var query = BuildRecordsQuery(filter);
                var records = await query.Include(r => r.AssessmentSubmissions).ToListAsync();

                var assessmentCount = records.Sum(r => r.AssessmentSubmissions.Count);

                return Ok(new CleanupResultDTO
                {
                    RecordsDeleted = records.Count,
                    AssessmentsDeleted = assessmentCount,
                    StudentsDeleted = 0,
                    ExecutedAt = DateTime.UtcNow,
                    ExecutedBy = User.Identity?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error previewing records cleanup", error = ex.Message });
            }
        }

        // Delete records based on filter
        [HttpDelete("records/cleanup")]
        public async Task<ActionResult<CleanupResultDTO>> CleanupRecords([FromBody] CleanupFilterDTO filter)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var query = BuildRecordsQuery(filter);
                var records = await query
                    .Include(r => r.AssessmentSubmissions)
                    .ThenInclude(a => a.AssessmentType)
                    .ToListAsync();

                int assessmentCount = 0;

                // Delete assessments for each record
                foreach (var record in records)
                {
                    foreach (var submission in record.AssessmentSubmissions)
                    {
                        await DeleteAssessmentByType(submission.AssessmentTypeId, submission.TableRecordId);
                        assessmentCount++;
                    }

                    // Delete assessment submissions
                    _context.AssessmentSubmissions.RemoveRange(record.AssessmentSubmissions);
                }

                // Delete records
                _context.Records.RemoveRange(records);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new CleanupResultDTO
                {
                    RecordsDeleted = records.Count,
                    AssessmentsDeleted = assessmentCount,
                    StudentsDeleted = 0,
                    ExecutedAt = DateTime.UtcNow,
                    ExecutedBy = User.Identity?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error cleaning up records", error = ex.Message });
            }
        }

        // Preview student deletion
        [HttpPost("nurses/cleanup-preview")]
        public async Task<ActionResult<CleanupResultDTO>> PreviewNursesCleanup([FromBody] CleanupFilterDTO filter)
        {
            try
            {
                var query = BuildNursesQuery(filter);
                var nurses = await query.ToListAsync();

                return Ok(new CleanupResultDTO
                {
                    RecordsDeleted = 0,
                    AssessmentsDeleted = 0,
                    StudentsDeleted = nurses.Count,
                    ExecutedAt = DateTime.UtcNow,
                    ExecutedBy = User.Identity?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error previewing nurses cleanup", error = ex.Message });
            }
        }

        // Delete students based on filter
        [HttpDelete("nurses/cleanup")]
        public async Task<ActionResult<CleanupResultDTO>> CleanupNurses([FromBody] CleanupFilterDTO filter)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var query = BuildNursesQuery(filter);
                var nurses = await query.ToListAsync();

                int deletedCount = 0;

                foreach (var nurse in nurses)
                {
                    // Delete from AspNetUsers if email exists
                    if (!string.IsNullOrEmpty(nurse.Email))
                    {
                        var identityUser = await _userManager.FindByEmailAsync(nurse.Email);
                        if (identityUser != null)
                        {
                            await _userManager.DeleteAsync(identityUser);
                        }
                    }

                    // Delete from Nurses table
                    _context.Nurses.Remove(nurse);
                    deletedCount++;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new CleanupResultDTO
                {
                    RecordsDeleted = 0,
                    AssessmentsDeleted = 0,
                    StudentsDeleted = deletedCount,
                    ExecutedAt = DateTime.UtcNow,
                    ExecutedBy = User.Identity?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error cleaning up nurses", error = ex.Message });
            }
        }

        // Helper method to build records query based on filters
        private IQueryable<Record> BuildRecordsQuery(CleanupFilterDTO filter)
        {
            var query = _context.Records.AsQueryable();

            if (filter.ClassId.HasValue)
            {
                query = query.Where(r => r.Nurse.ClassId == filter.ClassId.Value);
            }

            if (filter.StudentId.HasValue)
            {
                query = query.Where(r => r.NurseId == filter.StudentId.Value);
            }

            if (filter.BeforeDate.HasValue)
            {
                query = query.Where(r => r.CreatedDate < filter.BeforeDate.Value);
            }

            if (filter.RotationId.HasValue)
            {
                query = query.Where(r => r.RotationId == filter.RotationId.Value);
            }

            return query;
        }

        // Helper method to build nurses query based on filters
        private IQueryable<Nurse> BuildNursesQuery(CleanupFilterDTO filter)
        {
            // Only target students (non-instructors)
            var query = _context.Nurses.Where(n => !n.IsInstructor);

            if (filter.ClassId.HasValue)
            {
                query = query.Where(n => n.ClassId == filter.ClassId.Value);
            }

            if (filter.StudentId.HasValue)
            {
                query = query.Where(n => n.NurseId == filter.StudentId.Value);
            }

            return query;
        }

        // Helper method to delete assessment by type
        private async Task DeleteAssessmentByType(int assessmentTypeId, int tableRecordId)
        {
            switch ((AssessmentTypeEnum)assessmentTypeId)
            {
                case AssessmentTypeEnum.ADL:
                    var adl = await _context.Adls.FindAsync(tableRecordId);
                    if (adl != null) _context.Adls.Remove(adl);
                    break;

                case AssessmentTypeEnum.Behaviour:
                    var behaviour = await _context.Behaviours.FindAsync(tableRecordId);
                    if (behaviour != null) _context.Behaviours.Remove(behaviour);
                    break;

                case AssessmentTypeEnum.Cognitive:
                    var cognitive = await _context.Cognitives.FindAsync(tableRecordId);
                    if (cognitive != null) _context.Cognitives.Remove(cognitive);
                    break;

                case AssessmentTypeEnum.Elimination:
                    var elimination = await _context.Eliminations.FindAsync(tableRecordId);
                    if (elimination != null) _context.Eliminations.Remove(elimination);
                    break;

                case AssessmentTypeEnum.MobilityAndSafety:
                    var mobility = await _context.MobilityAndSafeties.FindAsync(tableRecordId);
                    if (mobility != null) _context.MobilityAndSafeties.Remove(mobility);
                    break;

                case AssessmentTypeEnum.Nutrition:
                    var nutrition = await _context.Nutritions.FindAsync(tableRecordId);
                    if (nutrition != null) _context.Nutritions.Remove(nutrition);
                    break;

                case AssessmentTypeEnum.ProgressNote:
                    var progressNote = await _context.ProgressNotes.FindAsync(tableRecordId);
                    if (progressNote != null) _context.ProgressNotes.Remove(progressNote);
                    break;

                case AssessmentTypeEnum.SkinAndSensoryAid:
                    var skin = await _context.SkinAndSensoryAids.FindAsync(tableRecordId);
                    if (skin != null) _context.SkinAndSensoryAids.Remove(skin);
                    break;

                case AssessmentTypeEnum.AcuteProgress:
                    var acuteProgress = await _context.AcuteProgresses.FindAsync(tableRecordId);
                    if (acuteProgress != null) _context.AcuteProgresses.Remove(acuteProgress);
                    break;

                case AssessmentTypeEnum.LabsDiagnosticsAndBlood:
                    var labs = await _context.LabsDiagnosticsAndBloods.FindAsync(tableRecordId);
                    if (labs != null) _context.LabsDiagnosticsAndBloods.Remove(labs);
                    break;

                case AssessmentTypeEnum.DischargeChecklist:
                    var discharge = await _context.DischargeChecklists.FindAsync(tableRecordId);
                    if (discharge != null) _context.DischargeChecklists.Remove(discharge);
                    break;

                case AssessmentTypeEnum.ConsultCurrentIllness:
                    var consult = await _context.Consults.FindAsync(tableRecordId);
                    if (consult != null) _context.Consults.Remove(consult);
                    break;

                case AssessmentTypeEnum.NEWS2:
                    var news2 = await _context.NEWS2s.FindAsync(tableRecordId);
                    if (news2 != null) _context.NEWS2s.Remove(news2);
                    break;
            }
        }
    }
}