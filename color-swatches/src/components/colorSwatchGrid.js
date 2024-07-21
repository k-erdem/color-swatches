import React, { useState, useEffect, useCallback } from 'react';
import { optimizedColorFetching, getColorForHue } from '../api/colorUtils';

const ColorSwatch = React.memo(({ color }) => (
  <div className="color-swatch" style={{ backgroundColor: color?.hex?.value || '#CCCCCC' }}>
    <p>{color?.name?.value || 'Loading...'}</p>
    <p>{color?.rgb?.value || 'RGB: N/A'}</p>
  </div>
));

const ColorSwatchGrid = () => {
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const [colorTransitions, setColorTransitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchColors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const transitions = await optimizedColorFetching(saturation, lightness);
      setColorTransitions(transitions);
    } catch (err) {
      setError('Failed to fetch colors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [saturation, lightness]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const handleSaturationChange = (event) => {
    setSaturation(Number(event.target.value));
  };

  const handleLightnessChange = (event) => {
    setLightness(Number(event.target.value));
  };

  const renderColorSwatches = () => {
    if (loading || colorTransitions.length === 0) {
      return Array(36).fill(null).map((_, index) => (
        <ColorSwatch key={index} color={null} />
      ));
    }

    const swatches = [];
    for (let hue = 0; hue < 360; hue += 10) {  // Render every 10th hue for performance
      const color = getColorForHue(colorTransitions, hue);
      swatches.push(<ColorSwatch key={hue} color={color} />);
    }
    return swatches;
  };

  return (
    <div className="color-swatch-grid">
      <div className="controls">
        <label>
          Saturation:
          <input
            type="range"
            min="0"
            max="100"
            value={saturation}
            onChange={handleSaturationChange}
          />
          {saturation}%
        </label>
        <label>
          Lightness:
          <input
            type="range"
            min="0"
            max="100"
            value={lightness}
            onChange={handleLightnessChange}
          />
          {lightness}%
        </label>
        <button onClick={fetchColors} disabled={loading}>
          Update Colors
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="swatch-container">
        {renderColorSwatches()}
      </div>
    </div>
  );
};

export default ColorSwatchGrid;