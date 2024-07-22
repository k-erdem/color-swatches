import React, { useState } from 'react';
import styles from './ColorSwatchGrid.module.css';
import ColorSwatch from './ColorSwatch';
import ColorControls from './ColorControls';
import LoadingIndicator from './LoadingIndicator';
import { useColorFetching } from '../hooks/useColorFetching';

const ColorSwatchGrid = () => {
  const {
    saturation,
    lightness,
    setSaturation,
    setLightness,
    initialColors,
    allColors,
    loading,
    error,
  } = useColorFetching(50, 50);

  const [showAllColors, setShowAllColors] = useState(false);

  const handleInputChange = (setter) => (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    setter(value);
    setShowAllColors(false);
  };

  const toggleColorDisplay = () => {
    setShowAllColors(!showAllColors);
  };

  const displayedColors = showAllColors ? allColors : initialColors;

  return (
    <div className={styles.container}>
      <ColorControls
        saturation={saturation}
        lightness={lightness}
        onSaturationChange={handleInputChange(setSaturation)}
        onLightnessChange={handleInputChange(setLightness)}
      />

      {loading && <LoadingIndicator />}
      
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