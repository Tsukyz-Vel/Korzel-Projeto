import { useState, useEffect } from 'react';
import mosasaurusSkull from './assets/mosasaurus-skull.png';
import d20Icon from './assets/d20-red.png';

// 1. Dicionário de Cores
const themeColors = {
  green: { border: "border-green-500/50", text: "text-green-400", bg: "bg-green-500", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]" },
  blue: { border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-500", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  red: { border: "border-red-500/50", text: "text-red-400", bg: "bg-red-500", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]" },
  yellow: { border: "border-yellow-500/50", text: "text-yellow-400", bg: "bg-yellow-500", shadow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]" },
  amber: { border: "border-amber-600/50", text: "text-amber-500", bg: "bg-amber-600", shadow: "shadow-[0_0_15px_rgba(217,119,6,0.15)]" },
  purple: { border: "border-purple-500/50", text: "text-purple-400", bg: "bg-purple-500", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
};

// 2. Molde dos Círculos (AGORA EDITÁVEIS!)
function AttributeCircle({ name, short, value, onChange, customClass, color = "red" }) {
  const theme = themeColors[color];
  return (
    <div className={`absolute flex flex-col items-center justify-between w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-full p-1 sm:p-2 bg-black/60 backdrop-blur-sm transition-all duration-300 ${theme.border} ${theme.shadow} ${customClass}`}>
      <div className="flex-1 flex items-center justify-center w-full">
        {/* Usamos classes especiais do Tailwind para esconder as setas nativas do input number */}
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-center bg-transparent focus:outline-none text-2xl sm:text-3xl font-bold drop-shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${theme.text}`} 
        />
      </div>
      <div className="w-full flex flex-col items-center pb-1 text-white pointer-events-none">
        <div className={`w-3/4 h-[1px] mb-1 opacity-70 ${theme.bg}`}></div>
        <span className="text-[6px] sm:text-[8px] tracking-widest uppercase font-light leading-none">{name}</span>
        <span className="text-xs sm:text-sm font-bold uppercase leading-none">{short}</span>
      </div>
    </div>
  );
}

// 3. Molde da Perícia
function SkillRow({ name, attrShort, color, trainingLevel, baseTotal }) {
  const theme = themeColors[color];
  const [outros, setOutros] = useState(0); 
  const total = baseTotal + Number(outros);

  const renderDiamonds = () => {
    return [1, 2, 3].map((level) => (
      <span key={level} className={`text-xs mx-[1px] ${trainingLevel >= level ? theme.text : "text-zinc-800"}`}>♦</span>
    ));
  };

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors px-2 group">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button className="transition-all flex items-center justify-center w-7 h-7 rounded hover:bg-red-950/40 shadow-inner cursor-pointer" title="Rolar Teste">
          <img src={d20Icon} alt="Rolar D20" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
        </button>
        <div className={`w-1 h-4 rounded-full opacity-70 ${theme.bg}`}></div>
        <div className="flex flex-col">
          <span className="text-sm text-zinc-200 tracking-wide group-hover:text-white transition-colors">{name}</span>
          <span className="text-[9px] text-zinc-500 uppercase">{attrShort}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="w-10 flex justify-center">
          <input type="number" value={outros} onChange={(e) => setOutros(e.target.value)} className="w-8 bg-black/40 border-b border-zinc-700 text-center text-amber-500 font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-t-sm" title="Bônus de Itens e Poderes" />
        </div>
        <div className="w-12 flex justify-center">{renderDiamonds()}</div>
        <div className="w-8 text-right text-lg font-bold text-white">
          {total >= 0 ? `+${total}` : total}
        </div>
      </div>
    </div>
  );
}

// 4. BARRAS DE STATUS
function StatusBar({ title, current, max, colorTheme, onDecrease, onIncrease, onMaxChange }) {
  const themes = {
    red: { bg: "bg-red-950/80", fill: "bg-red-800", text: "text-red-100", border: "border-red-900/50" },
    orange: { bg: "bg-amber-950/80", fill: "bg-amber-700", text: "text-amber-100", border: "border-amber-900/50" },
    green: { bg: "bg-green-950/80", fill: "bg-green-800", text: "text-green-100", border: "border-green-900/50" } 
  };
  const theme = themes[colorTheme];
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="w-full flex flex-col mb-4">
      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold text-center mb-1 drop-shadow-md">{title}</span>
      <div className={`relative w-full h-10 ${theme.bg} border-2 ${theme.border} rounded-sm overflow-hidden flex items-center justify-between px-1 shadow-inner`}>
        <div className={`absolute top-0 left-0 h-full ${theme.fill} transition-all duration-300 ease-out`} style={{ width: `${percentage}%` }}></div>
        <div className="relative z-10 flex gap-1">
          <button onClick={() => onDecrease(5)} className="px-2 py-1 text-[10px] font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">-5</button>
          <button onClick={() => onDecrease(1)} className="px-2 py-1 text-sm font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">-</button>
        </div>
        
        <div className={`relative z-10 flex items-baseline font-bold text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${theme.text}`}>
          <span>{current}</span>
          <span className="text-sm opacity-70 mx-1">/</span>
          <input 
            type="number" 
            value={max} 
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="bg-transparent w-10 text-sm opacity-70 focus:outline-none focus:border-b focus:border-white/50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            title={`Editar Máximo de ${title}`}
          />
        </div>

        <div className="relative z-10 flex gap-1">
          <button onClick={() => onIncrease(1)} className="px-2 py-1 text-sm font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+</button>
          <button onClick={() => onIncrease(5)} className="px-2 py-1 text-[10px] font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+5</button>
        </div>
      </div>
    </div>
  );
}

// 5. Card de Arma
function WeaponCard({ name, damage, critMargin, critMultiplier, type, skill, onEdit, onDelete }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 hover:border-red-900/50 rounded-lg p-3 flex justify-between items-center transition-all group mb-3 shadow-md">
      <div className="flex flex-col pr-12">
        <span className="text-white font-bold text-lg tracking-wide group-hover:text-red-100 transition-colors">{name}</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
          {skill} <span className="mx-1">•</span> {type}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-red-400 font-bold text-xl drop-shadow-md">{damage}</span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Crit {critMargin}/{critMultiplier}</span>
        </div>
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-6 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10 w-[max-content]">
            <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-transform hover:scale-110 text-sm" title="Editar">✏️</button>
            <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-transform hover:scale-110 text-sm" title="Excluir">🗑️</button>
          </div>
          <button className="h-10 w-10 flex items-center justify-center bg-red-950/40 border border-red-900/50 rounded-md hover:bg-red-900 transition-all shadow-inner relative z-0 group-hover:border-red-500">
            <img src={d20Icon} alt="Rolar Dano" className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all drop-shadow-md" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Card de Habilidade
function AbilityCard({ title, type, cost, description, onEdit, onDelete }) {
  return (
    <div className="relative bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 mb-4 shadow-md group hover:border-zinc-600 transition-all">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-colors" title="Editar">✏️</button>
        <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-colors" title="Excluir">🗑️</button>
      </div>
      <div className="flex justify-between items-start mb-3 pr-12">
        <div className="flex flex-col">
          <h4 className="text-white font-bold text-lg tracking-wide">{title}</h4>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{type}</span>
        </div>
        {cost && (
          <div className="bg-amber-950/40 border border-amber-900/50 text-amber-500 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-inner">
            {cost}
          </div>
        )}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{description}</p>
    </div>
  );
}

// 7. Molde do Card de Item
function ItemCard({ name, description, quantity, weight, onEdit, onDelete }) {
  return (
    <div className="relative bg-[#1a1412]/80 border border-[#3e2723] hover:border-amber-900/80 rounded-lg p-3 flex justify-between items-center transition-all group mb-2 shadow-md">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-colors" title="Editar">✏️</button>
        <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-colors" title="Excluir">🗑️</button>
      </div>
      <div className="flex gap-4 items-center pr-12">
        <div className="flex items-center justify-center min-w-[2.5rem] h-10 bg-black/60 border border-[#3e2723] rounded-md text-amber-600 font-bold text-sm shadow-inner">
          x{quantity}
        </div>
        <div className="flex flex-col">
          <h4 className="text-zinc-200 font-bold text-sm tracking-wide group-hover:text-amber-100 transition-colors">{name}</h4>
          <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{description}</span>
        </div>
      </div>
      <div className="text-amber-700 font-bold text-xs whitespace-nowrap pl-2">
        {(weight * quantity).toFixed(1)} kg
      </div>
    </div>
  );
}

// 8. Bloco de Defesa
function DefenseBlock({ agility }) {
  const agi = agility !== "-" && agility !== "" ? Number(agility) : 0;
  const [armorName, setArmorName] = useState("");
  const [armorBonus, setArmorBonus] = useState(0);
  const [armorPenalty, setArmorPenalty] = useState(0);
  const [maxAgi, setMaxAgi] = useState(99); 
  const [shieldName, setShieldName] = useState("");
  const [shieldBonus, setShieldBonus] = useState(0);
  const [others, setOthers] = useState(0);
  const [resistances, setResistances] = useState("");

  const effectiveAgi = Math.min(agi, Number(maxAgi));
  const totalDef = 10 + effectiveAgi + Number(armorBonus) + Number(shieldBonus) + Number(others);

  return (
    <div className="w-full flex flex-col bg-[#140c08] border-2 border-[#3e2723] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.8)] mt-6 relative z-50">
      <h3 className="text-amber-700 font-bold tracking-widest uppercase text-sm mb-4 border-b border-[#3e2723] pb-2">🛡️ Proteção & Equipamentos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="col-span-1 sm:col-span-3 flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-amber-900/30 shadow-inner">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Armadura Vestida</span>
          <input type="text" value={armorName} onChange={e => setArmorName(e.target.value)} placeholder="Ex: Loriga Segmentada" className="bg-transparent border-b border-[#3e2723] text-zinc-200 text-sm focus:outline-none focus:border-amber-700 pb-1 w-full" />
          <div className="flex gap-2 mt-3 justify-between px-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight">Bônus<br/>(+Def)</span>
              <input type="number" value={armorBonus} onChange={e => setArmorBonus(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-amber-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-amber-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight" title="Agilidade Máxima Permitida">Agi<br/>Máx.</span>
              <input type="number" value={maxAgi} onChange={e => setMaxAgi(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-yellow-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-yellow-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center leading-tight">Penal.<br/>(Testes)</span>
              <input type="number" value={armorPenalty} onChange={e => setArmorPenalty(e.target.value)} className="w-12 mt-1 text-center bg-transparent text-red-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-red-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-amber-900/30 shadow-inner">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Escudo Equipado</span>
          <input type="text" value={shieldName} onChange={e => setShieldName(e.target.value)} placeholder="Ex: Escudo Pipa" className="bg-transparent border-b border-[#3e2723] text-zinc-200 text-sm focus:outline-none focus:border-amber-700 pb-1 w-full" />
          <div className="flex justify-center mt-3">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest text-center">Bônus (+Def)</span>
              <input type="number" value={shieldBonus} onChange={e => setShieldBonus(e.target.value)} className="w-16 mt-1 text-center bg-transparent text-amber-500 font-bold text-xl focus:outline-none border-b border-transparent focus:border-amber-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-950 border border-[#3e2723] rounded-lg p-3 shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-900 to-[#140c08] border-2 border-amber-700 rounded-md rotate-3 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
            <span className="text-3xl font-bold text-amber-400 -rotate-3">{totalDef}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-widest uppercase text-base">Defesa Total</span>
            <div className="text-[10px] text-zinc-500 uppercase mt-1 flex items-center gap-1">
              <span>10 + Agi({effectiveAgi}) + Outros</span>
              <input type="number" value={others} onChange={e => setOthers(e.target.value)} className="w-10 bg-transparent text-amber-600 border-b border-zinc-700 focus:outline-none text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full sm:w-auto sm:border-l sm:border-[#3e2723] sm:pl-6 flex flex-col justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Resistências (RD / Elementos)</span>
          <input type="text" value={resistances} onChange={e => setResistances(e.target.value)} placeholder="Ex: Frio 5, RD 2..." className="w-full bg-transparent border-b border-[#3e2723] text-zinc-300 text-sm focus:outline-none focus:border-amber-700 pb-1" />
        </div>
      </div>
    </div>
  );
}

// 9. Tela Principal (App)
function App() {
  const [character, setCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState('perícias'); 
  
  // ================= ESTADOS DO CABEÇALHO =================
  const [charName, setCharName] = useState("Kael, o Quebra-Marés");
  const [charRace, setCharRace] = useState("Korgath");
  const [charClass, setCharClass] = useState("Guerreiro");
  const [charLevel, setCharLevel] = useState(1);

  // ================= ESTADOS DOS ATRIBUTOS (Agora editáveis e vinculados!) =================
  const [attrInt, setAttrInt] = useState(-2);
  const [attrPre, setAttrPre] = useState(0);
  const [attrAgi, setAttrAgi] = useState(0);
  const [attrVig, setAttrVig] = useState(3);
  const [attrFor, setAttrFor] = useState(4);
  const [attrIns, setAttrIns] = useState(1);

  // ================= ESTADOS DAS BARRAS =================
  const [hp, setHp] = useState(24);
  const [maxHp, setMaxHp] = useState(24);
  const [pe, setPe] = useState(6);
  const [maxPe, setMaxPe] = useState(6);
  const [corruption, setCorruption] = useState(0);
  const [maxCorruption, setMaxCorruption] = useState(40);

  // ================= ESTADOS DAS ABAS =================
  const [showWeaponForm, setShowWeaponForm] = useState(false);
  const [editingWeaponIndex, setEditingWeaponIndex] = useState(null);
  const initialWeaponState = { name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta (FOR)" };
  const [weaponForm, setWeaponForm] = useState(initialWeaponState);
  const [attacksList, setAttacksList] = useState([
    { name: "Tridente de Guerra", damage: "1d8+4", critMargin: "20", critMultiplier: "x2", type: "Perfurante", skill: "Luta (FOR)" },
    { name: "Arpão Pesado", damage: "1d10+2", critMargin: "19", critMultiplier: "x3", type: "Perfurante", skill: "Arremesso (FOR)" }
  ]);

  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const initialAbilityState = { title: "", type: "Poder de Classe", cost: "", description: "" };
  const [abilityForm, setAbilityForm] = useState(initialAbilityState);
  const [abilitiesList, setAbilitiesList] = useState([
    { title: "Ataque Especial", type: "Habilidade de Classe", cost: "1 PE", description: "Quando você faz um ataque, pode gastar 1 PE para receber +4 no teste de ataque ou +1 dado de dano (ex: 1d8 vira 2d8). A cada 4 níveis, pode gastar mais PE para aumentar o bônus." },
    { title: "Técnica de Combate", type: "Habilidade de Classe", cost: "Passivo", description: "Você não sofre penalidade de armadura em testes de Iniciativa e seu deslocamento não é reduzido por usar armaduras pesadas. (Guerreiros são treinados para viver dentro da armadura)." },
    { title: "🐢 Postura do Anquilossauro", type: "Poder de Guerreiro (Postura)", cost: "1 Ação de Movimento", description: "Requisito: Armas Pesadas/Duas Mãos.\nPassivo: Você planta os pés no chão. Recebe +3 no Dano e ignora 2 pontos de RD do alvo.\nAtivo (Esmagar): Ao rolar o dano, você pode gastar 2 PE; o alvo faz um teste de Fortitude. Se falhar, você quebra a perna do alvo e diminui seu deslocamento pela metade." }
  ]);

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [lascas, setLascas] = useState(150);
  const initialItemState = { name: "", description: "", quantity: 1, weight: 0.5 };
  const [itemForm, setItemForm] = useState(initialItemState);
  const [inventoryList, setInventoryList] = useState([
    { name: "Barraca de Acampamento", description: "Abrigo simples para descanso seguro em áreas corruptas.", quantity: 1, weight: 10 },
    { name: "Essência de Mana", description: "Frasco cristalino que recupera PE.", quantity: 4, weight: 0.5 },
    { name: "Corda de Cânhamo", description: "15 metros de corda resistente com um gancho na ponta.", quantity: 1, weight: 2 }
  ]);

  // CÁLCULO AUTOMÁTICO DE CARGA (Integração com a FORÇA!)
  const currentWeight = inventoryList.reduce((acc, item) => acc + (Number(item.weight) * Number(item.quantity)), 0);
  const maxWeight = (Number(attrFor) * 5) + 30; 

  const skillsList = [
    { name: "Acrobacia", attrShort: "agi", color: "blue", trainingLevel: 1, total: 2 },
    { name: "Adestramento", attrShort: "ins", color: "amber", trainingLevel: 0, total: 1 },
    { name: "Arremesso", attrShort: "for", color: "red", trainingLevel: 0, total: 4 },
    { name: "Atletismo", attrShort: "vig", color: "green", trainingLevel: 2, total: 7 },
    { name: "Constituição", attrShort: "vig", color: "green", trainingLevel: 1, total: 5 },
    { name: "Enganação", attrShort: "pre", color: "purple", trainingLevel: 0, total: 0 },
    { name: "Engenharia", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Erudição", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Furtividade", attrShort: "agi", color: "blue", trainingLevel: 1, total: 2 },
    { name: "Influência", attrShort: "pre", color: "purple", trainingLevel: 2, total: 4 },
    { name: "Intimidação", attrShort: "pre", color: "purple", trainingLevel: 1, total: 2 },
    { name: "Intuição", attrShort: "ins", color: "amber", trainingLevel: 1, total: 3 },
    { name: "Investigação", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Ladinagem", attrShort: "agi", color: "blue", trainingLevel: 0, total: 0 },
    { name: "Liderança", attrShort: "pre", color: "purple", trainingLevel: 0, total: 0 },
    { name: "Luta", attrShort: "for", color: "red", trainingLevel: 1, total: 6 },
    { name: "Medicina", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Misticismo", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Montaria/Pilotar", attrShort: "agi", color: "blue", trainingLevel: 0, total: 0 },
    { name: "Navegação", attrShort: "int", color: "yellow", trainingLevel: 1, total: 0 },
    { name: "Ofício", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Percepção", attrShort: "ins", color: "amber", trainingLevel: 2, total: 5 },
    { name: "Pontaria", attrShort: "agi", color: "blue", trainingLevel: 0, total: 0 },
    { name: "Rastrear", attrShort: "ins", color: "amber", trainingLevel: 1, total: 3 },
    { name: "Religião", attrShort: "int", color: "yellow", trainingLevel: 0, total: -2 },
    { name: "Sincronia", attrShort: "pre", color: "purple", trainingLevel: 0, total: 0 },
    { name: "Sobrevivência", attrShort: "ins", color: "amber", trainingLevel: 3, total: 7 },
    { name: "Vontade", attrShort: "pre", color: "purple", trainingLevel: 1, total: 2 }
  ];

  useEffect(() => {
    fetch('http://localhost:5104/api/characters/1') 
      .then(response => response.json())
      .then(data => {
        setCharacter(data);
        // Se a API retornar os dados, ela atualiza nossos states locais!
        if(data.intellect !== undefined) setAttrInt(data.intellect);
        if(data.presence !== undefined) setAttrPre(data.presence);
        if(data.agility !== undefined) setAttrAgi(data.agility);
        if(data.vigor !== undefined) setAttrVig(data.vigor);
        if(data.strength !== undefined) setAttrFor(data.strength);
        if(data.instinct !== undefined) setAttrIns(data.instinct);
        if(data.name) setCharName(data.name);
      })
      .catch(error => console.error("Erro ao buscar a ficha:", error));
  }, []);

  // Controladores de Formulários (Combate, Habilidades, Inventário)
  const handleOpenNewWeapon = () => { setWeaponForm(initialWeaponState); setEditingWeaponIndex(null); setShowWeaponForm(true); };
  const handleEditWeapon = (index) => { setWeaponForm(attacksList[index]); setEditingWeaponIndex(index); setShowWeaponForm(true); };
  const handleDeleteWeapon = (index) => { if(window.confirm("A Mácula consumiu esta arma! Deseja excluí-la?")) setAttacksList(attacksList.filter((_, i) => i !== index)); };
  const handleSaveWeapon = () => {
    if(!weaponForm.name || !weaponForm.damage) return alert("A arma precisa de Nome e Dano!");
    if (editingWeaponIndex !== null) { const updated = [...attacksList]; updated[editingWeaponIndex] = weaponForm; setAttacksList(updated); } 
    else { setAttacksList([...attacksList, weaponForm]); }
    setShowWeaponForm(false);
  };

  const handleOpenNewAbility = () => { setAbilityForm(initialAbilityState); setEditingAbilityIndex(null); setShowAbilityForm(true); };
  const handleEditAbility = (index) => { setAbilityForm(abilitiesList[index]); setEditingAbilityIndex(index); setShowAbilityForm(true); };
  const handleDeleteAbility = (index) => { if(window.confirm("Esquecer esta habilidade?")) setAbilitiesList(abilitiesList.filter((_, i) => i !== index)); };
  const handleSaveAbility = () => {
    if(!abilityForm.title || !abilityForm.description) return alert("A habilidade precisa de Nome e Descrição!");
    if (editingAbilityIndex !== null) { const updated = [...abilitiesList]; updated[editingAbilityIndex] = abilityForm; setAbilitiesList(updated); } 
    else { setAbilitiesList([...abilitiesList, abilityForm]); }
    setShowAbilityForm(false);
  };

  const handleOpenNewItem = () => { setItemForm(initialItemState); setEditingItemIndex(null); setShowItemForm(true); };
  const handleEditItem = (index) => { setItemForm(inventoryList[index]); setEditingItemIndex(index); setShowItemForm(true); };
  const handleDeleteItem = (index) => { if(window.confirm("Jogar este item fora?")) setInventoryList(inventoryList.filter((_, i) => i !== index)); };
  const handleSaveItem = () => {
    if(!itemForm.name) return alert("O item precisa de um nome!");
    if (editingItemIndex !== null) { const updated = [...inventoryList]; updated[editingItemIndex] = itemForm; setInventoryList(updated); } 
    else { setInventoryList([...inventoryList, itemForm]); }
    setShowItemForm(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row p-4 lg:p-8 gap-8 font-sans">
      
      <div className="w-full lg:w-[55%] flex flex-col gap-8">
        <div className="w-full flex flex-wrap gap-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex-1 min-w-[200px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Personagem</span>
            <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} className="w-full text-xl sm:text-2xl font-bold text-white bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-1/4 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Raça</span>
            <input type="text" value={charRace} onChange={(e) => setCharRace(e.target.value)} className="w-full text-lg text-zinc-300 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-1/4 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Classe</span>
            <input type="text" value={charClass} onChange={(e) => setCharClass(e.target.value)} className="w-full text-lg text-zinc-300 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-16 flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nível</span>
            <input type="number" value={charLevel} onChange={(e) => setCharLevel(e.target.value)} className="w-full text-lg text-center font-bold text-white bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>

        <div className="relative w-full flex items-center justify-center py-4">
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            <img src={mosasaurusSkull} alt="Crânio do Mosassauro" className="absolute inset-0 w-full h-full object-contain opacity-90" />
            <div className="absolute text-white text-xl sm:text-3xl tracking-widest uppercase z-10 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Atributos</div>
            <AttributeCircle name="Intelecto" short="INT" color="yellow" value={attrInt} onChange={setAttrInt} customClass="top-[22%] left-1/2 -translate-x-1/2" />
            <AttributeCircle name="Presença" short="PRE" color="purple" value={attrPre} onChange={setAttrPre} customClass="top-[35%] right-[25%]" />
            <AttributeCircle name="Agilidade" short="AGI" color="blue" value={attrAgi} onChange={setAttrAgi} customClass="bottom-[30%] right-[27%]" />
            <AttributeCircle name="Vigor" short="VIG" color="green" value={attrVig} onChange={setAttrVig} customClass="bottom-[17%] left-1/2 -translate-x-1/2" />
            <AttributeCircle name="Força" short="FOR" color="red" value={attrFor} onChange={setAttrFor} customClass="bottom-[30%] left-[27%]" />
            <AttributeCircle name="Instinto" short="INS" color="amber" value={attrIns} onChange={setAttrIns} customClass="top-[35%] left-[25%]" />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col mt-[-2rem] z-20">
          <StatusBar title="Vida" current={hp} max={maxHp} colorTheme="red" onDecrease={(val) => setHp(prev => Math.max(0, prev - val))} onIncrease={(val) => setHp(prev => Math.min(maxHp, prev + val))} onMaxChange={setMaxHp} />
          <StatusBar title="Esforço" current={pe} max={maxPe} colorTheme="orange" onDecrease={(val) => setPe(prev => Math.max(0, prev - val))} onIncrease={(val) => setPe(prev => Math.min(maxPe, prev + val))} onMaxChange={setMaxPe} />
          <StatusBar title="Corrupção" current={corruption} max={maxCorruption} colorTheme="green" onDecrease={(val) => setCorruption(prev => Math.max(0, prev - val))} onIncrease={(val) => setCorruption(prev => Math.min(maxCorruption, prev + val))} onMaxChange={setMaxCorruption} />
          <div className="w-full max-w-md mx-auto z-20">
            {/* O Bloco de defesa agora recebe a Agilidade editável diretamente! */}
            <DefenseBlock agility={attrAgi} />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex flex-col h-[60vh] lg:h-[85vh] bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 lg:p-6 shadow-2xl backdrop-blur-sm sticky top-8">
        <div className="flex gap-4 sm:gap-6 border-b-2 border-zinc-800 mb-4 px-2 overflow-x-auto custom-scrollbar">
          {['Perícias', 'Combate', 'Habilidades', 'Inventário'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab.toLowerCase()); setShowWeaponForm(false); setShowAbilityForm(false); setShowItemForm(false); }} className={`pb-2 text-xs sm:text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${ activeTab === tab.toLowerCase() ? 'text-white border-b-2 border-red-800' : 'text-zinc-500 hover:text-zinc-300' }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'perícias' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            <div className="flex justify-end items-end border-b border-zinc-800 pb-2 mb-2 px-2 pr-4">
              <div className="flex items-center text-[10px] text-zinc-400 uppercase tracking-wider font-bold gap-3 sm:gap-6">
                <div className="w-10 text-center text-amber-700/80" title="Bônus de Itens e Poderes">Outros</div>
                <div className="w-12 text-center">Treino</div>
                <div className="w-8 text-right">Total</div>
              </div>
            </div>
            {skillsList.map((skill, index) => (
              <SkillRow key={index} name={skill.name} attrShort={skill.attrShort} color={skill.color} trainingLevel={skill.trainingLevel} baseTotal={skill.total} />
            ))}
          </div>
        )}

        {activeTab === 'combate' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <input type="text" placeholder="Rolar dados avulsos (ex: 2d6+4)..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"/>
                <img src={d20Icon} alt="Dado" className="absolute right-3 top-2 w-5 h-5 opacity-50" />
              </div>
              {!showWeaponForm && (
                <button onClick={handleOpenNewWeapon} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Forjar Ataque</button>
              )}
            </div>

            {showWeaponForm && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-zinc-700 pb-2 mb-4">{editingWeaponIndex !== null ? "🔧 Reforjar Arma" : "⚒️ Registro de Arsenal"}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-4"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome da Arma</label><input type="text" value={weaponForm.name} onChange={(e) => setWeaponForm({...weaponForm, name: e.target.value})} placeholder="Ex: Machado de Ossos" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Dano Base</label><input type="text" value={weaponForm.damage} onChange={(e) => setWeaponForm({...weaponForm, damage: e.target.value})} placeholder="1d12" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Margem</label><input type="text" value={weaponForm.critMargin} onChange={(e) => setWeaponForm({...weaponForm, critMargin: e.target.value})} placeholder="19" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Multip.</label><input type="text" value={weaponForm.critMultiplier} onChange={(e) => setWeaponForm({...weaponForm, critMultiplier: e.target.value})} placeholder="x3" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={weaponForm.type} onChange={(e) => setWeaponForm({...weaponForm, type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Cortante</option><option>Perfurante</option><option>Impacto</option><option>Profano</option></select></div>
                  <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Perícia Base</label><select value={weaponForm.skill} onChange={(e) => setWeaponForm({...weaponForm, skill: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Luta (FOR)</option><option>Pontaria (AGI)</option><option>Arremesso (FOR)</option></select></div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowWeaponForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveWeapon} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingWeaponIndex !== null ? "Atualizar Arma" : "Salvar Arma"}</button></div>
              </div>
            )}
            <div className="flex flex-col"><h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Arsenal Equipado</h3>{attacksList.length === 0 ? (<p className="text-zinc-600 text-sm text-center py-8 italic border border-zinc-800 border-dashed rounded-lg">Você está desarmado.</p>) : (attacksList.map((atk, index) => (<WeaponCard key={index} name={atk.name} damage={atk.damage} critMargin={atk.critMargin} critMultiplier={atk.critMultiplier} type={atk.type} skill={atk.skill} onEdit={() => handleEditWeapon(index)} onDelete={() => handleDeleteWeapon(index)} />)))}</div>
          </div>
        )}

        {activeTab === 'habilidades' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
            <div className="flex justify-end mb-6">
              {!showAbilityForm && (
                <button onClick={handleOpenNewAbility} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Aprender Habilidade</button>
              )}
            </div>

            {showAbilityForm && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-zinc-700 pb-2 mb-4">{editingAbilityIndex !== null ? "🔧 Modificar Habilidade" : "🧬 Nova Habilidade / Mutação"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome da Habilidade</label><input type="text" value={abilityForm.title} onChange={(e) => setAbilityForm({...abilityForm, title: e.target.value})} placeholder="Ex: Durão, Membrana Nictitante..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={abilityForm.type} onChange={(e) => setAbilityForm({...abilityForm, type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Poder de Classe</option><option>Poder de Guerreiro (Postura)</option><option>Habilidade de Raça</option><option>Mutação da Corrupção</option></select></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Custo / Ativação</label><input type="text" value={abilityForm.cost} onChange={(e) => setAbilityForm({...abilityForm, cost: e.target.value})} placeholder="Ex: 2 PE, Passivo, Reação..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição e Efeitos</label><textarea rows="4" value={abilityForm.description} onChange={(e) => setAbilityForm({...abilityForm, description: e.target.value})} placeholder="Descreva o que a habilidade faz..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900 resize-none" /></div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowAbilityForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveAbility} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingAbilityIndex !== null ? "Atualizar Registro" : "Aprender"}</button></div>
              </div>
            )}
            <div className="flex flex-col">{abilitiesList.length === 0 ? (<p className="text-zinc-600 text-sm text-center py-8 italic border border-zinc-800 border-dashed rounded-lg">Nenhuma habilidade registrada.</p>) : (abilitiesList.map((ability, index) => (<AbilityCard key={index} title={ability.title} type={ability.type} cost={ability.cost} description={ability.description} onEdit={() => handleEditAbility(index)} onDelete={() => handleDeleteAbility(index)} />)))}</div>
          </div>
        )}

        {activeTab === 'inventário' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
            <div className="flex justify-between items-center bg-[#140c08]/80 border-2 border-[#3e2723] rounded-lg p-4 mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-700/80 uppercase font-bold tracking-widest mb-1">Bolsa de Lascas</span>
                <div className="flex items-center gap-2"><span className="text-2xl drop-shadow-md">🪙</span><input type="number" value={lascas} onChange={(e) => setLascas(Number(e.target.value))} className="bg-transparent text-2xl font-bold text-amber-500 outline-none w-24 border-b border-amber-900/50 focus:border-amber-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
              </div>
              {!showItemForm && (
                <button onClick={handleOpenNewItem} className="h-10 px-4 bg-[#3e2723] hover:bg-amber-900 text-amber-500 hover:text-white font-bold rounded-md border border-amber-900/50 transition-colors uppercase tracking-widest text-[10px] shadow-lg">+ Guardar Item</button>
              )}
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Carga Máxima</span>
                <div className="text-xl font-bold tracking-wider"><span className={currentWeight > maxWeight ? "text-red-500" : "text-white"}>{currentWeight.toFixed(1)}</span><span className="text-zinc-600 mx-1">/</span><span className="text-zinc-400">{maxWeight} kg</span></div>
              </div>
            </div>

            {showItemForm && (
              <div className="bg-[#1a1412] border border-[#3e2723] rounded-lg p-4 mb-6 animate-fade-in shadow-lg">
                <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm border-b border-[#3e2723] pb-2 mb-4">{editingItemIndex !== null ? "🔧 Alterar Item" : "🎒 Guardar Novo Item"}</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 sm:col-span-2"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Nome do Item</label><input type="text" value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} placeholder="Ex: Poção de Cura" className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Qtd.</label><input type="number" min="1" value={itemForm.quantity} onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})} className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Peso Un. (kg)</label><input type="number" step="0.1" min="0" value={itemForm.weight} onChange={(e) => setItemForm({...itemForm, weight: e.target.value})} className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-4"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Descrição</label><input type="text" value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} placeholder="Para que serve?" className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[#3e2723]"><button onClick={() => setShowItemForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors">Fechar Bolsa</button><button onClick={handleSaveItem} className="px-4 py-2 text-xs font-bold bg-amber-900/80 hover:bg-amber-700 text-amber-100 rounded uppercase tracking-widest transition-colors shadow-lg">{editingItemIndex !== null ? "Atualizar" : "Guardar"}</button></div>
              </div>
            )}
            <div className="flex flex-col">{inventoryList.length === 0 ? (<p className="text-zinc-600 text-sm text-center py-8 italic border border-[#3e2723] border-dashed rounded-lg">Sua bolsa está vazia.</p>) : (inventoryList.map((item, index) => (<ItemCard key={index} name={item.name} description={item.description} quantity={item.quantity} weight={item.weight} onEdit={() => handleEditItem(index)} onDelete={() => handleDeleteItem(index)} />)))}</div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;