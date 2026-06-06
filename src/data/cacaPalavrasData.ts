export interface CacaPalavrasPhase {
  id: string; // e.g., "m1-f1"
  name: string;
  words: string[];
  gridSize?: number;
}

export interface CacaPalavrasWorld {
  id: number;
  name: string;
  icon: string;
  phases: CacaPalavrasPhase[];
  isSpecial?: boolean;
}

export const WORLDS: CacaPalavrasWorld[] = [
  {
    id: 1,
    name: "Temas Bíblicos",
    icon: "📖",
    phases: [
      { id: "m1-f1", name: "Personagens", words: ["MOISES", "ABRAAO", "NOE", "JESUS", "DAVI", "SALOMAO", "ELIAS"] },
      { id: "m1-f2", name: "Profetas", words: ["ISAIAS", "JEREMIAS", "EZEQUIEL", "DANIEL", "OSEIAS", "JOEL", "JONAS"] },
      { id: "m1-f3", name: "Apóstolos", words: ["MATEUS", "MARCOS", "LUCAS", "JOAO", "PEDRO", "PAULO", "TOME"] },
      { id: "m1-f4", name: "Reis de Israel", words: ["SAUL", "DAVI", "SALOMAO", "ROBOAO", "ACABE", "JORAO", "JOSIAS"] },
      { id: "m1-f5", name: "Mulheres da Bíblia", words: ["MARIA", "MARTA", "SARA", "RUTE", "ESTER", "ALZIRA", "RAQUEL", "NOEMI"] },
      { id: "m1-f6", name: "Milagres", words: ["CURA", "MULTIPLICACAO", "RESURREICAO", "FE", "TEMPESTADE", "MAR", "CEGO"] },
      { id: "m1-f7", name: "Livros", words: ["GENESIS", "EXODO", "SALMOS", "PROVERBIOS", "MATEUS", "ROMANOS", "APOCALIPSE"] },
      { id: "m1-f8", name: "Parábolas", words: ["SEMEADOR", "TALENTOS", "SAMARITANO", "PERDIDA", "JOIO", "TRIGO", "REDE"] },
      { id: "m1-f9", name: "Frutos do Espírito", words: ["AMOR", "ALEGRIA", "PAZ", "PACIENCIA", "BONDADE", "FE", "MANSIDAO"] }
    ]
  },
  {
    id: 2,
    name: "Animais",
    icon: "🐾",
    phases: [
      { id: "m2-f1", name: "Animais Domésticos", words: ["CACHORRO", "GATO", "COELHO", "PAPAGAIO", "HAMSTER", "VACA", "CAVALO"] },
      { id: "m2-f2", name: "Animais Selvagens", words: ["LEAO", "TIGRE", "ELEFANTE", "GIRAFA", "ZEBRA", "LOBO", "URSO"] },
      { id: "m2-f3", name: "Animais Marinhos", words: ["TUBARAO", "BALEIA", "GOLFINHO", "POLVO", "PEIXE", "AGUAVIVA", "SIRI"] },
      { id: "m2-f4", name: "Pássaros", words: ["AGUIA", "FALCAO", "BEMTEVI", "TUCANO", "ARARA", "CHULA", "CORUJA"] },
      { id: "m2-f5", name: "Insetos", words: ["ABELHA", "FORMIGA", "MOSQUITO", "BORBOLETA", "BARATA", "GRILLO", "VARAL"] },
      { id: "m2-f6", name: "Mamíferos", words: ["MORCEGO", "PINGUIM", "MACACO", "BALEIA", "CANGURU", "LEOPARDO", "RINOCERONTE"] }
    ]
  },
  {
    id: 3,
    name: "Países",
    icon: "🌎",
    phases: [
      { id: "m3-f1", name: "América do Sul", words: ["BRASIL", "ARGENTINA", "URUGUAI", "PARAGUAI", "CHILE", "PERU", "BOLIVIA"] },
      { id: "m3-f2", name: "Europa", words: ["PORTUGAL", "ESPANHA", "FRANCA", "ITALIA", "ALEMANHA", "INGLATERRA", "GRECIA"] },
      { id: "m3-f3", name: "América do Norte", words: ["CANADA", "ESTADOSUNIDOS", "MEXICO", "GROENLANDIA", "CUBA", "JAMAICA"] },
      { id: "m3-f4", name: "Ásia", words: ["JAPAO", "CHINA", "INDIA", "TAILANDIA", "VIETNAME", "COreia", "RUSSIA"] }
    ]
  },
  {
    id: 4,
    name: "Cidades",
    icon: "🏙️",
    phases: [
      { id: "m4-f1", name: "Capitais", words: ["BRASILIA", "LISBOA", "MADRID", "PARIS", "LONDRES", "ROMA", "TOQUIO", "PEQUIM"] },
      { id: "m4-f2", name: "Cidades Históricas", words: ["ATENAS", "ROMA", "JERUSALEM", "CAIRO", "POMPEIA", "SALVADOR", "OUROPRETO"] },
      { id: "m4-f3", name: "Cidades Famosas", words: ["NOVA_YORK", "PARIS", "DUBAI", "XANGAI", "MIAMI", "VENEZA", "LAS_VEGAS"] }
    ]
  },
  {
    id: 5,
    name: "Alimentos",
    icon: "🍎",
    phases: [
      { id: "m5-f1", name: "Frutas", words: ["BANANA", "MACA", "LARANJA", "MORANGO", "MANGA", "UVA", "ABACAXI", "MELANCIA"] },
      { id: "m5-f2", name: "Vegetais", words: ["ALFACE", "TOMATE", "CENOURA", "BATATA", "BROCOLIS", "CEBOLA", "ALHO", "PEPINO"] },
      { id: "m5-f3", name: "Doces", words: ["CHOCOLATE", "SORVETE", "BOLO", "PUDIM", "PIRULITO", "CHICLE", "BALA", "BRIGADEIRO"] }
    ]
  },
  {
    id: 6,
    name: "Esportes",
    icon: "⚽",
    phases: [
      { id: "m6-f1", name: "Futebol", words: ["GOL", "BOLA", "CAMPO", "CHUTE", "ARBITRO", "ESTADIO", "TRAVE", "IMPECHAMENTO"] },
      { id: "m6-f2", name: "Geral", words: ["BASQUETE", "VOLEI", "TENIS", "NATACAO", "CORRIDA", "JUDO", "GOLFE", "CICLISMO"] }
    ]
  },
  {
    id: 7,
    name: "Transportes",
    icon: "🚗",
    phases: [
      { id: "m7-f1", name: "Veículos", words: ["CARRO", "MOTO", "ONIBUS", "CAMINHAO", "TRATOR", "BICICLETA", "CARROCA"] },
      { id: "m7-f2", name: "Geral", words: ["AVIAO", "NAVIO", "TREM", "METRO", "HELICOPTERO", "BALAO", "SUBMARINO"] }
    ]
  },
  {
    id: 8,
    name: "Ciências",
    icon: "🔬",
    phases: [
      { id: "m8-f1", name: "Planetas", words: ["TERRA", "MARTE", "JUPITER", "SATURNO", "VENUS", "MERCURIO", "URANO", "NEPTUNO"] },
      { id: "m8-f2", name: "Corpo Humano", words: ["CORACAO", "CEREBRO", "PULMAO", "ESTOMAGO", "OSSO", "SANGUE", "PELE", "MUSCULO"] }
    ]
  },
  {
    id: 9,
    name: "Cultura Pop",
    icon: "🎬",
    phases: [
      { id: "m9-f1", name: "Cultura", words: ["FILMES", "SERIES", "DESENHOS", "HEROIS", "MUSICA", "LIVROS", "GAMES", "TEATRO"] }
    ]
  },
  {
    id: 10,
    name: "Conhecimento Bíblico Avançado",
    icon: "👑",
    isSpecial: true,
    phases: [
      { id: "m10-f1", name: "Sacerdotes & Profetas", words: ["MELQUISEDEQUE", "ARAO", "ELI", "SAMUEL", "EZEQUIEL", "HABACUQUE", "MALAQUIAS"] },
      { id: "m10-f2", name: "Cidades Bíblicas", words: ["JERUSALEM", "BELEN", "NAZARE", "JERICO", "NINIVE", "BABILONIA", "ROMA", "DAMASCO"] },
      { id: "m10-f3", name: "Virtudes Divinas", words: ["MISERICORDIA", "SANTIDADE", "CLEMENTE", "JUSTICA", "GRACA", "FIDELIDADE"] }
    ]
  }
];
