export default function ItemCard({ name, description, quantity, weight, onEdit, onDelete }) {
  return ( 
    <div className="relative bg-[#1a1412]/80 border border-[#3e2723] hover:border-amber-900/80 rounded-lg p-3 flex justify-between items-center transition-all group mb-2 shadow-md"> 
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"> 
        <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-colors">✏️</button> 
        <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-colors">🗑️</button> 
      </div> 
      <div className="flex gap-4 items-center pr-12"> 
        <div className="flex items-center justify-center min-w-[2.5rem] h-10 bg-black/60 border border-[#3e2723] rounded-md text-amber-600 font-bold text-sm shadow-inner">x{quantity}</div> 
        <div className="flex flex-col"> 
          <h4 className="text-zinc-200 font-bold text-sm tracking-wide group-hover:text-amber-100 transition-colors">{name}</h4> 
          <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{description}</span> 
        </div> 
      </div> 
      <div className="text-amber-700 font-bold text-xs whitespace-nowrap pl-2">{(weight * quantity).toFixed(1)} kg</div> 
    </div> 
  );
}