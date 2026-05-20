using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class ImproveAttendanceModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
             migrationBuilder.DropPrimaryKey(
                name: "PK_AttendanceTicket",
                table: "AttendanceTicket");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AttendanceRecord",
                table: "AttendanceRecord");
                
            migrationBuilder.DropColumn(
                name: "AttendanceId",
                table: "AttendanceTicket");

            migrationBuilder.AddColumn<int>(
                name: "AttendanceId",
                table: "AttendanceTicket",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.DropColumn(
                name: "AttendanceId",
                table: "AttendanceRecord");

            migrationBuilder.AddColumn<int>(
                name: "AttendanceId",
                table: "AttendanceRecord",
                type: "int",
                nullable: false,
                defaultValue: 0);




            migrationBuilder.RenameColumn(
                name: "AttendanceId",
                table: "Attendance",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AttendanceTicket",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AttendanceRecord",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AttendanceTicket",
                table: "AttendanceTicket",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AttendanceRecord",
                table: "AttendanceRecord",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceTicket_AttendanceId",
                table: "AttendanceTicket",
                column: "AttendanceId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_AttendanceId",
                table: "AttendanceRecord",
                column: "AttendanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceRecord_Attendance_AttendanceId",
                table: "AttendanceRecord",
                column: "AttendanceId",
                principalTable: "Attendance",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceTicket_Attendance_AttendanceId",
                table: "AttendanceTicket",
                column: "AttendanceId",
                principalTable: "Attendance",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceRecord_Attendance_AttendanceId",
                table: "AttendanceRecord");

            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceTicket_Attendance_AttendanceId",
                table: "AttendanceTicket");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AttendanceTicket",
                table: "AttendanceTicket");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceTicket_AttendanceId",
                table: "AttendanceTicket");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AttendanceRecord",
                table: "AttendanceRecord");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceRecord_AttendanceId",
                table: "AttendanceRecord");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AttendanceTicket");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AttendanceRecord");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Attendance",
                newName: "AttendanceId");


            migrationBuilder.AddPrimaryKey(
                name: "PK_AttendanceTicket",
                table: "AttendanceTicket",
                column: "AttendanceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AttendanceRecord",
                table: "AttendanceRecord",
                column: "AttendanceId");
        }
    }
}
