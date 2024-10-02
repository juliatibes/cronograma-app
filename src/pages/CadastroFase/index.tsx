import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import InputPadrao from "../../components/InputPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css"; 
import CoordenadorInput from "../../components/CoordenadorInput";


const CadastroFase: FC = () => {
    return (
        <main>
            < SideMenu />
           
            <div className="cadastro-fase">
            <h2>Fase - Adicionar</h2>
            <div className="cadastro-fase-nome">
                < InputPadrao label={"Nome"} type={"text"} />
            </div>
            <div className="botao-salvar">
            <BotaoPadrao label={"Salvar"} />
            </div>
            </div>
            
        </main>
     );

}

export default CadastroFase;