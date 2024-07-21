import logo from './logo.svg';
import './App.css';
import ColorSwatchGrid from './components/colorSwatchGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Color Swatch</p>
        <ColorSwatchGrid></ColorSwatchGrid>
      </header>
    </div>
  );
}

export default App;
