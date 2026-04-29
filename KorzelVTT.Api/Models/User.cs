using System.ComponentModel.DataAnnotations;

namespace KorzelVTT.Api.Models;

// Definimos os papéis possíveis. 
// O Admin (você) tem poder total, Master pode gerenciar mesas, Player apenas joga.
public enum UserRole
{
    Admin,
    Master,
    Player
}

public class User
{
    [Key] // Avisa ao EF que este é o identificador único (Primary Key)
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty; // Nunca salvamos a senha real, apenas o "hash" (digital) dela por segurança

    public UserRole Role { get; set; } = UserRole.Player; // Por padrão, todo mundo nasce como Player

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}