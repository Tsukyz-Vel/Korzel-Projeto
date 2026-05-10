import React, { useState, useEffect } from 'react';
import SessionSidebar from './SessionSidebar';
import { panteaoKorzel } from '../data/korzelData';

const mapaBackground = "https://i.imgur.com/w8N4N3k.jpeg";

export default function VttSession(props) {
  const {
    isMasterMode, scenes, setScenes, gmActiveSceneId, setGmActiveSceneId, playerActiveSceneId, setPlayerActiveSceneId,
    showToast, addNewScene, fileInputRef, handleMapUpload, mapRef, isDraggingMap, handleMapMouseDown,
    handleMapWheel, handleDropOnMap, mapOffset, mapScale, currentSceneObj, sceneTokens, setSceneTokens, draggingToken,
    setDraggingToken, tokenContextMenu, setTokenContextMenu, setMapScale, setSheetModalOpen,
    bringToFront, sendToBack, assignPermission, toggleTokenStatus
  } = props;

  // ==========================================
  // ESTADOS DE FERRAMENTAS E ATALHOS
  // ==========================================
  const [activeTool, setActiveTool] = useState('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const [measureStart, setMeasureStart] = useState(null);
  const [measureEnd, setMeasureEnd] = useState(null);
  const [pings, setPings] = useState([]);
  
  const [drawings, setDrawings] = useState([]); 
  const [currentDrawing, setCurrentDrawing] = useState(null); 

  // ==========================================
  // ESTADOS DA NÉVOA DE GUERRA
  // ==========================================
  const [isFogEnabled, setIsFogEnabled] = useState(false);
  const [fogMode, setFogMode] = useState('reveal');
  const [fogBrushSize, setFogBrushSize] = useState(160); 
  const [fogPaths, setFogPaths] = useState([]);
  const [currentFogPath, setCurrentFogPath] = useState(null);

  // ==========================================
  // ESTADOS DE CLIMA E AMBIENTE
  // ==========================================
  const [weather, setWeather] = useState('none'); 
  const [showWeatherMenu, setShowWeatherMenu] = useState(false);

  // ==========================================
  // ATALHO DA BARRA DE ESPAÇO ROBUSTO
  // ==========================================
  useEffect(() => {
    const handleKeyDownEvent = (e) => {
      if (e.repeat) return; 

      if ((e.code === 'Space' || e.key === ' ') && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) {
        e.preventDefault(); 
        setIsSpacePressed(true);
      }
    };
    
    const handleKeyUpEvent = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        setIsSpacePressed(false);
      }
    };
    
    const handleBlur = () => setIsSpacePressed(false);

    window.addEventListener('keydown', handleKeyDownEvent);
    window.addEventListener('keyup', handleKeyUpEvent);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keyup', handleKeyUpEvent);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // ==========================================
  // ESTADOS DE CENA E TOKENS
  // ==========================================
  const [editingSceneId, setEditingSceneId] = useState(null);
  const [editSceneName, setEditSceneName] = useState("");

  const startEditingScene = (scene) => {
    setEditingSceneId(scene.id);
    setEditSceneName(scene.name);
  };

  const saveSceneName = (id) => {
    if(editSceneName.trim() === "") {
        setEditingSceneId(null);
        return;
    }
    setScenes(prev => prev.map(s => s.id === id ? { ...s, name: editSceneName } : s));
    setEditingSceneId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') saveSceneName(id);
    if (e.key === 'Escape') setEditingSceneId(null);
  };

  // NOVO: Função para deletar cena
  const handleDeleteScene = (e, id) => {
    e.stopPropagation(); // Evita ativar a cena ao clicar no X
    
    if (scenes.length <= 1) {
      showToast("Você precisa ter pelo menos uma cena na campanha!", "error");
      return;
    }

    if (window.confirm("Tem certeza que deseja apagar esta cena? Isso não pode ser desfeito.")) {
      const remainingScenes = scenes.filter(s => s.id !== id);
      setScenes(remainingScenes);
      
      // Se estava na cena que foi apagada, volta pra primeira
      if (gmActiveSceneId === id) setGmActiveSceneId(remainingScenes[0].id);
      if (playerActiveSceneId === id) setPlayerActiveSceneId(remainingScenes[0].id);
      
      showToast("Cena apagada com sucesso.", "success");
    }
  };

  const flipToken = () => {
    if (!tokenContextMenu.tokenId) return;
    setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, flipX: !t.flipX } : t));
    setTokenContextMenu({ ...tokenContextMenu, show: false });
  };

  // ==========================================
  // LÓGICA DO MAPA E FERRAMENTAS
  // ==========================================
  
  const getMapCoords = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - mapOffset.x) / mapScale;
    const y = (e.clientY - rect.top - mapOffset.y) / mapScale;
    return { x, y };
  };

  const localMouseDown = (e) => {
    if (isSpacePressed || e.button === 1 || activeTool === 'select') {
      handleMapMouseDown(e);
      return;
    }

    if (activeTool === 'measure') {
      const coords = getMapCoords(e);
      setMeasureStart(coords);
      setMeasureEnd(coords);
    } else if (activeTool === 'ping') {
      const coords = getMapCoords(e);
      const newPing = { id: Date.now(), x: coords.x, y: coords.y };
      setPings(prev => [...prev, newPing]);
      setTimeout(() => {
        setPings(prev => prev.filter(p => p.id !== newPing.id));
      }, 2000);
    } else if (activeTool === 'draw' && isMasterMode) {
      const coords = getMapCoords(e);
      setCurrentDrawing([coords]);
    } else if (activeTool === 'fog' && isMasterMode) {
      const coords = getMapCoords(e);
      setCurrentFogPath([coords]);
    }
  };
  
  const localMouseMove = (e) => {
    if (isSpacePressed) return; 

    if (activeTool === 'measure' && measureStart) {
      setMeasureEnd(getMapCoords(e));
    } else if (activeTool === 'draw' && currentDrawing && isMasterMode) {
      const coords = getMapCoords(e);
      setCurrentDrawing(prev => [...prev, coords]);
    } else if (activeTool === 'fog' && currentFogPath && isMasterMode) {
      const coords = getMapCoords(e);
      setCurrentFogPath(prev => [...prev, coords]);
    }
  };

  const localMouseUp = () => {
    if (isSpacePressed) return;

    if (activeTool === 'measure') {
      setMeasureStart(null);
      setMeasureEnd(null);
    } else if (activeTool === 'draw' && currentDrawing && isMasterMode) {
      if (currentDrawing.length > 1) {
        setDrawings(prev => [...prev, { id: Date.now(), points: currentDrawing }]);
      }
      setCurrentDrawing(null);
    } else if (activeTool === 'fog' && currentFogPath && isMasterMode) {
      if (currentFogPath.length > 1) {
        setFogPaths(prev => [...prev, { id: Date.now(), points: currentFogPath, type: fogMode, size: fogBrushSize }]);
      } else {
        const dot = [currentFogPath[0], { x: currentFogPath[0].x + 1, y: currentFogPath[0].y + 1 }];
        setFogPaths(prev => [...prev, { id: Date.now(), points: dot, type: fogMode, size: fogBrushSize }]);
      }
      setCurrentFogPath(null);
    }
  };

  const getDistanceInMeters = () => {
    if (!measureStart || !measureEnd) return 0;
    const distancePx = Math.hypot(measureEnd.x - measureStart.x, measureEnd.y - measureStart.y);
    return ((distancePx / 80) * 1.5).toFixed(1);
  };

  const getDynamicCursor = () => {
    if (isSpacePressed) return undefined;
    if (activeTool === 'fog' || activeTool === 'draw') {
       const baseSize = activeTool === 'fog' ? fogBrushSize : 16;
       const cursorSize = Math.max(16, Math.min(128, baseSize * mapScale)); 
       const half = cursorSize / 2;
       const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}' viewBox='0 0 ${cursorSize} ${cursorSize}'><circle cx='${half}' cy='${half}' r='${half - 2}' fill='none' stroke='white' stroke-width='2'/><circle cx='${half}' cy='${half}' r='${half - 1}' fill='none' stroke='black' stroke-width='2'/></svg>`;
       const encoded = encodeURIComponent(svg);
       return `url("data:image/svg+xml;utf8,${encoded}") ${half} ${half}, crosshair`;
    }
    return undefined;
  };

  const getCursorClass = () => {
    if (isSpacePressed) return isDraggingMap ? 'cursor-grabbing' : 'cursor-grab';
    if (activeTool === 'measure' || activeTool === 'ping' || activeTool === 'draw' || activeTool === 'fog') return 'cursor-crosshair';
    if (isDraggingMap) return 'cursor-grabbing';
    return 'cursor-grab';
  };

  const weatherStyles = `
    @keyframes fall { from { background-position: 0px 0px; } to { background-position: 400px 1000px; } }
    @keyframes drift { from { background-position: 0px 0px; } to { background-position: 200px 1000px; } }
    @keyframes rise { from { background-position: 0px 1000px; } to { background-position: 200px 0px; } }
    
    .weather-rain { 
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cline x1='20' y1='0' x2='25' y2='15' stroke='rgba(255,255,255,0.4)' stroke-width='1' /%3E%3Cline x1='120' y1='60' x2='125' y2='75' stroke='rgba(255,255,255,0.3)' stroke-width='0.8' /%3E%3Cline x1='70' y1='140' x2='75' y2='155' stroke='rgba(255,255,255,0.2)' stroke-width='0.5' /%3E%3C/svg%3E"); 
      animation: fall 0.35s linear infinite; 
    }
    
    .weather-snow { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='20' cy='20' r='2' fill='rgba(255,255,255,0.8)' /%3E%3Ccircle cx='80' cy='70' r='3.5' fill='rgba(255,255,255,0.5)' /%3E%3Ccircle cx='150' cy='130' r='1.5' fill='rgba(255,255,255,0.6)' /%3E%3C/svg%3E"); animation: drift 5s linear infinite; }
    .weather-ash { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='40' cy='40' r='2' fill='rgba(245,158,11,0.8)' /%3E%3Ccircle cx='130' cy='90' r='1.5' fill='rgba(239,68,68,0.6)' /%3E%3Ccircle cx='80' cy='160' r='3' fill='rgba(245,158,11,0.4)' /%3E%3C/svg%3E"); animation: rise 6s linear infinite; }
  `;

  return (
    <div className="flex flex-col flex-1 w-full h-full overflow-hidden animate-fade-in relative min-h-0">
      
      {isMasterMode && (
        <div className="w-full bg-[#0a0502] border-b border-[#3e2723] px-4 py-2 flex items-center justify-between gap-4 z-30 shadow-md shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mr-2 shrink-0">Cenas:</span>
            {scenes.map(scene => (
              // ADICIONADA A CLASSE 'group' PARA O BOTÃO DE EXCLUIR APARECER NO HOVER
              <div key={scene.id} onClick={() => setGmActiveSceneId(scene.id)} onDoubleClick={() => startEditingScene(scene)} className={`group relative flex items-center px-4 py-2 cursor-pointer transition-colors border-2 rounded shrink-0 ${gmActiveSceneId === scene.id ? 'bg-purple-950/40 border-purple-600' : 'bg-black/60 border-zinc-800 hover:border-zinc-500'}`}>
                
                {/* BOTÃO DE DELETAR CENA */}
                <button
                  onClick={(e) => handleDeleteScene(e, scene.id)}
                  className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-900 border border-red-500 text-white text-[10px] opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-20 shadow-md"
                  title="Apagar Cena"
                >
                  ✖
                </button>

                {editingSceneId === scene.id ? (
                  <input autoFocus value={editSceneName} onChange={(e) => setEditSceneName(e.target.value)} onBlur={() => saveSceneName(scene.id)} onKeyDown={(e) => handleKeyDown(e, scene.id)} onClick={(e) => e.stopPropagation()} className="bg-black/80 border-b border-purple-500 text-white text-[10px] font-bold tracking-widest uppercase px-1 focus:outline-none w-24 outline-none" />
                ) : (
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${gmActiveSceneId === scene.id ? 'text-white' : 'text-zinc-500'}`}>{scene.name}</span>
                )}
                
                <button onClick={(e) => { e.stopPropagation(); setPlayerActiveSceneId(scene.id); showToast(`Jogadores movidos para a cena: ${scene.name}`, "success"); }} className={`absolute -top-3 -right-2 w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all ${playerActiveSceneId === scene.id ? 'bg-amber-600 border-white text-white z-10 scale-110 shadow-[0_0_10px_rgba(217,119,6,0.8)]' : 'bg-zinc-800 border-zinc-600 text-zinc-400 opacity-50 hover:opacity-100 z-0 hover:scale-105'}`} title="Puxar jogadores para cá">👁️</button>
              </div>
            ))}
            <button onClick={addNewScene} className="ml-2 w-8 h-8 flex items-center justify-center rounded border border-purple-800 text-purple-500 hover:bg-purple-900/50 transition-colors shrink-0">+</button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        
        <div className="w-12 sm:w-14 bg-[#0a0502] border-r border-[#3e2723] flex flex-col items-center py-4 gap-3 z-20 shadow-[5px_0_15px_rgba(0,0,0,0.8)] shrink-0 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActiveTool('select')} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeTool === 'select' ? 'bg-amber-900/50 text-amber-500 border border-amber-700' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`} title="Selecionar e Mover">👆</button>
          <button onClick={() => setActiveTool('measure')} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeTool === 'measure' ? 'bg-amber-900/50 text-amber-500 border border-amber-700' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`} title="Medir Distância">📏</button>
          <button onClick={() => setActiveTool('ping')} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeTool === 'ping' ? 'bg-amber-900/50 text-amber-500 border border-amber-700' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`} title="Apontar / Ping">🎯</button>

          {isMasterMode && (
            <>
              <button onClick={() => setActiveTool('draw')} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeTool === 'draw' ? 'bg-red-900/50 text-red-500 border border-red-700' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`} title="Desenho Livre">🖌️</button>
              {drawings.length > 0 && <button onClick={() => setDrawings([])} className="w-8 h-8 rounded flex items-center justify-center bg-red-950/40 text-red-500 hover:bg-red-900 hover:text-white border border-red-900/50 mt-1 shrink-0">🗑️</button>}
              <div className="w-6 h-[1px] bg-zinc-800 my-1 shrink-0"></div>
              
              <button onClick={() => setActiveTool('fog')} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeTool === 'fog' ? 'bg-purple-900/50 text-purple-400 border border-purple-700' : 'text-purple-500/50 hover:bg-purple-950/40 hover:text-purple-400 border border-transparent'}`} title="Névoa de Guerra">🌫️</button>
              {activeTool === 'fog' && (
                <div className="flex flex-col gap-2 p-1 bg-purple-950/40 rounded border border-purple-900/50 shrink-0">
                  <button onClick={() => setIsFogEnabled(!isFogEnabled)} className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold transition-colors ${isFogEnabled ? 'bg-purple-600 text-white' : 'bg-black text-zinc-500 border border-zinc-800'}`}>{isFogEnabled ? 'ON' : 'OFF'}</button>
                  <button onClick={() => setFogMode('reveal')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] transition-colors ${fogMode === 'reveal' ? 'bg-zinc-200 text-black' : 'bg-black text-zinc-400'}`} title="Revelar">👁️</button>
                  <button onClick={() => setFogMode('hide')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] transition-colors ${fogMode === 'hide' ? 'bg-zinc-800 text-white border border-zinc-400' : 'bg-black text-zinc-400'}`} title="Esconder">⬛</button>
                  
                  <div className="mt-2 flex flex-col gap-1 border-t border-purple-900/50 pt-2 pb-1">
                    <span className="text-[7px] text-purple-400 uppercase font-bold text-center">Pincel</span>
                    <input type="range" min="40" max="400" value={fogBrushSize} onChange={(e) => setFogBrushSize(Number(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>

                  {fogPaths.length > 0 && <button onClick={() => setFogPaths([])} className="w-6 h-6 rounded flex items-center justify-center bg-red-950/50 text-red-500 hover:bg-red-900 mt-1">🗑️</button>}
                </div>
              )}
              <div className="w-6 h-[1px] bg-zinc-800 my-1 shrink-0"></div>

              <button onClick={() => setShowWeatherMenu(!showWeatherMenu)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 ${showWeatherMenu ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-700' : 'text-cyan-500/50 hover:bg-cyan-950/40 hover:text-cyan-400 border border-transparent'}`}>🌦️</button>
              {showWeatherMenu && (
                <div className="flex flex-col gap-2 p-1 bg-cyan-950/40 rounded border border-cyan-900/50 shrink-0">
                  <button onClick={() => setWeather('none')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] ${weather === 'none' ? 'bg-zinc-200 text-black' : 'bg-black text-zinc-400'}`} title="Céu Limpo">☀️</button>
                  <button onClick={() => setWeather('night')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] transition-colors ${weather === 'night' ? 'bg-indigo-900 text-white shadow-[0_0_10px_rgba(49,46,129,0.8)]' : 'bg-black text-indigo-400 hover:text-white border border-indigo-900'}`} title="Noite Escura">🌙</button>
                  <button onClick={() => setWeather('rain')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] ${weather === 'rain' ? 'bg-blue-600 text-white' : 'bg-black text-blue-400'}`} title="Chuva e Tempo Fechado">🌧️</button>
                  <button onClick={() => setWeather('snow')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] ${weather === 'snow' ? 'bg-white text-black' : 'bg-black text-zinc-300'}`} title="Neve">❄️</button>
                  <button onClick={() => setWeather('ash')} className={`w-6 h-6 rounded flex items-center justify-center text-[12px] ${weather === 'ash' ? 'bg-orange-600 text-white' : 'bg-black text-orange-400'}`} title="Cinzas / Fogo">🔥</button>
                </div>
              )}
              <div className="w-6 h-[1px] bg-zinc-800 my-1 shrink-0"></div>
              <button onClick={() => fileInputRef.current.click()} className="w-8 h-8 rounded border border-purple-900 bg-purple-950/40 flex items-center justify-center text-purple-400 hover:bg-purple-900 mt-1 shrink-0">🗺️</button>
              <input type="file" ref={fileInputRef} onChange={handleMapUpload} accept="image/*" className="hidden" />
            </>
          )}
        </div>

        <style>{weatherStyles}</style>

        <div 
          ref={mapRef} 
          className={`flex-1 relative bg-[#0f0f0f] overflow-hidden select-none touch-none ${getCursorClass()}`} 
          style={{ cursor: getDynamicCursor() }}
          onMouseDown={localMouseDown} 
          onMouseMove={localMouseMove}
          onMouseUp={localMouseUp}
          onMouseLeave={localMouseUp}
          onWheel={handleMapWheel} 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={handleDropOnMap}
        >
          {/* EFEITOS DE AMBIENTE: NOITE E CHUVA (ACINZENTADA) */}
          {weather === 'night' && (
            <div className="absolute inset-0 pointer-events-none z-[9995] bg-[#020617]/70 mix-blend-multiply"></div>
          )}
          {weather === 'rain' && (
            <div className="absolute inset-0 pointer-events-none z-[9995] bg-slate-600/50 mix-blend-multiply" style={{ backdropFilter: 'grayscale(50%)' }}></div>
          )}

          {/* EFEITOS CLIMÁTICOS ANIMADOS */}
          {weather !== 'none' && weather !== 'night' && (
            <div className={`absolute inset-0 pointer-events-none z-[9996] opacity-80 weather-${weather}`}></div>
          )}

          <div id="map-background" className="absolute origin-top-left" style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`, width: '3000px', height: '3000px', willChange: 'transform' }}>
            
            {currentSceneObj && currentSceneObj.bgImage ? (
              <img src={currentSceneObj.bgImage} alt="Mapa Tático" className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none" />
            ) : (
              <img src={mapaBackground} alt="Mapa Tático Padrão" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
            )}
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[9997]" style={{ overflow: 'visible' }}>
              {drawings.map(draw => (
                <polyline key={draw.id} points={draw.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
              ))}
              {activeTool === 'draw' && currentDrawing && !isSpacePressed && (
                <polyline points={currentDrawing.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              )}
              {activeTool === 'measure' && measureStart && measureEnd && !isSpacePressed && (
                <>
                  <line x1={measureStart.x} y1={measureStart.y} x2={measureEnd.x} y2={measureEnd.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 4" className="opacity-80" />
                  <circle cx={measureStart.x} cy={measureStart.y} r="6" fill="#f59e0b" />
                  <circle cx={measureEnd.x} cy={measureEnd.y} r="6" fill="#f59e0b" />
                  <rect x={(measureStart.x + measureEnd.x) / 2 - 30} y={(measureStart.y + measureEnd.y) / 2 - 15} width="60" height="30" rx="4" fill="#3e2723" opacity="0.9" />
                  <text x={(measureStart.x + measureEnd.x) / 2} y={(measureStart.y + measureEnd.y) / 2 + 5} fill="#fcd34d" fontSize="16" fontWeight="bold" textAnchor="middle">{getDistanceInMeters()}m</text>
                </>
              )}
            </svg>

            {pings.map(ping => (
              <div key={ping.id} className="absolute pointer-events-none z-[9998]" style={{ left: ping.x, top: ping.y }}>
                <div className="absolute w-4 h-4 bg-amber-500 rounded-full -ml-2 -mt-2 shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
                <div className="absolute w-24 h-24 border-4 border-amber-500 rounded-full -ml-12 -mt-12 animate-ping opacity-75"></div>
              </div>
            ))}

            {sceneTokens.filter(t => t.sceneId === currentSceneObj?.id && t.inScene).map(token => {
              const statuses = token.statuses || [];
              const isBleeding = statuses.includes('bleeding');
              const isPoisoned = statuses.includes('poisoned');
              const isCamouflaged = statuses.includes('camouflaged');
              
              let shadowClass = "shadow-[0_5px_10px_rgba(0,0,0,0.8)]";
              let dropShadowImg = "drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]";
              
              if (isBleeding && isPoisoned) {
                shadowClass = "shadow-[0_0_15px_rgba(220,38,38,0.9),0_0_15px_rgba(34,197,94,0.9)]";
                dropShadowImg = "drop-shadow-[0_0_10px_rgba(220,38,38,0.9)] drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]";
              } else if (isBleeding) {
                 shadowClass = "shadow-[0_0_15px_rgba(220,38,38,0.9)]";
                 dropShadowImg = "drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]";
              } else if (isPoisoned) {
                 shadowClass = "shadow-[0_0_15px_rgba(34,197,94,0.9)]";
                 dropShadowImg = "drop-shadow-[0_0_15px_rgba(34,197,94,0.9)]";
              }

              const baseColorClasses = token.isNpc ? "bg-red-950 border-red-500" : "bg-blue-950 border-blue-400";

              return (
                <div 
                  key={token.id} 
                  onMouseDown={(e) => { 
                    if (activeTool === 'select' && !isSpacePressed) {
                      e.stopPropagation(); 
                      setDraggingToken(token.id); 
                    }
                  }} 
                  onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setTokenContextMenu({ show: true, x: e.clientX, y: e.clientY, tokenId: token.id }); }} 
                  style={{ top: `${token.y}px`, left: `${token.x}px`, width: `${token.size}px`, height: `${token.size}px`, zIndex: draggingToken === token.id ? 9999 : (token.zIndex || 10), willChange: 'top, left, transform', transform: 'translateZ(0)' }} 
                  className={`absolute flex items-center justify-center transition-transform duration-100 ${(activeTool === 'select' && !isSpacePressed) ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''} ${draggingToken === token.id ? 'scale-110' : ''} ${isCamouflaged ? 'opacity-40' : 'opacity-100'} ${!token.image ? `rounded-full border-2 ${baseColorClasses} ${shadowClass}` : ''}`} 
                  title={token.name}
                >
                  {token.image ? (
                    <img src={token.image} alt={token.name} className={`w-full h-full object-contain pointer-events-none ${dropShadowImg} ${token.flipX ? '-scale-x-100' : ''}`} draggable="false" />
                  ) : (
                    <span className={`text-white text-xl font-bold pointer-events-none ${token.flipX ? '-scale-x-100 block' : ''}`}>{token.name.charAt(0)}</span>
                  )}
                  {statuses.length > 0 && (
                    <div className="absolute -top-3 -right-3 flex gap-1 pointer-events-none z-20">
                      {isBleeding && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-red-900 shadow-md">🩸</span>}
                      {isPoisoned && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-green-900 shadow-md">☠️</span>}
                    </div>
                  )}
                </div>
              );
            })}

            {isFogEnabled && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-[9999]" style={{ overflow: 'visible' }}>
                <defs>
                  <mask id="fog-mask">
                    <rect x="0" y="0" width="3000" height="3000" fill="white" />
                    {fogPaths.map(path => (
                      <polyline key={path.id} points={path.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={path.type === 'reveal' ? "black" : "white"} strokeWidth={path.size || 160} strokeLinecap="round" strokeLinejoin="round" />
                    ))}
                    {activeTool === 'fog' && currentFogPath && !isSpacePressed && (
                      <polyline points={currentFogPath.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={fogMode === 'reveal' ? "black" : "white"} strokeWidth={fogBrushSize} strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </mask>
                </defs>
                <rect x="0" y="0" width="3000" height="3000" fill="#050505" opacity={isMasterMode ? "0.85" : "1"} mask="url(#fog-mask)" />
              </svg>
            )}

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

        <SessionSidebar {...props} />
      </div>

      {tokenContextMenu.show && (
        <div className="fixed z-[9999] bg-zinc-950 border-2 border-[#3e2723] rounded shadow-[0_5px_20px_rgba(0,0,0,0.9)] flex flex-col p-1 w-48" style={{ top: tokenContextMenu.y, left: tokenContextMenu.x }}>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-3 py-1 border-b border-[#3e2723] mb-1">Camadas & Posse</span>
          <button onClick={bringToFront} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬆️ Trazer p/ Frente</button>
          <button onClick={sendToBack} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬇️ Enviar p/ Trás</button>
          
          <button onClick={flipToken} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">↔️ Espelhar Imagem</button>

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