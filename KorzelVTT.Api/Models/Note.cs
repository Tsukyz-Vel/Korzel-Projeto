using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class Note
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}