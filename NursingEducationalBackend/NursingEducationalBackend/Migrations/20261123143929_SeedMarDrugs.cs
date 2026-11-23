using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class SeedMarDrugs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Drugs",
                columns: new[] { "DrugId", "BrandName", "GenericName" },
                values: new object[,]
                {
                    { 1, "Tylenol", "acetaminophen" },
                    { 2, "Aspirin", "acetylsalicylic acid" },
                    { 3, "Amoxil", "amoxicillin" },
                    { 4, "Colace", "docusate sodium" },
                    { 5, "Lovenox", "enoxaparin" },
                    { 6, "Lasix", "furosemide" },
                    { 7, "Dilaudid", "hydromorphone" },
                    { 8, "Advil, Motrin", "ibuprofen" },
                    { 9, "Ativan", "lorazepam" },
                    { 10, "Lopressor", "metoprolol tartrate" },
                    { 11, "Statex, MS Contin", "morphine" },
                    { 12, "Zofran", "ondansetron" },
                    { 13, "RestoraLAX, Miralax", "polyethylene glycol 3350" },
                    { 14, "Senokot", "sennosides" },
                    { 15, "Zocor", "simvastatin" },
                    { 16, "Normal saline", "sodium chloride 0.9%" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Drugs",
                keyColumn: "DrugId",
                keyValue: 16);
        }
    }
}
