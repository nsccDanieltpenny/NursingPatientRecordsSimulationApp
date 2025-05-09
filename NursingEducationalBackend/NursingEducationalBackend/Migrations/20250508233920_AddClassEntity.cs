using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddClassEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassID",
                table: "Nurse",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Class",
                columns: table => new
                {
                    ClassID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    InstructorID = table.Column<int>(type: "int", nullable: true),
                    Campus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Class", x => x.ClassID);
                    table.ForeignKey(
                        name: "FK_Class_Nurse_InstructorID",
                        column: x => x.InstructorID,
                        principalTable: "Nurse",
                        principalColumn: "NurseID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nurse_ClassID",
                table: "Nurse",
                column: "ClassID");

            migrationBuilder.CreateIndex(
                name: "IX_Class_InstructorID",
                table: "Class",
                column: "InstructorID");

            migrationBuilder.AddForeignKey(
                name: "FK_Nurse_Class_ClassID",
                table: "Nurse",
                column: "ClassID",
                principalTable: "Class",
                principalColumn: "ClassID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nurse_Class_ClassID",
                table: "Nurse");

            migrationBuilder.DropTable(
                name: "Class");

            migrationBuilder.DropIndex(
                name: "IX_Nurse_ClassID",
                table: "Nurse");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "Nurse");
        }
    }
}
