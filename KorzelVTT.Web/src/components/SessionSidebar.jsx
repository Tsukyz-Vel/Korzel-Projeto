import React, { useState } from 'react';

export default function SessionSidebar(props) {
  const {
    isMasterMode, sessionTab, setSessionTab, charName, chatInput, setChatInput, chatMessages,
    secretRoll, setSecretRoll, handleChatSubmit, currentSceneObj, sceneTokens, setSceneTokens,
    updateTokenSize, showTokenForm, setShowTokenForm, tokenForm, setTokenForm, tokenLibrary,
    handleCreateToken, handleTokenImageUpload, tokenFileInputRef, handleDragStartFromLibrary,
    audioCategories, activeAudioId, isPlaying, isLooping, setIsLooping, volume, setVolume,
    targetAudioCat, setTargetAudioCat, audioFileInputRef, handleAudioUpload, togglePlayAudio,
    fichaSearch, setFichaSearch, setSheetModalOpen, setCurrentPage,
    lascas, catalog, buyQuantities, updateBuyQty, handleBuyItem, showCatalogForm, setShowCatalogForm,
    editingCatalogIndex, catalogForm, setCatalogForm, handleEditCatalogItem, handleDeleteCatalogItem,
    handleSaveCatalogItem, handleDeleteTokenFromScene, handleDeleteTokenFromLibrary,
    campaignCharacters, handleCreateNewCharacter, loadCharacterFromDb, handleDeleteCharacter,
    handleAddAudioLink // 👈 Função nova desestruturada aqui!
  } = props;
 
  const [targetBuyerId, setTargetBuyerId] = useState('active');
  const [tokenSearch, setTokenSearch] = useState("");

  return (
    <div className="w-80 lg:w-96 bg-[#140c08] border-l border-[#3e2723] flex flex-col z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.8)] shrink-0 h-full min-h-0">
      
      {/* ABAS DA SIDEBAR */}
      <div className="flex flex-wrap border-b border-[#3e2723] bg-[#0a0502] shrink-0">
        {(isMasterMode ? ['Chat', 'Tokens', 'Áudio', 'Fichas', 'Loja'] : ['Chat', 'Fichas', 'Loja']).map(t => (
          <button key={t} onClick={() => setSessionTab(t.toLowerCase())} className={`flex-1 py-3 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase transition-colors ${sessionTab === t.toLowerCase() ? 'bg-[#140c08] text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
            {t}
          </button>
        ))}
      </div>
      
      {/* 1. ABA TOKENS (Apenas Mestre) */}
      {isMasterMode && sessionTab === 'tokens' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative min-h-0">
          <div>
            <h4 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2 mt-2">Em Cena Atual</h4>
            {sceneTokens.filter(t => (isMasterMode || !t.isNpc) && t.sceneId == currentSceneObj?.id).map(token => (
              <div key={token.id} className="bg-black/40 border border-zinc-800/80 rounded p-3 flex flex-col mb-3 hover:border-zinc-600 transition-colors shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-xs overflow-hidden ${token.isNpc ? 'bg-red-950/50 border-red-900 text-red-500' : 'bg-blue-950/50 border-blue-900 text-blue-400'}`}>
                      {token.image ? <img src={token.image} alt={token.name} className="w-full h-full object-cover" /> : token.name.charAt(0)}
                    </div>
                    <span className="text-xs text-white font-bold">{token.name}</span>
                  </div>
                  {isMasterMode && (
                    <button onClick={() => handleDeleteTokenFromScene(token.id)} className="text-[9px] uppercase border border-zinc-700 bg-zinc-900 text-zinc-400 px-2 py-1 rounded hover:bg-red-900/50 hover:text-red-300 hover:border-red-800 transition-colors flex items-center gap-1">
                      <span>X</span>
                    </button>
                  )}
                </div>
                {(isMasterMode || !token.isNpc) && (
                  <div className="mt-3 flex items-center gap-3 border-t border-zinc-800/50 pt-2">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest shrink-0">Tamanho</span>
                    <input type="range" min="20" max="3000" value={token.size || 80} onChange={(e) => updateTokenSize(token.id, e.target.value)} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-800 pt-4 pb-16">
            {showTokenForm ? (
              <div className="bg-purple-950/20 border border-purple-900/50 rounded p-3 mb-4 animate-fade-in shadow-inner">
                <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-3 border-b border-purple-900/50 pb-1">Guardar na Biblioteca</h4>
                <input type="text" placeholder="Nome do Token..." value={tokenForm.name} onChange={e => setTokenForm({...tokenForm, name: e.target.value})} className="w-full bg-black border border-purple-900/50 rounded p-2 text-xs text-white focus:outline-none mb-2" />
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-[10px] text-zinc-400 flex items-center gap-1 cursor-pointer"><input type="radio" checked={tokenForm.isNpc} onChange={() => setTokenForm({...tokenForm, isNpc: true})} className="accent-purple-500" /> Inimigo</label>
                  <label className="text-[10px] text-zinc-400 flex items-center gap-1 cursor-pointer"><input type="radio" checked={!tokenForm.isNpc} onChange={() => setTokenForm({...tokenForm, isNpc: false})} className="accent-purple-500" /> Aliado</label>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded border border-purple-900 bg-black flex items-center justify-center overflow-hidden shrink-0">
                    {tokenForm.image ? <img src={tokenForm.image} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-[10px] text-purple-500/50">Img</span>}
                  </div>
                  <button onClick={() => tokenFileInputRef.current.click()} className="text-[9px] uppercase border border-purple-900 bg-purple-950/50 text-purple-300 px-2 py-1.5 rounded hover:bg-purple-900 transition-colors w-full">Escolher Arte</button>
                  <input type="file" ref={tokenFileInputRef} onChange={handleTokenImageUpload} accept="image/*" className="hidden" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowTokenForm(false)} className="flex-1 text-[9px] uppercase text-zinc-500 hover:text-white py-2">Cancelar</button>
                  <button onClick={handleCreateToken} className="flex-1 bg-purple-900 hover:bg-purple-700 text-white text-[9px] uppercase font-bold tracking-widest py-2 rounded transition-colors shadow-lg">Salvar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowTokenForm(true)} className="w-full bg-purple-900/80 hover:bg-purple-700 text-white text-[10px] uppercase font-bold tracking-widest py-3 rounded transition-colors shadow-lg border border-purple-600 mb-4">+ Novo Personagem/Inimigo</button>
            )}

            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Biblioteca (Arraste)</h4>
              <span className="text-purple-500 text-xs">⭐</span>
            </div>

            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Buscar token por nome..." 
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="w-full bg-black/60 border border-zinc-800 rounded p-2 pl-8 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors shadow-inner" 
              />
              <span className="absolute left-2.5 top-2 opacity-50 text-xs">🔍</span>
            </div>
            
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {tokenLibrary
                .filter(libToken => libToken.name.toLowerCase().includes(tokenSearch.toLowerCase()))
                .map(libToken => (
                <div key={libToken.id} draggable onDragStart={(e) => handleDragStartFromLibrary(e, libToken)} className="bg-black/40 border border-zinc-800/80 rounded p-2 flex items-center justify-between hover:border-purple-600 transition-colors cursor-grab active:cursor-grabbing" title="Arraste para o Mapa">
                  
                  {/* Lado Esquerdo: Imagem e Nome */}
                  <div className="flex items-center gap-3 pointer-events-none">
                    <div className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 ${libToken.isNpc ? 'border-red-900 bg-red-950/50 text-red-400' : 'border-blue-900 bg-blue-950/50 text-blue-400'}`}>
                      {libToken.image ? <img src={libToken.image} alt={libToken.name} className="w-full h-full object-cover" /> : libToken.name.charAt(0)}
                    </div>
                    <span className="text-xs text-white font-bold truncate max-w-[120px]">{libToken.name}</span>
                  </div>
                  
                  {/* Lado Direito: Botão de Lixeira e Mãozinha */}
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteTokenFromLibrary(libToken.id); }} className="text-[10px] text-zinc-600 hover:text-red-500 transition-colors" title="Excluir da Biblioteca">🗑️</button>
                    <span className="text-zinc-600 text-lg hover:text-purple-500 transition-colors">✋</span>
                  </div>
                  
                </div>
              ))}
              
              {/* Mensagem caso a busca não encontre nada */}
              {tokenLibrary.filter(libToken => libToken.name.toLowerCase().includes(tokenSearch.toLowerCase())).length === 0 && (
                <div className="text-center py-4 text-zinc-600 text-[10px] uppercase font-bold tracking-widest border border-dashed border-zinc-800 rounded">
                  Nenhum token encontrado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ABA ÁUDIO (Apenas Mestre) */}
      {isMasterMode && sessionTab === 'áudio' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 min-h-0">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 shrink-0">
            <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Mesa de Som</h4>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 group-hover:text-amber-500 transition-colors">Loop</span>
              <input type="checkbox" checked={isLooping} onChange={e=>setIsLooping(e.target.checked)} className="accent-amber-500 w-3 h-3" />
            </label>
          </div>
          
          {/* 👇 NOVOS BOTÕES DE UPLOAD / LINK 👇 */}
          <div className="flex gap-2 mb-2 shrink-0">
            <button onClick={() => audioFileInputRef.current.click()} className="flex-1 bg-amber-900/50 hover:bg-amber-800 text-amber-200 text-[9px] font-bold uppercase tracking-widest py-2 rounded transition-colors border border-amber-700">
              📁 Upar Arquivo
            </button>
            <button onClick={handleAddAudioLink} className="flex-1 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[9px] font-bold uppercase tracking-widest py-2 rounded border border-purple-700 transition-colors">
              🔗 Usar Link
            </button>
          </div>
          <input type="file" ref={audioFileInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />

          <div className="flex flex-col gap-4">
            {audioCategories.map(category => (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-amber-900/30 pb-1">
                  <h5 className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">{category.name}</h5>
                  <button onClick={() => { setTargetAudioCat(category.id); audioFileInputRef.current.click(); }} className="text-[10px] text-zinc-400 hover:text-amber-500 transition-colors" title="Adicionar música nesta pasta">➕</button>
                </div>
                {category.tracks.length === 0 ? (
                  <p className="text-[9px] text-zinc-600 italic">Nenhuma faixa nesta pasta.</p>
                ) : (
                  category.tracks.map(track => (
                    <div key={track.id} className={`p-3 rounded-lg border flex flex-col gap-3 transition-colors ${activeAudioId === track.id ? 'bg-amber-950/20 border-amber-800/50' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}>
                      
                      <div className="flex justify-between items-center group/track relative">
                        <span className={`text-xs font-bold truncate pr-2 ${activeAudioId === track.id ? 'text-amber-500' : 'text-zinc-300'}`}>
                          {track.name}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          {isMasterMode && (
                            <button 
                              onClick={() => props.handleDeleteAudioTrack(track.id, category.id)} 
                              className="text-[11px] opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
                              title="Excluir faixa do banco"
                            >
                              🗑️
                            </button>
                          )}

                          {/* BOTÃO DE PLAY/PAUSE */}
                          <button onClick={() => togglePlayAudio(track.id)} className={`w-8 h-8 rounded flex items-center justify-center text-lg ${activeAudioId === track.id && isPlaying ? 'bg-amber-600 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                            {activeAudioId === track.id && isPlaying ? '⏸' : '▶'}
                          </button>
                        </div>
                      </div>
                      
                      {/* CONTROLE DE VOLUME */}
                      {activeAudioId === track.id && (
                        <div className="flex items-center gap-3 border-t border-amber-900/30 pt-2 animate-fade-in">
                          <span className="text-xs">🔈</span>
                          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full h-1 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                          <span className="text-xs">🔊</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 3. ABA FICHAS (COM DIVISÓRIAS) */}
      {sessionTab === 'fichas' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative min-h-0">
          
          <div className="relative shrink-0">
            <input type="text" placeholder="Buscar personagem..." value={fichaSearch} onChange={(e) => setFichaSearch(e.target.value)} className="w-full bg-black border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-700" />
            <span className="absolute right-3 top-2.5 opacity-50">🔍</span>
          </div>
          
          <button onClick={handleCreateNewCharacter} className="w-full shrink-0 bg-red-900/50 hover:bg-red-800 text-red-200 text-[10px] font-bold uppercase tracking-widest py-3 rounded transition-colors border border-red-700 shadow-md">
            + Forjar Novo Personagem
          </button>
          
          <div className="flex flex-col gap-3 mt-2">
            
            {/* MÁGICA DA DIVISÃO E RENDERIZAÇÃO */}
            {(() => {
              const filteredChars = (campaignCharacters || []).filter(c => (c.name || "").toLowerCase().includes((fichaSearch || "").toLowerCase()));

              const playerSheets = filteredChars.filter(c => c.isMine === false);
              const mySheets = filteredChars.filter(c => c.isMine !== false); 

              if (filteredChars.length === 0) {
                return (
                  <div className="text-center py-6 opacity-50">
                    <span className="text-2xl mb-2 block">📜</span>
                    <p className="text-xs text-zinc-500 italic">Nenhuma ficha nas redondezas.</p>
                  </div>
                );
              }

              return (
                <>
                  {/* === FICHAS DOS JOGADORES (APENAS MESTRE) === */}
                  {isMasterMode && playerSheets.length > 0 && (
                    <div className="mb-4 animate-fade-in">
                      <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest border-b border-blue-900/50 pb-1 flex items-center gap-2 mb-3 shrink-0">
                        <span>🛡️</span> Heróis da Campanha
                      </span>
                      {playerSheets.map(char => (
                        <div key={char.id} className="bg-black/40 border border-blue-900/50 hover:border-blue-700 rounded p-3 flex flex-col gap-3 shadow-md transition-colors shrink-0 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-500 font-bold text-xs">
                              {char.name ? char.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-white font-bold">{char.name || "Sem Nome"}</span>
                              <span className="text-[9px] text-zinc-500 uppercase mt-0.5">Nvl {char.level || 1} • {char.class || "Desconhecido"}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => loadCharacterFromDb(char.id)} className="flex-1 bg-blue-950/40 hover:bg-blue-900 text-blue-300 border border-blue-900 text-[9px] uppercase font-bold tracking-widest py-2 rounded transition-colors">
                              📖 Inspecionar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* === MINHAS FICHAS (NPCs ou Fichas Próprias) === */}
                  <div className="animate-fade-in">
                    <span className={`text-[9px] font-bold uppercase tracking-widest border-b pb-1 flex items-center gap-2 mb-3 shrink-0 ${isMasterMode ? 'text-purple-400 border-purple-900/50' : 'text-zinc-500 border-zinc-800'}`}>
                      <span>{isMasterMode ? '👾' : '👤'}</span> {isMasterMode ? 'Minhas Fichas (NPCs / Monstros)' : 'Minhas Fichas'}
                    </span>
                    {mySheets.map(char => (
                      <div key={char.id} className="bg-black/40 border border-zinc-800/80 hover:border-red-900/50 rounded p-3 flex flex-col gap-3 shadow-md transition-colors shrink-0 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-red-950 border border-red-900 flex items-center justify-center text-red-500 font-bold text-xs">
                            {char.name ? char.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-white font-bold">{char.name || "Sem Nome"}</span>
                            <span className="text-[9px] text-zinc-500 uppercase mt-0.5">Nvl {char.level || 1} • {char.class || "Desconhecido"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => loadCharacterFromDb(char.id)} className="flex-1 bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-900 text-[9px] uppercase font-bold tracking-widest py-2 rounded transition-colors">
                            📖 Abrir
                          </button>
                          <button onClick={() => handleDeleteCharacter(char.id, char.name)} className="bg-zinc-900/80 hover:bg-red-900 text-zinc-500 hover:text-red-200 border border-zinc-800 hover:border-red-900 text-[10px] px-3 rounded transition-colors" title="Apagar Ficha">
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}
      
      {/* 4. ABA LOJA */}
      {props.sessionTab === 'loja' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 min-h-0">
          <div className="bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg flex justify-between items-center shadow-inner shrink-0">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Sua Bolsa</span>
            <span className="text-lg font-bold text-amber-500">🪙 {props.lascas || 0}</span>
          </div>
          
          {props.isMasterMode && !props.showCatalogForm && (
            <button onClick={props.handleOpenNewCatalogItem} className="w-full shrink-0 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] font-bold uppercase tracking-widest py-2 rounded transition-colors border border-purple-700 shadow-md">
              + Adicionar Produto
            </button>
          )}

          {props.isMasterMode && props.showCatalogForm && (
            <div className="bg-zinc-900/90 border border-purple-700/50 rounded-lg p-3 shrink-0 shadow-lg animate-fade-in">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest border-b border-purple-900/50 pb-1 mb-2">
                {props.editingCatalogIndex !== null ? "🔧 Editar Produto" : "📦 Novo Produto"}
              </h4>
              <div className="flex flex-col gap-2">
                <input type="text" value={props.catalogForm.name} onChange={e => props.setCatalogForm({...props.catalogForm, name: e.target.value})} placeholder="Nome do Item" className="w-full bg-black/50 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500" />
                <div className="flex gap-2">
                  <input type="number" value={props.catalogForm.price} onChange={e => props.setCatalogForm({...props.catalogForm, price: Number(e.target.value)})} placeholder="Preço" className="w-1/2 bg-black/50 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500" />
                  <input type="number" step="0.1" value={props.catalogForm.weight} onChange={e => props.setCatalogForm({...props.catalogForm, weight: Number(e.target.value)})} placeholder="Peso" className="w-1/2 bg-black/50 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500" />
                </div>
                <input type="text" value={props.catalogForm.desc} onChange={e => props.setCatalogForm({...props.catalogForm, desc: e.target.value})} placeholder="Descrição breve" className="w-full bg-black/50 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500" />
                <div className="flex justify-end gap-2 mt-1">
                  <button onClick={() => props.setShowCatalogForm(false)} className="px-3 py-1 text-[9px] font-bold text-zinc-400 hover:text-white uppercase transition-colors">Cancelar</button>
                  <button onClick={props.handleSaveCatalogItem} className="px-3 py-1 text-[9px] font-bold bg-purple-800 hover:bg-purple-600 text-white rounded uppercase transition-colors shadow">Salvar</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-800 pb-1 shrink-0">Mercado Local</span>
            {props.catalog && props.catalog.map((item, index) => {
              const qty = props.buyQuantities[index] || 1;
              return (
                <div key={index} className="bg-black/40 border border-[#3e2723] rounded p-3 flex flex-col gap-2 relative group hover:border-amber-700/80 transition-colors shadow-sm shrink-0">
                  
                  {props.isMasterMode && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => props.handleEditCatalogItem(index)} className="text-[10px] opacity-40 hover:opacity-100 hover:text-purple-400 transition-opacity" title="Editar Produto">✏️</button>
                      <button onClick={() => props.handleDeleteCatalogItem(index)} className="text-[10px] opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity" title="Excluir Produto">🗑️</button>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-white text-sm font-bold block pr-12">{item.name}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">{item.type} • {item.weight} kg</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 italic line-clamp-2">{item.desc}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3e2723]">
                    <span className="text-amber-500 font-bold text-sm">{item.price} Lc</span>
                    
                    <div className="flex flex-col gap-1 items-end">
                       <select 
                         id={`buy-target-${index}`}
                         className="bg-zinc-950 border border-zinc-800 text-[9px] text-zinc-300 rounded px-1 py-1 mb-1 outline-none cursor-pointer max-w-[140px]"
                       >
                         <option value="active">Para: Ficha Aberta</option>
                         {props.savedCharacters?.map(char => (
                           <option key={char.id} value={char.id}>{char.name}</option>
                         ))}
                       </select>

                       <div className="flex gap-2 items-center">
                         <div className="flex items-center bg-zinc-950 border border-amber-900/30 rounded">
                           <button onClick={() => props.updateBuyQty(index, -1)} className="px-2 py-0.5 text-zinc-400 hover:text-white">-</button>
                           <span className="text-xs text-white w-4 text-center">{qty}</span>
                           <button onClick={() => props.updateBuyQty(index, 1)} className="px-2 py-0.5 text-zinc-400 hover:text-white">+</button>
                         </div>
                         
                         <button 
                           onClick={() => {
                              const targetSelect = document.getElementById(`buy-target-${index}`);
                              const targetCharId = targetSelect ? targetSelect.value : "active";
                              props.handleBuyItem(item, index, targetCharId);
                           }} 
                           className="bg-amber-900/80 hover:bg-amber-700 text-amber-100 text-[9px] font-bold uppercase px-3 py-1.5 rounded transition-colors shadow"
                         >
                           Comprar
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {(!props.catalog || props.catalog.length === 0) && (
               <p className="text-[10px] text-zinc-500 italic text-center py-4">O mercado está vazio hoje.</p>
            )}
          </div>
        </div>
      )}
      {/* 5. ABA CHAT */}
      {sessionTab === 'chat' && (
        <div className="flex-1 flex flex-col p-4 overflow-hidden h-full min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2 pb-4 min-h-0">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`p-3 rounded-lg border shrink-0 ${msg.type === 'info' ? 'bg-blue-950/20 border-blue-900/50 text-blue-300' : msg.type === 'roll' ? 'bg-amber-950/20 border-amber-900/50 text-amber-100' : msg.type === 'secret' ? 'bg-purple-950/20 border-purple-900/50 text-purple-200' : 'bg-black/40 border-zinc-800 text-zinc-300'}`}>
                <span className={`text-[10px] uppercase tracking-widest font-bold block mb-1 ${msg.sender === 'Mestre' ? 'text-purple-400' : 'text-amber-600'}`}>{msg.sender}</span>
                <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-zinc-800 pt-4 flex flex-col gap-3 shrink-0">
            {isMasterMode && (
              <label className="flex items-center gap-2 cursor-pointer w-max group">
                <input type="checkbox" checked={secretRoll} onChange={e=>setSecretRoll(e.target.checked)} className="w-3 h-3 accent-purple-600" />
                <span className="text-[9px] uppercase font-bold text-purple-500 group-hover:text-purple-400 tracking-widest transition-colors">🛡️ Escudo do Mestre (Rolar Oculto)</span>
              </label>
            )}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Mensagem ou /r 1d20..." className="flex-1 bg-black border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-700" />
              <button type="submit" className="bg-amber-900/80 hover:bg-amber-700 text-amber-100 px-4 rounded text-[10px] font-bold uppercase tracking-widest border border-amber-700 transition-colors">Enviar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR PRODUTO DO MESTRE */}
      {isMasterMode && showCatalogForm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-purple-900/50 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm border-b border-purple-900/30 pb-2 mb-4">{editingCatalogIndex !== null ? "🔧 Editar Produto" : "📦 Cadastrar Produto"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome</label><input type="text" value={catalogForm.name} onChange={(e) => setCatalogForm({...catalogForm, name: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
              <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Preço (Lc)</label><input type="number" value={catalogForm.price} onChange={(e) => setCatalogForm({...catalogForm, price: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
              <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Peso (kg)</label><input type="number" step="0.1" value={catalogForm.weight} onChange={(e) => setCatalogForm({...catalogForm, weight: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
              <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={catalogForm.type} onChange={(e) => setCatalogForm({...catalogForm, type: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500"><option>Consumível</option><option>Equipamento</option><option>Arma</option><option>Alquimia</option></select></div>
              <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição</label><input type="text" value={catalogForm.desc} onChange={(e) => setCatalogForm({...catalogForm, desc: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCatalogForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase transition-colors">Cancelar</button>
              <button onClick={handleSaveCatalogItem} className="px-4 py-2 text-xs font-bold bg-purple-900 hover:bg-purple-700 text-white rounded uppercase transition-colors shadow-lg">Salvar Produto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}