using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AlignModelsWithFrontend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietarySupplementInfo",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "IvSolutionRate",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "BedMobility",
                table: "MobilityAndSafety");

            migrationBuilder.RenameColumn(
                name: "SkinIntegrityPressureUlcerRisk",
                table: "SkinAndSensoryAids",
                newName: "TurningScheduleFrequency");

            migrationBuilder.RenameColumn(
                name: "SkinIntegrityBradenScale",
                table: "SkinAndSensoryAids",
                newName: "SkinIntegrityFrequency");

            migrationBuilder.RenameColumn(
                name: "TurningSchedule",
                table: "ADLs",
                newName: "TurningFrequency");

            migrationBuilder.AddColumn<string>(
                name: "HearingAidSide",
                table: "SkinAndSensoryAids",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PressureUlcerRisk",
                table: "SkinAndSensoryAids",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SkinIntegrity",
                table: "SkinAndSensoryAids",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DentureType",
                table: "ADLs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Turning",
                table: "ADLs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HearingAidSide",
                table: "SkinAndSensoryAids");

            migrationBuilder.DropColumn(
                name: "PressureUlcerRisk",
                table: "SkinAndSensoryAids");

            migrationBuilder.DropColumn(
                name: "SkinIntegrity",
                table: "SkinAndSensoryAids");

            migrationBuilder.DropColumn(
                name: "DentureType",
                table: "ADLs");

            migrationBuilder.DropColumn(
                name: "Turning",
                table: "ADLs");

            migrationBuilder.RenameColumn(
                name: "TurningScheduleFrequency",
                table: "SkinAndSensoryAids",
                newName: "SkinIntegrityPressureUlcerRisk");

            migrationBuilder.RenameColumn(
                name: "SkinIntegrityFrequency",
                table: "SkinAndSensoryAids",
                newName: "SkinIntegrityBradenScale");

            migrationBuilder.RenameColumn(
                name: "TurningFrequency",
                table: "ADLs",
                newName: "TurningSchedule");

            migrationBuilder.AddColumn<string>(
                name: "DietarySupplementInfo",
                table: "Nutrition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IvSolutionRate",
                table: "Nutrition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "Nutrition",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BedMobility",
                table: "MobilityAndSafety",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
