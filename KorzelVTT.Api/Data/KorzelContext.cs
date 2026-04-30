using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Data;

// O DbContext é a ponte. Ele mapeia suas classes para as tabelas do banco.
public class KorzelContext : DbContext
{
    public KorzelContext(DbContextOptions<KorzelContext> options) : base(options) { }

    // Aqui dizemos que queremos uma tabela chamada "Users" baseada na classe User
    public DbSet<User> Users { get; set; }

    // NOVO: Representa a tabela de fichas no banco de dados
    public DbSet<Character> Characters { get; set; }

    // NOVO: Tabela de Perícias
    public DbSet<CharacterSkill> CharacterSkills { get; set; }
}