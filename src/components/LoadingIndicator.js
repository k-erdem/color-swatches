/* LoadingIndicator component displays a loading indicator in the form of a dancing human gif,
   while color swatches are being fetched on the background.
*/

import React from 'react';
import styles from './ColorSwatchGrid.module.css';
import loadingGif from '../assets/loading.gif';

const LoadingIndicator = () => (
  <div className="loading-indicator">
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
    <p className={styles.message}>Loading color swatches...</p>
  </div>
);

export default LoadingIndicator;