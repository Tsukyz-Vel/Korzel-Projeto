using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class CharacterSkill
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    public string Name { get; set; } = string.Empty;
    
    // O nível de treino: 0 (Destreinado), 1 (Treinado), 2 (Veterano), 3 (Mestre)
    public int TrainingLevel { get; set; } = 0; 
    
    // Bônus vindos de itens ou situações externas
    public int Others { get; set; } = 0; 
}