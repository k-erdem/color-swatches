import React, { useState, useEffect } from 'react';
import styles from './ColorSwatchGrid.module.css';

const ColorSwatch = React.memo(({ color, loading }) => (
  <div className={`color-swatch ${loading ? 'loading' : ''}`} 
       style={{ backgroundColor: loading ? '#f0f0f0' : color?.hex?.value }}>
    {loading ? (
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    ) : (
      <>
        <p>{color?.name?.value}</p>
        <p>{color?.rgb?.value}</p>
      </>
    )}
  </div>
));

export default ColorSwatch;