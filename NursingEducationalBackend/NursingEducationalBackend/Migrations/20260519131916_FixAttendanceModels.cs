using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class FixAttendanceModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttendaceId",
                table: "AttendanceTicket",
                newName: "AttendanceId");

            migrationBuilder.RenameColumn(
                name: "RecordId",
                table: "AttendanceRecord",
                newName: "AttendanceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttendanceId",
                table: "AttendanceTicket",
                newName: "AttendaceId");

            migrationBuilder.RenameColumn(
                name: "AttendanceId",
                table: "AttendanceRecord",
                newName: "RecordId");
        }
    }
}
