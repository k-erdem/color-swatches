/* This component renders an individual color swatch.
   It displays the color, its name, and RGB value, or a loading skeleton.
*/

import React from 'react';

const ColorSwatch = React.memo(({ color, loading }) => (
  <div className={`color-swatch ${loading ? 'loading' : ''}`} 
       style={{ backgroundColor: loading ? '#f0f0f0' : color?.hex?.value }}>
        <p>{color?.name?.value}</p>
        <p>{color?.rgb?.value}</p>
  </div>
));

export default ColorSwatch;