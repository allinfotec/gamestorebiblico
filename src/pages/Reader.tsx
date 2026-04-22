import { useParams, useNavigate } from 'react-router-dom';
import { useBible } from '../context/BibleContext';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, ZoomIn, ZoomOut, Bot, Heart, Play, Share2, Image as ImageIcon, X, ChevronLeft, ChevronRight, Volume2, Square } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { explainVerse } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

export function Reader() {
  const { abbrev, chapterStr } = useParams<{ abbrev: string, chapterStr: string }>();
  const chapterNum = parseInt(chapterStr || '1', 10);
  const { books } = useBible();
  const navigate = useNavigate();
  const { fontSize, setFontSize, toggleFavorite, favorites } = useAppStore();
  
  const book = books.find(b => b.abbrev === abbrev);
  const chapterText = book?.chapters?.[chapterNum - 1]; // array of verses
  const totalChapters = book?.chapters?.length || 1;

  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'playing'>('idle');
  const [chapterInput, setChapterInput] = useState(chapterNum.toString());
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const verseImageRef = useRef<HTMLDivElement>(null);

  // Sync internal input when url changes
  useEffect(() => {
    setChapterInput(chapterNum.toString());
  }, [chapterNum]);

  // Scroll to top on chapter change and cancel speech
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    stopSpeech();
  }, [chapterNum, abbrev]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!book || !chapterText) return <div className="p-5 text-center">Capítulo não encontrado</div>;

  const increaseFont = () => setFontSize(Math.min(fontSize + 2, 32));
  const decreaseFont = () => setFontSize(Math.max(fontSize - 2, 12));

  const navPrev = () => {
    if (chapterNum > 1) {
      navigate(`/bible/read/${abbrev}/${chapterNum - 1}`);
    } else {
      const bIndex = books.findIndex(b => b.abbrev === abbrev);
      if (bIndex > 0) {
        const prevBook = books[bIndex - 1];
        navigate(`/bible/read/${prevBook.abbrev}/${prevBook.chapters.length}`);
      }
    }
  };

  const navNext = () => {
    if (chapterNum < totalChapters) {
      navigate(`/bible/read/${abbrev}/${chapterNum + 1}`);
    } else {
      const bIndex = books.findIndex(b => b.abbrev === abbrev);
      if (bIndex < books.length - 1) {
        const nextBook = books[bIndex + 1];
        navigate(`/bible/read/${nextBook.abbrev}/1`);
      }
    }
  };

  const handleExplain = async () => {
    if (selectedVerse === null) return;
    setIsExplaining(true);
    setAiExplanation(null);
    try {
      const text = chapterText[selectedVerse - 1];
      const refString = `${book.name} ${chapterNum}:${selectedVerse}`;
      const explanation = await explainVerse(refString, text);
      setAiExplanation(explanation);
    } catch (e: any) {
      setAiExplanation("Ocorreu um erro ao conectar com o assistente.");
    } finally {
      setIsExplaining(false);
    }
  };

  const isFavorite = (v: number) => {
    return favorites.some(f => f.id === `${abbrev}-${chapterNum}-${v}`);
  }

  const handleFavorite = (v: number) => {
    toggleFavorite({
      id: `${abbrev}-${chapterNum}-${v}`,
      book: book.name,
      chapter: chapterNum,
      verse: v,
      text: chapterText[v - 1]
    });
  };

  const handleShare = async (verseNum: number) => {
    const textToShare = `"${chapterText[verseNum - 1]}"\n- ${book.name} ${chapterNum}:${verseNum}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bíblia Sagrada',
          text: textToShare,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      try {
        await navigator.clipboard.writeText(textToShare);
        alert('Versículo copiado para a área de transferência!');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleShareImage = async () => {
    if (selectedVerse === null || !verseImageRef.current) return;
    setIsGeneratingImage(true);
    
    try {
      // Small pause to ensure ref is completely rendered
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(verseImageRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `versiculo_${abbrev}_${chapterNum}_${selectedVerse}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Versículo',
          files: [file],
        });
      } else {
        // Fallback to download
        const link = document.createElement('a');
        link.download = file.name;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error('Error generating or sharing image', e);
      alert('Não foi possível gerar a imagem.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleChapterJump = () => {
    const parsed = parseInt(chapterInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalChapters) {
      navigate(`/bible/read/${abbrev}/${parsed}`);
    } else {
      // Revert if invalid
      setChapterInput(chapterNum.toString());
    }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    if (!text) {
      setSpeechStatus('idle');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setSpeechStatus('idle');
    setSpeechStatus('playing');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeechStatus('idle');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors duration-300">
      
      {/* Hidden Div for Image Rendering */}
      {selectedVerse !== null && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <div 
            ref={verseImageRef} 
            className="w-[1080px] h-[1080px] bg-gradient-to-br from-rose-50 via-white to-orange-50 p-24 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-rose-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-orange-200/40 rounded-full blur-3xl"></div>
            
            <div className="z-10 bg-white/60 backdrop-blur-sm p-16 rounded-3xl border border-white shadow-xl flex flex-col items-center justify-center w-full h-full">
              <span className="text-6xl text-rose-300 mb-8 opacity-50 font-serif">"</span>
              <p className="text-4xl font-serif text-gray-800 leading-[1.6] px-8">
                {chapterText[selectedVerse - 1]}
              </p>
              <div className="mt-16 w-16 h-1 bg-rose-300 rounded-full mb-8"></div>
              <p className="text-2xl font-bold text-gray-600 uppercase tracking-widest">
                {book.name} {chapterNum}:{selectedVerse}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-20 shrink-0 transition-colors duration-300 shadow-sm">
        <button onClick={() => navigate(`/bible/book/${abbrev}`)} className="p-2 -ml-2 text-black dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-center flex-1 mx-2">
          <span className="text-lg font-sans font-bold text-black dark:text-white tracking-wide whitespace-nowrap">
            {book.name}
          </span>
          <input 
            type="number" 
            inputMode="numeric"
            value={chapterInput}
            onChange={(e) => setChapterInput(e.target.value)}
            onBlur={handleChapterJump}
            onKeyDown={(e) => e.key === 'Enter' && handleChapterJump()}
            className="w-14 ml-2 pl-2 pr-1 py-1 text-lg font-bold text-center bg-gray-100 dark:bg-slate-800 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={decreaseFont} className="p-2 text-black dark:text-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"><ZoomOut size={20} /></button>
          <button onClick={increaseFont} className="p-2 text-black dark:text-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"><ZoomIn size={20} /></button>
        </div>
      </header>

      {/* Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 py-6 pb-24 text-black dark:text-white"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
      >
        <div className="max-w-prose mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Livro Sagrado</h2>
            <button 
              onClick={() => speechStatus === 'playing' ? stopSpeech() : speakText(chapterText.join('. '))} 
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full text-[11px] font-bold text-black dark:text-white uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-sm"
            >
              {speechStatus === 'playing' ? <Square size={14} /> : <Volume2 size={14} />}
              {speechStatus === 'playing' ? 'Parar' : 'Ouvir Capítulo'}
            </button>
          </div>

          {chapterText.map((text, i) => {
            const vNum = i + 1;
            const selected = selectedVerse === vNum;
            const fav = isFavorite(vNum);
            
            return (
              <span
                key={vNum}
                onClick={() => setSelectedVerse(selected ? null : vNum)}
                className={`font-serif cursor-pointer inline transition-colors 
                  ${selected ? 'bg-gray-100 dark:bg-slate-800/80 rounded block -mx-2 px-2 py-1 my-1' : ''}
                  ${fav && !selected ? 'border-b-[1.5px] border-dashed border-gray-400 dark:border-slate-500' : ''}
                `}
              >
                <sup className="text-[0.6em] text-gray-400 dark:text-gray-500 font-sans font-bold pr-1.5 select-none">
                  {vNum}
                </sup>
                <span className={`text-black dark:text-white ${selected ? 'font-medium' : ''}`}>{text}</span>
                {' '}
              </span>
            );
          })}
        </div>
        
        {/* Navigation buttons at end of chapter */}
        <div className="flex justify-between items-center mt-12 py-6 border-t border-gray-100 dark:border-slate-800 gap-4">
          <button onClick={navPrev} className="flex-1 flex flex-col items-start px-4 py-3 hover:opacity-80 transition-opacity bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-gray-300/80 dark:shadow-gray-400/30 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 font-bold">Anterior</span>
            <span className="text-sm font-sans font-bold text-black dark:text-white flex items-center gap-1">
               <ChevronLeft size={16} /> Voltar
            </span>
          </button>
          <button onClick={navNext} className="flex-1 flex flex-col items-end px-4 py-3 hover:opacity-80 transition-opacity bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-gray-300/80 dark:shadow-gray-400/30 border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 font-bold">Próximo</span>
            <span className="text-sm font-sans font-bold text-black dark:text-white flex items-center gap-1">
              Avançar <ChevronRight size={16} />
            </span>
          </button>
        </div>
      </div>

      {/* Selected Verse Bottom Sheet */}
      <AnimatePresence>
        {selectedVerse !== null && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-16 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-3xl border-t border-gray-100 dark:border-slate-800 z-30 flex flex-col max-h-[80vh] overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mt-3 mb-2 shrink-0"></div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-sans font-bold text-sm text-black dark:text-white uppercase tracking-wider">
                  {book.name} {chapterNum}:{selectedVerse}
                </h3>
                <button onClick={() => { setSelectedVerse(null); setAiExplanation(null); setIsExplaining(false); }} className="p-1.5 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <p className="font-serif text-black dark:text-white text-[17px] leading-relaxed mb-6 border-l-[3px] border-gray-200 dark:border-slate-700 pl-4 py-1">
                "{chapterText[selectedVerse - 1]}"
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                 <button onClick={() => handleFavorite(selectedVerse)} className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors shadow-lg ${isFavorite(selectedVerse) ? 'bg-black text-white shadow-gray-500/60 dark:bg-white dark:text-black dark:shadow-gray-400/30' : 'bg-white border border-gray-200 text-black shadow-gray-400/60 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:shadow-gray-400/30 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                    <Heart size={20} className={isFavorite(selectedVerse) ? 'fill-white dark:fill-black' : ''} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{isFavorite(selectedVerse) ? 'Salvo' : 'Favoritar'}</span>
                 </button>
                 <button onClick={() => handleShare(selectedVerse)} className="py-3 bg-white border border-gray-200 text-black rounded-2xl flex flex-col items-center justify-center gap-1.5 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <Share2 size={20} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Texto</span>
                 </button>
                 <button onClick={handleShareImage} disabled={isGeneratingImage} className="py-3 bg-white border border-gray-200 text-black rounded-2xl flex flex-col items-center justify-center gap-1.5 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                    <ImageIcon size={20} className={isGeneratingImage ? "animate-pulse" : ""} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Imagem</span>
                 </button>
                 <button onClick={() => speechStatus === 'playing' ? stopSpeech() : speakText(chapterText[selectedVerse - 1])} className="py-3 bg-white border border-gray-200 text-black rounded-2xl flex flex-col items-center justify-center gap-1.5 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-lg shadow-gray-400/60 dark:shadow-gray-400/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    {speechStatus === 'playing' ? <Square size={20} /> : <Volume2 size={20} />}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{speechStatus === 'playing' ? 'Parar' : 'Ouvir Ler'}</span>
                 </button>
                 <button onClick={handleExplain} className="col-span-2 md:col-span-1 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-500/60 dark:shadow-gray-400/30">
                    <Bot size={20} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Explicar</span>
                 </button>
              </div>

              {/* IA Explanation Area */}
              {(isExplaining || aiExplanation) && (
                <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 mb-2 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] text-black dark:text-white">
                  <div className="flex items-center gap-2 mb-4 font-bold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    <Sparkles size={16} className="text-gray-600 dark:text-gray-400"/> IA Explica
                  </div>
                  {isExplaining ? (
                    <div className="flex flex-col gap-2.5">
                       <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse w-full"></div>
                       <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse w-5/6"></div>
                       <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse w-4/6"></div>
                    </div>
                  ) : (
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-sans opacity-90 text-gray-800 dark:text-gray-300">
                      {aiExplanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sparkle inline icon for AI
function Sparkles({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
