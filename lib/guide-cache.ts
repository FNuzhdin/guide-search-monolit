import { ApiResponse, GuideItem } from '@/types/guide';

const API_BASE = process.env.API_BASE || 'https://test.monolit-calculator.ru';

let cachedData: GuideItem[] = [];
let lastUpdated = 0;
let pendingPromise: Promise<GuideItem[]> | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 час

async function fetchFreshData(): Promise<GuideItem[]> {
  const url = `${API_BASE}/api/adminka/guide`;
  console.log('Fetching fresh guide data from', url);
  const res = await fetch(url); // Без next: { revalidate }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: ApiResponse = await res.json();
  if (!json.success) throw new Error('API returned success=false');
  console.log(`Loaded ${json.data.length} items`);
  return json.data;
}

export async function getGuideData(): Promise<GuideItem[]> {
  const now = Date.now();
  if (cachedData.length > 0 && now - lastUpdated < CACHE_TTL) {
    return cachedData;
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = fetchFreshData()
    .then(data => {
      cachedData = data;
      lastUpdated = now;
      pendingPromise = null;
      return data;
    })
    .catch(err => {
      pendingPromise = null;
      throw err;
    });

  return pendingPromise;
}

export async function getUniqueCalculators(): Promise<string[]> {
  const data = await getGuideData();
  const calculators = [...new Set(data.map(item => item.calculator).filter(Boolean))];
  console.log('Unique calculators count:', calculators.length);
  return calculators.sort((a, b) => a.localeCompare(b, 'ru'));
}

export async function getUniqueCategories(): Promise<string[]> {
  const data = await getGuideData();
  const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
  console.log('Unique categories count:', categories.length);
  return categories.sort((a, b) => a.localeCompare(b, 'ru'));
}

export async function getCategoriesByCalculator(calculator: string): Promise<string[]> {
  if (!calculator) return [];
  const data = await getGuideData();
  const categories = [...new Set(
    data
      .filter(item => item.calculator === calculator)
      .map(item => item.category)
      .filter(Boolean)
  )];
  console.log(`Categories for ${calculator}: ${categories.length}`);
  return categories.sort((a, b) => a.localeCompare(b, 'ru'));
}