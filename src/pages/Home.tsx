import { useBible } from '../context/BibleContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Moon, Sun, ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Home() {
  const { books, isLoading } = useBible();
  const { isDarkMode, toggleDarkMode, version, setVersion, planProgress } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const vtBooks = books.filter((b, index) => b.testament === 'VT' || index < 39);
  const ntBooks = books.filter((b, index) => b.testament === 'NT' || index >= 39);

  const completedDays = planProgress.length;
  const progressPercent = Math.round((completedDays / 30) * 100);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 font-serif text-2xl animate-pulse">📖</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <header className="px-5 pt-8 pb-4 sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-colors border-b-2 border-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center p-2 rounded-full bg-gray-50/80 dark:bg-slate-800/80 text-black dark:text-white transition-colors hover:bg-gray-200 dark:hover:bg-slate-700 shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 border border-gray-200 dark:border-slate-700"
              aria-label="Voltar para Menu Principal"
            >
              <LayoutGrid size={20} />
            </button>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white">Bíblia</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Version Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center min-w-[3.5rem] px-2 py-1.5 rounded-full bg-gray-50/80 dark:bg-slate-800/80 text-black dark:text-white font-bold text-sm uppercase transition-colors hover:bg-gray-200 dark:hover:bg-slate-700 shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 border border-gray-200 dark:border-slate-700"
              >
                {version}
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-1 min-w-[4rem] bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 dark:border-slate-800 z-20 flex flex-col gap-1 overflow-hidden font-sans"
                    >
                      <button
                        onClick={() => { setVersion('acf'); setIsMenuOpen(false); }}
                        className={`px-2 py-2 text-xs font-bold rounded-xl text-center transition-colors ${version === 'acf' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                      >
                        ACF
                      </button>
                      <button
                        onClick={() => { setVersion('nvi'); setIsMenuOpen(false); }}
                        className={`px-2 py-2 text-xs font-bold rounded-xl text-center transition-colors ${version === 'nvi' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                      >
                        NVI
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-[2.25rem] h-[2.25rem] rounded-full bg-gray-50/80 dark:bg-slate-800/80 text-black dark:text-white transition-colors hover:bg-gray-200 dark:hover:bg-slate-700 shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 border border-gray-200 dark:border-slate-700"
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-36 space-y-8">
        {/* Reading Plan Card Banner */}
        <div className="pt-2">
          <Link to="/bible/plan" className="block group">
            <div className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-3xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgb(0,0,0,0.3)] relative overflow-hidden active:scale-[0.98] transition-all duration-300 border border-gray-100 dark:border-slate-800">
               <div className="text-[11px] uppercase opacity-60 mb-2 font-bold tracking-[0.2em] text-black dark:text-white">Plano de Leitura</div>
               <div className="text-2xl font-serif font-bold mb-5 text-black dark:text-white">Essência da Bíblia</div>
               <div className="flex items-center justify-between text-xs opacity-90 mb-3">
                 <span className="font-medium text-gray-600 dark:text-gray-400">Dia {Math.min(completedDays + 1, 30)} de 30</span>
                 <span className="font-bold text-black dark:text-white">{progressPercent}%</span>
               </div>
               <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-black dark:bg-white transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
               </div>
            </div>
          </Link>
        </div>

        <section>
          <h2 className="text-base uppercase font-bold tracking-[0.15em] text-black dark:text-white mb-4 px-2">Antigo Testamento</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {vtBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block">
                <motion.div whileTap={{ scale: 0.95 }} className="h-full p-4 flex flex-col justify-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgb(0,0,0,0.3)] transition-all duration-300 text-black dark:text-white">
                  <h3 className="font-sans text-[15px] font-bold mb-1">{book.name}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400">{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base uppercase font-bold tracking-[0.15em] text-black dark:text-white mb-4 px-2">Novo Testamento</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {ntBooks.map(book => (
              <Link key={book.abbrev} to={`/bible/book/${book.abbrev}`} className="block">
                <motion.div whileTap={{ scale: 0.95 }} className="h-full p-4 flex flex-col justify-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgb(0,0,0,0.3)] transition-all duration-300 text-black dark:text-white">
                  <h3 className="font-sans text-[15px] font-bold mb-1">{book.name}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400">{book.chapters.length} Capítulos</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
