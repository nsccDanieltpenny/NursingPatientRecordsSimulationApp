using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class SkinAndSensoryAid
{
    public int SkinAndSensoryAidsId { get; set; }

    public string Glasses { get; set; } = null!;

    public string Hearing { get; set; } = null!;

    public string SkinIntegrityPressureUlcerRisk { get; set; } = null!;

    public string SkinIntegrityTurningSchedule { get; set; } = null!;

    public string SkinIntegrityBradenScale { get; set; } = null!;

    public string SkinIntegrityDressings { get; set; } = null!;
}
