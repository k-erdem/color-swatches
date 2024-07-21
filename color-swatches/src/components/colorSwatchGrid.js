import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
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
  const [showAll, setShowAll] = useState(false);
  const [buttonText, setButtonText] = useState("See More");

  const INITIAL_DISPLAY_COUNT = 5;
  const SWATCH_SIZE = 100;

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
    setShowAll(false);
    setButtonText("See More");
  };

  const handleClearCache = () => {
    clearColorCache();
    fetchColors(); // Refetch colors immediately after clearing cache
    setShowAll(false);
    setButtonText("See More");
  };

  const handleToggleDisplay = () => {
    setShowAll(!showAll);
    setButtonText(showAll ? "See More" : "Show Less");
  };

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnsCount + columnIndex;
    if (index >= displayCount) return null;
    const color = colorTransitions[index]?.color;
    
    return (
      <div style={style}>
        <ColorSwatch color={color} loading={loading} />
      </div>
    );
  };

  const columnsCount = Math.floor(window.innerWidth / SWATCH_SIZE);
  const displayCount = showAll ? colorTransitions.length : Math.min(INITIAL_DISPLAY_COUNT, colorTransitions.length);
  const rowsCount = Math.ceil(displayCount / columnsCount);

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
      
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      <Grid
        className={styles.swatchGrid}
        columnCount={columnsCount}
        columnWidth={SWATCH_SIZE}
        height={Math.min(rowsCount * SWATCH_SIZE, window.innerHeight * 0.7)} // Limit height to 70% of viewport
        rowCount={rowsCount}
        rowHeight={SWATCH_SIZE}
        width={window.innerWidth - 40} // Subtract padding
        itemData={colorTransitions}
      >
        {Cell}
      </Grid>

      {colorTransitions.length > INITIAL_DISPLAY_COUNT && (
        <button className={styles.toggleButton} onClick={handleToggleDisplay}>
          {buttonText}
        </button>
      )}


    </div>
  );
};

export default ColorSwatchGrid;