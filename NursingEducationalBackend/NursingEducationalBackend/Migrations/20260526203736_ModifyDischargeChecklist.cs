using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class ModifyDischargeChecklist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DischargeChecklists_Patient_PatientId",
                table: "DischargeChecklists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DischargeChecklists",
                table: "DischargeChecklists");

            migrationBuilder.RenameTable(
                name: "DischargeChecklists",
                newName: "DischargeChecklist");

            migrationBuilder.RenameIndex(
                name: "IX_DischargeChecklists_PatientId",
                table: "DischargeChecklist",
                newName: "IX_DischargeChecklist_PatientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DischargeChecklist",
                table: "DischargeChecklist",
                column: "DischargeChecklistId");

            migrationBuilder.AddForeignKey(
                name: "FK_DischargeChecklist_Patient_PatientId",
                table: "DischargeChecklist",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "PatientID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DischargeChecklist_Patient_PatientId",
                table: "DischargeChecklist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DischargeChecklist",
                table: "DischargeChecklist");

            migrationBuilder.RenameTable(
                name: "DischargeChecklist",
                newName: "DischargeChecklists");

            migrationBuilder.RenameIndex(
                name: "IX_DischargeChecklist_PatientId",
                table: "DischargeChecklists",
                newName: "IX_DischargeChecklists_PatientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DischargeChecklists",
                table: "DischargeChecklists",
                column: "DischargeChecklistId");

            migrationBuilder.AddForeignKey(
                name: "FK_DischargeChecklists_Patient_PatientId",
                table: "DischargeChecklists",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "PatientID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
