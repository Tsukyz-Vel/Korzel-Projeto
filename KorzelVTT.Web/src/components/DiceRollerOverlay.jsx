import d20Icon from '../assets/d20-red.png';

export default function DiceRollerOverlay({ isRolling, result, onDismiss }) {
  if (!isRolling && !result) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center animate-in zoom-in duration-300">
        {isRolling ? (
          <div className="w-32 h-32 flex items-center justify-center animate-[spin_0.5s_linear_infinite]">
            <img src={d20Icon} alt="Rolling..." className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
          </div>
        ) : (
          <div className="w-40 h-40 flex flex-col items-center justify-center relative animate-[bounce_0.5s_ease-out]">
            <img src={d20Icon} alt="Result" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(239,68,68,1)] opacity-50" />
            <span className="absolute text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] z-10">
              {result?.total}
            </span>
          </div>
        )}

        {!isRolling && result && (
          <div className="mt-6 bg-zinc-900/90 border-2 border-red-900/50 rounded-lg p-4 max-w-sm text-center shadow-2xl">
            <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-1">{result.title}</h3>
            <p className="text-zinc-300 text-sm whitespace-pre-wrap">{result.detail}</p>
            <button onClick={onDismiss} className="mt-4 bg-red-900/40 hover:bg-red-800 text-red-100 px-6 py-2 rounded uppercase text-xs font-bold tracking-widest transition-colors w-full">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}