const API_BASE_URL = 'https://www.thecolorapi.com/id';

const CACHE_KEY = (s, l) => `color_cache_${s}_${l}`;

async function fetchColorData(h, s, l) {
  console.log(`Fetching color data for HSL(${h}, ${s}%, ${l}%)`);
  try {
    const response = await fetch(`${API_BASE_URL}?hsl=${h},${s}%,${l}%&format=json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(`Received data for HSL(${h}, ${s}%, ${l}%):`, data);
    return data;
  } catch (error) {
    console.error('Error fetching color data:', error);
    throw new Error('Failed to fetch color data from the API');
  }
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
  let start = 0;
  let end = 359;
  
  while (start <= end) {
    const color = await fetchColorData(start, s, l);
    if (!seenColorNames.has(color.name.value)) {
      console.log(`New color found: ${color.name.value} at hue ${start}`);
      seenColorNames.add(color.name.value);
      transitions.push({ hue: start, color });
    } else {
      console.log(`Duplicate color name found: ${color.name.value} at hue ${start}`);
    }
    start++;
  }

  console.log(`Fetching complete. Found ${transitions.length} unique colors.`);
  console.log('Color transitions:', transitions);

  localStorage.setItem(CACHE_KEY(s, l), JSON.stringify(transitions));
  console.log('Cached the new color data');

  return transitions;
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