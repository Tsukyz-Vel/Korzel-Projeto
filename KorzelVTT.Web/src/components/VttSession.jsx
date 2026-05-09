import React from 'react';
import SessionSidebar from './SessionSidebar';

const mapaBackground = "https://i.imgur.com/w8N4N3k.jpeg";

export default function VttSession(props) {
  const {
    isMasterMode, scenes, gmActiveSceneId, setGmActiveSceneId, playerActiveSceneId, setPlayerActiveSceneId,
    showToast, addNewScene, fileInputRef, handleMapUpload, mapRef, isDraggingMap, handleMapMouseDown,
    handleMapWheel, handleDropOnMap, mapOffset, mapScale, currentSceneObj, sceneTokens, draggingToken,
    setDraggingToken, tokenContextMenu, setTokenContextMenu, setMapScale, setSheetModalOpen,
    bringToFront, sendToBack, assignPermission, toggleTokenStatus
  } = props;

  return (
    <div className="flex flex-col flex-1 w-full h-full overflow-hidden animate-fade-in relative min-h-0">
      
      {/* Top Bar do Mestre */}
      {isMasterMode && (
        <div className="w-full bg-[#0a0502] border-b border-[#3e2723] px-4 py-2 flex items-center justify-between gap-4 z-30 shadow-md shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mr-2 shrink-0">Cenas:</span>
            {scenes.map(scene => (
              <div key={scene.id} onClick={() => setGmActiveSceneId(scene.id)} className={`relative flex items-center px-4 py-2 cursor-pointer transition-colors border-2 rounded shrink-0 ${gmActiveSceneId === scene.id ? 'bg-purple-950/40 border-purple-600' : 'bg-black/60 border-zinc-800 hover:border-zinc-500'}`}>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${gmActiveSceneId === scene.id ? 'text-white' : 'text-zinc-500'}`}>{scene.name}</span>
                <button onClick={(e) => { e.stopPropagation(); setPlayerActiveSceneId(scene.id); showToast(`Jogadores movidos para a cena: ${scene.name}`, "success"); }} className={`absolute -top-3 -right-2 w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all ${playerActiveSceneId === scene.id ? 'bg-amber-600 border-white text-white z-10 scale-110 shadow-[0_0_10px_rgba(217,119,6,0.8)]' : 'bg-zinc-800 border-zinc-600 text-zinc-400 opacity-50 hover:opacity-100 z-0 hover:scale-105'}`} title={playerActiveSceneId === scene.id ? "Jogadores estão a ver esta cena" : "Puxar jogadores para cá"}>👁️</button>
              </div>
            ))}
            <button onClick={addNewScene} className="ml-2 w-8 h-8 flex items-center justify-center rounded border border-purple-800 text-purple-500 hover:bg-purple-900/50 transition-colors shrink-0">+</button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        
        {/* Toolbar Esquerda */}
        <div className="w-12 sm:w-14 bg-[#0a0502] border-r border-[#3e2723] flex flex-col items-center py-4 gap-4 z-20 shadow-[5px_0_15px_rgba(0,0,0,0.8)] shrink-0">
          <button className="w-8 h-8 rounded hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-colors" title="Selecionar">👆</button>
          <button className="w-8 h-8 rounded hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-colors" title="Medir Distância">📏</button>
          <div className="w-6 h-[1px] bg-zinc-800 my-2"></div>
          {isMasterMode && (
            <>
              <button onClick={() => fileInputRef.current.click()} className="w-8 h-8 rounded mt-4 border border-purple-900 bg-purple-950/40 flex items-center justify-center text-purple-400 hover:bg-purple-900 transition-colors" title="Mudar Cenário (Fundo)">🗺️</button>
              <input type="file" ref={fileInputRef} onChange={handleMapUpload} accept="image/*" className="hidden" />
            </>
          )}
        </div>

        {/* MAPA */}
        <div ref={mapRef} className={`flex-1 relative bg-[#0f0f0f] overflow-hidden ${isDraggingMap ? 'cursor-grabbing' : 'cursor-grab'} select-none touch-none`} onMouseDown={handleMapMouseDown} onWheel={handleMapWheel} onDragOver={(e) => e.preventDefault()} onDrop={handleDropOnMap}>
          <div id="map-background" className="absolute origin-top-left" style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`, width: '3000px', height: '3000px' }}>
            {currentSceneObj && currentSceneObj.bgImage ? (
              <img src={currentSceneObj.bgImage} alt="Mapa Tático" className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none" />
            ) : (
              <img src={mapaBackground} alt="Mapa Tático Padrão" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
            )}
            
            {sceneTokens.filter(t => t.sceneId === currentSceneObj?.id && t.inScene).map(token => {
              const statuses = token.statuses || [];
              const isBleeding = statuses.includes('bleeding');
              const isPoisoned = statuses.includes('poisoned');
              const isCamouflaged = statuses.includes('camouflaged');
              let dropShadow = "drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]";
              if (isBleeding) dropShadow = "drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]";
              if (isPoisoned) dropShadow = "drop-shadow-[0_0_15px_rgba(34,197,94,0.9)]";
              if (isBleeding && isPoisoned) dropShadow = "drop-shadow-[0_0_10px_rgba(220,38,38,0.9)] drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]";

              return (
                <div 
                  key={token.id} 
                  onMouseDown={(e) => { e.stopPropagation(); setDraggingToken(token.id); }} 
                  onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setTokenContextMenu({ show: true, x: e.clientX, y: e.clientY, tokenId: token.id }); }} 
                  style={{ top: `${token.y}px`, left: `${token.x}px`, width: `${token.size}px`, height: `${token.size}px`, zIndex: draggingToken === token.id ? 9999 : (token.zIndex || 10) }} 
                  className={`absolute flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 ${draggingToken === token.id ? 'scale-110' : 'hover:scale-105'} ${isCamouflaged ? 'opacity-40' : 'opacity-100'} ${!token.image ? (token.isNpc ? `rounded-full border-2 bg-red-950 border-red-500 ${isBleeding?'shadow-[0_0_15px_rgba(220,38,38,0.9)]':isPoisoned?'shadow-[0_0_15px_rgba(34,197,94,0.9)]':'shadow-[0_5px_10px_rgba(0,0,0,0.8)]'}` : `rounded-full border-2 bg-blue-950 border-blue-400 ${isBleeding?'shadow-[0_0_15px_rgba(220,38,38,0.9)]':isPoisoned?'shadow-[0_0_15px_rgba(34,197,94,0.9)]':'shadow-[0_5px_10px_rgba(0,0,0,0.8)]'}`) : ''}`} 
                  title={token.name}
                >
                  {token.image ? ( <img src={token.image} alt={token.name} className={`w-full h-full object-contain pointer-events-none ${dropShadow}`} draggable="false" /> ) : ( <span className="text-white text-xl font-bold pointer-events-none">{token.name.charAt(0)}</span> )}
                  {statuses.length > 0 && (
                    <div className="absolute -top-3 -right-3 flex gap-1 pointer-events-none z-20">
                      {isBleeding && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-red-900 shadow-md">🩸</span>}
                      {isPoisoned && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-green-900 shadow-md">☠️</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-purple-950/80 rounded-md overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] border border-purple-800/50 backdrop-blur-sm z-[100]">
            <button onClick={() => setMapScale(s => Math.max(0.2, s - 0.1))} className="px-4 py-2 text-white hover:bg-purple-800 transition-colors font-bold">-</button>
            <span className="px-4 py-2 text-white text-xs font-bold tracking-widest border-x border-purple-800/50">{Math.round(mapScale * 100)}%</span>
            <button onClick={() => setMapScale(s => Math.min(3, s + 0.1))} className="px-4 py-2 text-white hover:bg-purple-800 transition-colors font-bold">+</button>
          </div>

          {!isMasterMode && (
            <button onClick={() => setSheetModalOpen(true)} className="absolute bottom-6 right-6 w-14 h-14 bg-red-900 hover:bg-red-700 border-2 border-red-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform hover:scale-110 z-[100]">
              <span className="text-xl">📖</span>
            </button>
          )}
        </div>

        {/* Chama a Sidebar que criamos no Passo 1! */}
        <SessionSidebar {...props} />
      </div>

      {/* MODAL DE CONTEXTO DO TOKEN MOVIDO PARA CÁ */}
      {tokenContextMenu.show && (
        <div className="fixed z-[9999] bg-zinc-950 border-2 border-[#3e2723] rounded shadow-[0_5px_20px_rgba(0,0,0,0.9)] flex flex-col p-1 w-48" style={{ top: tokenContextMenu.y, left: tokenContextMenu.x }}>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-3 py-1 border-b border-[#3e2723] mb-1">Camadas & Posse</span>
          <button onClick={bringToFront} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬆️ Trazer p/ Frente</button>
          <button onClick={sendToBack} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬇️ Enviar p/ Trás</button>
          {isMasterMode && (
            <button onClick={assignPermission} className="text-left px-3 py-2 text-xs font-bold text-purple-300 hover:bg-purple-900/50 hover:text-purple-200 rounded transition-colors border-t border-purple-900/30 mt-1">👤 Atribuir Jogador</button>
          )}
          <div className="border-t border-[#3e2723] my-1"></div>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-3 py-1 mb-1 block">Condições</span>
          <button onClick={() => toggleTokenStatus('bleeding')} className="text-left px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-zinc-800 rounded transition-colors">🩸 Sangrando</button>
          <button onClick={() => toggleTokenStatus('poisoned')} className="text-left px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-zinc-800 rounded transition-colors">☠️ Envenenado</button>
          <button onClick={() => toggleTokenStatus('camouflaged')} className="text-left px-3 py-1.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800 rounded transition-colors">🌫️ Camuflado</button>
        </div>
      )}
    </div>
  );
}