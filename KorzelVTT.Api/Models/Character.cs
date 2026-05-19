using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KorzelVTT.Api.Models;

public class Character
{
    [Key]
    public int Id { get; set; }

    // Relação 1 para N: A qual Usuário (jogador) esta ficha pertence?
    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User { get; set; }

    // 👇 NOVA PROPRIEDADE VITAL 👇
    // Se for nulo, a ficha é solta (só o jogador dono dela pode ver).
    // Se tiver ID, a ficha está dentro de uma campanha, e o Mestre daquela sala também tem acesso!
    public int? CampaignId { get; set; }

    // === IDENTIDADE ===
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Origin { get; set; } = string.Empty; 
    
    [MaxLength(100)]
    public string Race { get; set; } = string.Empty; 
    
    [MaxLength(100)]
    public string Class { get; set; } = string.Empty; 
    
    public int Age { get; set; } = 18; 
    public int Level { get; set; } = 1;
    
    [MaxLength(100)]
    public string Deity { get; set; } = "Nenhum"; 

    // === A HERANÇA DO PREDADOR ===
    // Guardam o nome das mutações escolhidas quando a corrupção sobe
    public string Mut1 { get; set; } = "Carne Intacta"; 
    public string Mut2 { get; set; } = "Carne Intacta";
    public string Mut3 { get; set; } = "Carne Intacta";

    // === ATRIBUTOS PRINCIPAIS ===
    public int Intellect { get; set; } = 0;
    public int Presence { get; set; } = 0;
    public int Agility { get; set; } = 0;
    public int Vigor { get; set; } = 0;
    public int Strength { get; set; } = 0;
    public int Instinct { get; set; } = 0;

    // === RECURSOS VITAIS ===
    public int CurrentHP { get; set; } = 10; 
    public int MaxHP { get; set; } = 10;
    
    public int CurrentPE { get; set; } = 0; 
    public int MaxPE { get; set; } = 0;

    public int Corruption { get; set; } = 0; 
    public int MaxCorruption { get; set; } = 40; 

    // === ECONOMIA E DEFESA ===
    public int Lascas { get; set; } = 1000; 
    public int BaseDefense { get; set; } = 10; 

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // === RELACIONAMENTOS / LISTAS DA FICHA (COMPLETO) ===
    // Todas as tabelas que guardam os dados dinâmicos das abas da ficha
    public ICollection<CharacterSkill> Skills { get; set; } = new List<CharacterSkill>();
    public ICollection<CharacterItem> Inventory { get; set; } = new List<CharacterItem>();
    public ICollection<Weapon> Weapons { get; set; } = new List<Weapon>();      
    public ICollection<Ability> Abilities { get; set; } = new List<Ability>();   
    public ICollection<Note> Notes { get; set; } = new List<Note>();             
}