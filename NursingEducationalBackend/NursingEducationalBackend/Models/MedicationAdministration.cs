using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models
{
    public class MedicationAdministration
    {
        [Key]
        public int AdministrationId { get; set; } 

        [Required]
        public int MedicationOrderId { get; set; }

        [Required]
        public int NurseId { get; set; }

        [Required]
        public int RotationId { get; set; }

        public string DueAt { get; set; } // Matches string type from diagram

        [Required]
        public string Status { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DoseGiven { get; set; }

        public DateTime? GivenAt { get; set; }
        public string PrnReason { get; set; }
        public string NotGivenReason { get; set; }
        public string Comment { get; set; }
        public string WarningsOverridden { get; set; }

        [Required]
        public DateTime ChartedAt { get; set; } = DateTime.UtcNow;

        public string ResponseEffective { get; set; }
        public int? ResponsePainScore { get; set; }
        public string ResponseComment { get; set; }
        public DateTime? ResponseAt { get; set; }
        public int? ResponseByNurseId { get; set; }

        // Navigation properties
        public virtual Rotation Rotation { get; set; }

        [ForeignKey("NurseId")]
        public virtual Nurse AdministeredByNurse { get; set; }

        [ForeignKey("ResponseByNurseId")]
        public virtual Nurse ResponseByNurse { get; set; }
    }
}
