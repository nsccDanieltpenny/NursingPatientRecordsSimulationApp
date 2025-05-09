using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    // DTO for creating a new class
    public class CreateClassRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public DateOnly? StartDate { get; set; }
        
        public DateOnly? EndDate { get; set; }
        
        public int? InstructorId { get; set; }
        
        public string Campus { get; set; }
    }
    
    // DTO for updating an existing class
    public class UpdateClassRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public DateOnly? StartDate { get; set; }
        
        public DateOnly? EndDate { get; set; }
        
        public int? InstructorId { get; set; }
        
        public string Campus { get; set; }
    }
    
    // DTO for class response
    public class ClassResponse
    {
        public int ClassId { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public DateOnly? StartDate { get; set; }
        
        public DateOnly? EndDate { get; set; }
        
        public int? InstructorId { get; set; }
        
        public string InstructorName { get; set; }
        
        public string Campus { get; set; }
        
        public int StudentCount { get; set; }
    }
    
    // DTO for assigning a student to a class
    public class AssignStudentRequest
    {
        [Required]
        public int NurseId { get; set; }
    }
    
    // DTO for bulk student assignment
    public class BulkStudentAssignmentRequest
    {
        [Required]
        public List<int> NurseIds { get; set; }
    }
    
    // DTO for student in class response
    public class StudentInClassResponse
    {
        public int NurseId { get; set; }
        
        public string FullName { get; set; }
        
        public string StudentNumber { get; set; }
        
        public string Email { get; set; }
        
        public string Campus { get; set; }
    }
}