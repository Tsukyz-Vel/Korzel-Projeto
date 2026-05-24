import d20Icon from '../assets/d20-red.png';

export default function DiceRollerOverlay({ isRolling, result, onDismiss }) {
  if (!isRolling && !result) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center animate-in zoom-in duration-300">
        
        {isRolling ? (
          <div className="w-32 h-32 flex items-center justify-center animate-[spin_0.5s_linear_infinite]">
            <img src={d20Icon} alt="Rolling..." className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
          </div>
        ) : (
          <div className="flex gap-6 sm:gap-12 animate-[bounce_0.5s_ease-out]">
            {/* DADO 1: ATAQUE */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center relative">
              <img src={d20Icon} alt="Result" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(239,68,68,1)] opacity-50" />
              <span className="absolute text-5xl sm:text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] z-10">
                {result?.isCombined ? result.attackTotal : result?.total}
              </span>
              {result?.isCombined && (
                <span className="absolute -bottom-8 text-red-500 font-bold tracking-widest uppercase text-xs sm:text-sm bg-black/50 px-3 py-1 rounded border border-red-900/50">
                  Ataque
                </span>
              )}
            </div>

            {/* DADO 2: DANO (APARECE SÓ SE FOR ATAQUE COM ARMA) */}
            {result?.isCombined && (
              <div className="w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center relative">
                <img src={d20Icon} alt="Damage Result" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(245,158,11,1)] opacity-40 hue-rotate-[50deg]" />
                <span className="absolute text-5xl sm:text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] z-10">
                  {result.damageTotal}
                </span>
                <span className="absolute -bottom-8 text-amber-500 font-bold tracking-widest uppercase text-xs sm:text-sm bg-black/50 px-3 py-1 rounded border border-amber-900/50">
                  Dano
                </span>
              </div>
            )}
          </div>
        )}

        {!isRolling && result && (
          <div className="mt-14 bg-zinc-900/90 border-2 border-red-900/50 rounded-lg p-4 max-w-md w-[90vw] text-center shadow-2xl">
            <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2">{result.title}</h3>
            <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{result.detail}</p>
            <button onClick={onDismiss} className="mt-4 bg-red-900/40 hover:bg-red-800 text-red-100 px-6 py-2 rounded uppercase text-xs font-bold tracking-widest transition-colors w-full">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}