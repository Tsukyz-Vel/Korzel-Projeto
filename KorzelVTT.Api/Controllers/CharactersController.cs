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
}