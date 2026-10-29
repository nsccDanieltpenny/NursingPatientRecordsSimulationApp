using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models
{
    public class MedicationOrder
    {
        [Key]
        public int MedicationOrderId { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int DrugId { get; set; }

        [Required]
        public int OrderedByNurseId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Dose { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DoseMax { get; set; }

        public string DoseUnit { get; set; }
        public string Form { get; set; }
        public string Route { get; set; }
        public string Frequency { get; set; }
        public string DueTimes { get; set; }
        public string PrnReasons { get; set; }
        public int? MinIntervalMinutes { get; set; }
        public string InstructorNote { get; set; }

        [Required]
        public DateTime StartAt { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DiscontinuedAt { get; set; }
        public int? DiscontinuedByNurseId { get; set; }
        public string DiscontinueReason { get; set; }

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual Drug Drug { get; set; }

        [ForeignKey("OrderedByNurseId")]
        public virtual Nurse OrderedByNurse { get; set; }

        [ForeignKey("DiscontinuedByNurseId")]
        public virtual Nurse DiscontinuedByNurse { get; set; }

        public virtual ICollection<MedicationAdministration> Administrations { get; set; } = new List<MedicationAdministration>();
    }
}
