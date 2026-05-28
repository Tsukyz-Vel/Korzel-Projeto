import React, { useState } from 'react';
import mosasaurusSkull from '../assets/mosasaurus-skull.png';

// === LORE E MANUSCRITO (VERSÃO ÉPICA) ===
const loreText = `Em eras que se perdem no véu do tempo, quando as estrelas no céu ainda aprendiam seus nomes, Korzel já pulsava com vida primitiva, visceral e feroz. Aqui, os senhores da terra não possuíam mãos hábeis ou palavras faladas, mas garras que dilaceravam montanhas, mandíbulas como muralhas vivas e olhos antigos o bastante para testemunhar o nascimento — e a morte — dos primeiros vulcões.

Korzel nunca foi um mundo de quietude. É um orbe de répteis colossais e feras titânicas, de vastos pântanos que sussurram segredos esquecidos e florestas tão fechadas que até o vento caminha com cuidado entre seus galhos. As criaturas que dominam estas terras não são ecos de um passado extinto — são os soberanos absolutos do agora. Linhagens que, em outros mundos, teriam desaparecido sob a poeira da história... aqui evoluíram. Adaptaram-se. Tornaram-se predadores perfeitos, conscientes de seu lugar no ciclo natural e do trono que ocupam sobre ele.

Neste palco hostil e magnífico, a humanidade não surgiu como herdeira legítima. Surgiu como uma intrusa indesejada.

Diz-se que os primeiros homens despertaram em ilhas dispersas do Grande Arquipélago de Sahl’Narra, os chamados 'Corações Dispersos'. Isolados por milênios, aprenderam a sobreviver à sombra dos titãs reptilianos. Cercados por mares insondáveis e bestas marinhas de fôlego eterno, aprenderam primeiro a temer... e depois, a respeitar a majestade sangrenta dos Antigos.

Korzel não pertence aos homens. Pertence aos seres Primordiais. Às feras que nunca caíram. Às bestas que não esqueceram seu direito divino de governar. Cada dia em que o sol nasce sobre este mundo é apenas um empréstimo — um breve instante de fôlego concedido aos frágeis, antes que os verdadeiros donos da Terra os lembrem de quem sempre reinou, e quem sempre reinará.`;
// === BASE DE DADOS DO COMPÊNDIO ===
const classesData = [
  {
    name: "Guerreiro",
    desc: "Mestres do combate marcial, treinados para sobreviver com técnica, armaduras pesadas e o puro domínio das armas.",
    stats: {
      hp: "20 + Vigor Inicial (+5 + Vig por nível)",
      pe: "3 por nível",
      proficiencies: "Armas marciais, armaduras pesadas e escudos.",
      skills: "Luta (For) ou Pontaria (Agi), Fortitude (Vig). Mais 2 entre: Atletismo, Guerra, Iniciativa, Intimidação, Ofício."
    },
    fixedAbilities: [
      { title: "Ataque Especial", type: "Habilidade de Classe", cost: "1+ PE", description: "Nvl 1: Gaste 1 PE para +4 no ataque ou +1 dado de dano. \nEscalonamento:\n- Nível 5: 2 PE para +8 ataque ou +2 dados de dano.\n- Nível 9: 3 PE para +12 ataque ou +3 dados de dano.\n- Nível 13: 4 PE para +16 ataque ou +4 dados de dano.\n- Nível 17: 5 PE para +20 ataque ou +5 dados de dano." },
      { title: "Técnica de Combate", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Você não sofre penalidade de armadura em testes de Iniciativa e seu deslocamento não é reduzido por usar armaduras pesadas." },
      { title: "Campeão de Guerra", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 20: O custo em PE do seu Ataque Especial cai pela metade (arredondado para baixo, mínimo 1). Além disso, sempre que rolar Iniciativa, recupera imediatamente 5 PE." }
    ],
    powers: [
      { title: "Postura do Anquilossauro", type: "Postura de Combate", cost: "Mov", description: "(Armas Pesadas/Duas Mãos)\nPassivo: Recebe +3 no Dano e ignora 2 pontos de RD do alvo.\nAtivo (Esmagar): Gaste 2 PE ao rolar dano. O alvo faz um teste de Fortitude; em caso de falha, você quebra a perna dele e diminui seu deslocamento pela metade." },
      { title: "Postura do Raptor", type: "Postura de Combate", cost: "Mov", description: "(Armas Leves/Ágeis)\nPassivo: Você se move baixo. Ganha +3m de Deslocamento e +1 na Defesa.\nAtivo (Frenesi): Ao usar a ação atacar, gaste 2 PE para fazer um ataque extra imediato." },
      { title: "Postura do Triceratops", type: "Postura de Combate", cost: "Mov", description: "(Escudos)\nPassivo: Você vira uma barreira. Aumenta o bônus de Defesa do escudo em +2.\nAtivo (Escudo Ósseo): Reação. Gaste 1 PE quando um aliado adjacente for atacado. O ataque é redirecionado para o seu escudo (usa a sua Defesa)." },
      { title: "Postura da Serpente", type: "Postura de Combate", cost: "Mov", description: "(Hastes/Lanças/Chicotes)\nPassivo: Aumenta o alcance dos seus ataques em +1,5m.\nAtivo (Bote): Se um inimigo entrar no seu alcance, gaste 1 PE para fazer um Ataque de Oportunidade contra ele." },
      { title: "Desarmar Técnico", type: "Poder de Guerreiro", cost: "2 PE", description: "Ao acertar um ataque, gaste 2 PE. Além do dano, faça um teste de manobra (Ataque vs Força). Se vencer, o alvo solta a arma, que cai a 3m." },
      { title: "Golpe em Arco", type: "Poder de Guerreiro", cost: "2 PE", description: "Gaste 2 PE. Se reduzir um inimigo a 0 PV com ataque corpo a corpo, realiza imediatamente um ataque extra em outro inimigo adjacente." },
      { title: "Estocada na Junta", type: "Poder de Guerreiro", cost: "2 PE", description: "Gaste 2 PE antes de atacar. Você sofre -2 no teste de ataque, mas o golpe ignora totalmente a Redução de Dano (RD) do alvo." },
      { title: "Quebrar Postura", type: "Poder de Guerreiro", cost: "1 PE", description: "Gaste 1 PE ao acertar um ataque. O inimigo perde a Reação e não pode realizar Ataques de Oportunidade até o início do próximo turno dele." },
      { title: "Golpe de Escudo", type: "Poder de Guerreiro", cost: "1 PE", description: "(Requer escudo). Ao acertar um ataque com arma, gaste 1 PE para bater também com o escudo (dano de arma leve). Se acertar, empurra o alvo 1,5m." },
      { title: "Durão", type: "Poder de Guerreiro", cost: "2 a 5 PE", description: "Reação. Quando sofre dano, você pode gastar 2 PE para reduzir esse dano à metade, ou gastar 5 PE para reduzir danos massivos/críticos pela metade." },
      { title: "Tornado de Dor", type: "Poder de Guerreiro", cost: "5 PE", description: "Ação Completa. Gaste 5 PE. Você gira e realiza um ataque corpo a corpo contra CADA inimigo ao seu alcance." },
      { title: "Golpe Pessoal", type: "Poder de Guerreiro", cost: "2 PE", description: "(Customizável). Gaste 2 PE para realizar um ataque com um efeito visual e mecânico único (ex: Corte de Fogo, Estocada Longa). Efeito definido com o Mestre." },
      { title: "Valentão", type: "Poder de Guerreiro", cost: "Passivo", description: "Você recebe +2 em testes de ataque e dano contra inimigos caídos, flanqueados, desprevenidos ou atordoados." },
      { title: "Crítico Brutal", type: "Poder de Guerreiro", cost: "Passivo", description: "Pré-requisito: Nível 6. Seu multiplicador de crítico aumenta em +1 (ex: uma arma x2 passa a causar crítico x3)." },
      { title: "Romper", type: "Poder de Guerreiro", cost: "2 PE", description: "Gaste 2 PE. Você desfere um golpe contra um objeto ou arma do inimigo. Ignora a RD do objeto. Se destruir a arma do oponente, o dano excedente passa para o portador." },
      { title: "Recuperar o Fôlego", type: "Poder de Guerreiro", cost: "Até 3 PE", description: "Ação Padrão. Cure 1d10 PV para cada ponto de PE gasto (máximo 3 PE). Usável uma vez por cena." },
      { title: "Especialização em Armadura", type: "Poder de Guerreiro", cost: "Passivo", description: "Você sabe usar as placas para desviar golpes. Aumenta a Defesa de qualquer armadura média ou pesada em +2." },
      { title: "Imbatível", type: "Poder de Guerreiro", cost: "Passivo", description: "Enquanto tiver pelo menos 1 PE sobrando, você não cai inconsciente ao chegar a 0 PV (continua lutando, mas morre se atingir o limite negativo total da sua vida)." },
      { title: "Vontade de Soldado", type: "Poder de Guerreiro", cost: "2 PE", description: "Reação. Se falhar em um teste de Vontade (medo, charme, controle mental), gaste 2 PE para rolar novamente." },
      { title: "Riposta", type: "Poder de Guerreiro", cost: "2 PE", description: "Reação. Se um inimigo errar um ataque corpo a corpo contra você, gaste 2 PE para realizar um ataque imediato contra ele." },
      { title: "Líder de Pelotão", type: "Poder de Guerreiro", cost: "3 PE", description: "Ação de Movimento. Gaste 3 PE. Todos os aliados a até 9m ganham uma ação de movimento extra imediata." },
      { title: "Provocação (Rugido)", type: "Poder de Guerreiro", cost: "1 PE", description: "Ação Padrão. Inimigos a curta distância fazem teste de Vontade. Falhas os deixam com -5 para atacar qualquer alvo que não seja você." },
      { title: "Ataque Reflexo", type: "Poder de Guerreiro", cost: "1 PE", description: "Se um inimigo ficar desprevenido ou se mover DENTRO do seu alcance, gaste 1 PE para fazer um Ataque de Oportunidade extra (não gasta sua Reação da rodada)." },
      { title: "Bater e Correr", type: "Poder de Guerreiro", cost: "Passivo", description: "Ao realizar a ação atacar, é possível se mover antes e depois do ataque, desde que o movimento total não exceda o deslocamento máximo." },
      { title: "Planejamento Marcial", type: "Poder de Guerreiro", cost: "Passivo", description: "No início do dia, escolha 1 Poder de Combate Geral que você não possua. Você adquire esse poder temporariamente até o próximo descanso longo." },
      { title: "Predador Apex", type: "Poder de Guerreiro", cost: "Passivo", description: "Pré-requisito: Nível 12 e ter 2+ Posturas. Mantém DUAS Posturas ativas ao mesmo tempo, soma os benefícios passivos de ambas e possui acesso aos dois ativos." }
    ]
  },
  {
    name: "Espadachim",
    desc: "Oriundos da Ilha de Azhkhaanor, ao norte das terras gélidas, os Espadachins são mestres da disciplina e do aço. Eles não buscam a força bruta, mas o corte perfeito. Em um mundo de monstros gigantes, eles são a lâmina que encontra a fenda na escama, guiados por um código de honra implacável.",
    stats: {
      hp: "18 + Vigor Inicial (+5 + Vig por nível)",
      pe: "3 + Agilidade Inicial (+3 por nível)",
      proficiencies: "Armas simples, armas marciais (foco em lâminas e arcos longos), armaduras leves e médias.",
      skills: "Luta (Agi ou For), Iniciativa (Agi) e Acrobacia (Agi). Mais 3 entre: Intuição, Percepção, Atletismo, Vontade, Erudição, Diplomacia."
    },
    fixedAbilities: [
      { title: "Corte de Precisão", type: "Habilidade de Classe", cost: "1+ PE", description: "Nvl 1: Gaste 1 PE para adicionar +1d6 de dano extra ao focar num ponto vital do inimigo.\nEscalonamento:\n- Nível 5: 2 PE para +1d8 de dano.\n- Nível 9: 3 PE para +1d10 de dano.\n- Nível 13: 4 PE para +1d12 de dano.\n- Nível 17: 5 PE para +2d8 de dano." },
      { title: "Guarda de Azhkhaanor", type: "Habilidade de Classe", cost: "Passivo / 1 PE", description: "Nvl 1: Enquanto empunhar arma de lâmina e armadura não-pesada, recebe +1 passivo na Defesa. \nReação: Se atacado corpo a corpo, pode gastar 1 PE para ganhar +2 na Defesa contra aquele ataque." },
      { title: "Mestre do Horizonte", type: "Habilidade de Classe", cost: "5 PE", description: "Nvl 20 (Ação Completa): Gaste 5 PE. Você se move e ataca corpo a corpo TODOS os inimigos em 9m. O dano ignora RD e Imunidades físicas. Você ressurge em qualquer ponto desocupado da área após os golpes." }
    ],
    powers: [
      { title: "Postura do Vento", type: "Postura Elemental", cost: "Mov", description: "Passivo: Passos leves. Ganha +3m de deslocamento e ignora terreno difícil.\nAtivo (Furacão): Ao Atacar, gaste 2 PE para desferir um ataque extra imediato (penalidade de -2 no acerto)." },
      { title: "Postura da Montanha", type: "Postura Elemental", cost: "Mov ", description: "Passivo: Aterra seu peso. Recebe +2 na Defesa (se não se mover) e imunidade a derrubadas/empurrões.\nAtivo (Fenda): Gaste 2 PE antes de atacar. O golpe ignora totalmente a RD do alvo." },
      { title: "Postura da Chama", type: "Postura Elemental", cost: "Mov", description: "Passivo: Lâmina agressiva. +2 no dano corpo a corpo e +2 em Intimidação.\nAtivo (Labareda): Reação. Ao sofrer dano adjacente, gaste 2 PE para realizar um ataque imediato de retaliação." },
      { title: "Postura do Rio", type: "Postura Elemental", cost: "Mov", description: "Passivo: Desengajar vira Ação Bônus. Soma Agilidade em manobras (Desarmar/Derrubar).\nAtivo (Correnteza): Reação. Se o inimigo errar um golpe corpo a corpo, gaste 2 PE para Desarmá-lo com Vantagem." },
      { title: "Saque Rápido", type: "Poder de Espadachim", cost: "Passivo", description: "Saca ou guarda arma como Ação Livre. Recebe +2 no teste do primeiro ataque realizado na mesma rodada do saque (Iaijutsu)." },
      { title: "Lâmina Corta-Céus", type: "Poder de Espadachim", cost: "Padrão / 3 PE", description: "Golpe rápido que cria pressão de ar. Alcance Médio (9m). Dano: Dano da arma + bônus de Agilidade." },
      { title: "Corte de Contenção", type: "Poder de Espadachim", cost: "Livre / 2 PE", description: "Ao acertar, o alvo sofre apenas metade do dano rolado, mas fica Lento (metade do deslocamento) até o fim do próximo turno dele." },
      { title: "Estilo de Duas Lâminas", type: "Poder de Espadachim", cost: "Passivo", description: "Ao usar a ação Atacar empunhando duas armas leves, pode realizar um ataque extra com a secundária usando Ação Bônus." },
      { title: "Passo das Sombras", type: "Poder de Espadachim", cost: "Livre / 3 PE", description: "Pré-requisito: Nível 8. Move-se rápido demais. Ganha camuflagem total (50% de chance de erro) contra o próximo ataque que sofrer na rodada." },
      { title: "Lâmina de Aço Frio", type: "Poder de Espadachim", cost: "Livre / 2 PE", description: "Ao confirmar Acerto Crítico com arma de lâmina, gaste 2 PE para aumentar o multiplicador de dano em +1 (ex: x2 vira x3)." },
      { title: "Corte de Sacrifício", type: "Poder de Espadachim", cost: "Livre", description: "Ao atacar, sofre -4 na Defesa até o próximo turno para adicionar +2 dados de dano na arma do ataque atual." },
      { title: "Golpe de Execução", type: "Poder de Espadachim", cost: "Padrão / 4 PE", description: "Ataque com -5 no acerto. Se atingir alvo com menos da metade dos PVs máximos, o dano do golpe é dobrado." },
      { title: "Aparar Projétil", type: "Poder de Espadachim", cost: "Reação / 2 PE", description: "Teste de Luta oposto ao ataque à distância inimigo (flechas/arpões). Se vencer, você não sofre dano. Inútil contra pólvora ou área." },
      { title: "Foco de Batalha", type: "Poder de Espadachim", cost: "Bônus / 2 PE", description: "Transe letal por uma rodada inteira. Torna-se imune às condições Abalado, Assustado e Enjoado." },
      { title: "Espírito Inabalável", type: "Poder de Espadachim", cost: "Passivo", description: "Pode somar Agilidade (no lugar de Presença/Intelecto) em testes de Vontade." },
      { title: "Meditação Ágil", type: "Poder de Espadachim", cost: "Completa", description: "1 vez por Descanso Longo: Limpa a mente e recupera 1d6 + Agilidade em PE." },
      { title: "Mestre das Emoções", type: "Poder de Espadachim", cost: "Livre / 2 PE", description: "Se tentarem Intimidação contra você, gaste 2 PE. O efeito ricocheteia e o agressor fica Abalado (-2)." },
      { title: "Honra do Duelo", type: "Poder de Espadachim", cost: "Bônus / 1 PE", description: "Engaja um alvo. Se nenhum aliado atacá-lo, você recebe +2 em Ataque e Dano contra ele." },
      { title: "Golpe Debilitante", type: "Poder de Espadachim", cost: "Livre / 3 PE", description: "Ao acertar, rasga a musculatura. O alvo sofre -2 em Ataque e testes de Força até o início do seu próximo turno." },
      { title: "Presença Majestosa", type: "Poder de Espadachim", cost: "Passivo", description: "Soma Agilidade em vez de Presença em testes de Intimidação." },
      { title: "Vingança Silenciosa", type: "Poder de Espadachim", cost: "Livre / 1 PE", description: "Se um aliado cair a 0 PV na sua visão, seu próximo ataque contra o agressor terá margem de ameaça Crítica +2." },
      { title: "Mestre dos Elementos", type: "Poder de Espadachim", cost: "Passivo", description: "Pré-requisito: Nível 12 e possuir duas Posturas. Pode manter duas Posturas Elementais ativas ao mesmo tempo." }
    ]
  },
  {
    name: "Bárbaro",
    desc: "Guerreiros selvagens, movidos por puro instinto e fúria, que ignoram a dor para destruir os inimigos.",
    stats: {
      hp: "24 + Vigor Inicial (+6 + Vig por nível)",
      pe: "3 + Força Inicial (+3 por nível)",
      proficiencies: "Armas simples, armas marciais e escudos. Não usa armaduras pesadas (atrapalha a Fúria).",
      skills: "Briga (For), Fortitude (Vig). Mais 2 entre: Atletismo, Intuição, Sobrevivência, Rastrear, Adestramento."
    },
    fixedAbilities: [
      { title: "Fúria", type: "Habilidade de Classe", cost: "2 PE", description: "Nvl 1: Recebe +2 em testes de ataque e +3 em rolagens de dano corpo a corpo, mas sofre -2 na Defesa. A Fúria dura até o fim da cena, mas termina caso passe uma rodada sem atacar ou sem sofrer dano.\nEscalonamento:\n- Nível 5: +3 ataque / +4 dano. Ganha RD 2 contra tudo durante a Fúria.\n- Nível 9: +4 ataque / +5 dano. RD 4.\n- Nível 13: +5 ataque / +6 dano. RD 6.\n- Nível 17: +6 ataque / +7 dano. RD 8." },
      { title: "Bárbaro da Tribo", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Usa Força para testes de Intimidação em vez de Presença. O deslocamento base aumenta em +3m quando não utiliza armadura pesada." },
      { title: "Fúria Titânica", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 20: O custo para entrar em Fúria torna-se 0. Durante a Fúria, a Redução de Dano dobra e o personagem não morre por acúmulo de dano (os PV podem descer a valores negativos sem limite; a morte só ocorre se a Fúria terminar com PV negativo)." }
    ],
    powers: [
      { title: "Crítico Brutal", type: "Poder de Bárbaro", cost: "1 PE", description: "Ao confirmar um crítico, gaste 1 PE para aumentar o multiplicador da arma em +1 (ex: x2 vira x3)." },
      { title: "Frenesi", type: "Poder de Bárbaro", cost: "2 PE", description: "Pré-requisito: Nível 4. Durante a Fúria, é possível gastar 2 PE para fazer um ataque adicional como uma Ação Bônus." },
      { title: "Investida Imprudente", type: "Poder de Bárbaro", cost: "Livre", description: "Ataca com Vantagem (rola 2 dados e fica com o melhor), mas os inimigos recebem Vantagem contra você até o próximo turno." },
      { title: "Sangue por Sangue", type: "Poder de Bárbaro", cost: "1 PE", description: "Reação. Durante a Fúria, se um inimigo adjacente causar dano, gaste 1 PE para desferir um ataque imediato contra ele." },
      { title: "Golpe Poderoso", type: "Poder de Bárbaro", cost: "1 PE", description: "Ao acertar um ataque, gaste 1 PE para empurrar o inimigo 3m (caso possua tamanho médio ou menor). Se o alvo bater em uma parede ou objeto, sofre +1d6 de dano extra." },
      { title: "Destruidor", type: "Poder de Bárbaro", cost: "Passivo", description: "Os ataques causam dano dobrado contra objetos e estruturas. Ao destruir um objeto ou abater um inimigo, o personagem ganha PV temporários em quantidade igual à Força." },
      { title: "Arremesso Titânico", type: "Poder de Bárbaro", cost: "2 PE", description: "Ação Padrão. Gaste 2 PE. Agarra uma criatura (Média ou menor) ou um objeto pesado e arremessa a até 6m de distância. O alvo sofre dano igual ao do ataque desarmado e cai no chão." },
      { title: "Empunhadura Gigante", type: "Poder de Bárbaro", cost: "Passivo", description: "Permite usar armas de duas mãos com apenas uma mão (com penalidade de -2 no ataque), o que viabiliza o uso de um escudo ou outra arma leve em conjunto." },
      { title: "Pele Encouraçada", type: "Poder de Bárbaro", cost: "Passivo", description: "Sem armadura, a Defesa aumenta em um valor exato ao modificador de Constituição/Vigor." },
      { title: "Vigor Primal", type: "Poder de Bárbaro", cost: "4 PE", description: "Ação Completa. Gaste 4 PE para recuperar PV em quantidade igual ao seu nível x 5." },
      { title: "Superstição", type: "Poder de Bárbaro", cost: "2 PE", description: "Reação. Quando for alvo de uma magia ou efeito sobrenatural, gaste 2 PE para receber Vantagem no teste de resistência ou para reduzir o dano mágico à metade." },
      { title: "Recusa à Morte", type: "Poder de Bárbaro", cost: "4 PE", description: "Uma vez por descanso, se for reduzido a 0 PV ou menos, gaste 4 PE para permanecer de pé com 1 PV restando." },
      { title: "Cicatrizes de Batalha", type: "Poder de Bárbaro", cost: "Passivo", description: "Recebe +2 PV por nível de personagem (efeito retroativo) e a RD permanente aumenta em 1 (o efeito acumula com a Fúria)." },
      { title: "Alma de Bronze", type: "Poder de Bárbaro", cost: "Passivo", description: "Concede imunidade a condições de Medo e Abalado durante a Fúria." },
      { title: "Espírito Tirano", type: "Poder de Bárbaro", cost: "Passivo", description: "Aumenta a Constituição/Vigor em +1 (é possível escolher este poder até duas vezes, com máximo de +2)." },
      { title: "Rugido Aterrorizante", type: "Poder de Bárbaro", cost: "2 PE", description: "Ação de Movimento. Gaste 2 PE. Inimigos a curta distância realizam um teste de Vontade (CD baseada em Força). Falhas os deixam abalados (sofrem -2 em ataques) por 1 rodada." },
      { title: "Presença Predatória", type: "Poder de Bárbaro", cost: "Passivo", description: "Inimigos de nível inferior (lacaios) não atacam o bárbaro se houver outro alvo disponível na área, devido ao terror instintivo. Concede Vantagem em Intimidação." },
      { title: "Olhar da Morte", type: "Poder de Bárbaro", cost: "1 PE", description: "Gaste 1 PE e encare um inimigo específico. O oponente escolhido sofre penalidade de -2 em todos os testes de resistência contra seus ataques até o fim da cena." },
      { title: "Carga de Juggernaut", type: "Poder de Bárbaro", cost: "3 PE", description: "Gaste 3 PE. Mova-se o dobro do deslocamento base em linha reta. Atravessa espaços ocupados por inimigos; cada inimigo atravessado sofre dano idêntico ao seu modificador de Força e corre o risco de cair." },
      { title: "Sentidos Selvagens", type: "Poder de Bárbaro", cost: "Passivo", description: "Concede visão no escuro e Vantagem garantida em testes de Percepção e Iniciativa." },
      { title: "Rastreador Implacável", type: "Poder de Bárbaro", cost: "Passivo", description: "O personagem utiliza o deslocamento normal durante o rastreio. Consegue rastrear criaturas protegidas por feitiços de disfarce (como invisibilidade) através de faro e som." },
      { title: "Salto da Montanha", type: "Poder de Bárbaro", cost: "1+ PE", description: "Os testes de Atletismo para saltar possuem resultado dobrado automaticamente. Reduz o dano das quedas em 10m para cada 1 PE que gastar (como reação)." },
      { title: "Predador Oportunista", type: "Poder de Bárbaro", cost: "Passivo", description: "Os ataques causam +1d8 de dano contra inimigos previamente feridos (com vida abaixo do PV máximo)." },
      { title: "Força Indomável", type: "Poder de Bárbaro", cost: "Passivo", description: "Pré-requisito: Nível 10+. Se o resultado numérico final de um teste de Força ou Atletismo cair em um valor inferior ao seu atributo Força base, o sistema considera o valor do atributo base como o resultado da rolagem." }
    ]
  },
  {
    name: "Ferreiro",
    desc: "O artesão que molda o aço e quebra os ossos. Ele traz a oficina para o campo de batalha, improvisando armas, melhorando aliados e destruindo as defesas inimigas.",
    stats: {
      hp: "22 + Vigor Inicial (+5 + Vig por nível)",
      pe: "3 + Intelecto Inicial (+3 por nível)",
      proficiencies: "Armas simples e marciais (foco em martelos e machados), armaduras pesadas e escudos.",
      skills: "Ofício (Ferreiro/Engenharia) e Fortitude. Mais 2 entre: Briga, Investigação, Atletismo, Intuição."
    },
    fixedAbilities: [
      { title: "Manutenção de Campo", type: "Habilidade de Classe", cost: "2 PE", description: "Nvl 1: Gaste 10 minutos e 2 PE para aprimorar armas ou armaduras. Afeta 1 item, concedendo +1 (Ataque/Dano ou Defesa) até o próximo descanso longo.\nEscalonamento:\n- Nível 5: Bônus sobe para +2 e afeta 2 itens.\n- Nível 9: Bônus +3 e afeta 3 itens. (Adiciona propriedades, ex: sangramento ou RD 2).\n- Nível 13: Bônus +4 e afeta 4 itens.\n- Nível 17: Bônus +5 e afeta 5 itens." },
      { title: "Olho do Artesão", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Soma o Intelecto nas rolagens de dano com martelos e machados (sabe o ponto fraco da estrutura). Causa dano dobrado contra objetos e construtos." },
      { title: "Mestre da Forja", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 20: A Manutenção de Campo torna-se permanente até que decida desfazê-la. O personagem adquire RD 10 permanente contra Fogo e danos físicos." }
    ],
    powers: [
      { title: "Despedaçar", type: "Poder de Ferreiro", cost: "1 PE", description: "Ao acertar um ataque, gaste 1 PE. Em vez de causar dano extra, reduz a Defesa do alvo em 2 (cumulativo até o fim da cena) ou destrói o escudo dele (caso o dano supere a dureza)." },
      { title: "Ponto de Ruptura", type: "Poder de Ferreiro", cost: "2 PE", description: "Gaste 2 PE antes de atacar. O ataque ignora totalmente a Redução de Dano (RD) e a Dureza do alvo. Em objetos ou construtos lacaios, a destruição é imediata; em chefes, o dano crítico é automático." },
      { title: "Impacto Sísmico", type: "Poder de Ferreiro", cost: "3 PE", description: "(Requer Martelo de Duas Mãos). Ação Padrão. Gaste 3 PE para golpear o chão. Os inimigos adjacentes sofrem dano da arma e testam Fortitude ou caem no chão." },
      { title: "Quebra-Ossos", type: "Poder de Ferreiro", cost: "Passivo", description: "Um acerto crítico com uma arma de esmagamento aplica a condição 'Quebrado' ao alvo (sofre -2 em ataque e defesa e tem o deslocamento reduzido) até que ele receba cura mágica." },
      { title: "Martelo de Arremesso", type: "Poder de Ferreiro", cost: "1 PE", description: "Permite arremessar martelos e machados de combate (alcance curto); as armas retornam para a mão no final do turno devido ao balanceamento perfeito. Gaste 1 PE para aumentar o dano do arremesso em +1d8." },
      { title: "Golpe de Ajuste", type: "Poder de Ferreiro", cost: "1 PE", description: "Gaste 1 PE e faça um ataque. Se acertar, o impacto move o inimigo 3m na direção que você escolher (apenas para inimigos pequenos e médios)." },
      { title: "Desmantelar", type: "Poder de Ferreiro", cost: "2 PE", description: "Reação. Quando um inimigo errar um ataque corpo a corpo contra você, gaste 2 PE para realizar uma manobra de Desarmar ou Quebrar Arma com Vantagem garantida." },
      { title: "Braço de Forja", type: "Poder de Ferreiro", cost: "Passivo", description: "O personagem ignora completamente o peso e as penalidades de movimento impostas pelas armaduras pesadas." },
      { title: "Placas Reforçadas", type: "Poder de Ferreiro", cost: "Passivo", description: "O uso contínuo de armadura pesada concede RD 2 (Redução de Dano) contra todos os ataques. O valor aumenta para RD 5 contra ataques à distância (flechas quebram ao impacto)." },
      { title: "Escudo Torre", type: "Poder de Ferreiro", cost: "1 PE", description: "Garante proficiência com Escudos de Corpo (Torre). Eles concedem +4 na defesa (em vez de +2), mas impõem penalidade de -2 no ataque. Gaste 1 PE para fixar o escudo no solo, fornecendo Cobertura Total para você e para um aliado adjacente." },
      { title: "Rebites de Sangue", type: "Poder de Ferreiro", cost: "Passivo", description: "O uso ofensivo da armadura transforma os agarramentos em armas. Durante um agarrão, o oponente sofre 1d6 + Força de dano perfurante por rodada devido às placas afiadas." },
      { title: "Inabalável", type: "Poder de Ferreiro", cost: "2 PE", description: "Reação. Gaste 2 PE para adquirir imunidade completa a empurrões, derrubadas ou movimentos involuntários até o início do próximo turno." },
      { title: "Capacete Fechado", type: "Poder de Ferreiro", cost: "Passivo", description: "O uso de capacete metálico completo anula a letalidade inimiga, transformando ataques críticos sofridos em acertos normais (o personagem sofre penalidade de -2 em testes de Percepção visual)." },
      { title: "Bomba de Poeira Negra", type: "Alquimia", cost: "4 PE", description: "Ação Padrão. Gaste 4 PE e suprimentos alquímicos. Jogue uma bomba explosiva em alcance curto (raio 3m). Dano: 4d6 de fogo/impacto (testes de Reflexos reduzem o dano à metade). O dano base aumenta em +1d6 a cada 4 níveis de personagem." },
      { title: "Reparo de Combate", type: "Poder de Ferreiro", cost: "1 PE", description: "Ação Padrão. Gaste 1 PE e toque em um objeto, arma ou armadura. O equipamento recupera imediatamente 2d10 PV ou perde a condição mecânica 'Quebrado'." },
      { title: "Pedra de Afiar (Rápida)", type: "Poder de Ferreiro", cost: "1 PE", description: "Ação de Movimento. Gaste 1 PE para amolar e balancear a arma de um aliado adjacente. O aliado adquire +2 nas rolagens de dano até o final da cena de combate." },
      { title: "Granada de Fumaça/Luz", type: "Alquimia", cost: "1 PE", description: "Gaste 1 PE para arremessar um frasco tático. O frasco cria uma densa nuvem de fumaça (cobertura total em área de 6m) ou dispara um intenso flash de luz (inimigos testam Fortitude ou ficam cegos por uma rodada)." },
      { title: "Armadilha de Urso", type: "Poder de Ferreiro", cost: "2 PE", description: "Ação Completa para armar. Gaste 2 PE e posicione as mandíbulas metálicas. O inimigo que ativar o gatilho sofre 2d8 de dano perfurante e perde a capacidade de deslocamento (testes de Força CD 20 quebram a armadilha)." },
      { title: "Sucateiro", type: "Poder de Ferreiro", cost: "Passivo", description: "Mestre da improvisação. Permite a criação de itens utilitários rudimentares (pé de cabra, corda metálica reforçada, armas simples) a partir de destroços próximos com apenas 1 minuto de trabalho. Os itens desmontam sozinhos após 1 hora de uso." },
      { title: "Injeção de Adrenalina", type: "Alquimia", cost: "2 PE", description: "Ação Padrão. Gaste 2 PE e aplique um tônico cirúrgico instável em si ou num aliado adjacente. O alvo recupera 1d10 PV de imediato e recebe um bônus de +2 em testes de Reflexos pelo resto da cena." },
      { title: "Óleo Inflamável", type: "Alquimia", cost: "1 PE", description: "Gaste 1 PE para despejar óleo em uma área de 3m. Oponentes que passem pelo terreno realizam testes de Acrobacia ou caem. Se as poças forem acesas, a chama devora 3d6 de PV por rodada de quem permanecer na área." },
      { title: "Engenho de Cerco", type: "Poder Avançado", cost: "4 PE", description: "Pré-requisito: Nível 10+. Ação Completa (1 min). Gaste 4 PE para forjar uma Balista ou Canhão estacionário (Defesa 15, 40 PV). Qualquer aliado adjacente pode usar uma Ação Padrão para atirar. O disparo usa o bônus de Pontaria/Intelecto do ferreiro e causa 3d10 de dano perfurante/impacto a longo alcance. A arma emperra caso você se afaste mais de 9 metros." },
      { title: "Armadura de Juggernaut", type: "Poder Avançado", cost: "Passivo", description: "Pré-requisito: Nível 10+ e possuir o poder 'Placas Reforçadas'. A armadura transforma-se em uma extensão do seu corpo. A partir deste nível, a inteligência balística permite somar o modificador de Intelecto à Defesa total, simultaneamente com os bônus naturais de Agilidade." },
      { title: "Martelo da Forja", type: "Poder Avançado", cost: "Passivo", description: "Pré-requisito: Nível 10+. A arma e o corpo exalam calor vulcânico contínuo durante as batalhas. Todos os ataques corpo a corpo causam +2d6 de dano de Fogo automático. O intenso fluxo térmico retorce o espaço ao redor do ferreiro, o que eleva a resiliência e concede RD 5 contra todos os tipos de impacto físico (Corte, Esmagamento ou Perfurante)." }
    ]
  },
  {
    name: "Caçador",
    desc: "O predador dos ermos. Onde veem monstros, ele vê presas. Especialista em rastrear, montar emboscadas e abater alvos específicos.",
    stats: {
      hp: "16 + Vigor Inicial (+4 + Vig por nível)",
      pe: "4 + Instinto Inicial (+4 por nível)",
      proficiencies: "Armas simples e marciais, armaduras leves, médias e escudos leves.",
      skills: "Sobrevivência (Inst) e Pontaria (Agi). Mais 3 entre: Furtividade, Percepção, Atletismo, Adestramento, Investigação e Rastrear."
    },
    fixedAbilities: [
      { title: "Marca da Presa", type: "Habilidade de Classe", cost: "1 PE", description: "Ação Bônus. Gaste 1 PE para analisar e marcar uma criatura visível. Até o fim da cena, os ataques contra ela causam dano extra. Concede Vantagem em testes de Percepção e Sobrevivência para rastrear o alvo marcado.\nEscalonamento do Dano Extra:\n- Nível 1: +1d6.\n- Nível 5: +1d8.\n- Nível 9: +1d10.\n- Nível 13: +1d12.\n- Nível 17: +2d8." },
      { title: "Explorador dos Ermos", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Move-se com deslocamento normal em terreno difícil natural. O caçador sempre reconhece o norte magnético e a previsão do tempo para as próximas horas." },
      { title: "Predador Apex", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 20: Permite manter até duas Marcas da Presa ativas simultaneamente em alvos distintos. O primeiro ataque de cada rodada contra uma criatura marcada causa dano máximo automático (sem necessidade de rolar dados)." }
    ],
    powers: [
      { title: "Disparo Veloz", type: "Poder de Caçador", cost: "2 PE", description: "Ao realizar a ação atacar com um arco, gaste 2 PE para efetuar um ataque adicional. Ambos os disparos sofrem penalidade de -2 no teste de acerto." },
      { title: "Tiro em Movimento", type: "Poder de Caçador", cost: "Passivo", description: "Anula a penalidade por atirar em movimento e permite dividir o deslocamento antes e depois do disparo. Se o ataque acertar, o caçador adquire +2 na Defesa contra o alvo atacado (Kiting)." },
      { title: "Chuva de Flechas", type: "Poder de Caçador", cost: "3 PE", description: "Ação Completa. Gaste 3 PE para disparar flechas para o alto que desabam em um cone de 9m. Realize um único teste de ataque e compare com a Defesa de todas as criaturas na área. O dano é o normal da arma." },
      { title: "Flecha Guiada", type: "Poder de Caçador", cost: "3 PE", description: "Gaste 3 PE. A flecha descreve curvas anormais, ignorando os bônus de camuflagem e cobertura do alvo (exceto em casos de cobertura total)." },
      { title: "Recarga Rápida", type: "Poder de Caçador", cost: "Passivo", description: "Reduz o tempo de recarga das bestas em uma categoria (Ação Padrão torna-se Ação de Movimento; Ação de Movimento torna-se Ação Livre). Poder vital para besteiros." },
      { title: "Disparo Perfurante", type: "Poder de Caçador", cost: "2 PE", description: "Ação Padrão. Gaste 2 PE para um disparo linear. A seta atravessa o alvo inicial e atinge uma segunda criatura logo atrás (caso o teste de ataque supere a Defesa de ambos). O disparo ignora 5 pontos de RD." },
      { title: "Tiro na Cabeça (Sniper)", type: "Poder de Caçador", cost: "4 PE", description: "Ação Completa. Gaste 4 PE. O personagem mira e dispara; em caso de acerto, o dano é crítico automático. Caso o caçador esteja escondido no momento do disparo, o multiplicador do crítico sobe em +1." },
      { title: "Impacto Pesado", type: "Poder de Caçador", cost: "Passivo", description: "Acertos com a besta empurram o alvo 1,5m para trás. Se o inimigo colidir com um obstáculo físico, sofre atordoamento por 1 rodada (um teste de Fortitude anula o atordoamento)." },
      { title: "Combate com Duas Armas", type: "Poder de Caçador", cost: "Livre", description: "Ao empunhar duas armas com a propriedade 'Leve', o personagem adquire o direito de atacar com a arma secundária usando uma Ação Bônus." },
      { title: "Estripador", type: "Poder de Caçador", cost: "Passivo", description: "Ataques corpo a corpo desferidos contra criaturas marcadas com a Marca da Presa aplicam sangramento automático (1d4 de dano extra contínuo por rodada)." },
      { title: "Guerrailheiro (Skirmisher)", type: "Poder de Caçador", cost: "Passivo", description: "Se o caçador se deslocar pelo menos 3m antes de atacar, ele conquista +2 de Dano e +2 de Defesa até o turno subsequente." },
      { title: "Corte de Tendão", type: "Poder de Caçador", cost: "2 PE", description: "Gaste 2 PE. Efetue um ataque corpo a corpo. O acerto inflige o dano normal e rompe a mobilidade do alvo (o movimento é reduzido à metade e a criatura perde o uso de reações na rodada)." },
      { title: "Companheiro Animal", type: "Poder de Caçador", cost: "1 PE", description: "O personagem adota um animal fiel. Gaste 1 PE para ordenar que o animal realize uma Ação Padrão (como Atacar) na mesma rodada. Sem ordens explícitas, o animal foca em evasão e defesa." },
      { title: "Ataque em Matilha", type: "Poder de Caçador", cost: "Passivo", description: "Se o caçador e o companheiro animal atacarem a mesma criatura no mesmo turno, o alvo fica Caído automaticamente (se for tamanho médio ou menor). Alvos Grandes realizam teste de Força." },
      { title: "Vínculo Vital", type: "Poder de Caçador", cost: "1 PE", description: "A até 6m de distância, caçador e besta dividem os ferimentos. Danos sofridos pelo caçador podem ser partilhados em 50% com o animal, e vice-versa. Gaste 1 PE para curar o animal em 1d8 + Instinto mediante toque." },
      { title: "Fera de Combate", type: "Poder de Caçador", cost: "Passivo", description: "Aumenta a letalidade do companheiro animal: o dano físico das presas sobe uma categoria (ex: de 1d6 para 1d8) e a fera ganha RD (Redução de Dano) igual ao modificador de Instinto do caçador." },
      { title: "Colecionador de Troféus", type: "Poder de Caçador", cost: "1 PE", description: "Gasta 10 minutos para extrair partes de monstros abatidos. Equipar um troféu concede benefícios pela cena (custo de 1 PE para ativar). Garras concedem +3 Dano; Couros concedem +2 RD; Olhos/Glândulas concedem visão no escuro/invisibilidade." },
      { title: "Conhecimento Anatômico", type: "Poder de Caçador", cost: "Passivo", description: "Realiza um teste de Conhecimento utilizando Intelecto ou Instinto. Em caso de sucesso, o caçador e o esquadrão ganham +5 de Ataque e +5 de Defesa contra a família taxonômica estudada pelo resto do dia." },
      { title: "Armadilheiro", type: "Poder de Caçador", cost: "2 PE", description: "Gaste 2 PE para disfarçar uma armadilha no solo. O mecanismo inflige 4d6 de dano e impõe o status Imobilizado à criatura." },
      { title: "Alquimia de Campo", type: "Poder de Caçador", cost: "1 PE", description: "Domínio primitivo da flora. Cria extratos botânicos, antídotos e poções curativas de 2d6. O processo custa 1 PE por frasco confeccionado." },
      { title: "Camuflagem", type: "Poder de Caçador", cost: "Passivo", description: "O personagem consegue realizar a ação de Furtividade mesmo se estiver sendo monitorado por inimigos, desde que posicionado em terreno com folhagem ou pedras naturais." },
      { title: "Inimigo Predileto", type: "Poder de Caçador", cost: "Passivo", description: "Elege uma classificação de criatura (ex: bestas marinhas, mortos-vivos). Garante +2 de ataque e +2 de bônus de dano permanente contra essa família biológica." },
      { title: "Sentidos Aguçados", type: "Poder de Caçador", cost: "Passivo", description: "A percepção extrema anula tentativas inimigas de ataque furtivo contra o caçador. Além disso, o modificador de Instinto é somado ao valor final da Iniciativa." },
      { title: "Matador de Gigantes", type: "Poder de Caçador", cost: "Passivo", description: "A especialização do Davi contra Golias. Todo ataque contra adversários de tamanho Grande ou superior causa +1d8 de dano suplementar e concede +2 na Defesa do caçador." }
    ]
  },
  {
    name: "Ladino",
    desc: "A lâmina na escuridão. Especialista em infiltração, venenos e em eliminar alvos prioritários com um único golpe bem desferido.",
    stats: {
      hp: "16 + Vigor Inicial (+4 + Vig por nível)",
      pe: "3 + Agilidade Inicial (+3 por nível)",
      proficiencies: "Armas simples, armas marciais leves (adagas, espadas curtas), arcos, bestas leves e armaduras leves.",
      skills: "Furtividade (Agi) e Acrobacia (Agi). Mais 4 entre: Ladinagem, Pontaria, Atletismo, Intuição, Enganação, Investigação, Percepção."
    },
    fixedAbilities: [
      { title: "Ataque Furtivo", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Acertos contra alvos desprevenidos ou flanqueados causam +1d6 de dano extra. \nEscalonamento:\nO dano extra aumenta em +1d6 a cada dois níveis ímpares (ex: +2d6 no Nível 3, +3d6 no Nível 5, até +10d6 no Nível 19)." },
      { title: "Sombra da Lua", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: O ladino enxerga na escuridão total (não mágica) e soma o modificador de Agilidade à Iniciativa." },
      { title: "Eclipse Final", type: "Habilidade de Classe", cost: "5 PE", description: "Nvl 20: Mestre absoluto da morte. O Ataque Furtivo afeta qualquer criatura, ignorando imunidades a dano de precisão (como construtos e elementais). Ao acertar um Ataque Furtivo, gaste 5 PE para DOBRAR a quantidade de dados extras rolados (ex: de +10d6 para +20d6)." }
    ],
    powers: [
      { title: "Lua Nova (O Invisível)", type: "Postura Lunar", cost: "Mov / 2 PE", description: "Passivo: As sombras o abraçam. Recebe +5 em Furtividade.\nAtivo (Vanish): Gaste 2 PE. O personagem torna-se invisível por 1 rodada ou até desferir um ataque. É possível ativar a habilidade mesmo sob observação direta." },
      { title: "Lua de Sangue (O Executor)", type: "Postura Lunar", cost: "Mov / 1 PE", description: "Passivo: Os Ataques Furtivos causam sangramento contínuo (1d4 de dano por turno).\nAtivo (Crueldade): Ao rolar o dano do Ataque Furtivo, gaste 1 PE para rerrolar todos os dados que apresentarem resultado '1' ou '2'." },
      { title: "Lua Crescente (O Dançarino)", type: "Postura Lunar", cost: "Mov / 1 PE", description: "Passivo: A velocidade aumenta em +3m e é possível levantar-se da condição 'Caído' como Ação Livre.\nAtivo (Passo Sombrio): Gaste 1 PE. O ladino teleporta-se instantaneamente até 9m para qualquer área sombreada visível, sem gerar ataques de oportunidade." },
      { title: "Lua Minguante (O Venenoso)", type: "Postura Lunar", cost: "Mov / 1 PE", description: "Passivo: Aumenta a CD para resistir aos venenos aplicados em +2.\nAtivo (Debilitar): Ao acertar um ataque, gaste 1 PE. O alvo fica Enjoado (restrito a apenas uma ação por turno) por 1 rodada devido ao impacto em nervos centrais." },
      { title: "Assassinar", type: "Poder de Assassino", cost: "Passivo", description: "Ataques realizados contra inimigos que ainda não agiram no combate (Iniciativa menor ou alvos surpresos) convertem-se em Acertos Críticos automáticos." },
      { title: "Golpe de Misericórdia", type: "Poder de Assassino", cost: "2 PE", description: "Ação Completa. Gaste 2 PE contra um inimigo indefeso (amarrado ou adormecido). O ataque causa dano crítico automático com multiplicador x3, e o alvo testa Fortitude; em caso de falha, morre instantaneamente." },
      { title: "Combate com Duas Armas", type: "Poder de Assassino", cost: "Livre", description: "O personagem adquire a habilidade de realizar um ataque com a arma secundária utilizando a Ação Bônus da rodada." },
      { title: "Dilacerar", type: "Poder de Assassino", cost: "1 PE", description: "Pré-requisito: Combate com Duas Armas. Se acertar ambos os golpes no turno, gaste 1 PE para somar os danos e infligir +1d8 extra." },
      { title: "Lâmina Assassina", type: "Poder de Assassino", cost: "Passivo", description: "Pré-requisito: Nível 8+. A letalidade aumenta e os dados do Ataque Furtivo são elevados de d6 para d8." },
      { title: "Oportunista", type: "Poder de Assassino", cost: "2 PE", description: "Reação. Se um aliado acertar um inimigo posicionado adjacentemente a você, gaste 2 PE para realizar um ataque corpo a corpo imediato contra ele." },
      { title: "Envenenamento Rápido", type: "Poder de Assassino", cost: "1 PE", description: "Ação Bônus. Gaste 1 PE para cobrir a lâmina com veneno no meio do combate. O veneno não evapora em caso de ataque fracassado." },
      { title: "Dose Dupla", type: "Poder de Assassino", cost: "Passivo", description: "O ladino consegue mesclar dois tipos distintos de veneno na mesma arma. O alvo é forçado a realizar dois testes de resistência independentes." },
      { title: "Nuvem Tóxica", type: "Poder de Assassino", cost: "2 PE", description: "Ação Padrão. Gaste 2 PE para esmagar um frasco químico. Cria uma área nociva de 3m. Oponentes na área sofrem 1d6 de dano de Ácido e ficam Enjoados." },
      { title: "Areia nos Olhos", type: "Poder de Assassino", cost: "1 PE", description: "Ação Bônus. Gaste 1 PE. Realiza um teste de Ladinagem contra os Reflexos do alvo. A vitória cega o inimigo por 1 rodada, garantindo abertura para Ataque Furtivo." },
      { title: "Finta Aprimorada", type: "Poder de Assassino", cost: "Movimento", description: "Permite usar a perícia Enganação para realizar uma Finta como Ação de Movimento. Se obtiver sucesso, o inimigo torna-se desprevenido contra o próximo golpe." },
      { title: "Rolamento Defensivo", type: "Poder de Assassino", cost: "2 PE", description: "Reação. Ao sofrer qualquer dano físico ou de efeito em área, gaste 2 PE para mitigar o dano total à metade." },
      { title: "Escalar Paredes", type: "Poder de Assassino", cost: "Passivo", description: "Ganha deslocamento de escalada equivalente ao deslocamento terrestre. O ladino pode lutar pendurado em estruturas sem sofrer penalidades." },
      { title: "Sombra Viva", type: "Poder de Assassino", cost: "1 PE", description: "Ao realizar um Ataque Furtivo à distância (arcos ou facas de arremesso), gaste 1 PE para permanecer oculto (o teste de Furtividade subsequente sofre -10, mas a revelação não é automática)." },
      { title: "Mestre dos Disfarces", type: "Poder de Assassino", cost: "1 PE", description: "Gaste 1 PE e 1 minuto. Concede um bônus de +10 em Enganação para forjar identidades visuais e assumir o lugar de outras pessoas." },
      { title: "Sexto Sentido", type: "Poder de Assassino", cost: "Passivo", description: "A intuição paranoica impede que o ladino seja surpreendido em emboscadas inimigas. Soma-se o modificador de Agilidade aos testes de Reflexos." },
      { title: "Evasão", type: "Poder de Assassino", cost: "Passivo", description: "Pré-requisito: Nível 6. Sempre que for alvo de um efeito que permita teste de Reflexos para reduzir o dano à metade (como o sopro de um dragão), o ladino não sofre dano algum em caso de sucesso (e sofre metade caso falhe)." },
      { title: "Mestre da Infiltração", type: "Poder de Assassino", cost: "Passivo", description: "O ato de arrombar fechaduras ou desativar armadilhas passa a exigir apenas uma Ação Rápida. O ladino rola dois dados nestes testes e seleciona o melhor resultado." },
      { title: "Veneno Paralisante", type: "Poder de Assassino", cost: "2 PE", description: "Gaste 2 PE e suprimentos para sintetizar uma toxina letal. O inimigo que falhar no teste de Fortitude contra este veneno sofre a condição Atordoado ou Paralisado." },
      { title: "Golpe Baixo", type: "Poder de Assassino", cost: "1 PE", description: "Ao confirmar um Ataque Furtivo, gaste 1 PE adicional para impor as condições Caído ou Desarmado instantaneamente ao alvo." },
      { title: "Arremesso Mortal", type: "Poder de Assassino", cost: "Passivo", description: "Dobra o alcance efetivo dos Ataques Furtivos executados com armas de arremesso. Permite sacar adagas e machadinhas arremessáveis como Ação Livre." },
      { title: "Imunidade a Venenos", type: "Poder de Assassino", cost: "Passivo", description: "A exposição prolongada a toxinas conferiu ao ladino imunidade fisiológica a todos os venenos e patógenos naturais." },
      { title: "Avatar da Noite", type: "Poder de Assassino", cost: "Passivo", description: "Pré-requisito: Nível 12 e conhecer duas Posturas Lunares. O ladino pode manter duas Posturas ativas simultaneamente (ex: mesclar Lua Nova com Lua de Sangue para ataques furtivos com sangramento e invisibilidade)." }
    ]
    
  },

  {
    name: "Marinheiro",
    desc: "O mestre da instabilidade. Seja no mar revolto ou nas costas de um dinossauro em fúria, o marinheiro se sente em casa. Ele luta com ginga, usa o ambiente, dispara pólvora e comanda veículos como ninguém.",
    stats: {
      hp: "18 + Vigor Inicial (+5 + Vig por nível)",
      pe: "3 + Agilidade Inicial (+3 por nível)",
      proficiencies: "Armas simples, armas leves, redes, tridentes, arpões, armas de fogo e armas de cerco. Armaduras leves e escudos.",
      skills: "Pilotagem (Agi), Atletismo (For), Acrobacia (Agi). Mais 3 entre: Briga, Pontaria, Ofício (Carpintaria/Navegação), Sobrevivência, Intuição."
    },
    fixedAbilities: [
      { title: "Ginga", type: "Habilidade de Classe", cost: "Passivo / 1 PE", description: "Passivo: Sem armadura ou com armadura leve, soma seu Instinto na Defesa. \nAtivo: Ao mover-se 3m no turno, gaste 1 PE para bônus no Ataque e Defesa até o próximo turno. \nEscalonamento: +2 (Nível 1), +3 (Nível 5), +4 (Nível 9), +5 (Nível 13), +6 (Nível 17)." },
      { title: "Vida no Mar", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Ignora terreno difícil natural, balançante ou escorregadio. Possui deslocamento de natação igual ao terrestre e nunca enjoa." },
      { title: "Rei dos Sete Mares", type: "Habilidade de Classe", cost: "0 PE", description: "Nvl 20: Lacaios fogem ao te ver. Contra chefes, a Ginga custa 0 PE e concede uma Ação de Movimento extra por rodada (pode ser transferida para o veículo ou montaria que estiver pilotando)." }
    ],
    powers: [
      { title: "Timoneiro Experiente", type: "Poder de Marinheiro", cost: "Passivo", description: "Soma o nível aos testes de Pilotagem. Veículos ou montarias Grandes (dinossauros) sob seu comando ganham +2 na Defesa e +3m de deslocamento." },
      { title: "Ordens de Batalha", type: "Poder de Marinheiro", cost: "Mov / 2 PE", description: "Grita ordens para aliados. Eles ganham +2 em Percepção e Reflexos por 1 rodada. Se a bordo do seu veículo, ganham +2 no dano com ataques à distância ou cerco." },
      { title: "Filho da Tempestade", type: "Poder de Marinheiro", cost: "Passivo", description: "Não sofre penalidades em Percepção ou Ataque por clima ruim. Seus veículos ignoram penalidades de terreno causadas pelo clima." },
      { title: "Navegador das Estrelas", type: "Poder de Marinheiro", cost: "Passivo", description: "Nunca se perde. Concede 'Viagem Rápida' ao grupo (tempo reduzido em 20% e evita encontros aleatórios menores) em ambientes abertos." },
      { title: "Grito do Capitão", type: "Poder de Marinheiro", cost: "Padrão / 2 PE", description: "Aliados a curto alcance sob medo, atordoamento ou enfeitiçados podem refazer o teste de resistência com bônus de +2." },
      { title: "Luta Suja", type: "Poder de Marinheiro", cost: "Bônus / 1 PE", description: "Teste de Ladinagem vs Reflexos. Em caso de vitória, o alvo fica Cego ou Atordoado (escolha do marinheiro) por 1 rodada." },
      { title: "Garrafa na Cara", type: "Poder de Marinheiro", cost: "1 PE", description: "Proficiência com armas improvisadas (dano 1d6). Ao quebrar a arma no inimigo após o acerto, gaste 1 PE para causar +2d6 de dano extra." },
      { title: "Golpe de Capoeira", type: "Poder de Marinheiro", cost: "Livre", description: "Ao levantar-se da condição 'Caído' (custo de 1,5m), pode realizar um ataque corpo a corpo imediato." },
      { title: "Provocação Obscena", type: "Poder de Marinheiro", cost: "1 PE", description: "Alvo deve resistir com Vontade. Se falhar, fica enfurecido: ataca apenas você, sofre -2 na Defesa e perde concentração." },
      { title: "Bêbado Mestre", type: "Poder de Marinheiro", cost: "Passivo", description: "Se consumiu álcool na última hora, recebe +2 de Redução de Dano (RD) e imunidade a Medo." },
      { title: "Mestre da Rede", type: "Poder de Marinheiro", cost: "Passivo", description: "Sem penalidades pelo uso de redes. O alvo atingido fica Imobilizado e com -2 no ataque. A CD para soltar-se aumenta em +2." },
      { title: "Tridente Impiedoso", type: "Poder de Marinheiro", cost: "Passivo", description: "Contra alvos enredados, caídos, agarrados ou nadando, o tridente/arpão causa +1d8 de dano e margem de crítico +1." },
      { title: "Puxar e Furar", type: "Poder de Marinheiro", cost: "1 PE", description: "Ao acertar com arma de haste ou corda, gaste 1 PE para puxar o inimigo 3m ou derrubá-lo (teste de Força oposto)." },
      { title: "Caçador de Leviatãs", type: "Poder de Marinheiro", cost: "Passivo", description: "Arpões prendem o alvo a você (Médio ou menor) ou você ao alvo (Grande ou maior). +2 de ataque contra Bestas e Monstros Aquáticos." },
      { title: "Pistoleiro", type: "Poder de Marinheiro", cost: "Passivo", description: "Proficiência com pistolas e mosquetes. A ação de recarregar torna-se uma Ação de Movimento." },
      { title: "Queima-Roupa", type: "Poder de Marinheiro", cost: "Passivo", description: "Ao atirar em adjacente: sem penalidade, não gera ataque de oportunidade e causa +1 dado de dano." },
      { title: "Disparo Explosivo", type: "Poder de Marinheiro", cost: "2 PE", description: "O tiro espalha estilhaços. Alvos adjacentes ao alvo principal sofrem metade do dano (Reflexos anula)." },
      { title: "Cano Duplo", type: "Poder de Marinheiro", cost: "2 PE", description: "Tiro sobrecarregado: Alcance cai pela metade, mas o dano aumenta em +2 dados. Se rolar '1', a arma emperra." },
      { title: "Acrobacia de Convés", type: "Poder de Marinheiro", cost: "1 PE", description: "Usa o cenário para mover-se voando sobre inimigos. Ataque após o movimento ganha +2 de bônus. Custo 0 PE em barcos ou terreno instável." },
      { title: "Escalar e Lutar", type: "Poder de Marinheiro", cost: "Passivo", description: "Deslocamento de escalada igual ao terrestre. Recebe +2 na Defesa enquanto estiver pendurado ou escalando cordas/mastros." },
      { title: "Pés Leves", type: "Poder de Marinheiro", cost: "Passivo", description: "Não deixa pegadas e anda sobre superfícies frágeis (água com destroços, telhados podres, costas de monstros) sem afundar." },
      { title: "Ginga Evasiva", type: "Poder de Marinheiro", cost: "Passivo", description: "Pré-requisito: Nível 6. Ao ativar a Ginga, recebe o efeito de Evasão (sucesso em Reflexos para meio dano reduz o dano a zero)." },
      { title: "Sorte de Principiante", type: "Poder de Marinheiro", cost: "Livre", description: "Uma vez por cena, rerrola um teste falho. Se o segundo teste for sucesso, recupera 1 PE." },
      { title: "Lenda Viva", type: "Poder de Marinheiro", cost: "4 PE", description: "Pré-requisito: Nível 12. Por uma cena, ganha uma Ação Padrão extra por turno para realizar atos arriscados ou heróicos." }
    ]
},

{
    name: "Mercador",
    desc: "O negociante aventureiro. Ele não luta pela glória, luta pelo lucro. Enquanto os outros usam força bruta, ele usa a logística, a cobiça alheia e o melhor equipamento que o dinheiro pode comprar. Em um mundo escasso como Korzel, ele é o rei dos recursos.",
    stats: {
      hp: "14 + Vigor Inicial (+3 + Vig por nível)",
      pe: "3 + Intelecto Inicial (+3 por nível)",
      proficiencies: "Armas simples, armaduras leves e escudos leves.",
      skills: "Intuição (Inst) e Diplomacia (Pres). Escolha mais 4 entre: Enganação, Ofício (Mercador), Conhecimento (Geral), Percepção, Investigação, Ladinagem."
    },
    fixedAbilities: [
      { title: "Incentivo", type: "Habilidade de Classe", cost: "Bônus / 1 PE", description: "Oferece um incentivo a um aliado a até 9m. O alvo ganha um dado extra no próximo teste de perícia, ataque ou dano (usável até o fim da cena). \nEscalonamento: 1d6 (Nível 1), 1d8 (Nível 5), 1d10 (Nível 9), 1d12 (Nível 13), 2d8 (Nível 17)." },
      { title: "Olhar de Avaliador", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Usa Intelecto em vez de Sabedoria para Vontade e Intuição. Possui Vantagem em Intuição para detectar mentiras ou avaliar objetos. Após 1 minuto de conversa, ganha +2 em Diplomacia e Enganação contra o alvo pela próxima hora." },
      { title: "O Dono do Jogo", type: "Habilidade de Classe", cost: "1 PE / 5 PE", description: "Nvl 20: O Incentivo afeta todos os aliados em curto alcance por apenas 1 PE. Uma vez por cena, pode gastar 5 PE para subornar um inimigo: Lacaios mudam de lado; Chefes ficam Atordoados por 1 rodada e sofrem -5 em ataques contra você (Vontade anula)." }
    ],
    powers: [
      { title: "Guarda-Costas", type: "Poder de Mercador", cost: "Passivo", description: "Contrata um lacaio (Guerreiro/Bárbaro) que age na sua iniciativa. Exige ações para ser comandado (Padrão para atacar, Movimento para andar). Se morrer, requer 24h e ouro para reposição. Nível do lacaio é o seu -2." },
      { title: "Profissionalismo", type: "Poder de Mercador", cost: "Passivo", description: "Pré-requisito: Guarda-Costas. Comandar o Guarda-Costas exige apenas Ação de Movimento (ou Livre para ordens simples). Ele recebe +2 na Defesa se estiver adjacente a você." },
      { title: "Escudo Humano", type: "Poder de Mercador", cost: "Reação / 1 PE", description: "Ao ser alvo de ataque, se houver aliado adjacente, gaste 1 PE para movê-lo para sua frente; ele recebe o ataque em seu lugar." },
      { title: "Ordens de Patrão", type: "Poder de Mercador", cost: "Padrão / 2 PE", description: "Um aliado ou Guarda-Costas a curta distância realiza uma Ação Padrão extra imediatamente." },
      { title: "Equipamento Financiado", type: "Poder de Mercador", cost: "Passivo", description: "Escolha um aliado (ou Guarda-Costas): ele recebe +1 no Ataque e Defesa permanentemente enquanto você pagar a manutenção (custo em ouro por nível)." },
      { title: "Ataque Coordenado", type: "Poder de Mercador", cost: "Passivo", description: "Se você e seu Guarda-Costas atacarem o mesmo alvo na rodada, ou se usar Incentivo nele antes do ataque, ele causa +1d8 de dano extra." },
      { title: "Mochila de Carga", type: "Poder de Mercador", cost: "1 PE", description: "Carrega o dobro de peso. Pode gastar 1 PE e o valor em ouro para 'gerar' um item mundano (até 100 moedas) que supostamente já estava na mochila." },
      { title: "Elixir de Qualidade", type: "Poder de Mercador", cost: "1 PE", description: "Ao usar ou administrar poção de cura ou item alquímico, gaste 1 PE para maximizar os resultados numéricos (pega o valor máximo sem rolar)." },
      { title: "Granadeiro", type: "Poder de Mercador", cost: "Passivo", description: "Proficiência com itens alquímicos arremessáveis. O alcance dobra e a CD para os inimigos resistirem aumenta em +2." },
      { title: "Arsenal Oculto", type: "Poder de Mercador", cost: "Livre", description: "Ganha +10 em Ladinagem para esconder itens no corpo. Pode sacar itens escondidos como Ação Livre." },
      { title: "Mercador de Armas", type: "Poder de Mercador", cost: "1 PE", description: "Gasta 1 minuto para ajustar a arma de um aliado. Ela ganha +1 no Dano e +1 na margem de crítico até o próximo descanso." },
      { title: "Identificar Valor", type: "Poder de Mercador", cost: "Livre", description: "Teste de Intuição contra um monstro. Se passar, descobre uma Vulnerabilidade e aliados ganham +1 no ataque contra ele." },
      { title: "Suborno Rápido", type: "Poder de Mercador", cost: "Reação / 2 PE", description: "Ao ser atacado por criatura inteligente, oferece ouro. Alvo faz Vontade; se falhar, perde a ação hesitando." },
      { title: "Língua de Prata", type: "Poder de Mercador", cost: "1 PE", description: "Permite rolar novamente um teste de Carisma (Diplomacia, Enganação, Intimidação) que tenha falhado." },
      { title: "Chuva de Moedas", type: "Poder de Mercador", cost: "Padrão / 2 PE", description: "Joga moedas em uma área. Inimigos inteligentes ou bestas gananciosas devem passar em Vontade ou perdem a próxima Ação de Movimento e sofrem -2 na Defesa." },
      { title: "Contatos no Submundo", type: "Poder de Mercador", cost: "1 PE", description: "Acesso a mercado negro (venenos e itens ilegais). Em cidades, pode gastar 1 PE para obter uma informação secreta ou favor local." },
      { title: "Ameaça Velada", type: "Poder de Mercador", cost: "Padrão / 1 PE", description: "Teste de Intimidação. Se vencer, o alvo fica abalado (-2 em testes) e sofre 1d8 de dano psíquico se tentar te atacar." },
      { title: "Diplomacia de Combate", type: "Poder de Mercador", cost: "Completa / 4 PE", description: "Força uma trégua de 1 minuto para negociação (inimigos inteligentes). Se a trégua for quebrada por você, os inimigos ficam surpresos." },
      { title: "Investimento Tático", type: "Poder de Mercador", cost: "Bônus", description: "Transfere até 5 PE do seu próprio total para um aliado adjacente através de conselhos ou tônicos." },
      { title: "Sócio Majoritário", type: "Poder de Mercador", cost: "Passivo", description: "Pré-requisito: Nível 6. No início de cada aventura, recebe PE temporários extras iguais ao seu Nível + Intelecto." },
      { title: "Pagar para Vencer", type: "Poder de Mercador", cost: "Livre", description: "Uma vez por rodada, gaste ouro (10% do nível) para ganhar +2 em um teste antes de rolar o dado." },
      { title: "Golpe de Sorte", type: "Poder de Mercador", cost: "Passivo", description: "Sempre que rolar um '1' natural em qualquer dado de teste ou ataque, você recupera 1 PE." },
      { title: "Cobiça", type: "Poder de Mercador", cost: "Passivo", description: "Recebe +2 em testes de resistência contra controle mental, leitura de pensamento ou roubo. Sua ganância protege sua mente." },
      { title: "Magnata", type: "Poder de Mercador", cost: "Passivo", description: "Pré-requisito: Nível 12. Pode usar o atributo Intelecto para testes de Ataque e Dano com armas simples e leves." }
    ]
},

{
    name: "Bardo",
    desc: "Não há magia em suas palavras, apenas convicção. O Bardo de Korzel é um mestre da guerra psicológica. Ele sabe que um inimigo furioso comete erros, e que um aliado desesperado precisa apenas de um grito de comando para lutar como um leão. Ele luta sujo e usa os sentimentos alheios como arma.",
    stats: {
      hp: "12 + Vigor Inicial (+3 + Vig por nível)",
      pe: "3 + Presença Inicial (+3 por nível)",
      proficiencies: "Armas Simples, Armas Marciais Leves (Florete, Cimitarra), Chicotes. Armaduras Leves e Escudos Leves (Buckler).",
      skills: "Atuação (Presença) e Enganação (Presença). Escolha 4 entre: Ladinagem, Furtividade, Intuição, Acrobacia, Diplomacia, Percepção."
    },
    fixedAbilities: [
      { title: "Performance de Combate", type: "Habilidade de Classe", cost: "Padrão / Movimento", description: "Usa arte para controlar a batalha (Alcance 9m). Exige Ação de Movimento para manter. \nEscalonamento: \nNvl 1 (Iniciado): Bônus/Penalidade de +/- 1. \nNvl 5 (Veterano): Bônus/Penalidade de +/- 2. Pode manter 2 Cenas (paga o custo de ambas). \nNvl 10 (Mestre): Bônus/Penalidade de +/- 3. Manutenção vira Ação Livre. \nNvl 15 (Lenda): Bônus/Penalidade de +/- 4. Alcance 18m." },
      { title: "Malandragem", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Sem penalidade para Armas Improvisadas (1d4 ou 1d6; quebram no Crítico). Pode usar Presença em vez de Força ou Agilidade para testes de Ataque com armas Leves ou Improvisadas." },
      { title: "A Última Gargalhada", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 20: Presença aumenta em +4 (pode exceder 20). Recupera 1 PE em '20 Natural' seu ou '1 Natural' de inimigos. Se morrer, aliados ganham +10 em todos os testes e danos até o fim da cena (Encore)." }
    ],
    powers: [
      { title: "Insulto Cortante", type: "Poder de Bardo", cost: "Reação / 1 PE", description: "Quando um inimigo falha num ataque contra você, ele deve passar em Vontade ou sofre -2 no próximo ataque e 2d6 de dano psíquico." },
      { title: "Alvo da Chacota", type: "Performance (Cena)", cost: "Manutenção", description: "Inimigos na área sofrem a penalidade da Performance em testes de Vontade e Percepção." },
      { title: "Grito de Distração", type: "Poder de Bardo", cost: "Bônus / 1 PE", description: "Um inimigo a 6m fica Desprevenido contra o próximo ataque que receber nesta rodada." },
      { title: "Desmoralizar", type: "Poder de Bardo", cost: "Padrão", description: "Teste de Atuação vs Vontade. Se vencer, o inimigo fica Abalado (não soma Destreza na Defesa) até o fim da cena." },
      { title: "Bode Expiatório", type: "Poder de Bardo", cost: "Reação / 2 PE", description: "Ao ser atacado, se houver alguém adjacente, tente redirecionar o ataque (Enganação vs Reflexos do atacante)." },
      { title: "Ritmo de Guerra", type: "Performance (Cena)", cost: "Manutenção", description: "Aliados que podem ouvir a performance ganham o bônus da Performance em todas as rolagens de Dano." },
      { title: "Não morra agora, seu idiota!", type: "Poder de Bardo", cost: "Reação / 3 PE", description: "Quando um aliado cai a 0 PV, ele recupera 1d8 + Presença PV imediatamente e levanta-se." },
      { title: "Canção de Bar", type: "Poder de Bardo", cost: "Ritual", description: "Durante um descanso curto (10 min), todos os aliados recuperam PV ou PE adicionais iguais à sua Presença." },
      { title: "Comando Tático", type: "Poder de Bardo", cost: "Movimento / 2 PE", description: "Um aliado pode gastar a Reação dele para mover-se metade do deslocamento ou realizar um ataque imediato." },
      { title: "Aura de Confiança", type: "Performance (Cena)", cost: "Manutenção", description: "Aliados ganham o bônus da Performance em testes de Resistência contra Medo e Charme." },
      { title: "Golpe Baixo", type: "Poder de Bardo", cost: "Padrão / 1 PE", description: "Ataque com arma leve ou desarmado. Se acertar, alvo deve passar em Fortitude ou fica Enjoado por 1 rodada." },
      { title: "Areia nos Olhos", type: "Poder de Bardo", cost: "Bônus / 1 PE", description: "Teste de Ladinagem vs Reflexos. Em caso de sucesso, o alvo fica Cego por 1 rodada." },
      { title: "Improviso Brutal", type: "Poder de Bardo", cost: "Passivo", description: "Se uma arma improvisada quebrar no ataque (crítico ou escolha), o dano é dobrado e o alvo sofre sangramento." },
      { title: "Escudo Humano", type: "Poder de Bardo", cost: "Passivo", description: "Enquanto agarra uma criatura, você recebe +4 na Defesa. Ataques que errarem você por até 4 pontos atingem a criatura agarrada." },
      { title: "Finta Aprimorada", type: "Poder de Bardo", cost: "Bônus", description: "Pode Fintar (Enganação) como Ação Bônus. Se tiver sucesso, o próximo ataque causa +2d6 de dano furtivo." },
      { title: "Acrobacia de Bêbado", type: "Poder de Bardo", cost: "Reação / 2 PE", description: "Quando for atingido por um golpe, você reduz o dano sofrido à metade fingindo um tropeço ou rolamento." },
      { title: "Língua de Prata", type: "Poder de Bardo", cost: "Passivo", description: "Permite rolar novamente qualquer teste de Diplomacia ou Enganação, mas obriga a aceitar o segundo resultado." },
      { title: "Mestre dos Disfarces", type: "Poder de Bardo", cost: "1 min", description: "Concede +10 em Enganação para disfarces visuais, permitindo se passar por outras pessoas ou classes sociais." },
      { title: "Tumulto", type: "Poder de Bardo", cost: "Completa / 2 PE", description: "Em áreas urbanas, incita uma multidão que cria terreno difícil e cobertura em uma área de 9m." },
      { title: "Ventriloquismo Tático", type: "Poder de Bardo", cost: "Livre", description: "Projeta sua voz para qualquer ponto a até 15m de distância para criar distrações ou falsos alarmes." },
      { title: "O Show tem que Continuar", type: "Poder de Bardo", cost: "Especial", description: "Ao cair a 0 PV, gaste todos os PE restantes para ficar com 1 PV e ganhar uma Ação Padrão extra neste turno." },
      { title: "Humilhação Pública", type: "Poder de Bardo", cost: "Completa / 5 PE", description: "Discurso devastador. Alvo faz Vontade; se falhar, larga as armas e abandona o combate ou fica rendido." },
      { title: "Cena: O Clímax", type: "Performance (Cena)", cost: "4 PE", description: "Aliados ganham +1 Ação por rodada, mas sofrem 1d6 de dano por turno devido à exaustão extrema." },
      { title: "Trapaceiro Nato", type: "Poder de Bardo", cost: "5 PE", description: "Uma vez por sessão, declare que 'tinha um plano': manifesta um item comum ou revela um suborno feito previamente (sujeito ao mestre)." }
    ]
},

{
    name: "Xamã",
    desc: "O diplomata dos mundos. Negocia com espíritos usando respeito e trocas para não pagar com a própria vida.",
    stats: {
      hp: "16 + Vigor Inicial (+4 + Vig por nível)",
      pe: "Não possui (Utiliza Oferendas e os próprios PV/Sangue como recurso)",
      proficiencies: "Armas simples, cajados. Armaduras leves.",
      skills: "Sincronia e Erudição. Escolha 2 entre: Medicina, Sobrevivência, Religião, Intuição."
    },
    fixedAbilities: [
      { title: "Pacto de Equilíbrio", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Ao ativar um Poder ou Ritual, gaste uma Oferenda (consumível) para reduzir o custo em PV à metade (arredondado para cima). Se o teste de ativação (Sincronia) superar a CD em 5+, você não rola o teste de Corrupção no turno." },
      { title: "Magia de Sangue (Básico)", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Acesso à conjuração de magias sacrificiais utilizando os próprios Pontos de Vida (PV)." },
      { title: "Caminho dos Espíritos", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 5: Desperta habilidades avançadas de comunhão espiritual (conforme regras do compêndio)." },
      { title: "Avatar dos Dois Mundos", type: "Habilidade de Classe", cost: "1/Cena", description: "Nvl 20 (Conduíte Perfeito): Ao ativar um poder que custe PV, vincule-se a um inimigo a até 9m. O alvo faz Vontade (CD Presença). Se falhar, ele sofre dano necrótico igual ao custo (ignorando RD) e você não perde PV. Se passar, o vínculo falha e você paga o custo." }
    ],
    powers: [
      { title: "Transferência Vital", type: "Poder de Xamã", cost: "Padrão / 1d8 PV", description: "Toque um aliado. Você sofre 1d8 de dano e cura 1d8 + Vigor PV no aliado. A cura é dobrada se ele estiver inconsciente." },
      { title: "Elo de Sangue", type: "Poder de Xamã", cost: "Mov / 2 PV", description: "Escolha um aliado em alcance curto. Até o fim da cena, todo dano que ele sofrer é dividido igualmente entre vocês." },
      { title: "Banquete da Vida", type: "Poder de Xamã", cost: "Reação / 2 Corrupção", description: "Quando uma criatura morre a curto alcance, você absorve a energia e cura 1d8 + seu Nível em PV. (Custo de Corrupção automático)." },
      { title: "Ritual de Purificação", type: "Poder de Xamã", cost: "Ritual / 2d6 PV", description: "Duração: 1 hora. Gaste PV e Oferendas Valiosas para remover uma condição negativa persistente (doença/maldição) de um alvo." },
      { title: "Mártir Implacável", type: "Poder de Xamã", cost: "Passivo", description: "Enquanto estiver com menos da metade dos seus PV máximos, recebe +2 em todos os testes de resistência e rolagens de dano." },
      { title: "Totem de Proteção", type: "Poder de Xamã", cost: "Completa / 1d4 PV", description: "Invoca um totem com 10 PV no chão. Aliados em curto alcance do totem ganham +2 na Defesa." },
      { title: "Totem da Fúria", type: "Poder de Xamã", cost: "Completa / 1d6 PV", description: "Invoca um totem. Aliados na área ganham +1d6 de dano corpo a corpo, mas entram em frenesi e sofrem -2 na Defesa." },
      { title: "Totem Dreno", type: "Poder de Xamã", cost: "Completa / 3 PV", description: "Inimigos que terminam o turno perto do totem sofrem 1d4 de dano necrótico. Você se cura em um valor igual ao dano causado." },
      { title: "Círculo de Cinzas", type: "Poder de Xamã", cost: "Padrão", description: "Traça uma linha ou círculo (até 6m). Inimigos que tentarem atravessar fazem Vontade. Falha: ficam paralisados no turno. Sucesso: atravessam, mas sofrem 1d6 de dano psíquico." },
      { title: "Solo Sagrado", type: "Poder de Xamã", cost: "Ritual / 5 PV", description: "Duração: 10 min. Prepara uma área de 9m que dura 1 dia. O custo de PV para seus rituais dentro desta área cai em -1 (mínimo 1)." },
      { title: "Agulha Vodu", type: "Poder de Xamã", cost: "Padrão / 2 PV", description: "Ataque à distância com fetiche. Se acertar, você sofre 1d4 de dano e o alvo sofre 3d6 de dano necrótico que ignora RD." },
      { title: "Ferver o Sangue", type: "Poder de Xamã", cost: "Padrão / 1d6 PV", description: "O alvo deve passar em Fortitude. Se falhar, sofre 2d8 de dano e fica Enjoado por 1 rodada com o sangue fervendo." },
      { title: "Lança de Hemoglobina", type: "Poder de Xamã", cost: "Padrão / 2 PV", description: "Ataque à distância. Dano: 1d10 + Vigor (Perfurante). A lança se desfaz após o ataque." },
      { title: "Praga Contagiosa", type: "Poder de Xamã", cost: "Padrão / 4 PV", description: "Alvo sofre 1d6 de dano por turno (Sangramento mágico). Se ele tocar em outro aliado dele, a praga se espalha." },
      { title: "Explosão Corpórea", type: "Poder de Xamã", cost: "Padrão / 6 PV", description: "Requer um cadáver recente. Explode o corpo causando 4d6 de dano em criaturas adjacentes (Reflexos reduz à metade)." },
      { title: "Vínculo Animal", type: "Poder de Xamã", cost: "Completa / 1d8 PV", description: "Você entra em transe e enxerga pelos olhos de um animal em alcance longo. Seu corpo principal fica indefeso." },
      { title: "Oráculo de Vísceras", type: "Poder de Xamã", cost: "Ritual / 4 PV", description: "Duração: 10 min. Uma vez por dia, lê as entranhas de uma criatura recém-morta para fazer uma pergunta direta ao Mestre." },
      { title: "Visão do Outro Lado", type: "Poder de Xamã", cost: "Mov / 4 PV", description: "Por uma cena, você consegue enxergar criaturas infectadas e a aura de possíveis fontes de corrupção." },
      { title: "Espírito Guardião", type: "Poder de Xamã", cost: "3 Corrupção", description: "Entidade possui você na cena. Ganha RD 5 (Dano Físico) e Imunidade a Medo. Custo: não pode falar de forma coerente no processo." },
      { title: "Sussurros dos Mortos", type: "Poder de Xamã", cost: "Passivo / 2 PV", description: "Ganha proficiência em Investigação. Pode gastar 2 PV para rolar novamente qualquer teste baseado em Sabedoria ou Inteligência." },
      { title: "Pele Escarificada", type: "Poder de Xamã", cost: "Passivo / 2 PV", description: "Passivo: +2 na Defesa devido às cicatrizes rituais. Ativo: Ao gastar 2 PV, você ganha RD 5 por uma rodada." },
      { title: "Forma Bestial", type: "Poder de Xamã", cost: "Completa / 4 PV", description: "Assume garras e presas. Seu dano desarmado vira 1d8 e você ganha +3m de deslocamento." },
      { title: "Coração da Floresta", type: "Poder de Xamã", cost: "Passivo", description: "Pré-requisito: Nível 6. Você se torna completamente imune a venenos e doenças naturais." },
      { title: "Sacrifício Final", type: "Poder de Xamã", cost: "Livre", description: "Se cair a 0 PV, pode realizar uma Ação Padrão imediata antes de desmaiar. Se essa ação matar um inimigo, você estabiliza com 1 PV." }
    ]
},

{
    name: "Atormentado",
    desc: "O usuário de magia bruta. O poder não é estudado, ele vaza pelas cicatrizes. O Atormentado é alguém que tocou a Essência pura e sobreviveu, mas agora seu corpo é um canal instável. Ele é uma bomba relógio viva.",
    stats: {
      hp: "20 + Vigor Inicial (+5 + Vig por nível)",
      pe: "Não possui (Utiliza os próprios PV e Pontos de Corrupção)",
      proficiencies: "Armas Simples e Marciais. Nenhuma armadura ou escudo (precisa da pele exposta para canalizar a corrupção).",
      skills: "Sincronia (Presença) e Constituição (Vigor). Escolha mais 2 entre: Intimidação, Misticismo, Luta, Sobrevivência ou Intuição."
    },
    fixedAbilities: [
      { title: "Canalização Sanguínea", type: "Habilidade de Classe", cost: "Passivo", description: "Nvl 1: Potência: Soma sua Corrupção Atual (máximo +5) ao dano mágico. Preço Alto: Seus poderes custam dados de PV (d6, d8, d10). Vício em Entropia: Ao tirar um Crítico Mágico, você recupera 2d6 PV imediatamente, mas ganha +1 Ponto de Corrupção." },
      { title: "Apoteose do Caído", type: "Habilidade de Classe", cost: "Livre (1/dia)", description: "Nvl 20 (Forma do Pesadelo): Dura 1 minuto (1d6 rodadas). Sua Corrupção conta como 10 para todos os bônus sem as penalidades normais. Seus poderes custam metade do PV e você ganha RD 10 a todo dano. Ao fim da transformação, cai para 1 PV e fica exausto." }
    ],
    powers: [
      { title: "Dedo da Ruína", type: "Poder de Atormentado", cost: "Padrão / 1d6 PV", description: "Dispara um raio de energia negra. Alcance Médio. Causa 2d8 + Essência de dano Necrótico." },
      { title: "Chicote de Vísceras", type: "Poder de Atormentado", cost: "Padrão / 1d4 PV", description: "Cria um chicote de sangue (Alcance Curto). Ataque corpo a corpo mágico. Dano 1d10 + Essência. Pode usar para derrubar ou desarmar (soma a Corrupção ao teste)." },
      { title: "Explosão de Agonia", type: "Poder de Atormentado", cost: "Padrão / 2d6 PV", description: "Grita e explode poder em alcance curto. Alvos sofrem 4d6 de dano (Vontade reduz à metade). Você sofre metade do dano causado." },
      { title: "Lâmina Sanguinária", type: "Poder de Atormentado", cost: "Mov / 1d6 PV", description: "Corta-se na lâmina da arma. Ela passa a causar +1d6 de dano necrótico até o fim da cena." },
      { title: "Fúria Mágica", type: "Poder de Atormentado", cost: "Livre", description: "Se sofreu dano nesta rodada (inimigos ou de si mesmo), pode lançar uma magia ou ataque mágico como Ação Bônus. O custo em PV do poder é dobrado." },
      { title: "Olhar do Abismo", type: "Poder de Atormentado", cost: "Padrão / 1d8 PV", description: "Alvo em alcance curto faz Vontade. Se falhar, fica Paralisado de medo por 1 rodada. Se passar, fica abalado." },
      { title: "Aura de Desespero", type: "Poder de Atormentado", cost: "Mov / 1 PV (Turno)", description: "Postura. Enquanto ativa, inimigos adjacentes a você sofrem -2 em testes de ataque e Vontade. Custa 1 PV no início de cada turno seu." },
      { title: "Vínculo de Dor", type: "Poder de Atormentado", cost: "Padrão / 1d6 PV", description: "Conecta-se a um inimigo visível. Todo dano que você sofrer na próxima rodada o inimigo também sofre (Teste de Vontade anula)." },
      { title: "Contágio da Queda", type: "Poder de Atormentado", cost: "Padrão / 1d8 PV + 1 Corr", description: "Ataque de toque. O alvo infectado recebe Vulnerabilidade a dano Necrótico até o fim da cena." },
      { title: "Sussurros Insanos", type: "Poder de Atormentado", cost: "Padrão / 1d8 PV", description: "O alvo sofre 2d6 de dano psíquico e é forçado a atacar a criatura mais próxima (amigo ou inimigo) na próxima rodada." },
      { title: "Armadura de Cicatrizes", type: "Poder de Atormentado", cost: "Passivo", description: "Sua pele é dura e deformada. Sua Defesa base é 10 + Agilidade + Corrupção Atual. Você não pode usar armaduras." },
      { title: "Dreno Agonizante", type: "Poder de Atormentado", cost: "Padrão / 1 Corrupção", description: "Ataque de toque. Causa 1d10 + Essência de dano necrótico. Você recupera PV igual à metade do dano causado. (Não custa PV, custa sua alma)." },
      { title: "Sangue Ácido", type: "Poder de Atormentado", cost: "Reação / 1d4 PV", description: "Quando atingido por um ataque corpo a corpo, seu sangue espirra. O atacante sofre 2d6 de dano de ácido." },
      { title: "Carne Instável", type: "Poder de Atormentado", cost: "Passivo", description: "Sua anatomia é indefinida. Você tem 25% de chance de ignorar o dano extra provindo de acertos críticos e ataques furtivos." },
      { title: "Regeneração Tumoral", type: "Poder de Atormentado", cost: "Completa / 1d8 PV + 1 Corr", description: "Força o corpo a fechar feridas com massa grotesca. Recupera 4d8 + Vigor PV." },
      { title: "Investida Traumática", type: "Poder de Atormentado", cost: "Mov", description: "Dash sobrenatural em linha reta (dobro do deslocamento). Ignora terreno difícil menor. Se terminar o movimento adjacente a um inimigo, ganha +2 no próximo ataque contra ele." },
      { title: "Visão da Verdade", type: "Poder de Atormentado", cost: "Passivo", description: "Enxerga no escuro (mesmo mágico) e detecta magia, mas seus olhos sangram no processo, concedendo -2 em testes de Percepção visual comum." },
      { title: "Aderência Profana", type: "Poder de Atormentado", cost: "Mov", description: "Esporas de osso ou sangue adesivo cobrem suas extremidades. Você ganha deslocamento de escalada igual ao seu deslocamento terrestre." },
      { title: "Interrogatório Mental", type: "Poder de Atormentado", cost: "Completa / 1d6 PV", description: "Força a mente de um alvo indefeso. Ele deve responder 3 perguntas verdadeiramente ou sofre 3d6 de dano psíquico por cada mentira." },
      { title: "Quebrar a Realidade", type: "Poder de Atormentado", cost: "Padrão / 2d8 PV", description: "Rasga a trama na força bruta. Anula uma magia de outro conjurador (como Dissipar Magia) num teste de Canalização vs Vontade." },
      { title: "Coração da Bomba", type: "Poder de Atormentado", cost: "Passivo", description: "Quando você cai a 0 PV, você explode causando 6d6 de dano em todos ao redor. Se for revivido depois, volta com +1 de Corrupção." },
      { title: "Avatar da Dor", type: "Poder de Atormentado", cost: "Cena / 2d10 PV", description: "Por uma cena, ganha +4 em Força e Vigor, mas perde a sanidade: deve atacar a criatura mais próxima sempre (não diferencia aliados de inimigos)." },
      { title: "Hemomancia Maior", type: "Poder de Atormentado", cost: "Passivo", description: "O dano de todos os seus poderes de Dano Direto aumenta em +1 dado (ex: 2d8 vira 3d8)." },
      { title: "Simbiose Parasitária", type: "Poder de Atormentado", cost: "Passivo", description: "Se você matar um inimigo usando o poder 'Dreno Agonizante', o custo de 1 Ponto de Corrupção daquela ativação é removido." }
    ]
}

];


const origensData = [
  {
    name: "Humanos",
    quote: "\"Nós não temos as garras dos Vaelen, a pele de pedra dos Korgath ou a visão dos Thalorim. Nós temos apenas uns aos outros e uma vontade maldita de não ficar no chão quando nos batem. É por isso que construímos cidades onde os monstros apenas caçam.\"\n— Capitão Darius, da Guarda de Verantis.",
    desc: "Enquanto as outras raças se especializaram biologicamente para ocupar nichos extremos, os Humanos mantiveram o caminho do meio. Eles são a 'cola' de Korzel. Foram eles que estabeleceram as rotas comerciais, padronizaram a moeda e criaram as leis que tentam (muitas vezes em vão) manter a ordem.\n\nHumanos não sobrevivem por serem fortes ou resistentes; eles sobrevivem porque são adaptáveis. Eles mudam suas táticas, suas ferramentas e suas lealdades com uma rapidez que assusta as raças mais antigas. Em Korzel, ser humano não é ser 'padrão'; é ser ambicioso o suficiente para achar que pode dominar um mundo que te odeia.",
    details: [
      {
        title: "Características Físicas",
        text: "Humanos em Korzel são extremamente diversos. A exposição a diferentes microclimas e a miscigenação constante criaram uma variedade infinita de tons de pele, tipos de cabelo e compleições. Eles vivem pouco em comparação aos Vaelen ou Khellaris, o que lhes dá um senso de urgência: eles precisam deixar sua marca no mundo agora."
      },
      {
        title: "Sociedade e Aventureiros",
        text: "Humanos dominam as planícies férteis e as grandes cidades comerciais. Eles são a maioria em qualquer taverna ou mercado.\n\nAventureiros humanos são os mais imprevisíveis. Um humano pode ser um Veterano de armadura pesada, um Bardo manipulador de massas, ou um Atormentado que aceitou a corrupção em troca de poder. Sua versatilidade é sua maior arma."
      }
    ],
    stats: {
      attributes: "+2 em Três Atributos diferentes à sua escolha. (Humanos não têm pontos fracos ou fortes definidos biologicamente; sua força vem da especialização individual).",
      size: "Médio. (Ocupa um espaço de 1,5m e não sofre penalidades de tamanho).",
      speed: "9m (6 quadrados)."
    },
    fixedAbilities: [
      { 
        title: "Versatilidade Ambiciosa", 
        type: "Habilidade de Raça", 
        cost: "Passivo", 
        description: "Inicia o jogo com treinamento em 2 Perícias à sua escolha (não precisam ter ligação com a classe escolhida). Além disso, recebe +1 Perícia treinada sempre que o bônus de Inteligência obtiver um aumento permanente." 
      },
      { 
        title: "Espírito de Comunidade", 
        type: "Habilidade de Raça", 
        cost: "Passivo", 
        description: "Devido à natureza social e dependência do trabalho em equipe, ao realizar a ação 'Prestar Ajuda' (Help) a um aliado, o bônus concedido torna-se +3 em vez de +2." 
      }
    ]
  },
  {
    name: "Khellaris",
    quote: "\"Amados por sua sabedoria, temidos por sua astúcia, respeitados por sua disciplina. Eles são os guardiões do conhecimento e, alguns diriam, os verdadeiros donos do futuro.\"",
    desc: "Os Khellaris são a raça mais antiga e influente de Korzel. Enquanto humanos construíam cabanas, os Khellaris erguiam Vel'Korrin, a \"Mãe do Conhecimento\", uma cidade onde torres negras se fundem aos desfiladeiros de mármore branco. Eles reverenciam o Noor'khella, um réptil marinho colossal de pele negra, símbolo de sua força e conexão com os mares profundos.",
    details: [
      {
        title: "Características Físicas",
        text: "A aparência Khellari é austera e misteriosa.\n\n• Pele: Varia do cinza \"como pedra polida\" até o escuro profundo \"como a noite sem lua\", refletindo sua adaptação às sombras e às ilhas rochosas.\n• Cabelos: Geralmente em tons metálicos ou pálidos. Podem ser cinza claro, prateados ou brancos como a lua cheia.\n• Olhos: Intensos e brilhantes. Variam do dourado penetrante ao púrpura profundo que arde como brasa.\n• Traços: Possuem orelhas pontiagudas e feições angulares que transmitem uma beleza fria."
      },
      {
        title: "Sociedade e Geografia: A Luz e a Sombra",
        text: "A nação Khellari é unida, mas estratificada. Todos servem ao trono, mas vivem realidades diferentes.\n\n1. Kalir (A Cidadela de Marfim e Obsidiana)\nA ilha principal é um monumento à ordem e à magia. O Bastião do Crepúsculo, no topo do monte mais alto, é o castelo real de muralhas negras com detalhes em púrpura e dourado. A ilha é regida pelo Rei Kalroth Veyrathen I e seu conselho absoluto, As Dez Sombras. Habitada por nobres, magos, arquitetos e estudiosos, a vida aqui é luxuosa e tecnológica.\n\n2. O Arquipélago da Penumbra (O Escudo do Rei)\nAo redor de Kalir, quatro ilhas menores formam um cinturão de proteção. Seus habitantes são pescadores exímios e fazendeiros de encostas. Vivem em casas de pedra branca e madeira polida, orgulhosos de serem a primeira linha de defesa naval. Dominam o mar e o uso prático do Shael'thaar."
      },
      {
        title: "Arma Cultural: O Shael'thaar",
        text: "Uma lâmina curva e elegante presa a uma corrente fina ou corda de seda de aranha.\n\n• Dano: 1d6 | Crítico: 19/x2 | Peso: 1kg\n• Propriedades: Ágil (usa Agilidade no ataque) e Arremesso (6m).\n• Especial: Concede +2 em testes de Manobra (Derrubar/Desarmar/Puxar) e pode ser usada como gancho para escalada, concedendo Vantagem em testes de subir superfícies."
      }
    ],
    stats: {
      attributes: "+2 Inteligência, +2 Agilidade, –2 Vigor. (Mentes brilhantes e reflexos rápidos, mas corpos esguios e menos resistentes a danos brutos).",
      size: "Médio. (Ocupa um espaço de 1,5m e não sofre penalidades de tamanho).",
      speed: "9m (6 quadrados)."
    },
    fixedAbilities: [
      {
        title: "Visão na Penumbra",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Seus olhos, adaptados às torres escuras e noites no mar, enxergam na escuridão total a até 18m."
      },
      {
        title: "Mente de Vel'Korrin",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "A cultura Khellari gira em torno do saber. Você se torna treinado em uma perícia de Conhecimento (História, Religião, Arcanismo) ou Ofício."
      },
      {
        title: "Tradição do Shael'thaar",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você sabe usar a arma tradicional de seu povo. Para você, o Shael'thaar é considerado uma arma simples."
      },
      {
        title: "Análise Estratégica",
        type: "Habilidade de Raça",
        cost: "Ação de Mov.",
        description: "Você pode gastar uma ação de movimento para analisar um inimigo. Se passar num teste de Inteligência (CD 15), o Mestre revela uma fraqueza, resistência ou traço oculto da criatura."
      },
      {
        title: "Vulnerabilidade Psíquica",
        type: "Fraqueza de Raça",
        cost: "Passivo",
        description: "A mente Khellari é aberta ao desconhecido, o que cobra seu preço. Você sofre –2 em testes de Vontade contra efeitos mentais e Dano Psíquico."
      }
    ],
    powers: [
      {
        title: "Herança: Nobre de Kalir",
        type: "Escolha de Herança",
        cost: "Passivo",
        description: "Você cresceu entre bibliotecas e intrigas da Cidadela. Você ganha proficiência em Diplomacia ou Enganação (à sua escolha)."
      },
      {
        title: "Herança: Filho da Penumbra",
        type: "Escolha de Herança",
        cost: "Passivo",
        description: "Você cresceu no mar e nas rochas do Arquipélago. Você ganha proficiência em Atletismo ou Pilotagem (à sua escolha), e pode prender a respiração pelo dobro do tempo normal."
      }
    ]
  },
  {
    name: "Korgaths",
    quote: "\"Eles não desviam da tempestade, nem do golpe. Eles o recebem de peito aberto, absorvem a dor e devolvem em dobro. Enfrentar um Korgath é como socar uma montanha esperando que ela sangre.\"\n— Kael de Veyrath, após o Torneio.",
    desc: "Os Korgaths são a prova viva da resiliência humana levada ao extremo biológico. Em eras passadas, quando a humanidade precisou escolher entre fugir ou endurecer, os ancestrais dos Korgath escolheram ficar.\n\nEles evoluíram para se tornar sua própria armadura e sua própria besta de carga. São conhecidos em todo o arquipélago como \"meio-gigantes\", servindo frequentemente como mercenários de elite, estivadores portuários ou guardas-costas inamovíveis.",
    details: [
      {
        title: "Características Físicas",
        text: "Eles são massivos, variando entre 2,10m e 2,40m de altura. Sua estrutura óssea é densa, com mandíbulas quadradas e testas proeminentes que protegem olhos fundos.\n\n• A Pele: É grossa como couro fervido, capaz de desviar lâminas mal afiadas e ignorar arranhões que fariam um humano sangrar.\n• A Pelagem: Diferente dos humanos das cidades, os Korgath mantiveram (e aprimoraram) a pelagem corporal. A quantidade e o estilo variam drasticamente conforme o clima de onde vêm, mas é sempre um traço de orgulho e virilidade."
      },
      {
        title: "As Três Culturas (O Sangue da Terra)",
        text: "O ambiente em Korzel não perdoa. Para sobreviver, os Korgath se dividiram em três culturas distintas, cada uma moldada pelo inferno geográfico que chama de lar.\n\n1. Norte: Os Presas de Gelo (O Povo da Tundra)\nNas terras geladas, tornaram-se os \"Vikings Primordiais\". Pele pálida, espessa camada de pelos claros, trançam ossos de caça. São caçadores de megafauna, valorizam a força explosiva e a resistência à dor.\n\n2. Savana: Os Caminhantes do Pó (O Povo do Sol)\nNas planícies áridas do Sul. Pele escura e rachada como o solo. Raspam os pelos deixando apenas jubas para proteger a nuca do sol. São nômades e os maiores Domadores de Feras de Korzel.\n\n3. Costa: Os Quebra-Marés (O Povo do Sal)\nHabitantes das costas tempestuosas. Pele brilhosa, pelos impermeáveis embaraçados em dreadlocks pesados adornados com dentes de tubarão. São pescadores de monstros e piratas."
      }
    ],
    stats: {
      attributes: "+2 Força, +2 Vigor, –2 Inteligência. (Sua biologia prioriza a potência muscular e a resistência a danos em detrimento do raciocínio acadêmico ou abstrato).",
      size: "Grande.",
      speed: "9m (6 quadrados)."
    },
    fixedAbilities: [
      {
        title: "Pele de Muralha",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Sua derme espessa é uma armadura natural. Você recebe +2 na Defesa. Este bônus acumula com armaduras usadas (sua pele endurece o couro ou preenche as falhas da cota de malha)."
      },
      {
        title: "Constituição Primordial",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você foi feito para durar. Você recebe +1 Ponto de Vida base extra por nível de personagem."
      },
      {
        title: "Carga de Impacto",
        type: "Habilidade de Raça",
        cost: "Livre",
        description: "Quando você usa sua massa para atacar, é devastador. Se você se mover pelo menos 6m em linha reta e acertar um ataque corpo a corpo, pode tentar a manobra 'Derrubar' como uma Ação Livre com bônus de +2."
      },
      {
        title: "Mãos Pesadas",
        type: "Fraqueza de Raça",
        cost: "Passivo",
        description: "A falta de delicadeza da sua estrutura bruta tem um preço. Você sofre –2 em testes de Ladinagem e testes de Ofícios delicados."
      }
    ],
    powers: [
      {
        title: "Herança: Sangue do Inverno",
        type: "Escolha de Herança (Norte)",
        cost: "Passivo",
        description: "Vindo dos Presas de Gelo da Tundra, seu corpo ignora a hipotermia. Você recebe Resistência a Frio 5 e Proficiência na perícia Intimidação."
      },
      {
        title: "Herança: Domador de Titãs",
        type: "Escolha de Herança (Savana)",
        cost: "Passivo",
        description: "Vindo dos Caminhantes do Pó, você forjou laços com as feras do deserto. Você recebe Resistência a Fogo 5 e Vantagem em testes para Lidar com Animais (Dinos/Bestas)."
      },
      {
        title: "Herança: Pulmões de Leviatã",
        type: "Escolha de Herança (Costa)",
        cost: "Passivo",
        description: "Vindo dos Quebra-Marés, você é uma força da natureza sob as águas. Você adquire Deslocamento de Natação 9m e pode prender a respiração debaixo d'água por até 20 minutos."
      }
    ]
  },
  {
    name: "Thalorims",
    quote: "\"A pedra não perdoa o erro, e a gravidade não aceita desculpas. No fundo da terra, você é preciso ou você é morto. Nós somos a raça que calculou como sobreviver.\"\n— Mestre-Engenheiro Vorn, da Casta do Mercúrio.",
    desc: "Os Thalorim são o triunfo da adaptação humana através da escassez. Milênios atrás, quando os predadores colossais tornaram as planícies um matadouro, um grupo de humanos fugiu para as fendas, cavernas e picos das montanhas.\n\nA evolução ali foi cruel e matemática: os grandes, que precisavam de muita comida e entalavam nos túneis, pereceram. Os compactos, eficientes e engenhosos sobreviveram. Hoje, eles não vivem mais escondidos. A partir de sua Cidadela da Base, eles exportam a tecnologia mais avançada de Korzel. Eles não usam magia; eles dominam a Física. Seus elevadores usam contrapesos perfeitos, suas bestas usam tensão de molas mortais e seus alquimistas flertam com o perigo da Pólvora Negra.",
    details: [
      {
        title: "Características Físicas",
        text: "Eles são humanos, mas de uma linhagem distinta. Sua altura média varia entre 1,50m e 1,60m. Não são anões de contos de fadas; são humanos atarracados, densos e com metabolismo ultra-eficiente.\n\n• Olhos: Grandes e com pupilas dilatadas, adaptados para captar a mínima luz das cavernas. Geralmente são negros ou de um castanho muito escuro.\n• Pele: Pálida, variando do branco-mármore ao cinza-pálido, devido a gerações longe do sol forte."
      },
      {
        title: "As Duas Castas (O Martelo e o Compasso)",
        text: "A sociedade Thalorim é uma máquina meritocrática. Embora biologicamente iguais ao nascer, o ofício que escolhem na juventude molda drasticamente seu físico e personalidade.\n\n1. Os Rubros (A Casta da Fuligem)\nOs Operários, Ferreiros e Mineradores. Passam a vida no calor das forjas e pedreiras. São expansivos, barulhentos e resolvem problemas na marreta. Têm ombros largos, pele avermelhada e mãos calejadas de fuligem.\n\n2. Os Pálidos (A Casta do Mercúrio)\nOs Engenheiros, Arquitetos e Químicos. Vivem em escritórios e laboratórios instáveis. Falam baixo, são reservados, técnicos e detestam o caos. Têm postura curvada, dedos ágeis manchados de tinta e usam óculos com lentes de aumento."
      },
      {
        title: "Nota sobre Tecnologia: A Pólvora Negra",
        text: "Em Korzel, a pólvora não é mágica, é química (Carvão, Enxofre e Salitre). Ela é:\n\n• Rara: Apenas os Thalorim sabem a \"receita\" segura.\n• Perigosa: Se molhar, estraga. Se pegar fogo, mata o usuário.\n• Experimental: As armas de fogo Thalorim são poderosas, mas instáveis. Um \"1\" natural no dado de ataque pode fazer a arma explodir na mão do usuário."
      }
    ],
    stats: {
      attributes: "+2 Inteligência, +2 Vigor, –2 Agilidade. (Mentes brilhantes e resistência metabólica invejável, mas pernas curtas e corpos densos não foram feitos para corridas ou acrobacias).",
      size: "Médio (Baixo).",
      speed: "6m (4 quadrados). (São mais lentos que humanos, khellaris e vaelen em terreno aberto)."
    },
    fixedAbilities: [
      {
        title: "Visão Adaptada",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Seus olhos evoluíram para a escuridão. Você enxerga na Penumbra como se fosse dia claro, e na Escuridão Total enxerga até 12m (em preto e branco)."
      },
      {
        title: "Metabolismo Eficiente",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você precisa de metade da comida e água que um humano normal necessitaria para sobreviver. Além disso, você tem Vantagem em testes de Vigor para resistir a privações (fome, sede, sufocamento)."
      },
      {
        title: "Engenharia Prática",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você sabe intuitivamente como as coisas são montadas — e como quebrá-las. Você causa +2 de dano contra Objetos e Construtos (golpeando as juntas, dobradiças ou pontos de tensão)."
      },
      {
        title: "Sensibilidade à Luz",
        type: "Fraqueza de Raça",
        cost: "Passivo",
        description: "A superfície é brilhante demais. Você fica ofuscado (-2 em ataques) se exposto à luz solar direta sem proteção (como óculos escuros de couro ou capuz)."
      }
    ],
    powers: [
      {
        title: "Casta: Os Rubros (A Casta da Fuligem)",
        type: "Escolha de Casta",
        cost: "Passivo",
        description: "Você é forjado no calor das pedreiras. Ganha Resistência a Fogo 5 e Vantagem em testes de Intimidação (Voz de Comando). Sua Força é considerada 4 pontos maior para fins de capacidade de carga e testes de força bruta (empurrar, levantar)."
      },
      {
        title: "Casta: Os Pálidos (A Casta do Mercúrio)",
        type: "Escolha de Casta",
        cost: "Passivo",
        description: "Você é um mestre da matemática e precisão. Ganha proficiência em Ofício (Engenharia ou Alquimia), pode recarregar armas com a propriedade Recarga como uma Ação de Movimento (ou reduzir o tempo em um passo), e pode usar Inteligência em vez de Instinto para testes de Percepção."
      }
    ]
  },
  {
    name: "Vaelen",
    quote: "\"A floresta não precisa de proteção. Ela precisa de comida. E você, forasteiro, acaba de invadir a despensa.\"\n— Yvra, Caçadora da Matilha dos Espinhos.",
    desc: "Os Vaelen não se consideram \"donos\" da natureza, mas sim uma extensão letal dela. Diferente dos elfos de lendas antigas que cantavam para as árvores, os Vaelen usam a seiva venenosa para banhar suas flechas e ossos de dinossauros para forjar armaduras. Eles vivem nas copas das Árvores-Titãs da região de Verdespinho, longe do solo onde os superpredadores caçam.\n\nPara um Vaelen, a sobrevivência é a única lei. Se um estranho entra em seu território, ele não é necessariamente um inimigo; ele é apenas calorias em potencial.",
    details: [
      {
        title: "Características Físicas",
        text: "Eles evoluíram para se fundir ao ambiente, mas mantiveram sua humanidade no olhar.\n\n• Aparência: Seus cabelos assemelham-se a cipós grossos ou folhas secas trançadas. Seus olhos possuem íris vibrantes em tons de âmbar ou verde, que contrastam intensamente com a parte branca, dando-lhes um olhar focado e penetrante de predador.\n• Pele Camuflada: Sua pele possui manchas sutis que mudam levemente de tom (verde, marrom, ocre) conforme a estação ou o ambiente, funcionando como uma camuflagem biológica natural.\n• Simbiose: É comum a prática de escarificação (cicatrizes rituais) onde permitem que fungos bioluminescentes ou musgos cresçam sobre a própria pele, aumentando sua conexão com a floresta."
      },
      {
        title: "O Cisma da Floresta (Origem Filosófica)",
        text: "A sociedade Vaelen não é um bloco único. Ao criar seu personagem, você deve escolher a qual filosofia ele pertence.\n\n1. Os Espinhos (O Caminho Antigo)\nXenófobos, Territoriais e Brutais. Eles acreditam que a civilização de pedra é uma praga que deve ser contida. Matam invasores à primeira vista, comem carne crua e desconfiam do metal. São os melhores rastreadores e assassinos de Korzel.\n\n2. A Raiz Eterna (O Caminho da Simbiose)\nDiplomatas, Xamãs e Guias. Acreditam que o mundo é um organismo único e que a floresta deve se unir à cidade para sobreviver à Corrupção. São calmos, usam flores vivas nas roupas e agem como embaixadores e guias de caravanas."
      },
      {
        title: "Arma Cultural: O Arco Syl'var",
        text: "Um arco enorme, feito de madeira de ferro ou osso da cauda de Raptor. Exige força brutal para ser tensionado, projetado para perfurar o couro grosso de dinossauros.\n\n• Dano: 1d10 | Crítico: x3 | Alcance: 30m | Peso: 3kg\n• Propriedades: Duas Mãos.\n• Especial (Tração Pesada): Diferente de arcos comuns, você pode somar seu modificador de Força nas rolagens de dano com esta arma.\n• Especial (Adaptável): Devido à sua robustez, pode ser usado como um bastão em combate corpo a corpo (Dano 1d6 Impacto) sem sofrer penalidade de arma improvisada."
      }
    ],
    stats: {
      attributes: "+2 Instinto, +2 Vigor, –2 Presença. (São incrivelmente perceptivos e resistentes, sobrevivendo onde outros morreriam em horas, mas são socialmente isolados, selvagens e de poucas palavras).",
      size: "Médio.",
      speed: "9m (6 quadrados)."
    },
    fixedAbilities: [
      {
        title: "Mimetismo Natural",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você pode tentar se esconder (Furtividade) mesmo sem cobertura total, desde que esteja em terreno natural (floresta, pântano, grama alta). Sua pele se mescla às sombras e folhagens."
      },
      {
        title: "Sentidos da Presa",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Para caçar (e não ser caçado), você precisa ouvir o estalar de um galho a quilômetros. Você ganha proficiência em Percepção e Sobrevivência."
      },
      {
        title: "Movimento Arbóreo",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você possui Deslocamento de Escalada de 9m. Você sobe em árvores e superfícies naturais com a mesma velocidade que anda no chão, sem precisar de testes de Atletismo."
      },
      {
        title: "Sangue de Seiva",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Séculos de exposição a esporos e venenos alteraram sua biologia. Você tem Resistência a Veneno 5."
      }
    ],
    powers: [
      {
        title: "Filosofia: Os Espinhos (O Caminho Antigo)",
        type: "Escolha de Filosofia",
        cost: "Passivo",
        description: "Você segue o caminho selvagem. Você recebe +2 em Iniciativa e não pode ser surpreendido enquanto estiver em ambientes naturais.\n\n⚠️ Defeito: Você sofre –2 em testes de Diplomacia com raças civilizadas."
      },
      {
        title: "Filosofia: A Raiz Eterna (O Caminho da Simbiose)",
        type: "Escolha de Filosofia",
        cost: "Passivo",
        description: "Você segue o caminho da conexão. Você ganha proficiência em Intuição e pode usar Instinto em vez de Presença para testes de Diplomacia (você convence pela sensatez e leitura corporal, não pelo charme).\n\n⚠️ Defeito: Seu sistema imunológico se abriu para o mundo. Você perde a vantagem em testes de resistência contra doenças (mas mantém a resistência a veneno)."
      }
    ]
  },
  {
    name: "Morvani",
    quote: "\"O mundo sangra, adoece e morre. Nós vendemos a cura, o veneno e o caixão. O ouro flui como o rio, e todos os rios levam a Verantis.\"\n— Lorde Valerius, da Casa Mercator.",
    desc: "Descendentes de humanos que se estabeleceram no Grande Delta do Sul há milênios, os Morvani evoluíram para transformar o ambiente mais tóxico de Korzel em um império comercial. Enquanto outros viam o pântano como morte, eles viram proteção e recursos. Eles são os maiores farmacêuticos, alquimistas e banqueiros do mundo. Sua sociedade é uma \"Veneza Sombria\" onde não existem estradas de terra, apenas canais, pontes e plataformas flutuantes.",
    details: [
      {
        title: "Características Físicas",
        text: "Para viver sobre águas paradas e gases de pântano, a biologia Morvani se tornou um filtro vivo.\n\n• Aparência: Pele pálida, fria e lisa como porcelana, quase sem poros. Secretam um óleo natural imperceptível que repele água suja e parasitas.\n• Olhos de Mercúrio: Possuem uma película prateada (tapetum lucidum) que protege contra vapores químicos e permite enxergar através da neblina densa do delta.\n• Imunidade: Órgãos internos hiper eficientes que permitem ingerir água contaminada ou alimentos levemente estragados sem adoecer."
      },
      {
        title: "Verantis: O Trono das Águas",
        text: "A capital não é uma ilha, mas uma metrópole artificial flutuante no centro do Delta. A cidade é um gráfico vertical de poder:\n\n1. O Distrito Alto (A Cúpula de Vidro): No centro, palácios góticos de metal negro e vidro erguem-se sobre pilotis gigantescos. Aqui vive a elite, cercada de luxo.\n2. O Limo (A Periferia): Uma mancha caótica de balsas podres e barracos sem teto que flutuam na água oleosa. Aqui vivem os pobres, lutando para não afundar literalmente."
      },
      {
        title: "A Cultura das Máscaras",
        text: "Devido aos miasmas do pântano e à arrogância social, cobrir o rosto é lei em Verantis.\n\n• A Elite: Usa máscaras de porcelana, ouro ou prata, com filtros de ervas raras embutidos no \"bico\".\n• O Povo: Usa máscaras de madeira tosca, casca de árvore ou panos amarrados.\n• O Tabu: Um Morvani sem máscara em público é considerado \"nu\" ou impuro."
      },
      {
        title: "Nota de Ambientação: Relações Diplomáticas",
        text: "Os Morvani conectam Korzel através da influência:\n\n• Com os Thalorim: Revenda da Pólvora Negra pelo triplo do preço.\n• Com os Korgath: Contratam-nos como guarda-costas para seus nobres frágeis.\n• Com os Vaelen: Refinam seiva bruta da floresta em remédios caríssimos.\n• Com os Humanos: Seus maiores clientes, compram a ilusão de saúde e segurança.\n• Com os Khellaris: Trocam venenos indetectáveis por proteção naval contra piratas."
      }
    ],
    stats: {
      attributes: "+2 Inteligência, +2 Presença, –2 Força. (Brilhantes e manipuladores, mas com musculatura atrofiada pelo estilo de vida sedentário).",
      size: "Médio.",
      speed: "9m (6 quadrados)."
    },
    fixedAbilities: [
      {
        title: "Sangue Purificado",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você é Imune a Doenças (mundanas e mágicas) e possui Resistência a Veneno 5. O que mata um humano comum causa apenas uma leve tontura em você."
      },
      {
        title: "Nascido no Rio",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você ignora penalidades de movimento em terreno difícil causado por lama ou água rasa. Além disso, possui proficiência na perícia Pilotagem (Barcos)."
      },
      {
        title: "O Olhar da Névoa",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Seus olhos prateados perfuram o miasma. Você ignora camuflagem causada por neblina, fumaça ou gases (naturais ou alquímicos)."
      },
      {
        title: "Educação Mercantil",
        type: "Habilidade de Raça",
        cost: "Passivo",
        description: "Você entende o valor das coisas. Pode usar Inteligência em vez de Presença para testes de Diplomacia e Barganha (convence pela lógica técnica e burocracia)."
      }
    ],
    powers: []
  },
];

const origensKorzel = [
  {
    nome: "Adestrador de Feras",
    descricao: "Você passou a juventude cuidando de herbívoros colossais ou treinando micro-raptores, garantindo que os animais das cidades não virassem banquete para predadores.",
    itens: "Um chicote ou cajado, luva de couro reforçada, ração de viagem extra.",
    pericias: "Adestramento, Montaria/Pilotar ou Percepção",
    poder: "Calma Primal: Você recebe +2 em testes de Adestramento. Além disso, animais neutros ou em pânico não atacam você a menos que você os fira primeiro."
  },
  {
    nome: "Arqueólogo de Carcaças",
    descricao: "Enquanto outros buscam ouro, você busca o 'marfim de pedra'. Especialista em extrair fósseis e ossos antigos de depósitos de alcatrão ou rochas sedimentares.",
    itens: "Picareta de minerador, pincéis, um fragmento de osso fossilizado.",
    pericias: "Investigação, Erudição ou Sobrevivência",
    poder: "Olho Clínico: Você sabe identificar a espécie e o ponto fraco de qualquer criatura reptiliana apenas pela observação de seus ossos ou rastros, recebendo +2 em testes de ataque contra ela pela cena."
  },
  {
    nome: "Caçador de Ovos",
    descricao: "Um trabalho perigoso e lucrativo. Você se infiltra em ninhos de grandes répteis para roubar ovos antes da eclosão.",
    itens: "Mochila reforçada com palha, corda (15m), gancho de escalada.",
    pericias: "Acrobacia, Atletismo ou Ladinagem",
    poder: "Passo Leve: Você recebe +5 em Furtividade para não acordar criaturas adormecidas e ignora penalidades de movimento durante escaladas."
  },
  {
    nome: "Coletor de Âmbar",
    descricao: "Você explorou as florestas mais profundas em busca da resina dourada, muitas vezes deparando-se com insetos gigantes e plantas carnívoras.",
    itens: "Frasco com solvente, faca de resina, 3 pedras de âmbar bruto.",
    pericias: "Sobrevivência, Fortitude ou Percepção",
    poder: "Resistência Botânica: Você recebe +2 em testes de Fortitude contra venenos naturais e doenças botânicas."
  },
  {
    nome: "Sentinela de Fronteira",
    descricao: "Você serviu nas defesas externas, vigiando o horizonte para avisar quando um Tiranossauro ou uma manada em debandada se aproximava.",
    itens: "Luneta rudimentar, arco curto, capa de camuflagem.",
    pericias: "Percepção, Sobrevivência ou Furtividade",
    poder: "Alerta Máximo: Você pode rolar novamente testes de Percepção para evitar surpresas (mas deve aceitar o segundo resultado)."
  },
  {
    nome: "Eremita das Cimeiras",
    descricao: "Você viveu isolado nos picos mais altos, onde os pterossauros fazem seus ninhos, em busca de iluminação ou apenas paz.",
    itens: "Cajado de madeira, ervas medicinais, cobertor de pele grossa.",
    pericias: "Vontade, Intuição ou Medicina",
    poder: "Pulmão das Alturas: Você é imune a efeitos de fadiga por altitude ou ar rarefeito e recebe +2 em testes de Vontade."
  },
  {
    nome: "Navegador de Rios",
    descricao: "Você navegou pelos canais e rios perigosos de Korzel, desviando de espinossauros e operando eclusas pesadas.",
    itens: "Remo reforçado, rede de pesca, frasco de óleo repelente.",
    pericias: "Montaria/Pilotar, Atletismo ou Percepção",
    poder: "Leitura das Águas: Você recebe +5 em testes de Pilotagem para navegar em rios e nunca é pego de surpresa por criaturas submersas."
  },
  {
    nome: "Degredado dos Pântanos",
    descricao: "Você sobreviveu sozinho nos lamaçais de Korzel, consumindo o que a lama oferecia após o exílio ou a destruição de sua casa.",
    itens: "Lança de madeira endurecida, colar de dentes, saco de dormir impermeável.",
    pericias: "Sobrevivência, Constituição ou Furtividade",
    poder: "Imunidade de Lama: Você ignora terreno difícil causado por lama ou pântanos e recupera 1 PV extra por hora durante o descanso em ambientes naturais úmidos."
  },
  {
    nome: "Escravo de Galés",
    descricao: "Você passou anos acorrentado aos remos de um navio mercante ou de guerra, resistindo a tempestades e leviatãs marinhos.",
    itens: "Algemas quebradas (podem ser usadas como braçadeiras), faca enferrujada, símbolo de sorte.",
    pericias: "Atletismo, Montaria/Pilotar ou Constituição",
    poder: "Força de Vontade: Uma vez por dia, você pode ignorar a condição Fatigado ou Exausto por uma cena completa."
  },
  {
    nome: "Órfão de Ataque",
    descricao: "Sua aldeia foi pisoteada por um titã ou devorada em uma noite de caça. Você cresceu nas ruas das grandes cidades e aprendeu a se virar.",
    itens: "Um brinquedo de madeira quebrado, roupas remendadas, uma pedra de funda.",
    pericias: "Ladinagem, Enganação ou Acrobacia",
    poder: "Sobrevivência Urbana: Você consegue encontrar comida e abrigo para até 4 pessoas em qualquer cidade sem a necessidade de gastar dinheiro."
  },
  {
    nome: "Caçador de Pragas",
    descricao: "As cidades de Korzel sofrem com infestações de micro-raptores e artrópodes nos esgotos. Você é quem limpa a sujeira que ninguém vê.",
    itens: "Lanterna de óleo, rede de captura, máscara de proteção contra odores.",
    pericias: "Iniciativa, Luta ou Furtividade",
    poder: "Adaptado ao Lixo: Você recebe +5 em testes de Fortitude contra doenças e venenos de criaturas pequenas ou insetos."
  },
  {
    nome: "Gladiador da Arena",
    descricao: "Nem todos os combates em Korzel são contra monstros. Nas arenas das cidades, você lutou por moedas e glória, sobrevivendo a confrontos brutais.",
    itens: "Uma arma marcial à sua escolha, cicatriz de batalha visível, ataduras.",
    pericias: "Luta, Iniciativa ou Atletismo",
    poder: "Showman de Batalha: Quando você derruba um inimigo ou acerta um crítico, todos os aliados visuais recebem +2 no próximo teste de ataque (não cumulativo)."
  },
  {
    nome: "Vigilante dos Cortiços",
    descricao: "Vivendo nas sombras da classe baixa, você era o protetor de uma vizinhança esquecida pelo governo através de um código de silêncio e facas rápidas.",
    itens: "Manto escuro, punhal escondido, símbolo de uma irmandade secreta.",
    pericias: "Furtividade, Ladinagem ou Intimidação",
    poder: "Sombra da Vizinhança: Você recebe +2 em Defesa e Reflexos em ambientes urbanos sob cobertura ou penumbra."
  },
  {
    nome: "Mercador de Relíquias",
    descricao: "Você viaja entre as cidades para comercializar garras, venenos, dentes decorados e curiosidades encontradas nos ermos.",
    itens: "Balança de precisão, bolsa de moedas, mercadorias diversas.",
    pericias: "Diplomacia, Intuição ou Ofício (Mercador)",
    poder: "Olho para o Valor: Você sempre consegue vender itens por 10% a mais do valor de mercado e sabe identificar itens mágicos ou raros com um teste de Investigação."
  },
  {
    nome: "Engenheiro de Cerco",
    descricao: "Seu foco não é a espada, mas a construção e reparo das defesas, balistas e fortificações que protegem as cidades contra incursões de grandes predadores.",
    itens: "Ferramentas de medição, martelo pesado, óleo de engrenagem.",
    pericias: "Ofício (Engenharia/Carpintaria), Erudição ou Pontaria",
    poder: "Artilheiro Treinado: Você recebe +2 em testes de ataque com armas de arremesso, bestas ou armas de cerco."
  },
  {
    nome: "Ervanário de Campo",
    descricao: "Sua família instruiu você sobre quais plantas curam e quais matam. Você é essencial em qualquer expedição que pretenda voltar viva.",
    itens: "Kit de medicina, bolsa de ervas, almofariz e pilão.",
    pericias: "Medicina, Sobrevivência ou Erudição",
    poder: "Triagem Rápida: Você pode usar a perícia Medicina como uma Ação de Movimento (em vez de Padrão) para estabilizar aliados sangrando."
  },
  {
    nome: "Cozinheiro de Carne de Titã",
    descricao: "A gastronomia de Korzel é perigosa. Você sabe como remover as glândulas de veneno de feras tóxicas e amaciar carnes duras para o consumo.",
    itens: "Faca de açougueiro (arma leve), kit de temperos exóticos, avental manchado.",
    pericias: "Ofício (Culinária), Constituição ou Sobrevivência",
    poder: "Dieta de Caçador: Durante um descanso curto, as refeições preparadas por você garantem +1d6 PV extras para todos os aliados que se alimentarem."
  },
  {
    nome: "Arquivista de Lendas",
    descricao: "Você trabalhou em bibliotecas ou grandes observatórios, com foco no registro dos movimentos das feras e das leis que governam o mundo.",
    itens: "Lente de aumento, livro antigo de registro, tinta e pena.",
    pericias: "Erudição, Investigação ou Percepção",
    poder: "Saber Ancestral: Uma vez por dia, você pode fazer um teste de Erudição para descobrir a vulnerabilidade elemental de um monstro ou o funcionamento de um item mágico desconhecido."
  },
  {
    nome: "Diplomata de Fronteira",
    descricao: "Você atuou como tradutor e mediador de tensões entre as diferentes raças e culturas, compreendendo as regras sociais de Korzel.",
    itens: "Traje de seda exótica, selo diplomático, pergaminho de leis inter-raciais.",
    pericias: "Diplomacia, Erudição ou Intuição",
    poder: "Etiqueta de Korzel: Você pode realizar testes de Diplomacia para acalmar conflitos como uma Ação de Movimento. Em caso de sucesso, os envolvidos ficam impedidos de realizar ações hostis por 1 rodada."
  },
  {
    nome: "Portador de Tradições",
    descricao: "Você foi o responsável por carregar os símbolos sagrados ou instrumentos musicais de sua comunidade, garantindo a proteção e a moral do grupo.",
    itens: "Totem de madeira ou um instrumento musical, incensos, bolsa de recursos artesanais.",
    pericias: "Atuação, Religião ou Vontade",
    poder: "Proteção Espiritual: Você recebe RD 2 contra dano necrótico ou espiritual e +2 em testes contra Corrupção."
  },
  {
    nome: "Caçador de Trilhas",
    descricao: "Você passou o tempo mapeando caminhos brutais e seguindo pegadas profundas nos ecossistemas mais implacáveis de Korzel.",
    itens: "Bússola rudimentar, cantil de couro reforçado, diário de mapeamento.",
    pericias: "Sobrevivência, Percepção ou Investigação",
    poder: "Rastreador Especialista: Você ignora penalidades por movimento ao rastrear e pode identificar há quanto tempo uma criatura passou por ali com precisão de minutos."
  }
];

export default function Compendio({ handleAddAbility, savedCharacters, activeCharacterName }) {
  const [activeSection, setActiveSection] = useState('lore');
  const [selectedTopic, setSelectedTopic] = useState(classesData[0]);
  
  // Estados do Modal de Forja
  const [forgeModalOpen, setForgeModalOpen] = useState(false);
  const [powerToForge, setPowerToForge] = useState(null);
  const [targetCharId, setTargetCharId] = useState("active");

 const handleTabChange = (section) => {
    setActiveSection(section);
    if (section === 'classes') setSelectedTopic(classesData[0]);
    if (section === 'origens') setSelectedTopic(origensData[0]);
    if (section === 'origensKorzel') setSelectedTopic(origensKorzel[0]); // Define o primeiro antecedente/origem
  };

  const openForgeModal = (power) => {
    setPowerToForge(power);
    setTargetCharId("active");
    setForgeModalOpen(true);
  };

  const confirmForge = () => {
    handleAddAbility(powerToForge, targetCharId);
    setForgeModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-0 relative">
      
      {/* MODAL DE FORJA */}
      {forgeModalOpen && powerToForge && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-zinc-950 border-2 border-red-900/50 rounded-xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(153,27,27,0.4)]">
            <h3 className="text-red-500 font-bold uppercase tracking-widest text-lg border-b border-red-900/50 pb-2 mb-4">
              Forjar Poder
            </h3>
            <p className="text-zinc-300 text-sm mb-4">
              O poder <strong className="text-white">"{powerToForge.title || powerToForge.poder}"</strong> será adicionado à aba de habilidades. Escolha o destinatário:
            </p>
            
            <select 
              value={targetCharId} 
              onChange={(e) => setTargetCharId(e.target.value)}
              className="w-full bg-black border border-red-900/50 rounded-md p-3 text-white focus:outline-none focus:border-red-500 shadow-inner appearance-none cursor-pointer font-bold mb-6"
            >
              <option value="active">👉 Atual: {activeCharacterName}</option>
              {savedCharacters && savedCharacters.map(char => (
                <option key={char.id} value={char.id}>🛡️ Oculto: {char.name}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <button onClick={() => setForgeModalOpen(false)} className="flex-1 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase transition-colors">Cancelar</button>
              <button onClick={confirmForge} className="flex-1 px-4 py-2 text-xs font-bold bg-red-900 hover:bg-red-700 text-white rounded uppercase transition-colors shadow-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* MENU LATERAL DO COMPÊNDIO */}
      <div className="w-full lg:w-64 bg-zinc-950/80 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-2 shrink-0 h-fit shadow-lg backdrop-blur-sm z-10">
        <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4 border-b border-amber-900/30 pb-2 flex items-center gap-2">
          <img src={mosasaurusSkull} className="w-5 h-5 filter invert opacity-80" alt="Skull" />
          Índice Korzel
        </h3>
        <button onClick={() => handleTabChange('lore')} className={`text-left px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeSection === 'lore' ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>O Mundo de Korzel</button>
        <button onClick={() => handleTabChange('classes')} className={`text-left px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeSection === 'classes' ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>Classes & Poderes</button>
        {/* BOTÃO ALTERADO AQUI */}
        <button onClick={() => handleTabChange('origens')} className={`text-left px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeSection === 'origens' ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>Raças</button>
        {/* NOVO BOTÃO ADICIONADO AQUI */}
        <button onClick={() => handleTabChange('origensKorzel')} className={`text-left px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeSection === 'origensKorzel' ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>Origens do Passado</button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 bg-[#140c08] border-2 border-[#3e2723] rounded-xl overflow-hidden flex flex-col min-h-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] relative z-10">
        
        {activeSection === 'lore' && (
          <div className="p-8 overflow-y-auto custom-scrollbar h-full flex flex-col animate-fade-in relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
               <img src={mosasaurusSkull} className="w-[600px] h-[600px] filter invert" alt="Skull BG" />
            </div>
            <h1 className="text-3xl font-black text-amber-500 uppercase tracking-widest border-b-2 border-amber-900/50 pb-4 mb-6 drop-shadow-md z-10">O Mundo de Korzel</h1>
            <div className="space-y-6 text-zinc-300 leading-relaxed text-lg text-justify font-serif z-10">
              {loreText.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="first-letter:text-5xl first-letter:font-black first-letter:text-amber-600 first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {(activeSection === 'classes' || activeSection === 'origens' || activeSection === 'origensKorzel') && (
          <div className="flex flex-col h-full animate-fade-in">
            {/* SUB-MENU HORIZONTAL DE SELEÇÃO ATUALIZADO */}
            <div className="bg-[#0a0502] border-b border-[#3e2723] p-4 flex gap-3 overflow-x-auto custom-scrollbar shrink-0 shadow-md z-10">
              {(activeSection === 'classes' 
                ? classesData 
                : activeSection === 'origens' 
                ? origensData 
                : origensKorzel
              ).map((item, idx) => {
                const name = item.name || item.nome; // Suporta as duas chaves de nome
                return (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedTopic(item)}
                    className={`px-4 py-2 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-md border transition-all ${
                      (selectedTopic.name === name || selectedTopic.nome === name) 
                        ? 'bg-red-950/60 border-red-800 text-red-400 shadow-[0_0_10px_rgba(153,27,27,0.5)]' 
                        : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar h-full relative z-10">
              
              {/* RENDERIZAÇÃO DA NOVA ABA: ORIGENS KORZEL */}
              {activeSection === 'origensKorzel' ? (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">{selectedTopic.nome}</h2>
                  <p className="text-zinc-400 mb-6 border-l-4 border-amber-700 pl-4 italic text-sm whitespace-pre-wrap bg-amber-950/5 py-2 rounded-r">
                    {selectedTopic.descricao}
                  </p>

                  <div className="bg-black/50 border border-[#3e2723] rounded-lg p-5 mb-6 shadow-inner text-sm space-y-3">
                    <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs border-b border-[#3e2723] pb-2">
                      🎒 Equipamentos & Perícias de Origem
                    </h3>
                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] font-bold block">⚔️ Itens Iniciais</span>
                      <span className="text-zinc-200">{selectedTopic.itens}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] font-bold block">🎲 Perícias Disponíveis</span>
                      <span className="text-zinc-200">{selectedTopic.pericias}</span>
                    </div>
                  </div>

                  <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm border-b-2 border-red-900/50 pb-2 mb-4"> Poder Primal Obtido</h3>
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-amber-400 font-bold">{selectedTopic.nome}</h4>
                        <span className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-500 uppercase">Habilidade de Origem</span>
                      </div>
                      <p className="text-xs text-zinc-400 whitespace-pre-wrap">{selectedTopic.poder}</p>
                    </div>
                    <button 
                      onClick={() => openForgeModal({ title: selectedTopic.nome, description: selectedTopic.poder, cost: "Origem" })} 
                      className="shrink-0 bg-amber-950/40 hover:bg-amber-900 border border-amber-900 text-amber-200 text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded transition-colors w-full md:w-auto"
                    >
                      ➕ Forjar na Ficha
                    </button>
                  </div>
                </div>
              ) : (
                /* RENDERIZAÇÃO ANTIGA (CLASSES E RAÇAS) SEGUURAS */
                <>
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">{selectedTopic.name}</h2>
                  {selectedTopic.quote ? (
                    <div className="mb-8">
                      <div className="mb-6 border-l-4 border-red-900 pl-4 py-2 bg-red-950/10 rounded-r shadow-inner">
                        <p className="text-zinc-400 italic text-sm whitespace-pre-wrap">{selectedTopic.quote}</p>
                      </div>
                      <div className="mb-6 space-y-4 text-zinc-300 text-sm leading-relaxed text-justify">
                        {selectedTopic.desc && selectedTopic.desc.split('\n\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                      {selectedTopic.details && selectedTopic.details.length > 0 && (
                        <div className="space-y-5 border-t border-[#3e2723] pt-6 mt-6">
                          {selectedTopic.details.map((detail, idx) => (
                            <div key={idx}>
                              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">{detail.title}</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed text-justify whitespace-pre-wrap">{detail.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-zinc-400 mb-8 border-l-4 border-red-900 l-4 italic text-sm whitespace-pre-wrap">
                      {selectedTopic.desc}
                    </p>
                  )}
                  
                  {selectedTopic.stats && Object.keys(selectedTopic.stats).length > 0 && (
                    <div className="bg-black/50 border border-[#3e2723] rounded-lg p-5 mb-8 shadow-inner">
                      <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs border-b border-[#3e2723] pb-2 mb-4">
                        {activeSection === 'classes' ? 'Características Básicas' : '📊 CARACTERÍSTICAS DE RAÇA'}
                      </h3>
                      
                      {activeSection === 'classes' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">❤️ Vida (PV)</span><span className="text-zinc-200">{selectedTopic.stats.hp}</span></div>
                          <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">⚡ Esforço (PE)</span><span className="text-zinc-200">{selectedTopic.stats.pe}</span></div>
                          <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">🛡️ Proficiências</span><span className="text-zinc-200">{selectedTopic.stats.proficiencies}</span></div>
                          <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">🎲 Perícias Iniciais</span><span className="text-zinc-200">{selectedTopic.stats.skills}</span></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500 uppercase text-[10px] font-bold block">🧬 Atributos</span>
                            <span className="text-zinc-200">{selectedTopic.stats.attributes}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">📏 Tamanho</span><span className="text-zinc-200">{selectedTopic.stats.size}</span></div>
                            <div><span className="text-zinc-500 uppercase text-[10px] font-bold block">🏃 Deslocamento</span><span className="text-zinc-200">{selectedTopic.stats.speed}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTopic.fixedAbilities && selectedTopic.fixedAbilities.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm border-b-2 border-red-900/50 pb-2 mb-4">
                        {activeSection === 'classes' ? 'Habilidades da Classe (Fixas)' : '🧬 HABILIDADES DE RAÇA'}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedTopic.fixedAbilities.map((power, idx) => (
                          <div key={idx} className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-red-300 font-bold">{power.title}</h4>
                                <span className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-500 uppercase">{power.cost}</span>
                              </div>
                              <p className="text-xs text-zinc-400 whitespace-pre-wrap">{power.description}</p>
                            </div>
                            <button onClick={() => openForgeModal(power)} className="shrink-0 bg-red-950/40 hover:bg-red-900 border border-red-900 text-red-200 text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded transition-colors w-full md:w-auto">
                              ➕ Forjar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTopic.powers && selectedTopic.powers.length > 0 && (
                    <div>
                      <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm border-b-2 border-amber-900/50 pb-2 mb-4">Poderes e Mecânicas (Escolhas)</h3>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {selectedTopic.powers.map((power, idx) => (
                          <div key={idx} className="bg-black/60 border border-zinc-800/80 hover:border-amber-700/50 rounded-lg p-5 flex flex-col justify-between shadow-md transition-colors group">
                            <div>
                              <div className="flex justify-between items-start mb-3 gap-4">
                                <div className="flex flex-col">
                                  <h4 className="text-amber-400 font-bold text-base">{power.title}</h4>
                                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{power.type}</span>
                                </div>
                                <span className="bg-amber-950/40 border border-amber-900/50 px-2 py-1 rounded text-[9px] font-bold text-amber-300 tracking-widest whitespace-nowrap shadow-inner">
                                  {power.cost}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">{power.description}</p>
                            </div>
                            
                            <button 
                              onClick={() => openForgeModal(power)}
                              className="w-full mt-auto bg-zinc-900 hover:bg-amber-900/80 text-zinc-400 hover:text-white border border-zinc-700 hover:border-amber-600 text-[10px] uppercase font-bold tracking-widest py-2.5 rounded transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                            >
                              ➕ Forjar na Ficha
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}