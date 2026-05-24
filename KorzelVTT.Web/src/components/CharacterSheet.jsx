import React, { useState, useEffect } from 'react';
import mosasaurusSkull from '../assets/mosasaurus-skull.png';
import d20Icon from '../assets/d20-red.png';
import { panteaoKorzel, mutacoesKorzel } from '../data/korzelData';
import AttributeCircle from './AttributeCircle';
import SkillRow from './SkillRow';
import StatusBar from './StatusBar';
import WeaponCard from './WeaponCard';
import AbilityCard from './AbilityCard';
import ItemCard from './ItemCard';
import DefenseBlock from './DefenseBlock';

export default function CharacterSheet({
  charName, setCharName, charOrigin, setCharOrigin, charRace, setCharRace, charClass, setCharClass, charAge, setCharAge, charLevel, setCharLevel,
  attrInt, setAttrInt, attrPre, setAttrPre, attrAgi, setAttrAgi, attrVig, setAttrVig, attrFor, setAttrFor, attrIns, setAttrIns,
  hp, setHp, maxHp, setMaxHp, pe, setPe, maxPe, setMaxPe, corruption, setCorruption, maxCorruption, setMaxCorruption,
  // 👇 AQUI: Adicionei o setSkillsList nas props!
  lascas, setLascas, currentWeight, maxWeight, skillsList, setSkillsList, executeRoll,
  activeFichaTab, setActiveFichaTab,
  showWeaponForm, setShowWeaponForm, editingWeaponIndex, weaponForm, setWeaponForm, attacksList, setAttacksList, handleOpenNewWeapon, handleEditWeapon, handleDeleteWeapon, handleSaveWeapon,
  showAbilityForm, setShowAbilityForm, editingAbilityIndex, abilityForm, setAbilityForm, abilitiesList, handleOpenNewAbility, handleEditAbility, handleDeleteAbility, handleSaveAbility,
  showItemForm, setShowItemForm, editingItemIndex, itemForm, setItemForm, inventoryList, handleOpenNewItem, handleEditItem, handleDeleteItem, handleSaveItem,
  charDeity, handleDeityChange, mut1, setMut1, mut2, setMut2, mut3, setMut3,
  notes, activeNoteId, setActiveNoteId, handleAddNote, handleDeleteNote, handleNoteChange, activeNote,
  connection, setChatMessages, showToast
}) {

  // ==========================================
  // ESTADOS E LÓGICA DE PODERES ATIVOS
  // ==========================================
  const [activeToggles, setActiveToggles] = useState([]);

  useEffect(() => {
    if (currentWeight > maxWeight) {
      if (!activeToggles.includes("Sobrecarga")) {
        setActiveToggles(prev => [...prev, "Sobrecarga"]);
        if(showToast) showToast("⚠️ Sobrecarga! Você está carregando peso demais.", "error");
      }
    } else {
      if (activeToggles.includes("Sobrecarga")) {
        setActiveToggles(prev => prev.filter(t => t !== "Sobrecarga"));
      }
    }
  }, [currentWeight, maxWeight, activeToggles, showToast]);

  const handleToggleAbility = (ability) => {
    const isActive = activeToggles.includes(ability.title);

    if (isActive) {
      setActiveToggles(prev => prev.filter(t => t !== ability.title));
      if(showToast) showToast(`O efeito de ${ability.title} terminou.`, "info");
    } else {
      const costStr = String(ability.cost || "").toLowerCase();
      let costNum = 0;
      let rollDetails = "";

      const diceMatch = costStr.match(/(\d+)d(\d+)/);
      if (diceMatch) {
         const qtd = parseInt(diceMatch[1]);
         const faces = parseInt(diceMatch[2]);
         let rolls = [];
         for(let i = 0; i < qtd; i++) {
            const r = Math.floor(Math.random() * faces) + 1;
            costNum += r;
            rolls.push(r);
         }
         rollDetails = ` (Rolou ${qtd}d${faces}: [${rolls.join(', ')}])`;
      } else {
         const match = costStr.match(/\d+/);
         costNum = match ? parseInt(match[0]) : 0;
      }

      if (costStr.includes('pe') || costStr.includes('esforço')) {
        if (pe < costNum) { alert(`Você precisa de ${costNum} PE para ativar ${ability.title}!`); return; }
        setPe(prev => prev - costNum);
      } else if (costStr.includes('pv') || costStr.includes('vida') || costStr.includes('sangue')) {
        if (hp <= costNum) { alert(`Aviso: O custo rolado foi ${costNum} PV. Ativar isso mataria você!`); return; }
        setHp(prev => prev - costNum);
      }

      setActiveToggles(prev => [...prev, ability.title]);

      if (setChatMessages) {
        const tipoCusto = costStr.includes('pv') || costStr.includes('vida') ? 'PV' : costStr.includes('pe') ? 'PE' : '';
        const textoCusto = costNum > 0 ? `\n🩸 Custo Pago: ${costNum} ${tipoCusto}${rollDetails}` : '';

        const newMsg = {
          id: Date.now(),
          sender: charName || "Personagem",
          type: "msg",
          text: `⚡ Ativou Poder: **${ability.title}**${textoCusto}\n*${ability.description}*`
        };
        setChatMessages(prev => [...prev, newMsg]);
        if (connection) {
          connection.invoke("SendChatMessage", "Sala_Principal", JSON.stringify(newMsg)).catch(console.error);
        }
      }
    }
  };

  // ==========================================
  // MOTOR DE CÁLCULO E CLIQUE DE PERÍCIAS
  // ==========================================
  // ==========================================
  // MOTOR DE CÁLCULO DE PERÍCIAS (ATUALIZADO)
  // ==========================================
  const calculateSkillTotal = (skillName) => {
    const skill = skillsList.find(s => s.name === skillName);
    if (!skill) return 0;
    
    // 1. Pega o valor do Atributo base (da caveira)
    const attributesMap = { 'INT': attrInt, 'PRE': attrPre, 'AGI': attrAgi, 'VIG': attrVig, 'FOR': attrFor, 'INS': attrIns };
    const siglaLimpa = skill.attrShort ? skill.attrShort.trim().toUpperCase() : '';
    const attrValue = Number(attributesMap[siglaLimpa]) || 0;
    
    // 2. A MÁGICA: Mapeia o nível de treino para o bônus real do seu livro de regras!
    // 0 losangos = +0 (Destreinado)
    // 1 losango  = +2 (Treinado)
    // 2 losangos = +4 (Veterano)
    // 3 losangos = +6 (Mestre)
    const trainingBonuses = { 0: 0, 1: 2, 2: 4, 3: 6 };
    const level = Number(skill.trainingLevel) || 0;
    const trainingBonus = trainingBonuses[level] || 0;

    // 3. Retorna a soma final (Atributo + Bônus de Treino)
    return attrValue + trainingBonus;
  };
  // 👇 AQUI: Função que lida com o clique nos losangos!
  const handleToggleTraining = (skillName, clickedLevel) => {
    if (!setSkillsList) {
      console.warn("Atenção: Você precisa passar a prop 'setSkillsList' para a CharacterSheet para poder salvar a perícia!");
      return;
    }

    setSkillsList(prevSkills => prevSkills.map(skill => {
      if (skill.name === skillName) {
        // Se o cara clicar no nível que já tem (ex: clicou no losango 1 e já é 1), ele zera (desmarca).
        // Se clicar num diferente, ele assume o novo valor.
        const newLevel = skill.trainingLevel === clickedLevel ? 0 : clickedLevel;
        return { ...skill, trainingLevel: newLevel };
      }
      return skill;
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-0">
      <div className="w-full lg:w-[50%] flex flex-col gap-8 relative z-10 shrink-0">
        <div className="w-full flex flex-wrap gap-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex-1 min-w-[200px] flex flex-col mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Personagem</span>
            <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} onFocus={(e) => e.target.select()} className="w-full text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-1/3 min-w-[150px] flex flex-col mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Origem</span>
            <input type="text" value={charOrigin} onChange={(e) => setCharOrigin(e.target.value)} onFocus={(e) => e.target.select()} placeholder="Ex: Caçador da Tundra" className="w-full text-lg font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-full h-[1px] bg-zinc-800/50 my-1"></div>
          <div className="flex-1 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Raça</span>
            <input type="text" value={charRace} onChange={(e) => setCharRace(e.target.value)} onFocus={(e) => e.target.select()} className="w-full text-sm font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="flex-1 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Classe</span>
            <input type="text" value={charClass} onChange={(e) => setCharClass(e.target.value)} onFocus={(e) => e.target.select()} className="w-full text-sm font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-16 flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Idade</span>
            <input type="number" value={charAge} onChange={(e) => setCharAge(e.target.value)} onFocus={(e) => e.target.select()} className="w-full text-sm text-center font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div className="w-16 flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nível</span>
            <input type="number" value={charLevel} onChange={(e) => setCharLevel(e.target.value)} onFocus={(e) => e.target.select()} className="w-full text-sm text-center font-bold text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
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
          
          <div className="w-full max-w-md mx-auto z-20 mt-4"><DefenseBlock agility={attrAgi} /></div>

          <div className="w-full max-w-md mx-auto mt-4 bg-zinc-950/80 border border-purple-900/50 rounded-lg p-3 shadow-lg">
            <h4 className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-2">Condições & Efeitos Ativos</h4>
            <div className="flex flex-wrap gap-2">
              {activeToggles.map(t => (
                <span 
                  key={t} 
                  onClick={() => {
                    if(t !== "Sobrecarga") setActiveToggles(prev => prev.filter(item => item !== t));
                  }} 
                  className={`cursor-pointer text-xs font-bold px-2 py-1 rounded transition-colors ${t === "Sobrecarga" ? 'bg-red-900/80 border border-red-500 text-red-200 cursor-not-allowed' : 'bg-purple-900/60 border border-purple-500 text-purple-200 hover:bg-red-900/50 hover:border-red-500 hover:text-white'}`}
                  title={t === "Sobrecarga" ? "Efeito Automático" : "Clique para remover"}
                >
                  {t === "Sobrecarga" ? "🎒 " : "⚡ "} {t}
                </span>
              ))}
              {activeToggles.length === 0 && (
                <span className="text-xs text-zinc-600 italic px-1">Seu corpo está limpo de efeitos.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[50%] flex flex-col h-[60vh] lg:h-[85vh] bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 lg:p-6 shadow-2xl backdrop-blur-sm sticky top-8 z-10 min-h-0">
        <div className="flex justify-between w-full border-b-2 border-zinc-800 mb-4 gap-1 sm:gap-2 shrink-0">
          {['Perícias', 'Combate', 'Habilidades', 'Inventário', 'Crenças', 'Diário'].map(tab => (
            <button key={tab} onClick={() => { setActiveFichaTab(tab.toLowerCase()); setShowWeaponForm(false); setShowAbilityForm(false); setShowItemForm(false); }} className={`pb-2 text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${ activeFichaTab === tab.toLowerCase() ? 'text-white border-b-2 border-red-800' : 'text-zinc-500 hover:text-zinc-300' }`}>
              {tab}
            </button>
          ))}
        </div>

       {activeFichaTab === 'perícias' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 min-h-0">
            <div className="flex justify-end items-end border-b border-zinc-800 pb-2 mb-2 px-2 pr-4"><div className="flex items-center text-[10px] text-zinc-400 uppercase tracking-wider font-bold gap-3 sm:gap-6"><div className="w-10 text-center text-amber-700/80" title="Bônus de Itens e Poderes">Outros</div><div className="w-12 text-center">Treino</div><div className="w-8 text-right">Total</div></div></div>
            {skillsList.map((skill, index) => ( 
              <SkillRow 
                key={index} 
                name={skill.name} 
                attrShort={skill.attrShort} 
                color={skill.color} 
                trainingLevel={skill.trainingLevel} 
                baseTotal={calculateSkillTotal(skill.name)} 
                // 👇 AQUI: Passamos a função de click pros losangos
                onToggleTraining={(level) => handleToggleTraining(skill.name, level)}
                onRoll={(nome, bonusTotal) => {
                  if (nome.toLowerCase().trim() === 'sincronia') {
                    executeRoll('sincronia', 'Teste de Sincronia Ritual', bonusTotal);
                  } else {
                    executeRoll('skill', `Teste de ${nome}`, bonusTotal);
                  }
                }} 
              /> 
            ))}
          </div>
        )}

        {/* ... O Resto das abas ('combate', 'habilidades', 'inventário', etc) continua exatamente igual ... */}
        {activeFichaTab === 'combate' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
              <div className="relative flex-1 w-full"><input type="text" placeholder="Rolar dados avulsos (ex: 2d6+4)..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all"/><img src={d20Icon} alt="Dado" className="absolute right-3 top-2 w-5 h-5 opacity-50 cursor-pointer hover:opacity-100" onClick={() => executeRoll('skill', "Rolagem Avulsa", 0)} title="Rolar 1d20 Puro" /></div>
              {!showWeaponForm && ( <button onClick={handleOpenNewWeapon} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Forjar Ataque</button> )}
            </div>
            
            {showWeaponForm && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg shrink-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-zinc-700 pb-2 mb-4">{editingWeaponIndex !== null ? "🔧 Reforjar Arma" : "⚒️ Registro de Arsenal"}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-4"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome da Arma</label><input type="text" value={weaponForm.name} onFocus={(e) => e.target.select()} onChange={(e) => setWeaponForm({...weaponForm, name: e.target.value})} placeholder="Ex: Machado de Ossos" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Dano Base</label><input type="text" value={weaponForm.damage} onFocus={(e) => e.target.select()} onChange={(e) => setWeaponForm({...weaponForm, damage: e.target.value})} placeholder="1d12" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Margem</label><input type="text" value={weaponForm.critMargin} onFocus={(e) => e.target.select()} onChange={(e) => setWeaponForm({...weaponForm, critMargin: e.target.value})} placeholder="19" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Multip.</label><input type="text" value={weaponForm.critMultiplier} onFocus={(e) => e.target.select()} onChange={(e) => setWeaponForm({...weaponForm, critMultiplier: e.target.value})} placeholder="x3" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={weaponForm.type} onChange={(e) => setWeaponForm({...weaponForm, type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Cortante</option><option>Perfurante</option><option>Impacto</option><option>Profano</option></select></div>
                  <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Perícia Base</label><select value={weaponForm.skill} onChange={(e) => setWeaponForm({...weaponForm, skill: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Luta</option><option>Pontaria</option><option>Arremesso</option></select></div>
                  
                  <div className="col-span-2 sm:col-span-2 flex items-center gap-2 pt-4">
                    <input type="checkbox" checked={weaponForm.isRanged || false} onChange={(e) => setWeaponForm({...weaponForm, isRanged: e.target.checked})} className="w-4 h-4 accent-red-700 cursor-pointer" />
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest cursor-pointer" onClick={() => setWeaponForm({...weaponForm, isRanged: !weaponForm.isRanged})}>Longo Alcance?</span>
                  </div>
                  {weaponForm.isRanged && (
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Munição Inicial</label>
                      <input type="number" value={weaponForm.ammo || 0} onFocus={(e) => e.target.select()} onChange={(e) => setWeaponForm({...weaponForm, ammo: Number(e.target.value)})} placeholder="Qtd. Balas/Flechas" className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowWeaponForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveWeapon} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingWeaponIndex !== null ? "Atualizar Arma" : "Salvar Arma"}</button></div>
              </div>
            )}
            
            <div className="flex flex-col">
              {attacksList.map((atk, index) => ( 
                <WeaponCard 
                  key={index} 
                  weapon={atk} 
                  skillTotal={calculateSkillTotal(atk.skill)} 
                  onEdit={() => handleEditWeapon(index)} 
                  onDelete={() => handleDeleteWeapon(index)} 
                  onUpdateAmmo={(amount) => {
                    if (!setAttacksList) return;
                    const newAttacks = [...attacksList];
                    newAttacks[index].ammo = Math.max(0, (newAttacks[index].ammo || 0) + amount);
                    setAttacksList(newAttacks);
                  }}
                  onRollAttack={(weaponObj) => {
                    if (weaponObj.isRanged) {
                      if (weaponObj.ammo > 0) {
                        if (setAttacksList) {
                          const updated = [...attacksList];
                          updated[index].ammo -= 1;
                          setAttacksList(updated);
                        }
                        executeRoll('attack', `Ataque: ${weaponObj.name} (-1 Munição)`, calculateSkillTotal(weaponObj.skill), weaponObj);
                      } else {
                        alert(`A arma falhou! Você não tem munição para ${weaponObj.name}. Recarregue!`);
                      }
                    } else {
                      executeRoll('attack', `Ataque: ${weaponObj.name}`, calculateSkillTotal(weaponObj.skill), weaponObj);
                    }
                  }} 
                  onRollDamage={(weaponObj) => {
                    executeRoll('damage', `Dano: ${weaponObj.name}`, weaponObj.damage, weaponObj);
                  }}
                /> 
              ))}
            </div>
          </div>
        )}

        {activeFichaTab === 'habilidades' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold max-w-[60%] leading-tight">Lembre-se: Apague as Dádivas Divinas que seu personagem ainda não dominou.</span>
              {!showAbilityForm && ( <button onClick={handleOpenNewAbility} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Aprender</button> )}
            </div>
            {showAbilityForm && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg shrink-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-zinc-700 pb-2 mb-4">{editingAbilityIndex !== null ? "🔧 Modificar Habilidade" : "🧬 Nova Habilidade / Mutação"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome da Habilidade</label><input type="text" value={abilityForm.title} onChange={(e) => setAbilityForm({...abilityForm, title: e.target.value})} onFocus={(e) => e.target.select()} placeholder="Ex: Durão, Fúria..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={abilityForm.type} onChange={(e) => setAbilityForm({...abilityForm, type: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900"><option>Poder de Classe</option><option>Poder de Guerreiro (Postura)</option><option>Habilidade de Raça</option><option>Dádiva Divina</option><option>Mutação da Corrupção</option></select></div>
                  <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Custo / Ativação</label><input type="text" value={abilityForm.cost} onChange={(e) => setAbilityForm({...abilityForm, cost: e.target.value})} onFocus={(e) => e.target.select()} placeholder="Ex: 2 PE, 1 PV, Passivo..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900" /></div>
                  <div className="col-span-1 sm:col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição e Efeitos</label><textarea rows="4" value={abilityForm.description} onChange={(e) => setAbilityForm({...abilityForm, description: e.target.value})} placeholder="Descreva o que a habilidade faz..." className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm focus:outline-none focus:border-red-900 resize-none" /></div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-800"><button onClick={() => setShowAbilityForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Cancelar</button><button onClick={handleSaveAbility} className="px-4 py-2 text-xs font-bold bg-red-900/80 hover:bg-red-800 text-white rounded uppercase tracking-widest transition-colors shadow-lg">{editingAbilityIndex !== null ? "Atualizar" : "Aprender"}</button></div>
              </div>
            )}
            
            <div className="flex flex-col">
              {abilitiesList.map((ability, index) => {
                const isActive = activeToggles.includes(ability.title);
                const isPassive = !ability.cost || ability.cost.toLowerCase().includes('passivo') || ability.cost.toLowerCase().includes('reação');

                return (
                  <div key={index} className={`flex flex-col mb-4 rounded-lg transition-all ${isActive ? 'bg-purple-900/20 ring-1 ring-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.2)]' : ''}`}>
                    <AbilityCard 
                      title={ability.title} 
                      type={ability.type} 
                      cost={ability.cost} 
                      description={ability.description} 
                      onEdit={() => handleEditAbility(index)} 
                      onDelete={() => handleDeleteAbility(index)} 
                    />
                    
                    {!isPassive && (
                      <div className="flex justify-end px-3 pb-3 mt-[-10px] z-10">
                        <button
                          onClick={() => handleToggleAbility(ability)}
                          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded shadow-md transition-all ${isActive ? 'bg-purple-600 text-white border border-purple-400 hover:bg-purple-700' : 'bg-zinc-800 text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {isActive ? '⚡ Efeito Ativo (Desativar)' : 'Ativar Poder'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeFichaTab === 'inventário' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col min-h-0">
            <div className={`flex justify-between items-center bg-[#140c08]/80 border-2 rounded-lg p-4 mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] shrink-0 transition-colors ${currentWeight > maxWeight ? 'border-red-900' : 'border-[#3e2723]'}`}>
              <div className="flex flex-col"><span className="text-[9px] text-amber-700/80 uppercase font-bold tracking-widest mb-1">Bolsa de Lascas</span><div className="flex items-center gap-2"><span className="text-2xl drop-shadow-md">🪙</span><input type="number" value={lascas} onChange={(e) => setLascas(Number(e.target.value))} onFocus={(e) => e.target.select()} className="bg-transparent text-2xl font-bold text-amber-500 outline-none w-24 border-b border-amber-900/50 focus:border-amber-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div></div>
              {!showItemForm && ( <button onClick={handleOpenNewItem} className="h-10 px-4 bg-[#3e2723] hover:bg-amber-900 text-amber-500 hover:text-white font-bold rounded-md border border-amber-900/50 transition-colors uppercase tracking-widest text-[10px] shadow-lg">+ Guardar Item</button> )}
              <div className="flex flex-col items-end"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Carga Máxima</span><div className="text-xl font-bold tracking-wider"><span className={currentWeight > maxWeight ? "text-red-500 animate-pulse" : "text-white"}>{currentWeight.toFixed(1)}</span><span className="text-zinc-600 mx-1">/</span><span className="text-zinc-400">{maxWeight} kg</span></div></div>
            </div>
            {showItemForm && (
              <div className="bg-[#1a1412] border border-[#3e2723] rounded-lg p-4 mb-6 animate-fade-in shadow-lg shrink-0">
                <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm border-b border-[#3e2723] pb-2 mb-4">{editingItemIndex !== null ? "🔧 Alterar Item" : "🎒 Guardar Novo Item"}</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 sm:col-span-2"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Nome do Item</label><input type="text" value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} onFocus={(e) => e.target.select()} placeholder="Ex: Poção de Cura" className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Qtd.</label><input type="number" min="1" value={itemForm.quantity} onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})} onFocus={(e) => e.target.select()} className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Peso Un. (kg)</label><input type="number" step="0.1" min="0" value={itemForm.weight} onChange={(e) => setItemForm({...itemForm, weight: e.target.value})} onFocus={(e) => e.target.select()} className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                  <div className="col-span-4"><label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Descrição</label><input type="text" value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} onFocus={(e) => e.target.select()} placeholder="Para que serve?" className="w-full bg-black/50 border border-[#3e2723] rounded p-2 text-zinc-200 text-sm focus:outline-none focus:border-amber-700" /></div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[#3e2723]"><button onClick={() => setShowItemForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors">Fechar Bolsa</button><button onClick={handleSaveItem} className="px-4 py-2 text-xs font-bold bg-amber-900/80 hover:bg-amber-700 text-amber-100 rounded uppercase tracking-widest transition-colors shadow-lg">{editingItemIndex !== null ? "Atualizar" : "Guardar"}</button></div>
              </div>
            )}
            <div className="flex flex-col">{inventoryList.map((item, index) => (<ItemCard key={index} name={item.name} description={item.description} quantity={item.quantity} weight={item.weight} onEdit={() => handleEditItem(index)} onDelete={() => handleDeleteItem(index)} />))}</div>
          </div>
        )}

        {activeFichaTab === 'crenças' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col gap-6 min-h-0">
            <div className="shrink-0 bg-[#140c08]/80 border-2 border-purple-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-900/20 blur-[50px] rounded-full pointer-events-none"></div>
              <h3 className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4 border-b border-purple-900/30 pb-2">Panteão de Korzel</h3>
              <div className="flex flex-col mb-6"><label className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Entidade Cultuada</label><select value={charDeity} onChange={(e) => handleDeityChange(e.target.value)} className="w-full bg-black/60 border border-purple-900/50 rounded-md p-3 text-white text-base focus:outline-none focus:border-purple-500 shadow-inner appearance-none cursor-pointer font-bold">{Object.keys(panteaoKorzel).map(deus => (<option key={deus} value={deus}>{deus}</option>))}</select>{charDeity !== "Nenhum" && (<span className="text-[10px] text-purple-400 mt-2 italic">Dica: As Dádivas desta entidade foram adicionadas à sua aba de Habilidades.</span>)}</div>
              {charDeity !== "Nenhum" && panteaoKorzel[charDeity] && (
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
              <p className="text-[11px] text-zinc-500 mb-5 leading-relaxed text-justify">A carne obedece à vontade do Plano Antigo. Sempre que sua corrupção atinge um múltiplo de 10, a estrutura do seu corpo se estilhaça e se refaz em algo mais letal, porém menos humano.</p>
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
          <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden bg-[#1c110a] border-2 border-[#3e2723] rounded-r-2xl rounded-l-md shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] relative min-h-0">
            <div className="hidden sm:flex flex-col justify-around items-center w-10 bg-[#0a0502] border-r-2 border-[#3e2723] shadow-[5px_0_15px_rgba(0,0,0,0.8)] z-10 py-6 shrink-0">
              {[1,2,3,4,5].map(i => ( <div key={i} className="w-6 h-3 border-2 border-zinc-500 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 shadow-sm relative"><div className="absolute top-1/2 right-[-8px] w-2 h-1 bg-zinc-400 rounded-full"></div></div> ))}
            </div>
            <div className="flex-1 flex flex-col p-4 sm:pl-8 w-full h-full relative z-0 min-h-0">
              <div className="flex justify-between items-center mb-4 border-b border-[#3e2723] pb-2 shrink-0">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar flex-1 pr-4">
                  {notes.map(note => ( <button key={note.id} onClick={() => setActiveNoteId(note.id)} className={`whitespace-nowrap px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-t-md border border-b-0 transition-colors ${activeNoteId === note.id ? 'bg-[#3e2723] border-amber-700 text-amber-500' : 'bg-black/40 border-[#3e2723] text-zinc-500 hover:text-amber-700'}`}>{note.title || "Sem Título"}</button> ))}
                </div>
                <button onClick={handleAddNote} className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber-900/80 hover:bg-amber-700 text-amber-100 rounded-md border border-amber-700 font-bold transition-colors" title="Nova Página">+</button>
              </div>
              {activeNote ? (
                <div className="flex-1 flex flex-col animate-fade-in h-full min-h-0">
                  <div className="flex justify-between items-center mb-4 shrink-0"><input type="text" value={activeNote.title} onChange={(e) => handleNoteChange('title', e.target.value)} onFocus={(e) => e.target.select()} placeholder="Título da Anotação..." className="text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-amber-900/50 w-full" /><button onClick={() => handleDeleteNote(activeNote.id)} className="text-zinc-600 hover:text-red-500 transition-colors" title="Arrancar Página">🗑️</button></div>
                  <textarea value={activeNote.content} onChange={(e) => handleNoteChange('content', e.target.value)} placeholder="Comece a escrever suas descobertas aqui..." className="flex-1 w-full h-full bg-transparent resize-none focus:outline-none text-amber-100/90 text-sm sm:text-base leading-[2rem] bg-[linear-gradient(transparent_31px,#3e2723_32px)] bg-[length:100%_32px] custom-scrollbar" />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 min-h-0"><span className="text-4xl mb-4">📖</span><p className="text-zinc-500 text-sm italic">Nenhuma página aberta.</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}