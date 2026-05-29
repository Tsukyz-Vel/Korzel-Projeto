import React, { useState, useEffect } from 'react';

export default function Lobby({ handleEnterSession }) {
  // === ESTADOS DA API ===
  const [myCampaigns, setMyCampaigns] = useState([]);
  const token = localStorage.getItem('korzel_token');

  // === ESTADOS DOS MODAIS ===
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  // === BUSCAR DADOS AO CARREGAR A TELA ===
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resCamp = await fetch('https://korzelapi.somee.com/api/campaigns', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resCamp.ok) setMyCampaigns(await resCamp.json());
    } catch (err) {
      console.error("Erro ao buscar dados do Lobby:", err);
    }
  };

  // === FUNÇÕES DE AÇÃO ===
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return alert("Dê um nome para sua campanha!");
    
    try {
      const res = await fetch('https://korzelapi.somee.com/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newCampaignName })
      });
      
      if (res.ok) {
        setNewCampaignName(""); 
        setShowCreateModal(false); 
        fetchData(); 
      } else {
        alert("Falha ao forjar a sala nas névoas.");
      }
    } catch (e) { alert("Erro de conexão com a API."); }
  };

 const handleJoinCampaign = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return alert("Digite o código de convite!");

    try {
      const res = await fetch('https://korzelapi.somee.com/api/campaigns/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ inviteCode: joinCode })
      });
      
      if (res.ok) {
        setJoinCode("");
        setShowJoinModal(false);
        fetchData(); // Atualiza a lista na tela imediatamente
        alert("Sucesso! Você adentrou as névoas. A campanha agora aparece na sua lista.");
      } else {
        const errText = await res.text();
        const cleanErr = errText.includes('"') ? JSON.parse(errText) : errText;
        alert(cleanErr.message || cleanErr || "Erro ao entrar na sala. Código inválido?");
      }
    } catch (e) { alert("Erro de conexão com a API."); }
  };
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Código [ ${code} ] copiado! Envie aos seus jogadores.`);
  };

  // 👇 NOVA FUNÇÃO: DELETAR CAMPANHA 👇
  const handleDeleteCampaign = async (campaignId, campaignName) => {
    if (window.confirm(`Tem a certeza absoluta de que quer excluir a campanha "${campaignName}"? Todas as fichas, mapas e tokens associados a ela serão perdidos no vazio. Esta ação é irreversível.`)) {
      try {
        const res = await fetch(`https://korzelapi.somee.com/api/campaigns/${campaignId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          fetchData(); // Atualiza a lista removendo a que foi apagada
        } else {
          alert(`Erro ao tentar apagar a campanha (Código ${res.status}).`);
        }
      } catch (err) {
        console.error("Erro de conexão ao deletar:", err);
        alert("Erro de conexão ao tentar apagar a campanha.");
      }
    }
  };

  return (
    <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto">
      
      {/* === MODAL DE FORJAR CAMPANHA (MESTRE) === */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <form onSubmit={handleCreateCampaign} className="bg-zinc-950 border-2 border-amber-900/50 rounded-xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(217,119,6,0.3)]">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-lg border-b border-amber-900/50 pb-2 mb-4">
              Forjar Nova Campanha
            </h3>
            <input 
              type="text" 
              value={newCampaignName} 
              onChange={(e) => setNewCampaignName(e.target.value)} 
              placeholder="Ex: A Queda de Verantis..." 
              className="w-full bg-black/60 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:border-amber-500 shadow-inner font-bold mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase transition-colors">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-700 text-white rounded uppercase transition-colors shadow-lg">Criar Sessão</button>
            </div>
          </form>
        </div>
      )}

      {/* === MODAL DE ENTRAR EM CAMPANHA (JOGADOR) === */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <form onSubmit={handleJoinCampaign} className="bg-zinc-950 border-2 border-blue-900/50 rounded-xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            <h3 className="text-blue-500 font-bold uppercase tracking-widest text-lg border-b border-blue-900/50 pb-2 mb-4">
              Adentrar as Névoas
            </h3>
            <input 
              type="text" 
              value={joinCode} 
              onChange={(e) => setJoinCode(e.target.value)} 
              placeholder="CÓDIGO (Ex: AX7B9K)" 
              maxLength={6}
              required
              className="w-full bg-black/60 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:border-blue-500 shadow-inner font-bold mb-6 uppercase"
            />

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowJoinModal(false)} className="flex-1 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase transition-colors">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-700 text-white rounded uppercase transition-colors shadow-lg">Entrar</button>
            </div>
          </form>
        </div>
      )}

      {/* SEÇÃO DAS CAMPANHAS */}
      <section>
        <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-2 mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">As Minhas Campanhas</h2>
          <button 
            onClick={() => setShowJoinModal(true)} 
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors border border-zinc-600"
          >
            + Usar Código
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {myCampaigns.map((camp) => (
            <div key={camp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-700/50 transition-colors group relative">
              
              <div className="h-32 bg-black/60 relative flex items-center justify-center border-b border-zinc-800">
                <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">🐉</span>
                
                {/* Etiqueta de Mestre/Jogador */}
                <div className={`absolute top-2 right-2 text-[9px] uppercase font-bold px-2 py-1 rounded ${camp.isMaster ? 'bg-purple-900/80 text-purple-100' : 'bg-blue-900/80 text-blue-100'}`}>
                  {camp.isMaster ? 'Mestre' : 'Jogador'}
                </div>

                {/* 👇 BOTÃO DA LIXEIRA (APENAS SE FOR MESTRE) 👇 */}
                {camp.isMaster && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(camp.id, camp.name); }}
                    className="absolute top-2 left-2 bg-red-950/80 hover:bg-red-800 border border-red-900 text-red-300 hover:text-white text-[10px] w-6 h-6 flex items-center justify-center rounded transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    title="Apagar esta campanha"
                  >
                    🗑️
                  </button>
                )}
                
                {camp.isMaster && (
                  <button 
                    onClick={() => copyCode(camp.inviteCode)}
                    className="absolute bottom-2 left-2 bg-black/80 border border-amber-900/50 text-amber-500 hover:bg-amber-900/50 text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase tracking-widest"
                    title="Clique para copiar"
                  >
                    Código: {camp.inviteCode}
                  </button>
                )}
              </div>
              
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg truncate" title={camp.name}>{camp.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Criada em: {new Date(camp.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEnterSession(camp.isMaster, camp.id)} 
                    className={`flex-1 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border ${
                      camp.isMaster 
                      ? 'bg-purple-900/50 hover:bg-purple-800 text-purple-200 border-purple-700/50' 
                      : 'bg-blue-900/50 hover:bg-blue-800 text-blue-200 border-blue-700/50'
                    }`}
                  >
                    Entrar na Sessão
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* BOTÃO + NOVA CAMPANHA */}
          <div 
            onClick={() => setShowCreateModal(true)}
            className="bg-zinc-950 border border-zinc-800 border-dashed rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-full min-h-[220px] cursor-pointer hover:bg-zinc-900/50 hover:border-amber-700/50 transition-all group"
          >
            <span className="text-4xl mb-2 text-zinc-600 group-hover:text-amber-500 transition-colors">+</span>
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest group-hover:text-amber-500 transition-colors">Nova Campanha</span>
          </div>
        </div>
      </section>
      
    </div>
  );
}