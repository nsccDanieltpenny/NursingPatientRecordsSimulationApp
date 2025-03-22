using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class NurseLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}