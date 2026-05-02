import { useState, useEffect } from 'react';
import mosasaurusSkull from './assets/mosasaurus-skull.png';

// 1. Criamos um "Molde" menor
function AttributeCircle({ name, short, value, customClass }) 
{
  return (
    // Reduzi de w-32/h-32 para w-20/h-20 (telas pequenas) e w-24/h-24 (telas maiores)
    <div className={`absolute flex flex-col items-center justify-between w-20 h-20 sm:w-24 sm:h-24 border-2 border-white rounded-full p-1 sm:p-2 bg-black/60 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] ${customClass}`}>
      
      {/* Reduzi o tamanho do número */}
      <div className="flex-1 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
        {value}
      </div>
      
      {/* Reduzi o texto e a margem inferior */}
      <div className="w-full flex flex-col items-center pb-1 text-white">
        <div className="w-3/4 h-[1px] bg-white/70 mb-1"></div>
        <span className="text-[6px] sm:text-[8px] tracking-widest uppercase font-light leading-none">{name}</span>
        <span className="text-xs sm:text-sm font-bold uppercase leading-none">{short}</span>
      </div>
      
    </div>
  );
}

// 2. Montamos a Ficha na Tela
function App() {
  // Criamos um estado para guardar a ficha do Kael. Começa vazio (null)
  const [character, setCharacter] = useState(null);

  // Quando a tela carregar, vamos buscar os dados na API
 // Quando a tela carregar, vamos buscar os dados na API
  useEffect(() => {
    // Olha a porta 5104 aqui!
    fetch('http://localhost:5104/api/characters/1') 
      .then(response => response.json())
      .then(data => {
        console.log("Ficha recebida!", data);
        setCharacter(data);
      })
      .catch(error => console.error("Erro ao buscar a ficha:", error));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      
      {/* Container Principal: É um quadrado flexível que segura o crânio e os círculos */}
      <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
        
        {/* A Imagem do Crânio no fundo */}
        <img 
          src={mosasaurusSkull} 
          alt="Crânio do Mosassauro" 
          className="absolute inset-0 w-full h-full object-contain opacity-90"
        />

        {/* O Título Centralizado */}
        <div className="absolute text-white text-xl sm:text-3xl tracking-widest uppercase z-10 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          Atributos
        </div>

       {/* Os 6 Círculos com seu posicionamento original e valores dinâmicos da API */}
        <AttributeCircle name="Intelecto" short="INT" value={character ? character.intellect : "-"} customClass="top-[22%] left-1/2 -translate-x-1/2" />
        <AttributeCircle name="Presença" short="PRE" value={character ? character.presence : "-"} customClass="top-[35%] right-[25%]" />
        <AttributeCircle name="Agilidade" short="AGI" value={character ? character.agility : "-"} customClass="bottom-[30%] right-[27%]" />
        <AttributeCircle name="Vigor" short="VIG" value={character ? character.vigor : "-"} customClass="bottom-[17%] left-1/2 -translate-x-1/2" />
        <AttributeCircle name="Força" short="FOR" value={character ? character.strength : "-"} customClass="bottom-[30%] left-[27%]" />
        <AttributeCircle name="Instinto" short="INS" value={character ? character.instinct : "-"} customClass="top-[35%] left-[25%]" />
      </div>
    </div>
  );
}

export default App;