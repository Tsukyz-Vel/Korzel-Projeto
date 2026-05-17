using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KorzelVTT.Api.Migrations
{
    /// <inheritdoc />
    public partial class AtualizarEstruturaFicha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssociatedAttribute",
                table: "CharacterSkills");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "CharacterItems");

            migrationBuilder.DropColumn(
                name: "Critical",
                table: "CharacterItems");

            migrationBuilder.DropColumn(
                name: "Damage",
                table: "CharacterItems");

            migrationBuilder.DropColumn(
                name: "DamageType",
                table: "CharacterItems");

            migrationBuilder.RenameColumn(
                name: "MiscBonus",
                table: "CharacterSkills",
                newName: "TrainingLevel");

            migrationBuilder.RenameColumn(
                name: "IsTrained",
                table: "CharacterSkills",
                newName: "Others");

            migrationBuilder.RenameColumn(
                name: "Range",
                table: "CharacterItems",
                newName: "ItemType");

            migrationBuilder.RenameColumn(
                name: "DefenseBonus",
                table: "CharacterItems",
                newName: "ArmorBonus");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Deity",
                table: "Characters",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaxCorruption",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Mut1",
                table: "Characters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Mut2",
                table: "Characters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Mut3",
                table: "Characters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Origin",
                table: "Characters",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaxAgility",
                table: "CharacterItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "CharacterItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "Abilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Cost = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Abilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Abilities_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notes_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Weapons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Damage = table.Column<string>(type: "TEXT", nullable: false),
                    CritMargin = table.Column<string>(type: "TEXT", nullable: false),
                    CritMultiplier = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Skill = table.Column<string>(type: "TEXT", nullable: false),
                    IsRanged = table.Column<bool>(type: "INTEGER", nullable: false),
                    Ammo = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weapons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Weapons_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Abilities_CharacterId",
                table: "Abilities",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_CharacterId",
                table: "Notes",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Weapons_CharacterId",
                table: "Weapons",
                column: "CharacterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Abilities");

            migrationBuilder.DropTable(
                name: "Notes");

            migrationBuilder.DropTable(
                name: "Weapons");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Deity",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "MaxCorruption",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Mut1",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Mut2",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Mut3",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Origin",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "MaxAgility",
                table: "CharacterItems");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "CharacterItems");

            migrationBuilder.RenameColumn(
                name: "TrainingLevel",
                table: "CharacterSkills",
                newName: "MiscBonus");

            migrationBuilder.RenameColumn(
                name: "Others",
                table: "CharacterSkills",
                newName: "IsTrained");

            migrationBuilder.RenameColumn(
                name: "ItemType",
                table: "CharacterItems",
                newName: "Range");

            migrationBuilder.RenameColumn(
                name: "ArmorBonus",
                table: "CharacterItems",
                newName: "DefenseBonus");

            migrationBuilder.AddColumn<string>(
                name: "AssociatedAttribute",
                table: "CharacterSkills",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "CharacterItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Critical",
                table: "CharacterItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Damage",
                table: "CharacterItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DamageType",
                table: "CharacterItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
