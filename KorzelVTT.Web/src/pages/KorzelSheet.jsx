import { useState, useEffect } from 'react';

// Importando os dados e lógica
import { panteaoKorzel, initialLojaCatalog } from '../data/korzelData';
import { parseAndRollDamage } from '../utils/diceUtils';

// Importando os componentes visuais
import AttributeCircle from '../components/AttributeCircle';
import SkillRow from '../components/SkillRow';
import StatusBar from '../components/StatusBar';
import WeaponCard from '../components/WeaponCard';
import AbilityCard from '../components/AbilityCard';
import DefenseBlock from '../components/DefenseBlock';
import DiceRollerOverlay from '../components/DiceRollerOverlay';

export default function KorzelSheet() {
  // Estados Básicos
  const [characterName, setCharacterName] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState(1);
  const [deity, setDeity] = useState("Nenhum");

  // Estados de Status e Atributos
  const [attributes, setAttributes] = useState({ for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 });
  const [hp, setHp] = useState(20);
  const [maxHp, setMaxHp] = useState(20);
  const [mp, setMp] = useState(10);
  const [maxMp, setMaxMp] = useState(10);
  const [sanity, setSanity] = useState(50);
  const [maxSanity, setMaxSanity] = useState(50);

  // Estados das Abas
  const [activeTab, setActiveTab] = useState("skills");
  const [weapons, setWeapons] = useState([{ id: 1, name: "Espada Longa", skill: "Luta", type: "Corte", damage: "1d8", critMargin: 19, critMultiplier: 2 }]);
  const [abilities, setAbilities] = useState([]);
  const [inventory, setInventory] = useState(initialLojaCatalog.slice(0, 3));
  
  // Estado do Dado
  const [rollState, setRollState] = useState({ isRolling: false, result: null });

  // Funções de Rolagem
  const handleRoll = (name, bonus) => {
    setRollState({ isRolling: true, result: null });
    setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      setRollState({ isRolling: false, result: { title: `Rolou ${name}`, total: d20 + Number(bonus), detail: `d20(${d20}) + ${bonus}` } });
    }, 600);
  };

  const handleRollAttack = (weapon, skillBonus) => {
    setRollState({ isRolling: true, result: null });
    setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const isCrit = d20 >= weapon.critMargin;
      const damageResult = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier.toString());
      setRollState({ isRolling: false, result: { title: `Ataque: ${weapon.name}`, total: damageResult.total, detail: `Dano: ${damageResult.log}` } });
    }, 600);
  };

  // Efeito dos Deuses
  useEffect(() => {
    if (deity !== "Nenhum" && panteaoKorzel[deity]) {
      const divineAbilities = panteaoKorzel[deity].poderes.map((p, index) => ({ id: `divine-${index}`, title: p.title, type: "Dádiva Divina", cost: p.cost, description: p.desc }));
      setAbilities(prev => [...prev.filter(a => a.type !== "Dádiva Divina"), ...divineAbilities]);
    } else {
      setAbilities(prev => prev.filter(a => a.type !== "Dádiva Divina"));
    }
  }, [deity]);

  return (
    <div className="w-full h-full bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300 font-sans">
      
      {/* Overlay do Dado Exclusivo da Ficha */}
      <DiceRollerOverlay isRolling={rollState.isRolling} result={rollState.result} onDismiss={() => setRollState({ isRolling: false, result: null })} />

      {/* Cabeçalho da Ficha */}
      <div className="bg-zinc-950 p-6 border-b border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Nome do Personagem</label>
            <input type="text" value={characterName} onChange={e => setCharacterName(e.target.value)} className="bg-transparent border-b border-zinc-700 text-white text-2xl font-bold focus:outline-none focus:border-red-500 pb-1" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Classe & Nível</label>
            <div className="flex gap-2">
              <input type="text" value={characterClass} onChange={e => setCharacterClass(e.target.value)} className="bg-transparent border-b border-zinc-700 text-white text-lg focus:outline-none focus:border-red-500 pb-1 w-full" />
              <input type="number" value={level} onChange={e => setLevel(Number(e.target.value))} className="bg-black/50 border border-zinc-700 text-white text-center text-lg w-16 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Devoção</label>
            <select value={deity} onChange={e => setDeity(e.target.value)} className="bg-zinc-900 border-b border-zinc-700 text-amber-500 font-bold p-2 rounded">
              {Object.keys(panteaoKorzel).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Corpo da Ficha */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
        <div className="w-full lg:w-1/3 bg-zinc-900/40 p-6 border-r border-zinc-800">
          <StatusBar title="Pontos de Vida (PV)" current={hp} max={maxHp} colorTheme="red" onDecrease={(v) => setHp(Math.max(0, hp - v))} onIncrease={(v) => setHp(Math.min(maxHp, hp + v))} onMaxChange={setMaxHp} />
          <StatusBar title="Pontos de Esforço (PE)" current={mp} max={maxMp} colorTheme="green" onDecrease={(v) => setMp(Math.max(0, mp - v))} onIncrease={(v) => setMp(Math.min(maxMp, mp + v))} onMaxChange={setMaxMp} />
          <StatusBar title="Sanidade / Estresse" current={sanity} max={maxSanity} colorTheme="orange" onDecrease={(v) => setSanity(Math.max(0, sanity - v))} onIncrease={(v) => setSanity(Math.min(maxSanity, sanity + v))} onMaxChange={setMaxSanity} />

          <div className="grid grid-cols-2 gap-x-4 gap-y-24 justify-items-center mt-10 mb-10 pb-6">
            <div className="relative w-24 h-24"><AttributeCircle name="Força" short="FOR" value={attributes.for} onChange={(v) => setAttributes({...attributes, for: Number(v)})} color="red" onRoll={handleRoll} customClass="top-0" /></div>
            <div className="relative w-24 h-24"><AttributeCircle name="Destreza" short="DES" value={attributes.des} onChange={(v) => setAttributes({...attributes, des: Number(v)})} color="green" onRoll={handleRoll} customClass="top-0" /></div>
            <div className="relative w-24 h-24"><AttributeCircle name="Constituição" short="CON" value={attributes.con} onChange={(v) => setAttributes({...attributes, con: Number(v)})} color="amber" onRoll={handleRoll} customClass="top-0" /></div>
            <div className="relative w-24 h-24"><AttributeCircle name="Inteligência" short="INT" value={attributes.int} onChange={(v) => setAttributes({...attributes, int: Number(v)})} color="blue" onRoll={handleRoll} customClass="top-0" /></div>
            <div className="relative w-24 h-24"><AttributeCircle name="Sabedoria" short="SAB" value={attributes.sab} onChange={(v) => setAttributes({...attributes, sab: Number(v)})} color="purple" onRoll={handleRoll} customClass="top-0" /></div>
            <div className="relative w-24 h-24"><AttributeCircle name="Carisma" short="CAR" value={attributes.car} onChange={(v) => setAttributes({...attributes, car: Number(v)})} color="yellow" onRoll={handleRoll} customClass="top-0" /></div>
          </div>
          <DefenseBlock agility={attributes.des} />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col bg-black/20">
          <div className="flex border-b border-zinc-800 bg-zinc-950 overflow-x-auto">
            <button onClick={() => setActiveTab("skills")} className={`flex-1 py-4 text-sm font-bold uppercase ${activeTab === "skills" ? "text-red-500 border-b-2 border-red-500 bg-red-950/10" : "text-zinc-500"}`}>Perícias</button>
            <button onClick={() => setActiveTab("combat")} className={`flex-1 py-4 text-sm font-bold uppercase ${activeTab === "combat" ? "text-red-500 border-b-2 border-red-500 bg-red-950/10" : "text-zinc-500"}`}>Combate</button>
            <button onClick={() => setActiveTab("abilities")} className={`flex-1 py-4 text-sm font-bold uppercase ${activeTab === "abilities" ? "text-red-500 border-b-2 border-red-500 bg-red-950/10" : "text-zinc-500"}`}>Habilidades</button>
            <button onClick={() => setActiveTab("inventory")} className={`flex-1 py-4 text-sm font-bold uppercase ${activeTab === "inventory" ? "text-red-500 border-b-2 border-red-500 bg-red-950/10" : "text-zinc-500"}`}>Inventário</button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "skills" && (
              <div className="space-y-2">
                <SkillRow name="Acrobacia" attrShort="DES" color="green" trainingLevel={1} baseTotal={attributes.des + 2} onRoll={handleRoll} />
                <SkillRow name="Atletismo" attrShort="FOR" color="red" trainingLevel={2} baseTotal={attributes.for + 5} onRoll={handleRoll} />
                <SkillRow name="Luta" attrShort="FOR" color="red" trainingLevel={3} baseTotal={attributes.for + 10} onRoll={handleRoll} />
                <SkillRow name="Percepção" attrShort="SAB" color="purple" trainingLevel={1} baseTotal={attributes.sab + 2} onRoll={handleRoll} />
              </div>
            )}

            {activeTab === "combat" && (
              <div>
                {weapons.map(w => (
                  <WeaponCard key={w.id} weapon={w} skillTotal={attributes.for + 5} onEdit={() => {}} onDelete={() => {}} onRollAttack={handleRollAttack} />
                ))}
              </div>
            )}

            {activeTab === "abilities" && (
              <div>
                {abilities.map(a => (
                  <AbilityCard key={a.id} title={a.title} type={a.type} cost={a.cost} description={a.description} onEdit={() => {}} onDelete={() => {}} />
                ))}
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 gap-3">
                {inventory.map((item, idx) => (
                  <div key={idx} className="bg-zinc-900/30 border border-zinc-800 rounded p-3 flex justify-between">
                    <div className="flex flex-col"><span className="text-white font-bold">{item.name}</span><span className="text-[10px] text-zinc-500">{item.type}</span></div>
                    <span className="text-xs text-zinc-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}