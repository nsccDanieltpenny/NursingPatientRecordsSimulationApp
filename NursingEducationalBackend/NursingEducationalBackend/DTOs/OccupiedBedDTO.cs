namespace NursingEducationalBackend.DTOs
{
    public class OccupiedBedDTO
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Unit { get; set; }
        public int BedNumber { get; set; }
    }
}