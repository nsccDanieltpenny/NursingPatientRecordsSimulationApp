using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddDischargeChecklist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DischargeChecklists",
                columns: table => new
                {
                    DischargeChecklistId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    TargetDischargeDate = table.Column<DateOnly>(type: "date", nullable: true),
                    HighRiskDischarge = table.Column<bool>(type: "bit", nullable: false),
                    CreateHomeChartInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CreateHomeChartCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CreateHomeChartComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateHomeChartNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ReturnHomeChartInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnHomeChartCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnHomeChartComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReturnHomeChartNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    NotifyPCNurseInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    NotifyPCNurseCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    NotifyPCNurseComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotifyPCNurseNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    NotifyContinuingCareInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    NotifyContinuingCareCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    NotifyContinuingCareComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotifyContinuingCareNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    FamilySupportInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FamilySupportCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FamilySupportComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilySupportNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    GetAppointmentsInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    GetAppointmentsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    GetAppointmentsComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GetAppointmentsNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ConsultGeriatricNavInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ConsultGeriatricNavCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ConsultGeriatricNavComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsultGeriatricNavNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ProvideFollowUpApptsInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProvideFollowUpApptsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProvideFollowUpApptsComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvideFollowUpApptsNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ProvideRxInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProvideRxCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProvideRxComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvideRxNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    AssessBlisterPackInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    AssessBlisterPackCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    AssessBlisterPackComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssessBlisterPackNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ReturnOwnMedsInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnOwnMedsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnOwnMedsComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReturnOwnMedsNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ObtainAffordMedsInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ObtainAffordMedsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ObtainAffordMedsComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ObtainAffordMedsNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    PrepareMedCalendarInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PrepareMedCalendarCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PrepareMedCalendarComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrepareMedCalendarNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    TeachHighRiskMedsInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TeachHighRiskMedsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TeachHighRiskMedsComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeachHighRiskMedsNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    OrderTeachVTEInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    OrderTeachVTECompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    OrderTeachVTEComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderTeachVTENotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    DemonstrateAdminTechInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DemonstrateAdminTechCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DemonstrateAdminTechComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DemonstrateAdminTechNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    FamilyAwareDischargeInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FamilyAwareDischargeCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FamilyAwareDischargeComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyAwareDischargeNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    EquipmentReadyInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EquipmentReadyCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EquipmentReadyComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipmentReadyNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    CompletePASSInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompletePASSCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompletePASSComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompletePASSNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    CompleteTOAInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompleteTOACompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CompleteTOAComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompleteTOANotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ReturnValuablesInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnValuablesCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ReturnValuablesComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReturnValuablesNotApplicable = table.Column<bool>(type: "bit", nullable: false),
                    ArrangeTransportationInitiatedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ArrangeTransportationCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ArrangeTransportationComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArrangeTransportationNotApplicable = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DischargeChecklists", x => x.DischargeChecklistId);
                    table.ForeignKey(
                        name: "FK_DischargeChecklists_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DischargeChecklists_PatientId",
                table: "DischargeChecklists",
                column: "PatientId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DischargeChecklists");
        }
    }
}
