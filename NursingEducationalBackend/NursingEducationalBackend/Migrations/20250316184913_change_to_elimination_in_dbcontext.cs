using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NursingEducationalBackend.Migrations
{
    /// <inheritdoc />
    public partial class change_to_elimination_in_dbcontext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CatheterInsertionDate",
                table: "Elimination",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "DATE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "CatheterInsertionDate",
                table: "Elimination",
                type: "DATE",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "TEXT");
        }
    }
}
