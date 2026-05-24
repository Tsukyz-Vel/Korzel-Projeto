import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({ currentPage, setCurrentPage, loggedUserName, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0a0502] border-b border-[#3e2723] px-4 lg:px-8 py-3 flex items-center justify-between z-[500] relative shadow-[0_5px_15px_rgba(0,0,0,0.5)] shrink-0">
      
      {/* LOGO E TÍTULO */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-bold text-amber-600 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]">
          Korzel VTT
        </span>
      </div>

      {/* LINKS DIREITOS E PERFIL */}
      <div className="flex items-center gap-4 sm:gap-8">
        <button 
          onClick={() => setCurrentPage('início')} 
          className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'início' ? 'text-amber-500 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Início
        </button>
        <button 
          onClick={() => setCurrentPage('compêndio')} 
          className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentPage === 'compêndio' ? 'text-amber-500 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Compêndio
        </button>

        {/* DIVISOR VERTICAL */}
        <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block"></div>

        {/* MENU DO USUÁRIO */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm shadow-inner overflow-hidden">
              👤
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Aventureiro</span>
              <span className="text-xs font-bold tracking-widest uppercase truncate max-w-[100px] text-zinc-300">{loggedUserName}</span>
            </div>
            <span className={`text-[10px] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* DROPDOWN (CAIXA QUE ABRE) */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-[#0a0502] border border-[#3e2723] rounded shadow-[0_10px_25px_rgba(0,0,0,0.9)] flex flex-col py-1 animate-fade-in z-[9999]">
              
              {/* CABEÇALHO DO MENU */}
              <div className="px-4 py-3 border-b border-[#3e2723] mb-1 bg-[#140c08]">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Conectado como</span>
                <span className="text-sm text-amber-500 font-bold uppercase truncate block drop-shadow-md">{loggedUserName}</span>
              </div>
              
              {/* BOTÕES DO MENU */}
              <button 
                onClick={() => { setIsMenuOpen(false); /* Aqui você pode colocar uma função futura de abrir modal de config */ }} 
                className="text-left px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>⚙️</span> Configurações
              </button>
              
              <button 
                onClick={() => { setIsMenuOpen(false); handleLogout(); }} 
                className="text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-[#3e2723] mt-1"
              >
                <span>🚪</span> Sair da Conta
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}