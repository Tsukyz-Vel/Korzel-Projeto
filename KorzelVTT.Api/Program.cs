using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using KorzelVTT.Api.Hubs;
// using KorzelVTT.Api.Hubs; // Descomente essa linha se o seu VttHub estiver em uma pasta Hubs

var builder = WebApplication.CreateBuilder(args);

// Remove o limite do servidor Kestrel
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = int.MaxValue;
});

// Remove o limite de leitura de JSON e Formulários
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

// ==========================================================
// 1. CONFIGURAÇÃO DO BANCO DE DADOS
// ==========================================================
builder.Services.AddDbContext<KorzelContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==========================================================
// 2. CONFIGURAÇÃO DO CORS (Permitir o React)
// ==========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // A porta do seu Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Vital para o SignalR funcionar
    });
});

// ==========================================================
// 3. CONFIGURAÇÃO DA AUTENTICAÇÃO JWT (O SEGURANÇA DA BALADA)
// ==========================================================
// Puxa a chave secreta lá do appsettings.json
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Em desenvolvimento pode ser false
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, // Exige que o token esteja assinado
        IssuerSigningKey = new SymmetricSecurityKey(key), // Compara a assinatura com a nossa chave
        ValidateIssuer = true, // Verifica quem emitiu
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true, // Verifica para quem foi emitido
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true, // Verifica se o token já expirou
        ClockSkew = TimeSpan.Zero // Não dá "margem de erro" no tempo de expiração
    };
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Ignora os loops infinitos (ciclos) entre Fichas e Perícias/Armas/Itens
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Aumenta o limite do SignalR para aguentar Mapas pesados (Até 10 MB)
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 10 * 1024 * 1024; 
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = null;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// O CORS precisa vir antes da Autenticação/Autorização
app.UseCors("PermitirReact");

// ==========================================================
// 4. ATIVAR OS GUARDAS NAS PORTAS
// ==========================================================
app.UseAuthentication(); // Descobre QUEM é o usuário lendo o crachá (Token)
app.UseAuthorization();  // Verifica se esse usuário PODE entrar na rota pedida

app.MapControllers();
// 👇 ADICIONE ESTA LINHA AQUI (Ela ensina a API a ouvir o React) 👇
app.MapHub<VttHub>("/vtthub");
// Mapeia a rota do WebSockets/SignalR (O VttHub)
// app.MapHub<VttHub>("/vtthub"); // Descomente e ajuste essa linha se o seu Hub se chamar VttHub e estiver criado

app.Run();