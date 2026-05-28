using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using KorzelVTT.Api.Data;

namespace KorzelVTT.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly KorzelContext _context;
    // 👇 A CHAVE MESTRA 👇
    private const string AdminEmail = "dinofalco123@gmail.com";

    public AdminController(KorzelContext context)
    {
        _context = context;
    }

    private bool IsAdmin()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        return email == AdminEmail;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        if (!IsAdmin()) return Forbid("Você não tem permissão para acessar o painel divino.");
        
        var users = await _context.Users
            .Select(u => new { u.Id, u.Username, u.Email, u.IsBlocked })
            .ToListAsync();
            
        return Ok(users);
    }

    [HttpPut("users/{id}/block")]
    public async Task<IActionResult> ToggleBlock(int id)
    {
        if (!IsAdmin()) return Forbid();
        
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        if (user.Email == AdminEmail) return BadRequest("O Criador não pode ser banido.");
        
        user.IsBlocked = !user.IsBlocked;
        await _context.SaveChangesAsync();
        
        return Ok(new { message = user.IsBlocked ? "Conta banida das terras de Korzel!" : "Conta restaurada!" });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        if (!IsAdmin()) return Forbid();
        
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        if (user.Email == AdminEmail) return BadRequest("O Criador não pode ser apagado.");
        
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Conta completamente obliterada." });
    }
}