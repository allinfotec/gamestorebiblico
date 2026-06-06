import { useBible } from '../context/BibleContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Moon, Sun, ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Home() {
  const { books, isLoading } = useBible();
  const { version, setVersion, planProgress } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const vtBooks = books.filter((b, index) => b.testament === 'VT' || index < 39);
  const ntBooks = books.filter((b, index) => b.testament === 'NT' || index >= 39);

  const completedDays = planProgress.length;
  const progressPercent = Math.round((completedDays / 30) * 100);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Bom dia';
    if (hr < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getFormattedDate = () => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return d.toLocaleDateString('pt-BR', options);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#0B1220] items-center justify-center">
        <div className="w-12 h-12 text-3xl animate-pulse text-[#3B82F6] flex items-center justify-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">📖</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0B1220] text-white">
      {/* Premium Dashboard Header inside Bible Section */}
      <header className="px-6 pt-10 pb-6 sticky top-0 z-20 bg-[#0B1220]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[#172033] text-white hover:text-[#3B82F6] hover:bg-[#172033]/80 transition-all border border-white/10 active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
              aria-label="Voltar para Menu Principal"
            >
              <LayoutGrid size={18} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">{getFormattedDate()}</span>
              <h1 className="text-xl font-extrabold tracking-tight text-white">{getGreeting()}, 👋</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Version Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center min-w-[4.5rem] px-3 py-2 rounded-full bg-[#172033] hover:bg-white/5 text-white font-extrabold text-xs uppercase tracking-wider transition-all border border-white/10 shadow-md"
              >
                {version}
                <ChevronDown size={14} className="ml-1 opacity-60" />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 p-1.5 min-w-[5rem] bg-[#172033] rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.5)] border border-white/10 z-20 flex flex-col gap-1 overflow-hidden"
                    >
                      <button
                        onClick={() => { setVersion('acf'); setIsMenuOpen(false); }}
                        className={`px-3 py-2 text-xs font-extrabold rounded-xl text-center transition-all ${version === 'acf' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
                      >
                        ACF
                      </button>
                      <button
                        onClick={() => { setVersion('nvi'); setIsMenuOpen(false); }}
                        className={`px-3 py-2 text-xs font-extrabold rounded-xl text-center transition-all ${version === 'nvi' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
                      >
                        NVI
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Spot */}
            <img 
              src="https://res.cloudinary.com/donb73jnb/image/upload/v1777405912/leaodatribo_sq5riz.jpg" 
              className="w-11 h-11 rounded-full object-cover border-2 border-[#3B82F6] shadow-md" 
              alt="Avatar" 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 space-y-9 no-scrollbar">
        {/* Reading Plan Card Banner */}
        <div className="pt-4">
          <Link to="/bible/plan" className="block group">
            <div className="bg-[#172033] hover:bg-[#172033]/90 border border-white/10 rounded-[24px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.15)] relative overflow-hidden active:scale-[0.98] transition-all duration-300">
               <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-[#3B82F6]/5 blur-xl pointer-events-none"></div>
               <div className="text-[9px] uppercase opacity-70 mb-1.5 font-black tracking-[0.2em] text-[#3B82F6]">Plano de Leitura</div>
               <div className="text-xl font-black mb-4 text-white">Essência da Bíblia</div>
               <div className="flex items-center justify-between text-xs mb-2.5">
                 <span className="font-bold text-[#94A3B8]">Dia {Math.min(completedDays + 1, 30)} de 30</span>
                 <span className="font-black text-[#3B82F6]">{progressPercent}%</span>
               </div>
               <div className="h-2 bg-[#0B1220] rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#F59E0B] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
               </div>
            </div>
          </Link>
        </div>

        {/* Antigo Testamento Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-[#F59E0B]"></div>
            <h2 className="text-md uppercase font-black tracking-[0.1em] text-white">Antigo Testamento</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {vtBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block">
                <motion.div 
                  whileTap={{ scale: 0.96 }} 
                  className="h-full p-4.5 flex flex-col justify-between bg-[#172033]/80 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.1)] transition-all duration-300 active:scale-95 text-white"
                >
                  <h3 className="font-sans text-[15px] font-extrabold mb-1.5 group-hover:text-[#3B82F6] transition-colors">{book.name}</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#94A3B8]">{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Novo Testamento Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-[#3B82F6]"></div>
            <h2 className="text-md uppercase font-black tracking-[0.1em] text-white">Novo Testamento</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {ntBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block">
                <motion.div 
                  whileTap={{ scale: 0.96 }} 
                  className="h-full p-4.5 flex flex-col justify-between bg-[#172033]/80 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.1)] transition-all duration-300 active:scale-95 text-white"
                >
                  <h3 className="font-sans text-[15px] font-extrabold mb-1.5 group-hover:text-[#3B82F6] transition-colors">{book.name}</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#94A3B8]">{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
