import { FC } from "react";
import InputPadrao from "../../components/InputPadrao";
import "./index.css"; 
import SideMenu from "../../components/SideMenu";


const CadastroProfessor: FC = () => {
 return (
    <main>
        < SideMenu />
        <div className="cadastro-professor">
        <div className="cadastro-professor-nome-email">
            < InputPadrao label={"Nome completo"} type={"text"} />
            < InputPadrao label={"E-mail"} type={"email"} />
        </div>
        <div className="cadastro-professor-celular-cpf">
            < InputPadrao label={"Celular"} type={"number"} />
            < InputPadrao label={"CPF"} type={"number"} />
        </div>
        </div>
    </main>
 );
}

export default CadastroProfessor;