import { FC } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css";
import { useNavigate } from "react-router-dom";
import CardPadrao from "../../components/CardPadrao";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { AlternateEmail, CalendarMonth, Phone } from "@mui/icons-material";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";

const Curso: FC = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/cadastrocurso");
  };
  return (
    <main>
      <SideMenu />
      <div className="cadastro-curso">
        <h2>Curso</h2>
        <div className="botao-adicionar">
          <BotaoPadrao label={"Adicionar"} onClick={handleAddClick} />
        </div>
        <div id="teste">
          <CardPadrao
            titulo={"Jose"}
            body={[
              <CardPadraoBodyItem icon={<AlternateEmail />} label={"MurielMuriel@gmail.com"} />,
              <CardPadraoBodyItem icon={<Phone />} label={"(48) 99867-4282"} />,
              <CardPadraoBodyItem icon={<CalendarMonth />} label={"Terça, sexta"} />,
            ]}
            actions={[
              <CardPadraoActionItem icon={<VisibilityIcon />} onClick={() => { }} />,
              <CardPadraoActionItem icon={<EditNoteIcon />} onClick={() => { }} />,
              <CardPadraoActionItem icon={<ToggleOffOutlinedIcon />} onClick={() => { }} />,
              <CardPadraoActionItem icon={<ToggleOnOutlinedIcon />} onClick={() => { }} />,
              <CardPadraoActionItem icon={<RemoveCircleOutlineOutlinedIcon />} onClick={() => { }} />,
            ]}
          />
        </div>
      </div>

    </main>
  )
};

export default Curso;
