using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.DTOs
{
    public class PatientBehaviourDTO
    {
        public int BehaviourId { get; set; }
        public string Report { get; set; } = null!;
    }
}
