import "./index.css";
import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";

function App() {

  const isLogado = buscaUsuarioSessao().token ? true : false;

  return (
    <div className="container">
      {isLogado && (<><Header /></>)}
      <div className="content">
        <Router />
      </div>
    </div>
  );
}

export default App;
