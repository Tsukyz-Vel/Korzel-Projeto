using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KorzelVTT.Api.Models;

public class SceneToken
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int SceneId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Image { get; set; }
    
    public bool IsNpc { get; set; }

    // Posições geométricas no grid do VTT
    public double X { get; set; }
    public double Y { get; set; }
    public double Size { get; set; } = 80;
    public int ZIndex { get; set; } = 10;

    [JsonIgnore]
    public Scene? Scene { get; set; }
}