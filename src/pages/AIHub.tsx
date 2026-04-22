import { useState } from 'react';
import { generateDevotional, suggestThematicVerses } from '../services/aiService';
import { Sparkles, Loader2, BookOpen, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIHub() {
  const [devotional, setDevotional] = useState<{title: string, verse: string, content: string} | null>(null);
  const [isLoadingDevo, setIsLoadingDevo] = useState(false);
  
  const [themeInput, setThemeInput] = useState('');
  const [themeLoading, setThemeLoading] = useState(false);
  const [suggestedVerses, setSuggestedVerses] = useState<Array<{reference:string, text:string}>>([]);

  const handleGenDevotional = async () => {
    setIsLoadingDevo(true);
    setDevotional(null);
    try {
      const data = await generateDevotional();
      setDevotional(data);
    } catch(e) {
      alert("Erro ao gerar devocional.");
    } finally {
      setIsLoadingDevo(false);
    }
  }

  const handleGenTheme = async () => {
    if (!themeInput.trim()) return;
    setThemeLoading(true);
    setSuggestedVerses([]);
    try {
      const data = await suggestThematicVerses(themeInput);
      setSuggestedVerses(data);
    } catch(e) {
      alert("Erro ao buscar tema.");
    } finally {
      setThemeLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <header className="px-5 pt-10 pb-8 shrink-0 bg-black dark:bg-slate-900 border-b border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-b-[40px]">
        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3 mb-2">
          <Sparkles className="text-yellow-300" size={28} /> Inteligência Artificial
        </h1>
        <p className="text-gray-300 dark:text-gray-400 text-[15px] font-medium leading-relaxed pl-1">
          Ferramentas de IA para iluminar seu estudo e sua jornada.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-36 space-y-10">
        
        {/* Devotional Card */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Devocional Diário</h2>
          </div>
          
          <motion.div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-800 transition-all">
            {!devotional && !isLoadingDevo && (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-black rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-slate-800 shadow-sm">
                   <BookOpen size={28} className="text-black dark:text-white" />
                 </div>
                 <p className="text-gray-600 dark:text-gray-300 mb-6 px-4 leading-relaxed text-[15px]">Gere um devocional exclusivo para hoje, baseado na Bíblia Sagrada.</p>
                 <button onClick={handleGenDevotional} className="px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-2xl shadow-xl shadow-gray-400/60 dark:shadow-gray-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all w-full flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Gerar Devocional
                 </button>
               </div>
            )}
            
            {isLoadingDevo && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-black dark:text-white mb-4" size={36} />
                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">Escrevendo devocional...</p>
              </div>
            )}

            {devotional && !isLoadingDevo && (
              <div className="space-y-5">
                <h3 className="font-serif text-[26px] font-bold text-black dark:text-white leading-tight">{devotional.title}</h3>
                <div className="p-5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-slate-800 rounded-2xl relative shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
                   <div className="absolute top-3 left-3 text-4xl text-gray-300 dark:text-slate-700 font-serif leading-none opacity-50">"</div>
                   <p className="font-serif italic text-black dark:text-white text-lg relative z-10 pl-6 pr-2 leading-relaxed">{devotional.verse}</p>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-[1.7] max-w-none whitespace-pre-wrap font-sans text-[15px]">
                  {devotional.content}
                </p>
                <div className="pt-5 border-t border-gray-100 dark:border-slate-800 mt-4 text-center">
                   <button onClick={handleGenDevotional} className="text-gray-500 dark:text-gray-400 font-bold text-[11px] uppercase tracking-wider hover:text-black dark:hover:text-white transition-colors">Gerar novo devocional</button>
                </div>
              </div>
            )}
          </motion.div>
        </section>


        {/* Thematic Search */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Busca por Tema</h2>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-800">
             <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">Como você está se sentindo? A IA sugere versículos sobre ansiedade, paz, amor...</p>
             
             {/* Pre-defined Theme Categories */}
             <div className="flex flex-wrap gap-2 mb-5">
               {['Ansiedade', 'Paz', 'Amor', 'Gratidão', 'Esperança', 'Força'].map((btnTheme) => (
                 <button
                   key={btnTheme}
                   onClick={() => {
                     setThemeInput(btnTheme);
                     // Set timeout to ensure state update before fetching
                     setTimeout(() => {
                       setThemeLoading(true);
                       setSuggestedVerses([]);
                       suggestThematicVerses(btnTheme)
                         .then(data => setSuggestedVerses(data))
                         .catch(() => alert("Erro ao buscar tema."))
                         .finally(() => setThemeLoading(false));
                     }, 50);
                   }}
                   className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold transition-colors border border-gray-200 dark:border-slate-700"
                 >
                   {btnTheme}
                 </button>
               ))}
             </div>

             <div className="flex gap-2">
                <input 
                   type="text" 
                   value={themeInput} 
                   onChange={e => setThemeInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleGenTheme()}
                   placeholder="Ex: paz interior"
                   className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-black dark:text-white focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-300 transition-all outline-none shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)]"
                />
                <button onClick={handleGenTheme} className="px-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 flex items-center justify-center">
                  {themeLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
             </div>

             <AnimatePresence>
               {suggestedVerses.length > 0 && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 space-y-3">
                    {suggestedVerses.map((s, idx) => (
                      <div key={idx} className="p-5 bg-gray-50 dark:bg-black/50 rounded-2xl border border-gray-100 dark:border-slate-800 group relative overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-slate-600">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10 dark:bg-white/10 group-hover:bg-black dark:group-hover:bg-white transition-colors"></div>
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{s.reference}</h4>
                        <p className="font-serif text-black dark:text-white text-[16px] leading-relaxed">"{s.text}"</p>
                      </div>
                    ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
