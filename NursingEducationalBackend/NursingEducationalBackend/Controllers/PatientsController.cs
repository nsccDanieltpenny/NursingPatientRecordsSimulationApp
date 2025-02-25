using Microsoft.AspNetCore.Mvc;
using NursingEducationalBackend.Models;

namespace NursingEducationalBackend
{
    [ApiController]
    [Route("[controller]")]
    public class PatientController : ControllerBase
    {
        private static readonly List<Patient> Patients = new List<Patient>
        {
            new Patient {
                BedNumber = 1,
                Name = "Lambert, Christina",
                Dob = "1985-03-15",
                MaritalStatus = "Married",
                Height = "5'6\"",
                Weight = "140 lbs",
                NextOfKin = "John Lambert",
                Phone = "555-0123",
                AdmissionReason = "Pneumonia",
                RoamAlert = false,
                Allergies = "Penicillin",
                MedicalHistory = "Asthma",
                IsolationPrecautions = "None"
            },
            new Patient { BedNumber = 2, Name = "Dodge, Leonard"},
            new Patient { BedNumber = 3, Name = "Jackson, Lawrence"},
            new Patient { BedNumber = 4, Name = "Nurse, Finley"},
            new Patient { BedNumber = 5, Name = "Conway, Julie"},
            new Patient { BedNumber = 6, Name = "Jackson, Lola"},
            new Patient { BedNumber = 7, Name = "Littlefeather, Simon"},
            new Patient { BedNumber = 8, Name = "Kojima, Hideo"},
            new Patient { BedNumber = 9, Name = "Latimore, Coretta"},
            new Patient { BedNumber = 10, Name = "Long, Sacheen"},
            new Patient { BedNumber = 11, Name = "Green, Thomas"},
            new Patient { BedNumber = 12, Name = "Brown, Harriett"},
            new Patient { BedNumber = 13, Name = "Aliat Camryn"},
            new Patient { BedNumber = 14, Name = "Sanchez, Jean-Phillipe"},
            new Patient { BedNumber = 15, Name = "Dangle, Jim"},
        };

        private readonly ILogger<PatientController> _logger;

        public PatientController(ILogger<PatientController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Patient> Get()
        {
            return Patients;
        }

        [HttpGet("{id}")]
        public ActionResult<Patient> GetById(int id)
        {
            var patient = Patients.FirstOrDefault(p => p.BedNumber == id);
            if (patient == null)
            {
                return NotFound();
            }
            return patient;
        }
    }
}
