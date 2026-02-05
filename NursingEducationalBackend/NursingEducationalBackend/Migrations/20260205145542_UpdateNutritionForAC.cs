using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNutritionForAC : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FeedingTube",
                table: "Nutrition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "FeedingTubeDate",
                table: "Nutrition",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NGTube",
                table: "Nutrition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "NGTubeDate",
                table: "Nutrition",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeedingTube",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "FeedingTubeDate",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "NGTube",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "NGTubeDate",
                table: "Nutrition");
        }
    }
}
