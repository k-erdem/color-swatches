import React from 'react';
import styles from './ColorSwatchGrid.module.css';

const ColorControls = ({ saturation, lightness, onSaturationChange, onLightnessChange }) => (
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
          onChange={onSaturationChange}
        />
        <input
          type="number"
          value={saturation}
          onChange={onSaturationChange}
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
          onChange={onLightnessChange}
        />
        <input
          type="number"
          value={lightness}
          onChange={onLightnessChange}
          className={styles.numberInput}
        />
      </div>
    </div>
  </div>
);

export default ColorControls;