using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AssessmentsOverhaul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Record_ADLs_ADLsID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Behaviour_BehaviourID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Cognitive_CognitiveID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Elimination_EliminationID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Mobility_MobilityID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Nutrition_NutritionID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Patient_PatientID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_ProgressNote_ProgressNoteID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Safety_SafetyID",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_SkinAndSensoryAids_SkinAndSensoryAidsId",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_ADLsID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_BehaviourID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_CognitiveID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_EliminationID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_MobilityID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_NutritionID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_ProgressNoteID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_SafetyID",
                table: "Record");

            migrationBuilder.DropIndex(
                name: "IX_Record_SkinAndSensoryAidsId",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "ADLsID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "BehaviourID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "CognitiveID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "EliminationID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "MobilityID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "NutritionID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "ProgressNoteID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "SafetyID",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "SkinAndSensoryAidsId",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "SkinID",
                table: "Record");

            migrationBuilder.RenameColumn(
                name: "PatientID",
                table: "Record",
                newName: "PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Record_PatientID",
                table: "Record",
                newName: "IX_Record_PatientId");

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "SkinAndSensoryAids",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Safety",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RotationId",
                table: "Record",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "ProgressNote",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Nutrition",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Mobility",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Elimination",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Cognitive",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "Behaviour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AssessmentSubmissionId",
                table: "ADLs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AssessmentTypes",
                columns: table => new
                {
                    AssessmentTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComponentKey = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssessmentTypes", x => x.AssessmentTypeId);
                });

            migrationBuilder.CreateTable(
                name: "AssessmentSubmissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecordId = table.Column<int>(type: "int", nullable: false),
                    AssessmentTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssessmentSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssessmentSubmissions_AssessmentTypes_AssessmentTypeId",
                        column: x => x.AssessmentTypeId,
                        principalTable: "AssessmentTypes",
                        principalColumn: "AssessmentTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssessmentSubmissions_Record_RecordId",
                        column: x => x.RecordId,
                        principalTable: "Record",
                        principalColumn: "RecordID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RotationsAssessments",
                columns: table => new
                {
                    RotationId = table.Column<int>(type: "int", nullable: false),
                    AssessmentTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RotationsAssessments", x => new { x.RotationId, x.AssessmentTypeId });
                    table.ForeignKey(
                        name: "FK_RotationsAssessments_AssessmentTypes_AssessmentTypeId",
                        column: x => x.AssessmentTypeId,
                        principalTable: "AssessmentTypes",
                        principalColumn: "AssessmentTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RotationsAssessments_Rotations_RotationId",
                        column: x => x.RotationId,
                        principalTable: "Rotations",
                        principalColumn: "RotationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AssessmentTypes",
                columns: new[] { "AssessmentTypeId", "ComponentKey", "Name" },
                values: new object[,]
                {
                    { 1, "PatientADL", "ADLs" },
                    { 2, "PatientBehaviour", "Behaviour" },
                    { 3, "PatientCognitive", "Cognitive" },
                    { 4, "PatientElimination", "Elimination" },
                    { 5, "PatientMobilityAndSafety", "Mobility And Safety" },
                    { 6, "PatientNutrition", "Nutrition" },
                    { 7, "PatientProgressNote", "Progress Note" },
                    { 8, "PatientSkinSensoryAid", "Skin and Sensory Aids" }
                });

            migrationBuilder.InsertData(
                table: "Rotations",
                columns: new[] { "RotationId", "Name" },
                values: new object[] { 1, "LTC" });

            migrationBuilder.InsertData(
                table: "RotationsAssessments",
                columns: new[] { "AssessmentTypeId", "RotationId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 3, 1 },
                    { 4, 1 },
                    { 5, 1 },
                    { 6, 1 },
                    { 7, 1 },
                    { 8, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Record_RotationId",
                table: "Record",
                column: "RotationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentSubmissions_AssessmentTypeId",
                table: "AssessmentSubmissions",
                column: "AssessmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentSubmissions_RecordId",
                table: "AssessmentSubmissions",
                column: "RecordId");

            migrationBuilder.CreateIndex(
                name: "IX_RotationsAssessments_AssessmentTypeId",
                table: "RotationsAssessments",
                column: "AssessmentTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Patient_PatientId",
                table: "Record",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "PatientID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Rotations_RotationId",
                table: "Record",
                column: "RotationId",
                principalTable: "Rotations",
                principalColumn: "RotationId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Record_Patient_PatientId",
                table: "Record");

            migrationBuilder.DropForeignKey(
                name: "FK_Record_Rotations_RotationId",
                table: "Record");

            migrationBuilder.DropTable(
                name: "AssessmentSubmissions");

            migrationBuilder.DropTable(
                name: "RotationsAssessments");

            migrationBuilder.DropTable(
                name: "AssessmentTypes");

            migrationBuilder.DropIndex(
                name: "IX_Record_RotationId",
                table: "Record");

            migrationBuilder.DeleteData(
                table: "Rotations",
                keyColumn: "RotationId",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "SkinAndSensoryAids");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Safety");

            migrationBuilder.DropColumn(
                name: "RotationId",
                table: "Record");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "ProgressNote");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Nutrition");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Mobility");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Elimination");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Cognitive");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "Behaviour");

            migrationBuilder.DropColumn(
                name: "AssessmentSubmissionId",
                table: "ADLs");

            migrationBuilder.RenameColumn(
                name: "PatientId",
                table: "Record",
                newName: "PatientID");

            migrationBuilder.RenameIndex(
                name: "IX_Record_PatientId",
                table: "Record",
                newName: "IX_Record_PatientID");

            migrationBuilder.AddColumn<int>(
                name: "ADLsID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BehaviourID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CognitiveID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EliminationID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MobilityID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NutritionID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProgressNoteID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SafetyID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SkinAndSensoryAidsId",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SkinID",
                table: "Record",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Record_ADLsID",
                table: "Record",
                column: "ADLsID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_BehaviourID",
                table: "Record",
                column: "BehaviourID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_CognitiveID",
                table: "Record",
                column: "CognitiveID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_EliminationID",
                table: "Record",
                column: "EliminationID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_MobilityID",
                table: "Record",
                column: "MobilityID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_NutritionID",
                table: "Record",
                column: "NutritionID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_ProgressNoteID",
                table: "Record",
                column: "ProgressNoteID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_SafetyID",
                table: "Record",
                column: "SafetyID");

            migrationBuilder.CreateIndex(
                name: "IX_Record_SkinAndSensoryAidsId",
                table: "Record",
                column: "SkinAndSensoryAidsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_ADLs_ADLsID",
                table: "Record",
                column: "ADLsID",
                principalTable: "ADLs",
                principalColumn: "ADLsID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Behaviour_BehaviourID",
                table: "Record",
                column: "BehaviourID",
                principalTable: "Behaviour",
                principalColumn: "BehaviourID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Cognitive_CognitiveID",
                table: "Record",
                column: "CognitiveID",
                principalTable: "Cognitive",
                principalColumn: "CognitiveID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Elimination_EliminationID",
                table: "Record",
                column: "EliminationID",
                principalTable: "Elimination",
                principalColumn: "EliminationID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Mobility_MobilityID",
                table: "Record",
                column: "MobilityID",
                principalTable: "Mobility",
                principalColumn: "MobilityID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Nutrition_NutritionID",
                table: "Record",
                column: "NutritionID",
                principalTable: "Nutrition",
                principalColumn: "NutritionID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Patient_PatientID",
                table: "Record",
                column: "PatientID",
                principalTable: "Patient",
                principalColumn: "PatientID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Record_ProgressNote_ProgressNoteID",
                table: "Record",
                column: "ProgressNoteID",
                principalTable: "ProgressNote",
                principalColumn: "ProgressNoteID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_Safety_SafetyID",
                table: "Record",
                column: "SafetyID",
                principalTable: "Safety",
                principalColumn: "SafetyID");

            migrationBuilder.AddForeignKey(
                name: "FK_Record_SkinAndSensoryAids_SkinAndSensoryAidsId",
                table: "Record",
                column: "SkinAndSensoryAidsId",
                principalTable: "SkinAndSensoryAids",
                principalColumn: "SkinAndSensoryAidsID");
        }
    }
}
