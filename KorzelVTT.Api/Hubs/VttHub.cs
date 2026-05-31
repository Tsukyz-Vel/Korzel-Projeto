using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Linq; 
using KorzelVTT.Api.Data;
using KorzelVTT.Api.Models;

namespace KorzelVTT.Api.Hubs
{
    public class VttHub : Hub
    {
        private readonly KorzelContext _context;

        // Dicionário para rastrear: ID da Campanha -> Lista de Nomes
        private static readonly ConcurrentDictionary<string, HashSet<string>> _onlinePlayers = new();
        
        // Para saber em qual campanha a conexão X está
        private static readonly ConcurrentDictionary<string, string> _connectionToCampaign = new();
        
        // Para saber o NOME do jogador dessa conexão (para poder apagar quando ele sair)
        private static readonly ConcurrentDictionary<string, string> _connectionToPlayer = new();

        public VttHub(KorzelContext context)
        {
            _context = context;
        }

        public async Task JoinSession(string sessionId, string playerName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            
            // Proteção extra: se o nome vier vazio, chamamos de "Anônimo"
            string safeName = string.IsNullOrWhiteSpace(playerName) ? "Explorador Anônimo" : playerName;

            // Salva os dados desta conexão
            _connectionToCampaign[Context.ConnectionId] = sessionId;
            _connectionToPlayer[Context.ConnectionId] = safeName;

            // Cria a lista da sala se não existir
            if (!_onlinePlayers.ContainsKey(sessionId))
            {
                _onlinePlayers[sessionId] = new HashSet<string>();
            }
            
            _onlinePlayers[sessionId].Add(safeName);

            Console.WriteLine($"[SIGNALR] {safeName} entrou na sala: {sessionId}");

            // Grita no rádio para a sala inteira atualizar as bolinhas na tela
            await Clients.Group(sessionId).SendAsync("UpdatePlayerList", _onlinePlayers[sessionId].ToList());
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Verifica se a conexão que caiu estava em alguma sala
            if (_connectionToCampaign.TryGetValue(Context.ConnectionId, out string sessionId))
            {
                // Descobre o nome do jogador que caiu
                if (_connectionToPlayer.TryGetValue(Context.ConnectionId, out string playerName))
                {
                    // Remove o jogador da lista da sala
                    if (_onlinePlayers.ContainsKey(sessionId))
                    {
                        _onlinePlayers[sessionId].Remove(playerName);
                        
                        // Atualiza a bolinha de todo mundo, removendo o cara que caiu
                        await Clients.Group(sessionId).SendAsync("UpdatePlayerList", _onlinePlayers[sessionId].ToList());
                    }
                    _connectionToPlayer.TryRemove(Context.ConnectionId, out _);
                }
                
                await Clients.Group(sessionId).SendAsync("PlayerDisconnected");
                _connectionToCampaign.TryRemove(Context.ConnectionId, out _);
            }
            await base.OnDisconnectedAsync(exception);
        }

        // ==========================================
        // SISTEMA DE CHAT OTIMIZADO
        // ==========================================
        public async Task SendChatMessage(string sessionId, string messageJson)
        {
            // Sem log de console aqui para não engasgar o servidor grátis do Render quando choverem mensagens.
            // Disparo ultra rápido e direto para quem está na sala
            await Clients.OthersInGroup(sessionId).SendAsync("ChatMessageReceived", messageJson);
        }

        // ==========================================
        // TOKENS, MAPAS E SINCRONIZAÇÃO
        // ==========================================
        public async Task AddToken(string sessionId, string tokenJson)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("TokenAdded", tokenJson);
        }

        public async Task MoveToken(string sessionId, string tokenId, float x, float y)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("TokenMoved", tokenId, x, y);
        }

        public async Task ChangeMap(string sessionId, string imageUrl)
        {
            await Clients.Group(sessionId).SendAsync("MapChanged", imageUrl);
        }

        public async Task UpdateTokenSize(string sessionId, string tokenId, int newSize)
        {
            await Clients.OthersInGroup(sessionId).SendAsync("TokenSizeChanged", tokenId, newSize);
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

        public async Task UpdateCatalog(string campaignId, string catalogJson)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("CatalogUpdated", catalogJson);
        }

        // ==========================================
        // ÁUDIO DA SESSÃO
        // ==========================================
        public async Task PlayMusic(string campaignId, int trackId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("MusicStarted", trackId);
        }

        public async Task StopMusic(string campaignId)
        {
            await Clients.OthersInGroup(campaignId).SendAsync("MusicStopped");
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
    }
}