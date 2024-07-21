import React, { useState, useEffect, useCallback } from 'react';
import { fetchColorData } from '../api/colorApi';
import { optimizedColorFetching, clearColorCache } from '../api/colorUtils';
import styles from './ColorSwatchGrid.module.css';
import ColorSwatch from './colorSwatch'
import loadingGif from '../assets/loading.gif';
import { debounce } from 'lodash';

const ColorSwatchGrid = () => {
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const [initialColors, setInitialColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showAllColors, setShowAllColors] = useState(false);

  const fetchInitialColors = async (s, l) => {
    setLoading(true);
    setError(null);
    try {
      const colors = await Promise.all([0, 72, 144, 216, 288].map(h => fetchColorData(h, s, l)));
      setInitialColors(colors.map((color, index) => ({ hue: index * 72, color })));
    } catch (err) {
      console.error('Error fetching initial colors:', err);
      setError('Failed to fetch initial colors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllColors = async (s, l) => {
    setLoadingMore(true);
    try {
      const transitions = await optimizedColorFetching(s, l);
      setAllColors(transitions);
    } catch (err) {
      console.error('Error fetching all colors:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const debouncedFetchColors = useCallback(
    debounce((s, l) => {
      fetchInitialColors(s, l);
      fetchAllColors(s, l);
    }, 500),
    []
  );

  useEffect(() => {
    fetchInitialColors(saturation, lightness);
    fetchAllColors(saturation, lightness);
  }, []);

  const handleInputChange = (setter) => (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    setter(value);
    setLoadingMore(true);
    setShowAllColors(false);
    debouncedFetchColors(setter === setSaturation ? value : saturation, setter === setLightness ? value : lightness);
  };

  const handleClearCache = () => {
    clearColorCache();
    fetchInitialColors(saturation, lightness);
    fetchAllColors(saturation, lightness);
  };

  const toggleColorDisplay = () => {
    setShowAllColors(!showAllColors);
  };

  const displayedColors = showAllColors ? allColors : initialColors;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="saturation">Saturation: {saturation}%</label>
          <div className={styles.inputGroup}>
            <input
              type="range"
              id="saturation"
              min="0"
              max="100"
              value={saturation}
              onChange={handleInputChange(setSaturation)}
            />
            <input
              type="number"
              value={saturation}
              onChange={handleInputChange(setSaturation)}
              className={styles.numberInput}
            />
          </div>
        </div>
        
        <div className={styles.controlGroup}>
          <label htmlFor="lightness">Lightness: {lightness}%</label>
          <div className={styles.inputGroup}>
            <input
              type="range"
              id="lightness"
              min="0"
              max="100"
              value={lightness}
              onChange={handleInputChange(setLightness)}
            />
            <input
              type="number"
              value={lightness}
              onChange={handleInputChange(setLightness)}
              className={styles.numberInput}
            />
          </div>
        </div>
        

      </div>

      {loading && (
        <div className="loading-indicator">
          <img src={loadingGif} alt="Loading..." className="loading-gif" />
          <p className={styles.message}>Loading initial color swatches...</p>
        </div>
      )}
      
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      
      <div className={styles.swatchGridContainer}>
        <div className={styles.swatchGrid}>
          {displayedColors.map((transition) => (
            <ColorSwatch key={`${transition.hue}-${transition.color.hex.value}`} color={transition.color} loading={loading} />
          ))}
        </div>
        
        {initialColors.length > 0 && allColors.length > initialColors.length && (
          <button 
            className={styles.toggleButton} 
            onClick={toggleColorDisplay}
          >
            {showAllColors ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorSwatchGrid;