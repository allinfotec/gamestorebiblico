import localforage from 'localforage';
import { create } from 'zustand';

export interface CacaPalavrasProgress {
  completedPhases: string[]; // List of phase IDs, e.g. ["m1-f1", "m2-f3"]
  xp: number;
  coins: number;
  stars: number;
  unlockedAchievements: string[]; // List of achievement IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionDescription: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    title: "Primeira Vitória",
    description: "Parabéns pela sua primeira palavra encontrada e fase concluída!",
    icon: "🥇",
    conditionDescription: "Conclua uma fase"
  },
  {
    id: "10_wins",
    title: "Mestre Iniciante",
    description: "Você já desvendou 10 fases de Caça-Palavras!",
    icon: "⭐",
    conditionDescription: "Conclua 10 fases"
  },
  {
    id: "50_wins",
    title: "Desbravador de Palavras",
    description: "Uma jornada incrível: 50 fases superadas com destreza!",
    icon: "🏆",
    conditionDescription: "Conclua 50 fases"
  },
  {
    id: "bible_master",
    title: "Especialista Bíblico",
    description: "A sabedoria sagrada: completou todo o mundo de Temas Bíblicos!",
    icon: "📖",
    conditionDescription: "Complete o Mundo 1"
  },
  {
    id: "animal_master",
    title: "Mestre dos Animais",
    description: "Concluiu com perfeição todas as fases do mundo dos Animais!",
    icon: "🐾",
    conditionDescription: "Complete o Mundo 2"
  },
  {
    id: "world_traveler",
    title: "Explorador do Mundo",
    description: "Geografia dominada! Concluiu os mundos de Países e Cidades!",
    icon: "🌎",
    conditionDescription: "Complete Mundos 3 e 4"
  },
  {
    id: "supreme_hunter",
    title: "Caçador de Palavras Supremo",
    description: "Incrível! Você concluiu o Mundo Especial Avançado!",
    icon: "👑",
    conditionDescription: "Complete o Mundo 10"
  }
];

interface CacaPalavrasState extends CacaPalavrasProgress {
  isHydrated: boolean;
  completePhase: (phaseId: string, worldId: number, wordsFoundCount: number) => { newAchievements: Achievement[] };
  resetProgress: () => Promise<void>;
  hydrate: () => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  addCoins: (amount: number) => Promise<void>;
}

export const useCacaPalavrasStore = create<CacaPalavrasState>((set, get) => ({
  completedPhases: [],
  xp: 0,
  coins: 0,
  stars: 0,
  unlockedAchievements: [],
  isHydrated: false,

  spendCoins: async (amount) => {
    const { coins, completedPhases, xp, stars, unlockedAchievements } = get();
    if (coins < amount) return false;
    const nextCoins = coins - amount;
    set({ coins: nextCoins });
    
    const updatedState = {
      completedPhases,
      xp,
      coins: nextCoins,
      stars,
      unlockedAchievements
    };
    await localforage.setItem('app_cacapalavras_progress', updatedState);
    return true;
  },

  addCoins: async (amount) => {
    const { coins, completedPhases, xp, stars, unlockedAchievements } = get();
    const nextCoins = coins + amount;
    set({ coins: nextCoins });
    
    const updatedState = {
      completedPhases,
      xp,
      coins: nextCoins,
      stars,
      unlockedAchievements
    };
    await localforage.setItem('app_cacapalavras_progress', updatedState);
  },

  completePhase: (phaseId, worldId, wordsFoundCount) => {
    const { completedPhases, xp, coins, stars, unlockedAchievements } = get();
    
    // Check if already completed
    const isNewWin = !completedPhases.includes(phaseId);
    let newCompleted = [...completedPhases];
    if (isNewWin) {
      newCompleted.push(phaseId);
    }

    // Award rewards
    const xpReward = isNewWin ? 150 : 20; // smaller reward if replaying
    const starReward = isNewWin ? 3 : 1;
    const coinReward = isNewWin ? 30 : 5;

    const nextXp = xp + xpReward;
    const nextStars = stars + starReward;
    const nextCoins = coins + coinReward;

    // Check achievements
    const newlyUnlocked: Achievement[] = [];
    const checkAndUnlock = (id: string) => {
      if (!unlockedAchievements.includes(id)) {
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
          newlyUnlocked.push(ach);
        }
      }
    };

    // Rule 1: First win
    if (newCompleted.length >= 1) {
      checkAndUnlock("first_win");
    }

    // Rule 2: 10 wins
    if (newCompleted.length >= 10) {
      checkAndUnlock("10_wins");
    }

    // Rule 3: 50 wins
    if (newCompleted.length >= 50) {
      checkAndUnlock("50_wins");
    }

    // Rule 4: Bible world master
    // World 1 has phases: m1-f1 to m1-f9
    const biblePhases = ["m1-f1", "m1-f2", "m1-f3", "m1-f4", "m1-f5", "m1-f6", "m1-f7", "m1-f8", "m1-f9"];
    const allBibleDone = biblePhases.every(p => newCompleted.includes(p));
    if (allBibleDone) {
      checkAndUnlock("bible_master");
    }

    // Rule 5: Animal world master
    // World 2 has phases m2-f1 to m2-f6
    const animalPhases = ["m2-f1", "m2-f2", "m2-f3", "m2-f4", "m2-f5", "m2-f6"];
    const allAnimalDone = animalPhases.every(p => newCompleted.includes(p));
    if (allAnimalDone) {
      checkAndUnlock("animal_master");
    }

    // Rule 6: World Traveler (World 3 and 4)
    // World 3 has 4 phases, World 4 has 3 phases
    const w3Phases = ["m3-f1", "m3-f2", "m3-f3", "m3-f4"];
    const w4Phases = ["m4-f1", "m4-f2", "m4-f3"];
    const allTravelDone = [...w3Phases, ...w4Phases].every(p => newCompleted.includes(p));
    if (allTravelDone) {
      checkAndUnlock("world_traveler");
    }

    // Rule 7: Supreme Hunter (World 10 completed)
    const w10Phases = ["m10-f1", "m10-f2", "m10-f3"];
    const allSupremeDone = w10Phases.every(p => newCompleted.includes(p));
    if (allSupremeDone) {
      checkAndUnlock("supreme_hunter");
    }

    const nextUnlocks = [...unlockedAchievements, ...newlyUnlocked.map(a => a.id)];

    const updatedState = {
      completedPhases: newCompleted,
      xp: nextXp,
      coins: nextCoins,
      stars: nextStars,
      unlockedAchievements: nextUnlocks
    };

    set(updatedState);

    // Save to localforage
    localforage.setItem('app_cacapalavras_progress', updatedState).catch(console.error);

    return { newAchievements: newlyUnlocked };
  },

  resetProgress: async () => {
    const fresh = {
      completedPhases: [],
      xp: 0,
      coins: 0,
      stars: 0,
      unlockedAchievements: []
    };
    set(fresh);
    await localforage.setItem('app_cacapalavras_progress', fresh);
  },

  hydrate: async () => {
    try {
      const saved = await localforage.getItem<CacaPalavrasProgress>('app_cacapalavras_progress');
      if (saved) {
        set({
          completedPhases: saved.completedPhases || [],
          xp: saved.xp || 0,
          coins: saved.coins || 0,
          stars: saved.stars || 0,
          unlockedAchievements: saved.unlockedAchievements || [],
          isHydrated: true
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (e) {
      console.error(e);
      set({ isHydrated: true });
    }
  }
}));
