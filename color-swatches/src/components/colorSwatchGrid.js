import React, { useState, useEffect, useCallback } from 'react';
import { optimizedColorFetching, clearColorCache } from '../api/colorUtils';
import styles from './ColorSwatchGrid.module.css';
import ColorSwatch from './colorSwatch'
import loadingGif from '../assets/loading.gif';
import { debounce } from 'lodash';


const ColorSwatchGrid = () => {
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const [colorTransitions, setColorTransitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchColors = async (s, l) => {
    console.log(`Fetching colors for S=${s}, L=${l}`);
    setLoading(true);
    setError(null);
    try {
      const transitions = await optimizedColorFetching(s, l);
      console.log('Received color transitions:', transitions);
      setColorTransitions(transitions);
    } catch (err) {
      console.error('Error fetching colors:', err);
      setError('Failed to fetch colors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchColors = useCallback(
    debounce((s, l) => fetchColors(s, l), 500),
    []
  );

  useEffect(() => {
    console.log('Component mounted, fetching initial colors');
    fetchColors(saturation, lightness);
  }, []);

  const handleInputChange = (setter) => (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    console.log(`Input changed. New value: ${value}`);
    setter(value);
    debouncedFetchColors(setter === setSaturation ? value : saturation, setter === setLightness ? value : lightness);
  };

  const handleClearCache = () => {
    clearColorCache();
    fetchColors(); // Refetch colors immediately after clearing cache
  };

  console.log('Rendering component. ColorTransitions:', colorTransitions);

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
            <button className="clear-cache-btn" onClick={handleClearCache}>
                Clear Color Cache
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-indicator">
            <img src={loadingGif} alt="Loading..." className="loading-gif" />
            <p className={styles.message}>Loading color swatches...</p>
        </div>
      )}
      {loading }
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      
      <div className={styles.swatchGrid}>

        {colorTransitions.map((transition) => (
          <ColorSwatch key={`${transition.hue}-${transition.color.hex.value}`} color={transition.color} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default ColorSwatchGrid;