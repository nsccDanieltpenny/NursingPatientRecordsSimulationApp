using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NursingEducationalBackend.Controllers
{
    /// <summary>
    /// Admin controller for managing users and patient data
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Ensure only admins can access these endpoints
    [Produces("application/json")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly NursingDbContext _context;

        public AdminController(
            UserManager<IdentityUser> userManager,
            NursingDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// Deletes a user by email
        /// </summary>
        /// <param name="email">Email address of the user to delete</param>
        /// <returns>Result of the delete operation</returns>
        /// <response code="200">User deleted successfully</response>
        /// <response code="404">User not found</response>
        /// <response code="400">Failed to delete user</response>
        /// <response code="500">Server error occurred</response>
        [HttpDelete("users/{email}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUser(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
            {
                return BadRequest(new { Success = false, Message = "Invalid email format." });
            }

            // Find the user by email
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound(new { Success = false, Message = "User not found." });

            // Check if user is the last admin
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (isAdmin)
            {
                var adminUsers = await _userManager.GetUsersInRoleAsync("Admin");
                if (adminUsers.Count <= 1)
                {
                    return BadRequest(new { Success = false, Message = "Cannot delete the last admin user." });
                }
            }

            // Find the associated nurse record
            var nurse = await _context.Nurses.FirstOrDefaultAsync(n => n.Email == email);
            
            // Begin a transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Check if nurse has associated patients
                if (nurse != null)
                {
                    var hasPatients = await _context.Patients.AnyAsync(p => p.NurseId == nurse.NurseId);
                    if (hasPatients)
                    {
                        return BadRequest(new { Success = false, Message = "Cannot delete user as they have associated patients. Reassign patients first." });
                    }
                    
                    _context.Nurses.Remove(nurse);
                    await _context.SaveChangesAsync();
                }

                // Delete the identity user
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { Success = false, Message = "Failed to delete user.", Errors = result.Errors });
                }

                await transaction.CommitAsync();
                return Ok(new { Success = true, Message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Success = false, Message = "An error occurred while deleting the user.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Resets a user's password
        /// </summary>
        /// <param name="email">Email address of the user</param>
        /// <param name="model">New password information</param>
        /// <returns>Result of password reset operation</returns>
        /// <response code="200">Password reset successful</response>
        /// <response code="400">Invalid model or password reset failed</response>
        /// <response code="404">User not found</response>
        [HttpPost("users/{email}/reset-password")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ResetUserPassword(string email, [FromBody] ResetPasswordRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
            {
                return BadRequest(new { Success = false, Message = "Invalid email format." });
            }

            // Validate password complexity
            if (!IsPasswordComplex(model.NewPassword))
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "Password must meet complexity requirements: at least 8 characters, including uppercase, lowercase, number, and special character."
                });
            }

            // Find the user by email
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound(new { Success = false, Message = "User not found." });

            try
            {
                // Generate password reset token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                
                // Reset the password
                var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
                if (!result.Succeeded)
                    return BadRequest(new { Success = false, Message = "Password reset failed.", Errors = result.Errors });

                // Log the password reset action
                Console.WriteLine($"Password reset for user {email} by admin {User.Identity.Name} at {DateTime.UtcNow}");

                return Ok(new { Success = true, Message = "Password reset successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while resetting the password.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Resets the admin's own password
        /// </summary>
        /// <param name="model">Password change request containing current and new passwords</param>
        /// <returns>Result of password change operation</returns>
        /// <response code="200">Password changed successfully</response>
        /// <response code="400">Invalid model or password change failed</response>
        /// <response code="404">Current user not found</response>
        [HttpPost("reset-my-password")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ResetAdminPassword([FromBody] ChangePasswordRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate password complexity
            if (!IsPasswordComplex(model.NewPassword))
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "Password must meet complexity requirements: at least 8 characters, including uppercase, lowercase, number, and special character."
                });
            }

            // Ensure new password is different from current password
            if (model.CurrentPassword == model.NewPassword)
            {
                return BadRequest(new { Success = false, Message = "New password must be different from current password." });
            }

            try
            {
                // Get the current user
                var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);
                if (currentUser == null)
                    return NotFound(new { Success = false, Message = "User not found." });

                // Verify the current password is correct
                if (!await _userManager.CheckPasswordAsync(currentUser, model.CurrentPassword))
                {
                    return BadRequest(new { Success = false, Message = "Current password is incorrect." });
                }

                // Change the password
                var result = await _userManager.ChangePasswordAsync(currentUser, model.CurrentPassword, model.NewPassword);
                if (!result.Succeeded)
                    return BadRequest(new { Success = false, Message = "Password change failed.", Errors = result.Errors });

                // Log the password change action
                Console.WriteLine($"Admin {User.Identity.Name} changed their password at {DateTime.UtcNow}");

                return Ok(new { Success = true, Message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while changing the password.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Updates a patient's information except for PatientId
        /// </summary>
        /// <param name="patientId">ID of the patient to update</param>
        /// <param name="model">Updated patient information</param>
        /// <returns>Result of the update operation and the updated patient</returns>
        /// <response code="200">Patient updated successfully</response>
        /// <response code="400">Invalid model or patient wrist ID already exists</response>
        /// <response code="404">Patient not found</response>
        /// <response code="500">Server error occurred</response>
        [HttpPut("patients/{patientId}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdatePatient(int patientId, [FromBody] UpdatePatientRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the patient
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null)
                return NotFound(new { Success = false, Message = "Patient not found." });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate PatientWristId uniqueness if it's being changed
                if (patient.PatientWristId != model.PatientWristId)
                {
                    var existingPatientWithWristId = await _context.Patients
                        .AsNoTracking()
                        .FirstOrDefaultAsync(p => p.PatientWristId == model.PatientWristId && p.PatientId != patientId);

                    if (existingPatientWithWristId != null)
                    {
                        return BadRequest(new { Success = false, Message = "Patient wrist ID already exists." });
                    }
                }

                // Validate nurse exists if provided
                if (model.NurseId.HasValue)
                {
                    var nurseExists = await _context.Nurses.AnyAsync(n => n.NurseId == model.NurseId.Value);
                    if (!nurseExists)
                    {
                        return BadRequest(new { Success = false, Message = "Specified nurse does not exist." });
                    }
                }

                // Validate date constraints
                if (model.DischargeDate.HasValue && model.DischargeDate.Value < model.AdmissionDate)
                {
                    return BadRequest(new { Success = false, Message = "Discharge date cannot be earlier than admission date." });
                }

                // Check if DoB is at least one year ago
                var oneYearAgo = DateOnly.FromDateTime(DateTime.Now.AddYears(-1));
                if (model.Dob > oneYearAgo)
                {
                    return BadRequest(new { Success = false, Message = "Date of birth must be at least one year in the past." });
                }

                // Update patient properties except for PatientId
                patient.NurseId = model.NurseId;
                patient.ImageFilename = model.ImageFilename;
                patient.BedNumber = model.BedNumber;
                patient.NextOfKin = model.NextOfKin;
                patient.NextOfKinPhone = model.NextOfKinPhone;
                patient.FullName = model.FullName;
                patient.Sex = model.Sex;
                patient.PatientWristId = model.PatientWristId;
                patient.Dob = model.Dob;
                patient.AdmissionDate = model.AdmissionDate;
                patient.DischargeDate = model.DischargeDate;
                patient.MaritalStatus = model.MaritalStatus;
                patient.MedicalHistory = model.MedicalHistory;
                patient.Weight = model.Weight;
                patient.Height = model.Height;
                patient.Allergies = model.Allergies;
                patient.IsolationPrecautions = model.IsolationPrecautions;
                patient.Unit = model.Unit;
                patient.RoamAlertBracelet = model.RoamAlertBracelet;

                // Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                return Ok(new { Success = true, Message = "Patient updated successfully.", Patient = patient });
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                
                // Handle unique constraint violation for PatientWristId
                if (ex.InnerException?.Message.Contains("IX_Patients_PatientWristId") == true)
                {
                    return BadRequest(new { Success = false, Message = "Patient wrist ID already exists." });
                }
                
                return StatusCode(500, new { Success = false, Message = "An error occurred while updating the patient.", Error = ex.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Success = false, Message = "An error occurred while updating the patient.", Error = ex.Message });
            }
        }

        /// <summary>
        /// Creates a new admin account
        /// </summary>
        /// <param name="model">Admin registration data</param>
        /// <returns>Result of the admin creation operation</returns>
        /// <response code="200">Admin created successfully</response>
        /// <response code="400">Invalid model or admin creation failed</response>
        /// <response code="500">Server error occurred</response>
        [HttpPost("create-admin")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            if (string.IsNullOrWhiteSpace(model.Email) || !IsValidEmail(model.Email))
            {
                return BadRequest(new { Success = false, Message = "Invalid email format." });
            }

            // Validate password complexity
            if (!IsPasswordComplex(model.Password))
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "Password must meet complexity requirements: at least 8 characters, including uppercase, lowercase, number, and special character."
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Check if email already exists
                var userExists = await _userManager.FindByEmailAsync(model.Email);
                if (userExists != null)
                    return BadRequest(new { Success = false, Message = "Email already exists!" });

                // Create Identity user
                var user = new IdentityUser
                {
                    Email = model.Email,
                    UserName = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(new { Success = false, Message = "Admin creation failed! Please check user details and try again.", Errors = result.Errors });

                // Add user to Admin role
                var roleResult = await _userManager.AddToRoleAsync(user, "Admin");
                if (!roleResult.Succeeded)
                {
                    // Rollback if role assignment fails
                    await _userManager.DeleteAsync(user);
                    await transaction.RollbackAsync();
                    return BadRequest(new { Success = false, Message = "Failed to assign Admin role.", Errors = roleResult.Errors });
                }

                // Create Nurse record
                var nurse = new Nurse
                {
                    Email = model.Email,
                    FullName = model.FullName,
                    StudentNumber = model.StudentNumber,
                    Campus = model.Campus
                };

                await _context.Nurses.AddAsync(nurse);
                await _context.SaveChangesAsync();

                // Add NurseId claim
                await _userManager.AddClaimAsync(user, new Claim("NurseId", nurse.NurseId.ToString()));

                // Add Campus claim if provided
                if (!string.IsNullOrEmpty(nurse.Campus))
                {
                    await _userManager.AddClaimAsync(user, new Claim("Campus", nurse.Campus));
                }

                await transaction.CommitAsync();
                
                return Ok(new { Success = true, Message = "Admin account created successfully!", NurseId = nurse.NurseId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Success = false, Message = "An error occurred while creating the admin account.", Error = ex.Message });
            }
        }
        
        // Helper method to validate email format
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
        
        // Helper method to validate password complexity
        private bool IsPasswordComplex(string password)
        {
            return password.Length >= 8 && 
                   password.Any(char.IsUpper) && 
                   password.Any(char.IsLower) && 
                   password.Any(char.IsDigit) && 
                   password.Any(c => !char.IsLetterOrDigit(c));
        }
    }
}