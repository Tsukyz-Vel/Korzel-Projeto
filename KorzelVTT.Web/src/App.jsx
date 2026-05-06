import { useState, useEffect } from 'react';
import mosasaurusSkull from './assets/mosasaurus-skull.png';
import d20Icon from './assets/d20-red.png';

// 1. Dicionários e Bases de Dados
const themeColors = {
  green: { border: "border-green-500/50", text: "text-green-400", bg: "bg-green-500", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]" },
  blue: { border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-500", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  red: { border: "border-red-500/50", text: "text-red-400", bg: "bg-red-500", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]" },
  yellow: { border: "border-yellow-500/50", text: "text-yellow-400", bg: "bg-yellow-500", shadow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]" },
  amber: { border: "border-amber-600/50", text: "text-amber-500", bg: "bg-amber-600", shadow: "shadow-[0_0_15px_rgba(217,119,6,0.15)]" },
  purple: { border: "border-purple-500/50", text: "text-purple-400", bg: "bg-purple-500", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
};

const panteaoKorzel = {
  "Nenhum": { mascara: "Ateu ou Indiferente.", verdade: "O vazio existencial e a negação do Plano Antigo.", obrigacao: "Sem deuses, sem mestres.", punicao: "Nenhuma punição.", poderes: [] },
  "Krognar, O Quebra-Ossos": { mascara: "Deus da Força e da Guerra...", verdade: "A Carne Viva...", obrigacao: "A dor é o único mestre...", punicao: "A biologia do seu corpo entra em colapso...", poderes: [{ title: "Carapaça Reativa", cost: "3 PV", desc: "Você recebe +1 na Defesa e RD 2 permanente..." }, { title: "Fúria Mutante", cost: "2 PV", desc: "Seus braços hipertrofiam e estalam por uma rodada..." }, { title: "Ossos Inquebráveis", cost: "1x / dia", desc: "Quando você sofrer dano letal..." }, { title: "Odor de Predador", cost: "1 PV", desc: "Você exala feromônios espessos..." }] },
  "Slyph, A Sra. dos Sussurros": { mascara: "Deusa do Conhecimento...", verdade: "O Caos cognitivo...", obrigacao: "A previsibilidade é um insulto...", punicao: "A entidade despeja o universo na sua mente...", poderes: [{ title: "Mente Labiríntica", cost: "Passivo", desc: "Resistência a Dano Psíquico 5..." }, { title: "Sussurros da Sorte", cost: "2 PV", desc: "Uma vez por combate, rola o teste novamente..." }, { title: "Alucinação Projetada", cost: "4 PV", desc: "Injeta caos na mente de um alvo..." }, { title: "Olhar do Oculto", cost: "1 PV", desc: "Você enxerga no escuro mágico..." }] },
  "Mekhan, O Grande Arquiteto": { mascara: "Deus da Ordem...", verdade: "A Estase...", obrigacao: "O caos tático deve ser erradicado...", punicao: "Suas juntas enrijecem como metal...", poderes: [{ title: "Estrutura Imóvel", cost: "Passivo", desc: "Imune a empurrões..." }, { title: "Geometria Perfeita", cost: "2 PV", desc: "Seu ataque ignora Cobertura e RD..." }, { title: "Prisão de Cristal", cost: "6 PV", desc: "Conjura uma jaula de luz dura..." }, { title: "Marcha Inexorável", cost: "Passivo", desc: "Ignora lentidão e terreno difícil..." }] },
  "Arak-Nul, A Mãe da Caçada": { mascara: "Deusa da Natureza...", verdade: "O Enxame...", obrigacao: "O consumo é absoluto...", punicao: "Fome sobrenatural drena sua vitalidade...", poderes: [{ title: "Ciclo de Sangue", cost: "Passivo", desc: "Drena vitalidade de inimigos mortos..." }, { title: "Vínculo de Matilha", cost: "3 PV", desc: "Tosse sanguessugas espirituais..." }, { title: "Sangue Ácido", cost: "1 PV (Reação)", desc: "Seu sangue espirra causando dano ácido..." }, { title: "Faro do Alfa", cost: "Passivo", desc: "Rastreia marcas de sangue a 3km..." }] },
  "Zilaris, O Mercador de Almas": { mascara: "Deus da Riqueza...", verdade: "O Vazio...", obrigacao: "A ganância é a armadura...", punicao: "Consumíveis apodrecem...", poderes: [{ title: "Aposta do Vazio", cost: "50 Lc + 1 PV", desc: "Rola com Vantagem e recupera PEs..." }, { title: "Contrato de Sangue", cost: "4 PV", desc: "Metade do dano inimigo reverte em cura..." }, { title: "Escudo Cobiçoso", cost: "2 PV (Reação)", desc: "Ganha +5 de Defesa contra o golpe..." }, { title: "Suborno Existencial", cost: "100 Lc", desc: "Conjura Magia de Nível 1..." }] },
  "Pyroth, O Sol Purificador": { mascara: "Deus do Sol e do Fogo...", verdade: "A Calcinação...", obrigacao: "Não pode saquear cadáveres não queimados...", punicao: "Pele resseca e quebra...", poderes: [{ title: "Aura da Fornalha", cost: "Passivo", desc: "Dano de fogo contínuo adjacente..." }, { title: "Marca da Cinza", cost: "1 PV", desc: "Alvo ganha Vulnerabilidade física..." }, { title: "Clarão Solar", cost: "3 PV (Reação)", desc: "Cega o inimigo durante o ataque..." }, { title: "Cauterizar a Alma", cost: "2 PV", desc: "Aniquila venenos e doenças..." }] },
  "Thalass, O Pai das Marés": { mascara: "Deus dos Oceanos...", verdade: "O Abismo...", obrigacao: "A terra é uma ilusão...", punicao: "Sofre asfixia e Exaustão longe d'água...", poderes: [{ title: "Arrastar para o Fundo", cost: "Passivo", desc: "Ataques jogam alvos no chão..." }, { title: "Sangue Gélido", cost: "3 PV", desc: "RD 3 físico e reduz deslocamento inimigo..." }, { title: "Vórtice Sombrio", cost: "4 PV", desc: "Redemoinho causa dano e puxa alvos..." }, { title: "Pressão Esmagadora", cost: "Passivo", desc: "Dano extra contra alvos submersos/caídos..." }] },
  "Volyra, A Tecelã de Laços": { mascara: "Deusa da Família...", verdade: "A Colmeia...", obrigacao: "A singularidade é praga...", punicao: "Isolamento sensorial, fica surdo e imune a buffs...", poderes: [{ title: "Mente Compartilhada", cost: "Passivo", desc: "Não pode ser flanqueado perto de aliados..." }, { title: "Elo de Dor", cost: "1 PV (Reação)", desc: "Absorve dano pelo aliado..." }, { title: "Enxame Curativo", cost: "3 PV", desc: "Cura todos os aliados próximos..." }, { title: "Titereiro da Colmeia", cost: "4 PV", desc: "Cede Ações para aliados..." }] },
  "Aeon, O Guardião das Areias": { mascara: "Deus do Destino...", verdade: "O Ciclo...", obrigacao: "A mudança não existe...", punicao: "Eco Traumático repete ações passadas...", poderes: [{ title: "Déjà Vu", cost: "Reação (1 PV)", desc: "Obriga alvo a refazer rolagem..." }, { title: "Passo Fora do Tempo", cost: "2 PV", desc: "Teletransporte ignorando armadilhas..." }, { title: "Erosão Rápida", cost: "3 PV", desc: "Destrói armas ou escudos permanentemente..." }, { title: "Atraso Existencial", cost: "5 PV", desc: "Alvo perde Reação e age por último..." }] },
  "Varish, O Senhor das Estações": { mascara: "Deus do Clima...", verdade: "O Cataclisma...", obrigacao: "A constância é pecado...", punicao: "Rejeição térmica e dano contínuo...", poderes: [{ title: "Carga Estática", cost: "Passivo", desc: "Movimento gera Dano Elétrico bônus..." }, { title: "Adaptação Letal", cost: "2 PV", desc: "Ataques ganham dano elemental extra..." }, { title: "Olho do Furacão", cost: "4 PV (Reação)", desc: "Destrói projéteis mágicos ou físicos..." }, { title: "Fissuras Termais", cost: "8 PV", desc: "Fende o chão com Fogo e Gelo..." }] }
};

const mutacoesKorzel = {
  "Carne Intacta": { efeito: "Sua biologia original se mantém intacta.", onus: "" },
  "Membrana Nictitante": { efeito: "Pálpebras translúcidas. Imune à cegueira por luz.", onus: "Sofre -2 em todos os testes de Carisma." },
  "Osteodermas": { efeito: "Placas ósseas espessas. +1 na Defesa e RD 1.", onus: "Rigidez reduz seu Deslocamento em -2m." },
  "Língua Bifurcada": { efeito: "Língua reptiliana. Olfato Aguçado.", onus: "Fala sibilante impõe -2 em Enganação e Diplomacia." },
  "Sangue Peçonhento": { efeito: "Icor negra. Cortes de perto causam Veneno no agressor.", onus: "Kits Médicos curam apenas a metade em você." },
  "Garras de Raptor": { efeito: "Unhas curvas. O Ataque Desarmado causa 1d6.", onus: "Desvantagem para manuseio fino e Ladinagem." },
  "Fossetas Loreais": { efeito: "Sensores térmicos. Enxerga calor.", onus: "Vulnerabilidade (Dano Dobrado) contra Fogo." },
  "Vela Dorsal": { efeito: "Crista nas costas. Resistência a Frio 5.", onus: "Não pode vestir armaduras nas costas." },
  "Braço Vestigial": { efeito: "Membro atrofiado. Saca itens como Ação Livre.", onus: "Desvantagem em interações na cidade." },
  "Pernas de Terópode": { efeito: "Articulações de ave. +3m Deslocamento.", onus: "-4 de penalidade em testes contra Agarrões." },
  "Camuflagem Cromática": { efeito: "Pele reativa. +5 em Furtividade parado.", onus: "Impossível mentir (pele brilha revelando emoções)." },
  "Mandíbula Desarticulável": { efeito: "Mordida (1d8+For) causando Sangramento.", onus: "Cidades fechadas te atacarão ao ver o rosto." }
};

// ================= CATÁLOGO DA LOJA INICIAL =================
const initialLojaCatalog = [
  { name: "Emplastro de Ervas", type: "Consumível", price: 10, weight: 0.1, desc: "Cura 1d4 PV e estanca sangramentos." },
  { name: "Tônico Morvani", type: "Consumível", price: 50, weight: 0.2, desc: "Cura 2d8+2 PV. Causa enjoo por 1 rodada." },
  { name: "Antídoto da Mata", type: "Consumível", price: 30, weight: 0.1, desc: "Soro concentrado contra venenos mundanos." },
  { name: "Kit de Aventureiro", type: "Equipamento", price: 50, weight: 5.0, desc: "Mochila, corda, pederneira, cantil e saco de dormir." },
  { name: "Ração Básica", type: "Consumível", price: 10, weight: 0.5, desc: "Suficiente para 1 semana sem estragar." },
  { name: "Tocha de Musgo", type: "Equipamento", price: 5, weight: 0.2, desc: "Queima com luz fria e esverdeada por 1 hora." },
  { name: "Filtro de Ar", type: "Equipamento", price: 40, weight: 0.3, desc: "+5 Fortitude contra gases e miasmas de pântano." },
  { name: "Adaga Oculta", type: "Arma", price: 25, weight: 0.5, desc: "Dano: 1d4 (Corte). Furtiva e fácil de esconder." },
  { name: "Bomba de Fumaça", type: "Alquimia", price: 40, weight: 0.5, desc: "Cria nuvem em raio de 6m. Camuflagem total." },
];

const parseAndRollDamage = (damageStr, isCrit, multiplierStr) => {
  let cleanStr = damageStr.toLowerCase().replace(/\s+/g, '');
  let total = 0; let logs = []; let mult = 1;
  if (isCrit) mult = parseInt(multiplierStr.replace(/[^0-9]/g, '')) || 2;
  let parts = cleanStr.match(/[+-]?[^+-]+/g) || [cleanStr];
  
  parts.forEach(part => {
    let sign = part.startsWith('-') ? -1 : 1;
    let term = part.replace(/[+-]/, '');
    if (term.includes('d')) {
      let [countStr, facesStr] = term.split('d');
      let count = (parseInt(countStr) || 1) * mult;
      let faces = parseInt(facesStr) || 20;
      let subTotal = 0; let rolls = [];
      for(let i=0; i<count; i++) { let r = Math.floor(Math.random() * faces) + 1; subTotal += r; rolls.push(r); }
      total += sign * subTotal; logs.push(`${sign === -1 ? '-' : '+'}[${rolls.join(', ')}]`);
    } else {
      let val = parseInt(term) || 0; total += sign * val; logs.push(`${sign === -1 ? '-' : '+'}${val}`);
    }
  });
  return { total, log: logs.join(' ').replace(/^\+/, '') };
};

// ================= COMPONENTES GENÉRICOS =================
function AttributeCircle({ name, short, value, onChange, customClass, color = "red", onRoll }) {
  const theme = themeColors[color];
  return (
    <div className={`absolute flex flex-col items-center justify-between w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-full p-1 sm:p-2 bg-black/60 backdrop-blur-sm transition-all duration-300 ${theme.border} ${theme.shadow} ${customClass}`}>
      <div className="flex-1 flex items-center justify-center w-full">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-center bg-transparent focus:outline-none text-2xl sm:text-3xl font-bold drop-shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${theme.text}`} />
      </div>
      <div className="w-full flex flex-col items-center pb-1 text-white">
        <div className={`w-3/4 h-[1px] mb-1 opacity-70 ${theme.bg}`}></div>
        <span onClick={() => onRoll(`Teste de ${name}`, value)} className="text-[6px] sm:text-[8px] tracking-widest uppercase font-light leading-none cursor-pointer hover:text-amber-500 transition-colors" title={`Rolar ${name}`}>{name} 🎲</span>
        <span className="text-xs sm:text-sm font-bold uppercase leading-none pointer-events-none">{short}</span>
      </div>
    </div>
  );
}

function SkillRow({ name, attrShort, color, trainingLevel, baseTotal, onRoll }) {
  const theme = themeColors[color];
  const [outros, setOutros] = useState(0); 
  const total = baseTotal + Number(outros);
  const renderDiamonds = () => { return [1, 2, 3].map((level) => (<span key={level} className={`text-xs mx-[1px] ${trainingLevel >= level ? theme.text : "text-zinc-800"}`}>♦</span>)); };
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors px-2 group">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button onClick={() => onRoll(name, total)} className="transition-all flex items-center justify-center w-7 h-7 rounded hover:bg-red-950/40 shadow-inner cursor-pointer"><img src={d20Icon} alt="Rolar" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" /></button>
        <div className={`w-1 h-4 rounded-full opacity-70 ${theme.bg}`}></div>
        <div className="flex flex-col"><span className="text-sm text-zinc-200 tracking-wide group-hover:text-white transition-colors">{name}</span><span className="text-[9px] text-zinc-500 uppercase">{attrShort}</span></div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="w-10 flex justify-center"><input type="number" value={outros} onChange={(e) => setOutros(e.target.value)} className="w-8 bg-black/40 border-b border-zinc-700 text-center text-amber-500 font-bold text-sm focus:outline-none focus:border-amber-500 rounded-t-sm" /></div>
        <div className="w-12 flex justify-center">{renderDiamonds()}</div>
        <div className="w-8 text-right text-lg font-bold text-white">{total >= 0 ? `+${total}` : total}</div>
      </div>
    </div>
  );
}

function StatusBar({ title, current, max, colorTheme, onDecrease, onIncrease, onMaxChange }) {
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

function WeaponCard({ weapon, skillTotal, onEdit, onDelete, onRollAttack }) {
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
          <button onClick={() => onRollAttack(weapon, skillTotal)} className="h-10 w-10 flex items-center justify-center bg-red-950/40 border border-red-900/50 rounded-md hover:bg-red-900 transition-all shadow-inner relative z-0 group-hover:border-red-500"> <img src={d20Icon} alt="Rolar Dano" className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all drop-shadow-md" /> </button> 
        </div> 
      </div> 
    </div> 
  );
}

function AbilityCard({ title, type, cost, description, onEdit, onDelete }) {
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

function ItemCard({ name, description, quantity, weight, onEdit, onDelete }) {
  return ( <div className="relative bg-[#1a1412]/80 border border-[#3e2723] hover:border-amber-900/80 rounded-lg p-3 flex justify-between items-center transition-all group mb-2 shadow-md"> <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"> <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-colors">✏️</button> <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-colors">🗑️</button> </div> <div className="flex gap-4 items-center pr-12"> <div className="flex items-center justify-center min-w-[2.5rem] h-10 bg-black/60 border border-[#3e2723] rounded-md text-amber-600 font-bold text-sm shadow-inner">x{quantity}</div> <div className="flex flex-col"> <h4 className="text-zinc-200 font-bold text-sm tracking-wide group-hover:text-amber-100 transition-colors">{name}</h4> <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{description}</span> </div> </div> <div className="text-amber-700 font-bold text-xs whitespace-nowrap pl-2">{(weight * quantity).toFixed(1)} kg</div> </div> );
}

function DefenseBlock({ agility }) {
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


// ================= TELA PRINCIPAL (GERENCIADOR DE PÁGINAS) =================
function App() {
  const [currentPage, setCurrentPage] = useState('ficha'); 
  
  // ================= ESTADOS GLOBAIS DO PERSONAGEM =================
  const [charName, setCharName] = useState("Kael, o Quebra-Marés");
  const [charOrigin, setCharOrigin] = useState("Costa / Pescador de Monstros"); 
  const [charRace, setCharRace] = useState("Korgath");
  const [charClass, setCharClass] = useState("Guerreiro");
  const [charLevel, setCharLevel] = useState(1);
  const [charAge, setCharAge] = useState(28);
  const [charDeity, setCharDeity] = useState("Nenhum");

  const [mut1, setMut1] = useState("Carne Intacta");
  const [mut2, setMut2] = useState("Carne Intacta");
  const [mut3, setMut3] = useState("Carne Intacta");

  const [attrInt, setAttrInt] = useState(-2);
  const [attrPre, setAttrPre] = useState(0);
  const [attrAgi, setAttrAgi] = useState(0);
  const [attrVig, setAttrVig] = useState(3);
  const [attrFor, setAttrFor] = useState(4);
  const [attrIns, setAttrIns] = useState(1);

  const [hp, setHp] = useState(24);
  const [maxHp, setMaxHp] = useState(24);
  const [pe, setPe] = useState(6);
  const [maxPe, setMaxPe] = useState(6);
  const [corruption, setCorruption] = useState(0); 
  const [maxCorruption, setMaxCorruption] = useState(40);

  const [lascas, setLascas] = useState(150);
  const initialItemState = { name: "", description: "", quantity: 1, weight: 0.5 };
  const [inventoryList, setInventoryList] = useState([{ name: "Ração Básica", description: "Dura 1 semana.", quantity: 5, weight: 0.5 }]);
  
  const initialWeaponState = { name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta" };
  const [attacksList, setAttacksList] = useState([
    { name: "Tridente de Guerra", damage: "1d8+4", critMargin: "20", critMultiplier: "x2", type: "Perfurante", skill: "Luta" }
  ]);
  const initialAbilityState = { title: "", type: "Dádiva Divina", cost: "1 PV", description: "" };
  const [abilitiesList, setAbilitiesList] = useState([
    { title: "Ataque Especial", type: "Habilidade de Classe", cost: "1 PE", description: "Gaste 1 PE para receber +4 no ataque ou +1 dado de dano." }
  ]);

  const [activeFichaTab, setActiveFichaTab] = useState('diário'); 
  const [showWeaponForm, setShowWeaponForm] = useState(false);
  const [editingWeaponIndex, setEditingWeaponIndex] = useState(null);
  const [weaponForm, setWeaponForm] = useState(initialWeaponState);
  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const [abilityForm, setAbilityForm] = useState(initialAbilityState);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemForm, setItemForm] = useState(initialItemState);

  const [notes, setNotes] = useState([{ id: 1, title: "Registro 01: Sobrevivência", content: "O pântano cheira a enxofre hoje..." }]);
  const [activeNoteId, setActiveNoteId] = useState(1);
  const [rollModal, setRollModal] = useState({ show: false, title: "", type: "", bonus: 0, d20: 0, total: 0, isRolling: false, isCrit: false, isFumble: false, weapon: null, details: "" });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [catalog, setCatalog] = useState(initialLojaCatalog);
  const [isMasterMode, setIsMasterMode] = useState(false);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" });
  const [buyQuantities, setBuyQuantities] = useState({});

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

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const executeRoll = (type, title, bonus, weapon = null) => {
    setRollModal({ show: true, title, type, bonus, d20: 0, total: 0, isRolling: true, isCrit: false, isFumble: false, weapon, details: "" });
    setTimeout(() => {
      if (type === 'damage') {
        const isCrit = bonus.isCrit || false;
        const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier);
        setRollModal(prev => ({ ...prev, isRolling: false, total: res.total, details: res.log, isCrit }));
      } else {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + Number(bonus);
        let isCrit = d20 === 20; let isFumble = d20 === 1;
        let damageBreakdown = ""; let damageTotal = 0;
        if (type === 'attack' && weapon) {
          const critMargin = parseInt(weapon.critMargin) || 20;
          if (d20 >= critMargin) isCrit = true;
          const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier);
          damageBreakdown = res.log; damageTotal = res.total;
        }
        setRollModal(prev => ({ ...prev, isRolling: false, d20, total, isCrit, isFumble, details: type === 'attack' ? damageBreakdown : "", damageTotal: type === 'attack' ? damageTotal : 0 }));
      }
    }, 1000);
  };

  const getSkillTotal = (skillString) => { const baseName = skillString.split(" ")[0]; const skillObj = skillsList.find(s => s.name === baseName); return skillObj ? skillObj.total : 0; };
  const handleDeityChange = (newDeity) => { setCharDeity(newDeity); let updatedAbilities = abilitiesList.filter(ab => ab.type !== "Dádiva Divina"); if (newDeity !== "Nenhum" && panteaoKorzel[newDeity]) { const newPowers = panteaoKorzel[newDeity].poderes.map(p => ({ title: p.title, type: "Dádiva Divina", cost: p.cost, description: p.desc })); updatedAbilities = [...updatedAbilities, ...newPowers]; } setAbilitiesList(updatedAbilities); };
  
  const handleOpenNewWeapon = () => { setWeaponForm(initialWeaponState); setEditingWeaponIndex(null); setShowWeaponForm(true); };
  const handleEditWeapon = (index) => { setWeaponForm(attacksList[index]); setEditingWeaponIndex(index); setShowWeaponForm(true); };
  const handleDeleteWeapon = (index) => { if(window.confirm("Deseja excluir?")) setAttacksList(attacksList.filter((_, i) => i !== index)); };
  const handleSaveWeapon = () => { if(!weaponForm.name || !weaponForm.damage) return alert("A arma precisa de Nome e Dano!"); if (editingWeaponIndex !== null) { const updated = [...attacksList]; updated[editingWeaponIndex] = weaponForm; setAttacksList(updated); } else { setAttacksList([...attacksList, weaponForm]); } setShowWeaponForm(false); };
  
  const handleOpenNewAbility = () => { setAbilityForm(initialAbilityState); setEditingAbilityIndex(null); setShowAbilityForm(true); };
  const handleEditAbility = (index) => { setAbilityForm(abilitiesList[index]); setEditingAbilityIndex(index); setShowAbilityForm(true); };
  const handleDeleteAbility = (index) => { if(window.confirm("Esquecer esta habilidade?")) setAbilitiesList(abilitiesList.filter((_, i) => i !== index)); };
  const handleSaveAbility = () => { if(!abilityForm.title || !abilityForm.description) return alert("A habilidade precisa de Nome e Descrição!"); if (editingAbilityIndex !== null) { const updated = [...abilitiesList]; updated[editingAbilityIndex] = abilityForm; setAbilitiesList(updated); } else { setAbilitiesList([...abilitiesList, abilityForm]); } setShowAbilityForm(false); };
  
  const handleOpenNewItem = () => { setItemForm(initialItemState); setEditingItemIndex(null); setShowItemForm(true); };
  const handleEditItem = (index) => { setItemForm(inventoryList[index]); setEditingItemIndex(index); setShowItemForm(true); };
  const handleDeleteItem = (index) => { if(window.confirm("Jogar fora?")) setInventoryList(inventoryList.filter((_, i) => i !== index)); };
  const handleSaveItem = () => { if(!itemForm.name) return alert("O item precisa de um nome!"); if (editingItemIndex !== null) { const updated = [...inventoryList]; updated[editingItemIndex] = itemForm; setInventoryList(updated); } else { setInventoryList([...inventoryList, itemForm]); } setShowItemForm(false); };

  const handleAddNote = () => { const newId = Date.now(); setNotes([...notes, { id: newId, title: "Página em Branco", content: "" }]); setActiveNoteId(newId); };
  const handleDeleteNote = (id) => { if(window.confirm("Arrancar página?")) { const newNotes = notes.filter(n => n.id !== id); setNotes(newNotes); if(activeNoteId === id) setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null); } };
  const handleNoteChange = (field, value) => { setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [field]: value } : n)); };
  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const handleBuyItem = (item, index) => {
    const qty = buyQuantities[index] || 1;
    const totalCost = item.price * qty;

    if (lascas >= totalCost) {
      setLascas(prev => prev - totalCost);
      const existingItemIndex = inventoryList.findIndex(i => i.name === item.name);
      if (existingItemIndex >= 0) {
        const updatedInventory = [...inventoryList];
        updatedInventory[existingItemIndex].quantity += qty;
        setInventoryList(updatedInventory);
      } else {
        setInventoryList([...inventoryList, { name: item.name, description: item.desc, quantity: qty, weight: item.weight }]);
      }
      showToast(`Compra efetuada! ${qty}x ${item.name} na bolsa.`, "success");
      setBuyQuantities(prev => ({...prev, [index]: 1})); 
    } else {
      showToast("Lascas insuficientes. As Sombras zombam da sua pobreza!", "error");
    }
  };

  const updateBuyQty = (index, delta) => {
    setBuyQuantities(prev => {
      const current = prev[index] || 1;
      return { ...prev, [index]: Math.max(1, current + delta) };
    });
  };

  const handleOpenNewCatalogItem = () => { setCatalogForm({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" }); setEditingCatalogIndex(null); setShowCatalogForm(true); };
  const handleEditCatalogItem = (index) => { setCatalogForm(catalog[index]); setEditingCatalogIndex(index); setShowCatalogForm(true); };
  const handleDeleteCatalogItem = (index) => { if(window.confirm("Remover da Loja?")) setCatalog(catalog.filter((_, i) => i !== index)); };
  const handleSaveCatalogItem = () => {
    if(!catalogForm.name) return alert("Precisa de nome!");
    if(editingCatalogIndex !== null) { const updated = [...catalog]; updated[editingCatalogIndex] = catalogForm; setCatalog(updated); } 
    else { setCatalog([...catalog, catalogForm]); }
    setShowCatalogForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans relative">
      
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] border flex items-center gap-3 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-950/90 border-red-900 text-red-200' : 'bg-green-950/90 border-green-900 text-green-200'}`}>
          <span className="text-xl drop-shadow-md">{toast.type === 'error' ? '💀' : '🪙'}</span>
          <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">{toast.message}</span>
        </div>
      )}

      <nav className="bg-[#140c08] border-b-2 border-[#3e2723] px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] sticky top-0 z-[100]">
        <div className="text-amber-600 font-black text-2xl tracking-widest uppercase flex items-center gap-2 drop-shadow-md shrink-0">
          <img src={mosasaurusSkull} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-80" />
          KORZEL VTT
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2 sm:gap-x-6 w-full">
          {['Ficha', 'Sessão', 'Compêndio', 'Loja', 'Personagens', 'Conta'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentPage(tab.toLowerCase())}
              className={`pb-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${currentPage === tab.toLowerCase() ? 'text-white border-red-800' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto">
        
        {currentPage === 'loja' && (
          <div className="p-4 lg:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-4xl bg-zinc-950/80 border-2 border-amber-900/50 rounded-xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-amber-900/30 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-amber-500 font-black text-2xl uppercase tracking-widest drop-shadow-md">Mercado de Verantis</h2>
                    <p className="text-zinc-400 text-sm mt-1">O ouro flui como o rio. Compre ferramentas para sobreviver mais um dia.</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                  <div className="flex items-center gap-3 bg-black/60 border border-amber-900/50 px-4 py-2 rounded-lg shadow-inner">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Sua Bolsa:</span>
                    <span className="text-2xl font-bold text-amber-400 drop-shadow-md">🪙 {lascas}</span>
                    <span className="text-xs text-zinc-500 ml-1">Lc</span>
                  </div>
                  <button onClick={() => setIsMasterMode(!isMasterMode)} className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded border transition-colors ${isMasterMode ? 'bg-purple-900/40 border-purple-500 text-purple-300' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white'}`}>
                    {isMasterMode ? '🔓 Modo Mestre Ativo' : '🔒 Modo Mestre'}
                  </button>
                </div>
              </div>

              {isMasterMode && showCatalogForm && (
                <div className="bg-purple-950/20 border border-purple-900/50 rounded-lg p-4 mb-6 animate-fade-in shadow-lg">
                  <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm border-b border-purple-900/30 pb-2 mb-4">{editingCatalogIndex !== null ? "🔧 Editar Produto" : "📦 Cadastrar Produto"}</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome</label><input type="text" value={catalogForm.name} onChange={(e) => setCatalogForm({...catalogForm, name: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                    <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Preço (Lc)</label><input type="number" value={catalogForm.price} onChange={(e) => setCatalogForm({...catalogForm, price: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                    <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Peso (kg)</label><input type="number" step="0.1" value={catalogForm.weight} onChange={(e) => setCatalogForm({...catalogForm, weight: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                    <div className="col-span-4 sm:col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={catalogForm.type} onChange={(e) => setCatalogForm({...catalogForm, type: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500"><option>Consumível</option><option>Equipamento</option><option>Arma</option><option>Alquimia</option></select></div>
                    <div className="col-span-4 sm:col-span-3"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição</label><input type="text" value={catalogForm.desc} onChange={(e) => setCatalogForm({...catalogForm, desc: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4"><button onClick={() => setShowCatalogForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveCatalogItem} className="px-4 py-2 text-xs font-bold bg-purple-900 hover:bg-purple-700 text-white rounded uppercase tracking-widest transition-colors shadow-lg">Salvar Produto</button></div>
                </div>
              )}

              {isMasterMode && !showCatalogForm && (
                <div className="flex justify-end mb-4"><button onClick={handleOpenNewCatalogItem} className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors shadow-lg border border-purple-700">+ Adicionar Produto</button></div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {catalog.map((item, index) => {
                  const qty = buyQuantities[index] || 1;
                  return (
                    <div key={index} className="relative bg-black/40 border border-[#3e2723] hover:border-amber-700/80 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all group shadow-md gap-4">
                      {isMasterMode && (
                        <div className="absolute top-2 right-2 flex gap-2 z-10 bg-black/80 px-2 py-1 rounded">
                          <button onClick={() => handleEditCatalogItem(index)} className="text-zinc-500 hover:text-yellow-500 transition-colors text-xs">✏️ Editar</button>
                          <button onClick={() => handleDeleteCatalogItem(index)} className="text-zinc-500 hover:text-red-500 transition-colors text-xs">🗑️ Excluir</button>
                        </div>
                      )}
                      <div className="flex flex-col pr-4 flex-1">
                        <span className="text-zinc-200 font-bold text-lg group-hover:text-amber-300 transition-colors pr-16 sm:pr-0">{item.name}</span>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold">{item.type}</span>
                          <span className="text-[10px] text-zinc-500 font-bold">{item.weight} kg</span>
                        </div>
                        <span className="text-xs text-zinc-400 mt-2 italic leading-tight">{item.desc}</span>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 shrink-0 border-t sm:border-t-0 border-[#3e2723] pt-3 sm:pt-0">
                        <div className="flex flex-col items-center">
                          <span className="text-amber-500 font-bold text-xl drop-shadow-md">{item.price} Lc</span>
                          <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Unidade</span>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-950 border border-amber-900/30 rounded p-1 shadow-inner">
                          <button onClick={() => updateBuyQty(index, -1)} className="w-6 h-6 flex items-center justify-center bg-black hover:bg-zinc-800 text-zinc-400 rounded text-lg font-bold transition-colors">-</button>
                          <span className="w-6 text-center text-white font-bold text-sm">{qty}</span>
                          <button onClick={() => updateBuyQty(index, 1)} className="w-6 h-6 flex items-center justify-center bg-black hover:bg-zinc-800 text-zinc-400 rounded text-lg font-bold transition-colors">+</button>
                        </div>
                        <button onClick={() => handleBuyItem(item, index)} className="w-full bg-amber-900/80 hover:bg-amber-700 text-amber-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors shadow-lg border border-amber-700 whitespace-nowrap">
                          {qty > 1 ? `Comprar (${item.price * qty})` : 'Comprar'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {['sessão', 'compêndio', 'personagens', 'conta'].includes(currentPage) && (
          <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in opacity-50">
            <span className="text-6xl mb-4 text-zinc-700">🚧</span>
            <h2 className="text-2xl font-bold text-zinc-500 uppercase tracking-widest">Área em Construção</h2>
            <p className="text-zinc-600 mt-2 text-center max-w-md">A entidade do código ainda está moldando esta realidade. Volte em breve para acessar a aba de {currentPage}.</p>
          </div>
        )}

        <div className={currentPage === 'ficha' ? 'flex flex-col lg:flex-row gap-6 animate-fade-in p-4 lg:p-8' : 'hidden'}>
          
          <div className="w-full lg:w-[50%] flex flex-col gap-8 relative z-10">
            <div className="w-full flex flex-wrap gap-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex-1 min-w-[200px] flex flex-col mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Personagem</span>
                <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} className="w-full text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
              </div>
              <div className="w-1/3 min-w-[150px] flex flex-col mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Origem</span>
                <input type="text" value={charOrigin} onChange={(e) => setCharOrigin(e.target.value)} placeholder="Ex: Caçador da Tundra" className="w-full text-lg font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
              </div>
              
              <div className="w-full h-[1px] bg-zinc-800/50 my-1"></div>
              
              <div className="flex-1 min-w-[100px] flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Raça</span>
                <input type="text" value={charRace} onChange={(e) => setCharRace(e.target.value)} className="w-full text-sm font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
              </div>
              <div className="flex-1 min-w-[100px] flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Classe</span>
                <input type="text" value={charClass} onChange={(e) => setCharClass(e.target.value)} className="w-full text-sm font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
              </div>
              <div className="w-16 flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Idade</span>
                <input type="number" value={charAge} onChange={(e) => setCharAge(e.target.value)} className="w-full text-sm text-center font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div className="w-16 flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nível</span>
                <input type="number" value={charLevel} onChange={(e) => setCharLevel(e.target.value)} className="w-full text-sm text-center font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>

            <div className="relative w-full flex items-center justify-center py-4">
              <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
                <img src={mosasaurusSkull} alt="Crânio do Mosassauro" className="absolute inset-0 w-full h-full object-contain opacity-90" />
                <div className="absolute text-white text-base sm:text-lg tracking-widest uppercase z-10 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Atributos</div>
                <AttributeCircle name="Intelecto" short="INT" color="yellow" value={attrInt} onChange={setAttrInt} customClass="top-[22%] left-1/2 -translate-x-1/2" onRoll={(n, v) => executeRoll('attribute', n, v)} />
                <AttributeCircle name="Presença" short="PRE" color="purple" value={attrPre} onChange={setAttrPre} customClass="top-[35%] right-[25%]" onRoll={(n, v) => executeRoll('attribute', n, v)} />
                <AttributeCircle name="Agilidade" short="AGI" color="blue" value={attrAgi} onChange={setAttrAgi} customClass="bottom-[30%] right-[27%]" onRoll={(n, v) => executeRoll('attribute', n, v)} />
                <AttributeCircle name="Vigor" short="VIG" color="green" value={attrVig} onChange={setAttrVig} customClass="bottom-[17%] left-1/2 -translate-x-1/2" onRoll={(n, v) => executeRoll('attribute', n, v)} />
                <AttributeCircle name="Força" short="FOR" color="red" value={attrFor} onChange={setAttrFor} customClass="bottom-[30%] left-[27%]" onRoll={(n, v) => executeRoll('attribute', n, v)} />
                <AttributeCircle name="Instinto" short="INS" color="amber" value={attrIns} onChange={setAttrIns} customClass="top-[35%] left-[25%]" onRoll={(n, v) => executeRoll('attribute', n, v)} />
              </div>
            </div>

            <div className="w-full max-w-md mx-auto flex flex-col mt-[-2rem] z-20">
              <StatusBar title="Vida" current={hp} max={maxHp} colorTheme="red" onDecrease={(val) => setHp(prev => Math.max(0, prev - val))} onIncrease={(val) => setHp(prev => Math.min(maxHp, prev + val))} onMaxChange={setMaxHp} />
              <StatusBar title="Esforço" current={pe} max={maxPe} colorTheme="orange" onDecrease={(val) => setPe(prev => Math.max(0, prev - val))} onIncrease={(val) => setPe(prev => Math.min(maxPe, prev + val))} onMaxChange={setMaxPe} />
              <StatusBar title="Corrupção" current={corruption} max={maxCorruption} colorTheme="green" onDecrease={(val) => setCorruption(prev => Math.max(0, prev - val))} onIncrease={(val) => setCorruption(prev => Math.min(maxCorruption, prev + val))} onMaxChange={setMaxCorruption} />
              <div className="w-full max-w-md mx-auto z-20"><DefenseBlock agility={attrAgi} /></div>
            </div>
          </div>

          <div className="w-full lg:w-[50%] flex flex-col h-[60vh] lg:h-[85vh] bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 lg:p-6 shadow-2xl backdrop-blur-sm sticky top-8 z-10">
            
            <div className="flex justify-between w-full border-b-2 border-zinc-800 mb-4 gap-1 sm:gap-2 shrink-0">
              {['Perícias', 'Combate', 'Habilidades', 'Inventário', 'Crenças', 'Diário'].map(tab => (
                <button key={tab} onClick={() => { setActiveFichaTab(tab.toLowerCase()); setShowWeaponForm(false); setShowAbilityForm(false); setShowItemForm(false); }} className={`pb-2 text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${ activeFichaTab === tab.toLowerCase() ? 'text-white border-b-2 border-red-800' : 'text-zinc-500 hover:text-zinc-300' }`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeFichaTab === 'perícias' && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
                <div className="flex justify-end items-end border-b border-zinc-800 pb-2 mb-2 px-2 pr-4"><div className="flex items-center text-[10px] text-zinc-400 uppercase tracking-wider font-bold gap-3 sm:gap-6"><div className="w-10 text-center text-amber-700/80" title="Bônus de Itens e Poderes">Outros</div><div className="w-12 text-center">Treino</div><div className="w-8 text-right">Total</div></div></div>
                {skillsList.map((skill, index) => ( <SkillRow key={index} name={skill.name} attrShort={skill.attrShort} color={skill.color} trainingLevel={skill.trainingLevel} baseTotal={skill.total} onRoll={(nome, bonusTotal) => executeRoll('skill', `Teste de ${nome}`, bonusTotal)} /> ))}
              </div>
            )}

            {activeFichaTab === 'combate' && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative flex-1 w-full"><input type="text" placeholder="Rolar dados avulsos (ex: 2d6+4)..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"/><img src={d20Icon} alt="Dado" className="absolute right-3 top-2 w-5 h-5 opacity-50 cursor-pointer hover:opacity-100" onClick={() => executeRoll('skill', "Rolagem Avulsa", 0)} title="Rolar 1d20 Puro" /></div>
                  {!showWeaponForm && ( <button onClick={handleOpenNewWeapon} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Forjar Ataque</button> )}
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
                      <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Perícia Base</label><select value={weaponForm.skill} onChange={(e) => setWeaponForm({...weaponForm, skill: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Luta</option><option>Pontaria</option><option>Arremesso</option></select></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowWeaponForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveWeapon} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingWeaponIndex !== null ? "Atualizar Arma" : "Salvar Arma"}</button></div>
                  </div>
                )}
                <div className="flex flex-col">{attacksList.map((atk, index) => ( <WeaponCard key={index} weapon={atk} damage={atk.damage} critMargin={atk.critMargin} critMultiplier={atk.critMultiplier} type={atk.type} skill={atk.skill} onEdit={() => handleEditWeapon(index)} onDelete={() => handleDeleteWeapon(index)} onRollAttack={(weaponObj) => executeRoll('attack', `Ataque: ${weaponObj.name}`, getSkillTotal(weaponObj.skill), weaponObj)} /> ))}</div>
              </div>
            )}

            {activeFichaTab === 'habilidades' && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold max-w-[60%] leading-tight">Lembre-se: Apague as Dádivas Divinas que seu personagem ainda não dominou.</span>
                  {!showAbilityForm && ( <button onClick={handleOpenNewAbility} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Aprender Habilidade</button> )}
                </div>
                {showAbilityForm && (
                  <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-zinc-700 pb-2 mb-4">{editingAbilityIndex !== null ? "🔧 Modificar Habilidade" : "🧬 Nova Habilidade / Mutação"}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome da Habilidade</label><input type="text" value={abilityForm.title} onChange={(e) => setAbilityForm({...abilityForm, title: e.target.value})} placeholder="Ex: Durão, Membrana Nictitante..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                      <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={abilityForm.type} onChange={(e) => setAbilityForm({...abilityForm, type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Poder de Classe</option><option>Poder de Guerreiro (Postura)</option><option>Habilidade de Raça</option><option>Dádiva Divina</option><option>Mutação da Corrupção</option></select></div>
                      <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Custo / Ativação</label><input type="text" value={abilityForm.cost} onChange={(e) => setAbilityForm({...abilityForm, cost: e.target.value})} placeholder="Ex: 2 PV, Passivo, Reação..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                      <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição e Efeitos</label><textarea rows="4" value={abilityForm.description} onChange={(e) => setAbilityForm({...abilityForm, description: e.target.value})} placeholder="Descreva o que a habilidade faz..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900 resize-none" /></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowAbilityForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveAbility} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingAbilityIndex !== null ? "Atualizar Registro" : "Aprender"}</button></div>
                  </div>
                )}
                <div className="flex flex-col">{abilitiesList.map((ability, index) => (<AbilityCard key={index} title={ability.title} type={ability.type} cost={ability.cost} description={ability.description} onEdit={() => handleEditAbility(index)} onDelete={() => handleDeleteAbility(index)} />))}</div>
              </div>
            )}

            {activeFichaTab === 'inventário' && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col">
                <div className="flex justify-between items-center bg-[#140c08]/80 border-2 border-[#3e2723] rounded-lg p-4 mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                  <div className="flex flex-col"><span className="text-[9px] text-amber-700/80 uppercase font-bold tracking-widest mb-1">Bolsa de Lascas</span><div className="flex items-center gap-2"><span className="text-2xl drop-shadow-md">🪙</span><input type="number" value={lascas} onChange={(e) => setLascas(Number(e.target.value))} className="bg-transparent text-2xl font-bold text-amber-500 outline-none w-24 border-b border-amber-900/50 focus:border-amber-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div></div>
                  {!showItemForm && ( <button onClick={handleOpenNewItem} className="h-10 px-4 bg-[#3e2723] hover:bg-amber-900 text-amber-500 hover:text-white font-bold rounded-md border border-amber-900/50 transition-colors uppercase tracking-widest text-[10px] shadow-lg">+ Guardar Item</button> )}
                  <div className="flex flex-col items-end"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Carga Máxima</span><div className="text-xl font-bold tracking-wider"><span className={currentWeight > maxWeight ? "text-red-500" : "text-white"}>{currentWeight.toFixed(1)}</span><span className="text-zinc-600 mx-1">/</span><span className="text-zinc-400">{maxWeight} kg</span></div></div>
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
                <div className="flex flex-col">{inventoryList.map((item, index) => (<ItemCard key={index} name={item.name} description={item.description} quantity={item.quantity} weight={item.weight} onEdit={() => handleEditItem(index)} onDelete={() => handleDeleteItem(index)} />))}</div>
              </div>
            )}

            {activeFichaTab === 'crenças' && (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col gap-6">
                <div className="shrink-0 bg-[#140c08]/80 border-2 border-purple-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-900/20 blur-[50px] rounded-full pointer-events-none"></div>
                  <h3 className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4 border-b border-purple-900/30 pb-2">Panteão de Korzel</h3>
                  <div className="flex flex-col mb-6"><label className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Entidade Cultuada</label><select value={charDeity} onChange={(e) => handleDeityChange(e.target.value)} className="w-full bg-black/60 border border-purple-900/50 rounded-md p-3 text-white text-base focus:outline-none focus:border-purple-500 shadow-inner appearance-none cursor-pointer font-bold">{Object.keys(panteaoKorzel).map(deus => (<option key={deus} value={deus}>{deus}</option>))}</select>{charDeity !== "Nenhum" && (<span className="text-[10px] text-purple-400 mt-2 italic">Dica: As Dádivas desta entidade foram adicionadas à sua aba de Habilidades.</span>)}</div>
                  {charDeity !== "Nenhum" && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                      <div className="bg-zinc-950/80 border-l-4 border-amber-600 p-3 rounded-r-md"><span className="text-[10px] text-amber-600 uppercase font-bold tracking-widest block mb-1">A Máscara (Religião Comum)</span><p className="text-sm text-zinc-300 italic">"{panteaoKorzel[charDeity].mascara}"</p></div>
                      <div className="bg-zinc-950/80 border-l-4 border-purple-800 p-3 rounded-r-md"><span className="text-[10px] text-purple-500 uppercase font-bold tracking-widest block mb-1">A Verdade (O Plano Antigo)</span><p className="text-sm text-zinc-300 font-medium">{panteaoKorzel[charDeity].verdade}</p></div>
                      <div className="bg-orange-950/20 border border-orange-900/40 p-4 rounded-md shadow-inner"><span className="flex items-center gap-2 text-xs text-orange-400 uppercase font-bold tracking-widest block mb-2"><span>⚖️</span> O Dogma e a Obrigação</span><p className="text-sm text-zinc-300 leading-relaxed">{panteaoKorzel[charDeity].obrigacao}</p></div>
                      <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-md shadow-inner"><span className="flex items-center gap-2 text-xs text-red-500 uppercase font-bold tracking-widest block mb-2"><span>💀</span> A Maldição da Quebra</span><p className="text-sm text-red-200 leading-relaxed">{panteaoKorzel[charDeity].punicao}</p></div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 bg-zinc-950/80 border-2 border-green-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-green-900/10 blur-[60px] rounded-full pointer-events-none"></div>
                  <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4"><h3 className="text-green-500 font-bold tracking-widest uppercase text-sm flex items-center gap-2"><span>☣️</span> A Herança do Predador</h3><div className="text-[10px] font-bold tracking-widest uppercase bg-black/60 px-3 py-1 rounded text-zinc-400 border border-zinc-800">Corrupção: <span className={corruption >= 40 ? "text-red-500" : "text-green-400"}>{corruption}</span> / 40</div></div>
                  <p className="text-[11px] text-zinc-500 mb-5 leading-relaxed text-justify">A carne obedece à vontade do Plano Antigo. Sempre que sua corrupção atinge um múltiplo de 10, a estrutura do corpo se estilhaça e se refaz em algo letal, porém menos humano.</p>
                  <div className="flex flex-col gap-4">
                    <div className={`p-3 rounded-md border transition-all ${corruption >= 10 ? "bg-green-950/20 border-green-800/50" : "bg-black/40 border-zinc-800/50 opacity-60"}`}>
                      <div className="flex justify-between items-center mb-2"><span className={`text-[10px] uppercase font-bold tracking-widest ${corruption >= 10 ? "text-green-400" : "text-zinc-600"}`}>1ª Mutação (10 pts)</span>{corruption >= 10 ? <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">-2 Diplomacia</span> : <span className="text-[10px] text-zinc-600 uppercase">Bloqueado</span>}</div>
                      <select disabled={corruption < 10} value={mut1} onChange={(e) => setMut1(e.target.value)} className="w-full bg-black/80 border border-green-900/30 rounded p-2 text-white text-sm focus:outline-none focus:border-green-500 shadow-inner appearance-none disabled:cursor-not-allowed">{Object.keys(mutacoesKorzel).map(m => (<option key={m} value={m}>{m}</option>))}</select>
                      {corruption >= 10 && mut1 !== "Carne Intacta" && ( <div className="mt-2 text-[10px] border-t border-green-900/30 pt-2"><p className="text-zinc-300"><span className="text-green-400 font-bold">Efeito:</span> {mutacoesKorzel[mut1].efeito}</p><p className="text-zinc-400 mt-1"><span className="text-red-400 font-bold">Ônus:</span> {mutacoesKorzel[mut1].onus}</p></div> )}
                    </div>
                    <div className={`p-3 rounded-md border transition-all ${corruption >= 20 ? "bg-green-950/20 border-green-800/50" : "bg-black/40 border-zinc-800/50 opacity-60"}`}>
                      <div className="flex justify-between items-center mb-2"><span className={`text-[10px] uppercase font-bold tracking-widest ${corruption >= 20 ? "text-green-400" : "text-zinc-600"}`}>2ª Mutação (20 pts)</span>{corruption >= 20 ? <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">-5 Diplomacia</span> : <span className="text-[10px] text-zinc-600 uppercase">Bloqueado</span>}</div>
                      <select disabled={corruption < 20} value={mut2} onChange={(e) => setMut2(e.target.value)} className="w-full bg-black/80 border border-green-900/30 rounded p-2 text-white text-sm focus:outline-none focus:border-green-500 shadow-inner appearance-none disabled:cursor-not-allowed">{Object.keys(mutacoesKorzel).map(m => (<option key={m} value={m}>{m}</option>))}</select>
                      {corruption >= 20 && mut2 !== "Carne Intacta" && ( <div className="mt-2 text-[10px] border-t border-green-900/30 pt-2"><p className="text-zinc-300"><span className="text-green-400 font-bold">Efeito:</span> {mutacoesKorzel[mut2].efeito}</p><p className="text-zinc-400 mt-1"><span className="text-red-400 font-bold">Ônus:</span> {mutacoesKorzel[mut2].onus}</p></div> )}
                    </div>
                    <div className={`p-3 rounded-md border transition-all ${corruption >= 30 ? "bg-green-950/20 border-green-800/50" : "bg-black/40 border-zinc-800/50 opacity-60"}`}>
                      <div className="flex justify-between items-center mb-2"><span className={`text-[10px] uppercase font-bold tracking-widest ${corruption >= 30 ? "text-green-400" : "text-zinc-600"}`}>3ª Mutação (30 pts)</span>{corruption >= 30 ? <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">Monstro (NPCs fogem)</span> : <span className="text-[10px] text-zinc-600 uppercase">Bloqueado</span>}</div>
                      <select disabled={corruption < 30} value={mut3} onChange={(e) => setMut3(e.target.value)} className="w-full bg-black/80 border border-green-900/30 rounded p-2 text-white text-sm focus:outline-none focus:border-green-500 shadow-inner appearance-none disabled:cursor-not-allowed">{Object.keys(mutacoesKorzel).map(m => (<option key={m} value={m}>{m}</option>))}</select>
                      {corruption >= 30 && mut3 !== "Carne Intacta" && ( <div className="mt-2 text-[10px] border-t border-green-900/30 pt-2"><p className="text-zinc-300"><span className="text-green-400 font-bold">Efeito:</span> {mutacoesKorzel[mut3].efeito}</p><p className="text-zinc-400 mt-1"><span className="text-red-400 font-bold">Ônus:</span> {mutacoesKorzel[mut3].onus}</p></div> )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFichaTab === 'diário' && (
              <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden bg-[#1c110a] border-2 border-[#3e2723] rounded-r-2xl rounded-l-md shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] relative">
                <div className="hidden sm:flex flex-col justify-around items-center w-10 bg-[#0a0502] border-r-2 border-[#3e2723] shadow-[5px_0_15px_rgba(0,0,0,0.8)] z-10 py-6">
                  {[1,2,3,4,5].map(i => ( <div key={i} className="w-6 h-3 border-2 border-zinc-500 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 shadow-sm relative"><div className="absolute top-1/2 right-[-8px] w-2 h-1 bg-zinc-400 rounded-full"></div></div> ))}
                </div>
                <div className="flex-1 flex flex-col p-4 sm:pl-8 w-full h-full relative z-0">
                  <div className="flex justify-between items-center mb-4 border-b border-[#3e2723] pb-2">
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar flex-1 pr-4">
                      {notes.map(note => ( <button key={note.id} onClick={() => setActiveNoteId(note.id)} className={`whitespace-nowrap px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-t-md border border-b-0 transition-colors ${activeNoteId === note.id ? 'bg-[#3e2723] border-amber-700 text-amber-500' : 'bg-black/40 border-[#3e2723] text-zinc-500 hover:text-amber-700'}`}>{note.title || "Sem Título"}</button> ))}
                    </div>
                    <button onClick={handleAddNote} className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber-900/80 hover:bg-amber-700 text-amber-100 rounded-md border border-amber-700 font-bold transition-colors" title="Nova Página">+</button>
                  </div>
                  {activeNote ? (
                    <div className="flex-1 flex flex-col animate-fade-in h-full">
                      <div className="flex justify-between items-center mb-4"><input type="text" value={activeNote.title} onChange={(e) => handleNoteChange('title', e.target.value)} placeholder="Título da Anotação..." className="text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-amber-900/50 w-full" /><button onClick={() => handleDeleteNote(activeNote.id)} className="text-zinc-600 hover:text-red-500 transition-colors" title="Arrancar Página">🗑️</button></div>
                      <textarea value={activeNote.content} onChange={(e) => handleNoteChange('content', e.target.value)} placeholder="Comece a escrever suas descobertas aqui..." className="flex-1 w-full bg-transparent resize-none focus:outline-none text-amber-100/90 text-sm sm:text-base leading-[2rem] bg-[linear-gradient(transparent_31px,#3e2723_32px)] bg-[length:100%_32px] custom-scrollbar" />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-50"><span className="text-4xl mb-4">📖</span><p className="text-zinc-500 text-sm italic">Nenhuma página aberta.</p></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= MODAL DO DADO (OVERLAY DA ROLAGEM) ================= */}
      {rollModal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => !rollModal.isRolling && setRollModal({...rollModal, show: false})}>
          <div className="flex flex-col items-center p-8 bg-zinc-950 border-2 border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(185,28,28,0.2)] max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-6 text-center text-lg">{rollModal.title}</h2>
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <img src={d20Icon} className={`w-full h-full object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] ${rollModal.isRolling ? 'animate-[spin_0.5s_linear_infinite] scale-110' : 'scale-100 transition-transform duration-300'}`} alt="D20" />
              {!rollModal.isRolling && rollModal.type !== 'damage' && ( <span className={`absolute text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${rollModal.isCrit ? 'text-yellow-400' : rollModal.isFumble ? 'text-red-600' : 'text-white'}`}>{rollModal.d20}</span> )}
            </div>
            {!rollModal.isRolling ? (
              <div className="flex flex-col items-center animate-fade-in w-full">
                {rollModal.type !== 'damage' && (
                  <>
                    <div className="flex items-center justify-center gap-4 text-zinc-400 text-sm font-bold mb-4 w-full bg-zinc-900/50 py-2 rounded-md border border-zinc-800">
                      <div className="flex flex-col items-center"><span className="text-[9px] uppercase tracking-widest">Natural</span><span className="text-lg text-white">{rollModal.d20}</span></div><span className="text-zinc-600 text-2xl">+</span><div className="flex flex-col items-center"><span className="text-[9px] uppercase tracking-widest">Bônus</span><span className="text-lg text-amber-500">{rollModal.bonus}</span></div>
                    </div>
                    <div className="flex flex-col items-center"><span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Resultado do Teste</span><div className="text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">{rollModal.total}</div></div>
                  </>
                )}
                {rollModal.isCrit && <div className="mt-4 w-full text-center py-2 bg-yellow-900/50 border border-yellow-500 text-yellow-400 text-xs uppercase tracking-widest font-bold rounded animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.3)]">🎉 Glória! (Acerto Crítico)</div>}
                {rollModal.isFumble && <div className="mt-4 w-full text-center py-2 bg-red-900/50 border border-red-500 text-red-400 text-xs uppercase tracking-widest font-bold rounded animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">💀 Desastre! (Falha Crítica)</div>}
                {rollModal.type === 'attack' && rollModal.weapon && (
                  <div className="w-full mt-6 bg-red-950/30 border border-red-900/50 p-4 rounded-md">
                    <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold block text-center mb-2">Dano Causado ({rollModal.weapon.damage})</span>
                    <div className="text-center text-sm text-zinc-400 mb-1">{rollModal.details}</div>
                    <div className="text-center text-4xl font-black text-red-500">{rollModal.damageTotal}</div>
                    {rollModal.isCrit && <div className="text-[9px] text-yellow-500/80 text-center uppercase tracking-widest mt-2">Multiplicador {rollModal.weapon.critMultiplier} Aplicado!</div>}
                  </div>
                )}
                <button onClick={() => setRollModal({...rollModal, show: false})} className="mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-md transition-colors border border-zinc-600">Fechar</button>
              </div>
            ) : (
              <div className="h-[160px] flex items-center justify-center"><span className="text-red-500 font-bold uppercase tracking-widest animate-pulse text-sm">Rolando o Destino...</span></div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;