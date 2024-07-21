// src/utils/colorUtils.js

import { fetchColorData } from '../api/colorApi';

const CACHE_KEY = (s, l) => `color_cache_${s}_${l}`;

export async function optimizedColorFetching(s, l) {
  // Check if we have cached data for this S and L combination
  const cachedData = localStorage.getItem(CACHE_KEY(s, l));
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const transitions = [];
  let start = 0;
  let end = 359;
  let prevColor = await fetchColorData(start, s, l);
  transitions.push({ hue: start, color: prevColor });

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const midColor = await fetchColorData(mid, s, l);

    if (midColor.name.value !== prevColor.name.value) {
      // Found a transition, now find the exact point
      const exactTransition = await findExactTransition(s, l, start, mid, prevColor.name.value);
      transitions.push({ hue: exactTransition, color: midColor });
      start = mid + 1;
      prevColor = midColor;
    } else {
      end = mid - 1;
    }
  }

  // Add the last color if it's different
  const lastColor = await fetchColorData(359, s, l);
  if (lastColor.name.value !== prevColor.name.value) {
    transitions.push({ hue: 359, color: lastColor });
  }

  // Cache the results
  localStorage.setItem(CACHE_KEY(s, l), JSON.stringify(transitions));

  return transitions;
}

async function findExactTransition(s, l, start, end, prevName) {
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const midColor = await fetchColorData(mid, s, l);

    if (midColor.name.value === prevName) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return start;
}

export function getColorForHue(transitions, hue) {
  for (let i = 1; i < transitions.length; i++) {
    if (hue < transitions[i].hue) {
      return transitions[i - 1].color;
    }
  }
  return transitions[transitions.length - 1].color;
}