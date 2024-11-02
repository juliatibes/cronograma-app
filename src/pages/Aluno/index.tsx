import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import { useNavigate } from "react-router-dom";

const Aluno: FC = () => {
    const navigate = useNavigate(); 

  const handleAddClick = () => {
    navigate("/cadastroaluno");
  };
  return(
    <main >
      <div className="cadastro-aluno">
        <div className="aluno-header">
          <h2>Alunos</h2>
          <div className="botao-adicionar">
              <BotaoPadrao label={"Adicionar"}  onClick={handleAddClick} />
          </div>
        </div>
      </div>
  </main>
)};

export default Aluno;
