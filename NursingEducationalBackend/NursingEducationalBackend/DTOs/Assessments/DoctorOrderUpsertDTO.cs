using System;

namespace NursingEducationalBackend.DTOs.Assessments
{
    public class DoctorOrderUpsertDTO
    {
        public int? DoctorOrderId { get; set; } // null for new, value for update
        public int PatientId { get; set; }
        public string OrderText { get; set; }
    }
}