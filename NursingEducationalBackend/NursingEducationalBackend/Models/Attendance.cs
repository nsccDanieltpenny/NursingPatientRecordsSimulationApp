using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models

{
    public class Attendance
{
    [Key]
    public int AttendanceId { get; set; } 

    public int ClassId {get; set;}

    public DateTime Date {get; set;}

    public string TOTP_KEY {get;set;}
}
}