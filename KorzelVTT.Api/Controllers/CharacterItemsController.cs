using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Rota: /api/characteritems
public class CharacterItemsController : ControllerBase
{
    private readonly KorzelContext _context;

    public CharacterItemsController(KorzelContext context)
    {
        _context = context;
    }

    // GET: api/characteritems (Lista todos os itens do banco)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CharacterItem>>> GetItems()
    {
        return await _context.CharacterItems.ToListAsync();
    }

    // POST: api/characteritems (Adiciona um item à mochila/equipamento do personagem)
    [HttpPost]
    public async Task<ActionResult<CharacterItem>> AddItemToCharacter(CharacterItem item)
    {
        // Trava de segurança: O personagem dono do item realmente existe?
        var characterExists = await _context.Characters.AnyAsync(c => c.Id == item.CharacterId);
        if (!characterExists)
        {
            return NotFound("Personagem não encontrado no banco de dados!");
        }

        _context.CharacterItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(item);
    }
}