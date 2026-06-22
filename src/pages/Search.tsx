import { useState, useMemo } from 'react';
import { useBible } from '../context/BibleContext';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function Search() {
  const { books } = useBible();
  const [query, setQuery] = useState('');
  const { isDarkMode } = useAppStore();
  
  const results = useMemo(() => {
    if (query.length < 3) return [];
    
    const loweredQuery = query.toLowerCase();
    const hits = [];
    
    for (const book of books) {
      for (let c = 0; c < book.chapters.length; c++) {
        const chapter = book.chapters[c];
        for (let v = 0; v < chapter.length; v++) {
          const verseText = chapter[v];
          if (verseText.toLowerCase().includes(loweredQuery)) {
            hits.push({
              book: book.name,
              abbrev: book.abbrev,
              chapter: c + 1,
              verse: v + 1,
              text: verseText
            });
            if (hits.length > 50) break; // Limit for performance
          }
        }
        if (hits.length > 50) break;
      }
      if (hits.length > 50) break;
    }
    
    return hits;
  }, [query, books]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B1220] transition-colors duration-300 text-slate-800 dark:text-white">
      <header className="px-6 pt-10 pb-6 bg-white/45 dark:bg-[#0B1220]/45 backdrop-blur-xl sticky top-0 z-10 shrink-0 border-b border-slate-100 dark:border-emerald-500/10 shadow-sm transition-colors duration-300">
        <h1 className="text-2xl font-sans font-black tracking-tight text-slate-800 dark:text-white mb-4">Buscar</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Buscar por palavras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#172033] border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#94A3B8] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none shadow-sm"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 pt-4 no-scrollbar">
        {query.length > 0 && query.length < 3 && (
          <p className="text-center text-slate-400 dark:text-[#94A3B8] mt-8 font-extrabold text-xs tracking-wider">DIGITE PELO MENOS 3 CARACTERES...</p>
        )}
        
        {query.length >= 3 && results.length === 0 && (
          <p className="text-center text-slate-400 dark:text-[#94A3B8] mt-8 font-extrabold text-xs tracking-wider">NENHUM RESULTADO ENCONTRADO.</p>
        )}

        <div className="space-y-4">
          {results.map((hit, idx) => (
            <motion.div key={idx} whileTap={{ scale: 0.98 }} className="p-5 bg-white dark:bg-[#121B30]/90 border border-slate-100 dark:border-emerald-500/20 hover:border-emerald-500/40 rounded-[18px] text-slate-800 dark:text-white flex flex-col gap-3 transition-colors shadow-sm hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] group relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-gradient-to-b from-emerald-400 to-emerald-600/90 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all shadow-[0_0_8px_rgba(52,211,153,0.55)]"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#0B1220] border border-gray-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-emerald-500" />
                </div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 dark:text-emerald-450">
                  {hit.book} {hit.chapter}:{hit.verse}
                </h3>
              </div>
              <p className="font-serif text-[15px] leading-relaxed opacity-95 pl-3 border-l-2 border-emerald-500/40 ml-1">
                "{hit.text}"
              </p>
              <Link to={`/bible/read/${hit.abbrev}/${hit.chapter}`} className="self-start mt-2">
                <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 transition-all shadow-sm">
                  Ir para Leitura <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
