using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using NursingEducationalBackend.Models;

/////////////////////////////////////////////
// This controller uses the 'nurses' model to 
// hard-code data for frontend development
/////////////////////////////////////////////

namespace NursingEducationalBackend 
{
    [ApiController]
    [Route("[controller]")]
    public class NurseController : ControllerBase
    {

        
        private static readonly List<Nurse> Nurses = new List<Nurse>
        {
            new Nurse {
                NurseId = 001,
                NurseFullName = "Dylan Cunningham",
                Email = "dylan@helth.com",
                Password = "helth"
            },
            new Nurse {
                NurseId = 002,
                NurseFullName = "Tsira Mamaladze",
                Email = "tsira@helth.com",
                Password = "helth"
            },
            new Nurse {
                NurseId = 003,
                NurseFullName = "Kangjie Su",
                Email = "kangjie@helth.com",
                Password = "helth",
            },
            new Nurse {
                NurseId = 004,
                NurseFullName = "Mitchell Yeltman",
                Email = "mitchell@helth.com",
                Password = "helth",
            },
        };

        private readonly ILogger<NurseController> _logger;

        public NurseController(ILogger<NurseController> logger) 
        {   
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Nurse> Get() 
        {
            return Nurses;
        }

        
        [HttpGet("{id}")]
        public ActionResult<Nurse> Get(int id) {
            var nurse = Nurses.FirstOrDefault(n => n.NurseId == id);
            if (nurse == null)
            {
                return NotFound();
            }
            return nurse;
        }

        /// <summary>
        /// This C# function handles the login process for nurses, checking the provided credentials and
        /// returning nurse details if successful.
        /// </summary>
        /// <param name="LoginRequest">Takes a `LoginRequest` object as input, which likely contains
        /// properties for `Email` and `Password`.</param>
        /// <returns>
        /// This function takes in a `LoginRequest` object from the request body, checks if the email and password are provided,
        /// then searches for a nurse in a collection ("Nurses") that matches the provided email and
        /// password.
        /// </returns>
        [HttpPost("login")]
        public ActionResult<Nurse> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password)) 
            {
                return BadRequest("Invalid login.. try again!");
            }

            //seek nurse with matching email and password
            var nurse = Nurses.FirstOrDefault(n => n.Email == loginRequest.Email && n.Password == loginRequest.Password);
            
            //Error handling, nurse must have been added 
            // to the system to be able to log-in.
            if (nurse == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            //return nurse details (excluding password)
            return Ok(new
            {
                nurse.NurseId,
                nurse.NurseFullName,
                nurse.Email
            });
        } 
    }

    //Sample model class for login request
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}