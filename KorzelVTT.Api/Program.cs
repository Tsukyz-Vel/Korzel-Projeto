using Microsoft.EntityFrameworkCore;
using KorzelVTT.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Pegamos a frase de conexão que escrevemos no passo anterior
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registramos o banco de dados SQLite no sistema
builder.Services.AddDbContext<KorzelContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/", () => "API do Korzel VTT conectada ao banco de dados!");

app.Run();