import { QuizQuestion } from '../types/quiz';

export const questionsMedium: QuizQuestion[] = [
  // 1. Bíblia Geral
  {
    id: 101,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Quantos livros compõem o Novo Testamento da Bíblia?",
    options: ["27 livros", "39 livros", "46 livros", "12 livros"],
    answerIndex: 0,
    explanation: "O Novo Testamento tem 27 livros, iniciando em Mateus e terminando no Apocalipse.",
    verse: "Colossenses 4:16"
  },
  {
    id: 102,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "O Antigo Testamento possui originalmente quantos livros em sua versão bíblica mais comum (protestante)?",
    options: ["27 livros", "39 livros", "46 livros", "66 livros"],
    answerIndex: 1,
    explanation: "Na versão bíblica canônica comum, existem 39 livros no Antigo Testamento.",
    verse: "Lucas 24:44"
  },
  {
    id: 103,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "De qual profeta Deus chamou para pregar, mas ele reclamou que era 'apenas uma criança' e não sabia falar?",
    options: ["Isaías", "Jeremias", "Malaquias", "Ezequiel"],
    answerIndex: 1,
    explanation: "Jeremias lamentou com Deus sua mocidade e gagueira, mas Deus tocou sua boca.",
    verse: "Jeremias 1:6"
  },
  {
    id: 104,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Quem é o autor tradicional da maioria das cartas teológicas do Novo Testamento?",
    options: ["São Pedro", "Apóstolo Paulo", "João Evangelista", "Tiago, irmão do Senhor"],
    answerIndex: 1,
    explanation: "O apóstolo Paulo escreveu 13 cartas históricas a comunidades diversas de fé.",
    verse: "2 Pedro 3:15"
  },
  {
    id: 105,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Qual personagem bíblico é creditado como tendo vivido mais tempo na Terra (969 anos)?",
    options: ["Noé", "Metusalém (Matusalém)", "Adão", "Enoque"],
    answerIndex: 1,
    explanation: "Matusalém viveu 969 anos antes do grande Dilúvio nascer.",
    verse: "Gênesis 5:27"
  },
  {
    id: 106,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Que livro da Bíblia vem imediatamente após o livro de Josué?",
    options: ["Rute", "Juízes", "1 Samuel", "Deuteronômio"],
    answerIndex: 1,
    explanation: "Após a conquista de Canaã sob Josué, inicia-se o tenebroso período de 'Juízes'.",
    verse: "Juízes 1:1"
  },
  {
    id: 107,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Quem substituiu o apóstolo Judas Iscariotes após seu suicídio?",
    options: ["Matias", "Barnabé", "Saulo de Tarso", "Estêvão"],
    answerIndex: 0,
    explanation: "Os onze apóstolos lançaram sortes entre José Barsabás e Matias, elegendo Matias.",
    verse: "Atos 1:26"
  },
  {
    id: 108,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Quais eram os nomes dos três amigos de Daniel jogados na fornalha pelando de calor?",
    options: [
      "Sadraque, Mesaque e Abede-Nego",
      "Efraim, Manassés e Benjamim",
      "Esaú, Jacó e José",
      "Simão, André e Filipe"
    ],
    answerIndex: 0,
    explanation: "Hananias, Misael e Azarias receberam nomes babilônicos de Sadraque, Mesaque e Abede-Nego.",
    verse: "Daniel 3:12"
  },
  {
    id: 109,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Quantos anos o patriarca Jacó teve que trabalhar no total para poder se casar com seu grande amor Raquel?",
    options: ["7 anos", "14 anos", "10 anos", "21 anos"],
    answerIndex: 1,
    explanation: "Jacó foi enganado por Labão trabalhando 7 anos por Lia e mais 7 anos por Raquel.",
    verse: "Gênesis 29:27"
  },
  {
    id: 110,
    category: "Bíblia Geral",
    difficulty: "médio",
    question: "Onde Moisés morreu e foi sepultado de forma misteriosa pelo próprio Senhor Deus?",
    options: ["Monte Nebo", "Monte Sinai", "Jardim de Basã", "Deserto de Berseba"],
    answerIndex: 0,
    explanation: "Moisés avistou a Terra Prometida no alto do Monte Nebo, onde faleceu.",
    verse: "Deuteronômio 34:5"
  },

  // 2. Rei Davi
  {
    id: 111,
    category: "Rei Davi",
    difficulty: "médio",
    question: "De qual tribo heráldica de Israel pertencia o Rei Davi?",
    options: ["Tribo de Benjamim", "Tribo de Levi", "Tribo de Judá", "Tribo de Efraim"],
    answerIndex: 2,
    explanation: "Davi pertencia à linhagem real messiânica da Tribo de Judá.",
    verse: "Hebreus 7:14"
  },
  {
    id: 112,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Quantas vezes Davi poupou intencionalmente a vida de Saul quando era caçado por ele?",
    options: ["Uma vez", "Duas vezes", "Três vezes", "Nenhuma vez"],
    answerIndex: 1,
    explanation: "Davi poupou Saul na caverna de En-Gedi e também no acampamento de Zife.",
    verse: "1 Samuel 26:9"
  },
  {
    id: 113,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Qual era o nome da primeira esposa de Davi, filha do rancoroso rei Saul?",
    options: ["Abigail", "Mical", "Bate-Seba", "Maaca"],
    answerIndex: 1,
    explanation: "Mical amava a Davi e o ajudou a escapar de uma emboscada do próprio pai Saul.",
    verse: "1 Samuel 18:20"
  },
  {
    id: 114,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Qual era o nome do comandante implacável do exército de Davi e seu sobrinho fiel?",
    options: ["Joabe", "Abner", "Simei", "Husai"],
    answerIndex: 0,
    explanation: "Joabe serviu fielmente ao exército de Davi em campanhas militares vitoriosas.",
    verse: "2 Samuel 2:13"
  },
  {
    id: 115,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Como se chamava o profeta que destemidamente acusou Davi após seu grave erro com Bate-Seba?",
    options: ["Samuel", "Natã", "Gad", "Elias"],
    answerIndex: 1,
    explanation: "O profeta Natã narrou a parábola da ovelha repreendendo Davi.",
    verse: "2 Samuel 12:7"
  },
  {
    id: 116,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Qual filho rebelde de Davi tomou provisoriamente seu trono após longa conspiração?",
    options: ["Adonias", "Absalão", "Salomão", "Amnon"],
    answerIndex: 1,
    explanation: "Absalão proclamou-se rei de forma ilegítima em Hebrom e guerreou com seu pai.",
    verse: "2 Samuel 15:10"
  },
  {
    id: 117,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Por qual preço em moedas de prata Davi comprou a eira de Araúna para construir o altar?",
    options: ["Cinquenta siclos de prata", "Trinta siclos de ouro", "Cem moedas", "Quarenta dracmas"],
    answerIndex: 0,
    explanation: "Davi recusou receber gratuitamente a eira e pagou cinquenta siclos de prata por ela e pelos bois.",
    verse: "2 Samuel 24:24"
  },
  {
    id: 118,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Quem era o avô do jovem deficiente Mefibosete a quem Davi demonstrou extrema bondade?",
    options: ["Saul", "Jônatas", "Jessé", "Eli"],
    answerIndex: 0,
    explanation: "Mefibosete era filho de Jônatas e neto do ex-rei Saul.",
    verse: "2 Samuel 9:3"
  },
  {
    id: 119,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Em qual cidade Davi governou primeiramente por 7 anos antes de unificar e governar em Jerusalém?",
    options: ["Hebrom", "Belém", "Gibeá", "Siquém"],
    answerIndex: 0,
    explanation: "Davi governou de Hebrom sobre a casa de Judá antes de assumir Israel unificado.",
    verse: "2 Samuel 5:5"
  },
  {
    id: 120,
    category: "Rei Davi",
    difficulty: "médio",
    question: "Como o belo cabelo de Absalão provocou indiretamente sua morte trágica em batalha?",
    options: [
      "Prendeu-se nos galhos cerrados de um carvalho",
      "Foi agarrado pelo cavalo inimigo",
      "Ele tropeçou em sua própria trança",
      "Serviu de alvo fácil para flechas babilônicas"
    ],
    answerIndex: 0,
    explanation: "Absalão fugia de mula e seu cabelo prendeu-se na copa de um carvalho, deixando-o pendurado.",
    verse: "2 Samuel 18:9"
  },

  // 3. Jesus Cristo
  {
    id: 121,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Quem era o cego que clamava 'Jesus, Filho de Davi, tem compaixão de mim!' à saída de Jericó?",
    options: ["Bartimeu", "Zaqueu", "Eliseu", "Lázaro"],
    answerIndex: 0,
    explanation: "O cego de nascença Bartimeu, filho de Timeu, mendigava ao ouvir Jesus passar.",
    verse: "Marcos 10:46"
  },
  {
    id: 122,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Que cobrador de impostos de baixa estatura subiu em uma figueira brava só para avistar Jesus?",
    options: ["Mateus", "Zaqueu", "Nicodemos", "Caifás"],
    answerIndex: 1,
    explanation: "Zaqueu, por ser pequeno, escalou uma árvore; Jesus parou e convidou-se a comer em sua casa.",
    verse: "Lucas 19:4"
  },
  {
    id: 123,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Qual era a língua local falada rotineiramente por Jesus em suas pregações públicas cotidianas?",
    options: ["Hebraico puro", "Latim militar", "Aramaico", "Grego Koiné"],
    answerIndex: 2,
    explanation: "O aramaico era a língua vernacular e corriqueira usada na Judeia e Galileia do século I.",
    verse: "Marcos 5:41"
  },
  {
    id: 124,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "No sermão do monte, que plantas Jesus usou para exemplificar que Deus cuida de nossa vestimenta de fé?",
    options: ["Os lírios do campo", "Figueiras desfolhadas", "Mostarda e trigo de grão", "Uvas bravas"],
    answerIndex: 0,
    explanation: "Jesus exortou: 'Olhai como crescem os lírios do campo; nem Salomão se vestiu como um deles.'",
    verse: "Mateus 6:28"
  },
  {
    id: 125,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "A quem pertenciam os porcos que pulavam no precipício após Jesus exilar uma legião de demônios?",
    options: [
      "Aos habitantes pagãos gadarenos",
      "Ao próprio templo judeu",
      "Ao exército romano invasor",
      "A um pastor israelita desobediente"
    ],
    answerIndex: 0,
    explanation: "Na terra dos gadarenos pastavam manadas de porcos, considerados impuros pelos judeus.",
    verse: "Marcos 5:13"
  },
  {
    id: 126,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Quem era a mulher curada de hemorragia constante de 12 anos após apenas tocar as vestes de Jesus?",
    options: [
      "Nenhuma (a Bíblia não revela seu nome)",
      "Marta de Betânia",
      "Verônica",
      "Maria Madalena"
    ],
    answerIndex: 0,
    explanation: "Essa mulher buscou curas médicas em vão por doze anos e teve seu nome preservado no anonimato nas escrituras.",
    verse: "Lucas 8:43"
  },
  {
    id: 127,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Quem ajudou a sepultar o corpo de Jesus cedendo sua própria sepultura nova esculpida em rocha?",
    options: ["Nicodemos", "José de Arimatéia", "Simão Cireneu", "João, o discípulo amado"],
    answerIndex: 1,
    explanation: "José de Arimatéia, membro ilustre do Sinédrio, pediu o corpo de Jesus a Pilatos.",
    verse: "Mateus 27:57"
  },
  {
    id: 128,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Qual parábola de Jesus narra a bondade de uma pessoa de etnia rival de Israel contra um homem ferido?",
    options: ["O Bom Samaritano", "O Filho Pródigo", "O Trigo e o Joio", "O Credor Incompassivo"],
    answerIndex: 0,
    explanation: "O samaritano cuidou do ferido deitada à berma da estrada ignorado pelo sacerdote e pelo levita.",
    verse: "Lucas 10:33"
  },
  {
    id: 129,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Onde Jesus foi preso na noite em que foi traído por Judas?",
    options: ["Getsêmani (Monte das Oliveiras)", "Sinagoga de Nazaré", "Templo de Herodes", "Casa de Caifás"],
    answerIndex: 0,
    explanation: "Jesus costumava orar no jardim do Getsêmani, ao pé do Monte das Oliveiras, onde foi abordado por guardas.",
    verse: "Mateus 26:36"
  },
  {
    id: 130,
    category: "Jesus Cristo",
    difficulty: "médio",
    question: "Em qual cidade Jesus foi criado e teve sua pregação inicial duramente rejeitada na sinagoga local?",
    options: ["Jerusalém", "Cafarnaum", "Nazaré", "Jericó"],
    answerIndex: 2,
    explanation: "Nazaré foi a cidade onde Jesus cresceu corporalmente, cumprindo profecias de submissão humilde.",
    verse: "Lucas 4:16"
  },

  // 4. Novo Testamento
  {
    id: 131,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Como morreu o perigoso rei Herodes que foi severamente repreendido por roubar a glória divina?",
    options: ["Decapitado por guardas", "Comido por vermes", "Afogado no mar Morto", "Tornado cinzas de fogo"],
    answerIndex: 1,
    explanation: "Um anjo o feriu por não dar glória a Deus, e Herodes Agrippa morreu comido de vermes.",
    verse: "Atos 12:23"
  },
  {
    id: 132,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "De qual local Paulo de Tarso escreveu a maravilhosa carta chamada Filipenses?",
    options: ["Da sinagoga de Atenas", "De uma prisão romana", "Dos campos de Éfeso", "Do barco de Társis"],
    answerIndex: 1,
    explanation: "Filipenses é uma das cartas de prisão escritas de Roma pelo apóstolo encarcerado.",
    verse: "Filipenses 1:13"
  },
  {
    id: 133,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Quem era o médico erudito grego companheiro de Paulo que escreveu dois livros bíblicos importantes?",
    options: ["Timóteo", "Lucas", "Tito", "Apolo"],
    answerIndex: 1,
    explanation: "Lucas, o médico amado, escreveu o Evangelho homônimo e o livro de Atos dos Apóstolos.",
    verse: "Clossenses 4:14"
  },
  {
    id: 134,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Dentre as cartas paulinas, qual delas exalta detalhadamente a Armadura Espiritual contra o mal?",
    options: ["Filipenses", "Efésios", "1 Tessalonicenses", "Gálatas"],
    answerIndex: 1,
    explanation: "Em Efésios 6, Paulo descreve o capacete da salvação, o escudo da fé e a espada do Espírito.",
    verse: "Efésios 6:11"
  },
  {
    id: 135,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Quem era o patrão cristão de Onésimo, o escravo fugitivo de Colossos de quem Paulo interveio na carta?",
    options: ["Diótrefes", "Filemom", "Epafrodito", "Tito"],
    answerIndex: 1,
    explanation: "Paulo escreveu a curta e cordial carta a Filemom pedindo que acolhesse Onésimo reconstruindo sua vida livre.",
    verse: "Filemom 1:10"
  },
  {
    id: 136,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Quem foi o companheiro fiel de Barnabé que viajou junto com ele na primeira viagem missionária?",
    options: ["Paulo", "Timóteo", "Silas", "Lucas"],
    answerIndex: 0,
    explanation: "Barnabé e Saulo foram divinamente consagrados pela igreja de Antioquia para desbravar nações.",
    verse: "Atos 13:2"
  },
  {
    id: 137,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Qual heresia de crença João repreende em suas cartas pastorais afirmando que Jesus veio em carne real?",
    options: ["Gnosticismo", "Simonia", "Idolatria egípcia", "Ateísmo puro"],
    answerIndex: 0,
    explanation: "Os gnósticos negavam a humanidade de carne de Cristo alegando que Ele era apenas um fantasma.",
    verse: "1 João 4:2"
  },
  {
    id: 138,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "O livro emblemático de Hebreus exalta a superioridade de Jesus comparado a que antigo sacerdote misterioso?",
    options: ["Melquisedeque", "Zacarias", "Caifás", "Samuel"],
    answerIndex: 0,
    explanation: "Jesus é sacerdote para sempre conforme a antiga ordem do eterno rei-sacerdote Melquisedeque.",
    verse: "Hebreus 7:17"
  },
  {
    id: 139,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Em Apocalipse, que igreja é fortemente repreendida por ser considerada 'morna' espiritualmente?",
    options: ["Laodicéia", "Éfeso", "Sardes", "Esmirna"],
    answerIndex: 0,
    explanation: "Pela mornidão espiritual de Laodicéia, Cristo avisou que estava prestes a vomitá-los de sua boca.",
    verse: "Apocalipse 3:16"
  },
  {
    id: 140,
    category: "Novo Testamento",
    difficulty: "médio",
    question: "Na ilha de Malta, após naufrágio, que criatura venenosa picou a mão de Paulo sem causar-lhe nenhum dano?",
    options: ["Tartaruga marinha", "Víbora", "Escorpião preto", "Aranha-lobo"],
    answerIndex: 1,
    explanation: "Uma víbora picou a mão de Paulo por causa do fogo, mas ele a sacudiu nas chamas e não sofreu nada.",
    verse: "Atos 28:3"
  },

  // 5. Antigo Testamento
  {
    id: 141,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Qual era a pátria nativa do devoto patriarca Jó que descreve sua grande provação espiritual?",
    options: ["Terra de Uz", "Ur dos Caldeus", "Harã", "Sodoma"],
    answerIndex: 0,
    explanation: "Existia um homem reto e íntegro na Terra de Uz, cujo nome era conhecido como Jó.",
    verse: "Jó 1:1"
  },
  {
    id: 142,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Por quantas moedas de prata e ganância os invejosos irmãos de José o venderam aos midianitas?",
    options: ["30 moedas", "20 moedas", "15 moedas", "50 siclos"],
    answerIndex: 1,
    explanation: "Os irmãos de José aceitaram o preço de vinte moedas de prata vendendo-o como escravo.",
    verse: "Gênesis 37:28"
  },
  {
    id: 143,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Qual era o nome de batismo anterior da rainha órfã Ester na língua hebraica?",
    options: ["Hadassa", "Séphora", "Vasti", "Maaca"],
    answerIndex: 0,
    explanation: "Hadassa, que significa murta, era o nome hebraico da rainha Ester antes de ocultar sua identidade no palácio.",
    verse: "Ester 2:7"
  },
  {
    id: 144,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Quem ergueu um exército selecionado bebendo água como cães usando as mãos para levar à boca?",
    options: ["Gideão", "Sansão", "Josué", "Calebe"],
    answerIndex: 0,
    explanation: "Gideão separou os 300 atentos guerreiros que levaram a água à boca de conchinhas sem deitar.",
    verse: "Juízes 7:6"
  },
  {
    id: 145,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "O que sustentava o profeta Elias com pão e carne de manhã e de tarde junto ao ribeiro de Querite?",
    options: ["Anjos visíveis", "Corvos", "Uma viúva pobre", "Sua própria horta de feijão"],
    answerIndex: 1,
    explanation: "Deus ordenou aos corvos que levassem pão e carne para sustento de Elias durante a seca.",
    verse: "1 Reis 17:6"
  },
  {
    id: 146,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Qual irmão rebelde de Moisés o criticou pela escolha de sua esposa e acabou enfermo por lepra?",
    options: ["Arão", "Miriã", "Coré", "Dã"],
    answerIndex: 1,
    explanation: "Miriã murmurou contra Moisés e foi atacada por lepra severa, precisando sair do arraial por 7 dias.",
    verse: "Números 12:10"
  },
  {
    id: 147,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Quem interpretou o pesadelo do Faraó sobre as sete vacas magras que devoravam as sete vacas gordas?",
    options: ["Moisés", "José do Egito", "Daniel", "Neemias"],
    answerIndex: 1,
    explanation: "José explicou o sonho profetizando sete anos de abundância e sete subsequentes de escassez absoluta.",
    verse: "Gênesis 41:25"
  },
  {
    id: 148,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Quem tentou seduzir o jovem José na corte egípcia antes dele escapar deixando seu manto na cama?",
    options: ["A esposa de Potifar", "A filha do Faraó", "Dalila", "A rainha Vasti"],
    answerIndex: 0,
    explanation: "A esposa do general de Potifar assediou insistentemente o jovem José, que fugiu prezando sua pureza.",
    verse: "Gênesis 39:12"
  },
  {
    id: 149,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Para aplacar a grave praga que assolava Nínive, Jonas pregou por quantos dias pelas ruas?",
    options: ["Três dias", "Um único dia", "Quarenta dias", "Sete dias"],
    answerIndex: 1,
    explanation: "Jonas iniciou a pregação caminhando e clamando que Nínive ruiria em quarenta dias.",
    verse: "Jonas 3:4"
  },
  {
    id: 150,
    category: "Antigo Testamento",
    difficulty: "médio",
    question: "Quem se casou com o idoso Abraão após a dolorosa morte da matriarca Sara?",
    options: ["Hagar", "Quetura", "Rebeca", "Lia"],
    answerIndex: 1,
    explanation: "Abraão casou-se com uma esposa chamada Quetura, gerando mais seis filhos nela.",
    verse: "Gênesis 25:1"
  },

  // 6. Personagens Bíblicos
  {
    id: 151,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Quem era a astuta nora de Judá que se disfarçou para garantir seus direitos familiares de descendência?",
    options: ["Tamar", "Raquel", "Rute", "Dina"],
    answerIndex: 0,
    explanation: "Tamar agiu de forma desesperada disfarçando-se para obter prole com Judá.",
    verse: "Gênesis 38:14"
  },
  {
    id: 152,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Quem foi o destemido profeta que repreendeu pessoalmente o cruel rei Acabe chamando-o de perturbador de Israel?",
    options: ["Eliseu", "Isaías", "Elias", "Micaías"],
    answerIndex: 2,
    explanation: "Elias declarou que as idolatrias do rei à frente de Israel eram o verdadeiro motivo da seca divina.",
    verse: "1 Reis 18:18"
  },
  {
    id: 153,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Como se chamava a sogra carinhosa e idosa da jovem Rute, a devota moabita?",
    options: ["Sará", "Noemi", "Ana", "Lia"],
    answerIndex: 1,
    explanation: "Noemi aconselhou sabiamente a Rute ao retornar desamparada da terra de Moabe.",
    verse: "Rute 1:20"
  },
  {
    id: 154,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Que general sírio foi milagrosamente curado de lepra crônica ao mergulhar sete vezes no rio Jordão?",
    options: ["Naamã", "Ben-Hadade", "Senaqueribe", "Silas"],
    answerIndex: 0,
    explanation: "O profeta Eliseu enviou mensageiro instruindo Naamã a banhar-se no Rio Jordão sete vezes.",
    verse: "2 Reis 5:10"
  },
  {
    id: 155,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Quem era a mulher virtuosa idosa, prima de Maria, mãe do profeta João Batista?",
    options: ["Sara", "Isabel", "Ana", "Rebeca"],
    answerIndex: 1,
    explanation: "Isabel concebeu na velhice João Batista sob anúncio celestial aos ouvidos de Zacarias.",
    verse: "Lucas 1:36"
  },
  {
    id: 156,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Qual era a profissão no palácio exercida peço resoluto reconstrutor Neemias antes de erguer os muros?",
    options: ["Escriba oficial", "Arquiteto real", "Copeiro do rei", "Comandante da guarda"],
    answerIndex: 2,
    explanation: "Neemias servia como copeiro do rei persa Artaxerxes no luxuoso palácio em Susã.",
    verse: "Neemias 1:11"
  },
  {
    id: 157,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Quem foi o jovem discípulo fiel que viajava no navio com Paulo e possuía uma herança de fé de sua avó Lois?",
    options: ["Timóteo", "Tito", "Matias", "Lucas"],
    answerIndex: 0,
    explanation: "Paulo elogiou a fé sem fingimento de Timóteo herdada de sua mãe Eunice e de sua avó Lois.",
    verse: "2 Timóteo 1:5"
  },
  {
    id: 158,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Qual profeta foi engolido vivo por um ser marinho após tentar escapar de pregar arrependimento em Nínive?",
    options: ["Elias", "Jonas", "Naum", "Jeremias"],
    answerIndex: 1,
    explanation: "Jonas relutava em pregar para os cruéis ninivitas e tentou fugir noutra rota oposta.",
    verse: "Jonas 1:2"
  },
  {
    id: 159,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Quem era a virtuosa juíza e profetisa que julgava pendências de Israel debaixo de uma palmeira?",
    options: ["Miriã", "Débora", "Ester", "Rute"],
    answerIndex: 1,
    explanation: "Débora julgava em Israel sob o coqueiro de Débora no território montanhoso de Efraim.",
    verse: "Juízes 4:5"
  },
  {
    id: 160,
    category: "Personagens Bíblicos",
    difficulty: "médio",
    question: "Como se chamava o terrível conspirador de Susã que mandou erguer uma forca enorme só para matar Mardoqueu?",
    options: ["Hamã", "Assuero", "Belsazar", "Sambalate"],
    answerIndex: 0,
    explanation: "Hamã em sua soberba ergueu uma forca de 50 côvados, mas acabou ele próprio enforcado nela.",
    verse: "Ester 7:10"
  },

  // 7. Geografia Bíblica
  {
    id: 161,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "De qual local exato no Egito os hebreus partiram liderados por Moisés rumo ao Êxodo?",
    options: ["Ramsés (Ramessés)", "Mênfis", "Alexandria", "Tebas"],
    answerIndex: 0,
    explanation: "O povo de Israel partiu de Ramsés para Sucote com quase seiscentos mil homens a pé.",
    verse: "Êxodo 12:37"
  },
  {
    id: 162,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Em qual cidade cercada por montanhas desabou o jovem que adormeceu na janela caindo no chão?",
    options: ["Trôade", "Éfeso", "Mileto", "Atenas"],
    answerIndex: 0,
    explanation: "Paulo pregava longamente numa sala de terceiro andar na cidade do porto grego de Trôade.",
    verse: "Atos 20:5"
  },
  {
    id: 163,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Em que lugar emblemático e poético o povo construiu uma infame torre na intenção de tocar o próprio céu?",
    options: ["Monte Sinai", "Planície de Sinar (Senaar)", "Planalto de Basã", "Campina de Sodoma"],
    answerIndex: 1,
    explanation: "Eles acharam uma planície na fértil terra de Sinar e decidiram erguer a famosa Torre de Babel.",
    verse: "Gênesis 11:2"
  },
  {
    id: 164,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Em qual localidade de veraneio fora de Jerusalém Jesus encontrou a mulher samaritana pedindo-lhe água de beber?",
    options: ["Emaús", "Junto à Fonte (Poço) de Jacó, em Siquém", "Betânia", "Betsaida"],
    answerIndex: 1,
    explanation: "Jesus sentou-se exausto à beira do Poço de Jacó, na aldeia samaritana de Sicar.",
    verse: "João 4:5"
  },
  {
    id: 165,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Onde o profeta Samuel posicionou solenemente a famosa pedra memorial batizada de Ebenézer?",
    options: [
      "Entre Mispa e Sem",
      "No topo do Monte Sinai",
      "À beira do Rio Jordão",
      "No portão do templo de Siló"
    ],
    answerIndex: 0,
    explanation: "Samuel pôs a pedra memorial exclamando: 'Até aqui nos ajudou o Senhor!', batizando-a Ebenézer.",
    verse: "1 Samuel 7:12"
  },
  {
    id: 166,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Qual famosa cidade onde Ló morou foi consumida por uma implacável chuva de enxofre e fogo devastando o vale?",
    options: ["Samaria", "Sodoma", "Babilônia", "Damasco"],
    answerIndex: 1,
    explanation: "O Senhor fez chover enxofre e fogo dos céus sobre Sodoma e sua vizinha Gomorra por suas atrocidades.",
    verse: "Gênesis 19:24"
  },
  {
    id: 167,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "De qual montanha Moisés contemplou a Terra Prometida sem poder pisar nela antes do seu sepultamento divino?",
    options: ["Monte Nebo (Pisga)", "Monte Sinai", "Monte Tabor", "Monte das Oliveiras"],
    answerIndex: 0,
    explanation: "No cume do Nebo (Pisga), Moisés avistou o território estendendo-se até o mar Ocidental.",
    verse: "Deuteronômio 34:1"
  },
  {
    id: 168,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Qual rio fértil irrigava os campos do Egito antigo e escondeu o pequeno cesto flutuante de Moisés?",
    options: ["Rio Eufrates", "Rio Jordão", "Rio Nilo", "Rio Tigre"],
    answerIndex: 2,
    explanation: "Joquebede pôs o cestinho com cuidado nos juncos à beira do caudaloso Rio Nilo.",
    verse: "Êxodo 2:3"
  },
  {
    id: 169,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Próximo a qual cidade Saulo de Tarso foi ofuscado por uma forte luz caindo do cavalo ao chão?",
    options: ["Roma", "Éfeso", "Damasco", "Jerusalém"],
    answerIndex: 2,
    explanation: "Saulo viajava em comissão opressora contra os cristãos rumo aos portões de Damasco.",
    verse: "Atos 9:3"
  },
  {
    id: 170,
    category: "Geografia Bíblica",
    difficulty: "médio",
    question: "Para qual ilha do império romano o idoso e devoto João Evangelista foi desterrado?",
    options: ["Ilha de Creta", "Ilha de Chipre", "Ilha de Patmos", "Ilha de Malta"],
    answerIndex: 2,
    explanation: "João estava exilado na Ilha de Patmos por causa do testemunho fiel de Jesus Cristo.",
    verse: "Apocalipse 1:9"
  },

  // 8. Igreja Primitiva
  {
    id: 171,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Qual casal abrigou Paulo em Corinto e fabricavam as mesmas tendas de pano?",
    options: ["Ananias e Safira", "Aquila e Priscila", "Filemom e Onésimo", "Herodes e Herodias"],
    answerIndex: 1,
    explanation: "Áquila e Priscila, recém-expulsos de Roma por Cláudio, hospedaram o cansado Paulo.",
    verse: "Atos 18:2"
  },
  {
    id: 172,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Quem era a rica comerciante de tecidos de cor púrpura que se converteu em Filipos com toda sua família?",
    options: ["Lídia", "Tabita", "Lois", "Priscila"],
    answerIndex: 0,
    explanation: "Lídia, da caridosa cidade de Tiatira, ouviu Paulo abrir o coração e convidou os apóstolos a se hospedar.",
    verse: "Atos 16:14"
  },
  {
    id: 173,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "De qual apóstolo a sombra curava doentes espalhados em esteiras pelas calçadas de Jerusalém?",
    options: ["Paulo", "Pedro", "Filipe", "Tiago"],
    answerIndex: 1,
    explanation: "As multidões traziam doentes de longe na expectativa de que ao menos a sombra de Pedro os tocasse.",
    verse: "Atos 5:15"
  },
  {
    id: 174,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Na cura do paralítico Eneas em Lida, quem os Atos descrevem que realizou de fato a cura milagrosa?",
    options: ["O próprio Pedro", "Jesus Cristo", "O Espírito Santo em nuvem", "O diácono Estêvão"],
    answerIndex: 1,
    explanation: "Pedro exclamou: 'Eneias, Jesus Cristo te cura! Levanta-te e arruma teu leito.'",
    verse: "Atos 9:34"
  },
  {
    id: 175,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Quem foi o companheiro fiel enviado junto a Paulo buscar recursos na Ásia e apoiar na carta aos Gálatas?",
    options: ["Barnabé", "Tito", "Matias", "João Marcos"],
    answerIndex: 0,
    explanation: "Barnabé era apelidado Filho da Consolação por seu temperamento alegre e generoso incentivo.",
    verse: "Gálatas 2:1"
  },
  {
    id: 176,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Quem desmaiou caindo morto ao chão após Pedro o repreender por querer subornar para obter o poder do Espírito?",
    options: ["Simão, o Mago", "Ananias", "Félix", "Elimas ou Barjesus"],
    answerIndex: 0,
    explanation: "Simão, ex-mago de Samaria, tentou pagar dinheiro por esse dom recebendo dura repreensão de Pedro.",
    verse: "Atos 8:20"
  },
  {
    id: 177,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Quais eram os dois homens com recomendação enviados com cartas do Concílio decretando isenção de fardo sobre os gentios?",
    options: [
      "Judas (Barsabás) e Silas",
      "Barnabé e Marcos",
      "Timóteo e Lucas",
      "Tito e Clemente"
    ],
    answerIndex: 0,
    explanation: "O concílio enviou Judas Barsabás e Silas junto de Paulo para divulgar pessoalmente os decretos.",
    verse: "Atos 15:22"
  },
  {
    id: 178,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Quem curou os olhos cegados de Saulo de Tarso recebendo-o como irmão sob instrução direta na visão em Damasco?",
    options: ["Pedro", "Ananias", "Filipe", "Tiago"],
    answerIndex: 1,
    explanation: "O crente Ananias, temeroso, foi à rua Direita e impôs as mãos sobre Saulo devolvendo-lhe a visão.",
    verse: "Atos 9:17"
  },
  {
    id: 179,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "Em qual cidade litorânea grega Paulo de Tarso discursou sobre Deus perante os filósofos epicureus no Areópago?",
    options: ["Corinto", "Atenas", "Filipos", "Tessalônica"],
    answerIndex: 1,
    explanation: "Em Atenas, Paulo discursou apontando o altar memorial 'Ao Deus Desconhecido'.",
    verse: "Atos 17:22"
  },
  {
    id: 180,
    category: "Igreja Primitiva",
    difficulty: "médio",
    question: "A quem pertence o curtume citado em Jope que hospedou e acolheu Pedro antes dele partir à casa do centurião Cornélio?",
    options: ["Simão", "Zaqueu", "Tiago", "Cornélio"],
    answerIndex: 0,
    explanation: "Pedro hospedou-se por vários dias em casa de Simão, o Curtidor, à beira do mar.",
    verse: "Atos 9:43"
  },

  // 9. Crianças da Bíblia
  {
    id: 181,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Qual era o nome do filho de Rute e Boaz, que consolou a idosa Noemi na velhice?",
    options: ["Obede", "Jessé", "Davi", "Salomão"],
    answerIndex: 0,
    explanation: "Obede nasceu embalado por Noemi e tornou-se pai de Jessé, avô do rei Davi.",
    verse: "Rute 4:17"
  },
  {
    id: 182,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Que servo hebreu no templo de Siló foi gerado depois que Eli orou pela estéril Ana?",
    options: ["Samuel", "Sansão", "Davi", "Eliseu"],
    answerIndex: 0,
    explanation: "Samuel cumpriu voto de dedicação perpétua sendo doado ao templo após desmamar.",
    verse: "1 Samuel 1:20"
  },
  {
    id: 183,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Quem correu desesperado ao ribeiro em busca do rei após os filisteus golpearem a cabeça do seu pai Saul?",
    options: [
      "Ninguém (Davi ouviu no acampamento)",
      "Mefibosete",
      "Absalão",
      "Jônatas"
    ],
    answerIndex: 0,
    explanation: "A notícia da morte de Saul e Jônatas veio de um mensageiro amalequita ao acampamento de Davi.",
    verse: "2 Samuel 1:1"
  },
  {
    id: 184,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Onde residiu o bebê Jesus nos primeiros anos para escapar do infame extermínio de recém-nascidos ordenado por Herodes?",
    options: ["No Egito", "Em nazaré", "Em Roma", "Na Pérsia"],
    answerIndex: 0,
    explanation: "José fugiu às pressas com o bebê à noite para o Egito após aviso angelical.",
    verse: "Mateus 2:13"
  },
  {
    id: 185,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Como se chama o filho caçula deficiente de pernas de Jônatas que tinha 5 anos quando a notícia de guerra se espalhou?",
    options: ["Mefibosete", "Absalão", "Salomão", "Armoni"],
    answerIndex: 0,
    explanation: "Ao fugir assustada, a babá deixou cair o pequeno Mefibosete, aleijando suas duas pernas.",
    verse: "2 Samuel 4:4"
  },
  {
    id: 186,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "A quem pertencia a jovem criada que avisou Naamã sobre o profeta de Samaria capaz de curar sua lepra?",
    options: [
      "Era uma menina cativa do povo de Israel",
      "Uma filha de Faraó",
      "A irmã de Eliseu",
      "A serva de Noemi"
    ],
    answerIndex: 0,
    explanation: "Tropas sírias haviam trazido cativa de Israel de uma menina, que servia a esposa de Naamã.",
    verse: "2 Reis 5:2"
  },
  {
    id: 187,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Com quantos anos de idade o herói reformador Josias começou a buscar pessoalmente o Deus de seu pai Davi?",
    options: ["No oitavo ano de seu reinado (16 anos)", "Com doze anos de idade", "Aos trinta anos completos", "Início de seu reinado"],
    answerIndex: 0,
    explanation: "Aos 16 anos, Josias iniciou buscas detalhadas de purificação de imagens e altares de baal em Judá.",
    verse: "2 Crônicas 34:3"
  },
  {
    id: 188,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "A filha do sacerdote Potífera casou-se com José e gerou dois meninos. Quem era o mais velho?",
    options: ["Manassés", "Efraim", "Benjamim", "Gérson"],
    answerIndex: 0,
    explanation: "José batizou o primogênito Manassés, exclamando: 'Deus me fez esquecer meu sofrimento familiar.'",
    verse: "Gênesis 41:51"
  },
  {
    id: 189,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Qual era o nome do filho de Moisés nascido enquanto ele vivia refugiado em Midiã com Zípora?",
    options: ["Gérson", "Eliézer", "Benjamim", "Manassés"],
    answerIndex: 0,
    explanation: "Gérson significa 'Sou forasteiro em terra alheia', marcando o refúgio humilde de Moisés.",
    verse: "Êxodo 2:22"
  },
  {
    id: 190,
    category: "Crianças da Bíblia",
    difficulty: "médio",
    question: "Enquanto Jesus viajava, que tipo de bênção Ele conferiu colocando as mãos sobre as crianças?",
    options: ["O Reino de Deus pertence a elas", "Riqueza imensa", "Inteligência acadêmica", "Paz mundial imediata"],
    answerIndex: 0,
    explanation: "Jesus repreendeu os discípulos exclamando: 'Deixai vir a mim as criancinhas, pois delas é o Reino.'",
    verse: "Lucas 18:16"
  },

  // 10. Desafio Mestre Bíblico
  {
    id: 191,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Sob cuja liderança os muros vulneráveis de Jerusalém foram completamente reerguidos em escassos 52 dias?",
    options: ["Esdras", "Neemias", "Zorobabel", "Josias"],
    answerIndex: 1,
    explanation: "Os judeus dividiram as frentes de trabalho com espada numa mão e colher de pedreiro na outra.",
    verse: "Neemias 6:15"
  },
  {
    id: 192,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Que profeta foi banido e exilado numa ilha deserta por pregar e ali redigiu visões cósmicas do Apocalipse?",
    options: ["Paulo de Tarso", "João Evangelista", "Apóstolo Pedro", "Barnabé"],
    answerIndex: 1,
    explanation: "João estava detido na Ilha de Patmos quando recebeu a revelação arrebatadora de Jesus.",
    verse: "Apocalipse 1:9"
  },
  {
    id: 193,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Seu nome era 'Fogo e trovão'. Qual apelido Jesus deu de forma cômica aos irmãos Tiago e João?",
    options: ["Boanerges", "Querubins", "Cefas", "Zelotes"],
    answerIndex: 0,
    explanation: "Jesus chamou Tiago e João de Boanerges, que em aramaico quer dizer 'Filhos do Trovão'.",
    verse: "Marcos 3:17"
  },
  {
    id: 194,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Qual é o menor versículo hebraico em extensão de palavras ou letras traduzido comumente no Antigo Testamento?",
    options: [
      "Não matarás",
      "No princípio criou Deus...",
      "O Senhor é meu Pastor",
      "Davi chorou"
    ],
    answerIndex: 0,
    explanation: "O mandamento curto de Êxodo possui poucas letras e palavras no hebraico original (Lo tir'tsach).",
    verse: "Êxodo 20:13"
  },
  {
    id: 195,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Quem foi a única mulher citada nominalmente como juíza militar do antigo Israel?",
    options: ["Miriã", "Ester", "Débora", "Lídia"],
    answerIndex: 2,
    explanation: "Débora, esposa de Lapidote, serviu como juíza inspirando Baraque na guerra contra os cananeus.",
    verse: "Juízes 4:4"
  },
  {
    id: 196,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "O que Elias deparou e comeu que lhe deu forças para caminhar 40 dias até o Monte Horebe?",
    options: ["Uvas maduras", "Carne cozida e pão trazidos de anjos", "Bolo cozido em brasas e jarro de água de anjo", "Maná do deserto"],
    answerIndex: 2,
    explanation: "Um anjo do Senhor reaqueceu Elias e ele comeu um bolo sobre as brasas, resistindo longos dias.",
    verse: "1 Reis 19:6"
  },
  {
    id: 197,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "De qual tribo lendária de Israel pertencia o profeta Moisés e seu irmão Arão?",
    options: ["Tribo de Rúben", "Tribo de Levi", "Tribo de Judá", "Tribo de Dã"],
    answerIndex: 1,
    explanation: "Moisés e Arão descendiam da tribo sacerdotal de Levi encarregada de coisas santas.",
    verse: "Êxodo 2:1"
  },
  {
    id: 198,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Qual selo de criatura representava o Cavaleiro da Morte que trazia pestes em Apocalipse?",
    options: ["Cavalo amarelo / pálido", "Cavalo preto", "Cavalo vermelho", "Cavalo lilás"],
    answerIndex: 0,
    explanation: "O cavalo cinzento/pálido era montado pelo cavaleiro batizado de Morte, com o Inferno seguindo atrás.",
    verse: "Apocalipse 6:8"
  },
  {
    id: 199,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Quem tentou comprar os dons de batismo com as mãos do apóstolo Pedro recebendo condenação severa?",
    options: ["Simão, o Mago", "Ananias", "Herodes Agrippa", "Félix"],
    answerIndex: 0,
    explanation: "Simão acreditava erroneamente que poderia adquirir espiritismo ou unção de Deus pagando.",
    verse: "Atos 8:18"
  },
  {
    id: 200,
    category: "Desafio Mestre Bíblico",
    difficulty: "médio",
    question: "Quem era a filha de Ló que deu origem à terrível linhagem guerreira e rival dos moabitas nas escrituras?",
    options: ["A filha mais velha de Ló (sem nome)", "Tamar", "Hadassa", "Orfa"],
    answerIndex: 0,
    explanation: "As filhas de Ló usaram do artifício de engravidar do pai e a primogênita deu à luz a Moabe.",
    verse: "Gênesis 19:37"
  }
];
