import { useState, useEffect } from 'react';

export default function AdminPanel({ authToken, showToast, setCurrentPage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://korzel-api.onrender.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        showToast("Acesso Negado.", "error");
        setCurrentPage('início');
      }
    } catch (e) {
      showToast("Erro ao conectar com o santuário.", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [authToken]);

  const toggleBlock = async (id, currentStatus) => {
    if (window.confirm(currentStatus ? "Desbloquear este aventureiro?" : "Banir este aventureiro?")) {
      try {
        const res = await fetch(`https://korzel-api.onrender.com/api/admin/users/${id}/block`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
          showToast(currentStatus ? "Aventureiro perdoado!" : "Aventureiro banido!", "success");
          fetchUsers();
        } else {
          showToast(await res.text(), "error");
        }
      } catch (e) {}
    }
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`ATENÇÃO! Deseja obliterar a conta de ${name} para sempre? (Isto apagará todas as fichas e campanhas dele)`)) {
      try {
        const res = await fetch(`https://korzel-api.onrender.com/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
          showToast("Conta obliterada com sucesso.", "success");
          fetchUsers();
        } else {
          showToast(await res.text(), "error");
        }
      } catch (e) {}
    }
  };

  if (loading) return <div className="text-red-500 font-bold p-8 text-center animate-pulse">Acessando o olho que tudo vê...</div>;

  return (
    <div className="flex flex-col p-4 lg:p-8 animate-fade-in max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end mb-6 border-b border-red-900/50 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 uppercase tracking-widest flex items-center gap-3">
            <span>👁️</span> Painel do Criador
          </h1>
          <p className="text-zinc-500 text-xs tracking-widest mt-1">Controle absoluto sobre as almas de Korzel</p>
        </div>
        <button onClick={() => setCurrentPage('início')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors border border-zinc-600">Voltar</button>
      </div>

      <div className="bg-[#140c08] border border-red-900/30 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-950/20 text-red-500 text-[10px] uppercase tracking-widest border-b border-red-900/50">
              <th className="p-4 font-bold">ID</th>
              <th className="p-4 font-bold">Aventureiro</th>
              <th className="p-4 font-bold">Grimório (E-mail)</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Julgamento</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                <td className="p-4 text-xs text-zinc-600">#{u.id}</td>
                <td className="p-4 text-sm font-bold text-zinc-200">{u.username}</td>
                <td className="p-4 text-xs text-zinc-400">{u.email}</td>
                <td className="p-4">
                  {u.isBlocked 
                    ? <span className="px-2 py-1 bg-red-950/50 text-red-500 border border-red-900/50 rounded text-[9px] uppercase font-bold tracking-widest">Banido</span>
                    : <span className="px-2 py-1 bg-green-950/50 text-green-500 border border-green-900/50 rounded text-[9px] uppercase font-bold tracking-widest">Ativo</span>
                  }
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  {u.email !== 'dinofalco123@gmail.com' && (
                    <>
                      <button 
                        onClick={() => toggleBlock(u.id, u.isBlocked)} 
                        className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded border transition-colors ${u.isBlocked ? 'bg-amber-900/50 text-amber-500 border-amber-800 hover:bg-amber-800' : 'bg-orange-900/50 text-orange-500 border-orange-800 hover:bg-orange-800'}`}
                      >
                        {u.isBlocked ? 'Desbloquear' : 'Bloquear'}
                      </button>
                      <button 
                        onClick={() => deleteUser(u.id, u.username)} 
                        className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-500 hover:text-white text-[9px] font-bold uppercase tracking-widest rounded border border-red-900 transition-colors"
                      >
                        Obliterar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}