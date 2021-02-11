import './App.css';
import ImageUploader from './components/ImageUploader';

function App() {
  return (
    <div className="App">
      <h1 >
        Image encryption
      </h1>
      <h5>This is example of image encryption using Newton method of approximation</h5>
      <ImageUploader />
    </div>
  );
}

export default App;
