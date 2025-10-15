using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class SQL_Conversion_Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ADLs",
                columns: table => new
                {
                    ADLsID = table.Column<int>(type: "int", nullable: false),
                    BathDate = table.Column<DateTime>(type: "DATE", nullable: true),
                    TubShowerOther = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeOfCare = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TurningSchedule = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Teeth = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FootCare = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HairCare = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ADLs", x => x.ADLsID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Behaviour",
                columns: table => new
                {
                    BehaviourID = table.Column<int>(type: "int", nullable: false),
                    Report = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Behaviour", x => x.BehaviourID);
                });

            migrationBuilder.CreateTable(
                name: "Cognitive",
                columns: table => new
                {
                    CognitiveID = table.Column<int>(type: "int", nullable: false),
                    Speech = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LOC = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MMSE = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Confusion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cognitive", x => x.CognitiveID);
                });

            migrationBuilder.CreateTable(
                name: "Elimination",
                columns: table => new
                {
                    EliminationID = table.Column<int>(type: "int", nullable: false),
                    IncontinentOfBladder = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IncontinentOfBowel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DayOrNightProduct = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastBowelMovement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BowelRoutine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BladderRoutine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CatheterInsertionDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CatheterInsertion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elimination", x => x.EliminationID);
                });

            migrationBuilder.CreateTable(
                name: "Mobility",
                columns: table => new
                {
                    MobilityID = table.Column<int>(type: "int", nullable: false),
                    Transfer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Aids = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedMobility = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mobility", x => x.MobilityID);
                });

            migrationBuilder.CreateTable(
                name: "Nurse",
                columns: table => new
                {
                    NurseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientID = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nurse", x => x.NurseID);
                });

            migrationBuilder.CreateTable(
                name: "Nutrition",
                columns: table => new
                {
                    NutritionID = table.Column<int>(type: "int", nullable: false),
                    Diet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Assist = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Intake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DietarySupplementInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Weight = table.Column<int>(type: "int", nullable: true),
                    Date = table.Column<DateOnly>(type: "date", nullable: true),
                    Method = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IvSolutionRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecialNeeds = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nutrition", x => x.NutritionID);
                });

            migrationBuilder.CreateTable(
                name: "ProgressNote",
                columns: table => new
                {
                    ProgressNoteID = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressNote", x => x.ProgressNoteID);
                });

            migrationBuilder.CreateTable(
                name: "Safety",
                columns: table => new
                {
                    SafetyID = table.Column<int>(type: "int", nullable: false),
                    HipProtectors = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SideRails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FallRiskScale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CrashMats = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedAlarm = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Safety", x => x.SafetyID);
                });

            migrationBuilder.CreateTable(
                name: "SkinAndSensoryAids",
                columns: table => new
                {
                    SkinAndSensoryAidsID = table.Column<int>(type: "int", nullable: false),
                    Glasses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hearing = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkinIntegrityPressureUlcerRisk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkinIntegrityTurningSchedule = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkinIntegrityBradenScale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkinIntegrityDressings = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkinAndSensoryAids", x => x.SkinAndSensoryAidsID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    PatientID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NurseID = table.Column<int>(type: "int", nullable: true),
                    ImageFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BedNumber = table.Column<int>(type: "int", nullable: true),
                    NextOfKin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NextOfKinPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sex = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientWristID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DOB = table.Column<DateOnly>(type: "date", nullable: false),
                    AdmissionDate = table.Column<DateOnly>(type: "date", nullable: false),
                    DischargeDate = table.Column<DateOnly>(type: "date", nullable: true),
                    MaritalStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MedicalHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Weight = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Allergies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsolationPrecautions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoamAlertBracelet = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    RecordID = table.Column<int>(type: "int", nullable: false),
                    PatientID = table.Column<int>(type: "int", nullable: true),
                    CognitiveID = table.Column<int>(type: "int", nullable: true),
                    NutritionID = table.Column<int>(type: "int", nullable: true),
                    EliminationID = table.Column<int>(type: "int", nullable: true),
                    MobilityID = table.Column<int>(type: "int", nullable: true),
                    SafetyID = table.Column<int>(type: "int", nullable: true),
                    ADLsID = table.Column<int>(type: "int", nullable: true),
                    SkinID = table.Column<int>(type: "int", nullable: true),
                    BehaviourID = table.Column<int>(type: "int", nullable: true),
                    ProgressNoteID = table.Column<int>(type: "int", nullable: true)
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
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

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
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Nurse_PatientID",
                table: "Nurse",
                column: "PatientID",
                unique: true,
                filter: "[PatientID] IS NOT NULL");

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
