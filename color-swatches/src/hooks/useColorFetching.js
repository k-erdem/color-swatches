/* useColorFetching is a custom hook.
   Manages the state and logic for fetching color data from the API.
   Handles loading the initial 5 colors, loading every other colors, and state management.
*/

import { useState, useEffect, useCallback } from 'react';
import { fetchColorData } from '../api/colorApi';
import { optimizedColorFetching } from '../utils/colorUtils';
import { useDebounce } from './useDebounce';

const MIN_LOADING_TIME = 750;

export const useColorFetching = (initialSaturation, initialLightness) => {
  // State variables
  const [saturation, setSaturation] = useState(initialSaturation);
  const [lightness, setLightness] = useState(initialLightness);
  const [initialColors, setInitialColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Debounce Saturation and Lightness values to reduce API calls
  // and improve user experience.
  const debouncedSaturation = useDebounce(saturation, 500);
  const debouncedLightness = useDebounce(lightness, 500);

  // Fetches the initial set of 5 colors
  const fetchInitialColors = useCallback(async (s, l) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      let colors;
      if (l === 0) {
        colors = [{ hex: { value: '#000000' }, name: { value: 'Black' }, rgb: { value: 'rgb(0,0,0)' } }];
      } else if (l === 100) {
        colors = [{ hex: { value: '#FFFFFF' }, name: { value: 'White' }, rgb: { value: 'rgb(255,255,255)' } }];
      } else if (s === 0) {
        colors = [await fetchColorData(0, s, l)];
      } else {
        colors = await Promise.all([0, 72, 144, 216, 288].map(h => fetchColorData(h, s, l)));
      }
      setInitialColors(colors.map((color, index) => ({ hue: index * (360 / colors.length), color })));
      
      // Ensures that loading screen stays on screen for min 750ms
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) { 
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
    } catch (err) {
      console.error('Error fetching initial colors:', err);
      setError('Failed to fetch initial colors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch the rest of the possible colors
  const fetchAllColors = useCallback(async (s, l) => {
    setLoadingMore(true);
    setAllColors([]); // Clear previous colors
    try {
      const transitions = await optimizedColorFetching(s, l);
      
      // Filter out colors with duplicate names
      const uniqueTransitions = transitions.filter((transition, index, self) =>
        index === self.findIndex((t) => t.color.name.value === transition.color.name.value)
      );
      
      setAllColors(uniqueTransitions);
    } catch (err) {
      console.error('Error fetching all colors:', err);
      setError('Failed to fetch all colors. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, []);

  // Effect to trigger color fetching when saturation or lightness changes
  useEffect(() => {
    fetchInitialColors(debouncedSaturation, debouncedLightness);
    fetchAllColors(debouncedSaturation, debouncedLightness);
  }, [debouncedSaturation, debouncedLightness, fetchInitialColors, fetchAllColors]);

  return {
    saturation,
    lightness,
    setSaturation,
    setLightness,
    initialColors,
    allColors,
    loading,
    loadingMore,
    error,
  };
};