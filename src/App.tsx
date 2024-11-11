import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";
import { IUsuarioStore } from "./store/UsuarioStore/types";
import { OPERADOR_ENUM, validarPermissao } from "./permissoes";

function App() {
  const [usuarioSessao] = useState<IUsuarioStore>(buscaUsuarioSessao());
  const [carregarNotificacao,setCarregarNotificacao] = useState<boolean>(false);

  const buscarContextCarregarNotificao = (carregarNotificacao:boolean) => {
      setCarregarNotificacao(carregarNotificacao);
  }

  return (
    <div className="container">
      {usuarioSessao?.token && (<><Header carregarNotificacao={carregarNotificacao} /></>)}
      <div className="content">
        {usuarioSessao?.token && validarPermissao(OPERADOR_ENUM.MENOR,4) ? (<><SideBar /></>) : <></>}
        <Router buscarContextCarregarNotificao={buscarContextCarregarNotificao}  />
      </div>
    </div>
  );
}

export default App;
