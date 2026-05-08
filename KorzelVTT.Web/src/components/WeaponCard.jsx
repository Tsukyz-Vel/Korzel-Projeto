import d20Icon from '../assets/d20-red.png';

export default function WeaponCard({ weapon, skillTotal, onEdit, onDelete, onRollAttack }) {
  return ( 
    <div className="bg-zinc-900/30 border border-zinc-800 hover:border-red-900/50 rounded-lg p-3 flex justify-between items-center transition-all group mb-3 shadow-md"> 
      <div className="flex flex-col pr-12"> 
        <span className="text-white font-bold text-lg tracking-wide group-hover:text-red-100 transition-colors">{weapon.name}</span> 
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1"> {weapon.skill} <span className="mx-1">•</span> {weapon.type} </span> 
      </div> 
      <div className="flex items-center gap-4"> 
        <div className="flex flex-col items-end"> 
          <span className="text-red-400 font-bold text-xl drop-shadow-md">{weapon.damage}</span> 
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Crit {weapon.critMargin}/{weapon.critMultiplier}</span> 
        </div> 
        <div className="relative flex flex-col items-center"> 
          <div className="absolute -top-6 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10 w-[max-content]"> <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-transform hover:scale-110 text-sm">✏️</button> <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-transform hover:scale-110 text-sm">🗑️</button> </div> 
          <button onClick={() => onRollAttack(weapon, skillTotal)} className="h-10 w-10 flex items-center justify-center bg-red-950/40 border border-red-900/50 rounded-md hover:bg-red-900 transition-all shadow-inner relative z-0 group-hover:border-red-500"> <img src={d20Icon} alt="🎲" className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all drop-shadow-md" /> </button> 
        </div> 
      </div> 
    </div> 
  );
}