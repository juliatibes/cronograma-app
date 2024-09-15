import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import { useNavigate } from "react-router-dom";

const Curso: FC = () => {
    const navigate = useNavigate(); 

  const handleAddClick = () => {
    navigate("/cadastrocurso");
  };
  return(
<main>
      <SideMenu />
      <div className="cadastro-curso">
          <h2>Curso</h2>
          <div className="botao-adicionar">
              <BotaoPadrao label={"Adicionar"}  onClick={handleAddClick} />
          </div>
      </div>
  </main>
)};

export default Curso;
