import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Lightbulb, Star, ChevronRight, Leaf, Play, BookOpen, Brain, Sparkles, Heart, FileText } from 'lucide-react';
import { useCacaPalavrasStore } from '../store/useCacaPalavrasStore';

const verses = [
  { img: "https://www.heroesbibletrivia.org/wp-content/uploads/2021/01/facebook.jpg", title: "Game Store Bible", subtitle: "Bem-vindo ao acervo cristão" },
  { img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800", title: "Amor de Deus", subtitle: "João 3:16" },
  { img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800", title: "O Bom Pastor", subtitle: "Salmos 23:1" }
];

const games = [
  {
    id: 1,
    title: "King David 2D",
    subtitle: "Derrube os leões e proteja as ovelhas",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuvFaeyJExAWE0M2434mXzDOhPMsEAH85cA&s",
    rating: "4.8",
    action: "https://ais-dev-y73d54wnkuw2j76fdnnou4-111465990999.us-east1.run.app/"
  },
  {
    id: 2,
    title: "King David 3D",
    subtitle: "Ação em terceira pessoa como o Rei de Israel",
    rating: "4.9",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRceIN3FTl_2bk9ZVs-mrfbPs0HMeDdyIA1iUI0H414oA&s",
    action: "https://king-david3d.vercel.app/"
  }
];

export function StoreFront() {
  const navigate = useNavigate();
  const { completedPhases } = useCacaPalavrasStore();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const completedCount = completedPhases.length;

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting('Bom dia');
    else if (hr < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(d.toLocaleDateString('pt-BR', options));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % verses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (action: string) => {
    if (action === 'bible') {
      navigate('/bible');
    } else if (action === 'word_of_day') {
      navigate('/word-of-the-day');
    } else if (action === 'caca_palavras') {
      navigate('/caca-palavras');
    } else if (action === 'plan') {
      navigate('/bible/plan');
    } else if (action === 'favorites') {
      navigate('/bible/favorites');
    } else if (action === 'ai-hub') {
      navigate('/bible/ai-hub');
    } else if (action === 'quiz') {
      navigate('/bible/ai-hub');
    } else if (action.startsWith('http')) {
      window.location.href = action;
    } else {
      alert('Em breve!');
    }
  };

  const shareIdea = () => {
    const feedbackText = 'Olá! Tive uma ideia brilhante para melhorar o app Game Store Bible:\n\n[Sua ideia aqui]\n\nBaixe o app: https://gamestorebiblico.netlify.app/';
    if (navigator.share) {
      navigator.share({ title: 'Ideia - Game Store Bible', text: feedbackText }).catch(console.error);
    } else {
      navigator.clipboard.writeText(feedbackText);
      alert('Texto copiado!\nCole na sua rede social.');
    }
  };

  return (
    <div className="antialiased min-h-screen bg-[#0B1220] text-white relative overflow-hidden font-sans">
      {/* Modern Glowing Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/15 opacity-60 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#F59E0B]/10 opacity-40 blur-[110px]"></div>
        <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 opacity-50 blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto h-full flex flex-col">
        {/* Modern Top Header */}
        <header className="flex justify-between items-center px-6 pt-10 pb-6 gap-3">
          <div className="flex items-center gap-3 col-span-2">
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/donb73jnb/image/upload/v1777405912/leaodatribo_sq5riz.jpg" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-transform" 
                alt="Profile" 
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22C55E] border-2 border-[#0B1220] rounded-full"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{currentDate}</span>
              <h2 className="text-white text-md font-extrabold tracking-tight leading-tight">{greeting}, 👋</h2>
              <p className="text-[#94A3B8] text-[11px] font-semibold">Inicie sua jornada hoje!</p>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={shareIdea}
              className="w-9 h-9 rounded-full bg-[#172033]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/95 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] transition-all shadow-md active:scale-95"
              title="Compartilhar Feedback"
            >
              <Lightbulb size={16} />
            </button>
            <button className="relative w-9 h-9 rounded-full bg-[#172033]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/95 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] transition-all shadow-md active:scale-95">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] border-[2px] border-[#172033] rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-32 space-y-8">
          {/* Main Hero Card (Premium Banner style) */}
          <section className="px-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="relative h-[160px] w-full rounded-[24px] overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.18)] border border-white/20 flex flex-col group cursor-pointer"
              >
                <img src={verses[currentBanner].img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" alt="Hero" />
                {/* Modern Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent"></div>
                
                {/* Content Details */}
                <div className="absolute bottom-0 left-0 w-full px-5 pb-5 pt-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider bg-[#F59E0B] text-[#0B1220] mb-2 uppercase">
                    DESTAQUE
                  </span>
                  <h2 className="text-white text-lg font-extrabold tracking-tight mb-0.5 drop-shadow-md">
                    {verses[currentBanner].title}
                  </h2>
                  <p className="text-[#94A3B8] text-[11px] font-semibold opacity-95 leading-normal max-w-md line-clamp-1">
                    {verses[currentBanner].subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-3 gap-1.5">
              {verses.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-5 bg-[#3B82F6]' : 'w-1 bg-white/20'}`}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* SECTION: PREMIUM FEATURE - CAÇA PALAVRAS (DUOLINGO MAP CARD) */}
          <section className="px-6">
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className="text-white text-md font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>🎮</span> Jogos Bíblicos e Desafios
              </h2>
              <span className="text-[10px] text-[#3B82F6] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/15">GAMIFICAÇÃO</span>
            </div>

            {/* Featured word search card layout */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick('caca_palavras')}
              className="relative rounded-[24px] bg-gradient-to-br from-[#172033] to-[#0F172A] border border-white/10 p-5 overflow-hidden shadow-2xl cursor-pointer group flex items-center justify-between gap-4"
            >
              {/* Internal abstract shine decoration */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-[#f59e0b]/10 blur-2xl group-hover:bg-[#f59e0b]/15 transition-all pointer-events-none" />
              
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] rounded-md tracking-widest animate-pulse">NOVO</span>
                  <span className="text-[10px] text-[#94A3B8] font-bold">Jogo Exclusivo</span>
                </div>
                
                <h3 className="text-white text-lg font-black tracking-tight flex items-center gap-1.5 group-hover:text-[#3B82F6] transition-colors">
                  Caça-Palavras 🔎
                </h3>
                <p className="text-[#94A3B8] text-[11px] font-semibold leading-relaxed mt-1 mb-4 pr-4">
                  Encontre palavras sagradas ocultas, complete desafios e desvende novos mundos!
                </p>

                {/* Progress bar container */}
                <div className="space-y-1.5 max-w-xs">
                  <div className="flex justify-between text-[9px] font-bold tracking-wider uppercase text-[#94A3B8]">
                    <span>Fases Concluídas</span>
                    <span className="text-[#F59E0B] font-black">{completedCount} / 50</span>
                  </div>
                  <div className="h-2 bg-[#0B1220] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#3B82F6] to-[#F59E0B] transition-all duration-[1s]" 
                      style={{ width: `${Math.min(100, Math.round((completedCount / 50) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Big play action button */}
              <button className="w-12 h-12 rounded-2xl bg-[#3B82F6] group-hover:bg-[#2563EB] text-[#0B1220] group-hover:text-white flex items-center justify-center shrink-0 border border-[#3B82F6]/50 shadow-lg shadow-[#3B82F6]/25 transform group-hover:scale-105 transition-all">
                <Play size={16} className="fill-current ml-0.5" />
              </button>
            </motion.div>
          </section>

          {/* SECTION: ARCADES AND OTHER OFFERS */}
          <section className="px-6">
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className="text-[#94A3B8] text-[10px] font-extrabold uppercase tracking-widest">Outros Jogos de Ação</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              {games.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => handleCardClick(g.action)}
                  className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[20px] p-3.5 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] active:scale-[0.96] group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] scale-90 z-10 border border-[#F59E0B]/10">
                    <Star size={10} className="fill-[#F59E0B] shrink-0" />
                    <span className="text-[9px] font-bold">{g.rating}</span>
                  </div>

                  <div>
                    {/* Thumbnail */}
                    <div className="w-[42px] h-[42px] rounded-[10px] overflow-hidden shrink-0 bg-[#0B1220]/50 border border-white/5 mb-3.5">
                      <img src={g.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={g.title} />
                    </div>

                    <h3 className="text-white font-extrabold text-[13.5px] tracking-tight truncate leading-tight">{g.title}</h3>
                    <p className="text-[#94A3B8] text-[10px] leading-snug line-clamp-2 mt-1">
                      {g.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] text-[#3B82F6] font-bold group-hover:underline flex items-center gap-0.5">
                      Jogar <ChevronRight size={10} strokeWidth={3} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: RECURSOS E JORNADA ESPIRITUAL (GRID) */}
          <section className="px-6">
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className="text-white text-md font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>📖</span> Atividades e Estudos
              </h2>
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">RECURSOS</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Bíblia Sagrada */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('bible')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-[#3B82F6]/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Bíblia Sagrada</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Leitura offline completa e fluida.</p>
                </div>
              </motion.div>

              {/* Card 2: Versículo do Dia */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('word_of_day')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-[#F59E0B]/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <Leaf size={18} className="text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Versículo do Dia</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Leia uma mensagem inspiradora diária.</p>
                </div>
              </motion.div>

              {/* Card 3: Quiz Bíblico */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('quiz')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-[#8B5CF6]/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <Brain size={18} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Quiz Bíblico</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Teste seus conhecimentos com a IA.</p>
                </div>
              </motion.div>

              {/* Card 4: Plano de Leitura */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('plan')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-emerald-500/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Plano de Leitura</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Acompanhe e registre seu avanço.</p>
                </div>
              </motion.div>

              {/* Card 5: Favoritos */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('favorites')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-[#EC4899]/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <Heart size={18} className="text-[#EC4899] fill-[#EC4899]/10" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Favoritos</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Consulte seus versículos prediletos.</p>
                </div>
              </motion.div>

              {/* Card 6: Assistente Bíblico IA */}
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick('ai-hub')}
                className="bg-[#172033]/70 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[22px] p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[135px] relative overflow-hidden group"
              >
                <div className="absolute right-[-15px] top-[-10px] w-20 h-20 rounded-full bg-amber-500/5 blur-xl pointer-events-none"></div>
                <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-[14px]">Assistente IA</h3>
                  <p className="text-[#94A3B8] text-[10px] leading-normal mt-0.5">Explicações inteligentes e estudos.</p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
