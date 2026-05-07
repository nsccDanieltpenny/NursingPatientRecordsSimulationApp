namespace NursingEducationalBackend.Models.Assessments
{
    public class DischargeChecklist
    {
        public int DischargeChecklistId { get; set; }
        public int PatientId { get; set; }
        public DateOnly? TargetDischargeDate { get; set; }
        public bool HighRiskDischarge { get; set; } = false;

        public DateOnly? CreateHomeChartInitiatedDate { get; set; }
        public DateOnly? CreateHomeChartCompletedDate { get; set; }
        public string? CreateHomeChartComments { get; set; }
        public bool CreateHomeChartNotApplicable { get; set; } = false;

        public DateOnly? ReturnHomeChartInitiatedDate { get; set; }
        public DateOnly? ReturnHomeChartCompletedDate { get; set; }
        public string? ReturnHomeChartComments { get; set; }
        public bool ReturnHomeChartNotApplicable { get; set; } = false;

        public DateOnly? NotifyPCNurseInitiatedDate { get; set; }
        public DateOnly? NotifyPCNurseCompletedDate { get; set; }
        public string? NotifyPCNurseComments { get; set; }
        public bool NotifyPCNurseNotApplicable { get; set; } = false;

        public DateOnly? NotifyContinuingCareInitiatedDate { get; set; }
        public DateOnly? NotifyContinuingCareCompletedDate { get; set; }
        public string? NotifyContinuingCareComments { get; set; }
        public bool NotifyContinuingCareNotApplicable { get; set; } = false;

        public DateOnly? FamilySupportInitiatedDate { get; set; }
        public DateOnly? FamilySupportCompletedDate { get; set; }
        public string? FamilySupportComments { get; set; }
        public bool FamilySupportNotApplicable { get; set; } = false;

        public DateOnly? GetAppointmentsInitiatedDate { get; set; }
        public DateOnly? GetAppointmentsCompletedDate { get; set; }
        public string? GetAppointmentsComments { get; set; }
        public bool GetAppointmentsNotApplicable { get; set; } = false;

        public DateOnly? ConsultGeriatricNavInitiatedDate { get; set; }
        public DateOnly? ConsultGeriatricNavCompletedDate { get; set; }
        public string? ConsultGeriatricNavComments { get; set; }
        public bool ConsultGeriatricNavNotApplicable { get; set; } = false;

        public DateOnly? ProvideFollowUpApptsInitiatedDate { get; set; }
        public DateOnly? ProvideFollowUpApptsCompletedDate { get; set; }
        public string? ProvideFollowUpApptsComments { get; set; }
        public bool ProvideFollowUpApptsNotApplicable { get; set; } = false;

        public DateOnly? ProvideRxInitiatedDate { get; set; }
        public DateOnly? ProvideRxCompletedDate { get; set; }
        public string? ProvideRxComments { get; set; }
        public bool ProvideRxNotApplicable { get; set; } = false;

        public DateOnly? AssessBlisterPackInitiatedDate { get; set; }
        public DateOnly? AssessBlisterPackCompletedDate { get; set; }
        public string? AssessBlisterPackComments { get; set; }
        public bool AssessBlisterPackNotApplicable { get; set; } = false;

        public DateOnly? ReturnOwnMedsInitiatedDate { get; set; }
        public DateOnly? ReturnOwnMedsCompletedDate { get; set; }
        public string? ReturnOwnMedsComments { get; set; }
        public bool ReturnOwnMedsNotApplicable { get; set; } = false;

        public DateOnly? ObtainAffordMedsInitiatedDate { get; set; }
        public DateOnly? ObtainAffordMedsCompletedDate { get; set; }
        public string? ObtainAffordMedsComments { get; set; }
        public bool ObtainAffordMedsNotApplicable { get; set; } = false;

        public DateOnly? PrepareMedCalendarInitiatedDate { get; set; }
        public DateOnly? PrepareMedCalendarCompletedDate { get; set; }
        public string? PrepareMedCalendarComments { get; set; }
        public bool PrepareMedCalendarNotApplicable { get; set; } = false;

        public DateOnly? TeachHighRiskMedsInitiatedDate { get; set; }
        public DateOnly? TeachHighRiskMedsCompletedDate { get; set; }
        public string? TeachHighRiskMedsComments { get; set; }
        public bool TeachHighRiskMedsNotApplicable { get; set; } = false;

        public DateOnly? OrderTeachVTEInitiatedDate { get; set; }
        public DateOnly? OrderTeachVTECompletedDate { get; set; }
        public string? OrderTeachVTEComments { get; set; }
        public bool OrderTeachVTENotApplicable { get; set; } = false;

        public DateOnly? DemonstrateAdminTechInitiatedDate { get; set; }
        public DateOnly? DemonstrateAdminTechCompletedDate { get; set; }
        public string? DemonstrateAdminTechComments { get; set; }
        public bool DemonstrateAdminTechNotApplicable { get; set; } = false;

        public DateOnly? FamilyAwareDischargeInitiatedDate { get; set; }
        public DateOnly? FamilyAwareDischargeCompletedDate { get; set; }
        public string? FamilyAwareDischargeComments { get; set; }
        public bool FamilyAwareDischargeNotApplicable { get; set; } = false;

        public DateOnly? EquipmentReadyInitiatedDate { get; set; }
        public DateOnly? EquipmentReadyCompletedDate { get; set; }
        public string? EquipmentReadyComments { get; set; }
        public bool EquipmentReadyNotApplicable { get; set; } = false;

        public DateOnly? CompletePASSInitiatedDate { get; set; }
        public DateOnly? CompletePASSCompletedDate { get; set; }
        public string? CompletePASSComments { get; set; }
        public bool CompletePASSNotApplicable { get; set; } = false;

        public DateOnly? CompleteTOAInitiatedDate { get; set; }
        public DateOnly? CompleteTOACompletedDate { get; set; }
        public string? CompleteTOAComments { get; set; }
        public bool CompleteTOANotApplicable { get; set; } = false;

        public DateOnly? ReturnValuablesInitiatedDate { get; set; }
        public DateOnly? ReturnValuablesCompletedDate { get; set; }
        public string? ReturnValuablesComments { get; set; }
        public bool ReturnValuablesNotApplicable { get; set; } = false;

        public DateOnly? ArrangeTransportationInitiatedDate { get; set; }
        public DateOnly? ArrangeTransportationCompletedDate { get; set; }
        public string? ArrangeTransportationComments { get; set; }
        public bool ArrangeTransportationNotApplicable { get; set; } = false;

        public virtual Patient Patient { get; set; }
    }
}
