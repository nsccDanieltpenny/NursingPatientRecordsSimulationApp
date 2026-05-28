using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using NursingEducationalBackend.Models;
using Xunit;

namespace backend.Tests;

public class NurseTests
{
    [Fact] 
    public void Nurse_DefaultValues_AreInitialized()
    {
        var nurse = new Nurse();

        Assert.Equal(string.Empty, nurse.StudentNumber);
        Assert.Equal(string.Empty, nurse.Email);
        Assert.NotNull(nurse.Patients);
        Assert.Empty(nurse.Patients);
        Assert.False(nurse.IsValid);
        Assert.False(nurse.IsInstructor);
        Assert.Null(nurse.Class);
        Assert.Null(nurse.ClassId);
        Assert.Null(nurse.PatientId);
    }

    [Fact]
    public void Nurse_Validation_Fails_WhenStudentNumberIsEmpty()
    {
        var nurse = new Nurse
        {
            StudentNumber = string.Empty,
            Email = "nurse@example.com"
        };

        var validationResults = new List<ValidationResult>();
        var context = new ValidationContext(nurse);

        var isValid = Validator.TryValidateObject(nurse, context, validationResults, true);

        Assert.False(isValid);
        Assert.Contains(validationResults, r => r.MemberNames.Any(m => m == nameof(Nurse.StudentNumber)));
    }

    [Fact]
    public void Nurse_Validation_Fails_WhenEmailIsEmpty()
    {
        var nurse = new Nurse
        {
            StudentNumber = "SN12345",
            Email = string.Empty
        };

        var validationResults = new List<ValidationResult>();
        var context = new ValidationContext(nurse);

        var isValid = Validator.TryValidateObject(nurse, context, validationResults, true);

        Assert.False(isValid);
        Assert.Contains(validationResults, r => r.MemberNames.Any(m => m == nameof(Nurse.Email)));
    }

    [Fact]
    public void Nurse_Validation_Fails_WithInvalidEmailFormat()
    {
        var nurse = new Nurse
        {
            StudentNumber = "SN12345",
            Email = "invalid-email-format"
        };

        var validationResults = new List<ValidationResult>();
        var context = new ValidationContext(nurse);

        var isValid = Validator.TryValidateObject(nurse, context, validationResults, true);

        Assert.False(isValid);
        Assert.Contains(validationResults, r => r.MemberNames.Any(m => m == nameof(Nurse.Email)));
    }
}