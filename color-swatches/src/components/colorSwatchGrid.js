import React, { useState, useEffect } from 'react';
import { optimizedColorFetching, clearColorCache } from '../api/colorUtils';
import styles from './ColorSwatchGrid.module.css';

const ColorSwatch = ({ color }) => (
  <div className={styles.colorSwatch} style={{ backgroundColor: color.hex.value }}>
    <p className={styles.swatchName}>{color.name.value}</p>
    <p className={styles.swatchRgb}>{color.rgb.value}</p>
  </div>
);

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

  useEffect(() => {
    console.log('Component mounted, fetching initial colors');
    fetchColors(saturation, lightness);
  }, []);

  const handleInputChange = (setter) => (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    console.log(`Input changed. New value: ${value}`);
    setter(value);
    fetchColors(setter === setSaturation ? value : saturation, setter === setLightness ? value : lightness);
  };

  const handleClearCache = () => {
    clearColorCache();
    fetchColors(saturation, lightness);
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
          </div>
        </div>
      </div>

      <button onClick={handleClearCache} className={styles.clearCacheButton}>
        Clear Cache and Reload
      </button>

      {loading && <p className={styles.message}>Loading color swatches...</p>}
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      
      <div className={styles.swatchGrid}>
        {colorTransitions.map((transition) => (
          <ColorSwatch key={`${transition.hue}-${transition.color.hex.value}`} color={transition.color} />
        ))}
      </div>
    </div>
  );
};

export default ColorSwatchGrid;