using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class Add_Classrooms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassId",
                table: "Nurse",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    ClassId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JoinCode = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    InstructorId = table.Column<int>(type: "int", nullable: false),
                    InstructorNurseId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.ClassId);
                    table.ForeignKey(
                        name: "FK_Classes_Nurse_InstructorNurseId",
                        column: x => x.InstructorNurseId,
                        principalTable: "Nurse",
                        principalColumn: "NurseID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nurse_ClassId",
                table: "Nurse",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Class_JoinCode",
                table: "Classes",
                column: "JoinCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_InstructorNurseId",
                table: "Classes",
                column: "InstructorNurseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Nurse_Classes_ClassId",
                table: "Nurse",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "ClassId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nurse_Classes_ClassId",
                table: "Nurse");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Nurse_ClassId",
                table: "Nurse");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Nurse");
        }
    }
}
