import { useBible } from '../context/BibleContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Moon, Sun, ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Home() {
  const { books, isLoading } = useBible();
  const { version, setVersion, planProgress, isDarkMode, toggleDarkMode } = useAppStore();
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
      <div className={`flex h-screen items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1220]' : 'bg-slate-50'}`}>
        <div className="w-12 h-12 text-3xl animate-pulse text-[#3B82F6] flex items-center justify-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">📖</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1220] text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Premium Dashboard Header inside Bible Section */}
      <header className={`px-6 pt-10 pb-6 sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1220]/45 border-white/5' : 'bg-white/45 border-slate-200/80 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className={`flex items-center justify-center w-11 h-11 rounded-full transition-all border active:scale-95 hover:animate-neon-green-pulse-soft ${
                isDarkMode 
                  ? 'bg-[#172033] text-white hover:text-emerald-400 hover:bg-[#152e24]/80 border-emerald-500/20' 
                  : 'bg-white text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 border-emerald-300/40 shadow-sm'
              }`}
              aria-label="Voltar para Menu Principal"
            >
              <LayoutGrid size={18} />
            </button>
            <div className="flex flex-col">
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{getFormattedDate()}</span>
              <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{getGreeting()}, 👋</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full border transition-all active:scale-95 ${
                isDarkMode 
                  ? 'bg-[#172033] text-emerald-400 border-emerald-500/20 hover:bg-[#152e24]/80 shadow-md' 
                  : 'bg-white text-emerald-600 border-emerald-300/40 hover:bg-emerald-50 shadow-sm'
              }`}
              aria-label="Alternar Tema"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Version Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center justify-center min-w-[4.5rem] px-3 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all border active:scale-95 hover:animate-neon-green-pulse-soft ${
                  isDarkMode 
                    ? 'bg-[#172033] text-white hover:text-emerald-400 hover:bg-[#152e24]/80 border-emerald-500/20' 
                    : 'bg-white text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 border-emerald-300/40 shadow-sm'
                }`}
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
                      className={`absolute right-0 mt-2 p-1.5 min-w-[5rem] rounded-2xl border z-25 flex flex-col gap-1 overflow-hidden shadow-xl ${
                        isDarkMode 
                          ? 'bg-[#172033] border-white/10 shadow-black/80' 
                          : 'bg-white border-slate-200 shadow-slate-200/50'
                      }`}
                    >
                      <button
                        onClick={() => { setVersion('acf'); setIsMenuOpen(false); }}
                        className={`px-3 py-2 text-xs font-extrabold rounded-xl text-center transition-all ${
                          version === 'acf' 
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : (isDarkMode ? 'text-[#94A3B8] hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')
                        }`}
                      >
                        ACF
                      </button>
                      <button
                        onClick={() => { setVersion('nvi'); setIsMenuOpen(false); }}
                        className={`px-3 py-2 text-xs font-extrabold rounded-xl text-center transition-all ${
                          version === 'nvi' 
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : (isDarkMode ? 'text-[#94A3B8] hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100')
                        }`}
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
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-md" 
              alt="Avatar" 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 space-y-9 no-scrollbar">
        {/* Reading Plan Card Banner */}
        <div className="pt-4">
          <Link to="/bible/plan" className="block group">
            <div className={`border rounded-[24px] p-6 relative overflow-hidden active:scale-[0.98] transition-all duration-300 animate-neon-green-pulse-soft ${
              isDarkMode 
                ? 'bg-[#172033]/85 hover:bg-[#172033] border-emerald-500/20' 
                : 'bg-white border-emerald-300/40 hover:bg-emerald-50/25 shadow-sm'
            }`}>
               <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-emerald-500/5 blur-xl pointer-events-none"></div>
               <div className="text-[9px] uppercase opacity-90 mb-1.5 font-black tracking-[0.2em] text-emerald-500 dark:text-emerald-400">Plano de Leitura</div>
               <div className={`text-xl font-black mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                 Essência da Bíblia <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 font-extrabold animate-pulse">Ativo</span>
               </div>
               <div className="flex items-center justify-between text-xs mb-2.5">
                 <span className={`font-bold ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Dia {Math.min(completedDays + 1, 30)} de 30</span>
                 <span className="font-black text-emerald-500">{progressPercent}%</span>
               </div>
               <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#0B1220]' : 'bg-slate-100'}`}>
                 <div className="h-full bg-gradient-to-r from-emerald-500 to-[#F59E0B] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
               </div>
            </div>
          </Link>
        </div>

        {/* Antigo Testamento Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <h2 className={`text-md uppercase font-black tracking-[0.1em] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Antigo Testamento</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {vtBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block group">
                <motion.div 
                  whileTap={{ scale: 0.96 }} 
                  className={`h-full relative overflow-hidden pl-5 pr-4.5 py-4.5 flex flex-col justify-between border rounded-[18px] transition-all duration-500 active:scale-95 animate-neon-green-pulse-soft group ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-[#121B30]/95 to-[#0D1527] border-emerald-500/20 hover:border-emerald-400/50 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]' 
                      : 'bg-white border-emerald-300/40 hover:border-emerald-500/70 hover:bg-emerald-50/20 text-slate-800 shadow-[0_4px_15px_rgba(16,185,129,0.04)]'
                  }`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-emerald-400 to-emerald-600/80 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  <h3 className={`font-sans text-[14px] font-extrabold mb-1.5 transition-colors uppercase tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 ${isDarkMode ? 'text-white/95' : 'text-slate-800'}`}>{book.name}</h3>
                  <span className={`text-[9px] uppercase font-bold tracking-widest transition-colors group-hover:text-emerald-500/90 dark:group-hover:text-emerald-400/90 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Novo Testamento Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
            <h2 className={`text-md uppercase font-black tracking-[0.1em] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Novo Testamento</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {ntBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block group">
                <motion.div 
                  whileTap={{ scale: 0.96 }} 
                  className={`h-full relative overflow-hidden pl-5 pr-4.5 py-4.5 flex flex-col justify-between border rounded-[18px] transition-all duration-500 active:scale-95 animate-neon-green-pulse-soft group ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-[#121B30]/95 to-[#0D1527] border-emerald-500/20 hover:border-emerald-400/50 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]' 
                      : 'bg-white border-emerald-300/40 hover:border-emerald-500/70 hover:bg-emerald-50/20 text-slate-800 shadow-[0_4px_15px_rgba(16,185,129,0.04)]'
                  }`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-emerald-400 to-emerald-600/80 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  <h3 className={`font-sans text-[14px] font-extrabold mb-1.5 transition-colors uppercase tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 ${isDarkMode ? 'text-white/95' : 'text-slate-800'}`}>{book.name}</h3>
                  <span className={`text-[9px] uppercase font-bold tracking-widest transition-colors group-hover:text-emerald-500/90 dark:group-hover:text-emerald-400/90 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
