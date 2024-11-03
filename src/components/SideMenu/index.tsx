import {
  CalendarMonth,
  School,
  AccountBalance,
  Person,
  People,
  HistoryEdu,
  AutoStories,
  TimelapseOutlined,
  EventBusy,
} from "@mui/icons-material";
import { FC } from "react";
import "./index.css";
import { OPERADOR_ENUM, validarPermissao } from "../../permissoes";
const SideBar: FC = () => {
  return (
    <div className="side-menu">
      <ul className="side-menu-lista">
        {validarPermissao(OPERADOR_ENUM.MENOR, 4) && (
          <a href="/cronogramas">
            <li>
              <CalendarMonth /> 
              Cronogramas
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 3) && (
          <>
            <a href="/alunos">
              <li>
                <Person /> 
                Alunos
              </li>
            </a>
            <a href="/professores">
              <li>
                <School />
                Professores
              </li>
            </a>
          </>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 2) && (
          <a href="/coordenadores">
            <li>
              <People /> 
              Coordenadores
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 3) && (
          <a href="/disciplinas">
            <li>
              <HistoryEdu /> 
              Disciplinas
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 2) && (
          <>
            <a href="/fases">
              <li>
                <AutoStories /> 
                Fases
              </li>
            </a>
            <a href="/cursos">
              <li>
                <AccountBalance />
                Cursos
              </li>
            </a>
            <a href="/datasbloqueadas">
              <li>
                <EventBusy /> 
                Datas Bloqueadas
              </li>
            </a>
            <a href="/periodos">
              <li>
                <TimelapseOutlined />
                Períodos
              </li>
            </a>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideBar;
