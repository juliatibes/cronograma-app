import { FC } from "react";
import "./index.css";
import logoEmpresa from "../../assets/logo-senacplan.png";
import IconeLogin from "../IconLogin";

const MenuBar: FC = () => {
  return (
    <>
    <header>
      <div className="menu-header">
        <ul>
          <li>
            <a href="/">
              <img src={logoEmpresa} alt="logo" className="logo" />
            </a>
          </li>
        </ul>
        <IconeLogin />
      </div>
    </header>
    </>
  );
};

export default MenuBar;
