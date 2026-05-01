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
    // DELETE: api/characterskills/5 (Deleta uma perícia específica pelo ID dela)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        // 1. Busca a perícia no banco de dados pelo ID
        var skill = await _context.CharacterSkills.FindAsync(id);
        
        // 2. Se não achar, avisa que não existe
        if (skill == null)
        {
            return NotFound("Perícia não encontrada nas terras de Korzel!");
        }

        // 3. Se achar, remove e salva a alteração
        _context.CharacterSkills.Remove(skill);
        await _context.SaveChangesAsync();

        // 4. Retorna um status 204 (Significa "Deletado com sucesso, não há mais nada para mostrar")
        return NoContent(); 
    }
}