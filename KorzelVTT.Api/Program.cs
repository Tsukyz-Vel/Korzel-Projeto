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
// Adicione isso ANTES da linha: var app = builder.Build();
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // A porta do seu Front-end
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("PermitirReact");

// Mapeia as rotas para os Controllers (isso faz a mágica de ligar a URL ao código)
app.MapControllers();

app.Run();