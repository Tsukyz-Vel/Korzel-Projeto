using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class CharacterItem
{
    [Key]
    public int Id { get; set; }

    // Relação: Quem é o dono deste item?
    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    // === INFORMAÇÕES BÁSICAS ===
    [Required]
    public string Name { get; set; } = string.Empty; 
    public string Category { get; set; } = string.Empty; // Ex: Arma Simples, Armadura Pesada, Consumível
    public string Description { get; set; } = string.Empty; // Efeitos especiais ou anotações
    
    public int Quantity { get; set; } = 1;
    public bool IsEquipped { get; set; } = false; // Se está equipado (importante para somar Defesa ou Dano depois)

    // === ATRIBUTOS DE ARMAS ===
    public string Damage { get; set; } = string.Empty; // Ex: "1d8", "2d6"
    public string Critical { get; set; } = string.Empty; // Ex: "19/x2", "x3"
    public string Range { get; set; } = string.Empty; // Ex: "9m", "Corpo a Corpo"
    public string DamageType { get; set; } = string.Empty; // Ex: Cortante, Impacto, Fogo

    // === ATRIBUTOS DE ARMADURAS E ESCUDOS ===
    public int DefenseBonus { get; set; } = 0; // O bônus de CA que ela dá
    public int ArmorPenalty { get; set; } = 0; // A penalidade nas perícias físicas
}