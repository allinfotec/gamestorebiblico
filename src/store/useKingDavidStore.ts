import localforage from 'localforage';
import { create } from 'zustand';

export interface KingDavidState {
  completedPhases: string[]; // e.g. ['fase1', 'fase2', 'fase3', 'bonus']
  victoryPoints: number;
  coins: number;
  maxDistance: number;
  medals: string[];
  unlockedReiDavid: boolean;
  selectedCharacter: 'david_jovem' | 'rei_david';
  unlockedVerses: string[];
  isHydrated: boolean;

  setCompletedPhase: (phaseId: string) => void;
  addVictoryPoints: (points: number) => void;
  addCoins: (amount: number) => void;
  updateMaxDistance: (dist: number) => void;
  unlockMedal: (medalId: string) => void;
  setSelectedCharacter: (char: 'david_jovem' | 'rei_david') => void;
  unlockReiDavidChar: () => void;
  unlockVerse: (verse: string) => void;
  resetProgress: () => void;
  hydrate: () => Promise<void>;
}

export const useKingDavidStore = create<KingDavidState>((set, get) => ({
  completedPhases: [],
  victoryPoints: 0,
  coins: 0,
  maxDistance: 0,
  medals: [],
  unlockedReiDavid: false,
  selectedCharacter: 'david_jovem',
  unlockedVerses: [],
  isHydrated: false,

  setCompletedPhase: async (phaseId) => {
    const { completedPhases } = get();
    if (!completedPhases.includes(phaseId)) {
      const newPhases = [...completedPhases, phaseId];
      set({ completedPhases: newPhases });
      await localforage.setItem('kd_completedPhases', newPhases);
    }
  },

  addVictoryPoints: async (points) => {
    const newPoints = get().victoryPoints + points;
    set({ victoryPoints: newPoints });
    await localforage.setItem('kd_victoryPoints', newPoints);
  },

  addCoins: async (amount) => {
    const newCoins = get().coins + amount;
    set({ coins: newCoins });
    await localforage.setItem('kd_coins', newCoins);
  },

  updateMaxDistance: async (dist) => {
    const current = get().maxDistance;
    if (dist > current) {
      set({ maxDistance: Math.round(dist) });
      await localforage.setItem('kd_maxDistance', Math.round(dist));
    }
  },

  unlockMedal: async (medalId) => {
    const { medals } = get();
    if (!medals.includes(medalId)) {
      const newMedals = [...medals, medalId];
      set({ medals: newMedals });
      await localforage.setItem('kd_medals', newMedals);
    }
  },

  setSelectedCharacter: async (char) => {
    set({ selectedCharacter: char });
    await localforage.setItem('kd_selectedCharacter', char);
  },

  unlockReiDavidChar: async () => {
    set({ unlockedReiDavid: true });
    await localforage.setItem('kd_unlockedReiDavid', true);
  },

  unlockVerse: async (verse) => {
    const { unlockedVerses } = get();
    if (!unlockedVerses.includes(verse)) {
      const newVerses = [...unlockedVerses, verse];
      set({ unlockedVerses: newVerses });
      await localforage.setItem('kd_unlockedVerses', newVerses);
    }
  },

  resetProgress: async () => {
    const reset = {
      completedPhases: [],
      victoryPoints: 0,
      coins: 0,
      maxDistance: 0,
      medals: [],
      unlockedReiDavid: false,
      selectedCharacter: 'david_jovem' as const,
      unlockedVerses: [],
    };
    set(reset);
    await localforage.removeItem('kd_completedPhases');
    await localforage.removeItem('kd_victoryPoints');
    await localforage.removeItem('kd_coins');
    await localforage.removeItem('kd_maxDistance');
    await localforage.removeItem('kd_medals');
    await localforage.removeItem('kd_unlockedReiDavid');
    await localforage.removeItem('kd_selectedCharacter');
    await localforage.removeItem('kd_unlockedVerses');
  },

  hydrate: async () => {
    if (get().isHydrated) return;

    const completedPhases = await localforage.getItem<string[]>('kd_completedPhases') || [];
    const victoryPoints = await localforage.getItem<number>('kd_victoryPoints') || 0;
    const coins = await localforage.getItem<number>('kd_coins') || 0;
    const maxDistance = await localforage.getItem<number>('kd_maxDistance') || 0;
    const medals = await localforage.getItem<string[]>('kd_medals') || [];
    const unlockedReiDavid = await localforage.getItem<boolean>('kd_unlockedReiDavid') || false;
    const selectedCharacter = await localforage.getItem<'david_jovem' | 'rei_david'>('kd_selectedCharacter') || 'david_jovem';
    const unlockedVerses = await localforage.getItem<string[]>('kd_unlockedVerses') || [];

    set({
      completedPhases,
      victoryPoints,
      coins,
      maxDistance,
      medals,
      unlockedReiDavid,
      selectedCharacter,
      unlockedVerses,
      isHydrated: true
    });
  }
}));
