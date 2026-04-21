import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BibleProvider } from './context/BibleContext';
import { useAppStore } from './store/useAppStore';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Book } from './pages/Book';
import { Reader } from './pages/Reader';
import { Search } from './pages/Search';
import { Favorites } from './pages/Favorites';
import { AIHub } from './pages/AIHub';
import { Plan } from './pages/Plan';
import { SplashScreen } from './components/SplashScreen';
import { StoreFront } from './pages/StoreFront';
import { WordOfTheDay } from './pages/WordOfTheDay';

export default function App() {
  const { hydrate } = useAppStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    hydrate().then(() => setIsHydrated(true));
  }, [hydrate]);

  // Show splash screen while hydrating or animating
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Fallback if splash finishes before hydration (rare)
  if (!isHydrated) {
    return null; 
  }

  return (
    <BibleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StoreFront />} />
          <Route path="/word-of-the-day" element={<WordOfTheDay />} />
          
          <Route path="/bible" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="book/:abbrev" element={<Book />} />
            <Route path="read/:abbrev/:chapterStr" element={<Reader />} />
            <Route path="search" element={<Search />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="ai-hub" element={<AIHub />} />
            <Route path="plan" element={<Plan />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </BibleProvider>
  );
}
