import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Periodo: FC = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/cadastroperiodo");
  };
  return (
    <main>
      <SideMenu />
      <div className="cadastro-periodo">
        <h2>Período</h2>
        <div className="botao-adicionar">
          <BotaoPadrao label={"Adicionar"} onClick={handleAddClick} />
        </div>
      </div>
    </main>
  );
};

export default Periodo;
