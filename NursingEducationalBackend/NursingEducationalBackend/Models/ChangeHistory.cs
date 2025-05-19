using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models
{
    /// <summary>
    /// Tracks changes to entities in the database for audit purposes.
    /// Records the previous value when a field is updated.
    /// </summary>
    [Table("ChangeHistory")]
    public class ChangeHistory
    {
        /// <summary>
        /// Primary key for the change history record
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChangeHistoryId { get; set; }
        
        /// <summary>
        /// The type of entity that was changed (e.g., "Elimination", "Mobility")
        /// </summary>
        [Required]
        [StringLength(100)]
        public string EntityType { get; set; }
        
        /// <summary>
        /// The ID of the specific entity that was changed
        /// </summary>
        [Required]
        public int EntityId { get; set; }
        
        /// <summary>
        /// The name of the attribute/property that was changed
        /// </summary>
        [Required]
        [StringLength(100)]
        public string AttributeName { get; set; }
        
        /// <summary>
        /// The previous value before the change
        /// New value is stored in the actual entity
        /// </summary>
        [Column(TypeName = "nvarchar(max)")]
        public string OldValue { get; set; }
        
        /// <summary>
        /// The date and time when the change occurred (UTC)
        /// </summary>
        [Required]
        public DateTime ChangeDate { get; set; }
        
        /// <summary>
        /// The ID of the nurse who made the change
        /// </summary>
         [StringLength(128)]
        public string? NurseId { get; set; }  // Added ? to make it nullable

        /// <summary>
        /// The source of the change (e.g., "Web Portal", "API", "System")
        /// </summary>
        [StringLength(50)]
        public string Source { get; set; }
        
        /// <summary>
        /// Identifies the specific operation performed
        /// </summary>
        [StringLength(10)]
        public string Operation { get; set; } = "UPDATE";
        
        /// <summary>
        /// Additional context or metadata about the change (JSON format)
        /// </summary>
        [Column(TypeName = "nvarchar(max)")]
        public string Metadata { get; set; }
        
        /// <summary>
        /// Default constructor
        /// </summary>
        public ChangeHistory()
        {
            ChangeDate = DateTime.UtcNow;
        }
    }
}