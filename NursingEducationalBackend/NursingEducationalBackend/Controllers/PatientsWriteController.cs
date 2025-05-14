using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NursingEducationalBackend.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NursingEducationalBackend.DTOs;
using NursingEducationalBackend.Utilities;

namespace NursingEducationalBackend.Controllers
{
    [Route("api/patients")]
    [ApiController]
    //[Authorize]
    public class PatientsWriteController : ControllerBase
    {
        private readonly NursingDbContext _context;
        private readonly PatientDataSubmissionHandler _submissionHandler;
        private const int MinBedNumber = 0;
        private const int MaxBedNumber = 15;
        
        public PatientsWriteController(NursingDbContext context)
        {
            _context = context;
            _submissionHandler = new PatientDataSubmissionHandler();
        }
        
        //Create patient
        [HttpPost("create")]
        //[Authorize]
        public async Task<ActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Validate bed number is within allowed range (0-15)
                    if (patient.BedNumber.HasValue && (patient.BedNumber < MinBedNumber || patient.BedNumber > MaxBedNumber))
                    {
                        return BadRequest($"Bed number must be between {MinBedNumber} and {MaxBedNumber}.");
                    }
                    
                    // Check if the unit and bed combination already exists
                    if (!string.IsNullOrEmpty(patient.Unit) && patient.BedNumber.HasValue)
                    {
                        bool duplicateExists = await _context.Patients
                            .AnyAsync(p => p.Unit == patient.Unit && p.BedNumber == patient.BedNumber);
                        
                        if (duplicateExists)
                        {
                            return BadRequest($"A patient is already assigned to Unit {patient.Unit}, Bed {patient.BedNumber}. This combination must be unique.");
                        }
                    }
                    
                    _context.Patients.Add(patient);
                    await _context.SaveChangesAsync();
                    _context.Records.Add(new Record { PatientId = patient.PatientId });
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest($"Unable to create patient: {ex.Message}");
                }
            }
            else
            {
                return BadRequest("Unable to create patient: Invalid model state");
            }
        }
        
        // New endpoint to retrieve occupied beds - simplified to just return bed numbers
        [HttpGet("occupied-beds")]
        //[Authorize][HttpGet("occupied-beds")]
//[Authorize]
public async Task<ActionResult<List<int>>> GetOccupiedBeds([FromQuery] string unit)
{
    if (string.IsNullOrEmpty(unit))
    {
        return BadRequest("Unit parameter is required");
    }

    try
    {
        // Query to get all occupied beds for the specified unit
        var occupiedBeds = await _context.Patients
            .Where(p => p.Unit == unit && 
                  p.BedNumber.HasValue && 
                  p.BedNumber >= MinBedNumber && 
                  p.BedNumber <= MaxBedNumber)
            .Select(p => p.BedNumber.Value)
            .OrderBy(b => b)
            .ToListAsync();
        
        return Ok(occupiedBeds);
    }
    catch (Exception ex)
    {
        return BadRequest($"Error retrieving occupied beds: {ex.Message}");
    }
}
        
        //Assign nurseId to patient
        [HttpPost("{id}/assign-nurse/{nurseId}")]
        //[Authorize]
        public async Task<ActionResult> AssignNurseToPatient(int id, int nurseId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == id);
            
            if (patient != null)
            {
                patient.NurseId = nurseId;
                _context.Update(patient);
                await _context.SaveChangesAsync();
                return Ok(new { patient.NurseId });
            }
            else
            {
                return BadRequest("Nurse id unable to be assigned");
            }
        }
        
        [HttpPost("{id}/submit-data")]
        public async Task<ActionResult> SubmitData(int id, [FromBody] Dictionary<string, object> patientData)
        {
            try
            {
                // Get patient data once outside the loop
                var patient = await _context.Patients
                    .Include(p => p.Records)
                    .FirstOrDefaultAsync(p => p.PatientId == id);
                    
                if (patient == null)
                {
                    return NotFound("Patient not found");
                }
                    
                var record = patient.Records?.FirstOrDefault();
                if (record == null)
                {
                    record = new Record { PatientId = patient.PatientId };
                    _context.Records.Add(record);
                    await _context.SaveChangesAsync();
                }
                
                foreach (var entry in patientData)
                {
                    var key = entry.Key;
                    var value = entry.Value;
                    
                    if (value == null) continue;
                    
                    string[] keyParts = key.Split('-');
                    if (keyParts.Length < 2) continue;
                    
                    var tableType = keyParts[1].ToLower();
                    var patientIdFromTitle = keyParts.Length > 2 && int.TryParse(keyParts[2], out int patientId) 
                        ? patientId 
                        : id;
                    
                    switch (tableType)
                    {
                        case "elimination":
                            await _submissionHandler.SubmitEliminationData(_context, value, record, patientIdFromTitle);
                            break;
                        case "mobility":
                            await _submissionHandler.SubmitMobilityData(_context, value, record, patientIdFromTitle);
                            break;
                        case "nutrition":
                            await _submissionHandler.SubmitNutritionData(_context, value, record, patientIdFromTitle);
                            break;
                        case "cognitive":
                            await _submissionHandler.SubmitCognitiveData(_context, value, record, patientIdFromTitle);
                            break;
                        case "safety":
                            await _submissionHandler.SubmitSafetyData(_context, value, record, patientIdFromTitle);
                            break;
                        case "adl":
                            await _submissionHandler.SubmitAdlData(_context, value, record, patientIdFromTitle);
                            break;
                        case "behaviour":
                            await _submissionHandler.SubmitBehaviourData(_context, value, record, patientIdFromTitle);
                            break;
                        case "progressnote":
                            await _submissionHandler.SubmitProgressNoteData(_context, value, record, patientIdFromTitle);
                            break;
                        case "skinsensoryaid":
                            await _submissionHandler.SubmitSkinAndSensoryAidData(_context, value, record, patientIdFromTitle);
                            break;
                        case "profile":
                            try {
                                await _submissionHandler.SubmitProfileData(_context, value, patient);
                            } catch (InvalidOperationException ex) {
                                // Capture specific validation errors from the handler
                                return BadRequest(ex.Message);
                            }
                            break;
                    }
                }
                
                return Ok("Data submitted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error submitting data: {ex.Message}");
            }
        }
    }
}