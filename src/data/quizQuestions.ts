import { QuizQuestion } from '../types/quiz';
import { questionsEasy } from './questionsEasy';
import { questionsMedium } from './questionsMedium';
import { questionsHard } from './questionsHard';
import { questionsMaster } from './questionsMaster';

export const allQuestions: QuizQuestion[] = [
  ...questionsEasy,
  ...questionsMedium,
  ...questionsHard,
  ...questionsMaster
];

export const categories = [
  { id: "Bíblia Geral", name: "📖 Bíblia Geral", description: "Histórias gerais e conceitos da fé livre" },
  { id: "Rei Davi", name: "👑 Rei Davi", description: "A vida do pastor de ovelhas que virou o rei de Israel" },
  { id: "Jesus Cristo", name: "✝️ Jesus Cristo", description: "Milagres, ensinamentos e sacrifício Redentor" },
  { id: "Novo Testamento", name: "🕊️ Novo Testamento", description: "Cartas paulinas e a caminhada apostólica" },
  { id: "Antigo Testamento", name: "📜 Antigo Testamento", description: "Gênesis, profetas clássicos e libertação do Egito" },
  { id: "Personagens Bíblicos", name: "👨👩👧 Personagens Bíblicos", description: "A caminhada dos heróis e heroínas das Escrituras" },
  { id: "Geografia Bíblica", name: "🌍 Geografia Bíblica", description: "Montanhas, rios sagrados e impérios da fidelidade" },
  { id: "Igreja Primitiva", name: "⛪ Igreja Primitiva", description: "Pentecostes, milagres emAtos e expansão do Reino" },
  { id: "Crianças da Bíblia", name: "👶 Crianças da Bíblia", description: "Samuel menor, depara Isaque e reis de pouca idade" },
  { id: "Desafio Mestre Bíblico", name: "🏆 Desafio Mestre Bíblico", description: "Desafios extremos para profundos conhecedores" }
];

export const difficulties = [
  { id: "fácil", name: "🟢 Fácil", count: 100, xpReward: 10, coinReward: 5 },
  { id: "médio", name: "🟡 Médio", count: 100, xpReward: 20, coinReward: 10 },
  { id: "difícil", name: "🔴 Difícil", count: 100, xpReward: 35, coinReward: 15 },
  { id: "mestre", name: "👑 Mestre", count: 50, xpReward: 50, coinReward: 25 }
];

export const achievements = [
  {
    id: "aprendiz",
    title: "🥉 Aprendiz Bíblico",
    description: "Acerte sua primeira pergunta no Quiz Bíblico.",
    requirement: "1 acerto",
    xpReward: 50,
    coinReward: 15,
    icon: "award"
  },
  {
    id: "conhecedor",
    title: "🥈 Conhecedor das Escrituras",
    description: "Alcance um total de 30 perguntas respondidas corretamente.",
    requirement: "30 acertos",
    xpReward: 150,
    coinReward: 50,
    icon: "scroll"
  },
  {
    id: "mestre",
    title: "🥇 Mestre Bíblico",
    description: "Complete qualquer categoria no nível Difícil.",
    requirement: "Categoria difícil concluída",
    xpReward: 300,
    coinReward: 100,
    icon: "trophy"
  },
  {
    id: "rei_conhecimento",
    title: "👑 Rei do Conhecimento",
    description: "Alcance uma sequência incrível de 15 acertos seguidos (Combo x15!).",
    requirement: "Sequência de 15 acertos",
    xpReward: 500,
    coinReward: 200,
    icon: "crown"
  },
  {
    id: "sabio",
    title: "🕊️ Sábio de Israel",
    description: "Acumule um total grandioso de 1000 XP no Quiz Bíblico.",
    requirement: "1000 XP acumulado",
    xpReward: 1000,
    coinReward: 500,
    icon: "sparkles"
  }
];
