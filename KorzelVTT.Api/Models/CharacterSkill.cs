using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class CharacterSkill
{
    [Key]
    public int Id { get; set; }

    // Relação: A qual Personagem esta perícia pertence?
    [Required]
    public int CharacterId { get; set; }
    [ForeignKey("CharacterId")]
    public Character? Character { get; set; }

    // Dados da Perícia
    [Required]
    public string Name { get; set; } = string.Empty; // Ex: "Atletismo", "Ladinagem"

    [Required]
    public string AssociatedAttribute { get; set; } = string.Empty; // Ex: "Vigor", "Agilidade"

    // Em Korzel, você é treinado ou não. Se for, somará o Bônus de Proficiência (+2 no nível 1)
    public bool IsTrained { get; set; } = false;

    // Espaço para bônus provisórios (ex: um item mágico ou buff do Bardo que dá +2)
    public int MiscBonus { get; set; } = 0; 
}