using Microsoft.EntityFrameworkCore;

namespace NursingEducationalBackend.Models
{
    [PrimaryKey(nameof(RotationId), nameof(AssessmentTypeId))]
    public class RotationAssessment
    {
        public int RotationId { get; set; }
        public int AssessmentTypeId { get; set; }

        public virtual Rotation Rotation { get; set; }
        public virtual AssessmentType AssessmentType { get; set; }
    }
}
