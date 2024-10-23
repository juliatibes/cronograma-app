import { FC } from "react";
import "./index.css";
import logoEmpresa from "../../assets/logo-senacplan.png";
import IconeLogin from "../IconLogin";

const MenuBar: FC = () => {
  return (
    <>
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
    </>
  );
};

export default MenuBar;
