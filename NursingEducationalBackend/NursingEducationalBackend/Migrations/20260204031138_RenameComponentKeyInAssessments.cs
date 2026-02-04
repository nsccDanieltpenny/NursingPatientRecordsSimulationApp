using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class RenameComponentKeyInAssessments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ComponentKey",
                table: "AssessmentTypes",
                newName: "RouteKey");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 1,
                column: "RouteKey",
                value: "ADL");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 2,
                column: "RouteKey",
                value: "Behaviour");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 3,
                column: "RouteKey",
                value: "Cognitive");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 4,
                column: "RouteKey",
                value: "Elimination");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 5,
                column: "RouteKey",
                value: "MobilityAndSafety");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 6,
                column: "RouteKey",
                value: "Nutrition");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 7,
                column: "RouteKey",
                value: "ProgressNote");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 8,
                columns: new[] { "Name", "RouteKey" },
                values: new object[] { "Sensory Aids / Prothesis / Skin Integrity", "SkinSensoryAid" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RouteKey",
                table: "AssessmentTypes",
                newName: "ComponentKey");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 1,
                column: "ComponentKey",
                value: "PatientADL");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 2,
                column: "ComponentKey",
                value: "PatientBehaviour");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 3,
                column: "ComponentKey",
                value: "PatientCognitive");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 4,
                column: "ComponentKey",
                value: "PatientElimination");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 5,
                column: "ComponentKey",
                value: "PatientMobilityAndSafety");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 6,
                column: "ComponentKey",
                value: "PatientNutrition");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 7,
                column: "ComponentKey",
                value: "PatientProgressNote");

            migrationBuilder.UpdateData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 8,
                columns: new[] { "ComponentKey", "Name" },
                values: new object[] { "PatientSkinSensoryAid", "Skin and Sensory Aids" });
        }
    }
}
