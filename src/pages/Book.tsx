import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBible } from '../context/BibleContext';
import { ArrowLeft, BookOpen, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function Book() {
  const { abbrev } = useParams<{ abbrev: string }>();
  const { books } = useBible();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const book = books.find(b => b.abbrev === abbrev);

  if (!book) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B1220] transition-colors duration-300 text-slate-800 dark:text-white">
      <header className="flex flex-col px-6 pt-6 pb-4 border-b border-gray-100 dark:border-emerald-500/10 shrink-0 sticky top-0 bg-white/60 dark:bg-[#0B1220]/65 backdrop-blur-xl z-10 transition-colors duration-300 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#152e24] hover:text-emerald-400 rounded-full transition-colors active:scale-95">
            <ArrowLeft size={24} />
          </button>
          
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
        </div>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#121B30]/90 flex items-center justify-center text-slate-700 dark:text-emerald-400 shrink-0 border border-gray-200 dark:border-emerald-500/35 shadow-sm animate-neon-green-pulse-soft">
             <BookOpen size={20} />
           </div>
           <div>
             <h1 className="text-3xl font-serif font-black text-slate-800 dark:text-white leading-tight flex items-center gap-2 tracking-tight">
               {book.name}
             </h1>
             <p className="text-xs font-black text-slate-500 dark:text-emerald-400 tracking-[0.15em] uppercase mt-1">
               {book.chapters.length} Capítulos
             </p>
           </div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-3.5">
          {book.chapters.map((verses, index) => {
            const chapterNum = index + 1;
            const versesCount = verses.length;
            
            return (
              <Link key={chapterNum} to={`/bible/read/${book.abbrev}/${chapterNum}`} className="block group">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#121B30]/90 rounded-2xl border border-gray-100 dark:border-emerald-500/20 active:scale-[0.98] transition-all duration-500 text-slate-800 dark:text-white dark:hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] animate-neon-green-pulse-soft relative overflow-hidden pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-gradient-to-b from-emerald-400 to-emerald-600/90 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all shadow-[0_0_8px_rgba(52,211,153,0.55)]"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#0B1220] border border-gray-200 dark:border-emerald-500/30 flex items-center justify-center font-serif text-lg font-black group-hover:bg-emerald-500 group-hover:text-[#0C1221] dark:group-hover:bg-emerald-400 dark:group-hover:text-[#0B1220] group-hover:border-emerald-400 transition-colors duration-300 shadow-sm shrink-0">
                       {chapterNum}
                     </div>
                     <div>
                       <h3 className="font-sans text-[15.5px] font-extrabold group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Capítulo {chapterNum}</h3>
                       <p className="text-xs font-bold text-gray-400 dark:text-emerald-400/80 mt-0.5">{versesCount} versículos</p>
                     </div>
                  </div>
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500 dark:text-emerald-400 shrink-0">
                    <ArrowLeft size={20} className="rotate-180 inline-block" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
