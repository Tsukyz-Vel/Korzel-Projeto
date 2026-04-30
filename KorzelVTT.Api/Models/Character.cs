using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class Character
{
    [Key]
    public int Id { get; set; }

    // Relação 1 para N: A qual Usuário (jogador) esta ficha pertence?
    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User { get; set; }

    // === IDENTIDADE ===
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string Race { get; set; } = string.Empty; 
    public string Class { get; set; } = string.Empty; 
    public int Level { get; set; } = 1;

    // === ATRIBUTOS PRINCIPAIS ===
    // O sistema usa os atributos diretamente (ex: +3), então salvamos só o valor numérico
    public int Vigor { get; set; } = 0;
    public int Agility { get; set; } = 0;
    public int Strength { get; set; } = 0;
    public int Intellect { get; set; } = 0;
    public int Instinct { get; set; } = 0;
    public int Presence { get; set; } = 0;

    // === RECURSOS VITAIS ===
    public int CurrentHP { get; set; } = 10; // Pontos de Vida (Sangue)
    public int MaxHP { get; set; } = 10;
    
    public int CurrentPE { get; set; } = 0; // Pontos de Esforço (Para classes mundanas)
    public int MaxPE { get; set; } = 0;

    public int Corruption { get; set; } = 0; // Escala de 0 a 40 para a Queda

    // === ECONOMIA E DEFESA ===
    public int Lascas { get; set; } = 1000; // Moeda padrão (Lc) de Korzel
    public int BaseDefense { get; set; } = 10; // Defesa Base (10 + Agilidade + Armadura)

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // NOVO: A lista de perícias que este personagem possui
    public ICollection<CharacterSkill> Skills { get; set; } = new List<CharacterSkill>();
}