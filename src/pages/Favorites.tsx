import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function Favorites() {
  const { favorites, isDarkMode } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B1220] transition-colors duration-300 text-slate-800 dark:text-white">
      <header className="px-6 pt-10 pb-6 shrink-0 bg-white/45 dark:bg-[#0B1220]/45 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100 dark:border-emerald-500/10 shadow-sm transition-colors duration-300">
        <h1 className="text-2xl font-sans font-black flex items-center gap-2 tracking-tight text-slate-800 dark:text-white">
          Favoritos
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 pt-6 no-scrollbar">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center opacity-70">
            <Heart size={44} className="mb-4 text-emerald-500 dark:text-[#94A3B8]" />
            <p className="font-extrabold text-base mb-1 text-slate-800 dark:text-white">Nenhum favorito salvo.</p>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] max-w-xs">Leia a Bíblia e salve os seus versículos preferidos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => {
              const abbrev = fav.id.split('-')[0];
              return (
                <Link key={fav.id} to={`/bible/read/${abbrev}/${fav.chapter}`} className="block">
                  <motion.div 
                    whileTap={{ scale: 0.98 }} 
                    className="p-5 bg-white dark:bg-[#121B30]/90 border border-slate-100 dark:border-emerald-500/20 hover:border-emerald-500/40 rounded-[18px] text-slate-800 dark:text-white flex flex-col gap-3 transition-all relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] group pl-6"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-gradient-to-b from-emerald-400 to-emerald-600/90 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all shadow-[0_0_8px_rgba(52,211,153,0.55)]"></div>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#0B1220] border border-gray-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Heart size={14} className="fill-emerald-500 text-emerald-500" />
                      </div>
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-550 dark:text-emerald-400">
                        {fav.book} {fav.chapter}:{fav.verse}
                      </h3>
                    </div>
                    <p className="font-serif text-[15px] leading-relaxed opacity-95 pl-10 pr-2">
                      "{fav.text}"
                    </p>
                    <div className="flex justify-start pl-10 mt-1">
                       <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 transition-all shadow-sm">
                          Ir para Leitura <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                       </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
