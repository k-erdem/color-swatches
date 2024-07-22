import { useState, useEffect, useCallback } from 'react';
import { fetchColorData } from '../api/colorApi';
import { optimizedColorFetching } from '../utils/colorUtils';
import { useDebounce } from './useDebounce';

const MIN_LOADING_TIME = 750;

export const useColorFetching = (initialSaturation, initialLightness) => {
  const [saturation, setSaturation] = useState(initialSaturation);
  const [lightness, setLightness] = useState(initialLightness);
  const [initialColors, setInitialColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSaturation = useDebounce(saturation, 500);
  const debouncedLightness = useDebounce(lightness, 500);

  const fetchInitialColors = useCallback(async (s, l) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      const colors = await Promise.all([0, 72, 144, 216, 288].map(h => fetchColorData(h, s, l)));
      setInitialColors(colors.map((color, index) => ({ hue: index * 72, color })));
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

  const fetchAllColors = useCallback(async (s, l) => {
    setLoadingMore(true);
    try {
      const transitions = await optimizedColorFetching(s, l);
      setAllColors(transitions);
    } catch (err) {
      console.error('Error fetching all colors:', err);
    } finally {
      setLoadingMore(false);
    }
  }, []);

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