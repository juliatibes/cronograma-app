import { CalendarMonth, EditNote, PeopleAlt } from "@mui/icons-material";
import { FC } from "react";
import "./index.css"; 

const SideBar: FC = () => {
return(
<div>
    <div className="side-menu">
    <ul className="side-menu-lista">
        <li> <CalendarMonth /> <a href="#">Cronograma</a></li>
        <li> <CalendarMonth /> <a href="professor">Professores</a></li>
        <li> <CalendarMonth /> <a href="#">Disciplinas</a></li>
        <li> <CalendarMonth /> <a href="#">Fases</a></li>
        <li> <CalendarMonth /> <a href="/curso">Cursos</a></li>
        <li> <CalendarMonth /> <a href="#">Alunos</a></li>
        <li> <CalendarMonth /> <a href="/coordenador">Coordenadores</a></li>
        <li> <CalendarMonth /> <a href="#">Historico</a></li>
    </ul>
    </div>
</div>

);
};

export default SideBar;