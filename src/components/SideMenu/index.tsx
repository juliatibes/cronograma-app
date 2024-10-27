import { CalendarMonth, EditNote, PeopleAlt } from "@mui/icons-material";
import { FC } from "react";
import "./index.css";
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';

const SideBar: FC = () => {
    return (
        <div className="side-menu">
            <ul className="side-menu-lista">
                <li> <CalendarMonthIcon /> <a href="/cronograma">Cronograma</a></li>
                <li> <SchoolIcon /> <a href="/professor">Professores</a></li>
                <li> <HistoryEduIcon /> <a href="#">Disciplinas</a></li>
                <li> <AutoStoriesIcon /> <a href="/fase">Fases</a></li>
                <li> <AccountBalanceIcon /> <a href="/curso">Cursos</a></li>
                <li> <PersonIcon /> <a href="/aluno">Alunos</a></li>
                <li> <PeopleIcon /> <a href="/coordenador">Coordenadores</a></li>
                <li> <TimelapseOutlinedIcon /> <a href="/periodo">Periodo</a></li>
            </ul>
        </div>
    );
};

export default SideBar;