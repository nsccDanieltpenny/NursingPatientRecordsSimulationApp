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
using OtpNet;
using System.Security.Cryptography;


namespace NursingEducationalBackend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Instructor,Nurse")]
    public class AttendanceController : ControllerBase
    {

        private readonly NursingDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;

        public AttendanceController(
            NursingDbContext context,
            UserManager<IdentityUser> userManager,
            IConfiguration config
            )
        {
            _context = context;
            _userManager = userManager;
            _config = config;
        }

    
        [HttpPost("start")]
        public IActionResult StartAttendance([FromBody] StartAttendanceDTO request)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            //CHECK FOR EXISTING RECORD FOR CURRENT DAY
            var existingAttendance = _context.Attendance
                .FirstOrDefault(a =>
                    a.ClassId == request.ClassId &&
                    a.Date >= today &&
                    a.Date < tomorrow
                );


            //USE EXISTING RECORD IF ONE EXISTS
            if (existingAttendance != null)
            {
                return Ok(new
                {
                    id = existingAttendance.Id,
                    totpKey = existingAttendance.TOTP_KEY,
                    type = request.Type
                });
            }

            // Generate 20-byte secret (standard for SHA1 TOTP)
            var keyBytes = KeyGeneration.GenerateRandomKey(20);

            // Convert to BASE32
            var base32Key = Base32Encoding.ToString(keyBytes);

            var attendance = new Attendance
            {
                ClassId = request.ClassId,
                Date = DateTime.UtcNow,
                TOTP_KEY = base32Key
            };

            _context.Attendance.Add(attendance);
            _context.SaveChanges();

            return Ok(new
            {
                id = attendance.Id,
                totpKey = base32Key,
                type = request.Type
            });
        }

        [AllowAnonymous]
        [HttpGet("checkin")]
        public IActionResult CheckIn([FromQuery] int id, [FromQuery] string code,[FromQuery] string type)
        {
            var attendance = _context.Attendance.FirstOrDefault(a => a.Id == id);
           
            var frontendUrl = _config["Frontend:BaseUrl"];

            if (attendance == null)
            {
                return Redirect("/attendance/failed");
            }

            try
                {
                    // Convert stored BASE32 key back to bytes
                    var keyBytes = Base32Encoding.ToBytes(attendance.TOTP_KEY);

                    var totp = new Totp(keyBytes, step: 15, mode: OtpHashMode.Sha1, totpSize: 6);

                    // Allow small clock drift (±1 step)
                    var isValid = totp.VerifyTotp(
                        code,
                        out long timeStepMatched,
                        new VerificationWindow(previous: 1, future: 1)
                    );

                    if (!isValid)
                    {
                        return Redirect($"{frontendUrl}/attendance/failed");
                    }
                }
                catch
                {
                    return Redirect($"{frontendUrl}/attendance/failed");
                }

            //Ticket created if code valid
            var ticket = Guid.NewGuid().ToString();

            _context.AttendanceTicket.Add(new AttendanceTicket
            {
                AttendanceId = id,
                Ticket = ticket,
                Expiry = DateTime.UtcNow.AddMinutes(5),
                Type = type
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
                .Any(r => r.AttendanceId == ticketEntry.AttendanceId 
                    && r.NurseId == nurseId 
                    && r.Method == "QR-IN");

            bool alreadyCheckedOut = _context.AttendanceRecord
                .Any(r => r.AttendanceId == ticketEntry.AttendanceId 
                    && r.NurseId == nurseId 
                    && r.Method == "QR-OUT");

            if (ticketEntry.Type == "IN")
            {
                if (!alreadyCheckedIn)
                {
                    _context.AttendanceRecord.Add(new AttendanceRecord
                    {
                        AttendanceId = ticketEntry.AttendanceId,
                        NurseId = nurseId,
                        Method = "QR-IN",
                        TimeStamp = DateTime.UtcNow
                    });
                }
            }
            else if (ticketEntry.Type == "OUT")
            {
                if (!alreadyCheckedIn)
                {
                    return BadRequest(new { message = "Must check in first" });
                }

                if (!alreadyCheckedOut)
                {
                    _context.AttendanceRecord.Add(new AttendanceRecord
                    {
                        AttendanceId = ticketEntry.AttendanceId,
                        NurseId = nurseId,
                        Method = "QR-OUT",
                        TimeStamp = DateTime.UtcNow
                    });
                }
            }

            _context.AttendanceTicket.Remove(ticketEntry);
            _context.SaveChanges();

            return Ok(new 
            { 
                success = true,
                alreadyCheckedIn,
                alreadyCheckedOut
            });
        }



        [AllowAnonymous]
        [HttpGet("list")]
        public IActionResult GetAttendanceList(int? id, DateTime? date)
        {
            
            if ((id.HasValue && date.HasValue) || (!id.HasValue && !date.HasValue))
            {
                return BadRequest("Provide either 'id' OR 'date', but not both.");
            }

            Attendance attendance;

            if (id.HasValue)
            {
                // by ID
                attendance = _context.Attendance
                    .FirstOrDefault(a => a.Id == id.Value);

                if (attendance == null)
                    return NotFound();
            }
            else
            {
                // by Date
                attendance = _context.Attendance
                    .FirstOrDefault(a => a.Date.Date == date.Value.Date); 

                if (attendance == null)
                    return NotFound();
            }

            var classEntity = _context.Classes
                .Include(c => c.Students)
                .FirstOrDefault(c => c.ClassId == attendance.ClassId);

            if (classEntity == null)
                return NotFound();

            var classList = classEntity.Students;

            var records = _context.AttendanceRecord
                .Where(r => r.AttendanceId == attendance.Id)
                .ToList();

            var result = classList.Select(s =>
            {
                var studentRecords = records
                    .Where(r => r.NurseId == s.NurseId)
                    .ToList();

                bool checkedIn = studentRecords.Any(r => r.Method == "QR-IN");
                bool checkedOut = studentRecords.Any(r => r.Method == "QR-OUT");

                return new
                {
                    id = s.NurseId,
                    name = s.FullName,
                    checkedIn,
                    checkedOut,
                    status = checkedOut
                        ? "Complete"
                        : checkedIn
                            ? "Checked In"
                            : "Absent"
                };
            });

            return Ok(result);
        }




    }



}