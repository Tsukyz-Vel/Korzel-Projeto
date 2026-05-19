using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KorzelVTT.Api.Models;

public class Scene
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CampaignId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // URL da imagem de fundo (o grid/mapa)
    public string? BgImage { get; set; }

    // Indica se esta é a cena que está aparecendo para os jogadores agora
    public bool IsActive { get; set; }

    [JsonIgnore] // Evita loop de JSON
    public Campaign? Campaign { get; set; }

    // Os tokens que estão fisicamente jogados DENTRO desta cena
    public List<SceneToken> Tokens { get; set; } = new();
}