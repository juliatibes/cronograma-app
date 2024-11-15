import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Professor from "./pages/Professor";
import Coordenador from "./pages/Coordenador";
import Curso from "./pages/Curso";
import Periodo from "./pages/Periodo";
import Fase from "./pages/Fase";
import Aluno from "./pages/Aluno";
import Cronograma from "./pages/Cronograma";
import DataBloqueada from "./pages/DataBloqueada";
import Disciplina from "./pages/Disciplina";
import RedefinirSenhaEmail from "./pages/RedefinirSenhaEmail";
import { IEvento } from "./types/evento";

interface RouterProperties {
  buscarContextCarregarNotificao: (carregarNotificacao: boolean) => void,
  notificacao?:IEvento,
  estadoUnicoNotificacao?:number,
}

const Router: FC<RouterProperties> = ({ buscarContextCarregarNotificao,notificacao,estadoUnicoNotificacao }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinirsenha" element={<RedefinirSenhaEmail />} />
        <Route path="/disciplinas" element={<Disciplina />} />
        <Route path="/professores" element={<Professor />} />
        <Route path="/periodos" element={<Periodo />} />
        <Route path="/coordenadores" element={<Coordenador />} />
        <Route path="/cursos" element={<Curso />} />
        <Route path="/fases" element={<Fase />} />
        <Route path="/alunos" element={<Aluno />} />
        <Route
          path="/cronogramas"
          element={
            <Cronograma
              buscarContextCarregarNotificao={buscarContextCarregarNotificao}
              notificacao={notificacao}
              estadoUnicoNotificacao={estadoUnicoNotificacao} />
          }
        />
        <Route path="/datasbloqueadas" element={<DataBloqueada />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
