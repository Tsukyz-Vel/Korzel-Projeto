import { themeColors } from '../data/korzelData';

export default function AttributeCircle({ name, short, value, onChange, customClass, color = "red", onRoll }) {
  const theme = themeColors[color] || themeColors.red;
  
  return (
    <div className={`absolute flex flex-col items-center justify-between w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-full p-1 sm:p-2 bg-black/60 backdrop-blur-sm transition-all duration-300 ${theme.border} ${theme.shadow} ${customClass}`}>
      <div className="flex-1 flex items-center justify-center w-full">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          onFocus={(e) => e.target.select()} /* <-- Aqui está a mágica que resolve o zero! */
          className={`w-full text-center bg-transparent focus:outline-none text-2xl sm:text-3xl font-bold drop-shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${theme.text}`} 
        />
      </div>
      <div className="w-full flex flex-col items-center pb-1 text-white">
        <div className={`w-3/4 h-[1px] mb-1 opacity-70 ${theme.bg}`}></div>
        <span onClick={() => onRoll(name, value)} className="text-[6px] sm:text-[8px] tracking-widest uppercase font-light leading-none cursor-pointer hover:text-amber-500 transition-colors" title={`Rolar ${name}`}>{name} 🎲</span>
        <span className="text-xs sm:text-sm font-bold uppercase leading-none pointer-events-none">{short}</span>
      </div>
    </div>
  );
}