using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using NursingEducationalBackend.Models.Assessments;
using NursingEducationalBackend.Utilities;
using System.Security.Claims;
using System.Linq;

namespace NursingEducationalBackend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Instructor,Nurse")]
    public class AttendanceController : ControllerBase
    {

        private readonly NursingDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public AttendanceController(
            NursingDbContext context,
            UserManager<IdentityUser> userManager
            )
        {
            _context = context;
            _userManager = userManager;
        }

        
        
        [HttpPost("start")]
        public IActionResult StartAttendance([FromBody] StartAttendanceDTO request)
        {
            var attendance = new Attendance
            {
                ClassId = request.ClassId,
                Date = DateTime.UtcNow,
                TOTP_KEY = "test-secret", // HARDCODE TEST, NEEDS TO SUPPORT TOTP LATER
            };

            _context.Attendance.Add(attendance);
            _context.SaveChanges();

            return Ok(new
            {
                id = attendance.Id,
                totpKey = attendance.TOTP_KEY
            });
        }

        [AllowAnonymous]
        [HttpGet("checkin")]
        public IActionResult CheckIn([FromQuery] int id, [FromQuery] string code)
        {
            var attendance = _context.Attendance.FirstOrDefault(a => a.Id == id);
           
            var frontendUrl = "http://localhost:5173"; //MOVE TO CONFIG LATER

            if (attendance == null)
            {
                return Redirect("/attendance/failed");
            }

            //  FAKE validation (accept any code for now) CHANGE TO VALIDATE REAL TOTP CODES
            var ticket = Guid.NewGuid().ToString();

            _context.AttendanceTicket.Add(new AttendanceTicket
            {
                AttendanceId = id,
                Ticket = ticket,
                Expiry = DateTime.UtcNow.AddMinutes(5)
            });

            _context.SaveChanges();

            return Redirect($"{frontendUrl}/attendance/checkin?ticket={ticket}");
        }

        [HttpPost("checkticket")]
        public IActionResult CheckTicket([FromBody] CheckTicketDTO request)
        {
            var ticketEntry = _context.AttendanceTicket
                .FirstOrDefault(t => t.Ticket == request.Ticket);

            if (ticketEntry == null)
                return NotFound();

            if (ticketEntry.Expiry < DateTime.UtcNow)
                return StatusCode(410, "Ticket expired");

            var nurseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "NurseId");

            if (nurseIdClaim == null)
                return Unauthorized(new { message = "Missing NurseId claim" });

            if (!int.TryParse(nurseIdClaim.Value, out int nurseId))
                return BadRequest(new { message = "Invalid NurseId format" });


            bool alreadyCheckedIn = _context.AttendanceRecord
                .Any(r => r.AttendanceId == ticketEntry.AttendanceId && r.NurseId == nurseId);


            if (!alreadyCheckedIn)
                {
                    _context.AttendanceRecord.Add(new AttendanceRecord
                    {
                        AttendanceId = ticketEntry.AttendanceId,
                        NurseId = nurseId,
                        Method = "QR",
                        TimeStamp = DateTime.UtcNow
                    });
                }

            _context.AttendanceTicket.Remove(ticketEntry);
            _context.SaveChanges();

            return Ok(new 
            { 
                success = true,
                alreadyCheckedIn = alreadyCheckedIn
            });
        }

        [HttpGet("list")]
        public IActionResult GetAttendanceList(int id)
        {
    
            var attendance = _context.Attendance.FirstOrDefault(a => a.Id == id);

            if (attendance == null)
                return NotFound();

            var classEntity = _context.Classes
                .Include(c => c.Students)
                .FirstOrDefault(c => c.ClassId == attendance.ClassId);

            if (classEntity == null)
                return NotFound();

            var classList = classEntity.Students;

            var records = _context.AttendanceRecord
                .Where(r => r.AttendanceId == id)
                .ToList();

            var result = classList.Select(s => new
            {
                id = s.NurseId,
                name = s.FullName,
                attended = records.Any(r => r.NurseId == s.NurseId)
            });

            return Ok(result);
        }



    }



}