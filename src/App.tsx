import "./App.css";
import Header from "./components/Header";
import Router from "./Router";

function App() {
  const isLogado = true;

  return (
    <div className="body">
      <div className="container">
        {isLogado ? (
          <>
            <header>
              <Header />
            </header>
          </>
        ) : (
          ""
        )}
      </div>
      <div style={{marginRight: "5%"}}>
        <Router />
      </div>
    </div>
  );
}

export default App;
