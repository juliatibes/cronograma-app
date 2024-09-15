import { FC } from "react";
import InputPadrao from "../../components/InputPadrao";
import "./index.css";
import SideMenu from "../../components/SideMenu";
import BotaoPadrao from "../../components/BotaoPadrao";

const CadastroPeriodo: FC = () => {
  return (
    <>
      <main>
        <SideMenu />
        <div className="cadastro-periodo">
          <div className="titulo">
            <h3 className="titulo-pagina">Período </h3>
            <span> - cadastro</span>
          </div>
          <div className="cadastro-periodo-nome">
            <InputPadrao label={"Nome do período"} type={"text"} />
          </div>
          <div className="cadastro-periodo-data">
            <InputPadrao label={"Data inicial"} type={"date"} />
            <InputPadrao label={"Data final"} type={"date"} />
          </div>
          <BotaoPadrao label={"Salvar"}/>
        </div>
      </main>
    </>
  );
};

export default CadastroPeriodo;
