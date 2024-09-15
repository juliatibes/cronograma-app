import { FC } from "react";
import InputPadrao from "../../components/InputPadrao";
import "./index.css"; 
import SideMenu from "../../components/SideMenu";
import BotaoPadrao from "../../components/BotaoPadrao";
import DiaSemanaInput from "../../components/DiaSemanaInput";


const CadastroProfessor: FC = () => {
 return (
    <main>
        < SideMenu />
       
        <div className="cadastro-professor">
        <h2>Professor - Adicionar</h2>
        <div className="cadastro-professor-nome-email">
            < InputPadrao label={"Nome completo"} type={"text"} />
            < InputPadrao label={"E-mail"} type={"email"} />
        </div>
        <div className="cadastro-professor-celular-cpf">
            < InputPadrao label={"Celular"} type={"number"} />
            < InputPadrao label={"CPF"} type={"number"} />
        </div>
        <h2>Dias disponíveis para aula</h2>
        <div className="cadastro-professor-dias-semana">
            <DiaSemanaInput />
        </div>
        <div className="botao-salvar">
        <BotaoPadrao label={"Salvar"} />
        </div>
        </div>
        
    </main>
 );
}

export default CadastroProfessor;