using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class Class_AddEndDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Nurse_InstructorId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Nurse_Classes_ClassId",
                table: "Nurse");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Classes",
                table: "Classes");

            migrationBuilder.RenameTable(
                name: "Classes",
                newName: "Class");

            migrationBuilder.RenameIndex(
                name: "IX_Classes_InstructorId",
                table: "Class",
                newName: "IX_Class_InstructorId");

            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "Class",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Class",
                table: "Class",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Class_Nurse_InstructorId",
                table: "Class",
                column: "InstructorId",
                principalTable: "Nurse",
                principalColumn: "NurseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nurse_Class_ClassId",
                table: "Nurse",
                column: "ClassId",
                principalTable: "Class",
                principalColumn: "ClassId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Class_Nurse_InstructorId",
                table: "Class");

            migrationBuilder.DropForeignKey(
                name: "FK_Nurse_Class_ClassId",
                table: "Nurse");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Class",
                table: "Class");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Class");

            migrationBuilder.RenameTable(
                name: "Class",
                newName: "Classes");

            migrationBuilder.RenameIndex(
                name: "IX_Class_InstructorId",
                table: "Classes",
                newName: "IX_Classes_InstructorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Classes",
                table: "Classes",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Nurse_InstructorId",
                table: "Classes",
                column: "InstructorId",
                principalTable: "Nurse",
                principalColumn: "NurseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nurse_Classes_ClassId",
                table: "Nurse",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "ClassId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
