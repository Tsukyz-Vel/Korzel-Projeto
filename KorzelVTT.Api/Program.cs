using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<KorzelContext>(options =>
    options.UseSqlite(connectionString));

// Habilita os serviços de Controllers no container de dependências
builder.Services.AddControllers();

var app = builder.Build();

//app.UseHttpsRedirection();

// Mapeia as rotas para os Controllers (isso faz a mágica de ligar a URL ao código)
app.MapControllers();

app.Run();