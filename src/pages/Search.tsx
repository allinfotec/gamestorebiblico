import { useState, useMemo } from 'react';
import { useBible } from '../context/BibleContext';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function Search() {
  const { books } = useBible();
  const [query, setQuery] = useState('');
  
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
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <header className="px-5 pt-8 pb-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-10 shrink-0 border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-4">Buscar</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por palavras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-black dark:text-white focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-300 dark:focus:border-slate-600 transition-all outline-none shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)]"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
        {query.length > 0 && query.length < 3 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 font-medium">Digite pelo menos 3 caracteres...</p>
        )}
        
        {query.length >= 3 && results.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 font-medium">Nenhum resultado encontrado.</p>
        )}

        <div className="space-y-4">
          {results.map((hit, idx) => (
            <motion.div key={idx} whileTap={{ scale: 0.98 }} className="p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] text-black dark:text-white flex flex-col gap-3 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-gray-600 dark:text-gray-300" />
                </div>
                <h3 className="font-bold text-[13px] uppercase tracking-wider text-gray-800 dark:text-gray-200">
                  {hit.book} {hit.chapter}:{hit.verse}
                </h3>
              </div>
              <p className="font-serif text-[15px] leading-relaxed opacity-90 pl-3 border-l-[3px] border-gray-200 dark:border-slate-700 ml-1">
                "{hit.text}"
              </p>
              <Link to={`/bible/read/${hit.abbrev}/${hit.chapter}`} className="self-start mt-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-gray-100 text-black dark:bg-slate-800 dark:text-white px-4 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30">
                  Ir para Leitura <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
