using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; 
using System.Security.Claims; 
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Authorize] 
[Route("api/[controller]")]
[ApiController]
public class CharactersController : ControllerBase
{
    private readonly KorzelContext _context;

    public CharactersController(KorzelContext context)
    {
        _context = context;
    }

    // ==========================================
    // FUNÇÃO SECRETA: Lê o crachá do usuário atual
    // ==========================================
    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // GET: api/Characters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        int userId = GetCurrentUserId(); 

        return await _context.Characters
            .Where(c => c.UserId == userId)
            .Select(c => new Character { 
                Id = c.Id, 
                Name = c.Name, 
                Class = c.Class, 
                Level = c.Level 
            })
            .ToListAsync();
    }

    // 👇 ROTA ATUALIZADA: A "Visão Verdadeira" do Mestre 👇
    // GET: api/Characters/campaign/5
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetCampaignCharacters(int campaignId)
    {
        int userId = GetCurrentUserId();
        
        // Descobre de quem é a campanha
        var campaign = await _context.Campaigns.FindAsync(campaignId);
        if (campaign == null) return NotFound("Campanha não encontrada.");

        bool isMaster = campaign.MasterUserId == userId;

        var query = _context.Characters.Where(c => c.CampaignId == campaignId);

        // Se NÃO for o Mestre, o jogador só recebe a lista das PRÓPRIAS fichas para não espiar os outros
        if (!isMaster)
        {
            query = query.Where(c => c.UserId == userId);
        }

        // Devolvemos um objeto anônimo com a flag 'IsMine' para o React fazer a separação mágica
        var characters = await query
            .Select(c => new { 
                Id = c.Id, 
                Name = c.Name, 
                Class = c.Class, 
                Level = c.Level,
                IsMine = c.UserId == userId // Verdadeiro se a ficha for da pessoa logada
            })
            .ToListAsync();

        return Ok(characters);
    }

    // 👇 ROTA ATUALIZADA: Mestre pode abrir a ficha dos outros 👇
    // GET: api/Characters/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        int userId = GetCurrentUserId();

        var character = await _context.Characters
            .Include(c => c.Skills)
            .Include(c => c.Inventory)
            .Include(c => c.Weapons)
            .Include(c => c.Abilities)
            .Include(c => c.Notes)
            // Removemos a trava do UserId daqui para podermos checar quem é o Mestre
            .FirstOrDefaultAsync(c => c.Id == id); 

        if (character == null) return NotFound();

        // 1. Se for o dono da ficha, pode abrir!
        if (character.UserId == userId) 
            return character;

        // 2. Se não for o dono, vamos ver se ele é o Mestre desta campanha!
        var campaign = await _context.Campaigns.FindAsync(character.CampaignId);
        if (campaign != null && campaign.MasterUserId == userId)
        {
            return character; // Mestre tem permissão total de leitura!
        }

        // 3. Se for um jogador tentando abrir a ficha do coleguinha, bloqueia!
        return Forbid();
    }

    // PUT: api/Characters/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCharacter(int id, Character characterUpdate)
    {
        if (id != characterUpdate.Id) return BadRequest("O ID da URL não bate com o ID da ficha.");

        int userId = GetCurrentUserId();

        var existingCharacter = await _context.Characters
            .Include(c => c.Skills)
            .Include(c => c.Inventory)
            .Include(c => c.Weapons)
            .Include(c => c.Abilities)
            .Include(c => c.Notes)
            .FirstOrDefaultAsync(c => c.Id == id); 

        if (existingCharacter == null) return NotFound();

        // Trava de segurança para edição: Mestre ou Dono da ficha
        bool isOwner = existingCharacter.UserId == userId;
        var campaign = await _context.Campaigns.FindAsync(existingCharacter.CampaignId);
        bool isMaster = campaign != null && campaign.MasterUserId == userId;

        if (!isOwner && !isMaster) return Forbid(); // Só dono ou mestre salvam

        // Mantém o dono original da ficha para que o mestre não "roube" a ficha ao salvar
        characterUpdate.UserId = existingCharacter.UserId; 
        characterUpdate.CampaignId = existingCharacter.CampaignId;

        _context.Entry(existingCharacter).CurrentValues.SetValues(characterUpdate);

        _context.CharacterSkills.RemoveRange(existingCharacter.Skills);
        _context.CharacterItems.RemoveRange(existingCharacter.Inventory);
        _context.Weapons.RemoveRange(existingCharacter.Weapons);
        _context.Abilities.RemoveRange(existingCharacter.Abilities);
        _context.Notes.RemoveRange(existingCharacter.Notes);

        foreach (var skill in characterUpdate.Skills) { skill.Id = 0; existingCharacter.Skills.Add(skill); }
        foreach (var item in characterUpdate.Inventory) { item.Id = 0; existingCharacter.Inventory.Add(item); }
        foreach (var weapon in characterUpdate.Weapons) { weapon.Id = 0; existingCharacter.Weapons.Add(weapon); }
        foreach (var ability in characterUpdate.Abilities) { ability.Id = 0; existingCharacter.Abilities.Add(ability); }
        foreach (var note in characterUpdate.Notes) { note.Id = 0; existingCharacter.Notes.Add(note); }

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) {
            if (!CharacterExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    // POST: api/Characters
    [HttpPost]
    public async Task<ActionResult> PostCharacter(Character character)
    {
        try 
        {
            int userId = GetCurrentUserId(); 

            // ANTI-FANTASMA: Verifica se o usuário do token realmente existe no banco novo
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists) 
            {
                return StatusCode(401, new { error = "Sessão expirada ou banco recriado! Faça logout e crie a sua conta de novo." });
            }

            character.UserId = userId; 

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();
            
            // Devolve apenas o necessário para evitar loops no React
            return Ok(new { id = character.Id, message = "Ficha forjada com sucesso!" });
        }
        catch (Exception ex) 
        {
            Console.WriteLine($"\n🚨 [ERRO CRÍTICO AO SALVAR FICHA]: {ex.Message}");
            if (ex.InnerException != null) {
                Console.WriteLine($"➡️ [DETALHE INTERNO]: {ex.InnerException.Message}\n");
            }
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    // DELETE: api/Characters/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        int userId = GetCurrentUserId();

        var character = await _context.Characters.FirstOrDefaultAsync(c => c.Id == id);
        
        if (character == null) return NotFound();

        // Trava de segurança para exclusão: Mestre ou Dono da ficha
        bool isOwner = character.UserId == userId;
        var campaign = await _context.Campaigns.FindAsync(character.CampaignId);
        bool isMaster = campaign != null && campaign.MasterUserId == userId;

        if (!isOwner && !isMaster) return Forbid();

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CharacterExists(int id)
    {
        return _context.Characters.Any(e => e.Id == id);
    }
}