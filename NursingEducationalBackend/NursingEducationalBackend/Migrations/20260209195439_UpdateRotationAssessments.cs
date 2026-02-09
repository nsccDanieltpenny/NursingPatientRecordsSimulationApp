using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRotationAssessments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AssessmentTypes",
                columns: new[] { "AssessmentTypeId", "Name", "RouteKey" },
                values: new object[,]
                {
                    { 9, "Progress Note", "AcuteProgress" },
                    { 10, "Labs / Diagnostics / Blood", "LabsDiagnosticsBlood" },
                    { 11, "Discharge Checklist", "DischargeChecklist" },
                    { 12, "Consults / Current Illness", "ConsultCurrentIllness" }
                });

            migrationBuilder.InsertData(
                table: "RotationsAssessments",
                columns: new[] { "AssessmentTypeId", "RotationId" },
                values: new object[,]
                {
                    { 1, 2 },
                    { 3, 2 },
                    { 4, 2 },
                    { 5, 2 },
                    { 8, 2 },
                    { 9, 2 },
                    { 10, 2 },
                    { 11, 2 },
                    { 12, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 3, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 4, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 5, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 8, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 9, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 10, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 11, 2 });

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 12, 2 });

            migrationBuilder.DeleteData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 12);
        }
    }
}
