using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using KorzelVTT.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Remove o limite do servidor Kestrel (Para mapas grandes)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = null; // null significa sem limite
});

// Remove o limite de leitura de JSON e Formulários
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

// DESBLOQUEAR O IIS EXPRESS (Servidor Windows/Somee)
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = null; 
});

// ==========================================================
// 1. CONFIGURAÇÃO DO BANCO DE DADOS (AGORA É SQL SERVER!)
// ==========================================================
builder.Services.AddDbContext<KorzelContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==========================================================
// 2. CONFIGURAÇÃO DO CORS (Preparado para Vercel e Localhost)
// ==========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Aceita pedidos da Vercel, do Localhost, etc.
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Vital para o SignalR funcionar sem travar
    });
});

// ==========================================================
// 3. CONFIGURAÇÃO DA AUTENTICAÇÃO JWT (O SEGURANÇA DA BALADA)
// ==========================================================
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, 
        IssuerSigningKey = new SymmetricSecurityKey(key), 
        ValidateIssuer = true, 
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true, 
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true, 
        ClockSkew = TimeSpan.Zero 
    };
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Ignora os loops infinitos entre Fichas e Perícias/Armas/Itens
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Aumenta o limite do SignalR para aguentar Mapas pesados (Até 10 MB)
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 10 * 1024 * 1024; 
});

var app = builder.Build();

// Mostrar o Swagger mesmo na nuvem ajuda a testar a API no Somee nos primeiros dias
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.UseRouting();

// O CORS precisa vir antes da Autenticação/Autorização
app.UseCors("PermitirReact");

// ==========================================================
// 4. ATIVAR OS GUARDAS NAS PORTAS
// ==========================================================
app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();
// Mapeia a rota do WebSockets/SignalR (O VttHub)
app.MapHub<VttHub>("/vtthub");

app.Run();