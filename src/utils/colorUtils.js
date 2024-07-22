/* colorUtils.js
 *
 * Contains utility functions for color-related operations.
 * Includes functions that optimize color fetching, cache management, and color retrieval.
*/
import { fetchColorData } from '../api/colorApi';

// Generate a unique cache key for each saturation and lightness combination
const CACHE_KEY = (s, l) => `color_cache_${s}_${l}`;

/**
 * Fetches color transitions and caches the results.
 * (** "Color Transitions" are the breaking points where color names change.)
 * Uses binary search to efficiently find color transitions and reduce API calls.
 * 
 * @param {number} s - Saturation value (0-100)
 * @param {number} l - Lightness value (0-100)
 * @returns {Promise<Array>} Array of color transitions
 */
export async function optimizedColorFetching(s, l) {
  
  // Check if data is already cached
  const cachedData = localStorage.getItem(CACHE_KEY(s, l));
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const transitions = [];
  let start = 0;
  let end = 359;
  
  /**
   * Recursive binary search function to find the next color transition.
   * 
   * @param {number} left - Left boundary of the search range
   * @param {number} right - Right boundary of the search range
   * @param {Object} prevColor - Previous color object with a name property
   * @returns {Promise<Object|null>} Color transition object or null if no transition found
   */
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

  // Find all color transitions
  while (start <= end) {
    const color = await fetchColorData(start, s, l);
    transitions.push({ hue: start, color });
    
    const nextTransition = await findTransition(start + 1, end, color);
    start = nextTransition + 1;
  }

  // Cache the results
  localStorage.setItem(CACHE_KEY(s, l), JSON.stringify(transitions));

  return transitions;
}

/**
 * Clears all color-related cache entries from localStorage.
 */
export function clearColorCache() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('color_cache_')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Determines the color for a specific hue from a list of color transitions.
 * 
 * @param {Array} transitions - Array of color transition objects
 * @param {number} hue - Hue value to find the color for
 * @returns {Object} - Color object for the given hue
 */
export function getColorForHue(transitions, hue) {
  for (let i = 1; i < transitions.length; i++) {
    if (hue < transitions[i].hue) {
      return transitions[i - 1].color;
    }
  }
  return transitions[transitions.length - 1].color;
}