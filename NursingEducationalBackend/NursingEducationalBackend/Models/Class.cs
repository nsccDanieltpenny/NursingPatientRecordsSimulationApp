using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models
{
    public partial class Class
    {
        [Key]
        public int ClassId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public DateOnly? StartDate { get; set; }
        
        public DateOnly? EndDate { get; set; }
        
        public int? InstructorId { get; set; }
        
        public string Campus { get; set; }
        
        // Navigation property for the optional instructor (a nurse who teaches the class)
        public virtual Nurse Instructor { get; set; }
        
        // Navigation property for students in this class (one-to-many)
        public virtual ICollection<Nurse> Students { get; set; } = new List<Nurse>();
    }
}