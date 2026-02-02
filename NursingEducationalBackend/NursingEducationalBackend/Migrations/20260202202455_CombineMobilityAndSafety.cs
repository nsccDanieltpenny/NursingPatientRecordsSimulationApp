using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class CombineMobilityAndSafety : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mobility");

            migrationBuilder.DropTable(
                name: "Safety");

            migrationBuilder.CreateTable(
                name: "MobilityAndSafety",
                columns: table => new
                {
                    MobilityAndSafetyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Transfer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Aids = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedMobility = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HipProtectors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SideRails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FallRiskScale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CrashMats = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedAlarm = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobilityAndSafety", x => x.MobilityAndSafetyID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MobilityAndSafety");

            migrationBuilder.CreateTable(
                name: "Mobility",
                columns: table => new
                {
                    MobilityID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Aids = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedMobility = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Transfer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mobility", x => x.MobilityID);
                });

            migrationBuilder.CreateTable(
                name: "Safety",
                columns: table => new
                {
                    SafetyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BedAlarm = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CrashMats = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FallRiskScale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HipProtectors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SideRails = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Safety", x => x.SafetyID);
                });
        }
    }
}
