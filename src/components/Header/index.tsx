import { FC } from "react";
import "./index.css";
import logoEmpresa from "../../assets/logo-senacplan.png";
import Notificacao from "../Notificacao";
import IconeLogin from "../IconLogin";
import { buscaUsuarioSessao } from "../../store/UsuarioStore/usuarioStore";

const MenuBar: FC = () => {
  return (
    <>
      <header>
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
              <Notificacao />
            }
            <IconeLogin />
          </div>
        </div>
      </header>
    </>
  );
};

export default MenuBar;
