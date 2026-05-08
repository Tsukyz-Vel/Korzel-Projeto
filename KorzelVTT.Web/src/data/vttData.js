// src/data/vttData.js
// Dados de exemplo para preencher o visual do VTT (Mapa/Sidebar)

export const scenesList = [
  { id: 1, name: "Docas Sombrias", active: true },
  { id: 2, name: "Taverna do Sangue", active: false }
];

export const tokensList = [
  { id: 101, name: "Kael, o Quebra-Marés", image: "https://i.imgur.com/8N4N3kU.png", x: 45, y: 55 }, // Portrait do token no mapa
];

// Dados para a Sidebar "Fichas" como visto na sua image_1.png
export const vttCharactersData = [
  { id: 1, name: "Kael, o Quebra-Marés", class: "Kor'Gath - Guerreiro Nível 1", initial: "K", color: "red" },
  { id: 2, name: "Elara Mão-Fria", class: "Humana - Ladina Nível 3", initial: "F", color: "purple" },
  { id: 3, name: "Grum, o Devorador", class: "Morvani - Atormentado Nível 2", initial: "G", color: "amber" },
];

export const chatLogsData = [
  { id: 1, user: "Mestre", type: "text", content: "A névoa se dissipa nas docas..." },
  { id: 2, user: "Kael", type: "roll", content: "Teste de Percepção: 18 (Dado: 14 + 4)" },
];