using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class EliminationFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BladderRoutine",
                table: "Elimination");

            migrationBuilder.DropColumn(
                name: "BowelRoutine",
                table: "Elimination");

            migrationBuilder.RenameColumn(
                name: "IncontinentOfBowel",
                table: "Elimination",
                newName: "Routine");

            migrationBuilder.RenameColumn(
                name: "IncontinentOfBladder",
                table: "Elimination",
                newName: "CatheterSize");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Routine",
                table: "Elimination",
                newName: "IncontinentOfBowel");

            migrationBuilder.RenameColumn(
                name: "CatheterSize",
                table: "Elimination",
                newName: "IncontinentOfBladder");

            migrationBuilder.AddColumn<string>(
                name: "BladderRoutine",
                table: "Elimination",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BowelRoutine",
                table: "Elimination",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
