using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models

{
    public class AttendanceRecords
    {
    [Key]

    public int AttendanceId { get; set; } 

    public int NurseId {get; set;}

    public string Method {get; set;}

    public DateTime TimeStamp {get; set;}
    }
}