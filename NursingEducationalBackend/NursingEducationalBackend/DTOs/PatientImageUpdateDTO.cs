using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientImageUpdateDTO
    {
        // Blob name returned by the image function's ImageUpload endpoint
        [Required]
        [MaxLength(255)]
        public string ImageFilename { get; set; } = string.Empty;
    }
}
