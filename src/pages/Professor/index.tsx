import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import { useNavigate } from "react-router-dom";

const Professor: FC = () => {
    const navigate = useNavigate(); 

  const handleAddClick = () => {
    navigate("/cadastroprofessor");
  };
  return(
<main>
      <SideMenu />
      <div className="cadastro-professor">
          <h2>Professor</h2>
          <div className="botao-adicionar">
              <BotaoPadrao label={"Adicionar"}  onClick={handleAddClick} />
          </div>
      </div>
  </main>
)};

export default Professor;
