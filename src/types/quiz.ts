export interface QuizQuestion {
  id: number;
  category: string;
  difficulty: 'fácil' | 'médio' | 'difícil' | 'mestre';
  question: string;
  options: string[];
  answerIndex: number; // 0 to 3
  explanation: string;
  verse: string;
}

export interface QuizStats {
  highScore: number;
  experience: number;
  coins: number;
  streak: number;
  maxStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  completedCategories: string[];
  unlockedAchievements: string[];
  lastPlayTime: number;
  timePlayed: number; // in seconds
  lastDailyChallengeDate?: string; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  requirement: string;
}
