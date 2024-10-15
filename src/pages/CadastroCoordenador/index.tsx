import { FC } from "react";
import "./index.css"; 
import SideMenu from "../../components/SideMenu";
import InputPadrao from "../../components/InputPadrao";
import BotaoPadrao from "../../components/BotaoPadrao";

const CadastroCoordenador: FC = () => {
    return (
        <main style={{width: "100%"}}>
            < SideMenu />
           
            <div className="cadastro-coordenador">
            <h2>Coordenador - Adicionar</h2>
            <div className="cadastro-coordenador-nome-email">
                < InputPadrao label={"Nome completo"} type={"text"} />
                < InputPadrao label={"E-mail"} type={"email"} />
            </div>
            <div className="cadastro-coordenador-celular-cpf">
                < InputPadrao label={"Celular"} type={"text"} />
                < InputPadrao label={"CPF"} type={"text"} />
            </div>
            <div className="botao-salvar">
            <BotaoPadrao label={"Salvar"} />
            </div>
            </div>
            
        </main>
     );

}

export default CadastroCoordenador;