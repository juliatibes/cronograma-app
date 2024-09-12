import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroProfessor from "./pages/CadastroProfessor";
import CadastroPeriodo from "./pages/CadastroPeriodo";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastroprofessor" element={<CadastroProfessor />} />
        <Route path="/cadastroperiodo" element={<CadastroPeriodo/>} />
      </Routes> 
    </BrowserRouter>
  );
};

export default Router;
