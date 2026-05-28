using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KorzelVTT.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoColunasFaltantes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OficioText",
                table: "Characters",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resistances",
                table: "Characters",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OficioText",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Resistances",
                table: "Characters");
        }
    }
}
