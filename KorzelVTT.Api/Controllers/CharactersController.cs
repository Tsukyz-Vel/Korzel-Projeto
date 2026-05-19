using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 👈 Necessário para a segurança
using System.Security.Claims; // 👈 Necessário para ler o Token
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Authorize] // 🛑 O SEGURANÇA: Ninguém entra aqui sem um Token válido!
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
        // Puxa o ID do usuário que nós embutimos lá no AuthController
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // GET: api/Characters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        int userId = GetCurrentUserId(); // Descobre quem é

        // Retorna APENAS as fichas onde o dono é o usuário logado
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
            // Filtro duplo: Tem que ser o ID da ficha E pertencer ao usuário logado
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId); 

        if (character == null) return NotFound();

        return character;
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
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId); // 👈 Proteção aqui também

        if (existingCharacter == null) return NotFound();

        // Trava de segurança: Garante que o hacker não mude o dono da ficha no JSON
        characterUpdate.UserId = userId; 

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
    public async Task<ActionResult<Character>> PostCharacter(Character character)
    {
        // Quando forjar uma ficha nova, ignora o React e amarra ela ao usuário do Token
        character.UserId = GetCurrentUserId(); 

        _context.Characters.Add(character);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetCharacter", new { id = character.Id }, character);
    }

    // DELETE: api/Characters/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        int userId = GetCurrentUserId();

        // Só deixa deletar se a ficha for da pessoa
        var character = await _context.Characters.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (character == null) return NotFound();

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CharacterExists(int id)
    {
        return _context.Characters.Any(e => e.Id == id);
    }
}