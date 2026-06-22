import localforage from 'localforage';
import { create } from 'zustand';
import { QuizStats } from '../types/quiz';
import { achievements } from '../data/quizQuestions';

interface QuizState {
  stats: QuizStats;
  isDailyChallengePlayedToday: boolean;
  addAnswer: (
    isCorrect: boolean,
    category: string,
    difficulty: 'fácil' | 'médio' | 'difícil' | 'mestre'
  ) => { xpAwarded: number; coinsAwarded: number; newStreak: number; comboMultiplier: number };
  completeCategory: (category: string) => void;
  claimDailyChallenge: (isCorrect: boolean) => { xpAwarded: number; coinsAwarded: number };
  incrementTimePlayed: (seconds: number) => void;
  resetStats: () => Promise<void>;
  hydrate: () => Promise<void>;
  checkAchievements: () => string[]; // returns newly unlocked achievements titles
}

const defaultStats: QuizStats = {
  highScore: 0,
  experience: 0,
  coins: 0,
  streak: 0,
  maxStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  completedCategories: [],
  unlockedAchievements: [],
  lastPlayTime: Date.now(),
  timePlayed: 0,
  lastDailyChallengeDate: undefined
};

export const useQuizStore = create<QuizState>((set, get) => ({
  stats: { ...defaultStats },
  isDailyChallengePlayedToday: false,

  addAnswer: (isCorrect, category, difficulty) => {
    const { stats } = get();
    const currentStreak = isCorrect ? stats.streak + 1 : 0;
    
    // Combo multiplier logic
    let comboMultiplier = 1;
    if (isCorrect) {
      if (currentStreak >= 10) comboMultiplier = 5; // Combo x5 at 10+ streak
      else if (currentStreak >= 5) comboMultiplier = 3;  // Combo x3 at 5+ streak
      else if (currentStreak >= 3) comboMultiplier = 2;  // Combo x2 at 3+ streak
    }

    // Base values based on difficulty
    let baseXP = 10;
    let baseCoins = 5;
    if (difficulty === 'médio') { baseXP = 20; baseCoins = 10; }
    else if (difficulty === 'difícil') { baseXP = 35; baseCoins = 15; }
    else if (difficulty === 'mestre') { baseXP = 50; baseCoins = 25; }

    const xpAwarded = isCorrect ? baseXP * comboMultiplier : 0;
    const coinsAwarded = isCorrect ? baseCoins * comboMultiplier : 0;

    const newTotalAnswered = stats.totalAnswered + 1;
    const newTotalCorrect = isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect;
    const newMaxStreak = Math.max(stats.maxStreak, currentStreak);
    const newXP = stats.experience + xpAwarded;
    const newCoins = stats.coins + coinsAwarded;
    const newHighScore = Math.max(stats.highScore, newTotalCorrect * 10);

    const updatedStats: QuizStats = {
      ...stats,
      highScore: newHighScore,
      experience: newXP,
      coins: newCoins,
      streak: currentStreak,
      maxStreak: newMaxStreak,
      totalAnswered: newTotalAnswered,
      totalCorrect: newTotalCorrect,
      lastPlayTime: Date.now()
    };

    set({ stats: updatedStats });
    localforage.setItem('bible_quiz_stats', updatedStats);

    return { xpAwarded, coinsAwarded, newStreak: currentStreak, comboMultiplier };
  },

  completeCategory: (category) => {
    const { stats } = get();
    if (stats.completedCategories.includes(category)) return;

    const newCompleted = [...stats.completedCategories, category];
    
    // Reward for completing any category: +100 XP, +50 Coins
    const updatedStats: QuizStats = {
      ...stats,
      completedCategories: newCompleted,
      experience: stats.experience + 100,
      coins: stats.coins + 50
    };

    set({ stats: updatedStats });
    localforage.setItem('bible_quiz_stats', updatedStats);
  },

  claimDailyChallenge: (isCorrect) => {
    const { stats } = get();
    const todayStr = new Date().toISOString().split('T')[0];

    // Mega Reward for Daily Challenge: +100 XP, +50 Coins on correct answer.
    // Participated gets +20 XP anyway.
    const xpAwarded = isCorrect ? 150 : 20;
    const coinsAwarded = isCorrect ? 75 : 10;

    const updatedStats: QuizStats = {
      ...stats,
      experience: stats.experience + xpAwarded,
      coins: stats.coins + coinsAwarded,
      totalAnswered: stats.totalAnswered + 1,
      totalCorrect: isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
      lastDailyChallengeDate: todayStr
    };

    set({ stats: updatedStats, isDailyChallengePlayedToday: true });
    localforage.setItem('bible_quiz_stats', updatedStats);

    return { xpAwarded, coinsAwarded };
  },

  checkAchievements: () => {
    const { stats } = get();
    const newlyUnlocked: string[] = [];
    const currentUnlocked = [...stats.unlockedAchievements];

    // 1. Aprendiz Bíblico: 1 acerto
    if (!currentUnlocked.includes('aprendiz') && stats.totalCorrect >= 1) {
      currentUnlocked.push('aprendiz');
      newlyUnlocked.push('🥉 Aprendiz Bíblico');
    }

    // 2. Conhecedor das Escrituras: 30 acertos
    if (!currentUnlocked.includes('conhecedor') && stats.totalCorrect >= 30) {
      currentUnlocked.push('conhecedor');
      newlyUnlocked.push('🥈 Conhecedor das Escrituras');
    }

    // 3. Mestre Bíblico: complete any category
    if (!currentUnlocked.includes('mestre') && stats.completedCategories.length >= 1) {
      currentUnlocked.push('mestre');
      newlyUnlocked.push('🥇 Mestre Bíblico');
    }

    // 4. Rei do Conhecimento: streak of 15
    if (!currentUnlocked.includes('rei_conhecimento') && stats.maxStreak >= 15) {
      currentUnlocked.push('rei_conhecimento');
      newlyUnlocked.push('👑 Rei do Conhecimento');
    }

    // 5. Sábio de Israel: 1000+ XP
    if (!currentUnlocked.includes('sabio') && stats.experience >= 1000) {
      currentUnlocked.push('sabio');
      newlyUnlocked.push('🕊️ Sábio de Israel');
    }

    if (newlyUnlocked.length > 0) {
      // Calculate reward bonuses for unlocked ones
      let totalXpBonus = 0;
      let totalCoinBonus = 0;
      
      newlyUnlocked.forEach(title => {
        const matchingReward = achievements.find(a => a.title === title);
        if (matchingReward) {
          totalXpBonus += matchingReward.xpReward;
          totalCoinBonus += matchingReward.coinReward;
        }
      });

      const updatedStats: QuizStats = {
        ...stats,
        unlockedAchievements: currentUnlocked,
        experience: stats.experience + totalXpBonus,
        coins: stats.coins + totalCoinBonus
      };

      set({ stats: updatedStats });
      localforage.setItem('bible_quiz_stats', updatedStats);
    }

    return newlyUnlocked;
  },

  incrementTimePlayed: (seconds) => {
    const { stats } = get();
    const updatedStats = {
      ...stats,
      timePlayed: stats.timePlayed + seconds
    };
    set({ stats: updatedStats });
  },

  resetStats: async () => {
    set({ stats: { ...defaultStats }, isDailyChallengePlayedToday: false });
    await localforage.removeItem('bible_quiz_stats');
  },

  hydrate: async () => {
    const storedStats = await localforage.getItem<QuizStats>('bible_quiz_stats');
    if (storedStats) {
      const todayStr = new Date().toISOString().split('T')[0];
      const hasPlayedDaily = storedStats.lastDailyChallengeDate === todayStr;
      
      set({ 
        stats: storedStats, 
        isDailyChallengePlayedToday: hasPlayedDaily 
      });
    }
  }
}));
