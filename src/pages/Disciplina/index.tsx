import { AccountBalance, People, AutoStories, VisibilityOutlined, EditNote, ToggleOffOutlined, ToggleOnOutlined } from "@mui/icons-material";
import { FC, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import { STATUS_ENUM } from "../../types/statusEnum";
import { AlertColor, Divider } from "@mui/material";
import { apiGet, STATUS_CODE } from "../../api/RestClient";
import AlertaPadrao from "../../components/AlertaPadrao";
import CursoFaseLista from "../../components/CursoFaseLista";
import { validarPermissao, OPERADOR_ENUM } from "../../permissoes";
import "./index.css";
import { ICurso, ICursoPorUsuario } from "../../types/curso";
import { IDisciplina } from "../../types/disciplina";
import { IPaginacao } from "../../types/paginacao";



const Disciplina: FC = () => {
    const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
    const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
    const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

    const [cursosPorUsuario, setCursosPorUsuario] = useState<ICursoPorUsuario[]>([]);
    const [disciplinaPorCursoFase,setDisciplinaPorCursoFase] = useState<IDisciplina>();

    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {//tratamento erro
        setEstadoAlerta(false);
        // setEstadoModal(false);
    
        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
      }

    const carregarCursoPorUsuario = async () => {

        const response = await apiGet('/curso/carregar/usuario');

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setCursosPorUsuario(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");//tratamento erro
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const carregarDisciplinaCursoFase = async (faseId: number, cursoId: number, editavel: boolean) => {

        const paginacao:IPaginacao = {
            exibir:5,
            paginaAtual:1
        }

        const response = await
            apiGet(`/disciplina/carregar/curso/${cursoId}/fase/${faseId}`,paginacao);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setDisciplinaPorCursoFase(response.data);
            // setEditavel(editavel);
            // setCursoIdSelecionado(cursoId);
            // setFaseIdSelecionado(faseId);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }


    useEffect(() => {
        carregarCursoPorUsuario();
    },[])

    return <>
        <AlertaPadrao
            key={estadoAlerta ? "show" : "close"} //componente tratamento erro
            estado={estadoAlerta}
            cor={corAlerta}
            mensagens={mensagensAlerta}
            onClose={() => {
                setEstadoAlerta(false);
            }}
        />

        <main className="page-main">
            <div className="page-main-title" style={{marginBottom:0}}>
                <h2>Disciplinas</h2>
                <BotaoPadrao label={"Adicionar"} onClick={() => { }} />
            </div>
            <Divider className="divider" />
            <div className="disciplina-cursos">
                {
                    cursosPorUsuario && cursosPorUsuario.length > 0 ?
                    cursosPorUsuario.map((curso) => (
                            <CursoFaseLista
                                key={curso.id}
                                curso={curso}
                                editavel={false}
                                onClickListItemText={carregarDisciplinaCursoFase}
                                onClickRemoveCircleOutlineIcon={() => {}}
                            />
                        )) :
                        <p className="cronograma-sem-curso">Não existe cursos cadastrados</p>
                }
            </div>
            <Divider className="divider" />
            {/* <div className="grid-content">
                {disciplinas.map((disciplina) => (
                    <CardPadrao
                        key={disciplina.id}
                        statusEnum={disciplina.statusEnum}
                        titulo={disciplina.sigla}
                        body={[
                            <CardPadraoBodyItem icon={<AccountBalance titleAccess="Curso" />} label={""} />,
                            <CardPadraoBodyItem icon={<People titleAccess="Coordenador" />} label={""} />,
                            <CardPadraoBodyItem icon={<AutoStories titleAccess="Fases" />} label={""} />,
                        ]}
                        actions={[
                            <CardPadraoActionItem
                                icon={<VisibilityOutlined titleAccess="Visualizar" />}
                                onClick={() => { }}
                            />,
                            (
                                disciplina.statusEnum === STATUS_ENUM.ATIVO ?
                                    (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => { }} />) :
                                    <></>
                            ),
                            (
                                disciplina.statusEnum === STATUS_ENUM.INATIVO ?
                                    (<CardPadraoActionItem icon={<ToggleOffOutlined titleAccess="Inativado" color="error" />} onClick={() => { }} />) :
                                    (<CardPadraoActionItem icon={<ToggleOnOutlined titleAccess="Ativado" />} onClick={() => { }} />)
                            ),
                        ]}
                    />
                ))}
            </div> */}
        </main>
    </>
}

export default Disciplina;

