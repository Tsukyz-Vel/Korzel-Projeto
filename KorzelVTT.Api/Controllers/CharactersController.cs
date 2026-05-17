using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CharactersController : ControllerBase
{
    private readonly KorzelContext _context;

    public CharactersController(KorzelContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        // Retorna só os dados básicos para a lista não ficar pesada
        return await _context.Characters
            .Select(c => new Character { 
                Id = c.Id, 
                Name = c.Name, 
                Class = c.Class, 
                Level = c.Level 
            })
            .ToListAsync();
    }

    // GET: api/Characters/5
    // Carrega a ficha do banco de dados e envia para o React
    [HttpGet("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        // O .Include é vital! Sem ele, o Entity Framework busca só o esqueleto do personagem e ignora as listas.
        var character = await _context.Characters
            .Include(c => c.Skills)
            .Include(c => c.Inventory)
            .Include(c => c.Weapons)
            .Include(c => c.Abilities)
            .Include(c => c.Notes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
        {
            return NotFound();
        }

        return character;
    }

    // PUT: api/Characters/5
    // Recebe a ficha modificada do React e salva TUDO no banco
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCharacter(int id, Character characterUpdate)
    {
        if (id != characterUpdate.Id)
        {
            return BadRequest("O ID da URL não bate com o ID da ficha.");
        }

        // Buscamos o personagem antigo no banco de dados com todas as suas listas
        var existingCharacter = await _context.Characters
            .Include(c => c.Skills)
            .Include(c => c.Inventory)
            .Include(c => c.Weapons)
            .Include(c => c.Abilities)
            .Include(c => c.Notes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existingCharacter == null)
        {
            return NotFound();
        }

        // 1. Atualiza os dados básicos (Atributos, PV, PE, Nomes, Mutações...)
        _context.Entry(existingCharacter).CurrentValues.SetValues(characterUpdate);

        // 2. TÁTICA DE VTT: A forma mais à prova de bugs de salvar arrays dinâmicos (como inventário e poderes)
        // é limpar as listas antigas do banco e inserir a versão "fresquinha" que veio do React.
        _context.CharacterSkills.RemoveRange(existingCharacter.Skills);
        _context.CharacterItems.RemoveRange(existingCharacter.Inventory);
        _context.Weapons.RemoveRange(existingCharacter.Weapons);
        _context.Abilities.RemoveRange(existingCharacter.Abilities);
        _context.Notes.RemoveRange(existingCharacter.Notes);

        // 3. Adiciona as novas listas enviadas pelo React
        // Forçamos o Id para 0 para que o banco gere IDs limpos automaticamente e ignore os "Date.now()" do React
        foreach (var skill in characterUpdate.Skills) { skill.Id = 0; existingCharacter.Skills.Add(skill); }
        foreach (var item in characterUpdate.Inventory) { item.Id = 0; existingCharacter.Inventory.Add(item); }
        foreach (var weapon in characterUpdate.Weapons) { weapon.Id = 0; existingCharacter.Weapons.Add(weapon); }
        foreach (var ability in characterUpdate.Abilities) { ability.Id = 0; existingCharacter.Abilities.Add(ability); }
        foreach (var note in characterUpdate.Notes) { note.Id = 0; existingCharacter.Notes.Add(note); }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CharacterExists(id)) return NotFound();
            else throw;
        }

        return NoContent(); // 204: Sucesso, não precisa retornar nada.
    }

    // POST: api/Characters
    // Usado para criar um personagem totalmente novo do zero
    [HttpPost]
    public async Task<ActionResult<Character>> PostCharacter(Character character)
    {
        _context.Characters.Add(character);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCharacter", new { id = character.Id }, character);
    }
    // DELETE: api/Characters/5
    // Deleta o personagem e todas as informações atreladas a ele
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);
        if (character == null)
        {
            return NotFound();
        }

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent(); // 204: Sucesso, sem conteúdo
    }

    private bool CharacterExists(int id)
    {
        return _context.Characters.Any(e => e.Id == id);
    }
}