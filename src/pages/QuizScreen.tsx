import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Sparkles, 
  Timer, 
  Check, 
  X, 
  ChevronLeft, 
  Play, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Zap, 
  BookOpen, 
  Crown,
  Heart,
  Brain
} from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { allQuestions, categories, difficulties, achievements } from '../data/quizQuestions';
import { QuizQuestion } from '../types/quiz';

type GameState = 'lobby' | 'selecting_level' | 'playing' | 'daily_challenge' | 'results';

export function QuizScreen() {
  const { 
    stats, 
    isDailyChallengePlayedToday, 
    addAnswer, 
    completeCategory, 
    claimDailyChallenge, 
    incrementTimePlayed, 
    checkAchievements, 
    hydrate,
    resetStats
  } = useQuizStore();

  const [gameState, setGameState] = useState<GameState>('lobby');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'fácil' | 'médio' | 'difícil' | 'mestre' | null>(null);
  
  // Game session states
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [sessionCoinsEarned, setSessionCoinsEarned] = useState(0);
  const [unlockedInSession, setUnlockedInSession] = useState<string[]>([]);
  const [activeComboMultiplier, setActiveComboMultiplier] = useState(1);
  const [activeStreak, setActiveStreak] = useState(0);
  
  // Confetti/Particle helper state
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  // Daily Challenge state
  const [dailyQuestion, setDailyQuestion] = useState<QuizQuestion | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from hydration on mounting
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Track active gameplay time (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState === 'playing' || gameState === 'daily_challenge') {
        incrementTimePlayed(5);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [gameState, incrementTimePlayed]);

  // Set today's daily question deterministically
  useEffect(() => {
    const today = new Date();
    const todayHash = (today.getDate() + today.getMonth() * 31 + today.getFullYear()) % allQuestions.length;
    setDailyQuestion(allQuestions[todayHash]);
  }, []);

  // Timer countdown
  useEffect(() => {
    if ((gameState === 'playing' || gameState === 'daily_challenge') && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSelectAnswer(-1); // consider as timeout/incorrect
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswered, currentQuestionIndex]);

  const triggerParticles = (isCorrect: boolean) => {
    const colors = isCorrect 
      ? ['#22C55E', '#4ADE80', '#10B981', '#34D399', '#F59E0B'] 
      : ['#EF4444', '#F87171', '#F59E0B'];
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
      y: Math.random() * -80 - 20,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1800);
  };

  const startQuiz = (category: string, difficulty: 'fácil' | 'médio' | 'difícil' | 'mestre') => {
    // Filter questions matching chosen category and difficulty
    let filtered = allQuestions.filter(
      q => q.category === category && q.difficulty === difficulty
    );

    // Shuffle questions
    filtered = [...filtered].sort(() => Math.random() - 0.5);

    // Select max 10 questions for the round
    const roundQuestions = filtered.slice(0, 10);

    if (roundQuestions.length === 0) {
      alert("Nenhuma pergunta encontrada para esta combinação.");
      return;
    }

    setCurrentQuestions(roundQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setTimeLeft(difficulty === 'mestre' ? 15 : difficulty === 'difícil' ? 20 : 25);
    setSessionCorrectCount(0);
    setSessionXpEarned(0);
    setSessionCoinsEarned(0);
    setUnlockedInSession([]);
    setActiveStreak(stats.streak);
    setActiveComboMultiplier(1);
    setGameState('playing');
  };

  const handleStartDailyChallenge = () => {
    if (isDailyChallengePlayedToday) {
      alert("Você já jogou a Pergunta do Dia hoje! Volte amanhã.");
      return;
    }
    if (!dailyQuestion) return;

    setCurrentQuestions([dailyQuestion]);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setTimeLeft(20);
    setSessionCorrectCount(0);
    setSessionXpEarned(0);
    setSessionCoinsEarned(0);
    setUnlockedInSession([]);
    setGameState('daily_challenge');
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswerIndex(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestions[currentQuestionIndex].answerIndex;
    triggerParticles(isCorrect);

    if (gameState === 'daily_challenge') {
      const { xpAwarded, coinsAwarded } = claimDailyChallenge(isCorrect);
      setSessionCorrectCount(isCorrect ? 1 : 0);
      setSessionXpEarned(xpAwarded);
      setSessionCoinsEarned(coinsAwarded);
      
      // Look for new achievements
      setTimeout(() => {
        const newlyUnlocked = checkAchievements();
        if (newlyUnlocked.length > 0) {
          setUnlockedInSession(newlyUnlocked);
        }
      }, 500);
      return;
    }

    // Standard game answers
    const difficultyStr = currentQuestions[currentQuestionIndex].difficulty as 'fácil' | 'médio' | 'difícil' | 'mestre';
    const { xpAwarded, coinsAwarded, newStreak, comboMultiplier } = addAnswer(
      isCorrect, 
      currentQuestions[currentQuestionIndex].category, 
      difficultyStr
    );

    if (isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
    }
    
    setSessionXpEarned((prev) => prev + xpAwarded);
    setSessionCoinsEarned((prev) => prev + coinsAwarded);
    setActiveStreak(newStreak);
    setActiveComboMultiplier(comboMultiplier);

    // Look for new achievements
    setTimeout(() => {
      const newlyUnlocked = checkAchievements();
      if (newlyUnlocked.length > 0) {
        setUnlockedInSession(prev => [...prev, ...newlyUnlocked]);
      }
    }, 500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      const diff = selectedDifficulty || 'fácil';
      setTimeLeft(diff === 'mestre' ? 15 : diff === 'difícil' ? 20 : 25);
    } else {
      // Finished all questions in the round!
      if (selectedCategory && sessionCorrectCount === currentQuestions.length) {
        // Complete the category if they answered all correctly
        completeCategory(selectedCategory);
      }
      setGameState('results');
    }
  };

  // UI calculations
  const totalCorrectPercent = stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-[#0B1220] text-white overflow-hidden font-sans">
      
      {/* GLOWING ORBS CHERISHED INTEGRITY */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#10B981]/10 blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/10 blur-[100px] opacity-70"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* TRANSITIONAL RENDER STATES */}
        <AnimatePresence mode="wait">

          {/* 1. LOBBY SCREEN (TELA INICIAL) */}
          {gameState === 'lobby' && (
            <motion.div 
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <header className="px-6 pt-10 pb-6 bg-[#172033]/45 border-b border-white/5 backdrop-blur-xl rounded-b-[32px] shrink-0 relative overflow-hidden">
                <div className="absolute top-[-20px] left-[-20px] w-20 h-20 rounded-full bg-emerald-500/10 blur-xl"></div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <Brain className="text-emerald-400" size={26} /> Quiz Bíblico Premium
                  </h1>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-widest animate-pulse">
                    Mente Ativa
                  </span>
                </div>
                <p className="text-xs font-semibold pl-1 text-slate-400 max-w-sm">
                  Teste seus conhecimentos, decifre as Sagradas Escrituras de forma lúdica.
                </p>
              </header>

              <div className="flex-1 overflow-y-auto px-6 pt-6 pb-36 space-y-7 no-scrollbar">

                {/* STATISTICS GRID */}
                <section>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1.5 h-5 rounded-full bg-emerald-500"></div>
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Seu Desempenho</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <div className="bg-[#172033]/80 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                        <Trophy size={18} className="text-[#F59E0B]" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 font-mono">PONTUAÇÃO MÁXIMA</span>
                        <span className="text-md font-extrabold">{stats.highScore} <span className="text-[10px] text-slate-400">pts</span></span>
                      </div>
                    </div>

                    <div className="bg-[#172033]/80 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Sparkles size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 font-mono">XP ACUMULADO</span>
                        <span className="text-md font-extrabold text-purple-300">{stats.experience} <span className="text-[10px] text-slate-400">XP</span></span>
                      </div>
                    </div>

                    <div className="bg-[#172033]/80 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <Star size={18} className="text-amber-400" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 font-mono">MOEDAS</span>
                        <span className="text-md font-extrabold text-amber-300">{stats.coins} <span className="text-[10px] text-slate-500">🪙</span></span>
                      </div>
                    </div>

                    <div className="bg-[#172033]/80 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <Zap size={18} className="text-red-400" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 font-mono">SEQUÊNCIA ACERTO</span>
                        <span className="text-md font-extrabold text-red-300">🔥 {stats.maxStreak} <span className="text-[10px] text-slate-500">max</span></span>
                      </div>
                    </div>

                  </div>

                  <div className="mt-3 bg-[#172033]/60 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-1">🎯 Precisão de Resposta:</span>
                    <span className="text-emerald-400 font-black tracking-wider text-sm">{totalCorrectPercent}%</span>
                  </div>
                </section>

                {/* DAILY CHALLENGE CHERISHED ROW */}
                <section>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1.5 h-5 rounded-full bg-amber-400"></div>
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Desafio Diário</h2>
                  </div>

                  <div className="p-4 rounded-[22px] border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-[#172033]/90 to-amber-500/5 relative overflow-hidden flex flex-col gap-3">
                    <div className="absolute top-[-10px] right-[-10px] w-14 h-14 bg-amber-500/10 blur-xl"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-1.5 py-0.5 text-[8px] font-black tracking-widest rounded bg-amber-500 text-slate-950 uppercase">MEGA PRÊMIO</span>
                        <h3 className="font-extrabold text-sm text-white mt-1">A Pergunta do Dia 🌟</h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] font-bold text-amber-400 font-mono">+150 XP</span>
                        <span className="text-[9px] font-bold text-slate-400 font-mono">+75 Moedas</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Responda à questão especial de hoje! Apenas uma tentativa diária disponível.
                    </p>

                    {isDailyChallengePlayedToday ? (
                      <div className="mt-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-3 text-xs text-emerald-400 font-bold justify-center">
                        <Check size={16} /> Você já concluiu o desafio premiado de hoje!
                      </div>
                    ) : (
                      <button
                        onClick={handleStartDailyChallenge}
                        className="mt-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play size={12} className="fill-current" /> Desafiar Agora
                      </button>
                    )}
                  </div>
                </section>

                {/* CATEGORIES COLLECTION LIST */}
                <section>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 rounded-full bg-blue-500"></div>
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Estudos por Categoria</h2>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 font-mono">10 SELEÇÕES</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => {
                      const isCompleted = stats.completedCategories.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setGameState('selecting_level');
                          }}
                          className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                            isCompleted 
                              ? 'bg-emerald-950/10 border-emerald-500/30 hover:bg-emerald-950/20' 
                              : 'bg-[#172033]/80 border-white/5 hover:border-emerald-500/20 hover:bg-[#1C2841]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl shrink-0">{cat.name.split(' ')[0]}</span>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-sm truncate">{cat.name.substring(cat.name.indexOf(' ') + 1)}</h3>
                              <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{cat.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted && (
                              <span className="px-1.5 py-0.5 text-[8px] font-black text-emerald-400 rounded bg-emerald-500/15 border border-emerald-500/25 tracking-wider font-mono">
                                CONCLUÍDO
                              </span>
                            )}
                            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
                              <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-400" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ACHIEVEMENTS BLOCK (CONQUISTAS) */}
                <section>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 rounded-full bg-purple-500"></div>
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Insígnias e Conquistas</h2>
                    </div>
                    <span className="text-[9px] font-black text-purple-400 font-mono">
                      {stats.unlockedAchievements.length} / {achievements.length} UNLOCKED
                    </span>
                  </div>

                  <div className="bg-[#172033]/40 border border-white/5 p-4 rounded-[22px] space-y-3.5">
                    {achievements.map((ach) => {
                      const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                      return (
                        <div 
                          key={ach.id}
                          className={`flex items-start gap-3.5 p-3 rounded-xl border transition-colors ${
                            isUnlocked 
                              ? 'bg-purple-950/10 border-purple-500/20' 
                              : 'bg-black/20 border-white/5 opacity-60'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isUnlocked 
                              ? 'bg-purple-500/10 border-purple-500/25 text-purple-300' 
                              : 'bg-white/5 border-white/5 text-slate-500'
                          }`}>
                            {ach.id === 'sabio' ? <Crown size={20} /> : <Award size={20} />}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 justify-between">
                              <h3 className="font-extrabold text-xs">{ach.title}</h3>
                              <span className="text-[8px] font-extrabold text-[#F59E0B] bg-[#F59E0B]/5 border border-[#F59E0B]/20 py-0.5 px-1.5 rounded tracking-wide font-mono">
                                +{ach.xpReward} XP
                              </span>
                            </div>
                            <p className="text-[9.5px] font-semibold text-slate-400 mt-1 leading-snug">{ach.description}</p>
                            <span className="block text-[8px] font-extrabold text-slate-500 mt-1 uppercase font-mono tracking-wider">
                              REQUISITO: {ach.requirement}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ADVANCED ADMIN UTILITY: RESET PROGRESS */}
                <section className="pt-4 text-center">
                  <button 
                    onClick={() => {
                      if (confirm("Deseja realmente apagar todo seu progresso, pontuações e conquistas do Quiz?")) {
                        resetStats().then(() => alert("Estatísticas redefinidas com sucesso!"));
                      }
                    }}
                    className="text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Redefinir Progresso do Quiz
                  </button>
                </section>

              </div>
            </motion.div>
          )}

          {/* 2. LEVEL SELECTOR POPUP/VIEW */}
          {gameState === 'selecting_level' && (
            <motion.div 
              key="selecting_level"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto px-6 pt-10 pb-36 space-y-8 no-scrollbar"
            >
              {/* Card Header Back */}
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => setGameState('lobby')}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-emerald-400 tracking-widest font-mono uppercase">SELEÇÃO DE DIFICULDADE</span>
                  <h1 className="text-lg font-black tracking-tight underline-offset-4 decoration-emerald-500 line-clamp-1">
                    Categoria: {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name.split(' ').slice(1).join(' ') : ''}
                  </h1>
                </div>
              </div>

              {/* Levels Description */}
              <p className="text-xs text-slate-400 font-semibold leading-relaxed pl-1">
                Escolha o nível de dificuldade ideal. Níveis superiores garantem maiores recompensas e combos agressivos de pontuação!
              </p>

              <div className="grid grid-cols-1 gap-4">
                {difficulties.map((diff) => {
                  const isMestre = diff.id === 'mestre';
                  return (
                    <motion.div
                      key={diff.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startQuiz(selectedCategory!, diff.id as any)}
                      className={`group p-5 rounded-[22px] border relative overflow-hidden transition-all duration-300 cursor-pointer ${
                        isMestre 
                          ? 'bg-gradient-to-br from-[#121B30] via-purple-950/20 to-[#0A0E1A] border-purple-500/30 hover:border-purple-500/50' 
                          : 'bg-[#172033]/80 border-white/5 hover:border-emerald-500/30'
                      }`}
                    >
                      {isMestre && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-black rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono tracking-widest uppercase">
                          Cobiçado
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2.5">
                        <h3 className="text-md font-extrabold tracking-tight flex items-center gap-1.5">
                          {diff.name}
                        </h3>
                        <div className="text-right">
                          <span className={`block text-[9.5px] font-bold font-mono ${isMestre ? 'text-purple-300' : 'text-emerald-400'}`}>+{diff.xpReward} XP por acerto</span>
                          <span className="text-[9px] font-bold text-amber-300 font-mono">+{diff.coinReward} moedas</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                        Série de {diff.count / 10} questões desafiadoras. {isMestre ? 'Tempo de 15s por resposta.' : 'Tempo flexível de 25s.'}
                      </p>

                      <div className="flex justify-end mt-3">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 text-slate-950 ${
                          isMestre 
                            ? 'bg-purple-400 shadow-lg shadow-purple-500/20' 
                            : 'bg-emerald-400 shadow-lg shadow-emerald-500/15'
                        }`}>
                          Começar <Play size={10} className="fill-current" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 3. GAMEPLAY SCREEN (PLAYING & DAILY CHALLENGE) */}
          {((gameState === 'playing' || gameState === 'daily_challenge') && currentQuestions.length > 0) && (
            <motion.div 
              key="gameplay"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              
              {/* Header Info */}
              <div className="px-6 pt-8 pb-4 bg-[#172033]/30 border-b border-white/5 backdrop-blur-md flex items-center justify-between shrink-0 relative">
                
                {/* Visual Feedback Particles absolute holder */}
                <div className="absolute top-0 left-1/2 w-0 h-0 overflow-visible pointer-events-none z-50">
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.4 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="absolute w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-[65%]">
                  <button 
                    onClick={() => {
                      if (confirm("Quer realmente abandonar a partida de Quiz em andamento? Todo progresso deste round será cancelado.")) {
                        setGameState('lobby');
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="min-w-0">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">
                      {gameState === 'daily_challenge' ? 'Desafio Especial do Dia' : categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                    <span className="block text-xs font-bold leading-tight truncate">
                      Questão {currentQuestionIndex + 1} de {currentQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Score / Timer stats */}
                <div className="flex items-center gap-3">
                  
                  {/* Timer Circular/Badge display */}
                  <div className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border ${
                    timeLeft <= 5 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse' 
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}>
                    <Timer size={13} />
                    <span className="text-xs font-mono font-bold">{timeLeft}s</span>
                  </div>

                  {/* Combo state */}
                  {activeComboMultiplier > 1 && (
                    <span className="px-2 py-1 bg-red-500 text-slate-950 text-[9px] font-black rounded-xl animate-bounce tracking-widest">
                      COMBO x{activeComboMultiplier} 🔥
                    </span>
                  )}
                </div>

              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 space-y-6 no-scrollbar flex flex-col justify-between">
                
                {/* Question Card */}
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                      DIFICULDADE: {currentQuestions[currentQuestionIndex].difficulty}
                    </span>
                    {activeStreak > 0 && (
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-0.5">
                        🔥 {activeStreak} acertos seguidos
                      </span>
                    )}
                  </div>

                  <h2 className="text-md sm:text-lg font-black leading-snug font-serif text-white tracking-tight border-l-2 border-emerald-500 pl-4 py-1">
                    {currentQuestions[currentQuestionIndex].question}
                  </h2>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {currentQuestions[currentQuestionIndex].options.map((option, i) => {
                    const isCorrectAnswer = i === currentQuestions[currentQuestionIndex].answerIndex;
                    const isSelected = i === selectedAnswerIndex;
                    
                    let btnStyle = 'bg-[#172033]/80 border-white/5 text-slate-300 hover:border-emerald-500/20 active:scale-98';
                    let iconNode = <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-xs text-slate-500 font-bold">{String.fromCharCode(65 + i)}</span>;

                    if (isAnswered) {
                      if (isCorrectAnswer) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                        iconNode = <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950"><Check size={11} strokeWidth={3} /></div>;
                      } else if (isSelected) {
                        btnStyle = 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                        iconNode = <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white"><X size={11} strokeWidth={3} /></div>;
                      } else {
                        btnStyle = 'bg-black/25 border-white/5 text-slate-600 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(i)}
                        className={`p-4 rounded-[20px] border flex items-center justify-between text-left gap-3.5 transition-all text-sm font-semibold cursor-pointer ${btnStyle}`}
                      >
                        <span className="flex-1 leading-normal pr-2">{option}</span>
                        {iconNode}
                      </button>
                    );
                  })}
                </div>

                {/* Visual Explanatory Card (Bottom Sheet look) */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 z-10"
                    >
                      <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest">
                        <span className={selectedAnswerIndex === currentQuestions[currentQuestionIndex].answerIndex ? 'text-emerald-400' : 'text-red-400'}>
                          {selectedAnswerIndex === currentQuestions[currentQuestionIndex].answerIndex ? '🎉 Resposta Correta!' : '❌ Ops, Resposta Errada'}
                        </span>
                        <span className="text-[#F59E0B] flex items-center gap-0.5"><BookOpen size={10} /> Referência</span>
                      </div>

                      <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                        {currentQuestions[currentQuestionIndex].explanation}
                      </p>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/5 py-0.5 px-1.5 rounded tracking-wide">
                          {currentQuestions[currentQuestionIndex].verse}
                        </span>

                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1 cursor-pointer"
                        >
                          Avançar <ArrowRight size={10} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}

          {/* 4. RESULTS DISPLAY SCREEN */}
          {gameState === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto px-6 pt-10 pb-36 space-y-8 no-scrollbar flex flex-col justify-center text-center"
            >
              <div className="space-y-6">
                
                {/* Icon Medal representation based on success percentage */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-[100px] h-[100px] rounded-full border border-emerald-500/30 bg-[#172033] flex items-center justify-center text-emerald-400 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                      {sessionCorrectCount >= 7 ? <Trophy size={46} className="text-[#F59E0B]" /> : <Award size={46} />}
                    </div>
                  </div>
                </div>

                {/* Congratulations titles */}
                <div className="space-y-2">
                  <h1 className="text-xl font-black font-serif">
                    {sessionCorrectCount === currentQuestions.length 
                      ? 'Desempenho Perfeito! 👑' 
                      : sessionCorrectCount >= 7 
                        ? 'Sensacional! 🌟' 
                        : 'Bom trabalho! 👍'}
                  </h1>
                  <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto">
                    Você venceu a série bíblica! Veja suas conquistas e recompensas adicionais.
                  </p>
                </div>

                {/* Score numbers summary */}
                <div className="relative rounded-[24px] bg-[#172033]/60 border border-white/5 p-5 space-y-4 max-w-sm mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center py-1">
                      <span className="block text-[8px] font-bold text-slate-400 font-mono tracking-widest">RESPOSTAS COMPLETAS</span>
                      <span className="text-lg font-extrabold text-white">{sessionCorrectCount} <span className="text-xs font-semibold text-slate-400">/ {currentQuestions.length}</span></span>
                    </div>

                    <div className="text-center py-1 border-l border-white/5">
                      <span className="block text-[8px] font-bold text-slate-400 font-mono tracking-widest">RECOMPENSA ACERTO</span>
                      <span className="text-lg font-extrabold text-[#F59E0B]">+{sessionXpEarned} <span className="text-xs font-semibold text-slate-400">XP</span></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Coins Won:</span>
                    <span className="text-amber-300 font-black flex items-center gap-0.5">+{sessionCoinsEarned} <span className="text-[10px]">🪙</span></span>
                  </div>
                </div>

                {/* New Achievements unlocked modal pop */}
                {unlockedInSession.length > 0 && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/25 rounded-2xl max-w-sm mx-auto text-left space-y-2 animate-bounce">
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 font-extrabold uppercase">
                      <Crown size={14} className="text-purple-400" /> Nova Insígnia Desbloqueada!
                    </div>
                    {unlockedInSession.map((tit, idx) => (
                      <p key={idx} className="text-xs font-black text-white">{tit}</p>
                    ))}
                    <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                      Bonus de XP e Moedas correspondentes adicionado à sua conta global.
                    </p>
                  </div>
                )}

                {/* Command actions */}
                <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                  <button
                    onClick={() => {
                      if (selectedCategory && selectedDifficulty) {
                        startQuiz(selectedCategory, selectedDifficulty);
                      } else {
                        setGameState('lobby');
                      }
                    }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={12} strokeWidth={2.5} /> Jogar Novamente
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedDifficulty(null);
                      setGameState('lobby');
                    }}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 active:scale-98 transition-all cursor-pointer"
                  >
                    Voltar ao Lobby do Quiz
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
