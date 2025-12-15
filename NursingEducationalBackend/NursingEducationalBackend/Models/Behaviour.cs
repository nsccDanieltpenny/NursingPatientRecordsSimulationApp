using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace NursingEducationalBackend.Models;

public partial class Behaviour
{
    public int BehaviourId { get; set; }

    public string Report { get; set; } = null!;
}
