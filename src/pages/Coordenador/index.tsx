import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import { useNavigate } from "react-router-dom";

const Coordenador: FC = () => {
    const navigate = useNavigate(); 

  const handleAddClick = () => {
    navigate("/cadastrocoordenador");
  };
  return(
<main>
      <SideMenu />
      <div className="cadastro-coordenador">
          <h2>Coordenador</h2>
          <div className="botao-adicionar">
              <BotaoPadrao label={"Adicionar"}  onClick={handleAddClick} />
          </div>
      </div>
  </main>
)};

export default Coordenador;
