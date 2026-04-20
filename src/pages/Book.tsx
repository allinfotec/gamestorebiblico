import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBible } from '../context/BibleContext';
import { ArrowLeft, BookOpen } from 'lucide-react';

export function Book() {
  const { abbrev } = useParams<{ abbrev: string }>();
  const { books } = useBible();
  const navigate = useNavigate();

  const book = books.find(b => b.abbrev === abbrev);

  if (!book) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      <header className="flex flex-col px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10 transition-colors duration-300 shadow-sm">
        <button onClick={() => navigate(-1)} className="self-start p-2 -ml-2 mb-2 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-900 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-white dark:bg-black flex items-center justify-center text-black dark:text-white shrink-0 border border-gray-200 dark:border-slate-800 shadow-sm">
             <BookOpen size={20} />
           </div>
           <div>
             <h1 className="text-3xl font-serif font-bold text-black dark:text-white leading-tight flex items-center gap-2">
               {book.name}
             </h1>
             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-[0.15em] uppercase mt-1">
               {book.chapters.length} Capítulos
             </p>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-3">
          {book.chapters.map((verses, index) => {
            const chapterNum = index + 1;
            const versesCount = verses.length;
            
            return (
              <Link key={chapterNum} to={`/bible/read/${book.abbrev}/${chapterNum}`} className="block">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)] active:scale-[0.98] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgb(0,0,0,0.3)] transition-all duration-300 text-black dark:text-white group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-800 flex items-center justify-center font-serif text-lg font-bold group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                       {chapterNum}
                     </div>
                     <div>
                       <h3 className="font-sans text-[15px] font-bold">Capítulo {chapterNum}</h3>
                       <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{versesCount} versículos</p>
                     </div>
                  </div>
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400">
                    <ArrowLeft size={20} className="rotate-180 inline-block" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
