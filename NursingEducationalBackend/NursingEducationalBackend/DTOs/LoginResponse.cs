namespace NursingEducationalBackend.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public int NurseId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}