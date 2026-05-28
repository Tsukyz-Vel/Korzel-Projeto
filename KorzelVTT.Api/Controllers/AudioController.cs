using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AudioController : ControllerBase
{
    private readonly KorzelContext _context;

    public AudioController(KorzelContext context)
    {
        _context = context;
    }

    // 1. Buscar as músicas de uma campanha
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetTracks(int campaignId)
    {
        var tracks = await _context.AudioTracks
            .Where(a => a.CampaignId == campaignId)
            .Select(a => new { a.Id, a.Name, a.Category, a.Base64Data }) // Pegamos a música convertida
            .ToListAsync();

        return Ok(tracks);
    }

    // 2. O Mestre faz upload de uma música nova
    [HttpPost]
    public async Task<IActionResult> UploadTrack(AudioTrack track)
    {
        _context.AudioTracks.Add(track);
        await _context.SaveChangesAsync();
        return Ok(new { track.Id, track.Name, track.Category, message = "Música salva no banco!" });
    }

    // 3. Excluir música
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrack(int id)
    {
        var track = await _context.AudioTracks.FindAsync(id);
        if (track == null) return NotFound();

        _context.AudioTracks.Remove(track);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Música removida." });
    }
}