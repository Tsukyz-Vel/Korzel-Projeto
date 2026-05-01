using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly KorzelContext _context;

    public CharactersController(KorzelContext context)
    {
        _context = context;
    }

    // GET: api/characters (Lista os Personagens de forma simples)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        return await _context.Characters.ToListAsync();
    }

    // GET: api/characters/1 (Busca a Ficha COMPLETA de um personagem específico)
    [HttpGet("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        var character = await _context.Characters
            .Include(c => c.Skills)      // Traz as Perícias
            .Include(c => c.Inventory)   // Traz os Itens
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
        {
            return NotFound("Ficha não encontrada nas terras de Korzel!");
        }

        return character;
    }

    // POST: api/characters (Cria a Ficha base)
    [HttpPost]
    public async Task<ActionResult<Character>> CreateCharacter(Character character)
    {
        _context.Characters.Add(character);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCharacter), new { id = character.Id }, character);
    }
    // PUT: api/characters/1 (Atualiza a Ficha Inteira)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCharacter(int id, Character updatedCharacter)
    {
        // Trava de segurança: O ID da URL tem que ser o mesmo da ficha enviada
        if (id != updatedCharacter.Id)
        {
            return BadRequest("O ID da magia de alteração falhou!");
        }

        // Avisa o banco de dados que essa ficha foi modificada
        _context.Entry(updatedCharacter).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var characterExists = await _context.Characters.AnyAsync(c => c.Id == id);
            if (!characterExists)
            {
                return NotFound("Personagem não encontrado nas terras de Korzel!");
            }
            else
            {
                throw;
            }
        }

        return NoContent(); // 204: Sucesso!
    }
}