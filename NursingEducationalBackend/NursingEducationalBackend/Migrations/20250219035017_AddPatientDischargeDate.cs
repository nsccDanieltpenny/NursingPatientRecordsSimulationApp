using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientDischargeDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ADLs",
                columns: table => new
                {
                    ADLsID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BathData = table.Column<DateOnly>(type: "DATE", nullable: false),
                    TubShowerOther = table.Column<string>(type: "TEXT", nullable: false),
                    TypeOfCare = table.Column<string>(type: "TEXT", nullable: false),
                    TurningSchedule = table.Column<string>(type: "TEXT", nullable: false),
                    Teeth = table.Column<string>(type: "TEXT", nullable: false),
                    FootCare = table.Column<string>(type: "TEXT", nullable: false),
                    HairCare = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ADLs", x => x.ADLsID);
                });

            migrationBuilder.CreateTable(
                name: "Behaviour",
                columns: table => new
                {
                    BehaviourID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Report = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Behaviour", x => x.BehaviourID);
                });

            migrationBuilder.CreateTable(
                name: "Cognitive",
                columns: table => new
                {
                    CognitiveID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Speech = table.Column<string>(type: "TEXT", nullable: false),
                    LOC = table.Column<string>(type: "TEXT", nullable: true),
                    MMSE = table.Column<string>(type: "TEXT", nullable: true),
                    Confusion = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cognitive", x => x.CognitiveID);
                });

            migrationBuilder.CreateTable(
                name: "Elimination",
                columns: table => new
                {
                    EliminationID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IncontinentOfBladder = table.Column<string>(type: "TEXT", nullable: false),
                    IncontinentOfBowel = table.Column<string>(type: "TEXT", nullable: false),
                    DayOrNightProduct = table.Column<string>(type: "TEXT", nullable: false),
                    LastBowelMovement = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    BowelRoutine = table.Column<string>(type: "TEXT", nullable: false),
                    BladderRoutine = table.Column<string>(type: "TEXT", nullable: false),
                    CatheterInsertionDate = table.Column<DateOnly>(type: "DATE", nullable: false),
                    CatheterInsertion = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elimination", x => x.EliminationID);
                });

            migrationBuilder.CreateTable(
                name: "Mobility",
                columns: table => new
                {
                    MobilityID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Transfer = table.Column<string>(type: "TEXT", nullable: false),
                    Aids = table.Column<string>(type: "TEXT", nullable: false),
                    BedMobility = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mobility", x => x.MobilityID);
                });

            migrationBuilder.CreateTable(
                name: "Nurse",
                columns: table => new
                {
                    NurseID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PatientID = table.Column<int>(type: "INTEGER", nullable: true),
                    NurseFullName = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Password = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nurse", x => x.NurseID);
                });

            migrationBuilder.CreateTable(
                name: "Nutrition",
                columns: table => new
                {
                    NutritionID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Diet = table.Column<string>(type: "TEXT", nullable: false),
                    Assit = table.Column<string>(type: "TEXT", nullable: false),
                    Intake = table.Column<string>(type: "TEXT", nullable: false),
                    Time = table.Column<string>(type: "TIME", nullable: false),
                    DietarySupplementInfo = table.Column<string>(type: "TEXT", nullable: false),
                    Weight = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateOnly>(type: "DATE", nullable: false),
                    Method = table.Column<string>(type: "TEXT", nullable: false),
                    IvSolutionRate = table.Column<string>(type: "TEXT", nullable: false),
                    SpecialNeeds = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nutrition", x => x.NutritionID);
                });

            migrationBuilder.CreateTable(
                name: "ProgressNote",
                columns: table => new
                {
                    ProgressNoteID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Timestamp = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressNote", x => x.ProgressNoteID);
                });

            migrationBuilder.CreateTable(
                name: "Safety",
                columns: table => new
                {
                    SafetyID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HipProtectors = table.Column<string>(type: "TEXT", nullable: false),
                    SideRails = table.Column<string>(type: "TEXT", nullable: false),
                    FallRiskScale = table.Column<string>(type: "TEXT", nullable: false),
                    CrashMats = table.Column<string>(type: "TEXT", nullable: false),
                    BedAlarm = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Safety", x => x.SafetyID);
                });

            migrationBuilder.CreateTable(
                name: "SkinAndSensoryAids",
                columns: table => new
                {
                    SkinAndSensoryAidsID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Glasses = table.Column<string>(type: "TEXT", nullable: false),
                    Hearing = table.Column<string>(type: "TEXT", nullable: false),
                    SkinIntegrityPressureUlcerRisk = table.Column<string>(type: "TEXT", nullable: false),
                    SkinIntegrityTurningSchedule = table.Column<string>(type: "TEXT", nullable: false),
                    SkinIntegrityBradenScale = table.Column<string>(type: "TEXT", nullable: false),
                    SkinIntegrityDressings = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkinAndSensoryAids", x => x.SkinAndSensoryAidsID);
                });

            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    PatientWristID = table.Column<string>(type: "TEXT", nullable: false),
                    NurseID = table.Column<int>(type: "INTEGER", nullable: true),
                    NextOfKin = table.Column<string>(type: "TEXT", nullable: false),
                    NextOfKinPhone = table.Column<long>(type: "INTEGER", nullable: false),
                    PatientID = table.Column<int>(type: "INTEGER", nullable: false),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    Sex = table.Column<string>(type: "TEXT", nullable: false),
                    DOB = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Admission = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    MaritalStatus = table.Column<string>(type: "TEXT", nullable: true),
                    MedicalHistory = table.Column<string>(type: "TEXT", nullable: true),
                    Weight = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<string>(type: "TEXT", nullable: false),
                    Allergies = table.Column<string>(type: "TEXT", nullable: false),
                    IsolationPrecautions = table.Column<string>(type: "TEXT", nullable: false),
                    RoamAlertBracelet = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.PatientWristID);
                    table.UniqueConstraint("AK_Patient_PatientID", x => x.PatientID);
                    table.ForeignKey(
                        name: "FK_Patient_Nurse_NurseID",
                        column: x => x.NurseID,
                        principalTable: "Nurse",
                        principalColumn: "NurseID");
                });

            migrationBuilder.CreateTable(
                name: "Record",
                columns: table => new
                {
                    RecordID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PatientID = table.Column<int>(type: "INTEGER", nullable: true),
                    CognitiveID = table.Column<int>(type: "INTEGER", nullable: true),
                    NutritionID = table.Column<int>(type: "INTEGER", nullable: true),
                    EliminationID = table.Column<int>(type: "INTEGER", nullable: true),
                    MobilityID = table.Column<int>(type: "INTEGER", nullable: true),
                    SafetyID = table.Column<int>(type: "INTEGER", nullable: true),
                    ADLsID = table.Column<int>(type: "INTEGER", nullable: true),
                    SkinID = table.Column<int>(type: "INTEGER", nullable: true),
                    BehaviourID = table.Column<int>(type: "INTEGER", nullable: true),
                    ProgressNoteID = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Record", x => x.RecordID);
                    table.ForeignKey(
                        name: "FK_Record_Patient_PatientID",
                        column: x => x.PatientID,
                        principalTable: "Patient",
                        principalColumn: "PatientID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nurse_PatientID",
                table: "Nurse",
                column: "PatientID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patient_NurseID",
                table: "Patient",
                column: "NurseID");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_PatientID",
                table: "Patient",
                column: "PatientID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Record_PatientID",
                table: "Record",
                column: "PatientID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ADLs");

            migrationBuilder.DropTable(
                name: "Behaviour");

            migrationBuilder.DropTable(
                name: "Cognitive");

            migrationBuilder.DropTable(
                name: "Elimination");

            migrationBuilder.DropTable(
                name: "Mobility");

            migrationBuilder.DropTable(
                name: "Nutrition");

            migrationBuilder.DropTable(
                name: "ProgressNote");

            migrationBuilder.DropTable(
                name: "Record");

            migrationBuilder.DropTable(
                name: "Safety");

            migrationBuilder.DropTable(
                name: "SkinAndSensoryAids");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropTable(
                name: "Nurse");
        }
    }
}
