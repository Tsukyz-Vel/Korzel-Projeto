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

    // GET: api/Characters/campaign/5
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetCampaignCharacters(int campaignId)
    {
        int userId = GetCurrentUserId();
        
        var campaign = await _context.Campaigns.FindAsync(campaignId);
        if (campaign == null) return NotFound("Campanha não encontrada.");

        bool isMaster = campaign.MasterUserId == userId;

        var query = _context.Characters.Where(c => c.CampaignId == campaignId);

        if (!isMaster)
        {
            query = query.Where(c => c.UserId == userId);
        }

        var characters = await query
            .Select(c => new { 
                Id = c.Id, 
                Name = c.Name, 
                Class = c.Class, 
                Level = c.Level,
                IsMine = c.UserId == userId 
            })
            .ToListAsync();

        return Ok(characters);
    }

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
            .FirstOrDefaultAsync(c => c.Id == id); 

        if (character == null) return NotFound();

        if (character.UserId == userId) 
            return character;

        if (character.CampaignId > 0) 
        {
            var campaign = await _context.Campaigns.FindAsync(character.CampaignId);
            if (campaign != null && campaign.MasterUserId == userId)
            {
                return character; 
            }
        }

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

        bool isOwner = existingCharacter.UserId == userId;
        bool isMaster = false;

        if (existingCharacter.CampaignId > 0) 
        {
            var campaign = await _context.Campaigns.FindAsync(existingCharacter.CampaignId);
            isMaster = campaign != null && campaign.MasterUserId == userId;
        }

        if (!isOwner && !isMaster) return Forbid(); 

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

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists) 
            {
                return StatusCode(401, new { error = "Sessão expirada ou banco recriado! Faça logout e crie a sua conta de novo." });
            }

            character.UserId = userId; 

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();
            
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

        // 1. CARREGA A FICHA COM TODOS OS SEUS PERTENCES
        var character = await _context.Characters
            .Include(c => c.Skills)
            .Include(c => c.Inventory)
            .Include(c => c.Weapons)
            .Include(c => c.Abilities)
            .Include(c => c.Notes)
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (character == null) return NotFound();

        // 2. CHECA PERMISSÃO
        bool isOwner = character.UserId == userId;
        bool isMaster = false;
        if (character.CampaignId > 0)
        {
            var campaign = await _context.Campaigns.FindAsync(character.CampaignId);
            isMaster = campaign != null && campaign.MasterUserId == userId;
        }

        if (!isOwner && !isMaster) return Forbid();

        // 3. APAGA OS ITENS ÓRFÃOS PRIMEIRO PARA O BANCO NÃO TRAVAR
        _context.CharacterSkills.RemoveRange(character.Skills);
        _context.CharacterItems.RemoveRange(character.Inventory);
        _context.Weapons.RemoveRange(character.Weapons);
        _context.Abilities.RemoveRange(character.Abilities);
        _context.Notes.RemoveRange(character.Notes);

        // 4. AGORA SIM, APAGA A FICHA
        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    private bool CharacterExists(int id)
    {
        return _context.Characters.Any(e => e.Id == id);
    }
}