using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Safety
{
    public int SafetyId { get; set; }

    public string HipProtectors { get; set; } = null!;

    public string SideRails { get; set; } = null!;

    public string FallRiskScale { get; set; } = null!;

    public string CrashMats { get; set; } = null!;

    public string BedAlarm { get; set; } = null!;
}
