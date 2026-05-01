using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<KorzelContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Ensina o conversor JSON a ignorar o loop infinito
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

//app.UseHttpsRedirection();

// Mapeia as rotas para os Controllers (isso faz a mágica de ligar a URL ao código)
app.MapControllers();

app.Run();