using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
    // DTOs: Moldes de dados que vêm do React
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

    // ==========================================
    // ROTA 1: CADASTRAR NOVO USUÁRIO
    // ==========================================
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto request)
    {
        // 1. Verifica se o email já foi usado por outro jogador
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("As sombras já conhecem este email. Tente outro.");
        }

        // 2. Cria o usuário e transforma a senha em um código embaralhado (Hash)
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
        // 1. Procura o usuário pelo Email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return BadRequest("Email ou senha incorretos.");
        }

        // 2. Confere se a senha digitada bate com a senha criptografada do banco
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return BadRequest("Email ou senha incorretos.");
        }

        // 3. Tudo certo! Gera o crachá de acesso (Token)
        var token = GenerateJwtToken(user);

        // Devolve o crachá e os dados básicos para o React saber quem logou
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
        // Puxa a sua chave ultra secreta do appsettings.json
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        // Quais informações vão escondidas DENTRO do crachá? (O id e o nome)
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7), // O login dura 7 dias
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token); // Converte o token para um texto longo
    }
}