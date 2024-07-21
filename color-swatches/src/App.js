import './App.css';
import ColorSwatchGrid from './components/colorSwatchGrid';
import NewSwatchGrid from './components/newSwatchGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Color Swatch</h1>
        <ColorSwatchGrid></ColorSwatchGrid>
      </header>
    </div>
  );
}

export default App;
