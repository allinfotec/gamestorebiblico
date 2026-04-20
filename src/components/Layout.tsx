import { Outlet, NavLink } from 'react-router-dom';
import { Book, Search, Heart, Sparkles } from 'lucide-react';
import { useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';

export function Layout() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#000000' : '#ffffff');
    }
  }, [isDarkMode]);

  return (
    <div className="mx-auto w-full max-w-md h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden relative shadow-2xl safe-area-bottom">
      {/* Content */}
      <main className="flex-1 overflow-y-auto relative z-0">
        <Outlet />
        {/* Spacer text to not get hidden behind floating pill */}
        <div className="h-[100px] shrink-0 w-full pointer-events-none" />
      </main>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-6 left-4 right-4 z-50 pointer-events-none pb-safe">
         <nav className="pointer-events-auto h-[72px] bg-white/70 dark:bg-[#121214]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-around px-2 overflow-hidden transition-all duration-300">
          <NavItem to="/bible" icon={<Book size={24} />} label="Bíblia" />
          <NavItem to="/bible/search" icon={<Search size={24} />} label="Buscar" />
          <NavItem to="/bible/favorites" icon={<Heart size={24} />} label="Favoritos" />
          <NavItem to="/bible/ai-hub" icon={<Sparkles size={24} />} label="IA" />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 transform ${
          isActive 
            ? 'text-black dark:text-white font-bold scale-110 drop-shadow-md dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 hover:scale-105'
        }`
      }
    >
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </NavLink>
  );
}
