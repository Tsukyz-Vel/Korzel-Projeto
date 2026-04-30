using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharacterSkillsController : ControllerBase
{
    private readonly KorzelContext _context;

    public CharacterSkillsController(KorzelContext context)
    {
        _context = context;
    }

    // GET: api/characterskills (Lista as Perícias)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CharacterSkill>>> GetSkills()
    {
        return await _context.CharacterSkills.ToListAsync();
    }

    // POST: api/characterskills (Adiciona uma Perícia)
    [HttpPost]
    public async Task<ActionResult<CharacterSkill>> AddSkillToCharacter(CharacterSkill skill)
    {
        var characterExists = await _context.Characters.AnyAsync(c => c.Id == skill.CharacterId);
        if (!characterExists)
        {
            return NotFound("Personagem não encontrado em Korzel!");
        }

        _context.CharacterSkills.Add(skill);
        await _context.SaveChangesAsync();

        return Ok(skill);
    }
}