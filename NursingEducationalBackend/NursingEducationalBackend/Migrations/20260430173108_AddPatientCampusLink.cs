using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientCampusLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CampusId",
                table: "Patient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            if (migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                migrationBuilder.Sql(
                    "UPDATE \"Patient\" " +
                    "SET \"CampusId\" = (" +
                    "SELECT c.\"CampusId\" " +
                    "FROM \"Nurse\" n " +
                    "JOIN \"Class\" c ON c.\"ClassId\" = n.\"ClassId\" " +
                    "WHERE n.\"NurseId\" = \"Patient\".\"NurseId\"" +
                    ") " +
                    "WHERE \"NurseId\" IS NOT NULL;");
            }
            else if (migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                migrationBuilder.Sql(
                    "UPDATE p " +
                    "SET p.CampusId = c.CampusId " +
                    "FROM Patient p " +
                    "JOIN Nurse n ON n.NurseId = p.NurseId " +
                    "JOIN [Class] c ON c.ClassId = n.ClassId " +
                    "WHERE p.NurseId IS NOT NULL;");
            }

            migrationBuilder.CreateIndex(
                name: "IX_Patient_CampusId",
                table: "Patient",
                column: "CampusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patient_Campuses_CampusId",
                table: "Patient",
                column: "CampusId",
                principalTable: "Campuses",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patient_Campuses_CampusId",
                table: "Patient");

            migrationBuilder.DropIndex(
                name: "IX_Patient_CampusId",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "CampusId",
                table: "Patient");
        }
    }
}
