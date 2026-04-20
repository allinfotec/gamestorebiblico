import localforage from 'localforage';
import { create } from 'zustand';

interface Favorite {
  id: string; // bookAbbrev-chapter-verse
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface Note {
  id: string; // bookAbbrev-chapter-verse
  text: string;
}

interface AppState {
  favorites: Favorite[];
  notes: Note[];
  fontSize: number;
  isDarkMode: boolean;
  version: 'acf' | 'nvi';
  planProgress: number[];
  
  toggleFavorite: (fav: Favorite) => void;
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setFontSize: (size: number) => void;
  toggleDarkMode: () => void;
  setVersion: (version: 'acf' | 'nvi') => void;
  togglePlanDay: (day: number) => void;
  hydrate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  notes: [],
  fontSize: 18,
  isDarkMode: true, // Default to dark mode for reading
  version: 'acf',
  planProgress: [],

  toggleFavorite: async (fav) => {
    const { favorites } = get();
    const exists = favorites.find(f => f.id === fav.id);
    const newFavs = exists ? favorites.filter(f => f.id !== fav.id) : [...favorites, fav];
    set({ favorites: newFavs });
    await localforage.setItem('app_favorites', newFavs);
  },

  saveNote: async (note) => {
    const { notes } = get();
    const fIndex = notes.findIndex(n => n.id === note.id);
    let newNotes = [...notes];
    if (fIndex > -1) {
      newNotes[fIndex] = note;
    } else {
      newNotes.push(note);
    }
    set({ notes: newNotes });
    await localforage.setItem('app_notes', newNotes);
  },

  deleteNote: async (id) => {
    const { notes } = get();
    const newNotes = notes.filter(n => n.id !== id);
    set({ notes: newNotes });
    await localforage.setItem('app_notes', newNotes);
  },

  setFontSize: async (size) => {
    set({ fontSize: size });
    await localforage.setItem('app_fontSize', size);
  },

  toggleDarkMode: async () => {
    const isDark = !get().isDarkMode;
    set({ isDarkMode: isDark });
    await localforage.setItem('app_darkMode', isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setVersion: async (version) => {
    set({ version });
    await localforage.setItem('app_version', version);
  },

  togglePlanDay: async (day) => {
    const { planProgress } = get();
    const newProgress = planProgress.includes(day)
      ? planProgress.filter(d => d !== day)
      : [...planProgress, day];
    set({ planProgress: newProgress });
    await localforage.setItem('app_planProgress', newProgress);
  },

  hydrate: async () => {
    const favorites = await localforage.getItem<Favorite[]>('app_favorites') || [];
    const notes = await localforage.getItem<Note[]>('app_notes') || [];
    const fontSize = await localforage.getItem<number>('app_fontSize') || 18;
    const isDarkMode = await localforage.getItem<boolean>('app_darkMode');
    const version = await localforage.getItem<'acf' | 'nvi'>('app_version') || 'acf';
    const planProgress = await localforage.getItem<number[]>('app_planProgress') || [];
    
    // Assume dark by default if not set
    const finalDarkMode = isDarkMode === null ? true : isDarkMode;
    
    set({ favorites, notes, fontSize, isDarkMode: finalDarkMode, version, planProgress });
    
    if (finalDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}));
