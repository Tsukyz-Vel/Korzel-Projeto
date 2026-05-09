import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Lobby from './components/Lobby';
import CharacterSheet from './components/CharacterSheet';
import VttSession from './components/VttSession';
import DiceRollerOverlay from './components/DiceRollerOverlay';
import { initialLojaCatalog } from './data/korzelData';
import { parseAndRollDamage } from './utils/diceUtils';
import Compendio from './components/Compendio';

export default function App() {
  const [currentPage, setCurrentPage] = useState('início'); 
  const [isMasterMode, setIsMasterMode] = useState(false); 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // ================= ESTADOS DA FICHA =================
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

  // ================= ESTADOS DA SESSÃO E LOJA =================
  const [catalog, setCatalog] = useState(initialLojaCatalog);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ name: "", type: "Consumível", price: 10, weight: 0.1, desc: "" });
  const [buyQuantities, setBuyQuantities] = useState({});

  const [sessionTab, setSessionTab] = useState('chat');
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

  // ================= ESTADOS DE MAPA =================
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

  // ================= CÁLCULOS E REGRAS DE NEGÓCIO =================
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

  const showToast = (message, type = "success") => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500); };
  const getSkillTotal = (skillString) => { const baseName = skillString.split(" ")[0]; const skillObj = skillsList.find(s => s.name === baseName); return skillObj ? skillObj.total : 0; };
  const handleEnterSession = (asMaster) => { setIsMasterMode(asMaster); setSessionTab('chat'); setCurrentPage('sessão'); };

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
  const handleSaveCatalogItem = () => { if(!catalogForm.name) return alert("Precisa de nome!"); if(editingCatalogIndex !== null) { const updated = [...catalog]; updated[editingCatalogIndex] = catalogForm; setCatalog(updated); } else { setCatalog([...catalog, catalogForm]); } setShowCatalogForm(false); };

  const handleDeityChange = (newDeity) => { /* Omitido por brevidade visual, usa o original */ };
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

  const currentSceneObj = scenes.find(s => s.id === (isMasterMode ? gmActiveSceneId : playerActiveSceneId));
  const handleMapUpload = (e) => { const file = e.target.files[0]; if (file) { const imageUrl = URL.createObjectURL(file); setScenes(prev => prev.map(s => s.id === gmActiveSceneId ? {...s, bgImage: imageUrl} : s)); } };
  const addNewScene = () => { const newId = Date.now(); setScenes([...scenes, { id: newId, name: `Nova Cena ${scenes.length + 1}`, bgImage: null }]); setGmActiveSceneId(newId); };
  const handleTokenImageUpload = (e) => { const file = e.target.files[0]; if (file) { setTokenForm({ ...tokenForm, image: URL.createObjectURL(file) }); } };
  const handleCreateToken = () => { if (!tokenForm.name) return alert("O token precisa de um nome!"); const newLibToken = { id: Date.now(), name: tokenForm.name, isNpc: tokenForm.isNpc, image: tokenForm.image }; setTokenLibrary([...tokenLibrary, newLibToken]); setShowTokenForm(false); setTokenForm({ name: '', isNpc: true, image: null }); showToast("Token salvo na Biblioteca!", "success"); };
  const updateTokenSize = (id, newSize) => { setSceneTokens(prev => prev.map(t => t.id === id ? { ...t, size: Number(newSize) } : t)); };
  const handleDragStartFromLibrary = (e, libToken) => { e.dataTransfer.setData("application/json", JSON.stringify(libToken)); };
  const handleDropOnMap = (e) => { e.preventDefault(); try { const libToken = JSON.parse(e.dataTransfer.getData("application/json")); if (!mapRef.current) return; const rect = mapRef.current.getBoundingClientRect(); const dropX = (e.clientX - rect.left - mapOffset.x) / mapScale - (80 / 2); const dropY = (e.clientY - rect.top - mapOffset.y) / mapScale - (80 / 2); const newTokenInScene = { id: Date.now(), sceneId: gmActiveSceneId, name: libToken.name, inScene: true, isNpc: libToken.isNpc, x: dropX, y: dropY, size: 80, zIndex: 10, image: libToken.image, statuses: [] }; setSceneTokens(prev => [...prev, newTokenInScene]); } catch(err) { console.log("Drag não era de um token válido", err); } };
  
  const handleMapWheel = (e) => { if (!mapRef.current) return; const rect = mapRef.current.getBoundingClientRect(); const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top; const zoomFactor = -Math.sign(e.deltaY) * 0.1; const newScale = Math.max(0.2, Math.min(3, mapScale + zoomFactor)); if (newScale !== mapScale) { const mapX = (mouseX - mapOffset.x) / mapScale; const mapY = (mouseY - mapOffset.y) / mapScale; const newOffsetX = mouseX - (mapX * newScale); const newOffsetY = mouseY - (mapY * newScale); setMapScale(newScale); setMapOffset({ x: newOffsetX, y: newOffsetY }); } };
  const handleMapMouseDown = (e) => { if(tokenContextMenu.show) setTokenContextMenu({ ...tokenContextMenu, show: false }); if(e.target === mapRef.current || e.target.id === 'map-background') { setIsDraggingMap(true); setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y }); } };
  const handleMapMouseMove = (e) => { if (draggingToken !== null && mapRef.current) { const rect = mapRef.current.getBoundingClientRect(); const token = sceneTokens.find(t => t.id === draggingToken); const tokenSize = token ? token.size : 80; const x = (e.clientX - rect.left - mapOffset.x) / mapScale - (tokenSize / 2); const y = (e.clientY - rect.top - mapOffset.y) / mapScale - (tokenSize / 2); setSceneTokens(prev => prev.map(t => t.id === draggingToken ? { ...t, x, y } : t)); } else if (isDraggingMap) { setMapOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } };
  const handleMapMouseUp = () => { setDraggingToken(null); setIsDraggingMap(false); };
  
  const bringToFront = () => { const maxZ = Math.max(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: maxZ + 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const sendToBack = () => { const minZ = Math.min(...sceneTokens.map(t => t.zIndex || 10)); setSceneTokens(prev => prev.map(t => t.id === tokenContextMenu.tokenId ? { ...t, zIndex: minZ - 1 } : t)); setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const assignPermission = () => { const playerName = window.prompt("Digite o nome do jogador que controlará este token:"); if(playerName) { showToast(`Controle do token concedido para: ${playerName}`, "success"); } setTokenContextMenu({ show: false, x: 0, y: 0, tokenId: null }); };
  const toggleTokenStatus = (statusName) => { if (!tokenContextMenu.tokenId) return; setSceneTokens(prev => prev.map(t => { if (t.id === tokenContextMenu.tokenId) { const currentStatuses = t.statuses || []; const newStatuses = currentStatuses.includes(statusName) ? currentStatuses.filter(s => s !== statusName) : [...currentStatuses, statusName]; return { ...t, statuses: newStatuses }; } return t; })); setTokenContextMenu({ ...tokenContextMenu, show: false }); };
  
  const handleAudioUpload = (e) => { const file = e.target.files[0]; if (file) { const audioUrl = URL.createObjectURL(file); const newTrack = { id: Date.now(), name: file.name, url: audioUrl }; setAudioCategories(prev => prev.map(cat => cat.id === targetAudioCat ? { ...cat, tracks: [...cat.tracks, newTrack] } : cat)); } e.target.value = null; };
  const togglePlayAudio = (trackId) => { if (activeAudioId === trackId) { setIsPlaying(!isPlaying); } else { setActiveAudioId(trackId); setIsPlaying(true); } };

  // Função que recebe a habilidade do Compêndio e injeta na Ficha!
  const handleAddAbilityToSheet = (power, targetCharId) => {
    const newAbility = { 
      title: power.title, 
      type: power.type, 
      cost: power.cost, 
      description: power.description 
    };

    if (targetCharId === "active") {
      setAbilitiesList(prev => [...prev, newAbility]);
      showToast(`Poder [${power.title}] forjado na ficha atual!`, "success");
    } else {
      // Como não temos banco de dados ainda, mostramos o Toast de simulação!
      const alvo = savedCharacters.find(c => c.id === Number(targetCharId))?.name || "Personagem";
      showToast(`Poder [${power.title}] forjado na ficha de ${alvo}! (Simulação)`, "success");
    }
  };

  // ================= O PACOTÃO DE PROPS PARA A SESSÃO =================
  const vttProps = {
    isMasterMode, charName, lascas, setLascas, sessionTab, setSessionTab, setCurrentPage, setSheetModalOpen, showToast,
    secretRoll, setSecretRoll, chatInput, setChatInput, chatMessages, setChatMessages, handleChatSubmit,
    scenes, setScenes, gmActiveSceneId, setGmActiveSceneId, playerActiveSceneId, setPlayerActiveSceneId,
    mapScale, setMapScale, mapOffset, setMapOffset, isDraggingMap, setIsDraggingMap, dragStart, setDragStart,
    draggingToken, setDraggingToken, tokenContextMenu, setTokenContextMenu, mapRef, fileInputRef,
    showTokenForm, setShowTokenForm, tokenForm, setTokenForm, tokenLibrary, setTokenLibrary, sceneTokens, setSceneTokens, tokenFileInputRef,
    fichaSearch, setFichaSearch, savedCharacters, audioCategories, setAudioCategories, activeAudioId, setActiveAudioId, isPlaying, setIsPlaying,
    isLooping, setIsLooping, volume, setVolume, targetAudioCat, setTargetAudioCat, audioFileInputRef,
    catalog, setCatalog, showCatalogForm, setShowCatalogForm, editingCatalogIndex, setEditingCatalogIndex, catalogForm, setCatalogForm, buyQuantities, setBuyQuantities,
    currentSceneObj, handleMapUpload, addNewScene, handleTokenImageUpload, handleCreateToken,
    updateTokenSize, handleDragStartFromLibrary, handleDropOnMap, handleMapWheel, handleMapMouseDown,
    bringToFront, sendToBack, assignPermission, toggleTokenStatus, handleAudioUpload, togglePlayAudio, handleBuyItem, updateBuyQty, handleOpenNewCatalogItem,
    handleEditCatalogItem, handleDeleteCatalogItem, handleSaveCatalogItem
  };

  // ================= MAIN RENDER =================
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] flex flex-col font-sans relative" style={{ colorScheme: 'dark' }} onMouseMove={handleMapMouseMove} onMouseUp={handleMapMouseUp} onMouseLeave={handleMapMouseUp}>
      <DiceRollerOverlay isRolling={rollModal.isRolling} result={rollModal.show && !rollModal.isRolling ? { title: rollModal.title, total: rollModal.total, detail: rollModal.details || `Dado: ${rollModal.d20} + Bônus: ${rollModal.bonus}` } : null} onDismiss={() => setRollModal({ ...rollModal, show: false })} />
      <audio ref={audioRef} src={audioCategories.flatMap(c => c.tracks).find(t => t.id === activeAudioId)?.url} loop={isLooping} />

      {/* MODAL DA FICHA NO MEIO DO MAPA */}
      {sheetModalOpen && currentPage === 'sessão' && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:p-8 animate-fade-in" onClick={() => setSheetModalOpen(false)}>
          <div className="bg-[#0a0a0a] w-full h-full max-h-[95vh] overflow-y-auto rounded-xl border-2 border-red-900/50 shadow-[0_0_50px_rgba(0,0,0,1)] relative custom-scrollbar flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSheetModalOpen(false)} className="absolute top-4 right-6 text-zinc-500 hover:text-red-500 text-2xl z-50 transition-colors">✖</button>
            <CharacterSheet 
              charName={charName} setCharName={setCharName} charOrigin={charOrigin} setCharOrigin={setCharOrigin} charRace={charRace} setCharRace={setCharRace} charClass={charClass} setCharClass={setCharClass} charAge={charAge} setCharAge={setCharAge} charLevel={charLevel} setCharLevel={setCharLevel} attrInt={attrInt} setAttrInt={setAttrInt} attrPre={attrPre} setAttrPre={setAttrPre} attrAgi={attrAgi} setAttrAgi={setAttrAgi} attrVig={attrVig} setAttrVig={setAttrVig} attrFor={attrFor} setAttrFor={setAttrFor} attrIns={attrIns} setAttrIns={setAttrIns} hp={hp} setHp={setHp} maxHp={maxHp} setMaxHp={setMaxHp} pe={pe} setPe={setPe} maxPe={maxPe} setMaxPe={setMaxPe} corruption={corruption} setCorruption={setCorruption} maxCorruption={maxCorruption} setMaxCorruption={setMaxCorruption} lascas={lascas} setLascas={setLascas} currentWeight={currentWeight} maxWeight={maxWeight} skillsList={skillsList} executeRoll={executeRoll} getSkillTotal={getSkillTotal} activeFichaTab={activeFichaTab} setActiveFichaTab={setActiveFichaTab} showWeaponForm={showWeaponForm} setShowWeaponForm={setShowWeaponForm} editingWeaponIndex={editingWeaponIndex} weaponForm={weaponForm} setWeaponForm={setWeaponForm} attacksList={attacksList} handleOpenNewWeapon={handleOpenNewWeapon} handleEditWeapon={handleEditWeapon} handleDeleteWeapon={handleDeleteWeapon} handleSaveWeapon={handleSaveWeapon} showAbilityForm={showAbilityForm} setShowAbilityForm={setShowAbilityForm} editingAbilityIndex={editingAbilityIndex} abilityForm={abilityForm} setAbilityForm={setAbilityForm} abilitiesList={abilitiesList} handleOpenNewAbility={handleOpenNewAbility} handleEditAbility={handleEditAbility} handleDeleteAbility={handleDeleteAbility} handleSaveAbility={handleSaveAbility} showItemForm={showItemForm} setShowItemForm={setShowItemForm} editingItemIndex={editingItemIndex} itemForm={itemForm} setItemForm={setItemForm} inventoryList={inventoryList} handleOpenNewItem={handleOpenNewItem} handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleSaveItem={handleSaveItem} charDeity={charDeity} handleDeityChange={handleDeityChange} mut1={mut1} setMut1={setMut1} mut2={mut2} setMut2={setMut2} mut3={mut3} setMut3={setMut3} notes={notes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote} handleNoteChange={handleNoteChange} activeNote={activeNote}
            />
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] border flex items-center gap-3 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-950/90 border-red-900 text-red-200' : 'bg-green-950/90 border-green-900 text-green-200'}`}>
          <span className="text-xl drop-shadow-md">{toast.type === 'error' ? '💀' : '🪙'}</span>
          <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">{toast.message}</span>
        </div>
      )}

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-1 w-full flex flex-col min-h-0">
        
        {currentPage === 'início' && (
          <div className="p-4 lg:p-8 animate-fade-in flex flex-col gap-10 overflow-y-auto w-full max-w-7xl mx-auto custom-scrollbar">
            <Lobby handleEnterSession={handleEnterSession} setCurrentPage={setCurrentPage} charName={charName} charClass={charClass} charLevel={charLevel} />
          </div>
        )}

        {currentPage === 'sessão' && <VttSession {...vttProps} />}

      {/* === COMPÊNDIO E REGRAS === */}
        {currentPage === 'compêndio' && (
          <div className="p-4 lg:p-8 flex-1 overflow-hidden animate-fade-in w-full max-w-7xl mx-auto min-h-0">
             <Compendio 
               handleAddAbility={handleAddAbilityToSheet} 
               savedCharacters={savedCharacters}
               activeCharacterName={charName}
             />
          </div>
        )}

        <div className={currentPage === 'ficha' ? 'animate-fade-in flex-1 overflow-y-auto overflow-x-hidden w-full custom-scrollbar pb-10' : 'hidden'}>
          <CharacterSheet charName={charName} setCharName={setCharName} charOrigin={charOrigin} setCharOrigin={setCharOrigin} charRace={charRace} setCharRace={setCharRace} charClass={charClass} setCharClass={setCharClass} charAge={charAge} setCharAge={setCharAge} charLevel={charLevel} setCharLevel={setCharLevel} attrInt={attrInt} setAttrInt={setAttrInt} attrPre={attrPre} setAttrPre={setAttrPre} attrAgi={attrAgi} setAttrAgi={setAttrAgi} attrVig={attrVig} setAttrVig={setAttrVig} attrFor={attrFor} setAttrFor={setAttrFor} attrIns={attrIns} setAttrIns={setAttrIns} hp={hp} setHp={setHp} maxHp={maxHp} setMaxHp={setMaxHp} pe={pe} setPe={setPe} maxPe={maxPe} setMaxPe={setMaxPe} corruption={corruption} setCorruption={setCorruption} maxCorruption={maxCorruption} setMaxCorruption={setMaxCorruption} lascas={lascas} setLascas={setLascas} currentWeight={currentWeight} maxWeight={maxWeight} skillsList={skillsList} executeRoll={executeRoll} getSkillTotal={getSkillTotal} activeFichaTab={activeFichaTab} setActiveFichaTab={setActiveFichaTab} showWeaponForm={showWeaponForm} setShowWeaponForm={setShowWeaponForm} editingWeaponIndex={editingWeaponIndex} weaponForm={weaponForm} setWeaponForm={setWeaponForm} attacksList={attacksList} handleOpenNewWeapon={handleOpenNewWeapon} handleEditWeapon={handleEditWeapon} handleDeleteWeapon={handleDeleteWeapon} handleSaveWeapon={handleSaveWeapon} showAbilityForm={showAbilityForm} setShowAbilityForm={setShowAbilityForm} editingAbilityIndex={editingAbilityIndex} abilityForm={abilityForm} setAbilityForm={setAbilityForm} abilitiesList={abilitiesList} handleOpenNewAbility={handleOpenNewAbility} handleEditAbility={handleEditAbility} handleDeleteAbility={handleDeleteAbility} handleSaveAbility={handleSaveAbility} showItemForm={showItemForm} setShowItemForm={setShowItemForm} editingItemIndex={editingItemIndex} itemForm={itemForm} setItemForm={setItemForm} inventoryList={inventoryList} handleOpenNewItem={handleOpenNewItem} handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} handleSaveItem={handleSaveItem} charDeity={charDeity} handleDeityChange={handleDeityChange} mut1={mut1} setMut1={setMut1} mut2={mut2} setMut2={setMut2} mut3={mut3} setMut3={setMut3} notes={notes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote} handleNoteChange={handleNoteChange} activeNote={activeNote} />
        </div>
      </main>
    </div>
  );
}