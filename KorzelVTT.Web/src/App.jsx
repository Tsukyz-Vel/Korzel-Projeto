import { useState, useEffect, useRef } from 'react';
import mosasaurusSkull from './assets/mosasaurus-skull.png';
import d20Icon from './assets/d20-red.png';

// === IMPORTAÇÕES DOS COMPONENTES E DADOS ===
import { panteaoKorzel, mutacoesKorzel, initialLojaCatalog } from './data/korzelData';
import { parseAndRollDamage } from './utils/diceUtils';
import AttributeCircle from './components/AttributeCircle';
import SkillRow from './components/SkillRow';
import StatusBar from './components/StatusBar';
import WeaponCard from './components/WeaponCard';
import AbilityCard from './components/AbilityCard';
import ItemCard from './components/ItemCard';
import DefenseBlock from './components/DefenseBlock';
import DiceRollerOverlay from './components/DiceRollerOverlay';

const mapaBackground = "https://i.imgur.com/w8N4N3k.jpeg";

export default function App() {
  // ================= ESTADOS GLOBAIS DE NAVEGAÇÃO =================
  const [currentPage, setCurrentPage] = useState('início'); 
  const [isMasterMode, setIsMasterMode] = useState(false); 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // ================= ESTADOS DA FICHA DE PERSONAGEM =================
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
  const [inventoryList, setInventoryList] = useState([{ name: "Ração Básica", description: "Dura 1 semana sem estragar.", quantity: 5, weight: 0.5 }]);
  const [attacksList, setAttacksList] = useState([{ name: "Tridente de Guerra", damage: "1d8+4", critMargin: "20", critMultiplier: "x2", type: "Perfurante", skill: "Luta" }]);
  const [abilitiesList, setAbilitiesList] = useState([{ title: "Ataque Especial", type: "Habilidade de Classe", cost: "1 PE", description: "Quando você faz um ataque, pode gastar 1 PE para receber +4 no teste de ataque ou +1 dado de dano extra." }]);
  const [notes, setNotes] = useState([{ id: 1, title: "Registro 01: Sobrevivência", content: "O pântano cheira a enxofre hoje..." }]);
  
  // ESTADOS DE CONTROLE DA UI DA FICHA
  const [activeFichaTab, setActiveFichaTab] = useState('diário'); 
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

  // ================= ESTADOS DA LOJA E MERCADO =================
  const [catalog, setCatalog] = useState(initialLojaCatalog);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" });
  const [buyQuantities, setBuyQuantities] = useState({});

  // ================= ESTADOS DA SESSÃO VTT E MAPA =================
  const [sessionTab, setSessionTab] = useState('chat'); // chat, tokens, audio, fichas, loja
  const [secretRoll, setSecretRoll] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: "Sistema", text: "A névoa cobre as docas de Verantis. A sessão começou.", type: "info" }]);
  const [scenes, setScenes] = useState([{ id: 1, name: "Docas Sombrias", bgImage: null }, { id: 2, name: "Taverna do Sangue", bgImage: null }]);
  const [gmActiveSceneId, setGmActiveSceneId] = useState(1);
  const [playerActiveSceneId, setPlayerActiveSceneId] = useState(1);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tokenForm, setTokenForm] = useState({ name: '', isNpc: true, image: null });
  const tokenFileInputRef = useRef(null);
  const [tokenLibrary, setTokenLibrary] = useState([{ id: 99, name: "Kael (Jogador)", isNpc: false, image: null }, { id: 98, name: "Cultista", isNpc: true, image: null }]);
  const [sceneTokens, setSceneTokens] = useState([]);
  const [fichaSearch, setFichaSearch] = useState('');
  const savedCharacters = [{ id: 1, name: "Kael, o Quebra-Marés", race: "Korgath", class: "Guerreiro", level: 1 }, { id: 2, name: "Elara Mão-Fria", race: "Humana", class: "Ladina", level: 3 }, { id: 3, name: "Grum, o Devorador", race: "Morvani", class: "Atormentado", level: 2 }];

  // MAPA NAV E TOKENS
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: -800, y: -800 }); 
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingToken, setDraggingToken] = useState(null);
  const [tokenContextMenu, setTokenContextMenu] = useState({ show: false, x: 0, y: 0, tokenId: null });
  const mapRef = useRef(null);
  const fileInputRef = useRef(null);

  // ================= ESTADOS DE ÁUDIO =================
  const [audioCategories, setAudioCategories] = useState([{ id: 'combat', name: '⚔️ Combate', tracks: [] }, { id: 'ambient', name: '🌲 Ambiente', tracks: [] }, { id: 'tavern', name: '🍺 Taverna', tracks: [] }, { id: 'uploads', name: '📁 Meus Uploads', tracks: [] }]);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [targetAudioCat, setTargetAudioCat] = useState('uploads'); 
  
  const audioRef = useRef(null);
  const audioFileInputRef = useRef(null);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (audioRef.current) audioRef.current.loop = isLooping; }, [isLooping]);
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && activeAudioId) audioRef.current.play().catch(e => console.log("Erro áudio", e));
      else audioRef.current.pause();
    }
  }, [isPlaying, activeAudioId]);

  // ================= CÁLCULOS E LISTAS (FICHA) =================
  const currentWeight = inventoryList.reduce((acc, item) => acc + (Number(item.weight) * Number(item.quantity)), 0);
  const maxWeight = (Number(attrFor) * 5) + 30; 
  const skillsList = [
    { name: "Acrobacia", attrShort: "agi", color: "blue", trainingLevel: 1, total: attrAgi + 2 },
    { name: "Adestramento", attrShort: "ins", color: "amber", trainingLevel: 0, total: attrIns + 1 },
    { name: "Arremesso", attrShort: "for", color: "red", trainingLevel: 0, total: attrFor + 4 },
    { name: "Atletismo", attrShort: "vig", color: "green", trainingLevel: 2, total: attrVig + 7 },
    { name: "Constituição", attrShort: "vig", color: "green", trainingLevel: 1, total: attrVig + 5 },
    { name: "Enganação", attrShort: "pre", color: "purple", trainingLevel: 0, total: attrPre + 0 },
    { name: "Engenharia", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Erudição", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Furtividade", attrShort: "agi", color: "blue", trainingLevel: 1, total: attrAgi + 2 },
    { name: "Influência", attrShort: "pre", color: "purple", trainingLevel: 2, total: attrPre + 4 },
    { name: "Intimidação", attrShort: "pre", color: "purple", trainingLevel: 1, total: attrPre + 2 },
    { name: "Intuição", attrShort: "ins", color: "amber", trainingLevel: 1, total: attrIns + 3 },
    { name: "Investigação", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Ladinagem", attrShort: "agi", color: "blue", trainingLevel: 0, total: attrAgi + 0 },
    { name: "Liderança", attrShort: "pre", color: "purple", trainingLevel: 0, total: attrPre + 0 },
    { name: "Luta", attrShort: "for", color: "red", trainingLevel: 1, total: attrFor + 6 },
    { name: "Medicina", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Misticismo", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Montaria/Pilotar", attrShort: "agi", color: "blue", trainingLevel: 0, total: attrAgi + 0 },
    { name: "Navegação", attrShort: "int", color: "yellow", trainingLevel: 1, total: attrInt + 0 },
    { name: "Ofício", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Percepção", attrShort: "ins", color: "amber", trainingLevel: 2, total: attrIns + 5 },
    { name: "Pontaria", attrShort: "agi", color: "blue", trainingLevel: 0, total: attrAgi + 0 },
    { name: "Rastrear", attrShort: "ins", color: "amber", trainingLevel: 1, total: attrIns + 3 },
    { name: "Religião", attrShort: "int", color: "yellow", trainingLevel: 0, total: attrInt - 2 },
    { name: "Sincronia", attrShort: "pre", color: "purple", trainingLevel: 0, total: attrPre + 0 },
    { name: "Sobrevivência", attrShort: "ins", color: "amber", trainingLevel: 3, total: attrIns + 7 },
    { name: "Vontade", attrShort: "pre", color: "purple", trainingLevel: 1, total: attrPre + 2 }
  ];

  // ================= FUNÇÕES DO VTT =================
  const showToast = (message, type = "success") => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500); };
  const getSkillTotal = (skillString) => { const baseName = skillString.split(" ")[0]; const skillObj = skillsList.find(s => s.name === baseName); return skillObj ? skillObj.total : 0; };
  
  const handleEnterSession = (asMaster) => { 
    setIsMasterMode(asMaster); 
    setSessionTab('chat');
    setCurrentPage('sessão'); 
  };

  const executeRoll = (type, title, bonus, weapon = null) => {
    setRollModal({ show: true, title, type, bonus, d20: 0, total: 0, isRolling: true, isCrit: false, isFumble: false, weapon, details: "" });
    setTimeout(() => {
      let newChatMsg = { id: Date.now(), sender: isMasterMode && secretRoll ? "Mestre" : charName, type: isMasterMode && secretRoll ? "secret" : "roll", text: "" };
      if (type === 'damage') {
        const isCrit = bonus.isCrit || false;
        const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier);
        setRollModal(prev => ({ ...prev, isRolling: false, total: res.total, details: res.log, isCrit }));
        newChatMsg.text = `Rolou Dano (${weapon.name}): ${res.total}\nDetalhes: [${res.log}]`;
        if(isCrit) newChatMsg.text += "\n💥 DANO CRÍTICO!";
      } else {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + Number(bonus);
        let isCrit = d20 === 20; let isFumble = d20 === 1;
        let damageBreakdown = ""; let damageTotal = 0;
        newChatMsg.text = `${title}: ${total} (Dado: ${d20})`;
        if (type === 'attack' && weapon) {
          const critMargin = parseInt(weapon.critMargin) || 20;
          if (d20 >= critMargin) isCrit = true;
          const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier);
          damageBreakdown = res.log; damageTotal = res.total;
          if(isCrit) newChatMsg.text += `\n🎉 Acerto Crítico!\n🩸 Dano: ${res.total} [${res.log}]`;
          else if(isFumble) newChatMsg.text += `\n💀 Falha Crítica!`;
          else newChatMsg.text += `\n🩸 Dano gerado: ${res.total} [${res.log}]`;
        } else {
          if(isCrit) newChatMsg.text += `\n🎉 Glória! (Acerto Crítico)`;
          if(isFumble) newChatMsg.text += `\n💀 Desastre! (Falha Crítica)`;
        }
        setRollModal(prev => ({ ...prev, isRolling: false, d20, total, isCrit, isFumble, details: type === 'attack' ? damageBreakdown : "", damageTotal: type === 'attack' ? damageTotal : 0 }));
      }
      if (isMasterMode && secretRoll) newChatMsg.text = `[Rolagem Oculta]\n${newChatMsg.text}`;
      setChatMessages(prev => [...prev, newChatMsg]);
    }, 1000);
  };

  const handleBuyItem = (item, index) => {
    const qty = buyQuantities[index] || 1;
    const totalCost = item.price * qty;
    if (lascas >= totalCost) {
      setLascas(prev => prev - totalCost);
      const existingItemIndex = inventoryList.findIndex(i => i.name === item.name);
      if (existingItemIndex >= 0) {
        const updatedInventory = [...inventoryList]; updatedInventory[existingItemIndex].quantity += qty; setInventoryList(updatedInventory);
      } else {
        setInventoryList([...inventoryList, { name: item.name, description: item.desc, quantity: qty, weight: item.weight }]);
      }
      showToast(`Compra efetuada! ${qty}x ${item.name} na bolsa.`, "success");
      setBuyQuantities(prev => ({...prev, [index]: 1})); 
    } else {
      showToast("Lascas insuficientes. As Sombras zombam da sua pobreza!", "error");
    }
  };

  const updateBuyQty = (index, delta) => { setBuyQuantities(prev => { const current = prev[index] || 1; return { ...prev, [index]: Math.max(1, current + delta) }; }); };
  const handleOpenNewCatalogItem = () => { setCatalogForm({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" }); setEditingCatalogIndex(null); setShowCatalogForm(true); };
  const handleEditCatalogItem = (index) => { setCatalogForm(catalog[index]); setEditingCatalogIndex(index); setShowCatalogForm(true); };
  const handleDeleteCatalogItem = (index) => { if(window.confirm("Remover da Loja?")) setCatalog(catalog.filter((_, i) => i !== index)); };
  const handleSaveCatalogItem = () => {
    if(!catalogForm.name) return alert("Precisa de nome!");
    if(editingCatalogIndex !== null) { const updated = [...catalog]; updated[editingCatalogIndex] = catalogForm; setCatalog(updated); } 
    else { setCatalog([...catalog, catalogForm]); }
    setShowCatalogForm(false);
  };

  // Funções CRUD Ficha
  const handleDeityChange = (newDeity) => { setCharDeity(newDeity); let updatedAbilities = abilitiesList.filter(ab => ab.type !== "Dádiva Divina"); if (newDeity !== "Nenhum" && panteaoKorzel[newDeity]) { const newPowers = panteaoKorzel[newDeity].poderes.map(p => ({ title: p.title, type: "Dádiva Divina", cost: p.cost, description: p.desc })); updatedAbilities = [...updatedAbilities, ...newPowers]; } setAbilitiesList(updatedAbilities); };
  const handleOpenNewWeapon = () => { setWeaponForm({ name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta" }); setEditingWeaponIndex(null); setShowWeaponForm(true); };
  const handleEditWeapon = (index) => { setWeaponForm(attacksList[index]); setEditingWeaponIndex(index); setShowWeaponForm(true); };
  const handleDeleteWeapon = (index) => { if(window.confirm("Deseja excluir?")) setAttacksList(attacksList.filter((_, i) => i !== index)); };
  const handleSaveWeapon = () => { if(!weaponForm.name || !weaponForm.damage) return alert("A arma precisa de Nome e Dano!"); if (editingWeaponIndex !== null) { const updated = [...attacksList]; updated[editingWeaponIndex] = weaponForm; setAttacksList(updated); } else { setAttacksList([...attacksList, weaponForm]); } setShowWeaponForm(false); };
  const handleOpenNewAbility = () => { setAbilityForm({ title: "", type: "Dádiva Divina", cost: "1 PV", description: "" }); setEditingAbilityIndex(null); setShowAbilityForm(true); };
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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if(!chatInput.trim()) return;
    let newMessage = { id: Date.now(), sender: isMasterMode ? "Mestre" : charName, text: chatInput, type: "msg" };
    if (chatInput.startsWith('/r ')) { const rollExp = chatInput.replace('/r ', ''); newMessage.text = `Rolou ${rollExp}: [ 14 ]`; newMessage.type = "roll"; }
    if (secretRoll && isMasterMode) { newMessage.text = `[Oculto]\n${newMessage.text}`; newMessage.type = "secret"; }
    setChatMessages([...chatMessages, newMessage]); setChatInput("");
  };

  // Funções de Mapa e Áudio
  const currentSceneObj = scenes.find(s => s.id === (isMasterMode ? gmActiveSceneId : playerActiveSceneId));
  const handleMapUpload = (e) => { const file = e.target.files[0]; if (file) { const imageUrl = URL.createObjectURL(file); setScenes(prev => prev.map(s => s.id === gmActiveSceneId ? {...s, bgImage: imageUrl} : s)); } };
  const addNewScene = () => { const newId = Date.now(); setScenes([...scenes, { id: newId, name: `Nova Cena ${scenes.length + 1}`, bgImage: null }]); setGmActiveSceneId(newId); };
  const handleTokenImageUpload = (e) => { const file = e.target.files[0]; if (file) { setTokenForm({ ...tokenForm, image: URL.createObjectURL(file) }); } };
  const handleCreateToken = () => { if (!tokenForm.name) return alert("O token precisa de um nome!"); const newLibToken = { id: Date.now(), name: tokenForm.name, isNpc: tokenForm.isNpc, image: tokenForm.image }; setTokenLibrary([...tokenLibrary, newLibToken]); setShowTokenForm(false); setTokenForm({ name: '', isNpc: true, image: null }); showToast("Token salvo na Biblioteca!", "success"); };
  const updateTokenSize = (id, newSize) => { setSceneTokens(prev => prev.map(t => t.id === id ? { ...t, size: Number(newSize) } : t)); };
  const handleDragStartFromLibrary = (e, libToken) => { e.dataTransfer.setData("application/json", JSON.stringify(libToken)); };
  
  const handleDropOnMap = (e) => { 
    e.preventDefault(); 
    try { 
      const libToken = JSON.parse(e.dataTransfer.getData("application/json")); 
      if (!mapRef.current) return; 
      const rect = mapRef.current.getBoundingClientRect(); 
      const dropX = (e.clientX - rect.left - mapOffset.x) / mapScale - (80 / 2); 
      const dropY = (e.clientY - rect.top - mapOffset.y) / mapScale - (80 / 2); 
      // array statuses[] vazia no novo token dropado
      const newTokenInScene = { id: Date.now(), sceneId: gmActiveSceneId, name: libToken.name, inScene: true, isNpc: libToken.isNpc, x: dropX, y: dropY, size: 80, zIndex: 10, image: libToken.image, statuses: [] }; 
      setSceneTokens(prev => [...prev, newTokenInScene]); 
    } catch(err) { console.log("Drag não era de um token válido", err); } 
  };
  
  const handleMapWheel = (e) => { if (!mapRef.current) return; const rect = mapRef.current.getBoundingClientRect(); const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top; const zoomFactor = -Math.sign(e.deltaY) * 0.1; const newScale = Math.max(0.2, Math.min(3, mapScale + zoomFactor)); if (newScale !== mapScale) { const mapX = (mouseX - mapOffset.x) / mapScale; const mapY = (mouseY - mapOffset.y) / mapScale; const newOffsetX = mouseX - (mapX * newScale); const newOffsetY = mouseY - (mapY * newScale); setMapScale(newScale); setMapOffset({ x: newOffsetX, y: newOffsetY }); } };
  const handleMapMouseDown = (e) => { if(tokenContextMenu.show) setTokenContextMenu({ ...tokenContextMenu, show: false }); if(e.target === mapRef.current || e.target.id === 'map-background') { setIsDraggingMap(true); setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y }); } };
  const handleMapMouseMove = (e) => { if (draggingToken !== null && mapRef.current) { const rect = mapRef.current.getBoundingClientRect(); const token = sceneTokens.find(t => t.id === draggingToken); const tokenSize = token ? token.size : 80; const x = (e.clientX - rect.left - mapOffset.x) / mapScale - (tokenSize / 2); const y = (e.clientY - rect.top - mapOffset.y) / mapScale - (tokenSize / 2); setSceneTokens(prev => prev.map(t => t.id === draggingToken ? { ...t, x, y } : t)); } else if (isDraggingMap) { setMapOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } };
  const handleMapMouseUp = () => { setDraggingToken(null); setIsDraggingMap(false); };
  
  // FUNÇÕES DO CONTEXT MENU E STATUS DO TOKEN
  const bringToFront = () => { const maxZ = Math.max(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: maxZ + 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const sendToBack = () => { const minZ = Math.min(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: minZ - 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const assignPermission = () => { const playerName = window.prompt("Digite o nome do jogador que controlará este token:"); if(playerName) { showToast(`Controle do token concedido para: ${playerName}`, "success"); } setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  
  // Função para adicionar/remover status visual no token
  const toggleTokenStatus = (statusName) => {
    if (!tokenContextMenu.tokenId) return;
    setSceneTokens(prev => prev.map(t => {
      if (t.id === tokenContextMenu.tokenId) {
        const currentStatuses = t.statuses || [];
        const newStatuses = currentStatuses.includes(statusName) 
          ? currentStatuses.filter(s => s !== statusName) 
          : [...currentStatuses, statusName];
        return { ...t, statuses: newStatuses };
      }
      return t;
    }));
    setTokenContextMenu({ ...tokenContextMenu, show: false }); // Fecha o menu
  };
  
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      const newTrack = { id: Date.now(), name: file.name, url: audioUrl };
      setAudioCategories(prev => prev.map(cat => cat.id === targetAudioCat ? { ...cat, tracks: [...cat.tracks, newTrack] } : cat));
    }
    e.target.value = null; 
  };
  const togglePlayAudio = (trackId) => { if (activeAudioId === trackId) { setIsPlaying(!isPlaying); } else { setActiveAudioId(trackId); setIsPlaying(true); } };

  // ================= RENDERIZADOR DA FICHA ORIGINAL =================
  const renderCharacterSheet = () => (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-0">
      <div className="w-full lg:w-[50%] flex flex-col gap-8 relative z-10 shrink-0">
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
          <div className="w-full max-w-md mx-auto z-20 mt-4"><DefenseBlock agility={attrAgi} /></div>
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
            {skillsList.map((skill, index) => ( <SkillRow key={index} name={skill.name} attrShort={skill.attrShort} color={skill.color} trainingLevel={skill.trainingLevel} baseTotal={skill.total} onRoll={(nome, bonusTotal) => executeRoll('skill', `Teste de ${nome}`, bonusTotal)} /> ))}
          </div>
        )}

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
            <div className="flex flex-col">{attacksList.map((atk, index) => ( <WeaponCard key={index} weapon={atk} skillTotal={getSkillTotal(atk.skill)} onEdit={() => handleEditWeapon(index)} onDelete={() => handleDeleteWeapon(index)} onRollAttack={(weaponObj) => executeRoll('attack', `Ataque: ${weaponObj.name}`, getSkillTotal(weaponObj.skill), weaponObj)} /> ))}</div>
          </div>
        )}

        {activeFichaTab === 'habilidades' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold max-w-[60%] leading-tight">Lembre-se: Apague as Dádivas Divinas que seu personagem ainda não dominou.</span>
              {!showAbilityForm && ( <button onClick={handleOpenNewAbility} className="whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md border border-zinc-600 transition-colors uppercase tracking-widest text-xs">+ Aprender Habilidade</button> )}
            </div>
            {showAbilityForm && (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-6 animate-fade-in shadow-lg shrink-0">
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
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center bg-[#140c08]/80 border-2 border-[#3e2723] rounded-lg p-4 mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] shrink-0">
              <div className="flex flex-col"><span className="text-[9px] text-amber-700/80 uppercase font-bold tracking-widest mb-1">Bolsa de Lascas</span><div className="flex items-center gap-2"><span className="text-2xl drop-shadow-md">🪙</span><input type="number" value={lascas} onChange={(e) => setLascas(Number(e.target.value))} className="bg-transparent text-2xl font-bold text-amber-500 outline-none w-24 border-b border-amber-900/50 focus:border-amber-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div></div>
              {!showItemForm && ( <button onClick={handleOpenNewItem} className="h-10 px-4 bg-[#3e2723] hover:bg-amber-900 text-amber-500 hover:text-white font-bold rounded-md border border-amber-900/50 transition-colors uppercase tracking-widest text-[10px] shadow-lg">+ Guardar Item</button> )}
              <div className="flex flex-col items-end"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Carga Máxima</span><div className="text-xl font-bold tracking-wider"><span className={currentWeight > maxWeight ? "text-red-500" : "text-white"}>{currentWeight.toFixed(1)}</span><span className="text-zinc-600 mx-1">/</span><span className="text-zinc-400">{maxWeight} kg</span></div></div>
            </div>
            {showItemForm && (
              <div className="bg-[#1a1412] border border-[#3e2723] rounded-lg p-4 mb-6 animate-fade-in shadow-lg shrink-0">
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
                  <div className="flex justify-between items-center mb-4 shrink-0"><input type="text" value={activeNote.title} onChange={(e) => handleNoteChange('title', e.target.value)} placeholder="Título da Anotação..." className="text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-amber-900/50 w-full" /><button onClick={() => handleDeleteNote(activeNote.id)} className="text-zinc-600 hover:text-red-500 transition-colors" title="Arrancar Página">🗑️</button></div>
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

  // ================= MAIN RENDER =================
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] flex flex-col font-sans relative"
         onMouseMove={handleMapMouseMove} 
         onMouseUp={handleMapMouseUp}
         onMouseLeave={handleMapMouseUp}>
      
      {/* ================= COMPONENTES GLOBAIS ================= */}
      <DiceRollerOverlay 
        isRolling={rollModal.isRolling} 
        result={rollModal.show && !rollModal.isRolling ? { 
          title: rollModal.title, 
          total: rollModal.total, 
          detail: rollModal.details || `Dado: ${rollModal.d20} + Bônus: ${rollModal.bonus}` 
        } : null} 
        onDismiss={() => setRollModal({ ...rollModal, show: false })} 
      />

      <audio ref={audioRef} src={audioCategories.flatMap(c => c.tracks).find(t => t.id === activeAudioId)?.url} loop={isLooping} />

      {sheetModalOpen && currentPage === 'sessão' && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:p-8 animate-fade-in" onClick={() => setSheetModalOpen(false)}>
          <div className="bg-[#0a0a0a] w-full h-full max-h-[95vh] overflow-y-auto rounded-xl border-2 border-red-900/50 shadow-[0_0_50px_rgba(0,0,0,1)] relative custom-scrollbar flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSheetModalOpen(false)} className="absolute top-4 right-6 text-zinc-500 hover:text-red-500 text-2xl z-50 transition-colors">✖</button>
            {renderCharacterSheet()}
          </div>
        </div>
      )}

      {/* MENU DE CONTEXTO DE TOKENS (Agora com Opções de Status!) */}
      {tokenContextMenu.show && (
        <div className="fixed z-[9999] bg-zinc-950 border-2 border-[#3e2723] rounded shadow-[0_5px_20px_rgba(0,0,0,0.9)] flex flex-col p-1 w-48" style={{ top: tokenContextMenu.y, left: tokenContextMenu.x }}>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-3 py-1 border-b border-[#3e2723] mb-1">Camadas & Posse</span>
          <button onClick={bringToFront} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬆️ Trazer p/ Frente</button>
          <button onClick={sendToBack} className="text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 rounded transition-colors">⬇️ Enviar p/ Trás</button>
          {isMasterMode && (
            <button onClick={assignPermission} className="text-left px-3 py-2 text-xs font-bold text-purple-300 hover:bg-purple-900/50 hover:text-purple-200 rounded transition-colors border-t border-purple-900/30 mt-1">👤 Atribuir Jogador</button>
          )}

          {/* 🟢 NOVAS OPÇÕES DE STATUS AQUI 🟢 */}
          <div className="border-t border-[#3e2723] my-1"></div>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-3 py-1 mb-1 block">Condições</span>
          <button onClick={() => toggleTokenStatus('bleeding')} className="text-left px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-zinc-800 rounded transition-colors">🩸 Sangrando</button>
          <button onClick={() => toggleTokenStatus('poisoned')} className="text-left px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-zinc-800 rounded transition-colors">☠️ Envenenado</button>
          <button onClick={() => toggleTokenStatus('camouflaged')} className="text-left px-3 py-1.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800 rounded transition-colors">🌫️ Camuflado</button>
        </div>
      )}

      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] border flex items-center gap-3 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-950/90 border-red-900 text-red-200' : 'bg-green-950/90 border-green-900 text-green-200'}`}>
          <span className="text-xl drop-shadow-md">{toast.type === 'error' ? '💀' : '🪙'}</span>
          <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">{toast.message}</span>
        </div>
      )}

      {/* ================= NAVBAR PRINCIPAL ================= */}
      <nav className="bg-[#140c08] border-b-2 border-[#3e2723] px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] sticky top-0 z-[100] shrink-0">
        <div className="text-amber-600 font-black text-2xl tracking-widest uppercase flex items-center gap-2 drop-shadow-md shrink-0 cursor-pointer" onClick={() => setCurrentPage('início')}>
          <img src={mosasaurusSkull} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-80" />
          KORZEL VTT
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2 sm:gap-x-6 w-full items-center">
          {['Início', 'Compêndio'].map(tab => (
            <button key={tab} onClick={() => setCurrentPage(tab.toLowerCase())} className={`pb-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${currentPage === tab.toLowerCase() ? 'text-white border-red-800' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* ================= ROTEAMENTO DE PÁGINAS ================= */}
      <main className={`flex-1 w-full flex flex-col min-h-0 ${currentPage === 'sessão' ? 'max-w-full' : 'max-w-7xl mx-auto'}`}>
        
        {currentPage === 'início' && (
          <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto">
            <section>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2 mb-6">As Minhas Campanhas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-700/50 transition-colors group">
                  <div className="h-32 bg-black/60 relative flex items-center justify-center border-b border-zinc-800">
                    <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">🐉</span>
                    <div className="absolute top-2 right-2 bg-amber-900/80 text-amber-100 text-[9px] uppercase font-bold px-2 py-1 rounded">Ativa</div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">Sombras de Korzel</h3>
                      <p className="text-xs text-zinc-500 mt-1">Última sessão: Ontem</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEnterSession(true)} className="flex-1 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-purple-700/50">Entrar Mestre</button>
                      <button onClick={() => handleEnterSession(false)} className="flex-1 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-[10px] uppercase font-bold tracking-widest py-2 rounded transition-colors border border-blue-700/50">Entrar Jogador</button>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 border-dashed rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-full min-h-[220px] cursor-pointer hover:bg-zinc-900/50 transition-colors group">
                  <span className="text-4xl mb-2 text-zinc-600 group-hover:text-amber-500 transition-colors">+</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest group-hover:text-amber-500 transition-colors">Nova Campanha</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2 mb-6">Os Meus Personagens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => setCurrentPage('ficha')} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-lg hover:border-red-900/50 transition-colors group cursor-pointer flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-900 flex items-center justify-center text-red-500 font-bold text-xl">{charName.charAt(0)}</div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold group-hover:text-red-400 transition-colors">{charName}</span>
                    <span className="text-[10px] text-zinc-500 uppercase mt-1">{charClass} • Nvl {charLevel}</span>
                  </div>
                </div>

                <div onClick={() => setCurrentPage('ficha')} className="bg-zinc-950 border border-zinc-800 border-dashed rounded-xl p-5 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-zinc-900/50 transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-bold text-xl group-hover:text-red-400">+</div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest group-hover:text-red-400 transition-colors">Nova Ficha</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'sessão' && (
           <div className="flex flex-col flex-1 w-full h-full overflow-hidden animate-fade-in relative min-h-0">
               
               {isMasterMode && (
                 <div className="w-full bg-[#0a0502] border-b border-[#3e2723] px-4 py-2 flex items-center justify-between gap-4 z-30 shadow-md shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1">
                       <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mr-2 shrink-0">Cenas:</span>
                       {scenes.map(scene => (
                         <div key={scene.id} onClick={() => setGmActiveSceneId(scene.id)} className={`relative flex items-center px-4 py-2 cursor-pointer transition-colors border-2 rounded shrink-0 ${gmActiveSceneId === scene.id ? 'bg-purple-950/40 border-purple-600' : 'bg-black/60 border-zinc-800 hover:border-zinc-500'}`}>
                           <span className={`text-[10px] font-bold tracking-widest uppercase ${gmActiveSceneId === scene.id ? 'text-white' : 'text-zinc-500'}`}>{scene.name}</span>
                           <button onClick={(e) => { e.stopPropagation(); setPlayerActiveSceneId(scene.id); showToast(`Jogadores movidos para a cena: ${scene.name}`, "success"); }} className={`absolute -top-3 -right-2 w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all ${playerActiveSceneId === scene.id ? 'bg-amber-600 border-white text-white z-10 scale-110 shadow-[0_0_10px_rgba(217,119,6,0.8)]' : 'bg-zinc-800 border-zinc-600 text-zinc-400 opacity-50 hover:opacity-100 z-0 hover:scale-105'}`} title={playerActiveSceneId === scene.id ? "Jogadores estão a ver esta cena" : "Puxar jogadores para cá"}>👁️</button>
                         </div>
                       ))}
                       <button onClick={addNewScene} className="ml-2 w-8 h-8 flex items-center justify-center rounded border border-purple-800 text-purple-500 hover:bg-purple-900/50 transition-colors shrink-0">+</button>
                    </div>
                 </div>
               )}

               <div className="flex flex-1 overflow-hidden relative min-h-0">
                 <div className="w-12 sm:w-14 bg-[#0a0502] border-r border-[#3e2723] flex flex-col items-center py-4 gap-4 z-20 shadow-[5px_0_15px_rgba(0,0,0,0.8)] shrink-0">
                    <button className="w-8 h-8 rounded hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-colors" title="Selecionar">👆</button>
                    <button className="w-8 h-8 rounded hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-colors" title="Medir Distância">📏</button>
                    <div className="w-6 h-[1px] bg-zinc-800 my-2"></div>
                    {isMasterMode && (
                      <>
                        <button onClick={() => fileInputRef.current.click()} className="w-8 h-8 rounded mt-4 border border-purple-900 bg-purple-950/40 flex items-center justify-center text-purple-400 hover:bg-purple-900 transition-colors" title="Mudar Cenário (Fundo)">🗺️</button>
                        <input type="file" ref={fileInputRef} onChange={handleMapUpload} accept="image/*" className="hidden" />
                      </>
                    )}
                 </div>

                 <div ref={mapRef} className={`flex-1 relative bg-[#0f0f0f] overflow-hidden ${isDraggingMap ? 'cursor-grabbing' : 'cursor-grab'} select-none touch-none`} onMouseDown={handleMapMouseDown} onWheel={handleMapWheel} onDragOver={(e) => e.preventDefault()} onDrop={handleDropOnMap}>
                    <div id="map-background" className="absolute origin-top-left" style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`, width: '3000px', height: '3000px' }}>
                      {currentSceneObj && currentSceneObj.bgImage ? (
                        <img src={currentSceneObj.bgImage} alt="Mapa Tático" className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none" />
                      ) : (
                        <img src={mapaBackground} alt="Mapa Tático Padrão" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                      )}
                      
                      {/* 🟢 RENDERIZAÇÃO DOS TOKENS COM OS EFEITOS DE STATUS 🟢 */}
                      {sceneTokens.filter(t => t.sceneId === currentSceneObj?.id && t.inScene).map(token => {
                        const statuses = token.statuses || [];
                        const isBleeding = statuses.includes('bleeding');
                        const isPoisoned = statuses.includes('poisoned');
                        const isCamouflaged = statuses.includes('camouflaged');

                        let dropShadow = "drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]";
                        if (isBleeding) dropShadow = "drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]";
                        if (isPoisoned) dropShadow = "drop-shadow-[0_0_15px_rgba(34,197,94,0.9)]";
                        if (isBleeding && isPoisoned) dropShadow = "drop-shadow-[0_0_10px_rgba(220,38,38,0.9)] drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]";

                        return (
                          <div 
                            key={token.id} 
                            onMouseDown={(e) => { e.stopPropagation(); setDraggingToken(token.id); }} 
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setTokenContextMenu({ show: true, x: e.clientX, y: e.clientY, tokenId: token.id }); }} 
                            style={{ top: `${token.y}px`, left: `${token.x}px`, width: `${token.size}px`, height: `${token.size}px`, zIndex: draggingToken === token.id ? 9999 : (token.zIndex || 10) }} 
                            className={`absolute flex items-center justify-center cursor-grab active:cursor-grabbing ${draggingToken === token.id ? 'scale-110' : 'transition-transform duration-300 hover:scale-105'} ${isCamouflaged ? 'opacity-40' : 'opacity-100'} ${!token.image ? (token.isNpc ? `rounded-full border-2 bg-red-950 border-red-500 ${isBleeding?'shadow-[0_0_15px_rgba(220,38,38,0.9)]':isPoisoned?'shadow-[0_0_15px_rgba(34,197,94,0.9)]':'shadow-[0_5px_10px_rgba(0,0,0,0.8)]'}` : `rounded-full border-2 bg-blue-950 border-blue-400 ${isBleeding?'shadow-[0_0_15px_rgba(220,38,38,0.9)]':isPoisoned?'shadow-[0_0_15px_rgba(34,197,94,0.9)]':'shadow-[0_5px_10px_rgba(0,0,0,0.8)]'}`) : ''}`} 
                            title={token.name}
                          >
                            {token.image ? ( <img src={token.image} alt={token.name} className={`w-full h-full object-contain pointer-events-none transition-[filter] duration-300 ${dropShadow}`} draggable="false" /> ) : ( <span className="text-white text-xl font-bold pointer-events-none">{token.name.charAt(0)}</span> )}
                            
                            {/* ÍCONES DE STATUS */}
                            {statuses.length > 0 && (
                              <div className="absolute -top-3 -right-3 flex gap-1 pointer-events-none z-20">
                                {isBleeding && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-red-900 shadow-md">🩸</span>}
                                {isPoisoned && <span className="bg-black/80 rounded-full p-1.5 text-xs sm:text-sm leading-none border border-green-900 shadow-md">☠️</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-purple-950/80 rounded-md overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] border border-purple-800/50 backdrop-blur-sm z-[100]">
                       <button onClick={() => setMapScale(s => Math.max(0.2, s - 0.1))} className="px-4 py-2 text-white hover:bg-purple-800 transition-colors font-bold">-</button>
                       <span className="px-4 py-2 text-white text-xs font-bold tracking-widest border-x border-purple-800/50">{Math.round(mapScale * 100)}%</span>
                       <button onClick={() => setMapScale(s => Math.min(3, s + 0.1))} className="px-4 py-2 text-white hover:bg-purple-800 transition-colors font-bold">+</button>
                    </div>
                 </div>

                 {/* SIDEBAR DA SESSÃO */}
                 <div className="w-80 lg:w-96 bg-[#140c08] border-l border-[#3e2723] flex flex-col z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.8)] shrink-0 h-full min-h-0">
                    <div className="flex flex-wrap border-b border-[#3e2723] bg-[#0a0502] shrink-0">
                       {(isMasterMode ? ['Chat', 'Tokens', 'Áudio', 'Fichas', 'Loja'] : ['Chat', 'Fichas', 'Loja']).map(t => (
                          <button key={t} onClick={() => setSessionTab(t.toLowerCase())} className={`flex-1 py-3 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase transition-colors ${sessionTab === t.toLowerCase() ? 'bg-[#140c08] text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                             {t}
                          </button>
                       ))}
                    </div>
                    
                    {isMasterMode && sessionTab === 'tokens' && (
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative min-h-0">
                         <div>
                           <h4 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2 mt-2">Em Cena Atual</h4>
                           {sceneTokens.filter(t => (isMasterMode || !t.isNpc) && t.sceneId === currentSceneObj?.id && t.inScene).map(token => (
                             <div key={token.id} className="bg-black/40 border border-zinc-800/80 rounded p-3 flex flex-col mb-3 hover:border-zinc-600 transition-colors shadow-sm">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-xs overflow-hidden ${token.isNpc ? 'bg-red-950/50 border-red-900 text-red-500' : 'bg-blue-950/50 border-blue-900 text-blue-400'}`}>
                                       {token.image ? <img src={token.image} className="w-full h-full object-cover" /> : token.name.charAt(0)}
                                     </div>
                                     <span className="text-xs text-white font-bold">{token.name}</span>
                                  </div>
                                  {isMasterMode && (
                                    <button onClick={() => setSceneTokens(prev => prev.filter(p => p.id !== token.id))} className="text-[9px] uppercase border border-zinc-700 bg-zinc-900 text-zinc-400 px-2 py-1 rounded hover:bg-red-900/50 hover:text-red-300 hover:border-red-800 transition-colors flex items-center gap-1">
                                      <span>X</span>
                                    </button>
                                  )}
                                </div>
                                {(isMasterMode || !token.isNpc) && (
                                  <div className="mt-3 flex items-center gap-3 border-t border-zinc-800/50 pt-2">
                                     <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest shrink-0">Tamanho</span>
                                     <input type="range" min="20" max="1500" value={token.size || 80} onChange={(e) => updateTokenSize(token.id, e.target.value)} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                                  </div>
                                )}
                             </div>
                           ))}
                         </div>

                         {isMasterMode && (
                           <div className="mt-4 border-t border-zinc-800 pt-4 pb-16">
                             {showTokenForm ? (
                               <div className="bg-purple-950/20 border border-purple-900/50 rounded p-3 mb-4 animate-fade-in shadow-inner">
                                 <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-3 border-b border-purple-900/50 pb-1">Guardar na Biblioteca</h4>
                                 <input type="text" placeholder="Nome do Token..." value={tokenForm.name} onChange={e => setTokenForm({...tokenForm, name: e.target.value})} className="w-full bg-black border border-purple-900/50 rounded p-2 text-xs text-white focus:outline-none mb-2" />
                                 <div className="flex items-center gap-4 mb-3">
                                   <label className="text-[10px] text-zinc-400 flex items-center gap-1 cursor-pointer"><input type="radio" checked={tokenForm.isNpc} onChange={() => setTokenForm({...tokenForm, isNpc: true})} className="accent-purple-500" /> Inimigo</label>
                                   <label className="text-[10px] text-zinc-400 flex items-center gap-1 cursor-pointer"><input type="radio" checked={!tokenForm.isNpc} onChange={() => setTokenForm({...tokenForm, isNpc: false})} className="accent-purple-500" /> Aliado</label>
                                 </div>
                                 <div className="flex items-center gap-3 mb-4">
                                   <div className="w-10 h-10 rounded border border-purple-900 bg-black flex items-center justify-center overflow-hidden shrink-0">
                                     {tokenForm.image ? <img src={tokenForm.image} className="w-full h-full object-cover" /> : <span className="text-[10px] text-purple-500/50">Img</span>}
                                   </div>
                                   <button onClick={() => tokenFileInputRef.current.click()} className="text-[9px] uppercase border border-purple-900 bg-purple-950/50 text-purple-300 px-2 py-1.5 rounded hover:bg-purple-900 transition-colors w-full">Escolher Arte</button>
                                   <input type="file" ref={tokenFileInputRef} onChange={handleTokenImageUpload} accept="image/*" className="hidden" />
                                 </div>
                                 <div className="flex gap-2">
                                   <button onClick={() => setShowTokenForm(false)} className="flex-1 text-[9px] uppercase text-zinc-500 hover:text-white py-2">Cancelar</button>
                                   <button onClick={handleCreateToken} className="flex-1 bg-purple-900 hover:bg-purple-700 text-white text-[9px] uppercase font-bold tracking-widest py-2 rounded transition-colors shadow-lg">Salvar</button>
                                 </div>
                               </div>
                             ) : (
                               <button onClick={() => setShowTokenForm(true)} className="w-full bg-purple-900/80 hover:bg-purple-700 text-white text-[10px] uppercase font-bold tracking-widest py-3 rounded transition-colors shadow-lg border border-purple-600 mb-4">+ Novo Personagem/Inimigo</button>
                             )}

                             <div className="flex justify-between items-center mb-2">
                               <h4 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Biblioteca (Arraste para o mapa)</h4>
                               <span className="text-purple-500 text-xs">⭐</span>
                             </div>
                             
                             {tokenLibrary.map(libToken => (
                               <div key={libToken.id} draggable onDragStart={(e) => handleDragStartFromLibrary(e, libToken)} className="bg-black/40 border border-zinc-800/80 rounded p-2 flex items-center justify-between mb-2 hover:border-purple-600 transition-colors cursor-grab active:cursor-grabbing" title="Arraste para o Mapa">
                                  <div className="flex items-center gap-3 pointer-events-none">
                                     <div className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-xs overflow-hidden ${libToken.isNpc ? 'border-red-900 bg-red-950/50 text-red-400' : 'border-blue-900 bg-blue-950/50 text-blue-400'}`}>
                                        {libToken.image ? <img src={libToken.image} className="w-full h-full object-cover" /> : libToken.name.charAt(0)}
                                     </div>
                                     <span className="text-xs text-white font-bold">{libToken.name}</span>
                                  </div>
                                  <span className="text-zinc-600 text-lg">✋</span>
                               </div>
                             ))}
                           </div>
                         )}
                      </div>
                    )}

                    {isMasterMode && sessionTab === 'áudio' && (
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 min-h-0">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2 shrink-0">
                           <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Mesa de Som (Imersão)</h4>
                           <label className="flex items-center gap-2 cursor-pointer group">
                             <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 group-hover:text-amber-500 transition-colors">Loop Global</span>
                             <input type="checkbox" checked={isLooping} onChange={e=>setIsLooping(e.target.checked)} className="accent-amber-500 w-3 h-3" />
                           </label>
                        </div>
                        
                        <input type="file" ref={audioFileInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />

                        <div className="flex flex-col gap-4">
                          {audioCategories.map(category => (
                            <div key={category.id} className="flex flex-col gap-2">
                               <div className="flex justify-between items-center border-b border-amber-900/30 pb-1">
                                 <h5 className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">{category.name}</h5>
                                 {isMasterMode && (
                                   <button 
                                     onClick={() => { setTargetAudioCat(category.id); audioFileInputRef.current.click(); }} 
                                     className="text-[10px] text-zinc-400 hover:text-amber-500 transition-colors" 
                                     title="Adicionar música nesta pasta"
                                   >➕</button>
                                 )}
                               </div>
                               {category.tracks.length === 0 ? (
                                 <p className="text-[9px] text-zinc-600 italic">Nenhuma faixa nesta pasta.</p>
                               ) : (
                                 category.tracks.map(track => (
                                  <div key={track.id} className={`p-3 rounded-lg border flex flex-col gap-3 transition-colors ${activeAudioId === track.id ? 'bg-amber-950/20 border-amber-800/50' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}>
                                    <div className="flex justify-between items-center">
                                      <span className={`text-xs font-bold ${activeAudioId === track.id ? 'text-amber-500' : 'text-zinc-300'}`}>{track.name}</span>
                                      <button onClick={() => togglePlayAudio(track.id)} className={`w-8 h-8 rounded flex items-center justify-center text-lg ${activeAudioId === track.id && isPlaying ? 'bg-amber-600 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                                        {activeAudioId === track.id && isPlaying ? '⏸' : '▶'}
                                      </button>
                                    </div>
                                    {activeAudioId === track.id && (
                                      <div className="flex items-center gap-3 border-t border-amber-900/30 pt-2 animate-fade-in">
                                        <span className="text-xs">🔈</span>
                                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full h-1 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                                        <span className="text-xs">🔊</span>
                                      </div>
                                    )}
                                  </div>
                                 ))
                               )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {sessionTab === 'fichas' && (
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative min-h-0">
                        <div className="relative shrink-0">
                          <input type="text" placeholder="Buscar personagem..." value={fichaSearch} onChange={(e) => setFichaSearch(e.target.value)} className="w-full bg-black border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-700" />
                          <span className="absolute right-3 top-2.5 opacity-50">🔍</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 mt-2">
                           <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-800 pb-1 shrink-0">Vinculados a esta campanha</span>
                           {savedCharacters.filter(c => c.name.toLowerCase().includes(fichaSearch.toLowerCase())).map(char => (
                             <div key={char.id} className="bg-black/40 border border-zinc-800/80 rounded p-3 flex flex-col gap-3 shadow-md hover:border-red-900/50 transition-colors shrink-0">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-red-950 border border-red-900 flex items-center justify-center text-red-500 font-bold text-xs">{char.name.charAt(0)}</div>
                                  <div className="flex flex-col">
                                    <span className="text-xs text-white font-bold">{char.name}</span>
                                    <span className="text-[9px] text-zinc-500 uppercase mt-0.5">{char.race} • {char.class} Nvl {char.level}</span>
                                  </div>
                               </div>
                               <button onClick={() => setSheetModalOpen(true)} className="w-full bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-900 text-[9px] uppercase font-bold tracking-widest py-2 rounded transition-colors">
                                 📖 Abrir Ficha Completa
                               </button>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {sessionTab === 'loja' && (
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 min-h-0">
                        <div className="bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg flex justify-between items-center shadow-inner shrink-0">
                           <span className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Sua Bolsa</span>
                           <span className="text-lg font-bold text-amber-500">🪙 {lascas}</span>
                        </div>

                        {isMasterMode && (
                          <button onClick={() => setShowCatalogForm(true)} className="w-full shrink-0 bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] font-bold uppercase tracking-widest py-2 rounded transition-colors border border-purple-700 shadow-md">
                            + Adicionar Produto
                          </button>
                        )}

                        <div className="flex flex-col gap-3 mt-2">
                           <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-800 pb-1 shrink-0">Mercado Local</span>
                           {catalog.map((item, index) => {
                             const qty = buyQuantities[index] || 1;
                             return (
                               <div key={index} className="bg-black/40 border border-[#3e2723] rounded p-3 flex flex-col gap-2 relative group hover:border-amber-700/80 transition-colors shadow-sm shrink-0">
                                  {isMasterMode && (
                                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditCatalogItem(index)} className="text-[10px] text-zinc-500 hover:text-yellow-500">✏️</button>
                                        <button onClick={() => handleDeleteCatalogItem(index)} className="text-[10px] text-zinc-500 hover:text-red-500">🗑️</button>
                                     </div>
                                  )}
                                  <div>
                                    <span className="text-white text-sm font-bold block pr-10">{item.name}</span>
                                    <span className="text-[9px] text-zinc-500 uppercase">{item.type} • {item.weight} kg</span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 italic line-clamp-2">{item.desc}</p>
                                  
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3e2723]">
                                     <span className="text-amber-500 font-bold text-sm">{item.price} Lc</span>
                                     <div className="flex gap-2 items-center">
                                        <div className="flex items-center bg-zinc-950 border border-amber-900/30 rounded">
                                          <button onClick={() => updateBuyQty(index, -1)} className="px-2 text-zinc-400 hover:text-white">-</button>
                                          <span className="text-xs text-white w-4 text-center">{qty}</span>
                                          <button onClick={() => updateBuyQty(index, 1)} className="px-2 text-zinc-400 hover:text-white">+</button>
                                        </div>
                                        <button onClick={() => handleBuyItem(item, index)} className="bg-amber-900/80 hover:bg-amber-700 text-amber-100 text-[9px] font-bold uppercase px-2 py-1.5 rounded transition-colors">Comprar</button>
                                     </div>
                                  </div>
                               </div>
                             )
                           })}
                        </div>
                      </div>
                    )}

                    {sessionTab === 'chat' && (
                      <div className="flex-1 flex flex-col p-4 overflow-hidden h-full min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2 pb-4 min-h-0">
                          {chatMessages.map(msg => (
                            <div key={msg.id} className={`p-3 rounded-lg border shrink-0 ${msg.type === 'info' ? 'bg-blue-950/20 border-blue-900/50 text-blue-300' : msg.type === 'roll' ? 'bg-amber-950/20 border-amber-900/50 text-amber-100' : msg.type === 'secret' ? 'bg-purple-950/20 border-purple-900/50 text-purple-200' : 'bg-black/40 border-zinc-800 text-zinc-300'}`}>
                              <span className={`text-[10px] uppercase tracking-widest font-bold block mb-1 ${msg.sender === 'Mestre' ? 'text-purple-400' : 'text-amber-600'}`}>{msg.sender}</span>
                              <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto border-t border-zinc-800 pt-4 flex flex-col gap-3 shrink-0">
                          {isMasterMode && (
                            <label className="flex items-center gap-2 cursor-pointer w-max group">
                              <input type="checkbox" checked={secretRoll} onChange={e=>setSecretRoll(e.target.checked)} className="w-3 h-3 accent-purple-600" />
                              <span className="text-[9px] uppercase font-bold text-purple-500 group-hover:text-purple-400 tracking-widest transition-colors">🛡️ Escudo do Mestre (Rolar Oculto)</span>
                            </label>
                          )}
                          <form onSubmit={handleChatSubmit} className="flex gap-2">
                            <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Mensagem ou /r 1d20..." className="flex-1 bg-black border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-700" />
                            <button type="submit" className="bg-amber-900/80 hover:bg-amber-700 text-amber-100 px-4 rounded text-[10px] font-bold uppercase tracking-widest border border-amber-700 transition-colors">Enviar</button>
                          </form>
                        </div>
                      </div>
                    )}
                 </div>
               </div>
           </div>
        )}

        {/* MODAL DE CADASTRAR PRODUTO DO MESTRE */}
        {isMasterMode && showCatalogForm && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-950 border border-purple-900/50 rounded-xl p-6 w-full max-w-md shadow-2xl">
               <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm border-b border-purple-900/30 pb-2 mb-4">{editingCatalogIndex !== null ? "🔧 Editar Produto" : "📦 Cadastrar Produto"}</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Nome</label><input type="text" value={catalogForm.name} onChange={(e) => setCatalogForm({...catalogForm, name: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                 <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Preço (Lc)</label><input type="number" value={catalogForm.price} onChange={(e) => setCatalogForm({...catalogForm, price: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                 <div className="col-span-1"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Peso (kg)</label><input type="number" step="0.1" value={catalogForm.weight} onChange={(e) => setCatalogForm({...catalogForm, weight: Number(e.target.value)})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
                 <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Tipo</label><select value={catalogForm.type} onChange={(e) => setCatalogForm({...catalogForm, type: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500"><option>Consumível</option><option>Equipamento</option><option>Arma</option><option>Alquimia</option></select></div>
                 <div className="col-span-2"><label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Descrição</label><input type="text" value={catalogForm.desc} onChange={(e) => setCatalogForm({...catalogForm, desc: e.target.value})} className="w-full bg-black/50 border border-purple-900/50 rounded p-2 text-white text-sm focus:outline-none focus:border-purple-500" /></div>
               </div>
               <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setShowCatalogForm(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white uppercase transition-colors">Cancelar</button>
                 <button onClick={handleSaveCatalogItem} className="px-4 py-2 text-xs font-bold bg-purple-900 hover:bg-purple-700 text-white rounded uppercase transition-colors shadow-lg">Salvar Produto</button>
               </div>
            </div>
          </div>
        )}

        {['compêndio', 'personagens'].includes(currentPage) && (
          <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in opacity-50">
            <span className="text-6xl mb-4 text-zinc-700">🚧</span>
            <h2 className="text-2xl font-bold text-zinc-500 uppercase tracking-widest">Área em Construção</h2>
            <p className="text-zinc-600 mt-2 text-center max-w-md">A entidade do código ainda está a moldar esta realidade. Volte em breve para aceder à aba de {currentPage}.</p>
          </div>
        )}

        <div className={currentPage === 'ficha' ? 'animate-fade-in' : 'hidden'}>
           {renderCharacterSheet()}
        </div>

      </main>
    </div>
  );
}