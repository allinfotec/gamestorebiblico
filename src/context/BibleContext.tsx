import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, fetchAndCacheBible, Version } from '../services/bibleService';
import { useAppStore } from '../store/useAppStore';

interface BibleContextType {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  changeVersion: (v: Version) => Promise<void>;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { version, setVersion } = useAppStore();

  useEffect(() => {
    loadBible(version);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBible = async (v: Version) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAndCacheBible(v);
      setBooks(data);
      setVersion(v);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar a Bíblia.');
    } finally {
      setIsLoading(false);
    }
  };

  const changeVersion = async (v: Version) => {
    await loadBible(v);
  };

  return (
    <BibleContext.Provider value={{ books, isLoading, error, changeVersion }}>
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (!context) throw new Error('useBible must be used within BibleProvider');
  return context;
}
