using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddConsults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Consults",
                columns: table => new
                {
                    ConsultId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ConsultType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateSent = table.Column<DateOnly>(type: "date", nullable: true),
                    DateReplied = table.Column<DateOnly>(type: "date", nullable: true),
                    ConsultName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consults", x => x.ConsultId);
                    table.ForeignKey(
                        name: "FK_Consults_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consults_PatientId",
                table: "Consults",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consults");
        }
    }
}
