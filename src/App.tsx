import './App.css';
import MenuBar from "./components/MenuBar";
import Router from './Router';

function App() {
  return (
    <div className="body">
      <div className="container">
        <header>
          <MenuBar />
        </header>
      </div>
      <div><Router/></div>
    </div>
  );
}

export default App;
