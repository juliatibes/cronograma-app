import Header from "./components/Header";
import Router from "./Router";
import { buscaUsuarioSessao } from "./store/UsuarioStore/usuarioStore";
import SideBar from "./components/SideMenu";
import { useEffect, useState } from "react";
import { IUsuarioStore } from "./store/UsuarioStore/types";
import { OPERADOR_ENUM, validarPermissao } from "./permissoes";
import { IEvento } from "./types/evento";

function App() {
  const [usuarioSessao] = useState<IUsuarioStore>(buscaUsuarioSessao());
  const [carregarNotificacao, setCarregarNotificacao] = useState<boolean>(false);
  const [notificacao, setNotificacao] = useState<IEvento>();
  const [estadoUnicoNotificacao, setEstadoUnicoNotificacao] = useState<number>();

  const buscarContextCarregarNotificao = (carregarNotificacao: boolean) => {
    setCarregarNotificacao(carregarNotificacao);
  }

  const buscarNotificacaoSucessoSelecionada = (notificacao: IEvento,estadoUnicoNotificacao:number) => {
    setNotificacao(notificacao);
    setEstadoUnicoNotificacao(estadoUnicoNotificacao);
  }

  return (
    <div className="container">
      {
        usuarioSessao?.token &&
        (<Header
          carregarNotificacao={carregarNotificacao}
          buscarNotificacaoSucessoSelecionada={buscarNotificacaoSucessoSelecionada}
        />)
      }
      <div className="content">
        {usuarioSessao?.token && validarPermissao(OPERADOR_ENUM.MENOR, 4) ? (<><SideBar /></>) : <></>}
        <Router 
          buscarContextCarregarNotificao={buscarContextCarregarNotificao} 
          notificacao={notificacao}
          estadoUnicoNotificacao={estadoUnicoNotificacao}
        />
      </div>
    </div>
  );
}

export default App;
