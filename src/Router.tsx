import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroProfessor from "./pages/CadastroProfessor";
import CadastroPeriodo from "./pages/CadastroPeriodo";
import CadastroCoordenador from "./pages/CadastroCoordenador";
import CadastroCurso from "./pages/CadastroCurso";
import Professor from "./pages/Professor";
import Coordenador from "./pages/Coordenador";
import Curso from "./pages/Curso";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastroprofessor" element={<CadastroProfessor />} />
        <Route path="/cadastroperiodo" element={<CadastroPeriodo/>} />
        <Route path="/cadastrocoordenador" element={<CadastroCoordenador />} />
        <Route path="/cadastrocurso" element={<CadastroCurso />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/coordenador" element={<Coordenador />} />
        <Route path="/curso" element={<Curso />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
