using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class FixAfterMerge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Class_Campuses_CampusId",
                table: "Class");

            migrationBuilder.AddForeignKey(
                name: "FK_Class_Campuses_CampusId",
                table: "Class",
                column: "CampusId",
                principalTable: "Campuses",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Class_Campuses_CampusId",
                table: "Class");

            migrationBuilder.AddForeignKey(
                name: "FK_Class_Campuses_CampusId",
                table: "Class",
                column: "CampusId",
                principalTable: "Campuses",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
