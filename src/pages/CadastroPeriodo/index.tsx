import { FC } from "react";
import InputPadrao from "../../components/InputPadrao";
import "./index.css";
import SideMenu from "../../components/SideMenu";

const CadastroPeriodo: FC = () => {
  return (
    <>
      <main>
        <SideMenu />
        <div className="cadastro-periodo">
          <div className="cadastro-periodo-nome-email">
            <InputPadrao label={"Nome completo"} type={"text"} />
            <InputPadrao label={"E-mail"} type={"email"} />
          </div>
          <div className="cadastro-periodo-celular-cpf">
            <InputPadrao label={"Celular"} type={"number"} />
            <InputPadrao label={"CPF"} type={"number"} />
          </div>
        </div>
      </main>
    </>
  );
};

export default CadastroPeriodo;
