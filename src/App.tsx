import "./index.css";
import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";

function App(){
   const [isLogado,setIsLogado] = useState<boolean>();

  useEffect(() => {
    setIsLogado(buscaUsuarioSessao().token ? true : false);
  },[])

  return (
    <div className="container">
      {isLogado && (<><Header /></>)}
      <div className="content">
      {isLogado && (<><SideBar/></>)}
        <Router />
      </div>
    </div>
  );
}

export default App;
