import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { AlternateEmail, CalendarMonth, Phone } from "@mui/icons-material";

const Professor: FC = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/cadastroprofessor");
  };

  return (
    <main>
      <SideMenu />
      <div className="cadastro-professor">
        <div className="header-professor">
          <h2>Professor</h2>
          <div className="botao-adicionar">
            <BotaoPadrao label={"Adicionar"} onClick={handleAddClick} />
          </div>
        </div>

        <div className="professores-grid">
          {/* Card de informações do professor */}
          <div className="professor-card">
            <h3>Muriel de Muriel Muriel Muriel</h3>
            <p>
              <strong>
                <AlternateEmail />{" "}
              </strong>
              MurielMuriel@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
            </p>
            <p>
              <strong>
                <Phone />{" "}
              </strong>
              (48) 99867-4282
            </p>
            <p>
              <strong>
                <CalendarMonth />{" "}
              </strong>
              Terça, sexta
            </p>
          </div>
          <div className="professor-card">
            <h3>Maria Souza</h3>
            <p>
              <strong>Email: </strong>maria.souza@universidade.com
            </p>
            <p>
              <strong>Telefone: </strong>(21) 98888-1234
            </p>
            <p>
              <strong>Dias disponiveis: </strong>Segunda, Sexta
            </p>
          </div>
          <div className="professor-card">
            <h3>Muriel de Muriel Muriel</h3>
            <p>
              <strong>
                <AlternateEmail />{" "}
              </strong>
              MurielMuriel@gmail.com
            </p>
            <p>
              <strong>
                <Phone />{" "}
              </strong>
              (48) 99867-4282
            </p>
            <p>
              <strong>
                <CalendarMonth />{" "}
              </strong>
              Terça, sexta
            </p>
          </div>
          <div className="professor-card">
            <h3>Muriel de Muriel Muriel</h3>
            <p>
              <strong>
                <AlternateEmail />{" "}
              </strong>
              MurielMuriel@gmail.com
            </p>
            <p>
              <strong>
                <Phone />{" "}
              </strong>
              (48) 99867-4282
            </p>
            <p>
              <strong>
                <CalendarMonth />{" "}
              </strong>
              Terça, sexta
            </p>
          </div>
          <div className="professor-card">
            <h3>Paulo Fernandes</h3>
            <p>
              <strong>Email: </strong>paulo.fernandes@universidade.com
            </p>
            <p>
              <strong>Telefone: </strong>(31) 97777-9876
            </p>
            <p>
              <strong>Dias disponiveis: </strong>Quinta, Sábado
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Professor;
