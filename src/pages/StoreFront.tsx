import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Lightbulb, Share2, Star, ChevronRight, Leaf } from 'lucide-react';

const verses = [
  { img: "https://www.heroesbibletrivia.org/wp-content/uploads/2021/01/facebook.jpg", title: "Game Store Bible", subtitle: "Bem-vindo ao acervo cristão" },
  { img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800", title: "Amor de Deus", subtitle: "João 3:16" },
  { img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800", title: "O Bom Pastor", subtitle: "Salmos 23:1" }
];

const games = [
  {
    id: 1,
    title: "King David 2D",
    subtitle: "Jogo do Jovem David derrotando leões para proteger as ovelhas",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuvFaeyJExAWE0M2434mXzDOhPMsEAH85cA&s",
    rating: "4.8",
    action: "https://ais-dev-y73d54wnkuw2j76fdnnou4-111465990999.us-east1.run.app/"
  },
  {
    id: 2,
    title: "King David 3D",
    subtitle: "Ação em terceira pessoa na pele do futuro Rei de Israel",
    rating: "4.9",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRceIN3FTl_2bk9ZVs-mrfbPs0HMeDdyIA1iUI0H414oA&s",
    action: "https://king-david3d.vercel.app/"
  },
  {
    id: 3,
    title: "Bíblia Sagrada",
    subtitle: "Leitura completa, offline e sem distrações",
    rating: "4.7",
    img: "https://santapalavra.com/wp-content/uploads/2017/03/cropped-Icone-Biblia-1.png",
    action: "bible"
  },
  {
    id: 4,
    title: "Palavra do Dia",
    subtitle: "Versículos diários em imagens de alta qualidade",
    rating: "4.9",
    img: "https://play-lh.googleusercontent.com/j8dybP1tS9XE9ktFzvMdN5UXd4DW8hmMvdjI-qCxgzrwtZgZ6o-A_RxyDhyX4mG1ifA",
    action: "word_of_day"
  }
];

export function StoreFront() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

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
    <div className="antialiased min-h-screen bg-[#071810] relative overflow-hidden font-sans">
      {/* Nature Blurred Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1A4231] opacity-60 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-20%] w-[400px] h-[400px] rounded-full bg-[#0D2E1F] opacity-80 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#113B26] opacity-70 blur-[90px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col">
        {/* Modern Top Header */}
        <header className="flex justify-between items-center px-5 sm:px-6 pt-12 pb-6 gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-1 text-[#4ADE80] opacity-90">
              <Leaf size={14} className="fill-[#4ADE80] shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-widest truncate">Início</span>
            </div>
            <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight truncate">Game Store Bible</h1>
          </div>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={shareIdea}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              <Lightbulb size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <Bell size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2.5 h-2.5 bg-[#4ADE80] border-[2px] border-[#071810] rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Main Hero Card (Plant App Style) */}
          <section className="mb-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden drop-shadow-xl">
                  <img src={verses[currentBanner].img} className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" alt="Hero" />
                  {/* Black gradient from bottom to middle */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/100 via-black/80 to-transparent"></div>
                  
                  {/* Content Details */}
                  <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-5">
                    <h2 className="text-white text-[28px] font-bold tracking-tight mb-1">
                      {verses[currentBanner].title}
                    </h2>
                    <p className="text-[#A7F3D0] text-[16px] font-medium opacity-90 leading-snug">
                      {verses[currentBanner].subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Elite Pagination Line Dots */}
            <div className="flex justify-center mt-6 gap-2.5">
              {verses.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === currentBanner ? 'w-8 bg-[#4ADE80]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </section>

          {/* Apps Layout */}
          <section className="px-6">
            <div className="flex justify-between items-end mb-6 px-1">
              <h2 className="text-white text-[22px] font-semibold tracking-tight">Explorar Ofertas</h2>
              <span className="text-[#4ADE80] opacity-90 text-[13px] font-bold uppercase tracking-wider cursor-pointer">Ver Mais</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {games.map((g) => {
                return (
                  <div 
                    key={g.id} 
                    onClick={() => handleCardClick(g.action)} 
                    className="col-span-1 flex-col group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-3.5 flex gap-4 cursor-pointer transition-all duration-300 hover:bg-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.6)] active:scale-[0.97]"
                  >
                    {/* Card Image */}
                    <div className="w-full h-[140px] rounded-[20px] overflow-hidden shrink-0 bg-[#0A1A12] relative">
                      <img src={g.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={g.title} />
                      
                      {/* Floating Rating On Image */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                        <Star size={10} className="text-[#FBBF24] fill-[#FBBF24]" />
                        <span className="text-white text-[10px] font-bold">{g.rating}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-white font-bold text-[16px] mb-1 leading-tight tracking-tight">{g.title}</h3>
                      <p className="text-[#A7F3D0]/70 text-[12px] leading-snug line-clamp-2 md:line-clamp-3 mb-3">
                        {g.subtitle}
                      </p>
                      
                      {/* Card Footer */}
                      <div className="flex justify-between items-center mt-auto">
                        <div /> {/* Spacer for small cards if rating is overlay */}
                        
                        <button className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white group-hover:bg-[#4ADE80] group-hover:border-[#4ADE80] group-hover:text-[#071810] transition-colors">
                          <ChevronRight size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
