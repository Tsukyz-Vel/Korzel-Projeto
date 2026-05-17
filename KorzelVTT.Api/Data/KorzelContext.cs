using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Data;

// O DbContext é a ponte. Ele mapeia suas classes para as tabelas do banco.
public class KorzelContext : DbContext
{
    public KorzelContext(DbContextOptions<KorzelContext> options) : base(options) { }

    // Mapeamento das tabelas base
    public DbSet<User> Users { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<CharacterSkill> CharacterSkills { get; set; }
    public DbSet<CharacterItem> CharacterItems { get; set; }

    // 👇 NOVAS TABELAS ADICIONADAS AQUI 👇
    public DbSet<Weapon> Weapons { get; set; }
    public DbSet<Ability> Abilities { get; set; }
    public DbSet<Note> Notes { get; set; }

    // Configurações avançadas de relacionamentos e integridade
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração de exclusão em cascata: Deletou o Character -> Limpa as Perícias
        modelBuilder.Entity<Character>()
            .HasMany(c => c.Skills)
            .WithOne(s => s.Character)
            .HasForeignKey(s => s.CharacterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Deletou o Character -> Limpa o Inventário
        modelBuilder.Entity<Character>()
            .HasMany(c => c.Inventory)
            .WithOne(i => i.Character)
            .HasForeignKey(i => i.CharacterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Deletou o Character -> Limpa as Armas (Arsenal)
        modelBuilder.Entity<Character>()
            .HasMany(c => c.Weapons)
            .WithOne(w => w.Character)
            .HasForeignKey(w => w.CharacterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Deletou o Character -> Limpa as Habilidades/Poderes
        modelBuilder.Entity<Character>()
            .HasMany(c => c.Abilities)
            .WithOne(a => a.Character)
            .HasForeignKey(a => a.CharacterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Deletou o Character -> Limpa as Páginas do Diário
        modelBuilder.Entity<Character>()
            .HasMany(c => c.Notes)
            .WithOne(n => n.Character)
            .HasForeignKey(n => n.CharacterId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}