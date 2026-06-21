import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Book, Search, Heart, Sparkles, Home as HomeIcon } from 'lucide-react';
import { useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

export function Layout() {
  const { isDarkMode } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0B1220');
    }
  }, [isDarkMode]);

  // Determine current active tab index (0=Menu, 1=Bíblia, 2=Buscar, 3=Minhas, 4=IA Devoc)
  const path = location.pathname;
  let activeIndex = 1; // Default to Bible
  if (path.startsWith('/bible/search')) activeIndex = 2;
  else if (path.startsWith('/bible/favorites')) activeIndex = 3;
  else if (path.startsWith('/bible/ai-hub')) activeIndex = 4;
  else if (path.startsWith('/bible')) activeIndex = 1;

  return (
    <div className="mx-auto w-full h-screen bg-brand-bg text-text-main flex flex-col overflow-hidden relative shadow-2xl safe-area-bottom">
      {/* Content */}
      <main className="flex-1 overflow-y-auto relative z-0 no-scrollbar">
        <Outlet />
        {/* Spacer text to not get hidden behind floating pill */}
        <div className="h-[105px] shrink-0 w-full pointer-events-none" />
      </main>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-6 left-4 right-4 z-50 pointer-events-none pb-safe max-w-md mx-auto w-[calc(100%-32px)]">
        {/* Glow & Backdrop container */}
        <div className="relative pointer-events-auto rounded-[30px] p-[1.5px] bg-gradient-to-r from-emerald-500/15 via-blue-500/25 to-purple-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_24px_rgba(34,197,94,0.06)]">
          
          {/* Seamless sliding active green bubble wrapper (Moved OUTSIDE overflow-hidden for infinite upward overflow!) */}
          <motion.div
            className="absolute top-[-16px] left-0 w-1/5 h-[52px] flex items-center justify-center z-20 pointer-events-none"
            animate={{ x: `${activeIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 360, damping: 29 }}
          >
            {/* Dynamic glowing neon green button following the mockup */}
            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-emerald-400 via-green-400 to-[#86EFAC] text-[#070C18] flex items-center justify-center shadow-[0_12px_28px_rgba(34,197,94,0.5),0_0_15px_rgba(34,197,94,0.3)] border-[2.5px] border-[#070C18] relative group">
              <div className="absolute inset-0 rounded-full bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity" />
              {tabs[activeIndex].icon}
            </div>

            {/* Premium boundless soft glowing ambient neon aura following the active button */}
            <div className="absolute w-[95px] h-[95px] top-[-10px] rounded-full bg-gradient-to-tr from-emerald-500/40 to-green-400/20 blur-[26px] pointer-events-none -z-10" />
          </motion.div>

          <div className="relative z-10 h-[78px] rounded-[29px] overflow-hidden bg-[#070C18]/60 backdrop-blur-3xl">
            {/* SVG Background with animated scoop cutout path */}
            <div className="absolute inset-0 pointer-events-none">
              <svg 
                viewBox="0 0 500 80" 
                className="absolute inset-0 w-full h-full text-[#080E1C]/80 fill-current" 
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="neonGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
                    <stop offset="30%" stopColor="rgba(34, 197, 94, 0.45)" />
                    <stop offset="50%" stopColor="rgba(74, 222, 128, 0.65)" />
                    <stop offset="70%" stopColor="rgba(34, 197, 94, 0.45)" />
                    <stop offset="100%" stopColor="rgba(168, 85, 247, 0.15)" />
                  </linearGradient>
                </defs>
                {/* The main solid bar path with the curve cutout */}
                <motion.path
                  animate={{ 
                    d: `M 0 20 L ${50 + activeIndex * 100 - 46} 20 C ${50 + activeIndex * 100 - 27} 20, ${50 + activeIndex * 100 - 21} 57, ${50 + activeIndex * 100} 57 C ${50 + activeIndex * 100 + 21} 57, ${50 + activeIndex * 100 + 27} 20, ${50 + activeIndex * 100 + 46} 20 L 500 20 L 500 80 L 0 80 Z` 
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 29 }}
                />
                {/* Ultra premium fine glowing top edge border line */}
                <motion.path
                  fill="none"
                  stroke="url(#neonGlowGrad)"
                  strokeWidth="1.6"
                  animate={{ 
                    d: `M 0 20 L ${50 + activeIndex * 100 - 46} 20 C ${50 + activeIndex * 100 - 27} 20, ${50 + activeIndex * 100 - 21} 57, ${50 + activeIndex * 100} 57 C ${50 + activeIndex * 100 + 21} 57, ${50 + activeIndex * 100 + 27} 20, ${50 + activeIndex * 100 + 46} 20 L 500 20` 
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 29 }}
                />
              </svg>
            </div>

            {/* Navigation click interactions layer */}
            <nav className="absolute inset-0 flex items-center justify-between z-10">
              {tabs.map((tab, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <NavLink
                    key={tab.id}
                    to={tab.to}
                    className="flex-1 h-full flex flex-col items-center justify-end pb-3 select-none outline-none"
                  >
                    {/* Inactive state: render standard icon and name */}
                    <div 
                      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                        isActive 
                          ? 'opacity-0 scale-50 pointer-events-none translate-y-[-20px]' 
                          : 'text-[#8598B0] hover:text-white hover:scale-105 active:scale-90'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-[9.5px] font-bold tracking-wider uppercase">{tab.label}</span>
                    </div>

                    {/* Active state label: transitions gracefully directly inside scooped notch space */}
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: 12, scale: 0.85 }}
                        animate={{ opacity: 1, y: 2, scale: 1 }}
                        transition={{ delay: 0.05, duration: 0.2 }}
                        className="flex flex-col items-center h-[18px] justify-center mt-auto"
                      >
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#4ADE80] drop-shadow-[0_0_8px_rgba(34,197,94,0.45)]">
                          {tab.label}
                        </span>
                      </motion.div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

        </div>
      </div>
    </div>
  );
}

interface TabItem {
  id: string;
  to: string;
  icon: ReactNode;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'home', to: '/', icon: <HomeIcon size={21} className="stroke-[2.5px]" />, label: 'Menu' },
  { id: 'bible', to: '/bible', icon: <Book size={21} className="stroke-[2.5px]" />, label: 'Bíblia' },
  { id: 'search', to: '/bible/search', icon: <Search size={21} className="stroke-[2.5px]" />, label: 'Buscar' },
  { id: 'favorites', to: '/bible/favorites', icon: <Heart size={21} className="stroke-[2.5px]" />, label: 'Minhas' },
  { id: 'ai-hub', to: '/bible/ai-hub', icon: <Sparkles size={21} className="stroke-[2.5px]" />, label: 'IA Devoc' },
];
