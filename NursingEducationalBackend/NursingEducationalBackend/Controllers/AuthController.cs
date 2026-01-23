using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly NursingDbContext _context;

        public AuthController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            NursingDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        private string GenerateJwtToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
                _configuration["JwtSettings:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(_configuration["JwtSettings:DurationInMinutes"])),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // New MSAL/Entra endpoints
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            // Get Entra user ID from token (try multiple claim types)
            var entraUserId = User.FindFirst("oid")?.Value 
                ?? User.FindFirst("sub")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            
            // Get email from token (try multiple claim types)
            var email = User.FindFirst("preferred_username")?.Value 
                ?? User.FindFirst(ClaimTypes.Email)?.Value 
                ?? User.FindFirst("email")?.Value
                ?? User.FindFirst("upn")?.Value
                ?? User.FindFirst(ClaimTypes.Upn)?.Value
                ?? User.FindFirst("unique_name")?.Value;

            if (string.IsNullOrEmpty(entraUserId) && string.IsNullOrEmpty(email))
                return BadRequest(new { Message = "Unable to identify user from token" });

            // Look up nurse by EntraUserId or email (but don't match on null EntraUserId)
            Nurse? nurse = null;
            
            if (!string.IsNullOrEmpty(entraUserId))
            {
                // Try to find by EntraUserId first
                nurse = await _context.Nurses
                    .Include(n => n.Class)
                    .FirstOrDefaultAsync(n => n.EntraUserId == entraUserId);
            }
            
            if (nurse == null && !string.IsNullOrEmpty(email))
            {
                // If not found by EntraUserId, try email
                nurse = await _context.Nurses
                    .Include(n => n.Class)
                    .FirstOrDefaultAsync(n => n.Email == email);
            }


            if (nurse == null)
                return NotFound(); // User needs to enroll

            // If nurse exists but doesn't have EntraUserId linked, link it now
            if (string.IsNullOrEmpty(nurse.EntraUserId) && !string.IsNullOrEmpty(entraUserId))
            {
                nurse.EntraUserId = entraUserId;
                await _context.SaveChangesAsync();
            }

            // Get user from Identity to check roles
            var identityUser = await _userManager.FindByEmailAsync(nurse.Email);
            if (identityUser != null)
            {
                var roles = await _userManager.GetRolesAsync(identityUser);
                
                return Ok(new
                {
                    nurseId = nurse.NurseId,
                    email = nurse.Email,
                    fullName = nurse.FullName,
                    classId = nurse.ClassId,
                    className = nurse.Class?.Name,
                    isInstructor = nurse.IsInstructor,
                    isValid = nurse.IsValid,
                    roles = roles.ToList()
                });
            }
            else
            {
                // Identity user not found - this should not happen
                return BadRequest("Something when wrong when logging in. Please try signing in with your microsoft account or contact an administrator.");
            }
        }

        [HttpPost("provision")]
        [Authorize]
        public async Task<IActionResult> ProvisionUser([FromBody] ProvisionRequest request)
        {
            // Get Entra user ID from token (try multiple claim types)
            var entraUserId = User.FindFirst("oid")?.Value 
                ?? User.FindFirst("sub")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            
            // Get email from token (try multiple claim types)
            var email = User.FindFirst("preferred_username")?.Value 
                ?? User.FindFirst(ClaimTypes.Email)?.Value 
                ?? User.FindFirst("email")?.Value
                ?? User.FindFirst("upn")?.Value
                ?? User.FindFirst(ClaimTypes.Upn)?.Value
                ?? User.FindFirst("unique_name")?.Value;
                
            var fullName = User.FindFirst("name")?.Value ?? request.FullName;

            if (string.IsNullOrEmpty(email))
                return BadRequest(new { Message = "Unable to identify user email from token" });

            // Check if user already exists (split query to avoid null matching issues)
            Nurse? existingNurse = null;
            
            if (!string.IsNullOrEmpty(entraUserId))
            {
                existingNurse = await _context.Nurses
                    .Include(n => n.Class)
                    .FirstOrDefaultAsync(n => n.EntraUserId == entraUserId);
            }
            
            if (existingNurse == null)
            {
                existingNurse = await _context.Nurses
                    .Include(n => n.Class)
                    .FirstOrDefaultAsync(n => n.Email == email);
            }

            if (existingNurse != null)
                return BadRequest(new { Message = "User already exists" });

            // Check if we got a request code
            var instructorCode = _configuration["InstructorRequestCode"];
            var adminCode = _configuration["AdminRequestCode"];
            var isInstructorRequest = request.ClassCode?.Trim().Equals(instructorCode, StringComparison.Ordinal) == true;
            var isAdminRequest = !String.IsNullOrWhiteSpace(adminCode) && adminCode.Length >= 16 && request.ClassCode?.Trim().Equals(adminCode, StringComparison.Ordinal) == true;

            Nurse nurse;
            IdentityUser identityUser;

            if (isInstructorRequest)
            {

                if (request.StudentNumber == null || request.StudentNumber.Length != 8 || !request.StudentNumber.StartsWith('W'))
                {
                    return BadRequest("Invalid W Number");
                }

                // Create instructor request (pending approval)
                nurse = new Nurse
                {
                    EntraUserId = entraUserId,
                    Email = email,
                    FullName = fullName,
                    StudentNumber = request.StudentNumber,
                    ClassId = null,
                    IsInstructor = true,
                    IsValid = false // Requires admin approval
                };

                // Create Identity user without role (will be assigned after approval)
                identityUser = new IdentityUser
                {
                    Email = email,
                    UserName = email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(identityUser);
                if (!result.Succeeded)
                    return BadRequest(new { Message = "User creation failed", Errors = result.Errors });

                await _context.Nurses.AddAsync(nurse);
                await _context.SaveChangesAsync();

                await _userManager.AddClaimAsync(identityUser, new Claim("NurseId", nurse.NurseId.ToString()));

                return Ok(new
                {
                    success = true,
                    message = "Instructor request submitted. Please wait for administrator approval.",
                    needsApproval = true,
                    nurseId = nurse.NurseId,
                    email = nurse.Email,
                    fullName = nurse.FullName,
                    isInstructor = true,
                    isValid = false,
                    roles = new List<string>()
                });
            }
            else if (isAdminRequest)
            {
                if (request.StudentNumber == null || request.StudentNumber.Length != 8 || !request.StudentNumber.StartsWith('W'))
                {
                    return BadRequest("Invalid W Number");
                }

                // Create nurse entry
                nurse = new Nurse
                {
                    EntraUserId = entraUserId,
                    Email = email,
                    FullName = fullName,
                    StudentNumber = request.StudentNumber,
                    IsInstructor = true,
                    IsValid = true
                };

                // Create Identity user with Admin role
                identityUser = new IdentityUser
                {
                    Email = email,
                    UserName = email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(identityUser);
                if (!result.Succeeded)
                    return BadRequest(new { Message = "User creation failed", Errors = result.Errors });

                await _context.Nurses.AddAsync(nurse);
                await _context.SaveChangesAsync();

                await _userManager.AddToRoleAsync(identityUser, "Admin");
                await _userManager.AddClaimAsync(identityUser, new Claim("NurseId", nurse.NurseId.ToString()));

                return Ok(new
                {
                    success = true,
                    message = "Admin provisioned successfully",
                    nurseId = nurse.NurseId,
                    email = nurse.Email,
                    fullName = nurse.FullName,
                    isInstructor = true,
                    isValid = true,
                    roles = new List<string>()
                });
            }
            else
            {
                // Verify class code
                var classEntity = await _context.Classes.FirstOrDefaultAsync(c => c.JoinCode == request.ClassCode.ToUpper());
                if (classEntity == null)
                    return BadRequest(new { Message = "Invalid class code" });

                // Create nurse/student
                nurse = new Nurse
                {
                    EntraUserId = entraUserId,
                    Email = email,
                    FullName = fullName,
                    StudentNumber = email.Substring(0, 8),
                    ClassId = classEntity.ClassId,
                    IsInstructor = false,
                    IsValid = true
                };

                // Create Identity user with Nurse role
                identityUser = new IdentityUser
                {
                    Email = email,
                    UserName = email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(identityUser);
                if (!result.Succeeded)
                    return BadRequest(new { Message = "User creation failed", Errors = result.Errors });

                await _context.Nurses.AddAsync(nurse);
                await _context.SaveChangesAsync();

                await _userManager.AddToRoleAsync(identityUser, "Nurse");
                await _userManager.AddClaimAsync(identityUser, new Claim("NurseId", nurse.NurseId.ToString()));

                return Ok(new
                {
                    success = true,
                    message = "User provisioned successfully",
                    nurseId = nurse.NurseId,
                    email = nurse.Email,
                    fullName = nurse.FullName,
                    classId = nurse.ClassId,
                    className = classEntity.Name,
                    isInstructor = false,
                    isValid = true,
                    roles = new List<string>()
                });
            }
        }

        [HttpGet("instructor-code")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetInstructorCode()
        {
            var code = _configuration["InstructorRequestCode"];
            return Ok(new { code });
        }
    }
}
