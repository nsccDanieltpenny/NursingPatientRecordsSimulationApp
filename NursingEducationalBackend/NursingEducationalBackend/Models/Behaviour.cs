using System;
using System.Collections.Generic;

namespace NursingEducationalBackend.Models;

public partial class Behaviour
{
    public int BehaviourId { get; set; }

    public string Report { get; set; } = null!;
}
