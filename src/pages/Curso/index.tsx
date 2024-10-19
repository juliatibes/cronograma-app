import { FC, useCallback, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import "./index.css";
import { useNavigate } from "react-router-dom";
import CardPadrao from "../../components/CardPadrao";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { AccountBalance, People } from "@mui/icons-material";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import { apiGet, apiPut, STATUS_CODE } from "../../api/RestClient";
import { ICurso } from "../../types/curso";
import { STATUS_ENUM } from "../../types/statusEnum";
import { AlertColor } from "@mui/material";
import AlertPadrao from "../../components/AlertaPadrao";

const Curso: FC = () => {
  const navigate = useNavigate();
  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [cursos, setCursos] = useState<ICurso[]>([]);

  const carregarCurso = async () => {
    const response = await apiGet('/curso/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
    }

    if (response.status === STATUS_CODE.OK) {
      setCursos(response.data);
    }
  }

  const alterarStatusCurso = async (id: number, nome: string, ativar: boolean) => {
    const response = await apiPut(`/curso/${ativar ? "ativar" : "inativar"}/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {

      setEstadoAlerta(true);
      setMensagensAlerta([`${nome} ${ativar ? "ativado" : "inativado"} com sucesso!`]);
      setCorAlerta("success");
      carregarCurso();
    }
  }

  const handleAddClick = () => {
    navigate("/cadastrocurso");
  };

  useEffect(() => {
    carregarCurso();
  }, []);

  return <>
    <AlertPadrao
      estado={estadoAlerta}
      cor={corAlerta}
      mesnsagens={mensagensAlerta}
      onClose={() => {
        setEstadoAlerta(false);
      }}
    />
    <main className="cadastro-curso">
      <div style={{ display: 'flex' }}>
        <h2>Curso</h2>
        <BotaoPadrao label={"Adicionar"} onClick={handleAddClick} />
      </div>
      <div className="curso-content">
        {cursos.map((curso) => (
          <CardPadrao
            key={curso.id}
            titulo={curso.sigla}
            body={[
              <CardPadraoBodyItem icon={<AccountBalance titleAccess="Curso" />} label={curso.nome} />,
              <CardPadraoBodyItem icon={<People titleAccess="Coordenador" />} label={curso.coordenador ? curso.coordenador.nome : "Contratando..."} />,
              <CardPadraoBodyItem icon={<AutoStoriesIcon titleAccess="Fases" />} label={curso.fases.map((fase) => (fase.numero + "ª Fase")).join(', ')} />,
            ]}
            actions={[
              (
                curso.statusEnum === STATUS_ENUM.ATIVO ?
                  (<CardPadraoActionItem icon={<EditNoteIcon titleAccess="Editar" />} onClick={() => { }} />) :
                  <></>
              ),
              (
                curso.statusEnum === STATUS_ENUM.INATIVO ?
                  (<CardPadraoActionItem icon={<ToggleOffOutlinedIcon titleAccess="Inativado" color="error" />} onClick={() => alterarStatusCurso(curso.id, curso.sigla, true)} />) :
                  (<CardPadraoActionItem icon={<ToggleOnOutlinedIcon titleAccess="Ativado" />} onClick={() => alterarStatusCurso(curso.id, curso.nome, false)} />)
              ),
            ]}
          />
        ))}
      </div>
    </main>
  </>
};

export default Curso;
