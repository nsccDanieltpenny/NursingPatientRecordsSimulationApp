using System.ComponentModel.DataAnnotations;

namespace NursingEducationalBackend.Models

{
    public class AttendanceTickets
    {
        [Key]
        public int AttendanceId {get; set;}

        public string Tickets {get; set;}

        public DateTime Expiry {get; set;}
    }
}