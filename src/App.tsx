import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";
import { IUsuarioStore } from "./store/UsuarioStore/types";
import { OPERADOR_ENUM, validarPermissao } from "./permissoes";

function App() {
  const [usuarioSessao] = useState<IUsuarioStore>(buscaUsuarioSessao());

  return (
    <div className="container">
      {usuarioSessao?.token && (<><Header /></>)}
      <div className="content">
        {usuarioSessao?.token && validarPermissao(OPERADOR_ENUM.MENOR,4) ? (<><SideBar /></>) : <></>}
        <Router />
      </div>
    </div>
  );
}

export default App;
