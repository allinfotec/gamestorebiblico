import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Lightbulb, Star, ChevronRight, Leaf, Play, BookOpen, Brain, Sparkles, Heart, FileText, Settings, X, Trash2, Moon, Sun, Check, MessageSquare, ShieldAlert, Trophy, Gift, RefreshCw, ArrowDown } from 'lucide-react';
import { useCacaPalavrasStore } from '../store/useCacaPalavrasStore';
import { useAppStore } from '../store/useAppStore';

import davidShepherdImg from '../assets/images/david_shepherd_1781357759499.jpg';
import davidKingImg from '../assets/images/david_king_1781357773803.jpg';

const verses = [
  { img: "https://www.heroesbibletrivia.org/wp-content/uploads/2021/01/facebook.jpg", title: "Game Store Bible", subtitle: "Bem-vindo ao acervo cristão" },
  { img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800", title: "Amor de Deus", subtitle: "João 3:16" },
  { img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800", title: "O Bom Pastor", subtitle: "Salmos 23:1" }
];

const games = [
  {
    id: 1,
    title: "King David 2D",
    subtitle: "Derrube os leões e proteja as ovelhas",
    img: davidShepherdImg,
    rating: "4.8",
    action: "king-david-game"
  },
  {
    id: 2,
    title: "King David 3D",
    subtitle: "Ação em terceira pessoa como o Rei de Israel",
    rating: "4.9",
    img: davidKingImg,
    action: "https://king-david3d.vercel.app/"
  }
];

export function StoreFront() {
  const navigate = useNavigate();
  const { completedPhases, resetProgress: resetCacaPalavrasProgress } = useCacaPalavrasStore();
  const { version, setVersion, isDarkMode, toggleDarkMode, fontSize, setFontSize } = useAppStore();
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const getFontSizeCls = (baseTextClass: string) => {
    if (fontSize === 14) {
      if (baseTextClass === 'text-xs') return 'text-[11px]';
      if (baseTextClass === 'text-sm') return 'text-xs';
      if (baseTextClass === 'text-base') return 'text-sm';
      if (baseTextClass === 'text-lg') return 'text-base';
      if (baseTextClass === 'text-xl') return 'text-lg';
      if (baseTextClass === 'text-2xl') return 'text-xl';
      if (baseTextClass === 'text-[11px]') return 'text-[9.5px]';
      if (baseTextClass === 'text-[12.5px]') return 'text-[11px]';
      if (baseTextClass === 'text-[13.5px]') return 'text-[12px]';
      if (baseTextClass === 'text-[14.5px]') return 'text-xs';
      if (baseTextClass === 'text-[15px]') return 'text-sm';
      if (baseTextClass === 'text-[10px]') return 'text-[9px]';
    } else if (fontSize === 22) {
      if (baseTextClass === 'text-xs') return 'text-sm';
      if (baseTextClass === 'text-sm') return 'text-base';
      if (baseTextClass === 'text-base') return 'text-lg';
      if (baseTextClass === 'text-lg') return 'text-xl';
      if (baseTextClass === 'text-xl') return 'text-2xl';
      if (baseTextClass === 'text-2xl') return 'text-3xl';
      if (baseTextClass === 'text-[11px]') return 'text-xs';
      if (baseTextClass === 'text-[12.5px]') return 'text-sm';
      if (baseTextClass === 'text-[13.5px]') return 'text-[15px]';
      if (baseTextClass === 'text-[14.5px]') return 'text-base';
      if (baseTextClass === 'text-[15px]') return 'text-lg';
      if (baseTextClass === 'text-[10px]') return 'text-[11px]';
    }
    return baseTextClass;
  };
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState<number | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef<number | null>(null);
  const isDraggingRef = React.useRef(false);

  const [notifications, setNotifications] = useState([
    { id: 5, title: '🎁 Atualização Disponível!', text: 'Melhorias de desempenho prontas! Deslize/puxe a tela inicial de cima para baixo para carregar os novos ajustes.', date: 'Agora', read: false },
    { id: 1, title: 'Bíblia Atualizada', text: 'Estudos bíblicos integrados à Inteligência Artificial disponíveis.', date: 'Hoje', read: false },
    { id: 2, title: 'Progresso Diário', text: 'Não se esqueça de ler o Versículo do Dia!', date: 'Hoje', read: false },
    { id: 3, title: 'Novo Jogo Liberado', text: 'Modo Caça-Palavras com novos temas de sabedoria.', date: 'Ontem', read: true }
  ]);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(60);
    
    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
      
      setNotifications(prev => prev.map(n => {
        if (n.id === 5) {
          return {
            ...n,
            title: '✅ Versão Instalada com Sucesso!',
            text: 'O aplicativo foi atualizado com as últimas correções e novidades de interface neon!',
            date: 'Agora',
            read: false
          };
        }
        return n;
      }));
      
      showToast('✨ Aplicativo totalmente atualizado!');
    }, 1800);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop === 0 && !isRefreshing) {
      startYRef.current = e.touches[0].clientY;
      isDraggingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || startYRef.current === null || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0) {
      const dampedDistance = Math.min(diff * 0.45, 110);
      setPullDistance(dampedDistance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startYRef.current = null;
    
    if (pullDistance > 55) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop === 0 && !isRefreshing) {
      startYRef.current = e.clientY;
      isDraggingRef.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || startYRef.current === null || isRefreshing) return;
    const diff = e.clientY - startYRef.current;
    if (diff > 0) {
      const dampedDistance = Math.min(diff * 0.45, 110);
      setPullDistance(dampedDistance);
    } else {
      setPullDistance(0);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startYRef.current = null;
    
    if (pullDistance > 55) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const hasUnreadNotification = notifications.some(n => !n.read);

  const completedCount = completedPhases.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetCacaPalavras = async () => {
    try {
      await resetCacaPalavrasProgress();
      showToast('Progresso redefinido com sucesso!');
      setShowResetConfirmation(false);
    } catch (e) {
      console.error(e);
      showToast('Erro ao redefinir progresso');
    }
  };

  const toggleReadNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setExpandedNotificationId(prev => prev === id ? null : id);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notificações limpas');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 15) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) {
      setGreeting('Bom dia 👋');
      setMotivationalMessage('Continue sua jornada hoje.');
    } else if (hr < 18) {
      setGreeting('Boa tarde ☀️');
      setMotivationalMessage('Você está indo muito bem.');
    } else {
      setGreeting('Boa noite 🌙');
      setMotivationalMessage('Mais um capítulo concluído.');
    }

    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(d.toLocaleDateString('pt-BR', options));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % verses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (action: string) => {
    if (action === 'bible') {
      navigate('/bible');
    } else if (action === 'word_of_day') {
      navigate('/word-of-the-day');
    } else if (action === 'caca_palavras') {
      navigate('/caca-palavras');
    } else if (action === 'king-david-game') {
      navigate('/king-david-game');
    } else if (action === 'plan') {
      navigate('/bible/plan');
    } else if (action === 'favorites') {
      navigate('/bible/favorites');
    } else if (action === 'ai-hub') {
      navigate('/bible/ai-hub');
    } else if (action === 'quiz') {
      navigate('/bible/quiz');
    } else if (action.startsWith('http')) {
      window.location.href = action;
    } else {
      alert('Em breve!');
    }
  };

  const shareIdea = () => {
    const feedbackText = 'Olá! Tive uma ideia brilhante para melhorar o app Game Store Bible:\n\n[Sua ideia aqui]\n\nBaixe o app: https://gamestorebiblico.netlify.app/';
    if (navigator.share) {
      navigator.share({ title: 'Ideia - Game Store Bible', text: feedbackText }).catch(console.error);
    } else {
      navigator.clipboard.writeText(feedbackText);
      alert('Texto copiado!\nCole na sua rede social.');
    }
  };

  return (
    <div className={`antialiased min-h-screen transition-colors duration-500 relative overflow-hidden font-sans ${
      isDarkMode ? 'bg-[#0B1220] text-white' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      {/* Modern Glowing Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full transition-all duration-700 ${
          isDarkMode 
            ? 'bg-[#3B82F6]/15 opacity-60 blur-[120px]' 
            : 'bg-blue-100/30 opacity-70 blur-[100px]'
        }`}></div>
        <div className={`absolute top-[30%] right-[-10%] w-[450px] h-[450px] rounded-full transition-all duration-700 ${
          isDarkMode 
            ? 'bg-[#F59E0B]/10 opacity-40 blur-[110px]' 
            : 'bg-amber-100/20 opacity-50 blur-[100px]'
        }`}></div>
        <div className={`absolute bottom-[-10%] left-[15%] w-[400px] h-[400px] rounded-full transition-all duration-700 ${
          isDarkMode 
            ? 'bg-[#3B82F6]/10 opacity-50 blur-[100px]' 
            : 'bg-teal-50/30 opacity-50 blur-[90px]'
        }`}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto h-screen overflow-hidden">
        {/* HEADER FIXO - POSICIONADO ABSOLUTAMENTE PARA PERMITIR CONTEÚDO PASSAR POR TRÁS */}
        <header className={`absolute top-0 left-0 right-0 z-20 w-full flex justify-between items-center px-6 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? isDarkMode 
              ? 'bg-[#0B1220]/50 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] pt-5 pb-4' 
              : 'bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_12px_40px_rgba(0,0,0,0.06)] pt-5 pb-4'
            : 'bg-transparent border-b border-transparent pt-8 pb-4'
        }`}>
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setIsSettingsOpen(true)}
              className="relative cursor-pointer active:scale-95 hover:scale-105 transition-all duration-300"
            >
              <img 
                src="https://res.cloudinary.com/donb73jnb/image/upload/v1777405912/leaodatribo_sq5riz.jpg" 
                className={`w-11 h-11 rounded-full object-cover border-2 transition-all duration-500 ${
                  isDarkMode 
                    ? 'border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.35)]' 
                    : 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                }`}
                alt="Avatar do Usuário" 
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 rounded-full transition-colors duration-500 ${isDarkMode ? 'border-[#0B1220]' : 'border-white'}`}></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`${getFontSizeCls('text-[10px]')} uppercase tracking-wider font-bold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>{currentDate}</span>
              <h2 className={`${getFontSizeCls('text-[15px]')} font-extrabold tracking-tight leading-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{greeting}</h2>
              <p className={`${getFontSizeCls('text-[10px]')} font-semibold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{motivationalMessage}</p>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0 items-center">
            {/* COMPARTILHAR FEEDBACK */}
            <button 
              onClick={shareIdea}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 duration-500 ${
                isDarkMode 
                  ? 'bg-[#172033]/80 border border-[#3B82F6]/35 text-white/95 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.25)]' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-500 shadow-sm'
              }`}
              title="Compartilhar Feedback"
            >
              <Lightbulb size={15} />
            </button>
            
            {/* NOTIFICAÇÕES */}
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 duration-500 ${
                isDarkMode 
                  ? 'bg-[#172033]/80 border border-[#3B82F6]/35 text-white/95 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.25)]' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-500 shadow-sm'
              }`}
              title="Notificações"
            >
              <Bell size={15} />
              {hasUnreadNotification && (
                <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 rounded-full animate-ping ${isDarkMode ? 'border-[#172033]' : 'border-white'}`}></span>
              )}
              {hasUnreadNotification && (
                <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 rounded-full ${isDarkMode ? 'border-[#172033]' : 'border-white'}`}></span>
              )}
            </button>

            {/* Alternador de Tema (Pill Switch Animado) */}
            <div className={`relative flex items-center p-0.5 rounded-full border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-slate-950/60 border-white/10' 
                : 'bg-slate-100 border-slate-200 shadow-inner'
              } h-8 w-16`}
            >
              <motion.div 
                layout 
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute h-[24px] w-[24px] rounded-full shadow-md flex items-center justify-center cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-yellow-500 right-0.5' 
                    : 'bg-white text-yellow-600 left-0.5'
                }`}
              />
              <button 
                onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                className="flex-1 h-full z-10 flex items-center justify-center cursor-pointer focus:outline-none"
                title="Modo Claro"
              >
                <Sun size={12} className={`${!isDarkMode ? 'text-amber-500 scale-110 opacity-100' : 'text-slate-500 opacity-60'} transition-all duration-300`} />
              </button>
              <button 
                onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                className="flex-1 h-full z-10 flex items-center justify-center cursor-pointer focus:outline-none"
                title="Modo Cosmos"
              >
                <Moon size={11} className={`${isDarkMode ? 'text-indigo-400 scale-110 opacity-100' : 'text-slate-400 opacity-60'} transition-all duration-300`} />
              </button>
            </div>

            {/* CONFIGURAÇÕES */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 duration-500 ${
                isDarkMode 
                  ? 'bg-[#172033]/80 border border-[#3B82F6]/35 text-white/95 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.25)]' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-500 shadow-sm'
              }`}
              title="Configurações"
            >
              <Settings size={15} />
            </button>
          </div>
        </header>

        {/* PULL TO REFRESH NEON INDICATOR */}
        {(pullDistance > 0 || isRefreshing) && (
          <div 
            className="absolute left-0 right-0 flex justify-center items-center z-30 pointer-events-none transition-all duration-300"
            style={{ 
              top: '120px', 
              opacity: Math.min(pullDistance / 50, 1),
              transform: `scale(${Math.min(0.6 + (pullDistance / 115), 1)})`
            }}
          >
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2.5 backdrop-blur-md shadow-[0_12px_24px_rgba(34,197,94,0.2)] transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-emerald-950/85 to-[#0b1220]/95 border-emerald-500/40 text-emerald-400' 
                : 'bg-gradient-to-r from-emerald-50 to-white border-emerald-300 text-emerald-700'
            }`}>
              <div className="relative flex items-center justify-center">
                {isRefreshing ? (
                  <RefreshCw className="animate-spin text-emerald-400 shrink-0" size={16} strokeWidth={2.5} />
                ) : (
                  <motion.div
                    animate={{ y: pullDistance > 55 ? [-2, 2, -2] : 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ArrowDown className={`transition-transform duration-300 ${pullDistance > 55 ? 'rotate-180 text-emerald-400' : 'text-emerald-500'}`} size={16} strokeWidth={2.5} />
                  </motion.div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest font-sans">
                {isRefreshing 
                  ? 'Atualizando...' 
                  : pullDistance > 55 
                    ? 'Solte para Atualizar!' 
                    : 'Puxe para Atualizar'}
              </span>
            </div>
          </div>
        )}

        {/* CONTAINER DE SCROLL - APENAS ESTA SEÇÃO DE CONTEÚDO ROLA POR TRÁS DO HEADER */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="h-full w-full overflow-y-auto no-scrollbar pb-32 px-6 pt-[115px] space-y-8 select-none"
          style={{
            transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'none',
            transition: isDraggingRef.current ? 'none' : 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
        >
          {/* BANNER PRINCIPAL (ALTURA ENTRE 180 E 220 PIXELS) */}
          <section className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className={`relative h-[200px] w-full rounded-[24px] overflow-hidden border transition-all duration-500 flex flex-col group cursor-pointer animate-neon-green-pulse-soft ${
                  isDarkMode ? 'border-emerald-500/25' : 'border-emerald-250/20'
                }`}
              >
                <img src={verses[currentBanner].img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-105" alt="Hero" />
                {/* Modern Dark Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${
                  isDarkMode 
                    ? 'from-[#0B1220] via-[#0B1220]/60 to-transparent' 
                    : 'from-slate-900/80 via-slate-900/40 to-transparent'
                }`}></div>
                
                {/* Content Details */}
                <div className="absolute bottom-0 left-0 w-full px-5 pb-5 pt-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider bg-[#F59E0B] text-[#0B1220] mb-2 uppercase">
                    DESTAQUE
                  </span>
                  <h2 className="text-white text-lg font-extrabold tracking-tight mb-0.5 drop-shadow-md">
                    {verses[currentBanner].title}
                  </h2>
                  <p className="text-slate-200 text-[11px] font-semibold opacity-95 leading-normal max-w-md line-clamp-1">
                    {verses[currentBanner].subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-3 gap-1.5 animate-fade-in">
              {verses.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentBanner 
                      ? isDarkMode ? 'w-5 bg-[#3B82F6]' : 'w-5 bg-blue-600' 
                      : isDarkMode ? 'w-1 bg-white/20' : 'w-1 bg-slate-300'
                  }`}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* VERSÍCULO DO DIA (ILUSTRADO) */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-md font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span>📖</span> Versículo do Dia
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-[#F59E0B]' : 'text-amber-600'}`}>MENSAGEM</span>
            </div>
            
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick('word_of_day')}
              className={`relative rounded-[24px] border p-5 overflow-hidden cursor-pointer group flex flex-col gap-3 transition-all duration-500 animate-neon-green-pulse-soft ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-[#121B30] via-[#0D1527] to-[#121B30] border-emerald-500/25' 
                  : 'bg-gradient-to-br from-[#EEF2FF] via-white to-[#F8FAFC] border-emerald-250/35'
              }`}
            >
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 bg-[url('https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center pointer-events-none rounded-r-[24px]" />
              
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full border transition-all duration-500 ${
                  isDarkMode ? 'bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#F59E0B]' : 'bg-amber-50 border-amber-200 text-amber-600'
                }`}>
                  <Leaf size={16} />
                </div>
                <span className={`${getFontSizeCls('text-xs')} font-extrabold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Sabedoria Diária</span>
              </div>
              
              <p className={`${getFontSizeCls('text-sm')} font-bold italic leading-relaxed z-10 max-w-[70%] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho."
              </p>
              <span className={`${getFontSizeCls('text-xs')} font-extrabold z-10 transition-colors duration-500 ${isDarkMode ? 'text-[#F59E0B]' : 'text-amber-600'}`}>— Salmos 119:105</span>
              
              <div className={`flex justify-between items-center mt-2 pt-2 border-t transition-colors duration-500 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <span className={`${getFontSizeCls('text-[10px]')} font-semibold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Toque para ouvir e estudar</span>
                <span className={`${getFontSizeCls('text-[10px]')} font-bold flex items-center gap-0.5 group-hover:underline transition-colors duration-500 ${isDarkMode ? 'text-[#3B82F6]' : 'text-blue-600'}`}>
                  Acessar <ChevronRight size={10} />
                </span>
              </div>
            </motion.div>
          </section>

          {/* CAÇA-PALAVRAS (MAPA DE GAMIFICAÇÃO COGNITIVA) */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-md font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span>🎮</span> Jogos Bíblicos e Desafios
              </h2>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors duration-500 ${
                isDarkMode ? 'bg-[#3B82F6]/10 border-[#3B82F6]/15 text-[#3B82F6]' : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}>GAMIFICAÇÃO</span>
            </div>

            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick('caca_palavras')}
              className={`relative rounded-[24px] border p-5 overflow-hidden cursor-pointer group flex items-center justify-between gap-4 transition-all duration-500 animate-neon-green-pulse-soft ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-[#121B30] to-[#0D1527] border-emerald-500/25' 
                  : 'bg-white border-emerald-250/35 shadow-sm'
              }`}
            >
              <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-2xl group-hover:opacity-15 transition-all pointer-events-none ${isDarkMode ? 'bg-[#f59e0b]/10' : 'bg-blue-500/5'}`} />
              
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-md tracking-widest animate-pulse ${
                    isDarkMode ? 'bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B]' : 'bg-amber-50 border border-amber-200 text-amber-600'
                  }`}>NOVO</span>
                  <span className={`${getFontSizeCls('text-[10px]')} font-bold transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>Jogo Exclusivo</span>
                </div>
                
                <h3 className={`${getFontSizeCls('text-lg')} font-black tracking-tight flex items-center gap-1.5 transition-colors duration-500 group-hover:text-[#3B82F6] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Caça-Palavras 🔎
                </h3>
                <p className={`${getFontSizeCls('text-[11px]')} font-semibold leading-relaxed mt-1 mb-4 pr-4 transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  Encontre palavras sagradas ocultas, complete desafios e desvende novos mundos!
                </p>

                <div className="space-y-1.5 max-w-xs">
                  <div className={`flex justify-between ${getFontSizeCls('text-[10px]')} font-bold tracking-wider uppercase transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>
                    <span>Fases Concluídas</span>
                    <span className={`font-black ${isDarkMode ? 'text-[#F59E0B]' : 'text-amber-600'}`}>{completedCount} / 50</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1220]' : 'bg-slate-100'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-[#3B82F6] to-[#F59E0B] transition-all duration-[1s]" 
                      style={{ width: `${Math.min(100, Math.round((completedCount / 50) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 outline-none hover:scale-110 active:scale-95 animate-neon-green-pulse ${
                isDarkMode 
                  ? 'bg-gradient-to-tr from-emerald-500 to-green-400 border-emerald-400/50 text-[#070C18]' 
                  : 'bg-gradient-to-tr from-emerald-600 to-green-500 border-emerald-500/25 text-white'
              }`}>
                <Play size={17} className="fill-current ml-0.5" strokeWidth={2.5} />
              </button>
            </motion.div>
          </section>

          {/* OUTROS JOGOS DE AÇÃO */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>Outros Jogos de Ação</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              {games.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => handleCardClick(g.action)}
                  className={`border rounded-[20px] p-3.5 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] active:scale-[0.96] group relative overflow-hidden animate-neon-green-pulse ${
                    isDarkMode 
                      ? 'bg-[#172033]/70 hover:bg-[#172033] border-emerald-500/30 text-white' 
                      : 'bg-white hover:bg-slate-50 border-emerald-200/50 text-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <div className={`absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded scale-90 z-10 border transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/10' 
                      : 'bg-amber-50 text-amber-600 border-amber-200/50'
                  }`}>
                    <Star size={10} className="fill-[#F59E0B] shrink-0" />
                    <span className="text-[9px] font-bold">{g.rating}</span>
                  </div>

                  <div>
                    <div className={`w-[42px] h-[42px] rounded-[10px] overflow-hidden shrink-0 border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-[#0B1220]/50 border-white/5' 
                        : 'bg-slate-50 border-slate-100'
                    } mb-3.5`}>
                      <img src={g.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={g.title} />
                    </div>

                    <h3 className={`font-extrabold ${getFontSizeCls('text-[13.5px]')} tracking-tight truncate leading-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{g.title}</h3>
                    <p className={`${getFontSizeCls('text-[10px]')} leading-snug line-clamp-2 mt-1 transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                      {g.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-green-400/15 text-[#4ADE80] border border-emerald-500/30 shadow-[0_0_12px_rgba(34,197,94,0.15)] group-hover:animate-neon-green-pulse' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-250/50 shadow-sm group-hover:animate-neon-green-pulse'
                    }`}>
                      Jogar <ChevronRight size={10} strokeWidth={3} className="text-emerald-400" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LISTVIEW PREMIUM (CRISTÃO INTEGRADO COM RIPPLE/SCALE FEEDBACKS) */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-md font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span>📋</span> Recursos para Você
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>BIBLIOTECA</span>
            </div>

            <div className="space-y-3 animate-fade-in">
              {[
                { 
                  id: 'bible', 
                  title: 'Bíblia Offline 📖', 
                  subtitle: 'Leia todos os livros da Bíblia de forma fluida.', 
                  colorDark: 'from-blue-600/20 to-blue-900/10 border-blue-500/20',
                  colorLight: 'from-blue-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-blue-500/20',
                  badge: 'Offline',
                  image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=150'
                },
                { 
                  id: 'caca_palavras', 
                  title: 'Caça-Palavras 🎮', 
                  subtitle: 'Desafios enriquecedores com recompensas bíblicas.', 
                  colorDark: 'from-amber-600/20 to-amber-900/10 border-amber-500/20',
                  colorLight: 'from-amber-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-amber-500/20',
                  badge: 'Fases',
                  image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=150'
                },
                { 
                  id: 'quiz', 
                  title: 'Quiz Bíblico 🧠', 
                  subtitle: 'Incrível teste para aferir seus conhecimentos.', 
                  colorDark: 'from-purple-600/20 to-purple-900/10 border-purple-500/20',
                  colorLight: 'from-purple-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-purple-500/20',
                  badge: 'Quiz',
                  image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=150'
                },
                { 
                  id: 'plan', 
                  title: 'Plano de Leitura 📚', 
                  subtitle: 'Acompanhe seu progresso de leitura em tempo real.', 
                  colorDark: 'from-emerald-600/20 to-emerald-950/10 border-emerald-500/20',
                  colorLight: 'from-emerald-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-emerald-500/20',
                  badge: 'Metas',
                  image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=150'
                },
                { 
                  id: 'favorites', 
                  title: 'Favoritos ⭐', 
                  subtitle: 'Consulte seus versículos salvos de forma rápida.', 
                  colorDark: 'from-pink-600/20 to-pink-900/10 border-pink-500/20',
                  colorLight: 'from-pink-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-pink-500/20',
                  badge: 'Salvos',
                  image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=150'
                },
                { 
                  id: 'ai-hub', 
                  title: 'Assistente Bíblico IA 🤖', 
                  subtitle: 'Explicações e estudos detalhados com inteligência.', 
                  colorDark: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20',
                  colorLight: 'from-cyan-50/20 to-slate-50/10 border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-cyan-500/20',
                  badge: 'Inteligente',
                  image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=150'
                }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(item.id)}
                  className={`bg-gradient-to-r ${isDarkMode ? item.colorDark : item.colorLight} border p-3.5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all duration-500 flex items-center justify-between gap-4 group animate-neon-green-pulse-soft`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image} 
                      className={`w-12 h-12 rounded-xl object-cover border shrink-0 transition-colors duration-500 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
                      alt={item.title} 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`${getFontSizeCls('text-sm')} font-extrabold tracking-tight truncate transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.title}</h4>
                        <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded tracking-wider font-mono transition-colors duration-500 ${isDarkMode ? 'bg-white/5 text-white/70' : 'bg-slate-100 text-slate-500'}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className={`${getFontSizeCls('text-[11px]')} font-semibold leading-relaxed truncate transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{item.subtitle}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 active:scale-95 group-hover:animate-neon-green-pulse ${
                    isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-250 text-emerald-600 hover:bg-emerald-100'
                  }`}>
                    <ChevronRight size={13} strokeWidth={3} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CONQUISTAS (ACHIEVEMENTS PANEL) */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-md font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span>🏆</span> Suas Conquistas
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-[#3B82F6]' : 'text-blue-600'}`}>RANKING</span>
            </div>
            
            <div className={`border p-4 rounded-[24px] space-y-4 shadow-inner transition-all duration-500 animate-neon-green-pulse-soft ${
              isDarkMode 
                ? 'bg-[#121B30]/60 border-emerald-500/25' 
                : 'bg-white border-emerald-250/35 shadow-sm'
            }`}>
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all duration-500 ${
                  isDarkMode ? 'bg-[#0B1220]/60 border-white/5' : 'bg-slate-50 border-slate-150'
                }`}>
                  <Trophy size={20} className="text-[#F59E0B] mb-1 animate-pulse" />
                  <span className={`text-[9px] font-bold font-mono transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>FASES LINDAS</span>
                  <span className={`text-sm font-extrabold mt-0.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{completedCount}</span>
                </div>
                
                <div className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all duration-500 ${
                  isDarkMode ? 'bg-[#0B1220]/60 border-white/5' : 'bg-slate-50 border-slate-150'
                }`}>
                  <Star size={20} className="text-[#3B82F6] mb-1" />
                  <span className={`text-[9px] font-bold font-mono transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>MOEDAS</span>
                  <span className={`text-sm font-extrabold mt-0.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>450</span>
                </div>
                
                <div className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all duration-500 ${
                  isDarkMode ? 'bg-[#0B1220]/60 border-white/5' : 'bg-slate-50 border-slate-150'
                }`}>
                  <Sparkles size={20} className="text-purple-400 mb-1" />
                  <span className={`text-[9px] font-bold font-mono transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400'}`}>INSÍGNIA</span>
                  <span className="text-[11px] font-extrabold text-purple-600 mt-1 uppercase">Sábio</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                isDarkMode ? 'bg-[#0B1220]/40 border-white/5' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center gap-2">
                  <Check className="text-[#22C55E]" size={16} />
                  <span className={`text-xs font-bold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-600'}`}>Resiliência Diária ativa</span>
                </div>
                <span className="text-[10px] bg-[#22C55E]/10 border border-emerald-500/20 text-[#22C55E] px-2 py-0.5 rounded font-black font-mono">100% OK</span>
              </div>
            </div>
          </section>

          {/* RECOMPENSAS DIÁRIAS */}
          <section>
            <div className="flex justify-between items-baseline mb-4 px-1">
              <h2 className={`text-md font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span>🎁</span> Recompensas Diárias
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider font-mono transition-colors duration-500 ${isDarkMode ? 'text-[#22C55E]' : 'text-emerald-600'}`}>REFORÇO</span>
            </div>
            
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast('Recompensa Diária de +50 moedas coletada!')}
              className={`relative overflow-hidden border rounded-[24px] p-5 flex items-center justify-between cursor-pointer group shadow-lg transition-all duration-500 animate-neon-green-pulse ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-600/20 to-[#172033]/60 border-emerald-500/30 shadow-emerald-950/20' 
                  : 'bg-gradient-to-r from-emerald-50/50 to-white border-emerald-200/50 shadow-[0_8px_24px_rgba(16,185,129,0.04)]'
              }`}
            >
              <div className="absolute top-[-10px] right-[-10px] w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3.5 z-10">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-emerald-50 border-emerald-250 text-emerald-600'
                }`}>
                  <Gift size={22} className="group-hover:animate-bounce" />
                </div>
                <div>
                  <h4 className={`font-extrabold text-[14.5px] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Bônus de Sabedoria</h4>
                  <p className={`text-[10.5px] leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Toque para coletar sua recompensa de hoje.</p>
                </div>
              </div>
              
              <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 text-[#070C18] font-black text-xs tracking-wider z-10 transition-all duration-300 shadow-md shadow-emerald-500/10 active:scale-95 animate-neon-green-pulse border border-emerald-300/30">
                Coletar
              </span>
            </motion.div>
          </section>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#22C55E]/95 backdrop-blur-md px-5 py-3 rounded-full border border-emerald-400/30 text-white font-extrabold text-xs tracking-wide shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center gap-2"
          >
            <Check size={14} className="text-white" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS CONTAINER (GLASS SIDE SHEET) */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 cursor-pointer"
            />
            
            {/* Notifications panel drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed top-0 right-0 h-full w-full max-w-[380px] border-l z-50 flex flex-col pt-8 pb-6 px-6 font-sans focus:outline-none transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-[#0F172A]/95 border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-white' 
                  : 'bg-white border-slate-200 shadow-[0_0_60px_rgba(0,0,0,0.12)] text-slate-800'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <Bell className="text-[#3B82F6]" size={20} />
                  <h3 className="text-lg font-extrabold tracking-tight">Notificações</h3>
                </div>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearAllNotifications}
                      className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                        isDarkMode ? 'bg-white/5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10' : 'bg-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title="Limpar todas as notificações"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                      isDarkMode ? 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-0.5">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-inner transition-colors ${
                      isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <Check className="text-[#94A3B8]" size={28} />
                    </div>
                    <div className="space-y-1 max-w-xs">
                      <p className={`font-extrabold text-[15px] transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Tudo lido!</p>
                      <p className={`text-xs leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Nenhuma recomendação ou notificação nova para o momento.</p>
                    </div>
                    <p className={`text-[10px] italic font-semibold leading-relaxed px-4 pt-4 border-t transition-colors ${
                      isDarkMode ? 'text-[#3B82F6] border-white/5' : 'text-blue-600 border-slate-100'
                    }`}>
                      "Guarda o teu coração, porque dele procedem as fontes da vida." <br />— Provérbios 4:23
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isExpanded = expandedNotificationId === n.id;
                    return (
                      <motion.div 
                        key={n.id}
                        layout
                        onClick={() => toggleReadNotification(n.id)}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 overflow-hidden ${
                          isDarkMode 
                            ? n.id === 5
                              ? 'bg-gradient-to-br from-[#122A22] to-[#0D1527] border-emerald-500/40 shadow-[0_4px_20px_rgba(34,197,94,0.15)] text-white'
                              : n.read 
                                ? 'bg-white/5 border-white/5 hover:bg-white/10 opacity-75 text-slate-400' 
                                : 'bg-[#172033]/90 border-[#3B82F6]/20 hover:border-[#3B82F6]/40 shadow-[0_4px_16px_rgba(59,130,246,0.08)] text-white' 
                            : n.id === 5
                              ? 'bg-gradient-to-br from-emerald-50/70 to-white border-emerald-300 shadow-[0_4px_20px_rgba(34,197,94,0.08)] text-slate-800'
                              : n.read
                                ? 'bg-slate-50 border-slate-200/40 hover:bg-slate-100 opacity-75 text-slate-500'
                                : 'bg-blue-50/50 border-blue-100 hover:border-blue-200 shadow-[0_4px_16px_rgba(59,130,246,0.03)] text-slate-800'
                        }`}
                      >
                        {!n.read && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        )}
                        {!n.read && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{n.date}</span>
                        </div>
                        <h4 className={`text-[13px] font-extrabold transition-colors duration-500 ${n.read ? (isDarkMode ? 'text-[#94A3B8]' : 'text-slate-400') : (isDarkMode ? 'text-white' : 'text-slate-800')}`}>{n.title}</h4>
                        <p className={`text-xs leading-normal font-medium transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{n.text}</p>
                        
                        {/* Interactive Tutorial for Pull to Refresh */}
                        {isExpanded && n.id === 5 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mt-3 pt-3 border-t overflow-hidden flex flex-col gap-3.5 ${
                              isDarkMode ? 'border-white/5' : 'border-slate-100'
                            }`}
                            onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking inside the panel
                          >
                            <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-3 relative border overflow-hidden ${
                              isDarkMode 
                                ? 'bg-[#0b1220]/70 border-emerald-500/25' 
                                : 'bg-white border-emerald-250/30 shadow-inner'
                            }`}>
                              {/* Animated Demonstration Viewport/Mockup */}
                              <div className="relative w-full h-[125px] bg-slate-950/50 rounded-lg overflow-hidden border border-slate-700/20 flex flex-col items-center justify-center">
                                {/* Top status bar mockup */}
                                <div className="absolute top-0 left-0 right-0 h-5 bg-black/15 flex items-center justify-between px-2.5 text-[8px] font-mono opacity-50 select-none">
                                  <span>APP ATIVO PULL</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>CONECTADO</span>
                                  </div>
                                </div>
                                
                                {/* Dragging finger and animated arrow flow */}
                                <div className="relative flex flex-col items-center justify-center h-full w-full pt-4">
                                  {/* Multi Arrow flow indicator */}
                                  <div className="absolute top-6 flex flex-col items-center -space-y-1">
                                    {[0, 1, 2].map((idx) => (
                                      <motion.span
                                        key={idx}
                                        animate={{ 
                                          opacity: [0.15, 0.85, 0.15],
                                          y: [0, 6, 0] 
                                        }}
                                        transition={{ 
                                          repeat: Infinity, 
                                          duration: 1.5, 
                                          delay: idx * 0.35,
                                          ease: "easeInOut"
                                        }}
                                        className="text-emerald-400 font-black text-xs leading-none"
                                      >
                                        ⬇
                                      </motion.span>
                                    ))}
                                  </div>

                                  {/* Simulated screen surface being dragged */}
                                  <motion.div
                                    animate={{ 
                                      height: [0, 48, 0],
                                      opacity: [0, 0.95, 0.95, 0]
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2.2,
                                      ease: "linear"
                                    }}
                                    className="absolute top-5 left-1/2 -translate-x-1/2 w-[85%] bg-gradient-to-b from-emerald-500/10 to-transparent border-t border-dashed border-emerald-400/40 rounded-b-md"
                                  />

                                  {/* Pointer finger indicator */}
                                  <motion.div
                                    animate={{ 
                                      y: [-12, 36], 
                                      opacity: [0, 1, 1, 0],
                                      scale: [0.85, 1.15, 1, 0.85]
                                    }}
                                    transition={{ 
                                      repeat: Infinity, 
                                      duration: 2.2, 
                                      ease: "easeInOut" 
                                    }}
                                    className="absolute w-5 h-5 rounded-full bg-emerald-500/45 border border-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.7)] flex items-center justify-center"
                                    style={{ left: 'calc(50% - 10px)' }}
                                  >
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  </motion.div>
                                </div>

                                <span className="absolute bottom-1.5 text-[8px] font-black font-sans tracking-widest text-[#4ADE80] animate-pulse">
                                  DESLIZE PARA BAIXO
                                </span>
                              </div>

                              <p className={`text-[10.5px] leading-relaxed font-semibold text-center select-none ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                Feche esta aba e arrastar a tela inicial <span className="text-emerald-500 font-extrabold">de cima para baixo</span> para recarregar o aplicativo instantaneamente!
                              </p>

                              {/* Button to simulate the refresh action directly from notification list */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsNotificationsOpen(false);
                                  setTimeout(() => {
                                    if (scrollContainerRef.current) {
                                      scrollContainerRef.current.scrollTop = 0;
                                    }
                                    triggerRefresh();
                                  }, 300);
                                }}
                                className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-[#070c18] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all shadow-[0_4px_14px_rgba(34,197,94,0.25)] hover:shadow-[0_6px_22px_rgba(34,197,94,0.45)] border border-emerald-300/30 cursor-pointer"
                              >
                                <RefreshCw size={13} className="animate-spin text-[#070c18]" />
                                Testar Recarga Agora
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SETTINGS CONTAINER (GLASS BOTTOM SHEET) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSettingsOpen(false);
                setShowResetConfirmation(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 cursor-pointer"
            />
            
            {/* Settings bottom drawer sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto w-full max-w-lg mx-auto border-t rounded-t-[32px] z-50 flex flex-col pt-7 pb-8 px-6 font-sans focus:outline-none no-scrollbar transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-[#0F172A]/95 border-white/10 shadow-[0_-15px_45px_rgba(0,0,0,0.8)] text-white' 
                  : 'bg-white border-slate-205 shadow-[0_-15px_45px_rgba(0,0,0,0.08)] text-slate-800'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <Settings className="text-[#F59E0B]" size={20} />
                  <h3 className="text-lg font-extrabold tracking-tight">Configurações</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setShowResetConfirmation(false);
                  }}
                  className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                    isDarkMode ? 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Settings list items inside bottom sheet */}
              <div className="space-y-6">
                
                {/* Profile Header Spot */}
                <div className={`border p-4 rounded-2xl flex items-center gap-3.5 shadow-inner transition-colors duration-500 ${
                  isDarkMode ? 'bg-[#172033]/60 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <img 
                    src="https://res.cloudinary.com/donb73jnb/image/upload/v1777405912/leaodatribo_sq5riz.jpg" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.25)]" 
                    alt="Avatar" 
                  />
                  <div className="flex flex-col min-w-0">
                    <h4 className={`text-sm font-extrabold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Discípulo Bíblico</h4>
                    <span className="inline-block self-start px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider bg-[#3B82F6]/20 text-[#3B82F6] uppercase border border-[#3B82F6]/25 mt-1">
                      Nível Sagrado
                    </span>
                  </div>
                </div>

                {/* Section A: Bible Versos translation version setting */}
                <div className="space-y-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-505 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Tradução Bíblica de Leitura</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setVersion('acf');
                        showToast('Tradução alterada: ACF');
                      }}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                        version === 'acf' 
                          ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg' 
                          : isDarkMode ? 'bg-white/5 border-white/5 text-[#94A3B8] hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      ACF (Almeida Fiel)
                    </button>
                    <button
                      onClick={() => {
                        setVersion('nvi');
                        showToast('Tradução alterada: NVI');
                      }}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                        version === 'nvi' 
                          ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg' 
                          : isDarkMode ? 'bg-white/5 border-white/5 text-[#94A3B8] hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      NVI (Internacional)
                    </button>
                  </div>
                </div>

                {/* Section B: Text Font Size setting */}
                <div className="space-y-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Tamanho do Texto</span>
                  <div className={`flex items-center justify-between gap-4 p-3.5 border rounded-2xl transition-colors duration-500 ${
                    isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-xs font-semibold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Leitor de capítulos</span>
                    <div className="flex gap-1.5">
                      {[14, 18, 22].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setFontSize(size);
                            showToast(`Fonte definida para ${size}px`);
                          }}
                          className={`w-10 h-10 rounded-xl border text-xs font-bold flex items-center justify-center transition-all ${
                            fontSize === size 
                              ? 'bg-[#F59E0B] border-[#F59E0B] text-white shadow-md' 
                              : isDarkMode ? 'bg-white/5 border-white/5 text-[#94A3B8] hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200/40'
                          }`}
                        >
                          {size === 14 ? 'A-' : size === 18 ? 'A' : 'A+'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section C: Theme Mode Switch */}
                <div className="space-y-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Visual do Aplicativo</span>
                  <div className={`flex items-center justify-between p-3.5 border rounded-2xl transition-all duration-500 ${
                    isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-xs font-semibold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Esquema de Cores</span>
                    <button
                      onClick={() => {
                        toggleDarkMode();
                        showToast(!isDarkMode ? 'Modo Cosmos ativado!' : 'Modo Claro ativado!');
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                        isDarkMode ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isDarkMode ? (
                        <>
                          <Moon size={13} className="text-[#3B82F6]" />
                          Cosmos (Dark)
                        </>
                      ) : (
                        <>
                          <Sun size={13} className="text-[#F59E0B]" />
                          Claro (Light)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section D: Game parameters control & resetting action */}
                <div className={`pt-2 border-t space-y-3.5 transition-colors duration-500 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Ações de Segurança</span>
                  
                  {!showResetConfirmation ? (
                    <button
                      onClick={() => setShowResetConfirmation(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-bold text-red-500 uppercase tracking-wide transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Redefinar Caça-Palavras
                    </button>
                  ) : (
                    <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                      isDarkMode ? 'border-red-500/30 bg-red-500/5' : 'border-red-200 bg-red-50/30'
                    }`}>
                      <div className="flex items-start gap-2">
                        <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
                        <div className="space-y-0.5">
                          <p className={`text-xs font-extrabold leading-normal transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Confirmar exclusão de dados?</p>
                          <p className={`text-[10.5px] leading-normal font-semibold transition-colors duration-500 ${isDarkMode ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Toda a sua pontuação, moedas, fases finalizadas e conquistas do Caça-Palavras Bíblico serão redefinidas permanentemente.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleResetCacaPalavras}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-[11px] font-extrabold tracking-wide text-white transition-all uppercase active:scale-95 cursor-pointer"
                        >
                          Sim, Apagar Tudo
                        </button>
                        <button
                          onClick={() => setShowResetConfirmation(false)}
                          className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-extrabold tracking-wide transition-all uppercase active:scale-95 cursor-pointer ${
                            isDarkMode ? 'bg-white/5 text-[#94A3B8] hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section E: General Info */}
                <div className={`pt-4 border-t flex flex-col items-center gap-1.5 text-center text-[10px] transition-colors duration-500 ${
                  isDarkMode ? 'border-white/5 text-[#94A3B8]' : 'border-slate-150 text-slate-500'
                }`}>
                  <p className={`font-semibold transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Game Store Bíblico — Edição Celestial</p>
                  <p className="font-semibold">Versão 2.1.0 • Desenvolvido com Inteligência Artificial</p>
                  <p className="text-[#3B82F6]/60 italic font-semibold mt-1">"Buscai em primeiro lugar o Reino de Deus..." — Mateus 6:33</p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
