import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
