export default function Lobby({ handleEnterSession, setCurrentPage, charName, charClass, charLevel }) {
  return (
    <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto">
      {/* SEÇÃO DAS CAMPANHAS */}
      <section>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2 mb-6">As Minhas Campanhas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-700/50 transition-colors group">
            <div className="h-32 bg-black/60 relative flex items-center justify-center border-b border-zinc-800">
              <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">🐉</span>
              <div className="absolute top-2 right-2 bg-amber-900/80 text-amber-100 text-[9px] uppercase font-bold px-2 py-1 rounded">Ativa</div>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-white font-bold text-lg">Sombras de Korzel</h3>
                <p className="text-xs text-zinc-500 mt-1">Última sessão: Ontem</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEnterSession(true)} className="flex-1 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-purple-700/50">Entrar Mestre</button>
                <button onClick={() => handleEnterSession(false)} className="flex-1 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-blue-700/50">Entrar Jogador</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 border-dashed rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-full min-h-[220px] cursor-pointer hover:bg-zinc-900/50 transition-colors group">
            <span className="text-4xl mb-2 text-zinc-600 group-hover:text-amber-500 transition-colors">+</span>
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest group-hover:text-amber-500 transition-colors">Nova Campanha</span>
          </div>
        </div>
      </section>
      
    </div>
  );
}