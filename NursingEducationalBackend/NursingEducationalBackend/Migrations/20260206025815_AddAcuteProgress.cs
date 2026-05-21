using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddAcuteProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AcuteProgresses",
                columns: table => new
                {
                    AcuteProgressId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Treatment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Procedures = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecialInstructions = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcuteProgresses", x => x.AcuteProgressId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AcuteProgresses");
        }
    }
}
