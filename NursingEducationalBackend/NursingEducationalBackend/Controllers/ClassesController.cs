using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;


namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly NursingDbContext _context;

        public ClassesController(NursingDbContext context)
        {
            _context = context;
        }

        // GET: api/Classes
        [HttpGet]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<IEnumerable<Class>>> GetClasses()
        {
            if (User.IsInRole("Admin"))
            {
                var overviews = await _context.Classes
                    .AsNoTracking()
                    .Select(c => new ClassOverviewDTO
                    {
                        ID = c.ClassId,
                        Name = c.Name,
                        Description = c.Description,
                        JoinCode = c.JoinCode,
                        InstructorId = c.InstructorId,
                        StartDate = c.StartDate,
                        EndDate = c.EndDate,
                        StudentCount = c.Students!.Count > 0 ? c.Students.Count : 0
                    })
                    .ToListAsync();

                return Ok(overviews);
            }
            else
            {
                // Get instructor identity from claims
                var nurseIdClaim = User.FindFirst("NurseId")?.Value;
                if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int instructorId))
                {
                    return Unauthorized("Instructor profile not found.");
                }

                var overviews = await _context.Classes
                    .AsNoTracking()
                    .Select(c => new ClassOverviewDTO
                    {
                        ID = c.ClassId,
                        Name = c.Name,
                        Description = c.Description,
                        JoinCode = c.JoinCode,
                        InstructorId = c.InstructorId,
                        StartDate = c.StartDate,
                        EndDate = c.EndDate,
                        StudentCount = c.Students!.Count > 0 ? c.Students.Count : 0
                    })
                    .Where(c => c.InstructorId == instructorId)
                    .ToListAsync();

                return Ok(overviews);
            }
        }

        // GET: api/Classes/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Instructor,Nurse")]
        public async Task<ActionResult<Class>> GetClass(int id)
        {

            var cls = await _context.Classes
                .Include(c => c.Campus)
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.ClassId == id);

            if (cls == null) return NotFound();

            return cls;

        }

        // GET: api/Classes/{id}/students
        [HttpGet("{id}/students")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetClassStudents(int id)
        {
            var classExists = await _context.Classes.FindAsync(id);
            if (classExists == null) return NotFound(new { message = "Class not found" });

            var studentsFromClass = await _context.Nurses
                .Where(n => n.ClassId == id)
                .Select(n => new
                {
                    NurseId = n.NurseId,
                    FullName = n.FullName,
                    StudentNumber = n.StudentNumber,
                    Email = n.Email,
                    ClassId = n.ClassId,
                })
                .ToListAsync();

            return Ok(studentsFromClass);
}
            public class StudentCsvRow
            {
                public string FullName {get; set;}
                public string Email {get; set;}
                public string StudentNumber {get; set;}
            }
            // POST: api/Classes/{id}/students
            [HttpPost("{id}/students")]
            [Authorize(Roles = "Admin,Instructor")]
            public async Task<ActionResult> UploadStudentsCsv(int id, [FromBody] JsonElement body)
            {
                if (!body.TryGetProperty("csv", out var csvElement))
                    return BadRequest(new { message = "CSV content missing" });

                string csv = csvElement.GetString();

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
                MissingFieldFound = null,
                BadDataFound = null
            };
            List<StudentCsvRow> rows;
            using (var reader = new StringReader(csv))
            using (var csvReader = new CsvReader(reader,config) )
            {
                rows = csvReader.GetRecords<StudentCsvRow>().ToList();
            }

                    foreach (var r in rows)
                    {
                        var nurse = await _context.Nurses
                            .FirstOrDefaultAsync(n => n.StudentNumber == r.StudentNumber);

                        if (nurse == null)
                        {
                            _context.Nurses.Add(new Nurse
                            {
                                FullName = r.FullName,
                                Email = r.Email,
                                StudentNumber = r.StudentNumber,
                                ClassId = id
                            });
                }
                else
                {
                    nurse.FullName = r.FullName;
                    nurse.Email = r.Email;
                    nurse.ClassId = id;
                }
               
                }
            await _context.SaveChangesAsync();
            return Ok();
            }
             // delete: api/Classes/{id}/students/delete
            [HttpPost("{id}/students/delete")]
            [Authorize(Roles = "Admin,Instructor")]
            public async Task<ActionResult> DeleteStudentsCsv(int id, [FromBody] JsonElement body)
            {
                if (!body.TryGetProperty("csv", out var csvElement))
                    return BadRequest(new { message = "CSV content missing" });

                string csv = csvElement.GetString();
                
                var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = true,
                    TrimOptions = TrimOptions.Trim,
                    MissingFieldFound = null,
                    BadDataFound = null
                };
                List<StudentCsvRow> rows;
                using (var reader = new StringReader(csv))
                using (var csvReader = new CsvReader(reader, config))
                {
                    rows = csvReader.GetRecords<StudentCsvRow>().ToList();
                }
                var studentNumbers = rows
                    .Select(r => r.StudentNumber)
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .ToList();

                var nurses = await _context.Nurses
                    .Where(n => n.ClassId == id && studentNumbers.Contains(n.StudentNumber))
                    .ToListAsync();

                _context.Nurses.RemoveRange(nurses);
                await _context.SaveChangesAsync();

                return Ok();
            }

        // Verify join codes
        [HttpGet("verify/{id}")]
        public async Task<ActionResult> VerifyJoinCode(string id)
        {
            var classByCode = await _context.Classes.Where(c => c.JoinCode == id).FirstOrDefaultAsync();
            if (classByCode == null)
            {
                return NotFound();
            }

            return Ok();
        }

        // GET: api/campus/{campusId}/classes
        [HttpGet("/api/campus/{campusId}/classes")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Class>>> GetClassesByCampus(int campusId)
        {
            return await _context.Classes
                .Where(c => c.CampusId == campusId)
                .ToListAsync();
        }

        // POST: api/campus/{campusId}/classes
        [HttpPost("/api/campus/{campusId}/classes")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<Class>> CreateClassInCampus(int campusId, Class newClass)
        {
            newClass.CampusId = campusId;

            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();

           
            return CreatedAtAction(nameof(GetClass), new { id = newClass.ClassId }, newClass);
        }

        // PUT: api/Classes/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> PutClass(int id, Class @class)
        {
            if (id != @class.ClassId)
            {
                return BadRequest();
            }

            _context.Entry(@class).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassExists(id))
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

        // POST: api/Classes
        [HttpPost]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<Class>> PostClass(ClassCreateDTO @class)
        {
            // Get instructor identity from claims
            var nurseIdClaim = User.FindFirst("NurseId")?.Value;
            if (string.IsNullOrEmpty(nurseIdClaim) || !int.TryParse(nurseIdClaim, out int instructorId))
            {
                return Unauthorized("Instructor profile not found.");
            }

            // int instructorId = instructor.NurseId;

            Class newClass = new()
            {
                Name = @class.Name,
                Description = @class.Description ?? "",
                StartDate = @class.StartDate,
                EndDate = @class.EndDate,
                JoinCode = GenerateJoinCode(),
                InstructorId = instructorId,
                CampusId = @class.CampusId 
            };

            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();

            ClassOverviewDTO newClassDTO = new()
            {
                ID = newClass.ClassId,
                Name = newClass.Name,
                Description = newClass.Description,
                JoinCode = newClass.JoinCode,
                InstructorId = newClass.InstructorId,
                StartDate = newClass.StartDate,
                EndDate = newClass.EndDate,
                StudentCount = newClass.Students?.Count ?? 0
            };

            return CreatedAtAction(nameof(GetClass), new { id = newClassDTO.ID }, newClassDTO);
        }

        
        [HttpPut("{id}/remove-campus")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> RemoveCampusFromClass(int id)
        {
            var cls = await _context.Classes.FindAsync(id);
            if (cls == null)
                return NotFound();

            // Because CampusId is NOT nullable, move to a special value (0 or -1)
            cls.CampusId = 0; 

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // DELETE: api/Classes/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var @class = await _context.Classes.FindAsync(id);
            if (@class == null)
            {
                return NotFound();
            }

            _context.Classes.Remove(@class);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClassExists(int id)
        {
            return _context.Classes.Any(e => e.ClassId == id);
        }

        private string GenerateJoinCode()
        {
            const int codeLength = 6;
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var random = new Random();

            while (true)
            {
                string generatedCode = new string(Enumerable.Repeat(validChars, codeLength)
                    .Select(s => s[random.Next(validChars.Length)]).ToArray());

                bool codeExists = _context.Classes.Any(c => c.JoinCode == generatedCode);

                if (!codeExists)
                {
                    return generatedCode;
                }
            }
        }
    }
}
