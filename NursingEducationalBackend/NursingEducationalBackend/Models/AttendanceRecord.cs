using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models

{
    public class AttendanceRecord
    {
    [Key]
    public int Id { get; set; } 
 
    public int AttendanceId { get; set; } 

    public int NurseId {get; set;}

    public string Method {get; set;}

    public DateTime TimeStamp {get; set;}

    public Attendance Attendance { get; set; }


    }
}