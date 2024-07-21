import { fetchColorData } from '../api/colorApi';

const CACHE_KEY = (s, l) => `color_cache_${s}_${l}`;

export async function optimizedColorFetching(s, l) {
  console.log(`Starting optimizedColorFetching for S=${s}, L=${l}`);
  let apiCallAmount = 0;
  
  const cachedData = localStorage.getItem(CACHE_KEY(s, l));
  if (cachedData) {
    console.log('Found cached data, returning...');
    return JSON.parse(cachedData);
  }

  console.log('No cached data found, fetching from API...');

  const transitions = [];
  let start = 0;
  let end = 359;
  
  async function findTransition(left, right, prevColor) {
    if (left > right) return right;
    
    const mid = Math.floor((left + right) / 2);
    const color = await fetchColorData(mid, s, l);
    
    if (color.name.value !== prevColor.name.value) {
      return findTransition(left, mid - 1, prevColor);
    } else {
      return findTransition(mid + 1, right, color);
    }
  }

  while (start <= end) {
    const color = await fetchColorData(start, s, l);
    apiCallAmount++;
    transitions.push({ hue: start, color });
    
    const nextTransition = await findTransition(start + 1, end, color);
    start = nextTransition + 1;
  }

  console.log(`Fetching complete. Found ${transitions.length} color transitions.`);
  console.log("Api Call amount " + apiCallAmount)
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