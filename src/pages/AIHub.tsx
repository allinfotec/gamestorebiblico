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
    <div className="flex flex-col h-full bg-[#0B1220] text-white">
      <header className="px-6 pt-10 pb-8 shrink-0 bg-[#172033]/90 backdrop-blur-xl border-b border-white/5 rounded-b-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
        <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-[#3B82F6]/10 blur-xl pointer-events-none"></div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3 mb-2">
          <Sparkles className="text-[#F59E0B]" size={24} /> Inteligência Artificial
        </h1>
        <p className="text-[#94A3B8] text-xs font-semibold leading-relaxed pl-1 max-w-sm">
          Ferramentas de IA para iluminar seu estudo e sua jornada bíblica hoje.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-36 space-y-10 no-scrollbar">
        
        {/* Devotional Card */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-[#3B82F6]"></div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Devocional Diário</h2>
          </div>
          
          <motion.div className="bg-[#172033] border border-white/10 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            {!devotional && !isLoadingDevo && (
               <div className="text-center py-6">
                 <div className="w-14 h-14 bg-[#0B1220] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-md">
                   <BookOpen size={24} className="text-[#3B82F6]" />
                 </div>
                 <p className="text-[#94A3B8] mb-6 px-4 leading-relaxed text-sm font-semibold max-w-sm mx-auto">Gere um devocional exclusivo escrito pela IA, baseado na Bíblia Sagrada.</p>
                 <button 
                   onClick={handleGenDevotional} 
                   className="px-6 py-4 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-[#3B82F6]/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all w-full flex items-center justify-center gap-2"
                 >
                    <Sparkles size={14} /> Gerar Devocional Diário
                 </button>
               </div>
            )}
            
            {isLoadingDevo && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-[#3B82F6] mb-4" size={32} />
                <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-[10px]">Escrevendo devocional exclusivo...</p>
              </div>
            )}

            {devotional && !isLoadingDevo && (
              <div className="space-y-4">
                <h3 className="font-serif text-[22px] font-bold text-white leading-tight">{devotional.title}</h3>
                <div className="p-5 bg-[#0B1220]/80 border border-white/5 rounded-2xl relative">
                   <div className="absolute top-2.5 left-2 text-3xl text-[#3B82F6]/20 font-serif leading-none opacity-50">"</div>
                   <p className="font-serif italic text-white text-md relative z-10 pl-6 leading-relaxed">{devotional.verse}</p>
                </div>
                <p className="text-[#94A3B8] leading-relaxed whitespace-pre-wrap font-sans text-sm font-medium">
                  {devotional.content}
                </p>
                <div className="pt-4 border-t border-white/5 mt-4 text-center">
                   <button onClick={handleGenDevotional} className="text-[#3B82F6] font-bold text-[10px] uppercase tracking-wider hover:underline transition-colors">Gerar novo devocional</button>
                </div>
              </div>
            )}
          </motion.div>
        </section>


        {/* Thematic Search */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1.5 h-6 rounded-full bg-[#F59E0B]"></div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Busca por Tema</h2>
          </div>
          
          <div className="bg-[#172033] border border-white/10 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
             <p className="text-sm text-[#94A3B8] mb-5 font-semibold leading-normal">Como você se sente? Toque em um sentimento ou digite abaixo para encontrar versículos inspiradores de apoio.</p>
             
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
                   className="px-4 py-2 bg-[#0B1220] hover:bg-[#0B1220]/80 text-[#94A3B8] hover:text-white rounded-full text-xs font-bold transition-all border border-white/10 hover:border-[#3B82F6]/30"
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
                   placeholder="Ex: paz interior, vencer medo"
                   className="flex-1 bg-[#0B1220] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-all outline-none"
                />
                <button 
                  onClick={handleGenTheme} 
                  className="w-12 h-12 shrink-0 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#3B82F6]/20 flex items-center justify-center"
                >
                  {themeLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={18} />}
                </button>
             </div>

             <AnimatePresence>
               {suggestedVerses.length > 0 && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 space-y-3">
                    {suggestedVerses.map((s, idx) => (
                      <div key={idx} className="p-5 bg-[#0B1220] rounded-[18px] border border-white/5 group relative overflow-hidden transition-all hover:border-[#F59E0B]/30 shadow-md">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B] group-hover:bg-[#F59E0B] transition-colors"></div>
                        <h4 className="font-bold text-[10px] uppercase tracking-wider text-[#F59E0B] mb-2">{s.reference}</h4>
                        <p className="font-serif text-white text-[15px] leading-relaxed">"{s.text}"</p>
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
