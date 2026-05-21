using Microsoft.EntityFrameworkCore.Migrations;

namespace NursingEducationalBackend.Migrations
{
    public partial class AllowMultipleDoctorOrdersPerPatient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the unique index
            migrationBuilder.DropIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder");

            // Recreate as non-unique index (optional, for performance)
            migrationBuilder.CreateIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the non-unique index
            migrationBuilder.DropIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder");

            // Recreate as unique index (rollback)
            migrationBuilder.CreateIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder",
                column: "PatientId",
                unique: true);
        }
    }
}
