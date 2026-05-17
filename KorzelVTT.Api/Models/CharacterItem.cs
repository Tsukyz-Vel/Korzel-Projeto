using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class CharacterItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public double Weight { get; set; } = 0.0;

    // --- REGRAS DE EQUIPAMENTO E ARMADURA ---
    public bool IsEquipped { get; set; } = false;
    public string ItemType { get; set; } = "Consumível"; // Ex: "Armadura Pesada", "Escudo", "Consumível"
    public int ArmorBonus { get; set; } = 0;
    public int ArmorPenalty { get; set; } = 0;
    public int? MaxAgility { get; set; } // Nullable, pois itens normais não limitam a agilidade
}