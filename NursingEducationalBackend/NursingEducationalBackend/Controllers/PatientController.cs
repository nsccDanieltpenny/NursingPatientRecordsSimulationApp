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
                Name = "Dodge, Leonard",
                Dob = "1978-07-22",
                MaritalStatus = "Single",
                Height = "5'10\"",
                Weight = "180 lbs",
                NextOfKin = "Mary Dodge",
                Phone = "555-0456",
                AdmissionReason = "Hypertension",
                RoamAlert = true,
                Allergies = "None",
                MedicalHistory = "Diabetes",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 3,
                BedNumber = 3, 
                Name = "Jackson, Lawrence",
                Dob = "1990-11-05",
                MaritalStatus = "Divorced",
                Height = "6'0\"",
                Weight = "200 lbs",
                NextOfKin = "Sarah Jackson",
                Phone = "555-0789",
                AdmissionReason = "Appendicitis",
                RoamAlert = false,
                Allergies = "Shellfish",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 4,
                BedNumber = 4, 
                Name = "Nurse, Finley",
                Dob = "1982-09-14",
                MaritalStatus = "Married",
                Height = "5'8\"",
                Weight = "160 lbs",
                NextOfKin = "Alex Nurse",
                Phone = "555-0124",
                AdmissionReason = "Fractured Leg",
                RoamAlert = false,
                Allergies = "Latex",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 5,
                BedNumber = 5, 
                Name = "Conway, Julie",
                Dob = "1975-12-30",
                MaritalStatus = "Widowed",
                Height = "5'5\"",
                Weight = "150 lbs",
                NextOfKin = "Michael Conway",
                Phone = "555-0457",
                AdmissionReason = "Stroke",
                RoamAlert = true,
                Allergies = "Aspirin",
                MedicalHistory = "Hypertension",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 6,
                BedNumber = 6, 
                Name = "Jackson, Lola",
                Dob = "1988-04-18",
                MaritalStatus = "Single",
                Height = "5'7\"",
                Weight = "145 lbs",
                NextOfKin = "James Jackson",
                Phone = "555-0790",
                AdmissionReason = "Migraine",
                RoamAlert = false,
                Allergies = "None",
                MedicalHistory = "Anxiety",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 7,
                BedNumber = 7, 
                Name = "Littlefeather, Simon",
                Dob = "1995-06-25",
                MaritalStatus = "Single",
                Height = "5'9\"",
                Weight = "170 lbs",
                NextOfKin = "Emily Littlefeather",
                Phone = "555-0125",
                AdmissionReason = "Broken Arm",
                RoamAlert = false,
                Allergies = "Peanuts",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 8,
                BedNumber = 8, 
                Name = "Kojima, Hideo",
                Dob = "1963-08-24",
                MaritalStatus = "Married",
                Height = "5'11\"",
                Weight = "175 lbs",
                NextOfKin = "Yoko Kojima",
                Phone = "555-0458",
                AdmissionReason = "Heart Attack",
                RoamAlert = true,
                Allergies = "None",
                MedicalHistory = "High Cholesterol",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 9,
                BedNumber = 9, 
                Name = "Latimore, Coretta",
                Dob = "1980-02-12",
                MaritalStatus = "Divorced",
                Height = "5'4\"",
                Weight = "130 lbs",
                NextOfKin = "David Latimore",
                Phone = "555-0791",
                AdmissionReason = "Pneumonia",
                RoamAlert = false,
                Allergies = "Dust",
                MedicalHistory = "Asthma",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 10,
                BedNumber = 10, 
                Name = "Long, Sacheen",
                Dob = "1992-10-08",
                MaritalStatus = "Single",
                Height = "5'6\"",
                Weight = "140 lbs",
                NextOfKin = "Linda Long",
                Phone = "555-0126",
                AdmissionReason = "Dehydration",
                RoamAlert = false,
                Allergies = "None",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 11,
                BedNumber = 11, 
                Name = "Green, Thomas",
                Dob = "1970-05-19",
                MaritalStatus = "Married",
                Height = "6'2\"",
                Weight = "210 lbs",
                NextOfKin = "Susan Green",
                Phone = "555-0459",
                AdmissionReason = "Kidney Stones",
                RoamAlert = false,
                Allergies = "Iodine",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 12,
                BedNumber = 12, 
                Name = "Brown, Harriett",
                Dob = "1987-01-27",
                MaritalStatus = "Single",
                Height = "5'5\"",
                Weight = "155 lbs",
                NextOfKin = "Robert Brown",
                Phone = "555-0792",
                AdmissionReason = "Gallbladder Surgery",
                RoamAlert = false,
                Allergies = "None",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 13,
                BedNumber = 13, 
                Name = "Aliat Camryn",
                Dob = "1998-03-03",
                MaritalStatus = "Single",
                Height = "5'7\"",
                Weight = "145 lbs",
                NextOfKin = "Jordan Aliat",
                Phone = "555-0127",
                AdmissionReason = "Concussion",
                RoamAlert = true,
                Allergies = "None",
                MedicalHistory = "None",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 14,
                BedNumber = 14, 
                Name = "Sanchez, Jean-Phillipe",
                Dob = "1973-09-10",
                MaritalStatus = "Married",
                Height = "5'10\"",
                Weight = "185 lbs",
                NextOfKin = "Maria Sanchez",
                Phone = "555-0460",
                AdmissionReason = "Pneumonia",
                RoamAlert = false,
                Allergies = "None",
                MedicalHistory = "COPD",
                IsolationPrecautions = "None"
            },
            new Patient { 
                PatientId = 15,
                BedNumber = 15, 
                Name = "Dangle, Jim",
                Dob = "1965-12-15",
                MaritalStatus = "Divorced",
                Height = "5'9\"",
                Weight = "175 lbs",
                NextOfKin = "Karen Dangle",
                Phone = "555-0793",
                AdmissionReason = "Hip Replacement",
                RoamAlert = false,
                Allergies = "None",
                MedicalHistory = "Arthritis",
                IsolationPrecautions = "None"
            }
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