using System;

namespace NursingEducationalBackend.Models.Assessments
{
    public class DoctorOrder
    {
        public int DoctorOrderId { get; set; }
        public int PatientId { get; set; }
        public string OrderText { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedByNurseId { get; set; }
        public DateTime? ReadAt { get; set; }
        public int? ReadByNurseId { get; set; }
        // Optionally, add a field for status or priority in the future
        public virtual Patient Patient { get; set; }
    }
}