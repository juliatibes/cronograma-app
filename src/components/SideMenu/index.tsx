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
          <a href="/cronograma">
            <li>
              {" "}
              <CalendarMonth /> 
              Cronogramas
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 3) && (
          <>
            <a href="/aluno">
              <li>
                {" "}
                <Person /> 
                Alunos
              </li>
            </a>
            <a href="/professor">
              <li>
                {" "}
                <School />
                Professores
              </li>
            </a>
          </>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 2) && (
          <a href="/coordenador">
            <li>
              <People /> 
              Coordenadores
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 3) && (
          <a href="#">
            <li>
              {" "}
              <HistoryEdu /> 
              Disciplinas
            </li>
          </a>
        )}

        {validarPermissao(OPERADOR_ENUM.MENOR, 2) && (
          <>
            <a href="/fase">
              <li>
                {" "}
                <AutoStories /> 
                Fases
              </li>
            </a>
            <a href="/curso">
              <li>
                {" "}
                <AccountBalance />
                Cursos
              </li>
            </a>
            <a href="/databloqueada">
              <li>
                {" "}
                <EventBusy /> 
                Datas Bloqueadas
              </li>
            </a>
            <a href="/periodo">
              <li>
                {" "}
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
