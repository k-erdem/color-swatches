import React from 'react';
import styles from './ColorSwatchGrid.module.css';
import loadingGif from '../assets/loading.gif';
// buralari kontrol et.

const LoadingIndicator = () => (
  <div className="loading-indicator">
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
    <p className={styles.message}>Loading color swatches...</p>
  </div>
);

export default LoadingIndicator;