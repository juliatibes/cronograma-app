import { FC } from "react";
import "./index.css";
import logoEmpresa from "../../assets/logo-senacplan.png";
import Notificacao from "../Notificacao";
import IconeLogin from "../IconLogin";
import { buscaUsuarioSessao } from "../../store/UsuarioStore/usuarioStore";
import { IEvento } from "../../types/evento";

interface MenuBarProperties {
  carregarNotificacao:boolean
  buscarNotificacaoSucessoSelecionada: (notificacao:IEvento, estadoUnicoNotificacao:number) => void
}

const MenuBar: FC<MenuBarProperties> = ({carregarNotificacao,buscarNotificacaoSucessoSelecionada}) => {
  return (
    <>
      <header className="header">
        <div className="menu-header">
          <ul>
            <li>
              <a href="/cronograma">
                <img src={logoEmpresa} alt="logo" className="logo" />
              </a>
            </li>
          </ul>
          <div className="menu-header-right">
            {
              buscaUsuarioSessao().niveisAcesso.some((nivelAcesso) => nivelAcesso.rankingAcesso < 3) &&
              <Notificacao 
                carregarNotificao={carregarNotificacao} 
                buscarNotificacaoSucessoSelecionada={buscarNotificacaoSucessoSelecionada} 
              />
            }
            <IconeLogin />
          </div>
        </div>
      </header>
    </>
  );
};

export default MenuBar;
