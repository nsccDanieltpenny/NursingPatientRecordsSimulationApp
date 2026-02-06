using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddLabsDiagnosticsBloodwork : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LabsDiagnosticsAndBloods",
                columns: table => new
                {
                    LabsDiagnosticsAndBloodId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Labs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LabsOrderedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    LabsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Diagnostics = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiagnosticsOrderedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DiagnosticsCompletedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    BloodWork = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodWorkOrderedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    BloodWorkCompletedDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabsDiagnosticsAndBloods", x => x.LabsDiagnosticsAndBloodId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LabsDiagnosticsAndBloods");
        }
    }
}
