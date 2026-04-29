using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Define a URL como: /api/users
public class UsersController : ControllerBase
{
    private readonly KorzelContext _context;

    // Construtor: A API injeta o contexto do banco de dados automaticamente aqui
    public UsersController(KorzelContext context)
    {
        _context = context;
    }

    // GET: api/users (Lista todos os usuários cadastrados)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // POST: api/users (Cria um novo usuário no banco)
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        // Por enquanto salvamos a senha direta, mas logo vamos adicionar o Hash de segurança
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }
}