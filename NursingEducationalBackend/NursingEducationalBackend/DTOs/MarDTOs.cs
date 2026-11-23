namespace NursingEducationalBackend.DTOs
{
    // Shapes for GET /api/patients/{id}/mar 

    public class MarDayDTO
    {
        public int PatientId { get; set; }
        public string PatientName { get; set; } = null!;
        public string Allergies { get; set; } = null!;
        public string Date { get; set; } = null!; // Atlantic date, YYYY-MM-DD
        public List<MarOrderDTO> Orders { get; set; } = new();
    }

    public class MarOrderDTO
    {
        public int MedicationOrderId { get; set; }
        public MarDrugDTO Drug { get; set; } = null!;
        public string OrderType { get; set; } = null!; // "Scheduled" or "PRN"
        public decimal? Dose { get; set; }
        public decimal? DoseMax { get; set; }
        public string DoseUnit { get; set; } = null!;
        public string Form { get; set; } = null!;
        public string Route { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public List<string> DueTimes { get; set; } = new();
        public List<string> PrnReasons { get; set; } = new();
        public int? MinIntervalMinutes { get; set; }
        public int? MaxDosesPer24Hours { get; set; }
        public string? InstructorNote { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime? DiscontinuedAt { get; set; }
        public MarNurseDTO OrderedBy { get; set; } = null!;

        // Scheduled orders only
        public List<MarSlotDTO> Slots { get; set; } = new();

        // PRN orders only
        public List<MarDoseDTO> PrnDoses { get; set; } = new();
        public DateTime? LastGivenAt { get; set; }
        public DateTime? NextAllowedAt { get; set; }
        public int DosesGivenLast24Hours { get; set; }
    }

    public class MarDrugDTO
    {
        public int DrugId { get; set; }
        public string GenericName { get; set; } = null!;
    }

    public class MarNurseDTO
    {
        public int NurseId { get; set; }
        public string? FullName { get; set; }
    }

    public class MarSlotDTO
    {
        public string DueTime { get; set; } = null!; // Atlantic clock time, HH:MM
        public DateTime DueAt { get; set; } // the same time in UTC
        public MarDoseDTO? Dose { get; set; } // null until charted
    }

    public class MarDoseDTO
    {
        public int AdministrationId { get; set; }
        public string Status { get; set; } = null!; // "Given" or "NotGiven"
        public decimal? DoseGiven { get; set; }
        public DateTime? GivenAt { get; set; }
        public string? PrnReason { get; set; }
        public string? NotGivenReason { get; set; }
        public string? Comment { get; set; }
        public List<string> WarningsOverridden { get; set; } = new();
        public MarNurseDTO ChartedBy { get; set; } = null!;
        public DateTime ChartedAt { get; set; }
        public MarResponseDTO? Response { get; set; } // null until recorded
    }

    public class MarResponseDTO
    {
        public string? Effective { get; set; } // Effective / PartiallyEffective / NotEffective
        public int? PainScore { get; set; }
        public string? Comment { get; set; }
        public DateTime? RespondedAt { get; set; }
        public MarNurseDTO? RespondedBy { get; set; }
    }

    // GET /api/drugs?search=
    public class DrugSearchResultDTO
    {
        public int DrugId { get; set; }
        public string GenericName { get; set; } = null!;
        public List<string> BrandNames { get; set; } = new();
        public string? MatchedBrand { get; set; } // null when the generic name matched
    }

    // POST /api/patients/{id}/medication-orders
    public class MedicationOrderCreateDTO
    {
        public int DrugId { get; set; }
        public string? OrderType { get; set; } // "Scheduled" or "PRN"
        public decimal? Dose { get; set; }
        public decimal? DoseMax { get; set; } // set for a range, e.g. 4 to 8 mg
        public string? DoseUnit { get; set; }
        public string? Form { get; set; }
        public string? Route { get; set; }
        public string? Frequency { get; set; }
        public List<string> DueTimes { get; set; } = new(); // Scheduled only, e.g. ["08:00", "20:00"]
        public List<string> PrnReasons { get; set; } = new(); // PRN only, e.g. ["Pain", "Fever"]
        public int? MinIntervalMinutes { get; set; } // PRN only, e.g. 240 for q4h
        public int? MaxDosesPer24Hours { get; set; } // PRN only, optional
        public string? InstructorNote { get; set; }
        public DateTime? StartAt { get; set; }
    }
}
