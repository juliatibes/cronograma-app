import "./index.css";
import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";

function App() {
  const [isLogado, setIsLogado] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLogado(buscaUsuarioSessao().token ? true : false);
    }, 50);
  },[])

  return (
    <div className="container">
      {isLogado && (<><Header /></>)}
      <div className="content">
        {isLogado && (<><SideBar /></>)}
        <Router />
      </div>
    </div>
  );
}

export default App;
