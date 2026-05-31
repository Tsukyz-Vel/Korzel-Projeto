import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Lobby from './components/Lobby';
import CharacterSheet from './components/CharacterSheet';
import VttSession from './components/VttSession';
import DiceRollerOverlay from './components/DiceRollerOverlay';
import { initialLojaCatalog, panteaoKorzel } from './data/korzelData';
import { parseAndRollDamage } from './utils/diceUtils';
import Compendio from './components/Compendio';
import * as signalR from '@microsoft/signalr';
import Configuracoes from './components/Configuracoes';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // ==========================================
  // 1. ESTADOS (STATES) E REFS
  // ==========================================
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState('início'); 
  const [isMasterMode, setIsMasterMode] = useState(false); 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [authToken, setAuthToken] = useState(localStorage.getItem('korzel_token') || null);
  const [loggedUserName, setLoggedUserName] = useState(localStorage.getItem('korzel_username') || "");
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  
  const [charName, setCharName] = useState("");
  const [charOrigin, setCharOrigin] = useState(""); 
  const [charRace, setCharRace] = useState("");
  const [charClass, setCharClass] = useState("");
  const [charLevel, setCharLevel] = useState(1);
  const [charAge, setCharAge] = useState(0);
  const [charDeity, setCharDeity] = useState("Nenhum");

  const [mut1, setMut1] = useState("Carne Intacta");
  const [mut2, setMut2] = useState("Carne Intacta");
  const [mut3, setMut3] = useState("Carne Intacta");

  const [attrInt, setAttrInt] = useState(0);
  const [attrPre, setAttrPre] = useState(0);
  const [attrAgi, setAttrAgi] = useState(0);
  const [attrVig, setAttrVig] = useState(0);
  const [attrFor, setAttrFor] = useState(0);
  const [attrIns, setAttrIns] = useState(0);

  const [hp, setHp] = useState(10);
  const [maxHp, setMaxHp] = useState(10);
  const [pe, setPe] = useState(0);
  const [maxPe, setMaxPe] = useState(0);
  const [corruption, setCorruption] = useState(0); 
  const [maxCorruption, setMaxCorruption] = useState(40);
  const [lascas, setLascas] = useState(0);

  const initialItemState = { name: "", description: "", quantity: 1, weight: 0.5 };
  const [inventoryList, setInventoryList] = useState([]);
  const [attacksList, setAttacksList] = useState([]);
  const [abilitiesList, setAbilitiesList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [skillsList, setSkillsList] = useState([
    { name: "Acrobacia", attrShort: "agi", color: "blue", trainingLevel: 0 },
    { name: "Adestramento", attrShort: "ins", color: "amber", trainingLevel: 0 },
    { name: "Arremesso", attrShort: "for", color: "red", trainingLevel: 0 },
    { name: "Atletismo", attrShort: "vig", color: "green", trainingLevel: 0 },
    { name: "Constituição", attrShort: "vig", color: "green", trainingLevel: 0 },
    { name: "Enganação", attrShort: "pre", color: "purple", trainingLevel: 0 },
    { name: "Engenharia", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Erudição", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Furtividade", attrShort: "agi", color: "blue", trainingLevel: 0 },
    { name: "Influência", attrShort: "pre", color: "purple", trainingLevel: 0 },
    { name: "Intimidação", attrShort: "pre", color: "purple", trainingLevel: 0 },
    { name: "Intuição", attrShort: "ins", color: "amber", trainingLevel: 0 },
    { name: "Investigação", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Ladinagem", attrShort: "agi", color: "blue", trainingLevel: 0 },
    { name: "Liderança", attrShort: "pre", color: "purple", trainingLevel: 0 },
    { name: "Luta", attrShort: "for", color: "red", trainingLevel: 0 },
    { name: "Medicina", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Misticismo", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Montaria/Pilotar", attrShort: "agi", color: "blue", trainingLevel: 0 },
    { name: "Navegação", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Ofício", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Percepção", attrShort: "ins", color: "amber", trainingLevel: 0 },
    { name: "Pontaria", attrShort: "agi", color: "blue", trainingLevel: 0 },
    { name: "Rastrear", attrShort: "ins", color: "amber", trainingLevel: 0 },
    { name: "Religião", attrShort: "int", color: "yellow", trainingLevel: 0 },
    { name: "Sincronia", attrShort: "pre", color: "purple", trainingLevel: 0 },
    { name: "Sobrevivência", attrShort: "ins", color: "amber", trainingLevel: 0 },
    { name: "Vontade", attrShort: "pre", color: "purple", trainingLevel: 0 }
  ]);

  const [activeFichaTab, setActiveFichaTab] = useState('perícias'); 
  const [activeNoteId, setActiveNoteId] = useState(1);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [rollModal, setRollModal] = useState({ show: false, title: "", type: "", bonus: 0, d20: 0, total: 0, isRolling: false, isCrit: false, isFumble: false, weapon: null, details: "" });
  const [showWeaponForm, setShowWeaponForm] = useState(false);
  const [editingWeaponIndex, setEditingWeaponIndex] = useState(null);
  const [weaponForm, setWeaponForm] = useState({ name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta" });
  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const [abilityForm, setAbilityForm] = useState({ title: "", type: "Dádiva Divina", cost: "1 PV", description: "" });
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemForm, setItemForm] = useState(initialItemState);

  const [catalog, setCatalog] = useState(() => {
    try { 
      const saved = localStorage.getItem('korzel_catalog'); 
      return saved ? JSON.parse(saved) : []; 
    } catch { 
      return [];
    }
  });

  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" });
  const [buyQuantities, setBuyQuantities] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  
  const [currentCampaignId, setCurrentCampaignId] = useState(null);
  const [activeCharId, setActiveCharId] = useState(null); 
  const [campaignCharacters, setCampaignCharacters] = useState([]); 

  const [resistances, setResistances] = useState("");
  const [oficioText, setOficioText] = useState("");
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [sessionTab, setSessionTab] = useState('chat');
  const [secretRoll, setSecretRoll] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: "Sistema", text: "A névoa cobre as docas de Verantis. A sessão começou.", type: "info" }]);
  
  const [scenes, setScenes] = useState([]);
  const [gmActiveSceneId, setGmActiveSceneId] = useState(null);
  const [playerActiveSceneId, setPlayerActiveSceneId] = useState(null);
  
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tokenForm, setTokenForm] = useState({ name: '', isNpc: true, image: null });
  
  const [tokenLibrary, setTokenLibrary] = useState(() => {
    try { const saved = localStorage.getItem('korzel_token_library'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [sceneTokens, setSceneTokens] = useState([]);
  const [fichaSearch, setFichaSearch] = useState('');
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: -800, y: -800 }); 
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingToken, setDraggingToken] = useState(null);
  const [tokenContextMenu, setTokenContextMenu] = useState({ show: false, x: 0, y: 0, tokenId: null });
  
  const mapRef = useRef(null);
  const fileInputRef = useRef(null);
  const tokenFileInputRef = useRef(null);
  const audioRef = useRef(null);
  const audioFileInputRef = useRef(null);

  const [audioCategories, setAudioCategories] = useState([{ id: 'combat', name: '⚔️ Combate', tracks: [] }, { id: 'ambient', name: '🌲 Ambiente', tracks: [] }, { id: 'tavern', name: '🍺 Taverna', tracks: [] }, { id: 'uploads', name: '📁 Meus Uploads', tracks: [] }]);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [targetAudioCat, setTargetAudioCat] = useState('uploads'); 
  const [connection, setConnection] = useState(null);

  // ==========================================
  // 2. VARIÁVEIS DERIVADAS
  // ==========================================
  let isAdmin = false;
  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const userEmail = payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "";
      isAdmin = userEmail === "dinofalco123@gmail.com";
    } catch (e) {}
  }

  let calculatedMaxWeight = 20 + (Number(attrFor) * 10);
  if (charRace && charRace.toLowerCase().includes('korgath')) { calculatedMaxWeight *= 2; }
  const maxWeight = Math.max(5, calculatedMaxWeight);
  const currentWeight = inventoryList.reduce((total, item) => total + ((Number(item.quantity) || 0) * (Number(item.weight) || 0)), 0);
  const currentSceneObj = scenes.find(s => s.id === (isMasterMode ? gmActiveSceneId : playerActiveSceneId));
  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  // ==========================================
  // 3. TODAS AS FUNÇÕES (FUNCTIONS)
  // ==========================================
  const showToast = (message, type = "success") => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500); };
  const getSkillTotal = (skillString) => { const baseName = skillString.split(" ")[0]; const skillObj = skillsList.find(s => s.name === baseName); return skillObj ? skillObj.total : 0; };
  const getAuthHeaders = () => { return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }; };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const url = authMode === 'login' ? 'https://korzel-api.onrender.com/api/auth/login' : 'https://korzel-api.onrender.com/api/auth/register';
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) data = await res.json();
      else data = await res.text();

      if (res.ok) {
        if (authMode === 'register') { showToast(data.message || "Conta forjada!", "success"); setAuthMode('login'); } 
        else {
          localStorage.setItem('korzel_token', data.token); localStorage.setItem('korzel_username', data.username);
          setAuthToken(data.token); setLoggedUserName(data.username); showToast(`Bem-vindo(a), ${data.username}!`, "success");
        }
      } else { showToast(data.message || data || "Erro.", "error"); }
    } catch (error) { showToast("Erro de conexão.", "error"); }
  };

  const handleLogout = () => { localStorage.removeItem('korzel_token'); localStorage.removeItem('korzel_username'); setAuthToken(null); setLoggedUserName(""); setCurrentPage('início'); };

  const handleEnterSession = async (asMaster, campaignId) => {
    if (!campaignId) { showToast("Erro: Sala corrompida. Não há ID.", "error"); return; }
    setIsMasterMode(asMaster); 
    setCurrentCampaignId(campaignId); 
    setSessionTab('chat'); 
    setCurrentPage('sessao');
    if (connection && campaignId) { 
      connection.invoke("JoinSession", campaignId.toString(), loggedUserName).catch(console.error); 
    }
    
    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/scenes/campaign/${campaignId}`);
      if (res.ok) {
        const data = await res.json();
        if (!asMaster) setGmActiveSceneId(null); 
        
        if (data && data.length > 0) {
          setScenes(data);
          const activeScene = data.find(s => s.isActive) || data[0];
          if (activeScene) { 
            setGmActiveSceneId(activeScene.id); 
            setPlayerActiveSceneId(activeScene.id); 
            const todosOsTokens = data.flatMap(cena => cena.tokens || []);
            setSceneTokens(todosOsTokens); 
          }
        } else {
          const firstScene = { campaignId: campaignId, name: "Mapa Inicial", bgImage: "", isActive: true };
          const resCreate = await fetch(`https://korzel-api.onrender.com/api/scenes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(firstScene) });
          if(resCreate.ok){
             const newDbScene = await resCreate.json(); 
             setScenes([newDbScene]); 
             setGmActiveSceneId(newDbScene.id); 
             setPlayerActiveSceneId(newDbScene.id); 
             setSceneTokens([]);
          }
        }
        try {
          const audioRes = await fetch(`https://korzel-api.onrender.com/api/audio/campaign/${campaignId}`, { headers: getAuthHeaders() });
          if (audioRes.ok) {
            const tracksData = await audioRes.json();
            setAudioCategories(prev => prev.map(cat => {
               const tracksForCat = tracksData.filter(t => t.category === cat.id).map(t => ({ id: t.id, name: t.name, url: t.base64Data }));
               return { ...cat, tracks: tracksForCat };
            }));
          }
        } catch(err) { console.error("Erro ao puxar áudio", err); }
      }
    } catch (e) { console.error("Erro mapa:", e); }
  };

  const fetchAllCharacters = async () => {
    if (!authToken) return;
    const url = currentCampaignId 
      ? `https://korzel-api.onrender.com/api/characters/campaign/${currentCampaignId}` 
      : "https://korzel-api.onrender.com/api/characters";
      
    try { 
      const res = await fetch(url, { headers: getAuthHeaders() });
      if(res.ok) { 
        const data = await res.json(); 
        setCampaignCharacters(Array.isArray(data) ? data : []); 
      }
    } catch(e) { console.error("Erro ao buscar fichas", e); }
  };

  const loadCharacterFromDb = async (idToLoad) => {
    try { const response = await fetch(`https://korzel-api.onrender.com/api/characters/${idToLoad}`, { headers: getAuthHeaders() });
      if (response.ok) { const data = await response.json();
        setActiveCharId(data.id); setCharName(data.name || ""); setCharOrigin(data.origin || ""); setCharRace(data.race || ""); setCharClass(data.class || ""); setCharAge(data.age || 0); setCharLevel(data.level || 1); setCharDeity(data.deity || "Nenhum"); setMut1(data.mut1 || "Carne Intacta"); setMut2(data.mut2 || "Carne Intacta"); setMut3(data.mut3 || "Carne Intacta"); setAttrInt(data.intellect || 0); setAttrPre(data.presence || 0); setAttrAgi(data.agility || 0); setAttrVig(data.vigor || 0); setAttrFor(data.strength || 0); setAttrIns(data.instinct || 0); setHp(data.currentHP || 0); setMaxHp(data.maxHP || 0); setPe(data.currentPE || 0); setMaxPe(data.maxPE || 0); setCorruption(data.corruption || 0); setMaxCorruption(data.maxCorruption || 40); setLascas(data.lascas || 0);
        if (data.skills && data.skills.length > 0) { setSkillsList(prev => prev.map(base => { const dbSkill = data.skills.find(s => s.name === base.name); return dbSkill ? { ...base, trainingLevel: dbSkill.trainingLevel, others: dbSkill.others } : base; })); }
        setInventoryList(data.inventory || []); setAttacksList(data.weapons || []); setAbilitiesList(data.abilities || []); setNotes(data.notes || []); setResistances(data.resistances || "");
        setOficioText(data.oficioText || "");
        setCurrentPage('ficha'); showToast("Ficha carregada!", "success");
      }
    } catch (error) {}
  };

  const saveCharacterToDb = async () => {
    const characterData = { 
      id: activeCharId || 0, 
      campaignId: currentCampaignId || 0,
      name: charName, origin: charOrigin, race: charRace, class: charClass, age: charAge, level: charLevel, deity: charDeity, mut1, mut2, mut3, intellect: attrInt, presence: attrPre, agility: attrAgi, vigor: attrVig, strength: attrFor, instinct: attrIns, currentHP: hp, maxHP: maxHp, currentPE: pe, maxPE: maxPe, corruption, maxCorruption, lascas, baseDefense: 10,resistances: resistances,
      oficioText: oficioText, 
      skills: skillsList.map(s => ({ name: s.name, trainingLevel: s.trainingLevel, others: s.others || 0 })), 
      inventory: inventoryList.map(i => ({ name: i.name, description: i.description, quantity: i.quantity, weight: i.weight, isEquipped: i.isEquipped || false, itemType: i.itemType || "Consumível", armorBonus: i.armorBonus || 0, armorPenalty: i.armorPenalty || 0 })), 
      weapons: attacksList.map(w => ({ name: w.name, damage: w.damage, critMargin: w.critMargin, critMultiplier: w.critMultiplier, type: w.type, skill: w.skill, isRanged: w.isRanged || false, ammo: w.ammo || 0 })), 
      abilities: abilitiesList.map(a => ({ title: a.title, type: a.type, cost: a.cost, description: a.description })), 
      notes: notes.map(n => ({ title: n.title || "Sem título", content: n.content || "" })) 
    };
    try {
      if (activeCharId) {
        const res = await fetch(`https://korzel-api.onrender.com/api/characters/${activeCharId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(characterData) });
        if(res.ok) {
           showToast("Ficha atualizada!", "success");
           if (connection && currentCampaignId) connection.invoke("RefreshCharacters", currentCampaignId.toString()).catch(console.error);
        } else showToast(`Erro ${res.status}.`, "error");
      } else {
        const res = await fetch(`https://korzel-api.onrender.com/api/characters`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(characterData) });
        if(res.ok) { 
           const newData = await res.json(); 
           setActiveCharId(newData.id); 
           fetchAllCharacters(); 
           showToast("Nova Ficha!", "success"); 
           if (connection && currentCampaignId) connection.invoke("RefreshCharacters", currentCampaignId.toString()).catch(console.error);
        } else showToast(`Erro ${res.status}.`, "error");
      }
    } catch (error) { showToast("Erro conexão.", "error"); }
  };

  const handleDeleteCharacter = async (id, name) => { 
    if (window.confirm(`Tem certeza que deseja apagar definitivamente a ficha de ${name}?`)) { 
      try { 
        const res = await fetch(`https://korzel-api.onrender.com/api/characters/${id}`, { 
          method: 'DELETE', 
          headers: getAuthHeaders() 
        }); 
        
        if (res.ok) { 
          showToast("Ficha excluída com sucesso!", "success"); 
          fetchAllCharacters(); 
          if (activeCharId === id) handleCreateNewCharacter(); 
          if (connection && currentCampaignId) {
             connection.invoke("RefreshCharacters", currentCampaignId.toString()).catch(console.error);
          }
        } else {
          showToast("Erro: Apenas o Mestre ou o dono da ficha podem apagá-la.", "error");
        }
      } catch (error) { 
        showToast("Erro de conexão ao tentar apagar a ficha.", "error");
      } 
    } 
  };
  
  const handleCreateNewCharacter = () => { setActiveCharId(null); setCharName(""); setCharOrigin(""); setCharRace(""); setCharClass(""); setCharAge(0); setCharLevel(1); setCharDeity("Nenhum"); setMut1("Carne Intacta"); setMut2("Carne Intacta"); setMut3("Carne Intacta"); setAttrInt(0); setAttrPre(0); setAttrAgi(0); setAttrVig(0); setAttrFor(0); setAttrIns(0); setHp(10); setMaxHp(10); setPe(0); setMaxPe(0); setCorruption(0); setLascas(0); setSkillsList(prev => prev.map(s => ({ ...s, trainingLevel: 0, others: 0 }))); setInventoryList([]); setAttacksList([]); setAbilitiesList([]); setNotes([]); setCurrentPage('ficha'); };

  const executeRoll = (type, title, bonus, weapon = null, customExp = null) => { 
    if (type === 'custom' && customExp) {
      const exp = customExp.toLowerCase().replace(/\s+/g, ''); 
      const regex = /^(\d*)d(\d+)([+-]\d+)?$/;
      const match = exp.match(regex);

      if (!match) {
        showToast("Formato inválido! Tente algo como: d20, 2d6 ou 1d10+4", "error");
        return;
      }

      const numDice = match[1] ? parseInt(match[1], 10) : 1; 
      const sides = parseInt(match[2], 10);
      const modifier = match[3] ? parseInt(match[3], 10) : 0;

      if (numDice <= 0 || sides <= 0) return showToast("Dado inválido!", "error");
      if (numDice > 50) return showToast("Acalme-se! Máximo de 50 dados por vez.", "error");

      setRollModal({ show: true, title: `Rolagem: ${customExp}`, type: 'custom', bonus: modifier, d20: 0, total: 0, isRolling: true, isCrit: false, isFumble: false, weapon: null, detail: "" });

      setTimeout(() => {
        let rolls = [];
        let sum = 0;
        for (let i = 0; i < numDice; i++) {
          const r = Math.floor(Math.random() * sides) + 1;
          rolls.push(r);
          sum += r;
        }
        const total = sum + modifier;
        const modText = modifier > 0 ? `+${modifier}` : modifier < 0 ? `${modifier}` : "";
        const detailText = `Dados: [ ${rolls.join(', ')} ] ${modText}`;

        let newChatMsg = { id: Date.now(), sender: isMasterMode && secretRoll ? "Mestre" : (charName || loggedUserName), type: isMasterMode && secretRoll ? "secret" : "roll", text: "" };
        newChatMsg.text = `🎲 **Rolagem Avulsa (${customExp})**\nResultado: **${total}**\n${detailText}`;
        
        if (isMasterMode && secretRoll) newChatMsg.text = `[Rolagem Oculta]\n${newChatMsg.text}`;

        setChatMessages(prev => [...prev, newChatMsg]);
        if (connection && !(isMasterMode && secretRoll) && currentCampaignId) {
          connection.invoke("SendChatMessage", currentCampaignId.toString(), JSON.stringify(newChatMsg)).catch(console.error);
        }

        setRollModal(prev => ({ ...prev, isRolling: false, total: total, detail: detailText }));
      }, 200);
      return;
    }

    if (type === 'attack' && weapon && weapon.isRanged) {
      if ((weapon.ammo || 0) <= 0) {
        showToast(`Arma descarregada! Sem munição para ${weapon.name}.`, "error");
        return; 
      }
      setAttacksList(prev => prev.map(w => w.name === weapon.name ? { ...w, ammo: w.ammo - 1 } : w));
    }

    setRollModal({ show: true, title, type, bonus, d20: 0, total: 0, isRolling: true, isCrit: false, isFumble: false, weapon, detail: "" }); 
    
    setTimeout(() => { 
      let newChatMsg = { id: Date.now(), sender: isMasterMode && secretRoll ? "Mestre" : (charName || loggedUserName), type: isMasterMode && secretRoll ? "secret" : "roll", text: "" }; 
      
      if (type === 'damage') { 
        const isCrit = bonus?.isCrit || false; 
        const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier); 
        const detailText = `Dados rolados: [${res.log}]` + (isCrit ? "\n💥 DANO CRÍTICO!" : ""); 
        setRollModal(prev => ({ ...prev, isRolling: false, total: res.total, detail: detailText, isCrit })); 
        newChatMsg.text = `Rolou Dano (${weapon.name}): ${res.total}\nDetalhes: [${res.log}]`; 
        if(isCrit) newChatMsg.text += "\n💥 DANO CRÍTICO!"; 
      } 
      else if (type === 'sincronia') { 
        const d20 = Math.floor(Math.random() * 20) + 1; 
        const total = d20 + Number(bonus); 
        const dtSincronia = 20 + Number(corruption || 0); 
        let detailText = `Dado de Sincronia: [ ${d20} ] + Bônus: ${bonus}\nTotal: ${total} vs DT ${dtSincronia} (20 base + ${corruption} Corrupção)\n\n`; 
        if (total >= dtSincronia) { 
          detailText += "✨ SUCESSO! A magia flui com segurança."; 
          newChatMsg.text = `🔮 **Teste de Sincronia**\nResultado: **${total}** (DT ${dtSincronia})\n✨ SUCESSO! A magia flui com segurança.`; 
        } else { 
          const danoCorrupcao = Math.floor(Math.random() * 4) + 1; 
          setCorruption(prev => Math.min(prev + danoCorrupcao, maxCorruption || 40)); 
          detailText += `💀 VOCÊ FALHOU!\n(+${danoCorrupcao} de Corrupção)`; 
          newChatMsg.text = `🔮 **Teste de Sincronia**\nResultado: **${total}** (DT ${dtSincronia})\n💀 **VOCÊ FALHOU!**\nSofreu +${danoCorrupcao} de Corrupção!`; 
        } 
        setRollModal(prev => ({ ...prev, isRolling: false, d20, total, detail: detailText, isCombined: false })); 
      } 
      else { 
        const d20 = Math.floor(Math.random() * 20) + 1; 
        const total = d20 + Number(bonus); 
        let isCrit = d20 === 20; 
        let isFumble = d20 === 1; 
        let damageBreakdown = ""; 
        let damageTotal = 0; 
        newChatMsg.text = `${title}: ${total} (Dado: ${d20})`; 
        let detailText = `Dado de Ataque: [ ${d20} ] + Bônus: ${bonus}`; 
        
        if (type === 'attack' && weapon) { 
          const critMargin = parseInt(weapon.critMargin) || 20; 
          if (d20 >= critMargin) isCrit = true; 
          const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier); 
          damageBreakdown = res.log; 
          damageTotal = res.total; 
          if(isCrit) { 
            newChatMsg.text += `\n🎉 Acerto Crítico!\n🩸 Dano: ${res.total} [${res.log}]`; 
            detailText = `🎉 ACERTO CRÍTICO!\n` + detailText + `\n\n🩸 Dados de Dano: [${res.log}]`; 
          } else if(isFumble) { 
            newChatMsg.text += `\n💀 Falha Crítica!`; 
            detailText = `💀 FALHA CRÍTICA!\n` + detailText; 
          } else { 
            newChatMsg.text += `\n🩸 Dano gerado: ${res.total} [${res.log}]`; 
            detailText = detailText + `\n\n🩸 Dados de Dano: [${res.log}]`; 
          } 
        } else { 
          if(isCrit) detailText = `🎉 Glória! (Acerto Crítico)\n` + detailText; 
          if(isFumble) detailText = `💀 Desastre! (Falha Crítica)\n` + detailText; 
        } 
        setRollModal(prev => ({ ...prev, isRolling: false, d20, total, isCrit, isFumble, detail: detailText, isCombined: (type === 'attack' && weapon !== null), attackTotal: total, damageTotal: damageTotal })); 
      } 
      
      if (isMasterMode && secretRoll) newChatMsg.text = `[Rolagem Oculta]\n${newChatMsg.text}`; 
      setChatMessages(prev => [...prev, newChatMsg]); 
      
      if (connection && !(isMasterMode && secretRoll) && currentCampaignId) { 
        connection.invoke("SendChatMessage", currentCampaignId.toString(), JSON.stringify(newChatMsg)).catch(console.error); 
      } 
    }, 1000); 
  };
  
 const handleBuyItem = async (item, index, targetCharId = "active") => { 
  const qty = buyQuantities[index] || 1; 
  const totalCost = item.price * qty; 
  
  let charIdToUpdate = null;

  if (targetCharId === "active" || (activeCharId && Number(targetCharId) === activeCharId)) {
    charIdToUpdate = activeCharId; 
  } else {
    charIdToUpdate = Number(targetCharId); 
  }

  if (!charIdToUpdate) {
     showToast("Selecione um personagem para comprar!", "error");
     return;
  }

  try {
    const res = await fetch(`https://korzel-api.onrender.com/api/characters/${charIdToUpdate}`, { headers: getAuthHeaders() });
    
    if (res.ok) {
      const charData = await res.json();
      const currentLascas = charData.lascas || 0;

      if (currentLascas >= totalCost) {
        charData.lascas = currentLascas - totalCost; 
        charData.inventory = charData.inventory || [];

        const existingItem = charData.inventory.find(i => i.name === item.name);
        if (existingItem) {
          existingItem.quantity += qty;
        } else {
          charData.inventory.push({ 
            name: item.name, 
            description: item.desc || item.description || "", 
            quantity: qty, 
            weight: item.weight || 0.1, 
            isEquipped: false, 
            itemType: "Consumível", 
            armorBonus: 0, 
            armorPenalty: 0 
          });
        }

        const updateRes = await fetch(`https://korzel-api.onrender.com/api/characters/${charIdToUpdate}`, { 
          method: 'PUT', 
          headers: getAuthHeaders(), 
          body: JSON.stringify(charData) 
        });

        if (updateRes.ok) {
          showToast(`🪙 ${qty}x ${item.name} guardado na mochila de ${charData.name}!`, "success");
          setBuyQuantities(prev => ({...prev, [index]: 1}));

          if (activeCharId === charIdToUpdate) {
            setLascas(charData.lascas); 
            
            setInventoryList(prev => {
                const existingIndex = prev.findIndex(i => i.name === item.name);
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex].quantity += qty;
                    return updated;
                }
                return [...prev, { name: item.name, description: item.desc || item.description || "", quantity: qty, weight: item.weight || 0.1, isEquipped: false, itemType: "Consumível" }];
            });
          }
          if (connection && currentCampaignId) connection.invoke("RefreshCharacters", currentCampaignId.toString()).catch(console.error);
        } else {
          showToast(`Erro ao salvar a compra de ${charData.name}.`, "error");
        }
      } else {
        showToast(`🪙 ${charData.name} tem apenas ${currentLascas} Lascas (Faltam ${totalCost - currentLascas}).`, "error");
      }
    }
  } catch (e) {
    showToast("Erro ao contatar o mercador.", "error");
  }
};

  const updateBuyQty = (index, delta) => { setBuyQuantities(prev => { const current = prev[index] || 1; return { ...prev, [index]: Math.max(1, current + delta) }; }); };
  const handleOpenNewCatalogItem = () => { setCatalogForm({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" }); setEditingCatalogIndex(null); setShowCatalogForm(true); };

  const handleEditCatalogItem = (index) => { 
    setCatalogForm(catalog[index]); 
    setEditingCatalogIndex(index); 
    setShowCatalogForm(true); 
  };

  const handleDeleteCatalogItem = (index) => { 
    if (window.confirm("Remover da Loja?")) {
      const updatedCatalog = catalog.filter((_, i) => i !== index);
      setCatalog(updatedCatalog); 
      
      if (connection && currentCampaignId) {
        connection.invoke("UpdateCatalog", currentCampaignId.toString(), JSON.stringify(updatedCatalog))
          .catch(console.error);
      }
    }
  };

  const handleSaveCatalogItem = () => { 
    if (!catalogForm.name) return alert("Precisa de nome!"); 
    
    let updatedCatalog;
    if (editingCatalogIndex !== null) { 
      updatedCatalog = [...catalog]; 
      updatedCatalog[editingCatalogIndex] = catalogForm; 
    } else { 
      updatedCatalog = [...catalog, catalogForm]; 
    }
    
    setCatalog(updatedCatalog);
    setShowCatalogForm(false); 
    setEditingCatalogIndex(null);
    setCatalogForm({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" });

    if (connection && currentCampaignId) {
      connection.invoke("UpdateCatalog", currentCampaignId.toString(), JSON.stringify(updatedCatalog))
        .catch(console.error);
    }
  };

  const handleDeityChange = (newDeity) => { setCharDeity(newDeity); const filteredAbilities = abilitiesList.filter(ability => ability.type !== "Dádiva Divina"); if (newDeity !== "Nenhum" && panteaoKorzel[newDeity]) { const deityPowers = panteaoKorzel[newDeity].poderes.map(poder => ({ title: poder.title, type: "Dádiva Divina", cost: poder.cost, description: poder.desc })); setAbilitiesList([...filteredAbilities, ...deityPowers]); showToast(`As Dádivas de ${newDeity} forjadas!`, "success"); } else { setAbilitiesList(filteredAbilities); } };
  const handleOpenNewWeapon = () => { setWeaponForm({ name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta" }); setEditingWeaponIndex(null); setShowWeaponForm(true); };
  const handleEditWeapon = (index) => { setWeaponForm(attacksList[index]); setEditingWeaponIndex(index); setShowWeaponForm(true); };
  const handleDeleteWeapon = (index) => { if(window.confirm("Deseja excluir?")) setAttacksList(attacksList.filter((_, i) => i !== index)); };
  const handleSaveWeapon = () => { if(!weaponForm.name || !weaponForm.damage) return alert("Nome e Dano!"); if (editingWeaponIndex !== null) { const updated = [...attacksList]; updated[editingWeaponIndex] = weaponForm; setAttacksList(updated); } else { setAttacksList([...attacksList, weaponForm]); } setShowWeaponForm(false); };
  const handleOpenNewAbility = () => { setAbilityForm({ title: "", type: "Dádiva Divina", cost: "1 PV", description: "" }); setEditingAbilityIndex(null); setShowAbilityForm(true); };
  const handleEditAbility = (index) => { setAbilityForm(abilitiesList[index]); setEditingAbilityIndex(index); setShowAbilityForm(true); };
  const handleDeleteAbility = (index) => { if(window.confirm("Esquecer habilidade?")) setAbilitiesList(abilitiesList.filter((_, i) => i !== index)); };
  const handleSaveAbility = () => { if(!abilityForm.title || !abilityForm.description) return alert("Nome e Descrição!"); if (editingAbilityIndex !== null) { const updated = [...abilitiesList]; updated[editingAbilityIndex] = abilityForm; setAbilitiesList(updated); } else { setAbilitiesList([...abilitiesList, abilityForm]); } setShowAbilityForm(false); };
  const handleOpenNewItem = () => { setItemForm(initialItemState); setEditingItemIndex(null); setShowItemForm(true); };
  const handleEditItem = (index) => { setItemForm(inventoryList[index]); setEditingItemIndex(index); setShowItemForm(true); };
  const handleDeleteItem = (index) => { if(window.confirm("Jogar fora?")) setInventoryList(inventoryList.filter((_, i) => i !== index)); };
  const handleSaveItem = () => { if(!itemForm.name) return alert("Nome!"); if (editingItemIndex !== null) { const updated = [...inventoryList]; updated[editingItemIndex] = itemForm; setInventoryList(updated); } else { setInventoryList([...inventoryList, itemForm]); } setShowItemForm(false); };
  const handleAddNote = () => { const newId = Date.now(); setNotes([...notes, { id: newId, title: "Página em Branco", content: "" }]); setActiveNoteId(newId); };
  const handleDeleteNote = (id) => { if(window.confirm("Arrancar página?")) { const newNotes = notes.filter(n => n.id !== id); setNotes(newNotes); if(activeNoteId === id) setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null); } };
  const handleNoteChange = (field, value) => { setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [field]: value } : n)); };
  
 const handleChatSubmit = (e) => { 
    e.preventDefault(); 
    if(!chatInput.trim()) return; 

    if (chatInput.trim().startsWith('/r ')) { 
      const rollExp = chatInput.replace('/r ', '').trim(); 
      executeRoll('custom', '', 0, null, rollExp);
      setChatInput(""); 
      return;
    } 

    let newMessage = { id: Date.now(), sender: isMasterMode ? "Mestre" : (charName || loggedUserName), text: chatInput, type: "msg" }; 
    if (secretRoll && isMasterMode) { newMessage.text = `[Oculto]\n${newMessage.text}`; newMessage.type = "secret"; } 
    
    setChatMessages([...chatMessages, newMessage]); 
    setChatInput(""); 
    
    if (connection && currentCampaignId) { 
      connection.invoke("SendChatMessage", currentCampaignId.toString(), JSON.stringify(newMessage)).catch(console.error); 
    } 
  };
  
 const handleMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          
          const MAX_SIZE = 1024; 
          let width = img.width;
          let height = img.height;
          
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
          else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const base64Image = canvas.toDataURL("image/webp", 0.6);
          
          setScenes(prev => prev.map(s => s.id === gmActiveSceneId ? {...s, bgImage: base64Image} : s));
          
          try {
            const res = await fetch(`https://korzel-api.onrender.com/api/scenes/${gmActiveSceneId}/background`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bgImage: base64Image })
            });
            
            if (res.ok) { 
              showToast("🗺️ Mapa salvo com sucesso!", "success"); 
              
              if (connection && currentCampaignId) {
                const payload = JSON.stringify({ sceneId: gmActiveSceneId, bgImage: base64Image });
                connection.invoke("ChangeMap", currentCampaignId.toString(), payload).catch(console.error);
              }
            } 
            else { showToast(`A API bloqueou o mapa (Erro ${res.status}).`, "error"); }
          } catch (err) { console.error("Erro ao salvar background:", err); }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewScene = async () =>
  { 
    const newScene = { campaignId: currentCampaignId, name: `Nova Cena ${scenes.length + 1}`, bgImage: "", isActive: false };
    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/scenes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newScene) });
      if (res.ok) {
        const dbScene = await res.json();
        setScenes([...scenes, dbScene]); 
        setGmActiveSceneId(dbScene.id);
        
        showToast("Nova cena forjada!", "success");

        if (connection && currentCampaignId) {
            connection.invoke("AddScene", currentCampaignId.toString(), JSON.stringify(dbScene)).catch(console.error);
        }
      }
    } catch(e) { console.error("Erro criar cena", e); }
  };

  const handleTokenImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 800; 
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) { 
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
          } else { 
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } 
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/webp", 0.9);
          setTokenForm({ ...tokenForm, image: compressedBase64 });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateToken = () => { if (!tokenForm.name) return alert("O token precisa de um nome!"); const newLibToken = { id: Date.now(), name: tokenForm.name, isNpc: tokenForm.isNpc, image: tokenForm.image }; setTokenLibrary([...tokenLibrary, newLibToken]); setShowTokenForm(false); setTokenForm({ name: '', isNpc: true, image: null }); showToast("Token salvo!", "success"); };
  const updateTokenSize = (id, newSize) => { setSceneTokens(prev => prev.map(t => t.id === id ? { ...t, size: Number(newSize) } : t)); if (connection && currentCampaignId) { connection.invoke("UpdateTokenSize", currentCampaignId.toString(), id.toString(), Number(newSize)).catch(console.error); } };
  const handleDeleteTokenFromScene = async (tokenId) => {
    setSceneTokens(prev => prev.filter(t => t.id !== tokenId));
    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/scenes/tokens/${tokenId}`, { method: 'DELETE' });
      if (res.ok) { 
          showToast("Peça removida da mesa.", "success"); 
          
          if (connection && currentCampaignId) {
              connection.invoke("RemoveToken", currentCampaignId.toString(), tokenId.toString()).catch(console.error);
          }
      }
    } catch(e) { console.error("Erro ao deletar token:", e); }
  };

  const handleDeleteTokenFromLibrary = (libraryId) => {
    if(window.confirm("Deseja excluir esta arte da sua biblioteca?")) {
      setTokenLibrary(prev => prev.filter(t => t.id !== libraryId));
    }
  };
  
  const handleDragStartFromLibrary = (e, libToken) => {
    e.dataTransfer.setData("text/plain", libToken.id.toString());
  };

  const handleDropOnMap = async (e) => {
    e.preventDefault();
    try {
      const tokenLibraryId = e.dataTransfer.getData("text/plain");
      if (!tokenLibraryId) return;

      const libToken = tokenLibrary.find(t => t.id.toString() === tokenLibraryId);
      if (!libToken || !mapRef.current) {
         showToast("Erro: Peça não encontrada na biblioteca.", "error");
         return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      const dropX = (e.clientX - rect.left - mapOffset.x) / mapScale - (80 / 2);
      const dropY = (e.clientY - rect.top - mapOffset.y) / mapScale - (80 / 2);

      const newTokenInScene = {
        sceneId: gmActiveSceneId,
        inScene: true,
        name: libToken.name,
        isNpc: libToken.isNpc,
        x: dropX,
        y: dropY,
        size: 80,
        zIndex: 10,
        image: libToken.image 
      };

      const res = await fetch("https://korzel-api.onrender.com/api/scenes/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTokenInScene)
      });

      if (res.ok) {
        const tokenSalvoNoBanco = await res.json();
        setSceneTokens(prev => [...prev, tokenSalvoNoBanco]);
        if (connection && currentCampaignId) {
          connection.invoke("AddToken", currentCampaignId.toString(), JSON.stringify(tokenSalvoNoBanco)).catch(console.error);
        }
        showToast("Token inserido na mesa!", "success"); 
      } else {
        showToast(`API recusou o Token (Erro ${res.status})`, "error");
      }
    } catch(err) { 
      console.error("Erro no Drop:", err); 
      showToast("Falha interna ao soltar o Token", "error");
    }
  };

  const handleMapWheel = (e) => { if (!mapRef.current) return; const rect = mapRef.current.getBoundingClientRect(); const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top; const zoomFactor = -Math.sign(e.deltaY) * 0.1; const newScale = Math.max(0.2, Math.min(3, mapScale + zoomFactor)); if (newScale !== mapScale) { const mapX = (mouseX - mapOffset.x) / mapScale; const mapY = (mouseY - mapOffset.y) / mapScale; const newOffsetX = mouseX - (mapX * newScale); const newOffsetY = mouseY - (mapY * newScale); setMapScale(newScale); setMapOffset({ x: newOffsetX, y: newOffsetY }); } };
  
  const handleMapMouseDown = (e) => { 
    if(tokenContextMenu.show) setTokenContextMenu({ ...tokenContextMenu, show: false }); 
    setIsDraggingMap(true); 
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y }); 
  };
  
  const handleMapMouseMove = (e) => { if (draggingToken !== null && mapRef.current) { const rect = mapRef.current.getBoundingClientRect(); const token = sceneTokens.find(t => t.id === draggingToken); const tokenSize = token ? token.size : 80; const x = (e.clientX - rect.left - mapOffset.x) / mapScale - (tokenSize / 2); const y = (e.clientY - rect.top - mapOffset.y) / mapScale - (tokenSize / 2); setSceneTokens(prev => prev.map(t => t.id === draggingToken ? { ...t, x, y } : t)); } else if (isDraggingMap) { setMapOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } };
  
  const handleMapMouseUp = async () => {
    const currentTokenId = draggingToken;
    
    setDraggingToken(null);
    setIsDraggingMap(false);

    if (currentTokenId !== null) {
      const token = sceneTokens.find(t => t.id === currentTokenId);
      if (token && currentCampaignId) {
        if (connection) { 
            connection.invoke("MoveToken", currentCampaignId.toString(), token.id.toString(), token.x, token.y).catch(console.error); 
        }
        
        try {
          await fetch(`https://korzel-api.onrender.com/api/scenes/tokens/${token.id}`, { 
              method: "PUT", 
              headers: { "Content-Type": "application/json" }, 
              body: JSON.stringify(token) 
          });
        } catch (e) {
            console.error("Erro ao salvar a posição da peça no banco", e);
        }
      }
    }
  };

  const bringToFront = () => { const maxZ = Math.max(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: maxZ + 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const sendToBack = () => { const minZ = Math.min(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: minZ - 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  
  const assignPermission = async () => { 
    const playerName = window.prompt("Nome de usuário do jogador (deixe em branco para remover o controle):"); 
    
    if (playerName !== null) { 
      const tokenId = tokenContextMenu.tokenId;
      const targetName = playerName.trim() === "" ? null : playerName.trim();
      
      setSceneTokens(prev => prev.map(t => t.id === tokenId ? { ...t, controlledBy: targetName } : t)); 
      setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); 
      showToast(targetName ? `Controle concedido a: ${targetName}` : "Controle removido.", "success");
      
      const tokenToUpdate = sceneTokens.find(t => t.id === tokenId);
      if (tokenToUpdate) {
        const updatedToken = { ...tokenToUpdate, controlledBy: targetName };
        try { 
          await fetch(`https://korzel-api.onrender.com/api/scenes/tokens/${tokenId}`, { 
            method: "PUT", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(updatedToken) 
          }); 
        } catch (e) { console.error("Erro ao salvar permissão", e); }
      }
      
      if (connection && currentCampaignId) { 
        connection.invoke("UpdateTokenPermission", currentCampaignId.toString(), tokenId.toString(), targetName).catch(console.error); 
      } 
    } else {
      setTokenContextMenu({ ...tokenContextMenu, show: false });
    }
  };

  const toggleTokenStatus = async (statusName) => { 
    if (!tokenContextMenu.tokenId) return; 

    let tokenAtualizado = null;

    setSceneTokens(prev => prev.map(t => { 
      if (t.id === tokenContextMenu.tokenId) { 
        const currentStatuses = t.statuses || []; 
        const newStatuses = currentStatuses.includes(statusName) 
          ? currentStatuses.filter(s => s !== statusName) 
          : [...currentStatuses, statusName]; 
        
        tokenAtualizado = { ...t, statuses: newStatuses };
        return tokenAtualizado; 
      } 
      return t; 
    })); 
    
    setTokenContextMenu({ ...tokenContextMenu, show: false }); 

    if (tokenAtualizado) {
      try {
        await fetch(`https://korzel-api.onrender.com/api/scenes/tokens/${tokenAtualizado.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokenAtualizado)
        });

        if (connection && currentCampaignId) { 
          connection.invoke("UpdateToken", currentCampaignId.toString(), JSON.stringify(tokenAtualizado)).catch(console.error); 
        }
      } catch (e) {
        console.error("Erro ao salvar o status da peça:", e);
      }
    }
  };

 const handleAddAudioLink = async () => {
    const url = window.prompt("IMPORTANTE: Insira o link direto de um arquivo de áudio (precisa terminar em .mp3, .wav, etc). Links de vídeo do YouTube não funcionam.\n\nLink do áudio:");
    if (!url) return;
    const name = window.prompt("Nome da música:");
    if (!name) return;

    const newTrack = {
      campaignId: currentCampaignId,
      name: name,
      category: targetAudioCat,
      base64Data: url // Guardando a URL no lugar do arquivo
    };

    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/audio`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newTrack)
      });
      if (res.ok) {
        const savedTrack = await res.json();
        setAudioCategories(prev => prev.map(cat =>
          cat.id === targetAudioCat
            ? { ...cat, tracks: [...cat.tracks, { id: savedTrack.id, name: savedTrack.name, url: savedTrack.base64Data }] }
            : cat
        ));
        showToast("🎵 Link de música fixado!", "success");
      }
    } catch (err) { showToast("Falha na conexão.", "error"); }
  };

  const handleDeleteAudioTrack = async (trackId, catId) => {
    if (!window.confirm("Deseja banir esta música da sua campanha para sempre?")) return;

    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/audio/${trackId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.ok) {
        showToast("Música removida com sucesso!", "success");
        setAudioCategories(prev => prev.map(cat => 
          cat.id === catId 
            ? { ...cat, tracks: cat.tracks.filter(t => t.id !== trackId) } 
            : cat
        ));
        
        if (activeAudioId === trackId) {
          setIsPlaying(false);
          setActiveAudioId(null);
          if (connection && currentCampaignId) connection.invoke("StopMusic", currentCampaignId.toString()).catch(console.error);
        }
      } else {
        showToast("Erro ao remover a música do banco.", "error");
      }
    } catch (err) {
      console.error("Erro deletar áudio:", err);
    }
  };

 const togglePlayAudio = (trackId) => { 
    if (activeAudioId === trackId && isPlaying) { 
      setIsPlaying(false); 
      if (connection && currentCampaignId) connection.invoke("StopMusic", currentCampaignId.toString()).catch(console.error);
    } else { 
      setActiveAudioId(trackId); 
      setIsPlaying(true); 
      if (connection && currentCampaignId) connection.invoke("PlayMusic", currentCampaignId.toString(), trackId).catch(console.error);
    } 
  };

 const handleAddAbilityToSheet = async (power, targetCharId) => { 
    const newAbility = { title: power.title, type: power.type, cost: power.cost, description: power.description || power.poder || "" }; 
    
    let charIdToUpdate = null;

    if (targetCharId === "active" || (activeCharId && Number(targetCharId) === activeCharId)) {
      charIdToUpdate = activeCharId;
    } else {
      charIdToUpdate = Number(targetCharId);
    }

    if (!charIdToUpdate) {
       showToast("Crie ou selecione um personagem primeiro!", "error");
       return;
    }

    try {
      const res = await fetch(`https://korzel-api.onrender.com/api/characters/${charIdToUpdate}`, { headers: getAuthHeaders() });
      
      if (res.ok) {
        const charData = await res.json();
        charData.abilities = charData.abilities || [];
        charData.abilities.push(newAbility);

        const updateRes = await fetch(`https://korzel-api.onrender.com/api/characters/${charIdToUpdate}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(charData)
        });

        if (updateRes.ok) {
           showToast(`Poder [${newAbility.title}] forjado na ficha de ${charData.name}!`, "success");
           
           if (activeCharId === charIdToUpdate) {
             setAbilitiesList(prev => [...prev, newAbility]);
           }
           
           if (connection && currentCampaignId) {
             connection.invoke("RefreshCharacters", currentCampaignId.toString()).catch(console.error);
           }
        } else {
           showToast(`Erro ao forjar poder na ficha de ${charData.name}.`, "error");
        }
      }
    } catch(e) {
       showToast("Erro de conexão ao forjar poder.", "error");
    }
  };

  // ==========================================
  // 4. USE EFFECTS (EFEITOS E SIGNALR)
  // ==========================================
  useEffect(() => { localStorage.setItem('korzel_catalog', JSON.stringify(catalog)); }, [catalog]);
  useEffect(() => { localStorage.setItem('korzel_token_library', JSON.stringify(tokenLibrary)); }, [tokenLibrary]);
  
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (audioRef.current) audioRef.current.loop = isLooping; }, [isLooping]);
  useEffect(() => { if (audioRef.current) { if (isPlaying && activeAudioId) audioRef.current.play().catch(e => console.log("Erro áudio", e)); else audioRef.current.pause(); } }, [isPlaying, activeAudioId]);
  
  useEffect(() => { 
    if (authToken) fetchAllCharacters(); 
  }, [authToken, currentCampaignId, refreshTrigger]);

  useEffect(() => {
    // Forçando WebSockets para comunicação em tempo real sem delay HTTP
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://korzel-api.onrender.com/vtthub", {
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, []);
  useEffect(() => {
    if (connection && currentCampaignId && loggedUserName) {
      connection.invoke("JoinSession", currentCampaignId.toString(), loggedUserName)
        .catch(console.error);
    }
  }, [loggedUserName, connection, currentCampaignId]);

 // 1. LIGA A ANTENA E REGISTRA OS OUVINTES (Roda só 1 vez)
  useEffect(() => {
    if (!connection) return;

    connection.start().then(() => {
      console.log("⚡ Conectado ao servidor de Korzel!");
    }).catch(console.error);

    connection.on("OnCharactersRefreshed", () => setRefreshTrigger(prev => prev + 1));
    connection.on("TokenAdded", (tokenJson) => setSceneTokens(prev => [...prev, JSON.parse(tokenJson)]));
    connection.on("TokenMoved", (tokenId, x, y) => setSceneTokens(prev => prev.map(t => String(t.id) === String(tokenId) ? { ...t, x, y } : t)));
    connection.on("TokenPermissionChanged", (tokenId, playerName) => setSceneTokens(prev => prev.map(t => String(t.id) === String(tokenId) ? { ...t, controlledBy: playerName } : t)));
    connection.on("TokenRemoved", (tokenId) => setSceneTokens(prev => prev.filter(t => String(t.id) !== String(tokenId))));
    connection.on("TokenSizeChanged", (tokenId, newSize) => setSceneTokens(prev => prev.map(t => String(t.id) === String(tokenId) ? { ...t, size: newSize } : t)));
    
    connection.on("PlayersPulled", (syncJson) => { 
      try {
        const data = JSON.parse(syncJson);
        setPlayerActiveSceneId(data.sceneId);
        setScenes(prev => prev.map(s => String(s.id) === String(data.sceneId) ? { ...s, bgImage: data.bgImage } : s));
        setSceneTokens(prev => {
            const outrosTokens = prev.filter(t => String(t.sceneId) !== String(data.sceneId));
            return [...outrosTokens, ...data.tokens];
        });
      } catch(e) {}
    });

    connection.on("SceneAdded", (sceneJson) => setScenes(prev => [...prev, JSON.parse(sceneJson)]));
    connection.on("MapChanged", (payload) => { 
      try {
        const data = JSON.parse(payload);
        setScenes(prev => prev.map(s => String(s.id) === String(data.sceneId) ? { ...s, bgImage: data.bgImage } : s));
      } catch(e) {}
    });

    connection.on("ChatMessageReceived", (messageJson) => setChatMessages(prev => [...prev, JSON.parse(messageJson)]));
    connection.on("MusicStarted", (trackId) => { setActiveAudioId(trackId); setIsPlaying(true); });
    connection.on("MusicStopped", () => setIsPlaying(false));
    connection.on("UpdatePlayerList", (playerList) => setOnlinePlayers(playerList));
    connection.on("CatalogUpdated", (catalogJson) => setCatalog(JSON.parse(catalogJson)));
    connection.on("VolumeChanged", (newVolume) => {
        setVolume(newVolume);
    });
    
  }, [connection]); // 👈 A mágica: dependência apenas na conexão. Não recarrega nunca mais.

  // 2. ENTRA NA SALA QUANDO A CAMPANHA É SELECIONADA
  useEffect(() => {
    if (connection && currentCampaignId && loggedUserName) {
      const entrarNaSala = () => {
         connection.invoke("JoinSession", currentCampaignId.toString(), loggedUserName).catch(console.error);
      };
      
      if (connection.state === "Connected") {
         entrarNaSala();
      } else {
         connection.onreconnected(() => entrarNaSala());
      }
    }
  }, [connection, currentCampaignId, loggedUserName]);
  // ==========================================
  // 5. PROPS DO VTT
  // ==========================================
  const vttProps = {
    isMasterMode, currentCampaignId, charName, lascas, setLascas, sessionTab, setSessionTab, setCurrentPage, setSheetModalOpen, showToast,
    secretRoll, setSecretRoll, chatInput, setChatInput, chatMessages, setChatMessages, handleChatSubmit,
    scenes, setScenes, gmActiveSceneId, setGmActiveSceneId, playerActiveSceneId, setPlayerActiveSceneId,
    mapScale, setMapScale, mapOffset, setMapOffset, isDraggingMap, setIsDraggingMap, dragStart, setDragStart,
    draggingToken, setDraggingToken, tokenContextMenu, setTokenContextMenu, mapRef, fileInputRef,
    showTokenForm, setShowTokenForm, tokenForm, setTokenForm, tokenLibrary, setTokenLibrary, sceneTokens, setSceneTokens, tokenFileInputRef,
    fichaSearch, setFichaSearch, savedCharacters: campaignCharacters, audioCategories, setAudioCategories, activeAudioId, setActiveAudioId, isPlaying, setIsPlaying,
    isLooping, setIsLooping, volume, setVolume, targetAudioCat, setTargetAudioCat, audioFileInputRef,
    catalog, setCatalog, showCatalogForm, setShowCatalogForm, editingCatalogIndex, setEditingCatalogIndex, catalogForm, setCatalogForm, buyQuantities, setBuyQuantities,
    currentSceneObj, handleMapUpload, addNewScene, handleTokenImageUpload, handleCreateToken,onlinePlayers, setOnlinePlayers,
    updateTokenSize, handleDragStartFromLibrary, handleDropOnMap, handleMapWheel, handleMapMouseDown,
    bringToFront, sendToBack, assignPermission, toggleTokenStatus,togglePlayAudio, handleBuyItem, updateBuyQty, handleOpenNewCatalogItem,
    handleEditCatalogItem, handleDeleteCatalogItem, handleSaveCatalogItem, executeRoll, getSkillTotal,handleAddAudioLink,
    hp, setHp, maxHp, setMaxHp, pe, setPe, maxPe, setMaxPe, corruption, setCorruption, maxCorruption, setMaxCorruption,handleDeleteAudioTrack,
    attrInt, attrPre, attrAgi, attrVig, attrFor, attrIns,resistances, setResistances,oficioText, setOficioText, inventoryList, setInventoryList, attacksList, setAttacksList, abilitiesList, setAbilitiesList, notes, setNotes, activeNoteId, setActiveNoteId,
    skillsList, setSkillsList, campaignCharacters, loggedUserName, handleCreateNewCharacter, loadCharacterFromDb, handleDeleteCharacter, handleDeleteTokenFromScene, handleDeleteTokenFromLibrary
  };

  // ==========================================
  // 6. RENDERIZAÇÃO (JSX)
  // ==========================================
  if (!authToken) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center font-sans" style={{ colorScheme: 'dark' }}>
        <div className="bg-[#140c08] border border-red-900/50 p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-red-500 text-center tracking-widest uppercase">Korzel VTT</h1>
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {authMode === 'register' && (
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">Nome de Usuário</label>
                <input required type="text" value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white focus:border-red-900 outline-none" />
              </div>
            )}
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">Email</label>
              <input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white focus:border-red-900 outline-none" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">Senha</label>
              <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white focus:border-red-900 outline-none" />
            </div>
            <button type="submit" className="w-full bg-red-900 hover:bg-red-800 text-white font-bold uppercase tracking-widest py-3 rounded mt-2 transition-colors shadow-lg">
              {authMode === 'login' ? 'Entrar' : 'Forjar Conta'}
            </button>
          </form>
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-xs text-zinc-500 hover:text-red-400 transition-colors uppercase">
            {authMode === 'login' ? 'Não tem conta? Forjar nova' : 'Já tem conta? Entrar'}
          </button>
        </div>
        {toast.show && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 transition-all ${toast.type === 'error' ? 'bg-red-950/90 border-red-900 text-red-200' : 'bg-green-950/90 border-green-900 text-green-200'}`}>
            <span className="text-xl">{toast.type === 'error' ? '💀' : '🪙'}</span>
            <span className="font-bold tracking-widest uppercase text-xs">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] flex flex-col font-sans relative" style={{ colorScheme: 'dark' }} onMouseMove={handleMapMouseMove} onMouseUp={handleMapMouseUp} onMouseLeave={handleMapMouseUp}>
      <DiceRollerOverlay isRolling={rollModal.isRolling} result={rollModal.show && !rollModal.isRolling ? rollModal : null} onDismiss={() => setRollModal({ ...rollModal, show: false })} />
      <audio ref={audioRef} src={audioCategories.flatMap(c => c.tracks).find(t => t.id === activeAudioId)?.url} loop={isLooping} />

      {sheetModalOpen && currentPage === 'sessao' && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:p-8 animate-fade-in" onClick={() => setSheetModalOpen(false)}>
          <div className="bg-[#0a0a0a] w-full h-full max-h-[95vh] overflow-y-auto rounded-xl border-2 border-red-900/50 shadow-[0_0_50px_rgba(0,0,0,1)] relative custom-scrollbar flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-6 z-50 flex items-center gap-4">
              <button onClick={saveCharacterToDb} className="bg-red-900/80 hover:bg-red-700 text-white font-bold py-1 px-4 rounded border border-red-500 transition-colors text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(153,27,27,0.5)]">💾 Salvar Ficha</button>
              <button onClick={() => setSheetModalOpen(false)} className="text-zinc-500 hover:text-red-500 text-2xl transition-colors">✖</button>
            </div>
           <CharacterSheet charName={charName} setCharName={setCharName} charOrigin={charOrigin} setCharOrigin={setCharOrigin} charRace={charRace} setCharRace={setCharRace} charClass={charClass} setCharClass={setCharClass} charAge={charAge} setCharAge={setCharAge} charLevel={charLevel} setCharLevel={setCharLevel} attrInt={attrInt} setAttrInt={setAttrInt} attrPre={attrPre} setAttrPre={setAttrPre} attrAgi={attrAgi} setAttrAgi={setAttrAgi} attrVig={attrVig} setAttrVig={setAttrVig} attrFor={attrFor} setAttrFor={setAttrFor} attrIns={attrIns} setAttrIns={setAttrIns} hp={hp} setHp={setHp} maxHp={maxHp} setMaxHp={setMaxHp} pe={pe} setPe={setPe} maxPe={maxPe} setMaxPe={setMaxPe} corruption={corruption} setCorruption={setCorruption} maxCorruption={maxCorruption} setMaxCorruption={setMaxCorruption} lascas={lascas} setLascas={setLascas} currentWeight={currentWeight} maxWeight={maxWeight} skillsList={skillsList} setSkillsList={setSkillsList} executeRoll={executeRoll} getSkillTotal={getSkillTotal} resistances={resistances} setResistances={setResistances} oficioText={oficioText} setOficioText={setOficioText} activeFichaTab={activeFichaTab} setActiveFichaTab={setActiveFichaTab} showWeaponForm={showWeaponForm} setShowWeaponForm={setShowWeaponForm} editingWeaponIndex={editingWeaponIndex} weaponForm={weaponForm} setWeaponForm={setWeaponForm} attacksList={attacksList} handleOpenNewWeapon={handleOpenNewWeapon} handleEditWeapon={handleEditWeapon} handleDeleteWeapon={handleDeleteWeapon} handleSaveWeapon={handleSaveWeapon} showAbilityForm={showAbilityForm} setShowAbilityForm={setShowAbilityForm} editingAbilityIndex={editingAbilityIndex} abilityForm={abilityForm} setAbilityForm={setAbilityForm} abilitiesList={abilitiesList} handleOpenNewAbility={handleOpenNewAbility} handleEditAbility={handleEditAbility} handleDeleteAbility={handleDeleteAbility} handleSaveAbility={handleSaveAbility} showItemForm={showItemForm} setShowItemForm={setShowItemForm} editingItemIndex={editingItemIndex} itemForm={itemForm} setItemForm={setItemForm} inventoryList={inventoryList} handleOpenNewItem={handleOpenNewItem} handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleSaveItem={handleSaveItem} charDeity={charDeity} handleDeityChange={handleDeityChange} mut1={mut1} setMut1={setMut1} mut2={mut2} setMut2={setMut2} mut3={mut3} setMut3={setMut3} notes={notes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote} handleNoteChange={handleNoteChange} activeNote={activeNote} connection={connection} setChatMessages={setChatMessages} showToast={showToast} />
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] border flex items-center gap-3 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-950/90 border-red-900 text-red-200' : 'bg-green-950/90 border-green-900 text-green-200'}`}>
          <span className="text-xl drop-shadow-md">{toast.type === 'error' ? '💀' : '🪙'}</span>
          <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">{toast.message}</span>
        </div>
      )}

     <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} loggedUserName={loggedUserName} handleLogout={handleLogout} isAdmin={isAdmin} />

      <main className="flex-1 w-full flex flex-col min-h-0">
       {currentPage === 'início' && (
          <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto w-full max-w-7xl mx-auto custom-scrollbar">
            <Lobby handleEnterSession={handleEnterSession} setCurrentPage={setCurrentPage} charName={charName} charClass={charClass} charLevel={charLevel} campaigns={campaigns} setCampaigns={setCampaigns} />
          </div>
        )}
        {currentPage === 'configuracoes' && (
          <div className="flex-1 overflow-y-auto animate-fade-in min-h-0">
             <Configuracoes 
               authToken={authToken} 
               setLoggedUserName={setLoggedUserName} 
               showToast={showToast} 
               setCurrentPage={setCurrentPage} 
             />
          </div>
        )}
        {currentPage === 'admin' && (
          <div className="flex-1 overflow-y-auto animate-fade-in min-h-0">
             <AdminPanel authToken={authToken} showToast={showToast} setCurrentPage={setCurrentPage} />
          </div>
        )}
        {currentPage === 'sessao' && <VttSession {...vttProps} connection={connection} />}
        {currentPage === 'compêndio' && (
          <div className="p-4 lg:p-8 flex-1 overflow-hidden animate-fade-in w-full max-w-7xl mx-auto min-h-0">
             <Compendio handleAddAbility={handleAddAbilityToSheet} savedCharacters={campaignCharacters} activeCharacterName={charName} />
          </div>
        )}
       <div className={currentPage === 'ficha' ? 'animate-fade-in flex-1 overflow-y-auto overflow-x-hidden w-full custom-scrollbar pb-10 relative' : 'hidden'}>
          <div className="w-full max-w-7xl mx-auto flex justify-end px-4 lg:px-8 mt-4 gap-4">
            <button onClick={saveCharacterToDb} className="bg-red-900/80 hover:bg-red-700 text-white font-bold py-2 px-6 rounded border border-red-500 transition-colors text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(153,27,27,0.5)]">💾 Salvar Ficha Completa</button>
            <button onClick={() => setCurrentPage('sessao')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold py-2 px-6 rounded border border-zinc-600 transition-colors text-sm uppercase tracking-widest">✖ Fechar e Voltar</button>
          </div>
          <CharacterSheet charName={charName} setCharName={setCharName} charOrigin={charOrigin} setCharOrigin={setCharOrigin} charRace={charRace} setCharRace={setCharRace} charClass={charClass} setCharClass={setCharClass} charAge={charAge} setCharAge={setCharAge} charLevel={charLevel} setCharLevel={setCharLevel} attrInt={attrInt} setAttrInt={setAttrInt} attrPre={attrPre} setAttrPre={setAttrPre} attrAgi={attrAgi} setAttrAgi={setAttrAgi} attrVig={attrVig} setAttrVig={setAttrVig} attrFor={attrFor} setAttrFor={setAttrFor} attrIns={attrIns} setAttrIns={setAttrIns} hp={hp} setHp={setHp} maxHp={maxHp} setMaxHp={setMaxHp} pe={pe} setPe={setPe} maxPe={maxPe} setMaxPe={setMaxPe} corruption={corruption} setCorruption={setCorruption} maxCorruption={maxCorruption} setMaxCorruption={setMaxCorruption} lascas={lascas} setLascas={setLascas} currentWeight={currentWeight} maxWeight={maxWeight} skillsList={skillsList} setSkillsList={setSkillsList} executeRoll={executeRoll} getSkillTotal={getSkillTotal} activeFichaTab={activeFichaTab} setActiveFichaTab={setActiveFichaTab} showWeaponForm={showWeaponForm} setShowWeaponForm={setShowWeaponForm} editingWeaponIndex={editingWeaponIndex} weaponForm={weaponForm} setWeaponForm={setWeaponForm} attacksList={attacksList} handleOpenNewWeapon={handleOpenNewWeapon} handleEditWeapon={handleEditWeapon} handleDeleteWeapon={handleDeleteWeapon} handleSaveWeapon={handleSaveWeapon} showAbilityForm={showAbilityForm} setShowAbilityForm={setShowAbilityForm} editingAbilityIndex={editingAbilityIndex} abilityForm={abilityForm} setAbilityForm={setAbilityForm} abilitiesList={abilitiesList} handleOpenNewAbility={handleOpenNewAbility} handleEditAbility={handleEditAbility} handleDeleteAbility={handleDeleteAbility} handleSaveAbility={handleSaveAbility} showItemForm={showItemForm} setShowItemForm={setShowItemForm} editingItemIndex={editingItemIndex} itemForm={itemForm} setItemForm={setItemForm} inventoryList={inventoryList} handleOpenNewItem={handleOpenNewItem} handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleSaveItem={handleSaveItem} charDeity={charDeity} handleDeityChange={handleDeityChange} mut1={mut1} setMut1={setMut1} mut2={mut2} setMut2={setMut2} mut3={mut3} setMut3={setMut3} notes={notes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote} handleNoteChange={handleNoteChange} activeNote={activeNote} connection={connection} setChatMessages={setChatMessages} showToast={showToast} resistances={resistances} setResistances={setResistances} oficioText={oficioText} setOficioText={setOficioText} />
        </div>
      </main>
    </div>
  );
}