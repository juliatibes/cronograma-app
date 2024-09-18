import { CalendarMonth, EditNote, PeopleAlt } from "@mui/icons-material";
import { FC } from "react";
import "./index.css"; 
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const SideBar: FC = () => {
return(
<div>
    <div className="side-menu">
    <ul className="side-menu-lista">
        <li> <CalendarMonthIcon /> <a href="#">Cronograma</a></li>
        <li> <SchoolIcon /> <a href="professor">Professores</a></li>
        <li> <HistoryEduIcon /> <a href="#">Disciplinas</a></li>
        <li> <AutoStoriesIcon /> <a href="#">Fases</a></li>
        <li> <AccountBalanceIcon /> <a href="/curso">Cursos</a></li>
        <li> <PersonIcon /> <a href="#">Alunos</a></li>
        <li> <PeopleIcon /> <a href="/coordenador">Coordenadores</a></li>
        <li> <HistoryIcon /> <a href="#">Historico</a></li>
    </ul>
    </div>
</div>

);
};

export default SideBar;