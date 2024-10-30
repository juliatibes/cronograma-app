import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";
import { IUsuarioStore } from "./store/UsuarioStore/types";

function App() {
  const [usuarioSessao, setUsuarioSessao] = useState<IUsuarioStore>();
  
  const validarNivelRankingAluno = () => {
    if(usuarioSessao?.niveisAcesso){
      return usuarioSessao.niveisAcesso.some((nivelAcesso) => nivelAcesso.rankingAcesso < 4);
    } 
  }

  useEffect(() => {
    setUsuarioSessao(buscaUsuarioSessao());
  }, []);

  return (
    <div className="container">
      {usuarioSessao?.token && (<><Header /></>)}
      <div className="content">
        {usuarioSessao?.token && validarNivelRankingAluno() ? (<><SideBar /></>) : <></>}
        <Router />
      </div>
    </div>
  );
}

export default App;
