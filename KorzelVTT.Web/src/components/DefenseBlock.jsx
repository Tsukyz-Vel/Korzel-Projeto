import { useState } from 'react';

export default function DefenseBlock({ agility }) {
  const agi = agility !== "-" && agility !== "" ? Number(agility) : 0;
  const [armorName, setArmorName] = useState(""); const [armorBonus, setArmorBonus] = useState(0); const [armorPenalty, setArmorPenalty] = useState(0); const [maxAgi, setMaxAgi] = useState(99); const [shieldName, setShieldName] = useState(""); const [shieldBonus, setShieldBonus] = useState(0); const [others, setOthers] = useState(0); const [resistances, setResistances] = useState("");
  const effectiveAgi = Math.min(agi, Number(maxAgi));
  const totalDef = 10 + effectiveAgi + Number(armorBonus) + Number(shieldBonus) + Number(others);

  return (
    <div className="w-full flex flex-col bg-[#140c08] border-2 border-[#3e2723] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.8)] mt-6 relative z-50">
      <h3 className="text-amber-700 font-bold tracking-widest uppercase text-sm mb-4 border-b border-[#3e2723] pb-2">🛡️ Proteção & Equipamentos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="col-span-1 sm:col-span-3 flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-amber-900/30 shadow-inner">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Armadura Vestida</span><input type="text" value={armorName} onChange={e => setArmorName(e.target.value)} placeholder="Ex: Loriga Segmentada" className="bg-transparent border-b border-[#3e2723] text-zinc-200 text-sm focus:outline-none focus:border-amber-700 pb-1 w-full" />
          <div className="flex gap-2 mt-3 justify-between px-2">
            <div className="flex flex-col items-center"><span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight">Bônus<br/>(+Def)</span><input type="number" value={armorBonus} onChange={e => setArmorBonus(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-amber-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-amber-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
            <div className="flex flex-col items-center"><span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight" title="Agilidade Máxima Permitida">Agi<br/>Máx.</span><input type="number" value={maxAgi} onChange={e => setMaxAgi(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-yellow-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-yellow-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
            <div className="flex flex-col items-center"><span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight">Penal.<br/>(Testes)</span><input type="number" value={armorPenalty} onChange={e => setArmorPenalty(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-red-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-red-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-amber-900/30 shadow-inner">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Escudo Equipado</span><input type="text" value={shieldName} onChange={e => setShieldName(e.target.value)} placeholder="Ex: Escudo Pipa" className="bg-transparent border-b border-[#3e2723] text-zinc-200 text-sm focus:outline-none focus:border-amber-700 pb-1 w-full" />
          <div className="flex justify-center mt-3"><div className="flex flex-col items-center"><span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center">Bônus (+Def)</span><input type="number" value={shieldBonus} onChange={e => setShieldBonus(e.target.value)} className="w-16 mt-1 text-center bg-transparent text-amber-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-amber-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-950 border border-[#3e2723] rounded-lg p-3 shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-900 to-[#140c08] border-2 border-amber-700 rounded-md rotate-3 shadow-[0_0_15px_rgba(217,119,6,0.3)]"><span className="text-3xl font-bold text-amber-400 -rotate-3">{totalDef}</span></div>
          <div className="flex flex-col"><span className="text-white font-bold tracking-widest uppercase text-base">Defesa Total</span><div className="text-[10px] text-zinc-500 uppercase mt-1 flex items-center gap-1"><span>10 + Agi({effectiveAgi}) + Outros</span><input type="number" value={others} onChange={e => setOthers(e.target.value)} className="w-10 bg-transparent text-amber-600 border-b border-zinc-700 focus:outline-none text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div></div>
        </div>
        <div className="flex-1 w-full sm:w-auto sm:border-l sm:border-[#3e2723] sm:pl-6 flex flex-col justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Resistências (RD / Elementos)</span><input type="text" value={resistances} onChange={e => setResistances(e.target.value)} placeholder="Ex: Frio 5, RD 2..." className="w-full bg-transparent border-b border-[#3e2723] text-zinc-300 text-sm focus:outline-none focus:border-amber-700 pb-1" />
        </div>
      </div>
    </div>
  );
}