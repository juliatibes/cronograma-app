import { CalendarMonth, School, AccountBalance, Person, People, HistoryEdu, AutoStories, TimelapseOutlined, EventBusy } from "@mui/icons-material";
import { FC } from "react";
import "./index.css";
import { OPERADOR_ENUM, validarPermissao } from "../../permissoes";
const SideBar: FC = () => {
    return (
        <div className="side-menu">
            <ul className="side-menu-lista">
                {
                 validarPermissao(OPERADOR_ENUM.MENOR, 4) &&
                 <li> <CalendarMonth /> <a href="/cronograma">Cronograma</a></li>
                }


                {
                 validarPermissao(OPERADOR_ENUM.MENOR, 3) &&
                 <>
                    <li> <Person /> <a href="/aluno">Alunos</a></li>
                    <li> <School /> <a href="/professor">Professores</a></li>
                 </>
                }

                {
                 validarPermissao(OPERADOR_ENUM.MENOR, 2) && 
                 <li> <People /> <a href="/coordenador">Coordenadores</a></li>
                }

                {
                 validarPermissao(OPERADOR_ENUM.MENOR, 3) && 
                 <li> <HistoryEdu /> <a href="#">Disciplinas</a></li>
                }

                {
                validarPermissao(OPERADOR_ENUM.MENOR, 2) &&
                <>
                    <li> <AutoStories /> <a href="/fase">Fases</a></li>
                    <li> <AccountBalance /> <a href="/curso">Cursos</a></li>
                    <li> <EventBusy /> <a href="/databloqueada">Data Bloqueada</a></li>
                    <li> <TimelapseOutlined /> <a href="/periodo">Periodo</a></li>
                 </>
                }

            </ul>
        </div>
    );
};

export default SideBar;