import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Search, Shuffle, ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bibleVerses, BibleVerse } from '../data/bibleVerses';
import { useBible } from '../context/BibleContext';

export function WordOfTheDay() {
  const navigate = useNavigate();
  const { books, isLoaded } = useBible();
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Pick a deterministic daily verse based on the day of the year
    const start = new Date(new Date().getFullYear(), 0, 0).getTime();
    const diff = new Date().getTime() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    setDailyVerse(bibleVerses[dayOfYear % bibleVerses.length]);
  }, []);

  const handleRandomProverb = () => {
    if (!isLoaded || books.length === 0) {
      // Fallback to local array
      const proverbs = bibleVerses.filter(v => v.book === "Provérbios");
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      setDailyVerse(proverbs[randomIndex]);
      return;
    }

    const proverbsBook = books.find(b => b.name === "Provérbios" || b.name === "Proverbs" || b.abbrev === "pv");
    if (proverbsBook && proverbsBook.chapters.length > 0) {
      const chapterIndex = Math.floor(Math.random() * proverbsBook.chapters.length);
      const categoryChapter = proverbsBook.chapters[chapterIndex];
      const verseIndex = Math.floor(Math.random() * categoryChapter.length);
      
      setDailyVerse({
        book: proverbsBook.name,
        chapter: chapterIndex + 1,
        verse: verseIndex + 1,
        text: categoryChapter[verseIndex]
      });
    } else {
      // Fallback to local
      const proverbs = bibleVerses.filter(v => v.book === "Provérbios");
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      setDailyVerse(proverbs[randomIndex]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Use setTimeout to allow UI to update and show loader
    setTimeout(() => {
      const loweredQuery = searchQuery.toLowerCase();
      let results: BibleVerse[] = [];

      if (isLoaded && books.length > 0) {
        // Full Bible search
        for (const book of books) {
          // Allow searching exclusively by book name or matching text
          const bookMatch = book.name.toLowerCase().includes(loweredQuery);
          
          for (let c = 0; c < book.chapters.length; c++) {
            const chapter = book.chapters[c];
            for (let v = 0; v < chapter.length; v++) {
              const verseText = chapter[v];
              if (bookMatch || verseText.toLowerCase().includes(loweredQuery)) {
                results.push({
                  book: book.name,
                  chapter: c + 1,
                  verse: v + 1,
                  text: verseText
                });
                
                // Limit to 100 results so we don't freeze the app on huge queries
                if (results.length >= 100) break; 
              }
            }
            if (results.length >= 100) break;
          }
          if (results.length >= 100) break;
        }
      } else {
        // Fallback search in our small list if Bible is not loaded
        results = bibleVerses.filter(v => 
          v.text.toLowerCase().includes(loweredQuery) || 
          v.book.toLowerCase().includes(loweredQuery)
        );
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 50);
  };

  const handleShare = (verse: BibleVerse) => {
    const shareText = `📖 "${verse.text}"\n— ${verse.book} ${verse.chapter}:${verse.verse}\n\nAcesse mais: https://gamestorebiblico.netlify.app/`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Palavras do Dia',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Versículo copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#020617] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 h-16 flex items-center bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-white/90 mr-6">
          Palavras do Dia
        </h1>
      </header>

      <main className="px-6 py-8 max-w-lg mx-auto pb-24">
        {/* Daily/Random Verse Card */}
        <AnimatePresence mode="wait">
          {dailyVerse && (
            <motion.div
              key={`${dailyVerse.book}-${dailyVerse.chapter}-${dailyVerse.verse}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-md rounded-[24px] p-8 border border-white/20 shadow-[inset_0_2px_15px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,0.3)] mb-8 text-center"
            >
              <h2 className="text-white/60 uppercase tracking-widest text-xs font-bold mb-6">Versículo em Destaque</h2>
              <p className="text-2xl font-serif font-medium leading-relaxed mb-6 text-white/90 drop-shadow-md">
                "{dailyVerse.text}"
              </p>
              <div className="flex items-center justify-center justify-between mt-8">
                <span className="text-rose-300 font-semibold tracking-wide">
                  {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => handleShare(dailyVerse)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Random Proverb Button */}
        <button 
          onClick={handleRandomProverb}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 active:scale-95 transition-all text-white font-bold py-4 px-6 rounded-2xl shadow-lg mb-12"
        >
          <Shuffle size={20} />
          <span>Versículo Aleatório (Provérbios)</span>
        </button>

        {/* Search Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Search size={20} className="text-rose-400" /> 
            Buscar por Palavra
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite uma palavra..."
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-rose-400 transition-colors"
              />
            </div>
            <button type="submit" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-colors">
              Buscar
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-rose-500 animate-spin"></div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((verse, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={`${verse.book}-${verse.chapter}-${verse.verse}-${idx}`} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl"
              >
                <p className="text-white/80 font-medium leading-relaxed mb-3">"{verse.text}"</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-rose-300 font-bold">{verse.book} {verse.chapter}:{verse.verse}</span>
                  <button onClick={() => handleShare(verse)} className="text-white/50 hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : searchQuery && !isSearching ? (
             <div className="text-center py-8 text-white/50">
               Nenhum versículo encontrado com essa palavra.
             </div>
          ) : null}
        </div>

      </main>
    </div>
  );
}
