import { useState, useEffect } from 'react';
import { themeColors } from '../data/korzelData';
import d20Icon from '../assets/d20-red.png';

export default function SkillRow({ name, attrShort, color, trainingLevel, baseTotal, onRoll, onToggleTraining, oficioText, setOficioText }) {
  const theme = themeColors[color] || themeColors.red;
  
  const [outros, setOutros] = useState(0); 
  const total = baseTotal + Number(outros);

  // O estado local protege o campo contra travamentos do React
  const [localOficio, setLocalOficio] = useState(oficioText || "");

  useEffect(() => {
    setLocalOficio(oficioText || "");
  }, [oficioText]);
  
  const renderDiamonds = () => { 
    const tooltipTitles = { 1: "Treinado (+2)", 2: "Veterano (+4)", 3: "Mestre (+6)" };
    return [1, 2, 3].map((level) => (
      <span 
        key={level} 
        onClick={() => onToggleTraining && onToggleTraining(level)}
        className={`text-xs mx-[1px] cursor-pointer hover:scale-125 transition-transform ${trainingLevel >= level ? theme.text : "text-zinc-800 hover:text-zinc-600"}`}
        title={tooltipTitles[level]}
      >
        ♦
      </span>
    )); 
  };
  
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors px-2 group">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button onClick={() => onRoll(name, total)} className="transition-all flex items-center justify-center w-7 h-7 rounded hover:bg-red-950/40 shadow-inner cursor-pointer">
          <img src={d20Icon} alt="🎲" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
        </button>
        <div className={`w-1 h-4 rounded-full opacity-70 ${theme.bg}`}></div>
        
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-sm text-zinc-200 tracking-wide group-hover:text-white transition-colors">{name}</span>
            
            {/* 👇 AGORA O CAMPO APARECE SEMPRE E NUNCA TRAVA 👇 */}
            {name === 'Ofício' && (
             <input 
                type="text" 
                value={localOficio} 
                onChange={(e) => {
                  setLocalOficio(e.target.value);
                  if (setOficioText) setOficioText(e.target.value); // 👉 Envia para a ficha NA HORA!
                }} 
                onClick={(e) => e.stopPropagation()} 
                placeholder="Qual ofício?" 
                className="ml-2 bg-transparent border-b border-zinc-700 text-amber-500 text-[10px] w-24 sm:w-32 focus:outline-none focus:border-amber-500 placeholder-zinc-700" 
              />
            )}
          </div>
          <span className="text-[9px] text-zinc-500 uppercase">{attrShort}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="w-10 flex justify-center">
          <input 
            type="number" 
            value={outros} 
            onChange={(e) => setOutros(e.target.value)} 
            onFocus={(e) => e.target.select()} 
            className="w-8 bg-black/40 border-b border-zinc-700 text-center text-amber-500 font-bold text-sm focus:outline-none focus:border-amber-500 rounded-t-sm" 
          />
        </div>
        <div className="w-12 flex justify-center">{renderDiamonds()}</div>
        <div className="w-8 text-right text-lg font-bold text-white">{total >= 0 ? `+${total}` : total}</div>
      </div>
    </div>
  );
}