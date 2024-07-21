import { fetchColorData } from '../api/colorApi';

const CACHE_KEY = (s, l) => `color_cache_${s}_${l}`;

export async function optimizedColorFetching(s, l) {
  console.log(`Starting optimizedColorFetching for S=${s}, L=${l}`);
  
  const cachedData = localStorage.getItem(CACHE_KEY(s, l));
  if (cachedData) {
    console.log('Found cached data, returning...');
    return JSON.parse(cachedData);
  }

  console.log('No cached data found, fetching from API...');

  const transitions = [];
  const seenColorNames = new Set();

  for (let hue = 0; hue <= 359; hue++) {
    const color = await fetchColorData(hue, s, l);
    
    if (!seenColorNames.has(color.name.value)) {
      transitions.push({ hue, color });
      seenColorNames.add(color.name.value);
    }
  }

  console.log(`Fetching complete. Found ${transitions.length} unique color transitions.`);
  localStorage.setItem(CACHE_KEY(s, l), JSON.stringify(transitions));

  return transitions;
}

export function clearColorCache() {
  console.log('Clearing color cache from localStorage');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('color_cache_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('Color cache cleared');
}

export function getColorForHue(transitions, hue) {
  console.log(`Getting color for hue ${hue}`);
  for (let i = 1; i < transitions.length; i++) {
    if (hue < transitions[i].hue) {
      console.log(`Returning color: ${transitions[i-1].color.name.value}`);
      return transitions[i - 1].color;
    }
  }
  console.log(`Returning last color: ${transitions[transitions.length - 1].color.name.value}`);
  return transitions[transitions.length - 1].color;
}