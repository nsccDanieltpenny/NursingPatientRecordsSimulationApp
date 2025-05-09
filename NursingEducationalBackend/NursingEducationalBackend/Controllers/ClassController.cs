using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Only admins can manage classes
    [Produces("application/json")]
    public class ClassController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public ClassController(NursingDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all classes
        /// </summary>
        /// <returns>List of all classes with student counts</returns>
        /// 
        /// 
        /// 
        [HttpGet]
        [ProducesResponseType(typeof(List<ClassResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllClasses()
        {
            var classes = await _context.Classes
                .Include(c => c.Instructor)
                .Include(c => c.Students)
                .Select(c => new ClassResponse
                {
                    ClassId = c.ClassId,
                    Name = c.Name,
                    Description = c.Description,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.FullName,
                    Campus = c.Campus,
                    StudentCount = c.Students.Count
                })
                .ToListAsync();

            return Ok(classes);
        }

        /// <summary>
        /// Gets a specific class by ID
        /// </summary>
        /// <param name="classId">ID of the class to retrieve</param>
        /// <returns>Details of the requested class</returns>
        [HttpGet("{classId}")]
        [ProducesResponseType(typeof(ClassResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetClassById(int classId)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Instructor)
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.ClassId == classId);

            if (classEntity == null)
                return NotFound(new { Success = false, Message = "Class not found." });

            var classResponse = new ClassResponse
            {
                ClassId = classEntity.ClassId,
                Name = classEntity.Name,
                Description = classEntity.Description,
                StartDate = classEntity.StartDate,
                EndDate = classEntity.EndDate,
                InstructorId = classEntity.InstructorId,
                InstructorName = classEntity.Instructor?.FullName,
                Campus = classEntity.Campus,
                StudentCount = classEntity.Students.Count
            };

            return Ok(classResponse);
        }

        /// <summary>
        /// Creates a new class
        /// </summary>
        /// <param name="model">Class creation data</param>
        /// <returns>Details of the created class</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ClassResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate instructor exists if provided
            if (model.InstructorId.HasValue)
            {
                var instructorExists = await _context.Nurses.AnyAsync(n => n.NurseId == model.InstructorId.Value);
                if (!instructorExists)
                {
                    return BadRequest(new { Success = false, Message = "Specified instructor does not exist." });
                }
            }

            // Validate date range
            if (model.StartDate.HasValue && model.EndDate.HasValue && model.EndDate.Value < model.StartDate.Value)
            {
                return BadRequest(new { Success = false, Message = "End date cannot be earlier than start date." });
            }

            var classEntity = new Class
            {
                Name = model.Name,
                Description = model.Description,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                InstructorId = model.InstructorId,
                Campus = model.Campus
            };

            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();

            var response = new ClassResponse
            {
                ClassId = classEntity.ClassId,
                Name = classEntity.Name,
                Description = classEntity.Description,
                StartDate = classEntity.StartDate,
                EndDate = classEntity.EndDate,
                InstructorId = classEntity.InstructorId,
                Campus = classEntity.Campus,
                StudentCount = 0
            };

            if (classEntity.InstructorId.HasValue)
            {
                var instructor = await _context.Nurses.FindAsync(classEntity.InstructorId.Value);
                response.InstructorName = instructor?.FullName;
            }

            return CreatedAtAction(nameof(GetClassById), new { classId = classEntity.ClassId }, response);
        }

        /// <summary>
        /// Updates an existing class
        /// </summary>
        /// <param name="classId">ID of the class to update</param>
        /// <param name="model">Updated class data</param>
        /// <returns>Result of the update operation</returns>
        [HttpPut("{classId}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateClass(int classId, [FromBody] UpdateClassRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var classEntity = await _context.Classes.FindAsync(classId);
            if (classEntity == null)
                return NotFound(new { Success = false, Message = "Class not found." });

            // Validate instructor exists if provided
            if (model.InstructorId.HasValue)
            {
                var instructorExists = await _context.Nurses.AnyAsync(n => n.NurseId == model.InstructorId.Value);
                if (!instructorExists)
                {
                    return BadRequest(new { Success = false, Message = "Specified instructor does not exist." });
                }
            }

            // Validate date range
            if (model.StartDate.HasValue && model.EndDate.HasValue && model.EndDate.Value < model.StartDate.Value)
            {
                return BadRequest(new { Success = false, Message = "End date cannot be earlier than start date." });
            }

            // Update class properties
            classEntity.Name = model.Name;
            classEntity.Description = model.Description;
            classEntity.StartDate = model.StartDate;
            classEntity.EndDate = model.EndDate;
            classEntity.InstructorId = model.InstructorId;
            classEntity.Campus = model.Campus;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Success = true, Message = "Class updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while updating the class.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a class
        /// </summary>
        /// <param name="classId">ID of the class to delete</param>
        /// <returns>Result of the delete operation</returns>
        [HttpDelete("{classId}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteClass(int classId)
        {
            var classEntity = await _context.Classes.FindAsync(classId);
            if (classEntity == null)
                return NotFound(new { Success = false, Message = "Class not found." });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Update students to remove them from this class
                var studentsInClass = await _context.Nurses
                    .Where(n => n.ClassId == classId)
                    .ToListAsync();

                foreach (var student in studentsInClass)
                {
                    student.ClassId = null;
                }

                await _context.SaveChangesAsync();
                
                // Then delete the class
                _context.Classes.Remove(classEntity);
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                return Ok(new { Success = true, Message = "Class deleted successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Success = false, Message = "An error occurred while deleting the class.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Gets all students in a class
        /// </summary>
        /// <param name="classId">ID of the class</param>
        /// <returns>List of students in the class</returns>
        [HttpGet("{classId}/students")]
        [ProducesResponseType(typeof(List<StudentInClassResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStudentsInClass(int classId)
        {
            var classExists = await _context.Classes.AnyAsync(c => c.ClassId == classId);
            if (!classExists)
                return NotFound(new { Success = false, Message = "Class not found." });

            var students = await _context.Nurses
                .Where(n => n.ClassId == classId)
                .Select(n => new StudentInClassResponse
                {
                    NurseId = n.NurseId,
                    FullName = n.FullName,
                    StudentNumber = n.StudentNumber,
                    Email = n.Email,
                    Campus = n.Campus
                })
                .ToListAsync();

            return Ok(students);
        }
/// <summary>
/// Gets all nurses available for class assignment
/// </summary>
/// <returns>List of all nurses with their basic info</returns>

[HttpGet("nurses")]
[ProducesResponseType(typeof(List<Nurse>), StatusCodes.Status200OK)]
public async Task<IActionResult> GetAllNurses()
{
    try
    {
        var nurses = await _context.Nurses
            .Select(n => new
            {
                n.NurseId,
                n.FullName,
                n.StudentNumber,
                n.Email,
                n.Campus,
                n.ClassId
            })
            .ToListAsync();

        return Ok(nurses);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { Success = false, Message = "An error occurred while retrieving nurses.", Error = ex.Message });
    }
}
        /// <summary>
        /// Assigns a student to a class
        /// </summary>
        /// <param name="classId">ID of the class</param>
        /// <param name="model">Student assignment data</param>
        /// <returns>Result of the assignment operation</returns>
        [HttpPost("{classId}/students")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AssignStudentToClass(int classId, [FromBody] AssignStudentRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if class exists
            var classEntity = await _context.Classes.FindAsync(classId);
            if (classEntity == null)
                return NotFound(new { Success = false, Message = "Class not found." });

            // Check if student exists
            var student = await _context.Nurses.FindAsync(model.NurseId);
            if (student == null)
                return NotFound(new { Success = false, Message = "Student not found." });

            // Check if student is already in a class
            if (student.ClassId.HasValue)
            {
                if (student.ClassId == classId)
                {
                    return BadRequest(new { Success = false, Message = "Student is already assigned to this class." });
                }
                
                // If student is in a different class, update from old class to new class
                student.ClassId = classId;
                await _context.SaveChangesAsync();
                return Ok(new { Success = true, Message = "Student reassigned to new class successfully." });
            }

            // Check campus match (optional validation)
            if (!string.IsNullOrEmpty(classEntity.Campus) && !string.IsNullOrEmpty(student.Campus) && 
                classEntity.Campus != student.Campus)
            {
                return BadRequest(new { Success = false, Message = "Student campus does not match class campus." });
            }

            // Assign student to class
            student.ClassId = classId;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Success = true, Message = "Student assigned to class successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while assigning student to class.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Assigns multiple students to a class
        /// </summary>
        /// <param name="classId">ID of the class</param>
        /// <param name="model">Bulk student assignment data</param>
        /// <returns>Result of the bulk assignment operation</returns>
        [HttpPost("{classId}/students/bulk")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AssignMultipleStudentsToClass(int classId, [FromBody] BulkStudentAssignmentRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (model.NurseIds == null || !model.NurseIds.Any())
                return BadRequest(new { Success = false, Message = "No student IDs provided." });

            // Check if class exists
            var classEntity = await _context.Classes.FindAsync(classId);
            if (classEntity == null)
                return NotFound(new { Success = false, Message = "Class not found." });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var addedCount = 0;
                var alreadyAssignedCount = 0;
                var reassignedCount = 0;
                var notFoundCount = 0;

                foreach (var nurseId in model.NurseIds)
                {
                    // Check if student exists
                    var student = await _context.Nurses.FindAsync(nurseId);
                    if (student == null)
                    {
                        notFoundCount++;
                        continue;
                    }

                    // Check if student is already in this class
                    if (student.ClassId == classId)
                    {
                        alreadyAssignedCount++;
                        continue;
                    }
                    
                    // Check if student is in a different class
                    if (student.ClassId.HasValue && student.ClassId != classId)
                    {
                        student.ClassId = classId;
                        reassignedCount++;
                        continue;
                    }

                    // Assign student to class
                    student.ClassId = classId;
                    addedCount++;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new 
                { 
                    Success = true, 
                    Message = $"Bulk assignment complete: {addedCount} students added, {reassignedCount} students reassigned, {alreadyAssignedCount} already in class, {notFoundCount} not found." 
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Success = false, Message = "An error occurred during bulk assignment.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Removes a student from a class
        /// </summary>
        /// <param name="classId">ID of the class</param>
        /// <param name="nurseId">ID of the student</param>
        /// <returns>Result of the removal operation</returns>
        [HttpDelete("{classId}/students/{nurseId}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveStudentFromClass(int classId, int nurseId)
        {
            var student = await _context.Nurses.FindAsync(nurseId);
            
            if (student == null)
                return NotFound(new { Success = false, Message = "Student not found." });
                
            if (student.ClassId != classId)
                return NotFound(new { Success = false, Message = "Student is not in this class." });

            try
            {
                student.ClassId = null;
                await _context.SaveChangesAsync();
                return Ok(new { Success = true, Message = "Student removed from class successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while removing student from class.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Gets the class that a student is in
        /// </summary>
        /// <param name="nurseId">ID of the student</param>
        /// <returns>Class information for the student</returns>
        [HttpGet("students/{nurseId}")]
        [ProducesResponseType(typeof(ClassResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]


        
        public async Task<IActionResult> GetStudentClass(int nurseId)
        {
            var student = await _context.Nurses
                .Include(n => n.Class)
                .ThenInclude(c => c.Instructor)
                .FirstOrDefaultAsync(n => n.NurseId == nurseId);

            if (student == null)
                return NotFound(new { Success = false, Message = "Student not found." });

            if (student.Class == null)
                return NotFound(new { Success = false, Message = "Student is not assigned to any class." });

            var classResponse = new ClassResponse
            {
                ClassId = student.Class.ClassId,
                Name = student.Class.Name,
                Description = student.Class.Description,
                StartDate = student.Class.StartDate,
                EndDate = student.Class.EndDate,
                InstructorId = student.Class.InstructorId,
                InstructorName = student.Class.Instructor?.FullName,
                Campus = student.Class.Campus,
                StudentCount = await _context.Nurses.CountAsync(n => n.ClassId == student.Class.ClassId)
            };

            return Ok(classResponse);
        }
    }
}