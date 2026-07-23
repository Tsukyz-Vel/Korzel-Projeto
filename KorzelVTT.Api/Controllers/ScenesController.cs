using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace KorzelVTT.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ScenesController : ControllerBase
{
    private readonly KorzelContext _context;

    public ScenesController(KorzelContext context)
    {
        _context = context;
    }

    public class UpdateBackgroundDto
    {
        public string BgImage { get; set; } = string.Empty;
    }

    [HttpGet("campaign/{campaignId}")]
    public async Task<ActionResult<IEnumerable<Scene>>> GetScenes(int campaignId)
    {
        var scenes = await _context.Scenes
            .Include(s => s.Tokens)
            .Where(s => s.CampaignId == campaignId)
            .ToListAsync();

        return Ok(scenes);
    }

    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<Scene>> SaveScene(Scene scene)
    {
        if (scene.Id == 0) _context.Scenes.Add(scene);
        else _context.Entry(scene).State = EntityState.Modified;
        
        await _context.SaveChangesAsync();
        return Ok(scene);
    }

    [HttpPost("tokens")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<SceneToken>> AddToken(SceneToken token)
    {
        _context.SceneTokens.Add(token);
        await _context.SaveChangesAsync();
        return Ok(token);
    }

    [HttpPut("tokens/{tokenId}")]
    public async Task<IActionResult> MoveToken(int tokenId, SceneToken tokenUpdate)
    {
        var token = await _context.SceneTokens.FindAsync(tokenId);
        if (token == null) return NotFound();

        token.X = tokenUpdate.X;
        token.Y = tokenUpdate.Y;
        token.Size = tokenUpdate.Size;
        token.ZIndex = tokenUpdate.ZIndex;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("tokens/{tokenId}")]
    public async Task<IActionResult> DeleteToken(int tokenId)
    {
        var token = await _context.SceneTokens.FindAsync(tokenId);
        if (token == null) return NotFound();

        _context.SceneTokens.Remove(token);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/background")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> UpdateBackground(int id, [FromBody] UpdateBackgroundDto request)
    {
        var scene = await _context.Scenes.FindAsync(id);
        if (scene == null) return NotFound("Cena não encontrada.");

        scene.BgImage = request.BgImage;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    // ==========================================
    // ROTA PARA ATUALIZAR A CENA (Nome e Status)
    // ==========================================
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateScene(int id, Scene updatedScene)
    {
        if (id != updatedScene.Id) return BadRequest("ID incompatível.");

        var scene = await _context.Scenes.FindAsync(id);
        if (scene == null) return NotFound("Cena não encontrada.");

        // Atualiza apenas os campos permitidos
        scene.Name = updatedScene.Name;
        scene.IsActive = updatedScene.IsActive;

        await _context.SaveChangesAsync();
        return Ok(scene);
    }

    // ==========================================
    // ROTA PARA DELETAR A CENA
    // ==========================================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteScene(int id)
    {
        var scene = await _context.Scenes.FindAsync(id);
        if (scene == null) return NotFound("Cena não encontrada.");

        _context.Scenes.Remove(scene);
        await _context.SaveChangesAsync();

        // O padrão para exclusão no REST é retornar NoContent (Status 204)
        return NoContent();
    }
}