import localforage from 'localforage';

export type Version = 'acf' | 'nvi';

export interface Book {
  abbrev: string;
  name: string;
  chapters: string[][];
  testament: 'VT' | 'NT';
}

const URLS: Record<Version, string> = {
  acf: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_acf.json',
  nvi: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_nvi.json'
};

const DB_KEY = 'bible_offline_data';
const CACHE_KEY = 'bible_cached_versions';

export async function fetchAndCacheBible(version: Version = 'acf'): Promise<Book[]> {
  try {
    const cachedData = await localforage.getItem<Record<string, Book[]>>(DB_KEY);
    if (cachedData && cachedData[version]) {
      return cachedData[version];
    }

    const res = await fetch(URLS[version]);
    if (!res.ok) throw new Error('Falha ao baixar Bíblia');
    const rawData: any[] = await res.json();
    
    // First 39 books are Old Testament, next 27 are New Testament.
    const books: Book[] = rawData.map((b, index) => ({
      abbrev: b.abbrev,
      name: b.name,
      chapters: b.chapters,
      testament: index < 39 ? 'VT' : 'NT'
    }));

    const toSave = { ...(cachedData || {}), [version]: books };
    await localforage.setItem(DB_KEY, toSave);
    
    // Mark as cached
    const cachedVersions = (await localforage.getItem<string[]>(CACHE_KEY)) || [];
    if (!cachedVersions.includes(version)) {
      await localforage.setItem(CACHE_KEY, [...cachedVersions, version]);
    }
    
    return books;
  } catch (error) {
    console.error('Offline fetch error:', error);
    // If offline and failing, try to return whatever we have cached
    const cachedData = await localforage.getItem<Record<string, Book[]>>(DB_KEY);
    if (cachedData && Object.keys(cachedData).length > 0) {
      const fallbackVersion = Object.keys(cachedData)[0];
      return cachedData[fallbackVersion];
    }
    throw new Error('Você está offline e não possui nenhuma versão baixada.');
  }
}

export async function getCachedVersions(): Promise<Version[]> {
  const versions = await localforage.getItem<Version[]>(CACHE_KEY);
  return versions || [];
}
