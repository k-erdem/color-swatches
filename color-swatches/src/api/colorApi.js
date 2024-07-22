import axios from 'axios';

const API_BASE_URL = 'https://www.thecolorapi.com/id';

/**
 * Fetches color data from the API for a given HSL color.
 * @param {number} h - Hue value (0-359)
 * @param {number} s - Saturation value (0-100)
 * @param {number} l - Lightness value (0-100)
 * @returns {Promise<Object>} - Promise resolving to color data
 */
export async function fetchColorData(h, s, l) {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        hsl: `${h},${s}%,${l}%`,
        format: 'json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch color data from the API');
  }
}

/**
 * Fetches color data for multiple HSL colors.
 * @param {Array<{h: number, s: number, l: number}>} colors - Array of HSL color objects
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of color data
 */
export async function fetchMultipleColors(colors) {
  try {
    const promises = colors.map(({ h, s, l }) => fetchColorData(h, s, l));
    return await Promise.all(promises);
  } catch (error) {
    throw new Error('Failed to fetch multiple colors from the API');
  }
}