export default function StatusBar({ title, current, max, colorTheme, onDecrease, onIncrease, onMaxChange }) {
  const themes = { red: { bg: "bg-red-950/80", fill: "bg-red-800", text: "text-red-100", border: "border-red-900/50" }, orange: { bg: "bg-amber-950/80", fill: "bg-amber-700", text: "text-amber-100", border: "border-amber-900/50" }, green: { bg: "bg-green-950/80", fill: "bg-green-800", text: "text-green-100", border: "border-green-900/50" } };
  const theme = themes[colorTheme];
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  return (
    <div className="w-full flex flex-col mb-4">
      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold text-center mb-1 drop-shadow-md">{title}</span>
      <div className={`relative w-full h-10 ${theme.bg} border-2 ${theme.border} rounded-sm overflow-hidden flex items-center justify-between px-1 shadow-inner`}>
        <div className={`absolute top-0 left-0 h-full ${theme.fill} transition-all duration-300 ease-out`} style={{ width: `${percentage}%` }}></div>
        <div className="relative z-10 flex gap-1"><button onClick={() => onDecrease(5)} className="px-2 py-1 text-[10px] font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">-5</button><button onClick={() => onDecrease(1)} className="px-2 py-1 text-sm font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">-</button></div>
        <div className={`relative z-10 flex items-baseline font-bold text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${theme.text}`}><span>{current}</span><span className="text-sm opacity-70 mx-1">/</span><input type="number" value={max} onChange={(e) => onMaxChange(Number(e.target.value))} className="bg-transparent w-10 text-sm opacity-70 focus:outline-none focus:border-b focus:border-white/50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
        <div className="relative z-10 flex gap-1"><button onClick={() => onIncrease(1)} className="px-2 py-1 text-sm font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+</button><button onClick={() => onIncrease(5)} className="px-2 py-1 text-[10px] font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+5</button></div>
      </div>
    </div>
  );
}