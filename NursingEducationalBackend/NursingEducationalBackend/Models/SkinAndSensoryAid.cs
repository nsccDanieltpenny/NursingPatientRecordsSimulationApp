using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models;

public partial class SkinAndSensoryAid
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int SkinAndSensoryAidsId { get; set; }

    public string? Glasses { get; set; }

    public string? Hearing { get; set; }

    public string? SkinIntegrityPressureUlcerRisk { get; set; }

    public string? SkinIntegrityTurningSchedule { get; set; }

    public string? SkinIntegrityBradenScale { get; set; }

    public string? SkinIntegrityDressings { get; set; }
}
