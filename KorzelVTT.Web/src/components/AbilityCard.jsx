export default function AbilityCard({ title, type, cost, description, onEdit, onDelete }) {
  const isDivine = type === "Dádiva Divina";
  return ( 
    <div className={`relative bg-zinc-900/30 border ${isDivine ? 'border-purple-900/50' : 'border-zinc-800'} rounded-lg p-4 mb-4 shadow-md group transition-all`}> 
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"> <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-colors">✏️</button> <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-colors">🗑️</button> </div> 
      <div className="flex justify-between items-start mb-3 pr-12"> 
        <div className="flex flex-col"> <h4 className={`${isDivine ? 'text-purple-400' : 'text-white'} font-bold text-lg tracking-wide`}>{title}</h4> <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{type}</span> </div> 
        {cost && ( <div className={`${isDivine ? 'bg-purple-950/40 border-purple-900/50 text-purple-400' : 'bg-amber-950/40 border-amber-900/50 text-amber-500'} border px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-inner`}>{cost}</div> )} 
      </div> 
      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{description}</p> 
    </div> 
  );
}