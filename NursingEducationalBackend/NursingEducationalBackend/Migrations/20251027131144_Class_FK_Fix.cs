using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class Class_FK_Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Nurse_InstructorNurseId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_InstructorNurseId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "InstructorNurseId",
                table: "Classes");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_InstructorId",
                table: "Classes",
                column: "InstructorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Nurse_InstructorId",
                table: "Classes",
                column: "InstructorId",
                principalTable: "Nurse",
                principalColumn: "NurseID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Nurse_InstructorId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_InstructorId",
                table: "Classes");

            migrationBuilder.AddColumn<int>(
                name: "InstructorNurseId",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_InstructorNurseId",
                table: "Classes",
                column: "InstructorNurseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Nurse_InstructorNurseId",
                table: "Classes",
                column: "InstructorNurseId",
                principalTable: "Nurse",
                principalColumn: "NurseID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
