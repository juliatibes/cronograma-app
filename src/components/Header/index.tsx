import { FC } from "react";
import "./index.css";
import logoEmpresa from "../../assets/logo-senacplan.png";

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
        </div>
      </header>
    </>
  );
};

export default MenuBar;
