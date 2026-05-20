using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models

{
    public class AttendanceTicket
    {
        [Key]
        public int Id {get; set;}

        public int AttendanceId {get; set;}

        public string Ticket {get; set;}

        public string Type { get; set; }

        public DateTime Expiry {get; set;}

        public Attendance Attendance { get; set; }
    }
}