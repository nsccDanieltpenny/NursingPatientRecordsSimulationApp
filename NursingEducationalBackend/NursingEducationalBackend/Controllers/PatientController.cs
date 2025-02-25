using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using NursingEducationalBackend.Models;
using System.Linq;

namespace NursingEducationalBackend
{
    [ApiController]
    [Route("[controller]")]
    public class PatientController : ControllerBase
    {
        private static readonly List<Patient> Patients = new List<Patient>
        {
            new Patient {
                PatientId = 1,
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
            new Patient { 
                PatientId = 2,
                BedNumber = 2, 
                Name = "Dodge, Leonard"
            },
            new Patient { 
                PatientId = 3,
                BedNumber = 3, 
                Name = "Jackson, Lawrence"
            },
            new Patient { 
                PatientId = 4,
                BedNumber = 4, 
                Name = "Nurse, Finley"
            },
            new Patient { 
                PatientId = 5,
                BedNumber = 5, 
                Name = "Conway, Julie"
            },
            new Patient { 
                PatientId = 6,
                BedNumber = 6, 
                Name = "Jackson, Lola"
            },
            new Patient { 
                PatientId = 7,
                BedNumber = 7, 
                Name = "Littlefeather, Simon"
            },
            new Patient { 
                PatientId = 8,
                BedNumber = 8, 
                Name = "Kojima, Hideo"
            },
            new Patient { 
                PatientId = 9,
                BedNumber = 9, 
                Name = "Latimore, Coretta"
            },
            new Patient { 
                PatientId = 10,
                BedNumber = 10, 
                Name = "Long, Sacheen"
            },
            new Patient { 
                PatientId = 11,
                BedNumber = 11, 
                Name = "Green, Thomas"
            },
            new Patient { 
                PatientId = 12,
                BedNumber = 12, 
                Name = "Brown, Harriett"
            },
            new Patient { 
                PatientId = 13,
                BedNumber = 13, 
                Name = "Aliat Camryn"
            },
            new Patient { 
                PatientId = 14,
                BedNumber = 14, 
                Name = "Sanchez, Jean-Phillipe"
            },
            new Patient { 
                PatientId = 15,
                BedNumber = 15, 
                Name = "Dangle, Jim"
            },
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
        public ActionResult<Patient> Get(int id)
        {
            var patient = Patients.FirstOrDefault(p => p.PatientId == id);
            if (patient == null)
            {
                return NotFound();
            }
            return patient;
        }
    }
}