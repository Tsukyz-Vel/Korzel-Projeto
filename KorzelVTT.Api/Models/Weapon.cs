using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class Weapon
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Damage { get; set; } = string.Empty;
    public string CritMargin { get; set; } = "20";
    public string CritMultiplier { get; set; } = "x2";
    public string Type { get; set; } = "Cortante";
    public string Skill { get; set; } = "Luta";
    public bool IsRanged { get; set; } = false;
    public int Ammo { get; set; } = 0;
}