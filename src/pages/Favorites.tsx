import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function Favorites() {
  const { favorites } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <header className="px-5 pt-8 pb-4 shrink-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-black dark:text-white flex items-center gap-2 mb-2">
          Favoritos
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-36 pt-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Heart size={48} className="mb-4 text-gray-400 dark:text-slate-600" />
            <p className="text-black dark:text-white font-medium mb-1">Nenhum favorito salvo.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Leia a Bíblia e salve os seus versículos preferidos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => {
              const abbrev = fav.id.split('-')[0];
              return (
                <Link key={fav.id} to={`/bible/read/${abbrev}/${fav.chapter}`} className="block">
                  <motion.div whileTap={{ scale: 0.98 }} className="p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] text-black dark:text-white flex flex-col gap-3 transition-colors relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black dark:bg-white rounded-r-sm"></div>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <Heart size={14} className="fill-gray-600 text-gray-600 dark:fill-gray-300 dark:text-gray-300" />
                      </div>
                      <h3 className="font-bold text-[13px] uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        {fav.book} {fav.chapter}:{fav.verse}
                      </h3>
                    </div>
                    <p className="font-serif text-[15px] leading-relaxed opacity-90 pl-[44px]">
                      "{fav.text}"
                    </p>
                    <div className="flex justify-start pl-[44px] mt-1">
                       <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-black dark:text-white px-4 py-2 rounded-xl border border-transparent dark:border-slate-700 shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                          Ir para Leitura <ArrowRight size={14} />
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
