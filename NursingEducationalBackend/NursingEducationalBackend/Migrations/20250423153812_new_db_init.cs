using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class new_db_init : Migration
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
                    BathDate = table.Column<DateTime>(type: "DATE", nullable: true),
                    TubShowerOther = table.Column<string>(type: "TEXT", nullable: true),
                    TypeOfCare = table.Column<string>(type: "TEXT", nullable: true),
                    TurningSchedule = table.Column<string>(type: "TEXT", nullable: true),
                    Teeth = table.Column<string>(type: "TEXT", nullable: true),
                    FootCare = table.Column<string>(type: "TEXT", nullable: true),
                    HairCare = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ADLs", x => x.ADLsID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
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
                    Speech = table.Column<string>(type: "TEXT", nullable: true),
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
                    IncontinentOfBladder = table.Column<string>(type: "TEXT", nullable: true),
                    IncontinentOfBowel = table.Column<string>(type: "TEXT", nullable: true),
                    DayOrNightProduct = table.Column<string>(type: "TEXT", nullable: true),
                    LastBowelMovement = table.Column<DateTime>(type: "TEXT", nullable: true),
                    BowelRoutine = table.Column<string>(type: "TEXT", nullable: true),
                    BladderRoutine = table.Column<string>(type: "TEXT", nullable: true),
                    CatheterInsertionDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    CatheterInsertion = table.Column<string>(type: "TEXT", nullable: true)
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
                    Transfer = table.Column<string>(type: "TEXT", nullable: true),
                    Aids = table.Column<string>(type: "TEXT", nullable: true),
                    BedMobility = table.Column<string>(type: "TEXT", nullable: true)
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
                    FullName = table.Column<string>(type: "TEXT", nullable: true),
                    StudentNumber = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false)
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
                    Diet = table.Column<string>(type: "TEXT", nullable: true),
                    Assist = table.Column<string>(type: "TEXT", nullable: true),
                    Intake = table.Column<string>(type: "TEXT", nullable: true),
                    Time = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DietarySupplementInfo = table.Column<string>(type: "TEXT", nullable: true),
                    Weight = table.Column<int>(type: "INTEGER", nullable: true),
                    Date = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Method = table.Column<string>(type: "TEXT", nullable: true),
                    IvSolutionRate = table.Column<string>(type: "TEXT", nullable: true),
                    SpecialNeeds = table.Column<string>(type: "TEXT", nullable: true)
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
                    HipProtectors = table.Column<string>(type: "TEXT", nullable: true),
                    SideRails = table.Column<string>(type: "TEXT", nullable: true),
                    FallRiskScale = table.Column<string>(type: "TEXT", nullable: true),
                    CrashMats = table.Column<string>(type: "TEXT", nullable: true),
                    BedAlarm = table.Column<string>(type: "TEXT", nullable: true)
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
                    Glasses = table.Column<string>(type: "TEXT", nullable: true),
                    Hearing = table.Column<string>(type: "TEXT", nullable: true),
                    SkinIntegrityPressureUlcerRisk = table.Column<string>(type: "TEXT", nullable: true),
                    SkinIntegrityTurningSchedule = table.Column<string>(type: "TEXT", nullable: true),
                    SkinIntegrityBradenScale = table.Column<string>(type: "TEXT", nullable: true),
                    SkinIntegrityDressings = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkinAndSensoryAids", x => x.SkinAndSensoryAidsID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    PatientID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NurseID = table.Column<int>(type: "INTEGER", nullable: true),
                    ImageFilename = table.Column<string>(type: "TEXT", nullable: true),
                    BedNumber = table.Column<int>(type: "INTEGER", nullable: true),
                    NextOfKin = table.Column<string>(type: "TEXT", nullable: false),
                    NextOfKinPhone = table.Column<string>(type: "TEXT", nullable: false),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    Sex = table.Column<string>(type: "TEXT", nullable: false),
                    PatientWristID = table.Column<string>(type: "TEXT", nullable: false),
                    DOB = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    AdmissionDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    DischargeDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
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
                    table.PrimaryKey("PK_Patient", x => x.PatientID);
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
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

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
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

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
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropTable(
                name: "Nurse");
        }
    }
}
