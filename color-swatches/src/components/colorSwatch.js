import React, { useState, useEffect } from 'react';
import styles from './ColorSwatchGrid.module.css';

const ColorSwatch = React.memo(({ color }) => (
  <div className="color-swatch" style={{ backgroundColor: color?.hex?.value || '#CCCCCC' }}>
    <p>{color?.name?.value || 'Loading...'}</p>
    <p>{color?.rgb?.value || 'RGB: N/A'}</p>
  </div>
));

export default ColorSwatch;