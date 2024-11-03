import { AccountBalance, VisibilityOutlined, EditNote, AccessTimeRounded, ToggleOff, ToggleOn, School } from "@mui/icons-material";
import { FC, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import { STATUS_ENUM } from "../../types/statusEnum";
import { AlertColor, Autocomplete, Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Modal, Pagination, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import AlertaPadrao from "../../components/AlertaPadrao";
import CursoFaseLista from "../../components/CursoFaseLista";
import faseNaoSelecionada from "../../assets/fase-nao-selecionada-disciplina.gif";
import "./index.css";
import { ICursoPorUsuario } from "../../types/curso";
import { IDisciplina, IDisciplinaRequest } from "../../types/disciplina";
import { IPaginacao, IPaginacaoResponse } from "../../types/paginacao";
import { BOOLEAN_ENUM, booleanEnumGetLabel } from "../../types/booleanEnum";
import InputPadrao from "../../components/InputPadrao";
import { HexColorPicker } from "react-colorful";
import { IFase } from "../../types/fase";
import { IProfessor } from "../../types/professor";
import { removerMascaraNumeros } from "../../util/mascaras";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";

const Disciplina: FC = () => {
    const [carregando, setCarregando] = useState<boolean>(false);

    const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
    const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
    const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

    const [estadoModal, setEstadoModal] = useState(false);
    const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);

    const [exibir] = useState<number>(6);
    const [paginaInicial] = useState<number>(1);
    const [paginaAtual, setPaginaAtual] = useState<number>(1);
    const [variosClicks, setVariosClicks] = useState<boolean>(false);
    const [paginacaoResponse, setPaginacaoResponse] = useState<IPaginacaoResponse>();

    const [cursosPorUsuario, setCursosPorUsuario] = useState<ICursoPorUsuario[]>([]);
    const [fasesPorCurso, setFasesPorCurso] = useState<IFase[]>([]);
    const [professores, setProfessores] = useState<IProfessor[]>([]);
    const [disciplinasPorCursoFase, setDisciplinasPorCursoFase] = useState<IDisciplina[]>([]);

    const [cursoIdSelecionado, setCursoIdSelecionado] = useState<number>();
    const [faseIdSelecionada, setFaseIdSelecionada] = useState<number>();

    const [id, setId] = useState<number>();
    const [nome, setNome] = useState<string>('');
    const [cargaHoraria, setCargaHoraria] = useState<string>('');
    const [cargaHorariaDiaria, setCargaHorariaDiaria] = useState<string>('4');
    const [corHexadecimal, setCorHexadecimal] = useState<string>('#013263');
    const [extensaoBooleanEnum, setExtensaoBooleanEnum] = useState<BOOLEAN_ENUM>(BOOLEAN_ENUM.NAO);
    const [cursoSelecionado, setCursoSelecionado] = useState<ICursoPorUsuario | null>();
    const [faseSelecionada, setFaseSelecionada] = useState<IFase | null>();
    const [professorSelecionado, setProfessorSelecionado] = useState<IProfessor | null>();

    const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);
    const [validarCampoCargaHoraria, setValidarCampoCargaHoraria] = useState<IValidarCampos>(valorInicialValidarCampos);
    const [validarCampoCargaHorariaDiaria, setValidarCampoCargaHorariaDiaria] = useState<IValidarCampos>(valorInicialValidarCampos);
    const [validarCampoCursoSelecionado, setValidarCampoCursoSelecionado] = useState<IValidarCampos>(valorInicialValidarCampos);
    const [validarCampoFaseSelecionada, setValidarCampoFaseSelecionada] = useState<IValidarCampos>(valorInicialValidarCampos);

    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
        setEstadoAlerta(false);
        setEstadoModal(false);

        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
    }

    const exibirErros = (mensagens: string[]) => {

        const existeErroEspecifico = mensagens.some(mensagem =>
            mensagem.includes("Nome") ||
            mensagem.includes("Carga Horária") ||
            mensagem.includes("Carga Horária Diária") ||
            mensagem.includes("Curso") ||
            mensagem.includes("Fase")
        );

        if (!existeErroEspecifico) {
            exibirAlerta(mensagens, "error");
            return;
        }

        for (const mensagem of mensagens) {
            if (mensagem.includes("Nome")) {
                setValidarCampoNome({ existeErro: true, mensagem: mensagem });
                continue;
            }
            if (mensagem.includes("Carga Horária Diária")) {
                setValidarCampoCargaHorariaDiaria({ existeErro: true, mensagem: mensagem });
                continue;
            }
            if (mensagem.includes("Carga Horária")) {
                setValidarCampoCargaHoraria({ existeErro: true, mensagem: mensagem });
                continue;
            }
            if (mensagem.includes("Curso")) {
                setValidarCampoCursoSelecionado({ existeErro: true, mensagem: mensagem });
                continue;
            }
            if (mensagem.includes("Fase")) {
                setValidarCampoFaseSelecionada({ existeErro: true, mensagem: mensagem });
            }
        }

    }

    const trocarPagina = (event: React.ChangeEvent<unknown>, page: number) => {
        if (variosClicks) {
            return;
        }

        setVariosClicks(true);

        setTimeout(() => {
            setVariosClicks(false);
            (
                faseIdSelecionada && cursoIdSelecionado &&
                carregarDisciplinasCursoFase(faseIdSelecionada, cursoIdSelecionado, false, page)
            )
        }, 300);

        setPaginaAtual(page);
    }

    const limparModal = () => {
        setId(undefined);
        setNome('')
        setCargaHoraria('');
        setCargaHorariaDiaria('4');
        setCorHexadecimal('#013263');
        setExtensaoBooleanEnum(BOOLEAN_ENUM.NAO);
        setFaseSelecionada(null);
        setProfessorSelecionado(null);
    }

    const limparErros = () => {
        setValidarCampoNome(valorInicialValidarCampos);
        setValidarCampoCargaHoraria(valorInicialValidarCampos);
        setValidarCampoCargaHorariaDiaria(valorInicialValidarCampos);
        setValidarCampoCursoSelecionado(valorInicialValidarCampos);
        setValidarCampoFaseSelecionada(valorInicialValidarCampos);
    }

    const validarCampos = (): boolean => {
        let existeErro = false;

        if (!nome) {
            setValidarCampoNome(campoObrigatorio);
            existeErro = true;
        }

        if (!cargaHoraria) {
            setValidarCampoCargaHoraria(campoObrigatorio);
            existeErro = true;
        }

        if (!cargaHorariaDiaria) {
            setValidarCampoCargaHorariaDiaria(campoObrigatorio);
            existeErro = true;
        }

        if (!cursoSelecionado) {
            setValidarCampoCursoSelecionado(campoObrigatorio);
            existeErro = true;
        }

        if (!faseSelecionada) {
            setValidarCampoFaseSelecionada(campoObrigatorio);
            existeErro = true;
        }

        return existeErro;
    }

    const carregarCursoPorUsuario = async () => {

        const response = await apiGet('/curso/carregar/usuario');

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setCursosPorUsuario(response.data);
            setCursoSelecionado(response.data[0]);
            carregarFasePorCurso(response.data[0].id);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const carregarProfessor = async () => {
        const response = await apiGet(`professor/carregar/ativo`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setProfessores(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const carregarDisciplinasCursoFase = async (faseId: number, cursoId: number, editavel: boolean, page?: number) => {
        page ?? setPaginaAtual(1);

        const paginacao: IPaginacao = {
            exibir: exibir,
            paginaAtual: page ?? paginaInicial
        }

        const response = await
            apiGet(`/disciplina/carregar/curso/${cursoId}/fase/${faseId}`, paginacao);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setDisciplinasPorCursoFase(response.data.data);
            setPaginacaoResponse(response.data);
            setCursoIdSelecionado(cursoId);
            setFaseIdSelecionada(faseId);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const carregarDisciplinaPorId = async (id: number) => {
        const response = await apiGet(`/disciplina/carregar/${id}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = '/login';
        }

        if (response.status === STATUS_CODE.OK) {
            const disciplinaEncontrada: IDisciplina = response.data;

            carregarFasePorCurso(disciplinaEncontrada.curso.id);

            setId(id);
            setNome(disciplinaEncontrada.nome)
            setCargaHoraria(disciplinaEncontrada.cargaHoraria.toString());
            setCargaHorariaDiaria(disciplinaEncontrada.cargaHorariaDiaria.toString());
            setCorHexadecimal(disciplinaEncontrada.corHexadecimal);
            setExtensaoBooleanEnum(disciplinaEncontrada.extensaoBooleanEnum);
            setCursoSelecionado(disciplinaEncontrada.curso);
            setFaseSelecionada(disciplinaEncontrada.fase);
            setProfessorSelecionado(disciplinaEncontrada.professor);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const fecharModal = () => setEstadoModal(false);

    const fecharModalVisualizar = () => setEstadoModalVisualizar(false);

    const abrirModal = async (id?: number) => {
        limparModal();
        limparErros();

        carregarCursoPorUsuario();
        carregarProfessor();

        if (id) {
            carregarDisciplinaPorId(id);
        }

        setEstadoModal(true);
    }

    const carregarFasePorCurso = async (cursoId: number) => {
        const response = await apiGet(`fase/carregar/ativo/curso/${cursoId}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setFasesPorCurso(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const selecionarCurso = (cursosPorUsuario: ICursoPorUsuario | null) => {
        if (cursosPorUsuario) {
            setFaseSelecionada(null);
            setCursoSelecionado(cursosPorUsuario);
            carregarFasePorCurso(cursosPorUsuario.id);
        } else {
            setCursoSelecionado(null);
            setFaseSelecionada(null);
            setFasesPorCurso([]);
        }
    };

    const selecionarFase = (fasePorCurso: IFase | null) => {
        if (fasePorCurso) {
            setFaseSelecionada(fasePorCurso);
        } else {
            setFaseSelecionada(null);
        }
    };

    const selecionarProfessor = (professor: IProfessor | null) => {
        if (professor) {
            setProfessorSelecionado(professor);
        } else {
            setProfessorSelecionado(null);
        }
    };

    const salvar = async () => {
        limparErros();
        if (validarCampos()) return;

        setCarregando(true);
        const disciplinaRequest: IDisciplinaRequest = {
            nome: nome,
            cargaHoraria: +cargaHoraria,
            cargaHorariaDiaria: +cargaHorariaDiaria,
            corHexadecimal: corHexadecimal,
            extensaoBooleanEnum: extensaoBooleanEnum,
            cursoId: cursoSelecionado ? cursoSelecionado?.id : 0,
            faseId: faseSelecionada ? faseSelecionada?.id : 0,
            professorId: professorSelecionado?.id,
        }

        let response: IDataResponse | undefined = undefined;

        if (id) {
            response = await apiPut(`/disciplina/editar/${id}`, disciplinaRequest);
        } else {
            response = await apiPost(`/disciplina/criar`, disciplinaRequest);
        }

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = '/login';
        }

        if (response.status === STATUS_CODE.CREATED) {
            exibirAlerta([`Disciplina criada com sucesso!`], "success");
            carregarDisciplinasCursoFase(
                disciplinaRequest.faseId,
                disciplinaRequest.cursoId,
                false,
                paginaAtual
            )
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            exibirAlerta([`Disciplina editada com sucesso!`], "success");
            carregarDisciplinasCursoFase(
                disciplinaRequest.faseId,
                disciplinaRequest.cursoId,
                false,
                paginaAtual
            )
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirErros(mensagens);
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }

        setCarregando(false);
    }

    const alterarStatusCurso = async (disciplina: IDisciplina, ativar: boolean) => {
        const response = await apiPut(`/disciplina/${ativar ? "ativar" : "inativar"}/${disciplina.id}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = '/login';
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            exibirAlerta([`${disciplina.nome} ${ativar ? "ativada" : "inativada"} com sucesso!`], "success");
            carregarDisciplinasCursoFase(
                disciplina.fase.id,
                disciplina.curso.id,
                false,
                paginaAtual
            )
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirErros(mensagens);
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const visualizar = async (id: number) => {
        limparModal();
        carregarDisciplinaPorId(id);
        setEstadoModalVisualizar(true);
      }

    useEffect(() => {
        carregarCursoPorUsuario();
    }, [])

    return <>
        <AlertaPadrao
            key={estadoAlerta ? "show" : "close"}
            estado={estadoAlerta}
            cor={corAlerta}
            mensagens={mensagensAlerta}
            onClose={() => {
                setEstadoAlerta(false);
            }}
        />

        <Dialog
            open={estadoModalVisualizar}
            onClose={fecharModalVisualizar}
            fullWidth
            maxWidth="sm"
            sx={{ borderRadius: 4, padding: 2 }}
            PaperProps={{
                sx: {
                    outline: '2px solid var(--dark-blue-senac)',
                }
            }}
        >
            <DialogTitle fontSize='1.6rem' sx={{ textAlign: 'center', fontWeight: 'bolder' }}>
                {nome}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2, margin: "0px 0px 8px 0px",paddingTop: '2px' }}>
                    <Typography className="info-modal-visualizar-fields" component="div">
                        <Box component={'dl'}>
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Carga Horária:
                                </Typography>
                                <Typography component="dd">
                                    {cargaHoraria} hr
                                </Typography>
                            </Typography>
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Carga Horária Diária:
                                </Typography>
                                <Typography component="dd">
                                    {cargaHorariaDiaria} hr
                                </Typography>
                            </Typography>
                     
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Curso:
                                </Typography>
                                <Typography component="dd">
                                    {cursoSelecionado?.sigla}
                                </Typography>
                            </Typography>
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Fase:
                                </Typography>
                                <Typography component="dd">
                                    {faseSelecionada?.numero + "ª Fase"}
                                </Typography>
                            </Typography>
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Professor:
                                </Typography>
                                <Typography component="dd">
                                    {professorSelecionado ? professorSelecionado.nome : "Contratando..."}
                                </Typography>
                            </Typography>
                            <Typography className="info-modal-visualizar-linha" component="div">
                                <Typography component="dt">
                                    Extensão:
                                </Typography>
                                <Typography component="dd">
                                    {booleanEnumGetLabel(extensaoBooleanEnum)}
                                </Typography>
                            </Typography>
                        </Box>
                    </Typography>

                </Stack>
            </DialogContent>
        </Dialog>

        <Modal open={estadoModal} onClose={fecharModal} className="modal">
            <Box className='modal-box'>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Disciplina
                </Typography>
                <Typography
                    id="modal-modal-description"
                    component="div"
                >
                    <div className="modal-content">
                        <div className="modal-one-form-group">
                            < InputPadrao
                                label={"Nome"}
                                type={"text"}
                                value={nome}
                                onChange={(e) => {
                                    if (e) {
                                        setNome(e.target.value)
                                    }
                                }}
                                error={validarCampoNome.existeErro}
                                helperText={validarCampoNome.mensagem}
                            />
                        </div>
                        <div className="modal-two-form-group">
                            < InputPadrao
                                label={"Carga Horária"}
                                type={"text"}
                                value={removerMascaraNumeros(cargaHoraria)}
                                onChange={(e) => {
                                    if (e) {
                                        setCargaHoraria(removerMascaraNumeros(e.target.value))
                                    }
                                }}
                                error={validarCampoCargaHoraria.existeErro}
                                helperText={validarCampoCargaHoraria.mensagem}
                            />
                            < InputPadrao
                                label={"Carga Horária Diária"}
                                type={"text"}
                                value={removerMascaraNumeros(cargaHorariaDiaria)}
                                onChange={(e) => {
                                    if (e) {
                                        setCargaHorariaDiaria(removerMascaraNumeros(e.target.value))
                                    }
                                }}
                                error={validarCampoCargaHorariaDiaria.existeErro}
                                helperText={validarCampoCargaHorariaDiaria.mensagem}
                            />
                        </div>
                        <div className="modal-two-form-group">
                            <FormControl fullWidth>
                                <Autocomplete
                                    size="small"
                                    options={cursosPorUsuario}
                                    getOptionLabel={(curso: ICursoPorUsuario) => curso.sigla}
                                    value={cursoSelecionado}
                                    onChange={(event, value) => { selecionarCurso(value) }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Curso"
                                            error={validarCampoCursoSelecionado.existeErro}
                                            helperText={validarCampoCursoSelecionado.mensagem}
                                        />
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Autocomplete
                                    size="small"
                                    options={fasesPorCurso}
                                    getOptionLabel={(fase: IFase) => (fase.numero.toString() + "ª Fase")}
                                    value={faseSelecionada}
                                    onChange={(event, value) => { selecionarFase(value) }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Fase"
                                            error={validarCampoFaseSelecionada.existeErro}
                                            helperText={validarCampoFaseSelecionada.mensagem}
                                        />
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className="modal-one-form-group">
                            <FormControl fullWidth>
                                <Autocomplete
                                    size="small"
                                    options={professores}
                                    getOptionLabel={(professor: IProfessor) => professor.nome}
                                    value={professorSelecionado}
                                    onChange={(event, value) => { selecionarProfessor(value) }}
                                    renderInput={(params) => <TextField {...params} label="Professor" />}
                                />
                            </FormControl>
                        </div>
                        <div className="modal-two-form-group">
                            <div style={{ width: '50%' }}>
                                <Typography
                                    component="label"
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                        fontWeight: '400',
                                        fontSize: '1rem',
                                        lineHeight: '1.4375em',
                                        letterSpacing: '0.00938em',
                                        padding: 0,
                                        paddingLeft: "5px",
                                        position: 'relative',
                                        marginBottom: "15px"

                                    }}>
                                    Selecione a Cor da Disciplina
                                </Typography>
                                <HexColorPicker
                                    color={corHexadecimal}
                                    style={{ height: '100px', width: '100%' }}
                                    onChange={setCorHexadecimal}
                                />
                            </div>
                            <div style={{ width: '50%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Extensão (Sábado)</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={extensaoBooleanEnum}
                                        onChange={(e) => {
                                            if (e.target.value === BOOLEAN_ENUM.SIM || e.target.value === BOOLEAN_ENUM.NAO) {
                                                setExtensaoBooleanEnum(e.target.value as BOOLEAN_ENUM);
                                            }
                                        }}
                                    >
                                        <FormControlLabel value={BOOLEAN_ENUM.NAO} control={<Radio />} label="Não" />
                                        <FormControlLabel value={BOOLEAN_ENUM.SIM} control={<Radio />} label="Sim" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <BotaoPadrao
                            label={"Salvar"}
                            carregando={carregando}
                            onClick={salvar}
                        />

                    </div>
                </Typography>
            </Box>
        </Modal >

        <main className="page-main">
            <div className="page-main-title" style={{ marginBottom: 0 }}>
                <h2>Disciplinas</h2>
                <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
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
                                onClickListItemText={carregarDisciplinasCursoFase}
                                onClickRemoveCircleOutlineIcon={() => { }}
                            />
                        )) :
                        <p className="cronograma-sem-curso">Não existe cursos cadastrados</p>
                }
            </div>
            <Divider className="divider" />
            {
                disciplinasPorCursoFase.length > 0 ?
                    <div className="grid-content">
                        {disciplinasPorCursoFase.map((disciplina) => (
                            <CardPadrao
                                key={disciplina.id}
                                statusEnum={disciplina.statusEnum}
                                titulo={disciplina.nome}
                                disciplinaCorHexadecimal={disciplina.corHexadecimal}
                                body={[
                                    <CardPadraoBodyItem
                                        icon={<AccessTimeRounded titleAccess="Carga Horaria" />}
                                        label={disciplina.cargaHoraria.toString() + "hr"}
                                    />,
                                    <CardPadraoBodyItem
                                        icon={<AccountBalance titleAccess="Curso e Fase" />}
                                        label={`${disciplina.curso.sigla} - ${disciplina.fase.numero}ª Fase`}
                                    />,
                                    <CardPadraoBodyItem
                                        icon={<School titleAccess="Professor" />}
                                        label={disciplina.professor ? disciplina.professor.nome : "Contratando..."}
                                    />,
                                ]}
                                actions={[
                                    <CardPadraoActionItem
                                        icon={<VisibilityOutlined titleAccess="Visualizar" />}
                                        onClick={() => visualizar(disciplina.id)}
                                    />,
                                    (
                                        disciplina.statusEnum === STATUS_ENUM.ATIVO ?
                                            (
                                                <CardPadraoActionItem
                                                    icon={<EditNote titleAccess="Editar" />}
                                                    onClick={() => abrirModal(disciplina.id)}
                                                />
                                            ) :
                                            <></>
                                    ),
                                    (
                                        disciplina.statusEnum === STATUS_ENUM.INATIVO ?
                                            (<CardPadraoActionItem icon={<ToggleOff className="toggleOff" titleAccess="Inativado" color="error" />} onClick={() => alterarStatusCurso(disciplina, true)} />) :
                                            (<CardPadraoActionItem icon={<ToggleOn className="toggleOn" titleAccess="Ativado" color="primary" />} onClick={() => alterarStatusCurso(disciplina, false)} />)
                                    ),
                                ]}
                            />
                        ))}
                    </div> :
                    <div className="disciplina-sem-fase-container">
                        <div style={{ position: 'relative' }}>
                            <p className="disciplina-sem-fase-message" >Nenhuma fase Selecionada</p>
                            <img src={faseNaoSelecionada} alt="sem fase selecionada" className="disciplina-sem-fase-gif" />
                        </div>
                    </div>
            }


            {
                disciplinasPorCursoFase.length > 0 &&
                <div>
                    <Stack spacing={2}>
                        <Pagination
                            count={paginacaoResponse?.totalPaginas}
                            variant="outlined"
                            shape="rounded"
                            page={paginaAtual}
                            onChange={trocarPagina}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1rem',
                                    minWidth: '40px',
                                    minHeight: '38px',
                                },
                            }}
                        />
                    </Stack>
                </div>
            }

        </main>
    </>
}

export default Disciplina;

