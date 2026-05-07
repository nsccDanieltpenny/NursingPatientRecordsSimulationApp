using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddNews2Assessment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NEWS2s",
                columns: table => new
                {
                    News2Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RespirationRate = table.Column<int>(type: "int", nullable: true),
                    SpO2Scale1 = table.Column<int>(type: "int", nullable: true),
                    SpO2Scale2 = table.Column<int>(type: "int", nullable: true),
                    OnOxygen = table.Column<bool>(type: "bit", nullable: true),
                    OxygenFlowRate = table.Column<int>(type: "int", nullable: false),
                    BPSystolic = table.Column<int>(type: "int", nullable: true),
                    BPDiastolic = table.Column<int>(type: "int", nullable: true),
                    PulseBPM = table.Column<int>(type: "int", nullable: true),
                    Consciousness = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TemperatureC = table.Column<int>(type: "int", nullable: true),
                    TotalScore = table.Column<int>(type: "int", nullable: true),
                    MonitoringFrequency = table.Column<int>(type: "int", nullable: true),
                    EscalationOfCare = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NEWS2s", x => x.News2Id);
                });

            migrationBuilder.InsertData(
                table: "AssessmentTypes",
                columns: new[] { "AssessmentTypeId", "Name", "RouteKey" },
                values: new object[] { 13, "NEWS2", "NEWS2" });

            migrationBuilder.InsertData(
                table: "RotationsAssessments",
                columns: new[] { "AssessmentTypeId", "RotationId" },
                values: new object[] { 13, 2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NEWS2s");

            migrationBuilder.DeleteData(
                table: "RotationsAssessments",
                keyColumns: new[] { "AssessmentTypeId", "RotationId" },
                keyValues: new object[] { 13, 2 });

            migrationBuilder.DeleteData(
                table: "AssessmentTypes",
                keyColumn: "AssessmentTypeId",
                keyValue: 13);
        }
    }
}
