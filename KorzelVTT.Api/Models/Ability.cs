using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class Ability
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Cost { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}