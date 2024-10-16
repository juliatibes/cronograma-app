import { FC, useEffect, useState } from "react";
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
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AlternateEmail, CalendarMonth, Phone } from "@mui/icons-material";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CursoFaseLista from "../../components/CursoFaseLista";
import { apiGet, STATUS_CODE } from "../../api/RestClient";
import { ICurso } from "../../types/curso";
import { STATUS_ENUM } from "../../types/statusEnum";
import { IToggleStatusEnum } from "../../types/toggleStatusEnum";

const Curso: FC = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [toggleStates, setToggleStates] = useState<IToggleStatusEnum[]>([]);

  const carregarCurso = async () => {
    const response = await apiGet('/curso/carregar');


    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
    }

    if (response.status === STATUS_CODE.OK) {
      setCursos(response.data);
      setToggleStates(
        response.data.map((curso:ICurso) => {
          const toggleStatusEnum: IToggleStatusEnum = {
            id: curso.id,
            statusEnum: curso.statusEnum
          }
          return toggleStatusEnum;
        }
        ));
      return;
    }
  }

  const verificarToggleStatusEnum = (id: number): boolean => {
    const toggleStatusEnum = toggleStates.find((toggleStatusEnum) => (toggleStatusEnum.id === id));
    return toggleStatusEnum ? toggleStatusEnum.statusEnum === STATUS_ENUM.ATIVO : false;
  }

  const handleToggle = (id: number) => {
    setToggleStates((prevState) =>
      prevState.map((state) => {
        if (state.id === id) {
          return {
            ...state,
            statusEnum: state.statusEnum === STATUS_ENUM.ATIVO ? STATUS_ENUM.INATIVO : STATUS_ENUM.ATIVO,
          };
        }
        return state;
      })
    );
  };

  const handleAddClick = () => {
    navigate("/cadastrocurso");
  };

  useEffect(() => {
    carregarCurso();
  }, [])

  return (
    <main>
      <SideMenu />
      <div className="cadastro-curso">
        <div style={{ display: 'flex' }}>
          <h2>Curso</h2>
          <BotaoPadrao label={"Adicionar"} onClick={handleAddClick} />
        </div>
        <div>
          <CursoFaseLista curso={"ADS"} fases={""} editavel={true} onClickListItemText={function (faseId: number, cursoId: number): void {
            throw new Error("Function not implemented.");
          }} onClickRemoveCircleOutlineIcon={function (): void {
            throw new Error("Function not implemented.");
          }} />
        </div>
        <div id="teste">
          {cursos.map((curso) => (
            <CardPadrao
              key={curso.id}
              titulo={curso.nome}
              body={[
                <CardPadraoBodyItem icon={<Phone />} label={curso.sigla} />,
                <CardPadraoBodyItem icon={<AutoStoriesIcon />} label={curso.fases.map((fase) => (fase.numero + "ª Fase")).join(', ')} />,
              ]}
              actions={[
                <CardPadraoActionItem icon={<EditNoteIcon />} onClick={() => { }} />,
                (
                  verificarToggleStatusEnum(curso.id) ?
                  (<CardPadraoActionItem icon={<ToggleOffOutlinedIcon />} onClick={() => { handleToggle(curso.id) }} />) :
                  (<CardPadraoActionItem icon={<ToggleOnOutlinedIcon />} onClick={() => { handleToggle(curso.id); }} />)
                ),
              ]}
            />
          ))}
        </div>
      </div>
    </main>
  )
};

export default Curso;
