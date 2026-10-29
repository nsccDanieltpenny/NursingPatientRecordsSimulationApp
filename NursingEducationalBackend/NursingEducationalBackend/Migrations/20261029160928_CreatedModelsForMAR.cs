using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class CreatedModelsForMAR : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder");

            migrationBuilder.CreateTable(
                name: "Drug",
                columns: table => new
                {
                    DrugId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GenericName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrandName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drug", x => x.DrugId);
                });

            migrationBuilder.CreateTable(
                name: "MedicationOrders",
                columns: table => new
                {
                    MedicationOrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DrugId = table.Column<int>(type: "int", nullable: false),
                    OrderedByNurseId = table.Column<int>(type: "int", nullable: false),
                    Dose = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DoseMax = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DoseUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Form = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Route = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DueTimes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrnReasons = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinIntervalMinutes = table.Column<int>(type: "int", nullable: true),
                    InstructorNote = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DiscontinuedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DiscontinuedByNurseId = table.Column<int>(type: "int", nullable: true),
                    DiscontinueReason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationOrders", x => x.MedicationOrderId);
                    table.ForeignKey(
                        name: "FK_MedicationOrders_Drug_DrugId",
                        column: x => x.DrugId,
                        principalTable: "Drug",
                        principalColumn: "DrugId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationOrders_Nurse_DiscontinuedByNurseId",
                        column: x => x.DiscontinuedByNurseId,
                        principalTable: "Nurse",
                        principalColumn: "NurseID");
                    table.ForeignKey(
                        name: "FK_MedicationOrders_Nurse_OrderedByNurseId",
                        column: x => x.OrderedByNurseId,
                        principalTable: "Nurse",
                        principalColumn: "NurseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationOrders_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "PatientID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationAdministrations",
                columns: table => new
                {
                    AdministrationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicationOrderId = table.Column<int>(type: "int", nullable: false),
                    NurseId = table.Column<int>(type: "int", nullable: false),
                    RotationId = table.Column<int>(type: "int", nullable: false),
                    DueAt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DoseGiven = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GivenAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PrnReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NotGivenReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WarningsOverridden = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResponseEffective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponsePainScore = table.Column<int>(type: "int", nullable: true),
                    ResponseComment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponseAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResponseByNurseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationAdministrations", x => x.AdministrationId);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_MedicationOrders_MedicationOrderId",
                        column: x => x.MedicationOrderId,
                        principalTable: "MedicationOrders",
                        principalColumn: "MedicationOrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_Nurse_NurseId",
                        column: x => x.NurseId,
                        principalTable: "Nurse",
                        principalColumn: "NurseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_Nurse_ResponseByNurseId",
                        column: x => x.ResponseByNurseId,
                        principalTable: "Nurse",
                        principalColumn: "NurseID");
                    table.ForeignKey(
                        name: "FK_MedicationAdministrations_Rotations_RotationId",
                        column: x => x.RotationId,
                        principalTable: "Rotations",
                        principalColumn: "RotationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_MedicationOrderId",
                table: "MedicationAdministrations",
                column: "MedicationOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_NurseId",
                table: "MedicationAdministrations",
                column: "NurseId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_ResponseByNurseId",
                table: "MedicationAdministrations",
                column: "ResponseByNurseId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationAdministrations_RotationId",
                table: "MedicationAdministrations",
                column: "RotationId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationOrders_DiscontinuedByNurseId",
                table: "MedicationOrders",
                column: "DiscontinuedByNurseId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationOrders_DrugId",
                table: "MedicationOrders",
                column: "DrugId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationOrders_OrderedByNurseId",
                table: "MedicationOrders",
                column: "OrderedByNurseId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationOrders_PatientId",
                table: "MedicationOrders",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationAdministrations");

            migrationBuilder.DropTable(
                name: "MedicationOrders");

            migrationBuilder.DropTable(
                name: "Drug");

            migrationBuilder.DropIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorOrder_PatientId",
                table: "DoctorOrder",
                column: "PatientId",
                unique: true);
        }
    }
}
