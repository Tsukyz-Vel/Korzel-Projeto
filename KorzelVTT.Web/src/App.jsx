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

// 2. PANTEÃO COM PODERES ATUALIZADOS E CUSTO EM PV
const panteaoKorzel = {
  "Nenhum": { mascara: "Ateu ou Indiferente.", verdade: "O vazio existencial e a negação do Plano Antigo.", obrigacao: "Sem deuses, sem mestres.", punicao: "Nenhuma punição.", poderes: [] },
  "Krognar, O Quebra-Ossos": { mascara: "Deus da Força, da Superação e da Guerra. Seus seguidores acreditam que a dor é o cinzel que esculpe o forte.", verdade: "A Carne Viva, uma força de evolução biológica descontrolada que quer criar o organismo supremo através de estresse e fúria.", obrigacao: "A dor é o único mestre. Você não pode usar armaduras médias ou pesadas, nem empunhar escudos (a carne deve sofrer para evoluir). Você também rejeita curas místicas rápidas, podendo recuperar PV apenas por descanso natural ou consumindo o sangue/carne de inimigos formidáveis recém-abatidos.", punicao: "A biologia do seu corpo entra em colapso punitivo. Seus ossos crescem tortos e seus músculos entram em espasmo. Você sofre Desvantagem em todas as rolagens de ataque corpo a corpo e seu Deslocamento é reduzido pela metade até que derrote um inimigo de nível igual ou superior sozinho e sem ajuda.", poderes: [{ title: "Carapaça Reativa", cost: "3 PV", desc: "Sua devoção calcifica sua pele. Você recebe +1 na Defesa e RD 2 permanente. Ao sofrer um Acerto Crítico, a carapaça explode, causando 2d6 de dano perfurante nos inimigos adjacentes." }, { title: "Fúria Mutante", cost: "2 PV", desc: "Seus braços hipertrofiam e estalam por uma rodada. Seu ataque ganha Alcance +1,5m e causa +1d8 de dano de Impacto bônus." }, { title: "Ossos Inquebráveis", cost: "Passivo / 1 Vez por dia", desc: "Quando você sofrer dano que te levaria a 0 PV (letal). Seus ossos travam. Você estabiliza instantaneamente com 1 PV e ganha +4 em testes de Força até o fim da cena." }, { title: "Odor de Predador", cost: "1 PV", desc: "Você exala feromônios espessos de agressividade. Inimigos a 9m devem passar em Fortitude ou serão forçados a focar seus ataques em você por 1 rodada." }] },
  "Slyph, A Sra. dos Sussurros": { mascara: "Deusa do Conhecimento, da Magia e das Estrelas. Dizem que ela sussurra inspiração para artistas e segredos para espiões.", verdade: "O Caos cognitivo e a informação pura que o cérebro não aguenta, buscando dissolver a realidade em um pesadelo.", obrigacao: "A previsibilidade é um insulto ao Caos. Você é proibido de participar de planejamentos táticos estruturados (como emboscadas perfeitas). Se você descobrir o ponto fraco ou segredo de um inimigo, deve gritar essa informação no meio do combate, mesmo que isso alerte os alvos de que você os descobriu.", punicao: "A entidade despeja o universo na sua mente, causando alucinações severas. No início de todo combate, você deve rolar 1d6. Se cair 1 ou 2, a confusão te domina e você é obrigado a usar sua ação mais forte contra a criatura mais próxima de você, seja ela aliado ou inimigo.", poderes: [{ title: "Mente Labiríntica", cost: "Passivo", desc: "Resistência a Dano Psíquico 5. Se um inimigo tentar feitiços mentais contra você, ele sofre 2d6 de dano psíquico e fica Atordoado (1 rodada)." }, { title: "Sussurros da Sorte", cost: "2 PV", desc: "Uma vez por combate, se você falhar em um ataque ou teste, uma voz te diz onde não golpear. Role o teste novamente e some +1d6 ao resultado novo." }, { title: "Alucinação Projetada", cost: "4 PV", desc: "Ação Padrão. Injeta caos na mente de um alvo a 15m. O alvo deve passar em Vontade ou é forçado a atacar o aliado mais próximo a ele com força total no próximo turno." }, { title: "Olhar do Oculto", cost: "1 PV", desc: "Por uma cena, as escamas caem dos seus olhos. Você enxerga no escuro mágico e detecta a silhueta de qualquer item mágico, veneno ou criatura invisível a até 18m." }] },
  "Mekhan, O Grande Arquiteto": { mascara: "Deus da Ordem, da Construção e da Proteção. Ele é a estrutura que impede o mundo de desabar no caos.", verdade: "A Estase, o desejo de entropia zero, um universo congelado onde nada nasce, morre ou muda.", obrigacao: "O caos tático deve ser erradicado. Você é proibido de usar táticas de Enganação, Furtividade ou de utilizar itens alquímicos instáveis (como a perigosa pólvora negra). Ao atacar um alvo em combate, você não pode mudar de alvo até que você ou ele caiam.", punicao: "A ordem absoluta cobra seu preço. Suas juntas enrijecem como metal enferrujado. Você perde completamente a capacidade de usar Ações de Movimento e Reações (não pode esquivar, reposicionar ou fazer ataques de oportunidade) até que conserte a estrutura da promessa quebrada.", poderes: [{ title: "Estrutura Imóvel", cost: "Passivo", desc: "Imune a empurrões e derrubadas. Se terminar seu turno sem se mover nenhum quadrado, ganha RD 5 absoluta contra todo tipo de dano na próxima rodada." }, { title: "Geometria Perfeita", cost: "2 PV", desc: "Gasto antes de atacar. Você calcula o ângulo cirúrgico. Seu ataque ignora qualquer penalidade de Cobertura e ignora toda a Redução de Dano (RD) do alvo." }, { title: "Prisão de Cristal", cost: "6 PV", desc: "Ação Padrão. Conjura uma jaula de luz dura em um inimigo Médio ou menor (Reflexos anula). O alvo fica Imobilizado até destruir a jaula (Dureza 10, 20 PV)." }, { title: "Marcha Inexorável", cost: "Passivo", desc: "O espaço se endireita. Ignora totalmente magias de lentidão, paralisia ou terreno difícil. Seu Deslocamento nunca pode ser reduzido contra a sua vontade." }] },
  "Arak-Nul, A Mãe da Caçada": { mascara: "Deusa da Natureza, das Feras e da Fertilidade. A protetora do ciclo da vida e da morte.", verdade: "O Enxame, o instinto predatório sem fim que deseja que a vida devore tudo em reprodução frenética.", obrigacao: "O consumo é absoluto. Você não pode empunhar armas forjadas em metal (apenas ossos, presas, madeira ou garras). Sempre que um inimigo cair, sua prioridade instintiva é se alimentar: você deve gastar parte do seu turno para arrancar e consumir um pedaço da carne dele, mesmo sob ataque.", punicao: "O instinto predador vira-se contra seu próprio corpo. Uma fome sobrenatural drena sua vitalidade: você sofre 1 ponto de dano contínuo e irredutível no início de todos os seus turnos, e magias de cura não funcionam em você até que você devore o coração cru de um inimigo de grande porte.", poderes: [{ title: "Ciclo de Sangue", cost: "Passivo", desc: "Quando você dá o golpe fatal (0 PV) em um inimigo, você drena a vitalidade crua dele, recuperando 1d8 + Nível em PV. Suas armas de osso ignoram a RD de monstros." }, { title: "Vínculo de Matilha", cost: "3 PV", desc: "Ação Bônus. Tosse sanguessugas espirituais que atacam inimigos adjacentes a você. Inimigos afetados ficam Desprevenidos (fáceis de acertar) por 1 rodada." }, { title: "Sangue Ácido", cost: "1 PV (Reação)", desc: "Ao ser atingido corpo a corpo, seu sangue espirra. O atacante sofre 1d6 de dano de Ácido e a arma dele perde -1 de Bônus de Dano até o fim da cena." }, { title: "Faro do Alfa", cost: "Passivo", desc: "Uma criatura que já sofreu dano seu adquire uma Marca de Sangue. Você rastreia a posição exata dela a até 3km de distância." }] },
  "Zilaris, O Mercador de Almas": { mascara: "Deus da Riqueza, da Troca e das Oportunidades. O padroeiro daqueles que querem mais do que a vida lhes deu.", verdade: "O Vazio, um buraco negro espiritual que se alimenta da insatisfação eterna e nunca é saciado.", obrigacao: "A ganância é a armadura da alma. Você é estritamente proibido de doar itens ou curar/ajudar um aliado com seus recursos (Poções, Pontos de Esforço) a menos que ele lhe pague em Lascas (Lc) ou faça um juramento de sangue de dívida imediata.", punicao: "O Vazio te cobra com juros severos. Moedas e poções que você toca apodrecem ou viram cinzas (perca consumíveis constantemente). Além disso, o Mestre ganha o direito de transformar qualquer Acerto Crítico (20 natural) seu em uma Falha Crítica (1 natural) a qualquer momento da sessão.", poderes: [{ title: "Aposta do Vazio", cost: "50 Lc + 1 PV", desc: "Antes de rolar qualquer teste vital, jogue 15 Lascas no chão (destruídas). Rola com Vantagem. Se passar no teste sob esse efeito, recupere 2 PEs perdidos." }, { title: "Contrato de Sangue", cost: "4 PV", desc: "Ação Padrão. Sela um contrato com um inimigo visível. Metade do dano que esse inimigo causar a você na rodada será revertido como Cura para você no turno seguinte." }, { title: "Escudo Cobiçoso", cost: "2 PV (Reação)", desc: "Ao ser atacado corpo a corpo, lança um punhado de moedas fantasmas nos olhos do alvo. O inimigo perde o foco pela ganância: ganhe +5 de Defesa contra esse golpe." }, { title: "Suborno Existencial", cost: "100 Lc", desc: "Uma vez por sessão, queime 100 Lascas. Em troca, conjura qualquer Magia ou Ritual de Nível 1 existente no jogo, ignorando testes de conjuração." }] },
  "Pyroth, O Sol Purificador": { mascara: "Deus do Sol, do Fogo e da Saúde. A luz revela a verdade e purifica o mal.", verdade: "A Calcinação, que deseja a esterilização absoluta do mundo até que reste apenas cinzas.", obrigacao: "O mundo está infectado. Você não pode saquear ou tocar em cadáveres de inimigos mortos por meios que não sejam Fogo ou Luz. Se um aliado for infectado ou adoecer, você deve queimar a ferida (causando 1d4 de dano de fogo a ele) para purificá-lo, e só pode curar depois de purifica-lo.", punicao: "O fogo te recicla por dentro. Sua pele resseca e se quebra como carvão. Você adquire Vulnerabilidade a danos cortantes e de impacto (sofrendo o dobro do dano) e não recupera Pontos de Esforço (PE) até atear fogo em um tesouro ou recurso valioso do grupo.", poderes: [{ title: "Aura da Fornalha", cost: "Passivo", desc: "Inimigos adjacentes sofrem 1d6 de dano de Fogo nos turnos deles. Todo seu dano de Fogo (tochas/magias) ignora totalmente a Redução de Dano (RD) das feras." }, { title: "Marca da Cinza", cost: "1 PV", desc: "Ação Bônus. Ao acertar ataque, a lâmina deixa cicatriz em brasa. O alvo ganha Vulnerabilidade ao próximo ataque físico que um aliado seu desferir contra ele." }, { title: "Clarão Solar", cost: "3 PV (Reação)", desc: "Ao ser alvo de um ataque corpo a corpo, seus olhos emitem um flash. O inimigo fica Cego (-5 no ataque e sem ataques de oportunidade) durante aquela ação." }, { title: "Cauterizar a Alma", cost: "2 PV", desc: "Ação Padrão. Toque a ferida de um aliado. Causa 1d4 de Dano de Fogo, mas aniquila de forma automática qualquer Veneno, Doença ou Maldição persistente que ele tenha." }] },
  "Thalass, O Pai das Marés": { mascara: "Deus dos Oceanos e Viagens. Protetor dos marinheiros e provedor de peixes.", verdade: "O Abismo, a pressão das profundezas que odeia a terra seca e deseja afogar os continentes em escuridão.", obrigacao: "A terra é uma ilusão ofuscante. Você deve sacrificar um frasco do próprio sangue em água corrente ou no mar diariamente. Além disso, é abominável gerar luz artificial: você é proibido de carregar tochas, acender fogueiras ou usar magias de fogo.", punicao: " Seus pulmões esquecem o ar. Longe da imersão em água, você sofre asfixia constante. Você perde a capacidade de falar (bloqueando diplomacia e magias verbais) e é considerado sob condição Exausto, movendo-se com extrema lentidão até afogar uma criatura de porte médio ou maior.", poderes: [{ title: "Arrastar para o Fundo", cost: "Passivo", desc: "Se acertar um inimigo corpo a corpo, ele sofre +1d6 e faz um teste de Fortitude. Se falhar, é jogado violentamente no chão (Caído)." }, { title: "Sangue Gélido", cost: "3 PV", desc: "Ganha RD 3 contra danos físicos. Inimigos que te atacarem corpo a corpo têm os tendões congelados, reduzindo o Deslocamento deles pela metade na rodada seguinte." }, { title: "Vórtice Sombrio", cost: "4 PV", desc: "Ação Completa. Gera redemoinho telecinético (6m). Inimigos na área são puxados em sua direção e sofrem 2d8 de Dano de Impacto (metade se passarem em Reflexos)." }, { title: "Pressão Esmagadora", cost: "Passivo", desc: "Todos os seus ataques (físicos ou mágicos) contra alvos que estejam submersos na água ou sob a condição Caído sofrem acréscimo automático de +4 dados de dano." }] },
  "Volyra, A Tecelã de Laços": { mascara: "Deusa da Família, Comunidade e Amor. A força está na união e no sacrifício pelo próximo.", verdade: "A Colmeia, que odeia o indivíduo e deseja fundir todas as mentes numa consciência coletiva sem vontades próprias.", obrigacao: "A singularidade é uma praga. Você não possui bens individuais (tudo na sua mochila pertence a todos). Se um aliado a até 9m de você for alvo de um ataque que o levaria a 0 PV, você é divinamente obrigado a saltar na linha de fogo e tomar o dano no lugar dele.", punicao: "A mente coletiva te rejeita violentamente. Você sofre um isolamento sensorial paralisante. Você fica surdo e torna-se imune a qualquer feitiço benéfico, cura ou bônus tático concedido por seus aliados, ficando totalmente sozinho no mundo até doar metade da sua própria força vital para outra pessoa.", poderes: [{ title: "Mente Compartilhada", cost: "Passivo", desc: "Enquanto tiver um aliado a 9m, você não pode ser Flanqueado nem Surpreendido. Ação de 'Ajudar' confere +4 ao aliado (ao invés de +2)." }, { title: "Elo de Dor", cost: "1 PV (Reação)", desc: "Quando um aliado próximo for sofrer dano, absorva 100% daquele dano para si. Se não cair a 0 PV, a Colmeia reage: ganhe +2 de Dano e Acerto no seu próximo turno." }, { title: "Enxame Curativo", cost: "3 PV", desc: "Ação Padrão. Sacrifica sua força. Perca 1d8 PV. Cura o exato mesmo valor da rolagem em todos os aliados a até 6m de você simultaneamente." }, { title: "Titereiro da Colmeia", cost: "4 PV", desc: "Gasto no turno de um aliado adjacente. Cede sua Ação de Movimento ou Padrão para ele (ele age agora com ação extra, e você perde essa ação no seu turno)." }] },
  "Aeon, O Guardião das Areias": { mascara: "Deus do Destino, Tempo e História. Traz consolo de que tudo tem um propósito e uma hora certa.", verdade: "O Ciclo, onde o tempo está quebrado e o universo deseja repetir seus traumas congelados para sempre.", obrigacao: "A mudança não existe. Se você falhar em um ataque ou teste de perícia durante a batalha, você é proibido de tentar realizar aquela mesma ação ou golpear aquele mesmo alvo novamente durante a cena (o ciclo negou essa possibilidade). Você deve colecionar um pequeno fetiche cadavérico de toda falha crítica do grupo.", punicao: "Sua mente fica presa em um loop existencial doloroso. Em combate, sempre que você sofrer dano, você é forçado a usar sua próxima Ação Padrão para repetir mecanicamente a exata mesma ação que fez na rodada anterior, mesmo que taticamente seja inútil.", poderes: [{ title: "Déjà Vu", cost: "Reação (1 PV)", desc: "Uma vez por combate, obriga uma criatura a refazer uma rolagem vital e acatar o segundo resultado. Inimigos sofrem 1d6 de dano psíquico na refação." }, { title: "Passo Fora do Tempo", cost: "2 PV", desc: "Ação de Movimento. Se move muito rápido para qualquer espaço livre a até 9m como se estivesse teletransportando, ignorando armadilhas no caminho e ataques de oportunidade." }, { title: "Erosão Rápida", cost: "3 PV", desc: "Ação Padrão. O tempo avança em um objeto. Causando 3d8 de dano nos objetos (escudos, armaduras, espadas etc...)." }, { title: "Atraso Existencial", cost: "5 PV", desc: "Ao atingir um inimigo, a vítima fica atrasada. Perde a Reação neste turno e, na próxima rodada inteira, é obrigatoriamente a última a agir." }] },
  "Varish, O Senhor das Estações": { mascara: "Deus do Clima, das Estações e da Mudança. Ele representa a adaptação necessária para sobreviver.", verdade: "O Cataclisma, que odeia o equilíbrio e deseja a turbulência e destruição termal absoluta.", obrigacao: "A constância é um pecado que deve ser quebrado. Você não pode dormir no mesmo local ou estrutura duas noites seguidas. Em combate, é proibido usar o mesmo tipo de ataque, arma ou poder mágico em dois turnos seguidos, sendo forçado à mutação tática extrema.", punicao: "A atmosfera local se volta brutalmente contra sua existência. No início de cada um dos seus turnos em combate, a temperatura do seu corpo flutua em espasmos de destruição: jogue uma moeda. Cara, você sofre 1d6 de dano elétrico; coroa, sofre 1d6 de dano de frio contínuo, e você perde a capacidade de causar Acertos Críticos até apaziguar o caos.", poderes: [{ title: "Carga Estática", cost: "Passivo", desc: "Ao se deslocar pelo menos 6m antes de atacar, o ar estala e seu ataque causa +2d6 de Dano Elétrico. Se rolar um Acerto Crítico, a descarga atordoa o alvo." }, { title: "Adaptação Letal", cost: "2 PV", desc: "Ação Bônus. A lâmina da arma arde, congela ou solta faíscas. Escolha Fogo, Frio ou Elétrico: seus ataques causam +1d6 extra desse elemento na cena." }, { title: "Olho do Furacão", cost: "4 PV (Reação)", desc: "Quando um ataque à distância (flecha, arpão) for acertar você, conjura uma rajada brutal. O projétil ou feitiço erra o alvo automaticamente e é destruído." }, { title: "Fissuras Termais", cost: "8 PV", desc: "Ação Completa. Fende o chão (área 6m). Inimigos sofrem 3d6 de Fogo e o solo ao redor congela, virando gelo escorregadio. Criaturas na área passam em Acrobacia ou ficam Caídas." }] }
};

const mutacoesKorzel = {
  "Carne Intacta": { efeito: "Sua biologia original se mantém intacta.", onus: "" },
  "Membrana Nictitante": { efeito: "Pálpebras translúcidas. Imune à cegueira por luz.", onus: "Sofre -2 em todos os testes de Carisma." },
  "Osteodermas": { efeito: "Placas ósseas espessas. +1 na Defesa e RD 1 permanente.", onus: "Rigidez reduz seu Deslocamento em -2m." },
  "Língua Bifurcada": { efeito: "Língua reptiliana. Olfato Aguçado; detecta inimigos no escuro.", onus: "Fala sibilante impõe -2 em Enganação e Diplomacia." },
  "Sangue Peçonhento": { efeito: "Icor negra. Cortes de perto causam 1d4 de Veneno no agressor.", onus: "Kits Médicos comuns curam apenas a metade em você." },
  "Garras de Raptor": { efeito: "Unhas curvas. O Ataque Desarmado causa 1d6 de Corte letal.", onus: "Desvantagem severa para manuseio fino e Ladinagem." },
  "Fossetas Loreais": { efeito: "Sensores térmicos. Enxerga calor de seres vivos no escuro/fumaça.", onus: "Sofre Vulnerabilidade (Dano Dobrado) contra Fogo." },
  "Vela Dorsal": { efeito: "Crista nas costas. Adaptação e Resistência a Frio 5.", onus: "Não pode vestir armaduras nas costas." },
  "Braço Vestigial": { efeito: "Membro atrofiado. Saca itens pequenos (Poções) como Ação Livre.", onus: "Impõe Desvantagem em interações na cidade." },
  "Pernas de Terópode": { efeito: "Articulações de ave. +3m de Deslocamento e dobro nos saltos.", onus: "-4 de penalidade em testes contra Agarrões." },
  "Camuflagem Cromática": { efeito: "Pele reativa. +5 em Furtividade ao ficar 1 turno imóvel.", onus: "Impossível mentir (pele brilha revelando emoções)." },
  "Mandíbula Desarticulável": { efeito: "Ataque de Mordida (1d8+For) causando Sangramento como Ação Bônus.", onus: "Cidades fechadas te atacarão ao ver o rosto." }
};

// ================= FUNÇÃO MATEMÁTICA DO DANO =================
const parseAndRollDamage = (damageStr, isCrit, multiplierStr) => {
  let cleanStr = damageStr.toLowerCase().replace(/\s+/g, '');
  let total = 0;
  let logs = [];
  let mult = 1;
  if (isCrit) {
    mult = parseInt(multiplierStr.replace(/[^0-9]/g, '')) || 2;
  }
  let parts = cleanStr.match(/[+-]?[^+-]+/g) || [cleanStr];
  
  parts.forEach(part => {
    let sign = part.startsWith('-') ? -1 : 1;
    let term = part.replace(/[+-]/, '');
    
    if (term.includes('d')) {
      let [countStr, facesStr] = term.split('d');
      let count = parseInt(countStr) || 1;
      let faces = parseInt(facesStr) || 20;
      count = count * mult;
      let subTotal = 0;
      let rolls = [];
      for(let i=0; i<count; i++) {
        let r = Math.floor(Math.random() * faces) + 1;
        subTotal += r;
        rolls.push(r);
      }
      total += sign * subTotal;
      logs.push(`${sign === -1 ? '-' : '+'}[${rolls.join(', ')}]`);
    } else {
      let val = parseInt(term) || 0;
      total += sign * val;
      logs.push(`${sign === -1 ? '-' : '+'}${val}`);
    }
  });
  return { total, log: logs.join(' ').replace(/^\+/, '') };
};

// 3. Moldes Genéricos
function AttributeCircle({ name, short, value, onChange, customClass, color = "red", onRoll }) {
  const theme = themeColors[color];
  return (
    <div className={`absolute flex flex-col items-center justify-between w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-full p-1 sm:p-2 bg-black/60 backdrop-blur-sm transition-all duration-300 ${theme.border} ${theme.shadow} ${customClass}`}>
      <div className="flex-1 flex items-center justify-center w-full">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-center bg-transparent focus:outline-none text-2xl sm:text-3xl font-bold drop-shadow-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${theme.text}`} />
      </div>
      <div className="w-full flex flex-col items-center pb-1 text-white">
        <div className={`w-3/4 h-[1px] mb-1 opacity-70 ${theme.bg}`}></div>
        <span onClick={() => onRoll(`Teste de ${name}`, value)} className="text-[6px] sm:text-[8px] tracking-widest uppercase font-light leading-none cursor-pointer hover:text-amber-500 transition-colors" title={`Rolar ${name}`}>
          {name} 🎲
        </span>
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
        <button onClick={() => onRoll(name, total)} className="transition-all flex items-center justify-center w-7 h-7 rounded hover:bg-red-950/40 shadow-inner cursor-pointer" title="Rolar Teste">
          <img src={d20Icon} alt="Rolar D20" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
        </button>
        <div className={`w-1 h-4 rounded-full opacity-70 ${theme.bg}`}></div>
        <div className="flex flex-col"><span className="text-sm text-zinc-200 tracking-wide group-hover:text-white transition-colors">{name}</span><span className="text-[9px] text-zinc-500 uppercase">{attrShort}</span></div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="w-10 flex justify-center"><input type="number" value={outros} onChange={(e) => setOutros(e.target.value)} className="w-8 bg-black/40 border-b border-zinc-700 text-center text-amber-500 font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-t-sm" title="Bônus de Itens e Poderes" /></div>
        <div className="w-12 flex justify-center">{renderDiamonds()}</div>
        <div className="w-8 text-right text-lg font-bold text-white">{total >= 0 ? `+${total}` : total}</div>
      </div>
    </div>
  );
}

function StatusBar({ title, current, max, colorTheme, onDecrease, onIncrease, onMaxChange }) {
  const themes = { red: { bg: "bg-red-950/80", fill: "bg-red-800", text: "text-red-100", border: "border-red-900/50" }, orange: { bg: "bg-amber-950/80", fill: "bg-amber-700", text: "text-amber-100", border: "border-amber-900/50" }, green: { bg: "bg-green-950/80", fill: "bg-green-800", text: "text-green-100", border: "border-green-900/50" }, purple: { bg: "bg-purple-950/80", fill: "bg-purple-800", text: "text-purple-100", border: "border-purple-900/50" } };
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
          <span>{current}</span><span className="text-sm opacity-70 mx-1">/</span>
          <input type="number" value={max} onChange={(e) => onMaxChange(Number(e.target.value))} className="bg-transparent w-10 text-sm opacity-70 focus:outline-none focus:border-b focus:border-white/50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <div className="relative z-10 flex gap-1">
          <button onClick={() => onIncrease(1)} className="px-2 py-1 text-sm font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+</button>
          <button onClick={() => onIncrease(5)} className="px-2 py-1 text-[10px] font-bold bg-black/40 hover:bg-black/60 rounded text-white/70 transition-colors">+5</button>
        </div>
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
          <div className="absolute -top-6 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10 w-[max-content]"> 
            <button onClick={onEdit} className="text-zinc-500 hover:text-yellow-500 transition-transform hover:scale-110 text-sm">✏️</button> 
            <button onClick={onDelete} className="text-zinc-500 hover:text-red-500 transition-transform hover:scale-110 text-sm">🗑️</button> 
          </div> 
          <button onClick={() => onRollAttack(weapon, skillTotal)} className="h-10 w-10 flex items-center justify-center bg-red-950/40 border border-red-900/50 rounded-md hover:bg-red-900 transition-all shadow-inner relative z-0 group-hover:border-red-500"> 
            <img src={d20Icon} alt="Rolar Dano" className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all drop-shadow-md" /> 
          </button> 
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
        <div className="flex flex-col"> 
          <h4 className={`${isDivine ? 'text-purple-400' : 'text-white'} font-bold text-lg tracking-wide`}>{title}</h4> 
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{type}</span> 
        </div> 
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

// 4. Tela Principal (App)
function App() {
  const [character, setCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState('diário'); 
  
  const [charName, setCharName] = useState("Kael, o Quebra-Marés");
  const [charOrigin, setCharOrigin] = useState("Costa / Pescador de Monstros"); 
  const [charRace, setCharRace] = useState("Korgath");
  const [charClass, setCharClass] = useState("Guerreiro");
  const [charLevel, setCharLevel] = useState(1);
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

  const [showWeaponForm, setShowWeaponForm] = useState(false);
  const [editingWeaponIndex, setEditingWeaponIndex] = useState(null);
  const initialWeaponState = { name: "", damage: "", critMargin: "", critMultiplier: "", type: "Cortante", skill: "Luta (FOR)" };
  const [weaponForm, setWeaponForm] = useState(initialWeaponState);
  const [attacksList, setAttacksList] = useState([
    { name: "Tridente de Guerra", damage: "1d8+4", critMargin: "20", critMultiplier: "x2", type: "Perfurante", skill: "Luta" },
    { name: "Arpão Pesado", damage: "1d10+2", critMargin: "19", critMultiplier: "x3", type: "Perfurante", skill: "Arremesso" }
  ]);

  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const initialAbilityState = { title: "", type: "Dádiva Divina", cost: "1 PV", description: "" };
  const [abilityForm, setAbilityForm] = useState(initialAbilityState);
  const [abilitiesList, setAbilitiesList] = useState([
    { title: "Ataque Especial", type: "Habilidade de Classe", cost: "1 PE", description: "Quando você faz um ataque, pode gastar 1 PE para receber +4 no teste de ataque ou +1 dado de dano." }
  ]);

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [lascas, setLascas] = useState(150);
  const initialItemState = { name: "", description: "", quantity: 1, weight: 0.5 };
  const [itemForm, setItemForm] = useState(initialItemState);
  const [inventoryList, setInventoryList] = useState([{ name: "Ração Básica", description: "Dura 1 semana.", quantity: 5, weight: 0.5 }]);

  const [rollModal, setRollModal] = useState({ show: false, title: "", type: "", bonus: 0, d20: 0, total: 0, isRolling: false, isCrit: false, isFumble: false, weapon: null, details: "" });

  // ================= ESTADOS DO DIÁRIO (NOVA ABA) =================
  const [notes, setNotes] = useState([
    { id: 1, title: "Registro 01: Sobrevivência", content: "O pântano cheira a enxofre hoje. Encontramos rastros gigantes perto da margem leste..." }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(1);

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

  const currentWeight = inventoryList.reduce((acc, item) => acc + (Number(item.weight) * Number(item.quantity)), 0);
  const maxWeight = (Number(attrFor) * 5) + 30; 

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
        let isCrit = d20 === 20;
        let isFumble = d20 === 1;
        let damageBreakdown = "";
        let damageTotal = 0;
        if (type === 'attack' && weapon) {
          const critMargin = parseInt(weapon.critMargin) || 20;
          if (d20 >= critMargin) isCrit = true;
          const res = parseAndRollDamage(weapon.damage, isCrit, weapon.critMultiplier);
          damageBreakdown = res.log;
          damageTotal = res.total;
        }
        setRollModal(prev => ({ ...prev, isRolling: false, d20, total, isCrit, isFumble, details: type === 'attack' ? damageBreakdown : "", damageTotal: type === 'attack' ? damageTotal : 0 }));
      }
    }, 1000);
  };

  const getSkillTotal = (skillString) => { const baseName = skillString.split(" ")[0]; const skillObj = skillsList.find(s => s.name === baseName); return skillObj ? skillObj.total : 0; };
  const handleDeityChange = (newDeity) => { setCharDeity(newDeity); let updatedAbilities = abilitiesList.filter(ab => ab.type !== "Dádiva Divina"); if (newDeity !== "Nenhum" && panteaoKorzel[newDeity]) { const newPowers = panteaoKorzel[newDeity].poderes.map(p => ({ title: p.title, type: "Dádiva Divina", cost: p.cost, description: p.desc })); updatedAbilities = [...updatedAbilities, ...newPowers]; } setAbilitiesList(updatedAbilities); };
  const handleOpenNewWeapon = () => { setWeaponForm(initialWeaponState); setEditingWeaponIndex(null); setShowWeaponForm(true); };
  const handleEditWeapon = (index) => { setWeaponForm(attacksList[index]); setEditingWeaponIndex(index); setShowWeaponForm(true); };
  const handleDeleteWeapon = (index) => { if(window.confirm("A Mácula consumiu esta arma! Deseja excluí-la?")) setAttacksList(attacksList.filter((_, i) => i !== index)); };
  const handleSaveWeapon = () => { if(!weaponForm.name || !weaponForm.damage) return alert("A arma precisa de Nome e Dano!"); if (editingWeaponIndex !== null) { const updated = [...attacksList]; updated[editingWeaponIndex] = weaponForm; setAttacksList(updated); } else { setAttacksList([...attacksList, weaponForm]); } setShowWeaponForm(false); };
  const handleOpenNewAbility = () => { setAbilityForm(initialAbilityState); setEditingAbilityIndex(null); setShowAbilityForm(true); };
  const handleEditAbility = (index) => { setAbilityForm(abilitiesList[index]); setEditingAbilityIndex(index); setShowAbilityForm(true); };
  const handleDeleteAbility = (index) => { if(window.confirm("Esquecer esta habilidade?")) setAbilitiesList(abilitiesList.filter((_, i) => i !== index)); };
  const handleSaveAbility = () => { if(!abilityForm.title || !abilityForm.description) return alert("A habilidade precisa de Nome e Descrição!"); if (editingAbilityIndex !== null) { const updated = [...abilitiesList]; updated[editingAbilityIndex] = abilityForm; setAbilitiesList(updated); } else { setAbilitiesList([...abilitiesList, abilityForm]); } setShowAbilityForm(false); };
  const handleOpenNewItem = () => { setItemForm(initialItemState); setEditingItemIndex(null); setShowItemForm(true); };
  const handleEditItem = (index) => { setItemForm(inventoryList[index]); setEditingItemIndex(index); setShowItemForm(true); };
  const handleDeleteItem = (index) => { if(window.confirm("Jogar este item fora?")) setInventoryList(inventoryList.filter((_, i) => i !== index)); };
  const handleSaveItem = () => { if(!itemForm.name) return alert("O item precisa de um nome!"); if (editingItemIndex !== null) { const updated = [...inventoryList]; updated[editingItemIndex] = itemForm; setInventoryList(updated); } else { setInventoryList([...inventoryList, itemForm]); } setShowItemForm(false); };

  // ================= CONTROLES DO DIÁRIO =================
  const handleAddNote = () => {
    const newId = Date.now();
    setNotes([...notes, { id: newId, title: "Página em Branco", content: "" }]);
    setActiveNoteId(newId);
  };
  const handleDeleteNote = (id) => {
    if(window.confirm("Arrancar esta página do seu diário?")) {
      const newNotes = notes.filter(n => n.id !== id);
      setNotes(newNotes);
      if(activeNoteId === id) setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
    }
  };
  const handleNoteChange = (field, value) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [field]: value } : n));
  };

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row p-4 lg:p-8 gap-8 font-sans relative">
      <div className="w-full lg:w-[55%] flex flex-col gap-8 relative z-10">
        <div className="w-full flex flex-wrap gap-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex-1 min-w-[200px] flex flex-col mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Personagem</span><input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} className="w-full text-xl sm:text-2xl font-bold text-white bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-1/3 min-w-[150px] flex flex-col mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Origem</span><input type="text" value={charOrigin} onChange={(e) => setCharOrigin(e.target.value)} placeholder="Ex: Caçador da Tundra" className="w-full text-lg text-amber-500 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-full h-[1px] bg-zinc-800/50 my-1"></div>
          <div className="flex-1 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Raça</span><input type="text" value={charRace} onChange={(e) => setCharRace(e.target.value)} className="w-full text-sm text-zinc-300 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="flex-1 min-w-[100px] flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Classe</span><input type="text" value={charClass} onChange={(e) => setCharClass(e.target.value)} className="w-full text-sm text-zinc-300 bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 truncate transition-colors" />
          </div>
          <div className="w-16 flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nível</span><input type="number" value={charLevel} onChange={(e) => setCharLevel(e.target.value)} className="w-full text-sm text-center font-bold text-white bg-transparent border-b border-zinc-700 pb-1 focus:outline-none focus:border-amber-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>

        <div className="relative w-full flex items-center justify-center py-4">
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            <img src={mosasaurusSkull} alt="Crânio do Mosassauro" className="absolute inset-0 w-full h-full object-contain opacity-90" />
            <div className="absolute text-white text-xl sm:text-3xl tracking-widest uppercase z-10 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Atributos</div>
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

      <div className="w-full lg:w-[45%] flex flex-col h-[60vh] lg:h-[85vh] bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 lg:p-6 shadow-2xl backdrop-blur-sm sticky top-8 z-10">
        <div className="flex gap-4 sm:gap-6 border-b-2 border-zinc-800 mb-4 px-2 overflow-x-auto custom-scrollbar shrink-0">
          {['Perícias', 'Combate', 'Habilidades', 'Inventário', 'Crenças', 'Diário'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab.toLowerCase()); setShowWeaponForm(false); setShowAbilityForm(false); setShowItemForm(false); }} className={`pb-2 text-xs sm:text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${ activeTab === tab.toLowerCase() ? 'text-white border-b-2 border-red-800' : 'text-zinc-500 hover:text-zinc-300' }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'perícias' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            <div className="flex justify-end items-end border-b border-zinc-800 pb-2 mb-2 px-2 pr-4"><div className="flex items-center text-[10px] text-zinc-400 uppercase tracking-wider font-bold gap-3 sm:gap-6"><div className="w-10 text-center text-amber-700/80" title="Bônus de Itens e Poderes">Outros</div><div className="w-12 text-center">Treino</div><div className="w-8 text-right">Total</div></div></div>
            {skillsList.map((skill, index) => ( 
              <SkillRow key={index} name={skill.name} attrShort={skill.attrShort} color={skill.color} trainingLevel={skill.trainingLevel} baseTotal={skill.total} onRoll={(nome, bonusTotal) => executeRoll('skill', `Teste de ${nome}`, bonusTotal)} /> 
            ))}
          </div>
        )}

        {activeTab === 'combate' && (
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
            <div className="flex flex-col">{attacksList.map((atk, index) => (
              <WeaponCard key={index} weapon={atk} damage={atk.damage} critMargin={atk.critMargin} critMultiplier={atk.critMultiplier} type={atk.type} skill={atk.skill} onEdit={() => handleEditWeapon(index)} onDelete={() => handleDeleteWeapon(index)} onRollAttack={(weaponObj) => executeRoll('attack', `Ataque: ${weaponObj.name}`, getSkillTotal(weaponObj.skill), weaponObj)} />
            ))}</div>
          </div>
        )}

        {activeTab === 'habilidades' && (
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

        {activeTab === 'inventário' && (
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

        {activeTab === 'crenças' && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 flex flex-col gap-6">
            <div className="shrink-0 bg-[#140c08]/80 border-2 border-purple-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-900/20 blur-[50px] rounded-full pointer-events-none"></div>
              <h3 className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4 border-b border-purple-900/30 pb-2">Panteão de Korzel</h3>
              <div className="flex flex-col mb-6">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Entidade Cultuada</label>
                <select value={charDeity} onChange={(e) => handleDeityChange(e.target.value)} className="w-full bg-black/60 border border-purple-900/50 rounded-md p-3 text-white text-base focus:outline-none focus:border-purple-500 shadow-inner appearance-none cursor-pointer font-bold">
                  {Object.keys(panteaoKorzel).map(deus => (<option key={deus} value={deus}>{deus}</option>))}
                </select>
                {charDeity !== "Nenhum" && (<span className="text-[10px] text-purple-400 mt-2 italic">Dica: As Dádivas desta entidade foram adicionadas à sua aba de Habilidades.</span>)}
              </div>

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
              <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4">
                <h3 className="text-green-500 font-bold tracking-widest uppercase text-sm flex items-center gap-2"><span>☣️</span> A Herança do Predador</h3>
                <div className="text-[10px] font-bold tracking-widest uppercase bg-black/60 px-3 py-1 rounded text-zinc-400 border border-zinc-800">Corrupção: <span className={corruption >= 40 ? "text-red-500" : "text-green-400"}>{corruption}</span> / 40</div>
              </div>
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

        {/* ================= ABA: DIÁRIO DE CAMPANHA ================= */}
        {activeTab === 'diário' && (
          <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden bg-[#1c110a] border-2 border-[#3e2723] rounded-r-2xl rounded-l-md shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] relative">
            
            {/* Lombada de Couro e Argolas */}
            <div className="hidden sm:flex flex-col justify-around items-center w-10 bg-[#0a0502] border-r-2 border-[#3e2723] shadow-[5px_0_15px_rgba(0,0,0,0.8)] z-10 py-6">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-6 h-3 border-2 border-zinc-500 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 shadow-sm relative">
                  <div className="absolute top-1/2 right-[-8px] w-2 h-1 bg-zinc-400 rounded-full"></div>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col p-4 sm:pl-8 w-full h-full relative z-0">
              {/* Menu de Páginas */}
              <div className="flex justify-between items-center mb-4 border-b border-[#3e2723] pb-2">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar flex-1 pr-4">
                  {notes.map(note => (
                    <button 
                      key={note.id} 
                      onClick={() => setActiveNoteId(note.id)}
                      className={`whitespace-nowrap px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-t-md border border-b-0 transition-colors ${activeNoteId === note.id ? 'bg-[#3e2723] border-amber-700 text-amber-500' : 'bg-black/40 border-[#3e2723] text-zinc-500 hover:text-amber-700'}`}
                    >
                      {note.title || "Sem Título"}
                    </button>
                  ))}
                </div>
                <button onClick={handleAddNote} className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber-900/80 hover:bg-amber-700 text-amber-100 rounded-md border border-amber-700 font-bold transition-colors" title="Nova Página">+</button>
              </div>

              {/* Área de Edição (Se houver página) */}
              {activeNote ? (
                <div className="flex-1 flex flex-col animate-fade-in h-full">
                  <div className="flex justify-between items-center mb-4">
                    <input 
                      type="text" 
                      value={activeNote.title} 
                      onChange={(e) => handleNoteChange('title', e.target.value)} 
                      placeholder="Título da Anotação..." 
                      className="text-xl sm:text-2xl font-bold text-amber-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-amber-900/50 w-full"
                    />
                    <button onClick={() => handleDeleteNote(activeNote.id)} className="text-zinc-600 hover:text-red-500 transition-colors" title="Arrancar Página">🗑️</button>
                  </div>
                  
                  {/* Textarea com linhas pautadas simulando caderno */}
                  <textarea 
                    value={activeNote.content} 
                    onChange={(e) => handleNoteChange('content', e.target.value)} 
                    placeholder="Comece a escrever suas descobertas aqui..." 
                    className="flex-1 w-full bg-transparent resize-none focus:outline-none text-amber-100/90 text-sm sm:text-base leading-[2rem] bg-[linear-gradient(transparent_31px,#3e2723_32px)] bg-[length:100%_32px] custom-scrollbar"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                  <span className="text-4xl mb-4">📖</span>
                  <p className="text-zinc-500 text-sm italic">Nenhuma página aberta.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* ================= MODAL DO DADO (OVERLAY DA ROLAGEM) ================= */}
      {rollModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => !rollModal.isRolling && setRollModal({...rollModal, show: false})}>
          <div className="flex flex-col items-center p-8 bg-zinc-950 border-2 border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(185,28,28,0.2)] max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-6 text-center text-lg">{rollModal.title}</h2>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <img src={d20Icon} className={`w-full h-full object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] ${rollModal.isRolling ? 'animate-[spin_0.5s_linear_infinite] scale-110' : 'scale-100 transition-transform duration-300'}`} alt="D20" />
              {!rollModal.isRolling && rollModal.type !== 'damage' && (
                <span className={`absolute text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${rollModal.isCrit ? 'text-yellow-400' : rollModal.isFumble ? 'text-red-600' : 'text-white'}`}>
                  {rollModal.d20}
                </span>
              )}
            </div>

            {!rollModal.isRolling ? (
              <div className="flex flex-col items-center animate-fade-in w-full">
                {rollModal.type !== 'damage' && (
                  <>
                    <div className="flex items-center justify-center gap-4 text-zinc-400 text-sm font-bold mb-4 w-full bg-zinc-900/50 py-2 rounded-md border border-zinc-800">
                      <div className="flex flex-col items-center"><span className="text-[9px] uppercase tracking-widest">Natural</span><span className="text-lg text-white">{rollModal.d20}</span></div>
                      <span className="text-zinc-600 text-2xl">+</span>
                      <div className="flex flex-col items-center"><span className="text-[9px] uppercase tracking-widest">Bônus</span><span className="text-lg text-amber-500">{rollModal.bonus}</span></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Resultado do Teste</span>
                      <div className="text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">{rollModal.total}</div>
                    </div>
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
              <div className="h-[160px] flex items-center justify-center">
                <span className="text-red-500 font-bold uppercase tracking-widest animate-pulse text-sm">Rolando o Destino...</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;