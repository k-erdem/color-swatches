/* SkeletonSwatch component renders a skeleton (filler) swatch
   to provide feedback to users while the actual color data is loading.
*/

import React from 'react';
import styles from './ColorSwatchGrid.module.css';

const SkeletonSwatch = () => (
  <div className={`${styles.colorSwatch} ${styles.skeletonSwatch}`}>
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
    </div>
  </div>
);

export default SkeletonSwatch;