using Microsoft.AspNetCore.Mvc;

namespace NursingEducationalBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        [HttpGet("status")]
        public IActionResult Status()
        {
            return Ok("AI integration prototype working.");
        }
    } 
}