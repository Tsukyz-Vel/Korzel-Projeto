using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Hubs; // <-- ADICIONADO: Importação da pasta do seu Hub

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

// <-- ADICIONADO: Ativa o motor do SignalR no seu servidor
builder.Services.AddSignalR(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // A porta do seu Front-end
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // <-- ADICIONADO: Essa linha é obrigatória para o SignalR funcionar!
    });
});

var app = builder.Build();

app.UseCors("PermitirReact");

// Mapeia as rotas para os Controllers
app.MapControllers();

// <-- ADICIONADO: Diz para a API qual é o endereço (URL) do WebSocket
app.MapHub<VttHub>("/vtthub");

app.Run();