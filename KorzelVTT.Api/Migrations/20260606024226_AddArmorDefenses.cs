using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KorzelVTT.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddArmorDefenses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArmorBonus",
                table: "Characters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsArmorHeavy",
                table: "Characters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsShieldHeavy",
                table: "Characters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ShieldBonus",
                table: "Characters",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArmorBonus",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IsArmorHeavy",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IsShieldHeavy",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "ShieldBonus",
                table: "Characters");
        }
    }
}
