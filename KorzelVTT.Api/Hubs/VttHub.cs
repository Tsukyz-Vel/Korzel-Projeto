using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using KorzelVTT.Api.Data; // 👈 Importa o Banco
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Hubs
{
    public class VttHub : Hub
    {
        // 👇 Preparando o terreno para o Banco de Dados
        private readonly KorzelContext _context;

        public VttHub(KorzelContext context)
        {
            _context = context;
        }

        // 1. Método para colocar os jogadores na mesma sala
        public async Task JoinSession(string sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            Console.WriteLine($"[SIGNALR] Explorador entrou na sala: {sessionId}");
        }

        // 2. Método para repassar um NOVO token criado pelo mestre
        public async Task AddToken(string sessionId, string tokenJson)
        {
            Console.WriteLine($"[SIGNALR] Novo token adicionado na sala {sessionId}");
            await Clients.OthersInGroup(sessionId).SendAsync("TokenAdded", tokenJson);
        }

        // 3. Método para repassar o MOVIMENTO de um token
        public async Task MoveToken(string sessionId, string tokenId, float x, float y)
        {
            // No futuro, podemos colocar o _context.SceneTokens.Update() aqui!
            await Clients.OthersInGroup(sessionId).SendAsync("TokenMoved", tokenId, x, y);
        }

        // 4. Método para avisar que o mestre TROCOU O MAPA
        public async Task ChangeMap(string sessionId, string imageUrl)
        {
            Console.WriteLine($"[SIGNALR] Mapa alterado na sala {sessionId}");
            await Clients.Group(sessionId).SendAsync("MapChanged", imageUrl);
        }

        // Método para avisar que o token mudou de tamanho
        public async Task UpdateTokenSize(string sessionId, string tokenId, int newSize)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("TokenSizeChanged", tokenId, newSize);
        }

        // Método para repassar mensagens do Chat e Rolagens de Dados
        public async Task SendChatMessage(string sessionId, string messageJson)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("ChatMessageReceived", messageJson);
        }

        // ==========================================
        // FERRAMENTAS DO VTT (Pings, Desenhos, Clima)
        // ==========================================
        public async Task SendPing(string sessionId, float x, float y)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("PingReceived", x, y);
        }

        public async Task AddDrawing(string sessionId, string drawingJson)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("DrawingAdded", drawingJson);
        }

        public async Task ClearDrawings(string sessionId)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("DrawingsCleared");
        }

        public async Task AddFog(string sessionId, string fogJson)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("FogAdded", fogJson);
        }

        public async Task ClearFog(string sessionId)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("FogCleared");
        }

        public async Task ChangeWeather(string sessionId, string weatherType)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("WeatherChanged", weatherType);
        }

        public async Task ToggleFog(string sessionId, bool isEnabled)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("FogToggled", isEnabled);
        }

        public async Task UpdateTokenPermission(string campaignId, string tokenId, string? playerName)
        {
            // Este comando pega no aviso do Mestre e grita para todos os jogadores da sala!
            await Clients.Group(campaignId).SendAsync("TokenPermissionChanged", tokenId, playerName);
        }

        public async Task PullPlayersToScene(string campaignId, string syncJson)
        {
             // Agora o mestre grita todas as informações da cena de uma vez!
             await Clients.OthersInGroup(campaignId).SendAsync("PlayersPulled", syncJson);
        }

        // Método para avisar que uma Cena Nova foi forjada
        public async Task AddScene(string campaignId, string sceneJson)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("SceneAdded", sceneJson);
        }

        // Método para avisar que um Token foi apagado da mesa
        public async Task RemoveToken(string campaignId, string tokenId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("TokenRemoved", tokenId);
        }
    }
}