using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Safety
{
    public int SafetyId { get; set; }

    public string? HipProtectors { get; set; }

    public string? SideRails { get; set; }

    public string? FallRiskScale { get; set; }

    public string? CrashMats { get; set; }

    public string? BedAlarm { get; set; }
}
