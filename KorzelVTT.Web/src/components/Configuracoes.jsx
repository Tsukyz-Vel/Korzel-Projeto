import { useState, useEffect } from 'react';

export default function Configuracoes({ authToken, setLoggedUserName, showToast, setCurrentPage }) {
  const [formData, setFormData] = useState({ username: '', email: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  // 👇 1. ESTADO PARA CONTROLAR A VISIBILIDADE 👇
  const [showPassword, setShowPassword] = useState(false);

  // Busca os dados assim que a tela abre
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://korzelapi.somee.com/api/auth/me', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({ username: data.username, email: data.email, newPassword: '' });
        } else {
          showToast("Erro ao ler os pergaminhos da conta.", "error");
        }
      } catch (e) {
        showToast("A conexão com o reino falhou.", "error");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://korzelapi.somee.com/api/auth/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        showToast("Dados forjados com sucesso!", "success");
        // Atualiza o nome no topo do site e na memória
        setLoggedUserName(data.username);
        localStorage.setItem('korzel_username', data.username);
        setFormData({ ...formData, newPassword: '' }); // Limpa o campo da senha
        setShowPassword(false); // Esconde a senha novamente após salvar
      } else {
        const err = await res.text();
        showToast(err || "Erro ao forjar dados.", "error");
      }
    } catch (e) {
      showToast("A bigorna falhou (Erro de Conexão).", "error");
    }
  };

  if (loading) return <div className="text-amber-500 font-bold p-8 text-center animate-pulse">Desenhando runas de acesso...</div>;

  return (
    <div className="flex justify-center items-center h-full w-full p-4 animate-fade-in">
      <div className="bg-[#140c08] border border-amber-900/50 p-8 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-full max-w-md flex flex-col gap-6">
        <h2 className="text-xl font-bold text-amber-500 uppercase tracking-widest border-b border-amber-900/50 pb-2 flex items-center gap-2 relative">
          <span>⚙️</span> Configurações da Conta
          <button 
            onClick={() => setCurrentPage('início')} 
            className="absolute right-0 top-0 text-zinc-600 hover:text-red-500 transition-colors text-lg"
            title="Fechar"
          >✖</button>
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 block">Nome de Aventureiro</label>
            <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white focus:border-amber-700 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 block">E-mail (Grimório)</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white focus:border-amber-700 outline-none transition-colors" />
          </div>
          
          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 block">
              Nova Senha <span className="text-zinc-600 lowercase">(deixe em branco para não alterar)</span>
            </label>
            <div className="relative">
              {/* 👇 2. AQUI ESTÁ A CHAVE: O TIPO MUDA CONFORME O ESTADO 👇 */}
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.newPassword} 
                onChange={e => setFormData({...formData, newPassword: e.target.value})} 
                placeholder="Oculto pelas Sombras" 
                className="w-full bg-black/50 border border-zinc-800 rounded p-2 pr-10 text-white focus:border-amber-700 outline-none transition-colors placeholder-zinc-700" 
              />
              
              {/* 👇 3. O BOTÃO ALTERNA O ESTADO QUANDO CLICADO 👇 */}
              <button 
                type="button" // Importante para não submeter o form
                onClick={() => setShowPassword(!showPassword)} // Alterna entre true e false
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors focus:outline-none text-base"
                title={showPassword ? "Esconder senha" : "Revelar senha"}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"} {/* Muda o ícone */}
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mt-2">
            <button type="button" onClick={() => setCurrentPage('início')} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest py-2.5 rounded transition-colors text-[10px] border border-zinc-600 shadow-md">Voltar</button>
            <button type="submit" className="flex-1 bg-amber-900 hover:bg-amber-800 text-white font-bold uppercase tracking-widest py-2.5 rounded transition-colors text-[10px] border border-amber-700 shadow-lg">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}