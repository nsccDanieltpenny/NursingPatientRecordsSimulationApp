using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class changed_data_to_date_in_Adl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BathData",
                table: "ADLs",
                newName: "BathDate");

            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "Nutrition",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TIME");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Date",
                table: "Nutrition",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "DATE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BathDate",
                table: "ADLs",
                newName: "BathData");

            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "Nutrition",
                type: "TIME",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Date",
                table: "Nutrition",
                type: "DATE",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "TEXT");
        }
    }
}
