import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function Favorites() {
  const { favorites } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-[#0B1220] text-white">
      <header className="px-6 pt-10 pb-6 shrink-0 bg-[#0B1220]/90 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Favoritos
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-36 pt-6 no-scrollbar">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center opacity-70">
            <Heart size={44} className="mb-4 text-[#94A3B8]" />
            <p className="text-white font-extrabold text-base mb-1">Nenhum favorito salvo.</p>
            <p className="text-sm text-[#94A3B8] max-w-xs">Leia a Bíblia e salve os seus versículos preferidos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => {
              const abbrev = fav.id.split('-')[0];
              return (
                <Link key={fav.id} to={`/bible/read/${abbrev}/${fav.chapter}`} className="block">
                  <motion.div 
                    whileTap={{ scale: 0.98 }} 
                    className="p-5 bg-[#172033]/90 hover:bg-[#172033] border border-white/10 hover:border-[#3B82F6]/30 rounded-[18px] text-white flex flex-col gap-3 transition-all relative overflow-hidden shadow-lg group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F59E0B] rounded-r-md"></div>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-8 h-8 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shrink-0">
                        <Heart size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                      </div>
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#94A3B8]">
                        {fav.book} {fav.chapter}:{fav.verse}
                      </h3>
                    </div>
                    <p className="font-serif text-[15px] leading-relaxed opacity-95 pl-10 pr-2">
                      "{fav.text}"
                    </p>
                    <div className="flex justify-start pl-10 mt-1">
                       <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 text-[#3B82F6] px-4 py-2.5 rounded-xl border border-[#3B82F6]/25 transition-all shadow-md">
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
