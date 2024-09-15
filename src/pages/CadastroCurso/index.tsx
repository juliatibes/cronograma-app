import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import InputPadrao from "../../components/InputPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import CoordenadorInput from "../../components/CoordenadorInput";


const CadastroCurso: FC = () => {
    return (
        <main>
            < SideMenu />
           
            <div className="cadastro-curso">
            <h2>Curso - Adicionar</h2>
            <div className="cadastro-curso-nome">
                < InputPadrao label={"Nome completo"} type={"text"} />
            </div>
            <div className="cadastro-professor-dias-semana">    
            < CoordenadorInput />
            </div>
            <div className="botao-salvar">
            <BotaoPadrao label={"Salvar"} />
            </div>
            </div>
            
        </main>
     );

}

export default CadastroCurso;