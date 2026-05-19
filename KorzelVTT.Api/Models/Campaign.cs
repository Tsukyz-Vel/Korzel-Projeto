using System.ComponentModel.DataAnnotations;

namespace KorzelVTT.Api.Models;

public class Campaign
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // ID do Usuário que criou a sala (Ele será o Mestre)
    [Required]
    public int MasterUserId { get; set; }

    // Código de convite ou senha para os jogadores entrarem na sala
    public string InviteCode { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relacionamentos do Entity Framework
    public List<Scene> Scenes { get; set; } = new();
    public List<Character> Characters { get; set; } = new();
}