import React, { useState, useEffect } from 'react';
import styles from './ColorSwatchGrid.module.css';


const ColorSwatch = ({ color }) => (
    <div className={styles.colorSwatch} style={{ backgroundColor: color.hex.value }}>
      <p className={styles.swatchName}>{color.name.value}</p>
      <p className={styles.swatchRgb}>{color.rgb.value}</p>
      <p className={styles.swatchRgb}>{color.name.value}</p>
    </div>
  );

export default ColorSwatch;