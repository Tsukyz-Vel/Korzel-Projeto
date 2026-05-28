using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly KorzelContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(KorzelContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // ==========================================
    // ROTA 1: CADASTRAR NOVO USUÁRIO
    // ==========================================
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("As sombras já conhecem este email. Tente outro.");
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password) 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Novo explorador forjado com sucesso!" });
    }

    // ==========================================
    // ROTA 2: FAZER LOGIN
    // ==========================================
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return BadRequest("Email ou senha incorretos.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return BadRequest("Email ou senha incorretos.");
        }

        if (user.IsBlocked)
        {
            return StatusCode(403, "A sua conta foi banida pelas sombras.");
        }

        var token = GenerateJwtToken(user);

        return Ok(new 
        { 
            token = token, 
            userId = user.Id, 
            username = user.Username 
        });
    }

    // ==========================================
    // MÁQUINA DE CRACHÁ (Gera o Token JWT)
    // ==========================================
    private string GenerateJwtToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    // ==========================================
    // ROTA 3: LER DADOS DO USUÁRIO
    // ==========================================
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Aventureiro não encontrado.");
        
        return Ok(new { username = user.Username, email = user.Email });
    }

    // ==========================================
    // ROTA 4: ATUALIZAR DADOS
    // ==========================================
    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Aventureiro não encontrado.");

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != userId))
            return BadRequest("Este pergaminho (email) já está em uso.");
            
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username && u.Id != userId))
            return BadRequest("Este nome de aventureiro já está em uso.");

        user.Username = dto.Username;
        user.Email = dto.Email;

        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Dados forjados com sucesso!", username = user.Username });
    }
} // FIM DA CLASSE DO CONTROLADOR

// ==========================================
// DTOs: Colocados FORA do Controlador
// ==========================================
public class UserRegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserLoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? NewPassword { get; set; }
}