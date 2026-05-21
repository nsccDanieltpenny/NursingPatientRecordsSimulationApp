using System;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class DoctorOrderDTO
    {
        public int DoctorOrderId { get; set; }
        public int PatientId { get; set; }
        public string OrderText { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedByNurseId { get; set; }
        public DateTime? ReadAt { get; set; }
        public int? ReadByNurseId { get; set; }
        public string CreatedByName { get; set; } // Optional: for display
        public string ReadByName { get; set; } // Optional: for display
    }
}