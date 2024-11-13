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

const Router: FC = () => {
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
        <Route path="/cronogramas" element={<Cronograma />} />
        <Route path="/datasbloqueadas" element={<DataBloqueada />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
