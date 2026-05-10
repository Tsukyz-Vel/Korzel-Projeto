import React, { useState } from 'react';

export default function Lobby({ handleEnterSession, setCurrentPage, charName, charClass, charLevel, campaigns, setCampaigns }) {
  
  // Estados para o Modal de Criar Campanha
  const [showModal, setShowModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return alert("Dê um nome para sua campanha!");
    
    const newCampaign = {
      id: Date.now(),
      name: newCampaignName,
      lastPlayed: "Agora mesmo"
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setNewCampaignName(""); // Limpa o input
    setShowModal(false);    // Fecha o modal
  };

  return (
    <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto">
      
      {/* === MODAL DE NOVA CAMPANHA === */}
      {showModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-zinc-950 border-2 border-amber-900/50 rounded-xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(217,119,6,0.3)]">
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
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase transition-colors">Cancelar</button>
              <button onClick={handleCreateCampaign} className="flex-1 px-4 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-700 text-white rounded uppercase transition-colors shadow-lg">Criar Sessão</button>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO DAS CAMPANHAS */}
      <section>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2 mb-6">As Minhas Campanhas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* RENDERIZAÇÃO DINÂMICA (Lista todas as campanhas criadas) */}
          {campaigns && campaigns.map((camp) => (
            <div key={camp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-700/50 transition-colors group">
              <div className="h-32 bg-black/60 relative flex items-center justify-center border-b border-zinc-800">
                <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">🐉</span>
                <div className="absolute top-2 right-2 bg-amber-900/80 text-amber-100 text-[9px] uppercase font-bold px-2 py-1 rounded">Ativa</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg truncate" title={camp.name}>{camp.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Última sessão: {camp.lastPlayed}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEnterSession(true)} className="flex-1 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-purple-700/50">Entrar Mestre</button>
                  <button onClick={() => handleEnterSession(false)} className="flex-1 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-blue-700/50">Entrar Jogador</button>
                </div>
              </div>
            </div>
          ))}

          {/* BOTÃO + NOVA CAMPANHA */}
          <div 
            onClick={() => setShowModal(true)}
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