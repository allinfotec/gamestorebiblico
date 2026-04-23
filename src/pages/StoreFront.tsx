import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const verses = [
  { img: "https://www.heroesbibletrivia.org/wp-content/uploads/2021/01/facebook.jpg", text: "Bem-vindo ao Game Store Bible!" },
  { img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800", text: '"Porque Deus amou o mundo de tal maneira..." - João 3:16' },
  { img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800", text: '"O Senhor é o meu pastor; de nada me faltará." - Salmos 23:1' }
];

const games = [
  {
    id: 1,
    title: "King david 2D",
    subtitle: "Jogo do Jovem David\nderrotando os bichos\npara proteger as\novelha",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuvFaeyJExAWE0M2434mXzDOhPMsEAH85cA&s",
    rating: "4.8",
    action: "https://ais-dev-y73d54wnkuw2j76fdnnou4-111465990999.us-east1.run.app/"
  },
  {
    id: 2,
    title: "King David 3D",
    subtitle: "Jogo do Jovem David\nderrotando os bichos\npara proteger as\novelha",
    rating: "4.9",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRceIN3FTl_2bk9ZVs-mrfbPs0HMeDdyIA1iUI0H414oA&s",
    action: "https://king-david3d.vercel.app/"
  },
  {
    id: 3,
    title: "Biblia Sagrada",
    subtitle: "Deus tem uma palavras\npra você!",
    rating: "4.7",
    img: "https://santapalavra.com/wp-content/uploads/2017/03/cropped-Icone-Biblia-1.png",
    action: "bible"
  },
  {
    id: 4,
    title: "Palavra do Dia",
    subtitle: "Deus tem uma palavras\npra você!",
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
    }, 4500);
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

  return (
    <div className="antialiased pb-24 relative overflow-x-hidden min-h-screen bg-gradient-to-br from-[#310A3B] via-[#0D0B1A] to-[#040209]">
      {/* TopAppBar with Modern Wave */}
      <header className="fixed top-0 left-0 w-full z-50 drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] flex flex-col backdrop-blur-md">
        <div className="flex justify-between items-center px-6 h-24 pb-6 pt-2 bg-white/80">
          <div className="w-10"></div> {/* Spacer to keep title centered */}
          <div className="text-3xl sm:text-4xl font-black font-[Orbitron] tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-[#2C0A18] via-[#4A1128] to-[#781B3B] drop-shadow-sm">
            Game Store Bible
          </div>
          <button 
            onClick={() => {
              const shareText = 'Deus abençoe sua vida, Nós ajude levar para mais pessoas!\nhttps://gamestorebiblico.netlify.app/';
              if (navigator.share) {
                navigator.share({
                  title: 'Game Store Bible',
                  text: 'Deus abençoe sua vida, Nós ajude levar para mais pessoas!',
                  url: 'https://gamestorebiblico.netlify.app/'
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Mensagem e link copiados!\n' + shareText);
              }
            }}
            className="text-[#6B1B3A] hover:text-[#D14D72] hover:scale-110 active:scale-95 transition-all p-1"
          >
            <span className="material-symbols-outlined text-[34px] sm:text-[40px]">share</span>
          </button>
        </div>
        {/* SVG Wave Divider */}
        <div className="w-full relative pointer-events-none flex flex-col overflow-hidden">
          <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-[200%] h-16 sm:h-24 block animate-wave" style={{ fill: "rgba(255, 255, 255, 0.80)" }}>
            <path d="M 0,0 L 0,60 C 100,120 150,120 250,60 C 350,0 400,0 500,60 C 600,120 650,120 750,60 C 850,0 900,0 1000,60 L 1000,0 Z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-40 sm:pt-48 px-6 w-full max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative mb-12">
          <div className="w-full h-80 organic-shape relative overflow-hidden flex items-center justify-center bg-white/20 backdrop-blur-md border-2 border-white shadow-[inset_0_2px_15px_rgba(255,255,255,0.3),_0_0_25px_rgba(255,255,255,0.5)] perspective-[1000px]">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-8 w-6 h-6 bg-rose-900/10 rounded-full blur-[2px] z-0"></div>
            <div className="absolute bottom-8 right-12 w-8 h-8 bg-rose-900/10 rounded-full blur-[4px] z-0"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
              >
                {/* Main 3D Hero Image (Floating) */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-56 h-56 md:w-60 md:h-60 bg-cover bg-center drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] mb-4 shrink-0 pointer-events-none" 
                  style={{ backgroundImage: `url("${verses[currentBanner].img}")`, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                />
                {/* Text Verse */}
                <p className="text-center text-white/95 font-serif font-medium text-[14px] md:text-[15px] drop-shadow-md leading-relaxed px-2">
                  {verses[currentBanner].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Page Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {verses.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentBanner ? 'w-6 bg-[#4e0224]' : 'w-1.5 bg-[#ffb1c6]'}`}
              ></div>
            ))}
          </div>
        </section>

        {/* Product Grid Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[32px] leading-[1.2] font-bold text-white font-sans">Seleção</h2>
          
          {/* Feedback / Idea Button */}
          <button
            onClick={() => {
              const feedbackText = 'Olá! Tive uma ideia brilhante para melhorar o app Game Store Bible e seus jogos:\n\n[Escreva sua ideia aqui]\n\nBaixe o app e veja as novidades: https://gamestorebiblico.netlify.app/';
              if (navigator.share) {
                navigator.share({
                  title: 'Sugestão - Game Store Bible',
                  text: feedbackText,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(feedbackText);
                alert('Texto de feedback copiado!\nCole na sua rede social ou envie para nós.\n\n' + feedbackText);
              }
            }}
            className="w-11 h-11 bg-white/10 hover:bg-[#D14D72]/80 backdrop-blur-md border border-white/30 rounded-[14px] flex items-center justify-center text-white shadow-lg transition-all active:scale-90"
            title="Compartilhar Feedback ou Ideia"
          >
            <span className="material-symbols-outlined text-[26px]">lightbulb</span>
          </button>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-2 gap-4 pb-8">
          {games.map((g, index) => (
            <div key={g.id} onClick={() => handleCardClick(g.action)} className="bg-white/5 backdrop-blur-md rounded-[1rem] p-3 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] flex flex-col h-full cursor-pointer transition-transform hover:bg-white/10 active:scale-95 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]">
              <div className="w-full h-32 rounded-[1rem] overflow-hidden mb-3 bg-black/20 shrink-0">
                <img alt={g.title} className="w-full h-full object-cover" src={g.img} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-1 truncate">{g.title}</h3>
              <div className="text-[12px] font-medium text-gray-300 mb-2 leading-tight">
                {g.subtitle.split('\n').map((line, i) => (
                   <div key={i}>{line}</div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/10">
                <span className="text-[18px] font-semibold text-white"><br/></span>
                <div className="flex items-center text-[#fe9e66]">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="text-[12px] font-medium ml-1 text-gray-200">{g.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
