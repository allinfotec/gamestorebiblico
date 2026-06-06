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
    <div className="flex flex-col h-full bg-[#0B1220] text-white">
      <header className="px-6 pt-10 pb-6 bg-[#0B1220]/90 backdrop-blur-xl sticky top-0 z-10 shrink-0 border-b border-white/5 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-4">Buscar</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Buscar por palavras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#172033] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all outline-none"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 pt-4 no-scrollbar">
        {query.length > 0 && query.length < 3 && (
          <p className="text-center text-[#94A3B8] mt-8 font-extrabold text-xs tracking-wider">DIGITE PELO MENOS 3 CARACTERES...</p>
        )}
        
        {query.length >= 3 && results.length === 0 && (
          <p className="text-center text-[#94A3B8] mt-8 font-extrabold text-xs tracking-wider">NENHUM RESULTADO ENCONTRADO.</p>
        )}

        <div className="space-y-4">
          {results.map((hit, idx) => (
            <motion.div key={idx} whileTap={{ scale: 0.98 }} className="p-5 bg-[#172033]/90 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[18px] text-white flex flex-col gap-3 transition-colors shadow-lg group relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-[#3B82F6]" />
                </div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#94A3B8]">
                  {hit.book} {hit.chapter}:{hit.verse}
                </h3>
              </div>
              <p className="font-serif text-[15px] leading-relaxed opacity-95 pl-3 border-l-2 border-[#3B82F6]/60 ml-1">
                "{hit.text}"
              </p>
              <Link to={`/bible/read/${hit.abbrev}/${hit.chapter}`} className="self-start mt-2">
                <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 text-[#3B82F6] px-4 py-2.5 rounded-xl border border-[#3B82F6]/25 transition-all shadow-md">
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
