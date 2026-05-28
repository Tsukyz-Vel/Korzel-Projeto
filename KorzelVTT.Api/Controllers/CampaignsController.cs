using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Authorize] // 🛑 Proteção: Só utilizadores logados gerem campanhas
[Route("api/[controller]")]
[ApiController]
public class CampaignsController : ControllerBase
{
    private readonly KorzelContext _context;

    public CampaignsController(KorzelContext context)
    {
        _context = context;
    }

    // DTOs para receber dados limpos do React
    public class CreateCampaignDto
    {
        public string Name { get; set; } = string.Empty;
    }

   public class JoinCampaignDto
    {
        public string InviteCode { get; set; } = string.Empty;
        // Arrancamos o CharacterId daqui!
    }

    // Helper para descobrir o ID do utilizador logado através do Token JWT
    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // ==========================================
    // 1. CRIAR UMA CAMPANHA (SALA)
    // ==========================================
    [HttpPost]
    public async Task<IActionResult> CreateCampaign(CreateCampaignDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("O nome da campanha não pode estar vazio.");

        int userId = GetCurrentUserId();

        // Cria a campanha e gera um código de convite aleatório de 6 dígitos
        var campaign = new Campaign
        {
            Name = request.Name,
            MasterUserId = userId,
            InviteCode = GenerateRandomInviteCode()
        };

        _context.Campaigns.Add(campaign);
        await _context.SaveChangesAsync();

        return Ok(campaign);
    }

    // ==========================================
    // 2. LISTAR CAMPANHAS DO UTILIZADOR
    // ==========================================
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetMyCampaigns()
    {
        int userId = GetCurrentUserId();

        // 👇 SOLUÇÃO: O .Include() diz ao banco para carregar a lista de fichas junto com a campanha
        // para que o .Any() lá debaixo consiga saber que o jogador faz parte da mesa!
        var campaigns = await _context.Campaigns
            .Include(c => c.Characters) 
            .Where(c => c.MasterUserId == userId || c.Characters.Any(ch => ch.UserId == userId))
            .Select(c => new {
                c.Id,
                c.Name,
                c.InviteCode,
                IsMaster = c.MasterUserId == userId, // Avisa o React se ele é mestre ou jogador nesta sala
                c.CreatedAt
            })
            .ToListAsync();

        return Ok(campaigns);
    }

    // ==========================================
    // 3. ENTRAR NUMA CAMPANHA (JOGADOR)
    // ==========================================
   [HttpPost("join")]
    public async Task<IActionResult> JoinCampaign(JoinCampaignDto request)
    {
        int userId = GetCurrentUserId();

        // 1. Procura a campanha pelo código
        var campaign = await _context.Campaigns
            .FirstOrDefaultAsync(c => c.InviteCode.ToUpper() == request.InviteCode.ToUpper());

        if (campaign == null)
            return NotFound("Código de convite não encontrado nas névoas de Korzel.");

        // 2. Verifica se o jogador já está nessa sala (para não criar 10 fichas em branco se ele clicar 10 vezes)
        var existingCharacter = await _context.Characters
            .FirstOrDefaultAsync(ch => ch.CampaignId == campaign.Id && ch.UserId == userId);

        if (existingCharacter != null)
        {
            return Ok(new { message = "Você já faz parte desta campanha!" });
        }

        // 3. O jogador é novo na sala! Forjamos uma ficha em branco direto no banco.
        var blankCharacter = new Character
        {
            Name = "Nova Ficha", // Nome provisório que ele vai mudar lá dentro
            UserId = userId,
            CampaignId = campaign.Id
        };

        _context.Characters.Add(blankCharacter);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Sucesso! Você entrou na sala '{campaign.Name}'." });
    }
    // ==========================================
    // 4. DETALHES DE UMA CAMPANHA ESPECÍFICA
    // ==========================================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCampaignDetails(int id)
    {
        int userId = GetCurrentUserId();

        var campaign = await _context.Campaigns
            .Include(c => c.Scenes)
            .Include(c => c.Characters)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (campaign == null) return NotFound("Campanha não encontrada.");

        // Segurança: Só o mestre ou os jogadores com fichas vinculadas podem ver os detalhes
        bool isMaster = campaign.MasterUserId == userId;
        bool isPlayer = campaign.Characters.Any(ch => ch.UserId == userId);

        if (!isMaster && !isPlayer)
            return Forbid("Não tens permissão para espreitar esta sessão.");

        return Ok(campaign);
    }

    // FUNÇÃO AUXILIAR: Gera um código de 6 letras/números aleatórios
    private string GenerateRandomInviteCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

[HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCampaign(int id)
    {
        int userId = GetCurrentUserId(); // Descobre quem mandou apagar

        var campaign = await _context.Campaigns.FindAsync(id);
        
        if (campaign == null)
        {
            return NotFound(new { message = "Campanha não encontrada nas névoas." });
        }

        // 👇 SEGURANÇA: Só o Mestre da campanha pode apagá-la
        if (campaign.MasterUserId != userId)
        {
            return Forbid("Só o Mestre pode apagar esta sessão.");
        }

        _context.Campaigns.Remove(campaign);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Campanha apagada com sucesso!" });
    }

}