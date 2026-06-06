import { Outlet, NavLink } from 'react-router-dom';
import { Book, Search, Heart, Sparkles } from 'lucide-react';
import { useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';

export function Layout() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0B1220');
    }
  }, [isDarkMode]);

  return (
    <div className="mx-auto w-full h-screen bg-brand-bg text-text-main flex flex-col overflow-hidden relative shadow-2xl safe-area-bottom">
      {/* Content */}
      <main className="flex-1 overflow-y-auto relative z-0 no-scrollbar">
        <Outlet />
        {/* Spacer text to not get hidden behind floating pill */}
        <div className="h-[100px] shrink-0 w-full pointer-events-none" />
      </main>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-6 left-4 right-4 z-50 pointer-events-none pb-safe">
         <nav className="pointer-events-auto h-[76px] bg-brand-card/90 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-around px-3 overflow-hidden transition-all duration-300">
          <NavItem to="/bible" icon={<Book size={22} />} label="Bíblia" />
          <NavItem to="/bible/search" icon={<Search size={22} />} label="Buscar" />
          <NavItem to="/bible/favorites" icon={<Heart size={22} />} label="Favoritos" />
          <NavItem to="/bible/ai-hub" icon={<Sparkles size={22} />} label="IA" />
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
        `relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 transform active:scale-95 ${
          isActive 
            ? 'text-brand-primary font-bold bg-brand-primary/15 scale-105 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]' 
            : 'text-text-muted hover:text-white hover:bg-white/5'
        }`
      }
    >
      <div className="flex flex-col items-center gap-1">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      </div>
    </NavLink>
  );
}
