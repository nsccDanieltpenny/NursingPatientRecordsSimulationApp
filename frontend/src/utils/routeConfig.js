//this will contain routes for all assessment tests

export const assessmentRoutes = {
    ADL: "/patients/:id/adl",
    Behaviour: "/patients/:id/behaviour",
    Cognitive: "/patients/:id/cognitive",
    Elimination: "/patients/:id/elimination",
    LabsDiagnosticsBlood: "/patients/:id/labsdiagnosticsblood",
    MobilityAndSafety: "/patients/:id/mobilityandsafety",
    Nutrition: "/patients/:id/nutrition",
    ProgressNote: "/patients/:id/progressnote",
    AcuteProgress: "/patients/:id/acuteprogress",
    Record: "/api/patients/nurse/patient/:id/record",
    // Safety: "/api/patients/nurse/patient/:id/safety",
    SkinSensoryAid: "/patients/:id/skinandsenoryaid"
}