import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Gamepad2, Menu, Bell, User, Share2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const verses = [
  { img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800", text: "O Senhor é o meu pastor; de nada terei falta. - Salmos 23:1", url: "https://gamestorebiblia.netlify.app/" },
  { img: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80&w=800", text: "Tudo posso naquele que me fortalece. - Filipenses 4:13", url: "https://gamestorebiblia.netlify.app/" },
  { img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800", text: "Porque Deus amou o mundo de tal maneira... - João 3:16", url: "https://gamestorebiblia.netlify.app/" }
];

const games = [
  {
    id: 1,
    title: "King David",
    subtitle: "Jogo da origem de davi 2D.",
    img: "https://images.unsplash.com/photo-1484591974057-265bb767ef71?auto=format&fit=crop&q=80&w=400", // Sheep on landscape
    color: "from-blue-600 to-purple-600",
    action: "https://ais-dev-y73d54wnkuw2j76fdnnou4-111465990999.us-east1.run.app/"
  },
  {
    id: 2,
    title: "King David 3D",
    subtitle: "jogo da origem de davi 3D.",
    img: "https://picsum.photos/seed/warrior-boy/400/600", // Fallback placeholder for young David
    color: "from-orange-500 to-red-600",
    action: "https://king-david3d.vercel.app/"
  },
  {
    id: 3,
    title: "Bíblia Sagrada",
    subtitle: "Deixei Deus fala seu coraçã",
    img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=400",
    color: "from-emerald-500 to-teal-600",
    action: "bible"
  },
  {
    id: 4,
    title: "Proximo jogo",
    subtitle: "em breve tera novidade",
    img: "https://images.unsplash.com/photo-1633436375795-12b3892aecd1?auto=format&fit=crop&q=80&w=400",
    color: "from-gray-600 to-gray-800",
    action: "coming_soon"
  }
];

export function StoreFront() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parallax setup for the banner
  const { scrollY } = useScroll({ container: scrollRef });
  const bannerY = useTransform(scrollY, [0, 300], [0, 80]);

  // Auto flip banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % verses.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (action: string) => {
    if (action === 'bible') {
      navigate('/bible');
    } else if (action.startsWith('http')) {
      window.location.href = action; // or window.open(action, '_blank') if preferred out of app
    } else {
      alert('Em breve!'); // Simples placeholder
    }
  };

  const handleShareBanner = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conheça o Game Store Bíblia',
          text: 'Veja os novos jogos cristãos na nossa loja digital!',
          url: url
        });
      } catch (err) {
        console.log('Error sharing banner', err);
      }
    } else {
      try {
         await navigator.clipboard.writeText(`Conheça: ${url}`);
         alert('Link da loja copiado!');
      } catch(e) {}
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-[#0b0e14] text-white flex flex-col overflow-hidden font-sans relative shadow-2xl">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#121826] via-[#0b0e14] to-[#0b0e14] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Gamepad2 size={20} className="text-white" />
          </div>
          <h1 className="text-[20px] font-bold tracking-wide">Game Store</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition hover:bg-white/10 active:scale-95">
            <Search size={20} className="text-gray-300" />
          </button>
          <button 
            onClick={() => handleShareBanner("https://gamestorebiblia.netlify.app/")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition hover:bg-white/10 active:scale-95"
          >
            <Share2 size={20} className="text-gray-300" />
          </button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-28 z-10 space-y-6 no-scrollbar">
        {/* Flipview Banner */}
        <section>
           <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
             <AnimatePresence mode="wait">
               <motion.img
                 key={currentBanner}
                 src={verses[currentBanner].img}
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1.15 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.8 }}
                 style={{ y: bannerY }}
                 className="absolute inset-0 w-full h-full object-cover origin-top"
               />
             </AnimatePresence>
             
             {/* Text Gradient */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
             
             <div className="absolute bottom-0 left-0 right-0 p-5">
               <AnimatePresence mode="wait">
                 <motion.p
                   key={currentBanner}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   transition={{ duration: 0.5, delay: 0.2 }}
                   className="text-sm md:text-base font-serif font-medium text-white shadow-black drop-shadow-lg"
                 >
                   "{verses[currentBanner].text}"
                 </motion.p>
               </AnimatePresence>
             </div>
             
             <div className="absolute top-4 right-4 flex gap-1.5 z-20">
               {verses.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40'}`} />
               ))}
             </div>

             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 handleShareBanner(verses[currentBanner].url);
               }}
               className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition shadow-lg"
             >
               <Share2 size={14} />
             </button>
           </div>
        </section>

        {/* Gridview of Games */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {games.map((g, index) => (
              <motion.div 
                key={g.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1, type: "spring", stiffness: 100 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCardClick(g.action)}
                className="relative aspect-[3/4.2] rounded-[20px] overflow-hidden cursor-pointer shadow-xl shadow-black/50 border border-white/10 group bg-slate-900"
              >
                <img src={g.img} alt={g.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 mix-blend-overlay" />
                
                <div className={`absolute inset-0 bg-gradient-to-b ${g.color} opacity-40 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3.5 pb-4">
                   <h3 className="text-[13px] font-bold text-white mb-1 leading-tight tracking-wide">{g.title}</h3>
                   <p className="text-[10px] text-gray-300 leading-snug line-clamp-2 opacity-90">{g.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Main Bottom Nav Area */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20 flex items-end justify-center pb-6">
        <nav className="pointer-events-auto h-16 w-[85%] max-w-[320px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-around px-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <button className="p-3 text-white rounded-full bg-white/15 shadow-sm transition"><Gamepad2 size={24} /></button>
          <button className="p-3 text-gray-400 hover:text-white hover:scale-110 transition"><Search size={22} /></button>
          <button onClick={() => handleShareBanner("https://gamestorebiblia.netlify.app/")} className="p-3 text-gray-400 hover:text-white hover:scale-110 transition"><Share2 size={22} /></button>
          <button className="p-3 text-gray-400 hover:text-white hover:scale-110 transition"><User size={22} /></button>
        </nav>
      </div>
    </div>
  );
}
