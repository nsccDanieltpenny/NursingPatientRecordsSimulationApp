using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public partial class Campus
    {
        [Key]
        public int CampusId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [MaxLength(200)]
        public string? Address { get; set; }

        public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
    }
}