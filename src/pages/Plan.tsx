import { useBible } from '../context/BibleContext';
import { useAppStore } from '../store/useAppStore';
import { plan30Days } from '../data/plan30Days';
import { ArrowLeft, CheckCircle2, Circle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Plan() {
  const navigate = useNavigate();
  const { books } = useBible();
  const { planProgress, togglePlanDay } = useAppStore();

  const completedDays = planProgress.length;
  const progressPercent = Math.round((completedDays / 30) * 100);

  const getBookName = (abbrev: string) => {
    return books.find(b => b.abbrev === abbrev)?.name || abbrev;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <header className="flex items-center px-4 h-16 border-b border-gray-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10 transition-colors duration-300 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif font-bold text-black dark:text-white ml-2">Plano de Leitura</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Progress header card */}
        <div className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-slate-800 mb-8 transition-colors duration-300 relative overflow-hidden">
           <div className="text-[11px] uppercase opacity-70 mb-2 font-bold tracking-[0.2em]">30 Dias</div>
           <div className="text-2xl font-serif font-bold mb-5">Essência da Bíblia</div>
           <div className="flex items-center justify-between text-xs opacity-90 mb-3">
             <span className="font-medium text-gray-500 dark:text-gray-400">Progresso global</span>
             <span className="font-bold text-lg">{progressPercent}%</span>
           </div>
           <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-black dark:bg-white transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
           </div>
        </div>

        {/* List of days */}
        <div className="space-y-4 pb-8">
          {plan30Days.map(({ day, label, readings }) => {
            const isCompleted = planProgress.includes(day);

            return (
              <div key={day} className={`p-5 rounded-2xl border transition-colors duration-300 ${isCompleted ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] mb-1">
                      Dia {day}
                    </div>
                    <h3 className={`font-serif text-lg font-bold mb-4 ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'}`}>
                      {label}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {readings.map((r, i) => (
                        <Link key={i} to={`/bible/read/${r.abbrev}/${r.chapter}`}>
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-gray-100 dark:bg-slate-800 border-transparent text-gray-400 dark:text-gray-500 line-through' 
                              : 'bg-white dark:bg-black border-gray-200 dark:border-slate-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 shadow-[0_1px_2px_rgb(0,0,0,0.05)]'
                          }`}>
                            {isCompleted && <Check size={14} />}
                            {getBookName(r.abbrev)} {r.chapter}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <button onClick={() => togglePlanDay(day)} className="p-2 -mr-2 text-black dark:text-white hover:scale-110 transition-transform">
                    {isCompleted ? (
                      <CheckCircle2 size={28} className="fill-black text-white dark:fill-white dark:text-black" />
                    ) : (
                      <Circle size={28} className="text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
