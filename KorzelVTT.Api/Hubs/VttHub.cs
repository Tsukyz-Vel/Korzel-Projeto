using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Linq; // 👈 Necessário para o .ToList() do radar
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Hubs
{
    public class VttHub : Hub
    {
        // 👇 Preparando o terreno para o Banco de Dados
        private readonly KorzelContext _context;

        // 👇 RADAR DE JOGADORES ONLINE 👇
        // Dicionário para rastrear: ID da Campanha -> Lista de Nomes
        private static readonly ConcurrentDictionary<string, HashSet<string>> _onlinePlayers = new();
        // Para saber em qual campanha a conexão X está quando a pessoa fechar a aba
        private static readonly ConcurrentDictionary<string, string> _connectionToCampaign = new();

        public VttHub(KorzelContext context)
        {
            _context = context;
        }

        // 1. Método para colocar os jogadores na mesma sala (ATUALIZADO COM O NOME)
        public async Task JoinSession(string sessionId, string playerName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            
            // Salva em qual campanha esta conexão entrou
            _connectionToCampaign[Context.ConnectionId] = sessionId;

            // Se a campanha ainda não tem uma lista de jogadores, cria uma
            if (!_onlinePlayers.ContainsKey(sessionId))
            {
                _onlinePlayers[sessionId] = new HashSet<string>();
            }
            
            // Proteção extra: se o nome vier vazio, chamamos de "Anônimo"
            string safeName = string.IsNullOrWhiteSpace(playerName) ? "Explorador Anônimo" : playerName;
            _onlinePlayers[sessionId].Add(safeName);

            Console.WriteLine($"[SIGNALR] {safeName} entrou na sala: {sessionId}");

            // Grita no rádio para a sala inteira atualizar as bolinhas na tela
            await Clients.Group(sessionId).SendAsync("UpdatePlayerList", _onlinePlayers[sessionId].ToList());
        }

        // 👇 NOVO: Quando alguém fecha a aba do navegador ou a internet cai
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connectionToCampaign.TryGetValue(Context.ConnectionId, out string sessionId))
            {
                // Avisa a sala que alguém caiu (para os outros darem ping de volta)
                await Clients.Group(sessionId).SendAsync("PlayerDisconnected");
                _connectionToCampaign.TryRemove(Context.ConnectionId, out _);
            }
            await base.OnDisconnectedAsync(exception);
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
            await Clients.Group(campaignId).SendAsync("TokenPermissionChanged", tokenId, playerName);
        }

        public async Task PullPlayersToScene(string campaignId, string syncJson)
        {
             await Clients.OthersInGroup(campaignId).SendAsync("PlayersPulled", syncJson);
        }

        public async Task AddScene(string campaignId, string sceneJson)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("SceneAdded", sceneJson);
        }

        public async Task RemoveToken(string campaignId, string tokenId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("TokenRemoved", tokenId);
        }

        public async Task RefreshCharacters(string campaignId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("OnCharactersRefreshed");
        }

        public async Task PlayMusic(string campaignId, int trackId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("MusicStarted", trackId);
        }

        public async Task StopMusic(string campaignId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("MusicStopped");
        }

        public async Task UpdateCatalog(string campaignId, string catalogJson)
        {
            // O mestre avisa todos os jogadores que a vitrine da loja mudou
            await Clients.OthersInGroup(campaignId).SendAsync("CatalogUpdated", catalogJson);
        }
    }
}