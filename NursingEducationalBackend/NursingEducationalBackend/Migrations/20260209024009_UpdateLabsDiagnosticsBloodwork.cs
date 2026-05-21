using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLabsDiagnosticsBloodwork : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloodWork",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropColumn(
                name: "BloodWorkCompletedDate",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropColumn(
                name: "BloodWorkOrderedDate",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropColumn(
                name: "DiagnosticsCompletedDate",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropColumn(
                name: "DiagnosticsOrderedDate",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.RenameColumn(
                name: "LabsOrderedDate",
                table: "LabsDiagnosticsAndBloods",
                newName: "OrderedDate");

            migrationBuilder.RenameColumn(
                name: "LabsCompletedDate",
                table: "LabsDiagnosticsAndBloods",
                newName: "CompletedDate");

            migrationBuilder.RenameColumn(
                name: "Labs",
                table: "LabsDiagnosticsAndBloods",
                newName: "Value");

            migrationBuilder.RenameColumn(
                name: "Diagnostics",
                table: "LabsDiagnosticsAndBloods",
                newName: "Type");

            migrationBuilder.AddColumn<int>(
                name: "PatientId",
                table: "LabsDiagnosticsAndBloods",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LabsDiagnosticsAndBloods_PatientId",
                table: "LabsDiagnosticsAndBloods",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_LabsDiagnosticsAndBloods_Patient_PatientId",
                table: "LabsDiagnosticsAndBloods",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "PatientID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LabsDiagnosticsAndBloods_Patient_PatientId",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropIndex(
                name: "IX_LabsDiagnosticsAndBloods_PatientId",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "LabsDiagnosticsAndBloods");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "LabsDiagnosticsAndBloods",
                newName: "Labs");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "LabsDiagnosticsAndBloods",
                newName: "Diagnostics");

            migrationBuilder.RenameColumn(
                name: "OrderedDate",
                table: "LabsDiagnosticsAndBloods",
                newName: "LabsOrderedDate");

            migrationBuilder.RenameColumn(
                name: "CompletedDate",
                table: "LabsDiagnosticsAndBloods",
                newName: "LabsCompletedDate");

            migrationBuilder.AddColumn<string>(
                name: "BloodWork",
                table: "LabsDiagnosticsAndBloods",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "BloodWorkCompletedDate",
                table: "LabsDiagnosticsAndBloods",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "BloodWorkOrderedDate",
                table: "LabsDiagnosticsAndBloods",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DiagnosticsCompletedDate",
                table: "LabsDiagnosticsAndBloods",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DiagnosticsOrderedDate",
                table: "LabsDiagnosticsAndBloods",
                type: "date",
                nullable: true);
        }
    }
}
