using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AssessmentChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "SkinAndSensoryAids");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Safety");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "ProgressNote");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Mobility");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Elimination");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Cognitive");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Behaviour");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "ADLs");

            migrationBuilder.AddColumn<int>(
                name: "TableRecordId",
                table: "AssessmentSubmissions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TableRecordId",
                table: "AssessmentSubmissions");

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "SkinAndSensoryAids",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Safety",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "ProgressNote",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Nutrition",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Mobility",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Elimination",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Cognitive",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Behaviour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "ADLs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
