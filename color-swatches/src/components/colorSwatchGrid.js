import React, { useState } from 'react';
import styles from './ColorSwatchGrid.module.css';
import ColorSwatch from './ColorSwatch';
import SkeletonSwatch from './SkeletonSwatch';
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
    loadingMore,
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
  const isLoading = showAllColors ? loadingMore : loading;

  return (
    <div className={styles.container}>
      <ColorControls
        saturation={saturation}
        lightness={lightness}
        onSaturationChange={handleInputChange(setSaturation)}
        onLightnessChange={handleInputChange(setLightness)}
      />

      {isLoading && <LoadingIndicator />}
      
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      
      <div className={styles.swatchGridContainer}>
        <div className={styles.swatchGrid}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SkeletonSwatch key={index} />
              ))
            : displayedColors.map((transition) => (
                <ColorSwatch 
                  key={`${transition.hue}-${transition.color.hex.value}`} 
                  color={transition.color} 
                />
              ))}
        </div>
        
        {initialColors.length > 0 && !isLoading && (
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