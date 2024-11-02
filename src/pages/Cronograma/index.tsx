import { FC, useEffect, useState } from "react";
import { AlertColor, Box, Button, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Modal, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import "./index.css";
import { IPeriodo } from "../../types/periodo";
import { apiDelete, apiGet, apiPost, apiPut, STATUS_CODE } from "../../api/RestClient";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICursoPorPeriodo, ICursoPorUsuario } from "../../types/curso";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ICronograma, ICronogramaDisciplina, ICronogramaRequest } from "../../types/cronograma";
import Calendario from "../../components/Calendario";
import React from "react";
import { hexToRgba } from "../../util/conversorCores";
import AlertaPadrao from "../../components/AlertaPadrao";
import { IFase } from "../../types/fase";
import semCronograma from "../../assets/sem_cronograma.gif";
import dayjs from "dayjs";
import { AccountBalance } from "@mui/icons-material";
import { OPERADOR_ENUM, validarPermissao } from "../../permissoes";

const Cronograma: FC = () => {
    const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
    const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
    const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

    const [periodoSelecionado, setPeriodoSelecionado] = useState<IPeriodo>();
    const [cursoIdSelecionado, setCursoIdSelecionado] = useState<number>();
    const [faseIdSelecionado, setFaseIdSelecionado] = useState<number>();
    const [editavel, setEditavel] = useState<boolean>(false);

    const [periodos, setPeriodos] = useState<IPeriodo[]>([]);
    const [cursosPorPeriodo, setCursosPorPeriodo] = useState<ICursoPorPeriodo[]>([]);
    const [cronogramaPorPeriodoCursoFase, setCronogramaPorPeriodoCursoFase] = useState<ICronograma>();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exibirMenu, setExibirMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [cursosPorUsuario, setCursosPorUsuario] = useState<ICursoPorUsuario[]>();

    const [exibirModal, setExibirModal] = useState(false);
    const [cursoPorPeriodoSelecionadoExclusao, setCursoPorPeriodoSelecionadoExclusao] = useState<ICursoPorPeriodo>();


    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
        setEstadoAlerta(false);

        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
    }

    const exibirMenuGerar = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        setAnchorEl(event.currentTarget);
        setExibirMenu(true);

        await carregarCursoPorUsuario();

        setLoading(false);
    };

    const fecharMenuGerar = () => {
        setAnchorEl(null);
        setExibirMenu(false);
    };

    const fecharModal = () => setExibirModal(false);

    const abrirModal = () => setExibirModal(true);

    const selecionarCursoGerar = (cursoPorUsuario: ICursoPorUsuario) => {
        gerarCronograma(cursoPorUsuario.id);
        fecharMenuGerar();
    };

    const carregarPeriodo = async () => {

        let urlPeriodo;
        if (validarPermissao(OPERADOR_ENUM.MENOR, 3)) {
            urlPeriodo = "/periodo/carregar";
        } else {
            urlPeriodo = "/periodo/carregar/usuario";
        }

        const response = await apiGet(urlPeriodo);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setPeriodos(response.data);
            return response.data;
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const carregarCursoPorPeriodo = async (id: number) => {
        const response = await apiGet(`/curso/carregar/periodo/${id}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setCursosPorPeriodo(response.data);
            return response.data;
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const carregarCursoPorUsuario = async () => {
        const response = await apiGet(`/curso/carregar/usuario`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setCursosPorUsuario(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const selecionarPeriodo = async (periodo: IPeriodo) => {
        setCronogramaPorPeriodoCursoFase(undefined);
        setPeriodoSelecionado(periodo);
        await carregarCursoPorPeriodo(periodo.id);
    }

    const carregarCrogramaPorPeriodoCursoFase = async (faseId: number, cursoId: number, editavel: boolean, periodoIdEncontrado?: number) => {

        const periodoIdParam = periodoSelecionado?.id ? periodoSelecionado?.id : periodoIdEncontrado;
        const response = await
            apiGet(`/cronograma/carregar/periodo/${periodoIdParam}/curso/${cursoId}/fase/${faseId}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setCronogramaPorPeriodoCursoFase(response.data);
            setEditavel(editavel);
            setCursoIdSelecionado(cursoId);
            setFaseIdSelecionado(faseId);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const editarCronograma = async (idPrimeiroDiaCronograma: number | undefined, idSegundoDiaCronograma: number | undefined) => {

        const response = await apiPut(`/diacronograma/editar/${idPrimeiroDiaCronograma}/${idSegundoDiaCronograma}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            if (faseIdSelecionado && cursoIdSelecionado && editavel) {
                carregarCrogramaPorPeriodoCursoFase(faseIdSelecionado, cursoIdSelecionado, editavel);
            }

            exibirAlerta([`Cronograma editado com sucesso!`], "success");
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const gerarCronograma = async (cursoId: number) => {

        exibirAlerta([`O Cronograma está sendo gerado fique de olho nas notificações`], "warning");

        const cronogramaRequest: ICronogramaRequest = {
            cursoId: cursoId,
        }

        const response = await apiPost(`/evento/criar/cronograma`, cronogramaRequest);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.CREATED) {
            periodoSelecionado ?
                carregarCursoPorPeriodo(periodoSelecionado.id) :
                exibirAlerta(["Erro inesperado ao carregar cursos!"], "error");
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const primeiroCarregamento = async () => {
        setCronogramaPorPeriodoCursoFase(undefined);
        
        const periodosEncontrados: IPeriodo[] = await carregarPeriodo();
        const ultimoPeriodo: IPeriodo | undefined = periodosEncontrados
            .sort((a, b) => dayjs(b.dataInicial).valueOf() - dayjs(a.dataInicial).valueOf())[0];

        if (ultimoPeriodo) {
            setPeriodoSelecionado(ultimoPeriodo);
            const cursosPorPeriodoEncontrados: ICursoPorPeriodo[] = await carregarCursoPorPeriodo(ultimoPeriodo.id);
            const primeiroCurso: ICursoPorPeriodo | undefined = cursosPorPeriodoEncontrados.find((curso: ICursoPorPeriodo) => curso);
            const primeiraFase: IFase | undefined = primeiroCurso?.fases.find(fase => fase);

            if (primeiroCurso && primeiraFase) {
                await carregarCrogramaPorPeriodoCursoFase(
                    primeiraFase?.id,
                    primeiroCurso?.id,
                    primeiroCurso?.editavel,
                    ultimoPeriodo.id
                );
            }
        }
    }

    const excluirCronograma = async () => {

        const response = await apiDelete(`/cronograma/excluir/periodo/${periodoSelecionado?.id}/curso/${cursoPorPeriodoSelecionadoExclusao?.id}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            exibirAlerta([`Cronograma excluido com sucesso!`], "success");

            cursoPorPeriodoSelecionadoExclusao?.id === cronogramaPorPeriodoCursoFase?.cursoId ?
                primeiroCarregamento() :
                (periodoSelecionado ?
                    carregarCursoPorPeriodo(periodoSelecionado.id) :
                    exibirAlerta(["Erro inesperado ao carregar cursos!"], "error"));
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    }

    const confirmar = () => {
        excluirCronograma();
        fecharModal();
    };

    const cancelar = () => {
        setCursoPorPeriodoSelecionadoExclusao(undefined);
        fecharModal();
    };

    useEffect(() => {
        primeiroCarregamento();
    }, []);

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

        <Modal
            open={exibirModal}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') fecharModal();
            }}
            disableEscapeKeyDown
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: "var(--gray)",
                    boxShadow: 3,
                    padding: "24px 16px",
                    borderRadius: 2,
                    maxWidth: "350px",
                    outline: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    }
                }}
            >
                <Typography id="modal-excluir-title" component="h2">
                    Deseja confirmar a exclusão do cronograma de {cursoPorPeriodoSelecionadoExclusao?.sigla}?
                </Typography>

                <Box id="modal-excluir-actions">
                    <Button variant="outlined" sx={{ fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder", border: "2px solid currentColor" }} onClick={cancelar}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder" }} onClick={confirmar}>
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </Modal>

        <main className="page-main">
            {
                validarPermissao(OPERADOR_ENUM.MENOR, 4) &&
                <>
                    <div className="cronograma-periodo">
                        <Box id="cronograma-periodo-carousel"
                            sx={{
                                maxWidth: `${validarPermissao(OPERADOR_ENUM.MAIOR, 2) ? "90%" : "80%"}`,
                                minWidth: `${validarPermissao(OPERADOR_ENUM.MAIOR, 2) ? "90%" : "80%"}`
                            }}
                        >
                            <IconButton
                                className="swiper-button-prev"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '-30px',
                                    zIndex: 10,
                                    transform: 'translateY(-50%)',
                                    color: 'var(--light-orange-senac)',
                                    '&:hover': { color: 'var(--dark-orange-senac)', backgroundColor: "transparent" },
                                }}
                            >
                            </IconButton>
                            <IconButton
                                className="swiper-button-next"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-30px',
                                    zIndex: 10,
                                    transform: 'translateY(-50%)',
                                    color: 'var(--light-orange-senac)',
                                    '&:hover': { color: 'var(--dark-orange-senac)', backgroundColor: "transparent" },
                                }}
                            >
                            </IconButton>
                            <Swiper
                                modules={[Navigation]}
                                slidesPerView={4}
                                slidesPerGroup={1}
                                loop={false}
                                className="cronograma-carousel"
                                navigation={{
                                    prevEl: '.swiper-button-prev',
                                    nextEl: '.swiper-button-next',
                                }}
                                breakpoints={{
                                    360: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    900: { slidesPerView: 3 },
                                    1200: { slidesPerView: 4 },
                                }}
                            >
                                {periodos.map((periodo) => (
                                    <SwiperSlide key={periodo.id} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            key={periodo.id}
                                            onClick={() => selecionarPeriodo(periodo)}
                                            className={`cronograma-periodo-btn ${periodoSelecionado?.id === periodo.id ? 'selecionado' : ''}`}
                                            size="large"
                                            variant="contained"
                                        >
                                            <span>{dayjs(periodo.dataInicial).year()}</span>
                                            {periodo.nome}
                                        </Button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>

                        {
                            validarPermissao(OPERADOR_ENUM.MENOR, 3) &&
                            <div className="cronograma-botao">
                                <Button
                                    className="standard-button"
                                    onClick={exibirMenuGerar}
                                >
                                    Gerar
                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={exibirMenu}
                                    onClose={fecharMenuGerar}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    slotProps={{
                                        paper: {

                                            elevation: 0,
                                            sx: {
                                                mx: -2.1,
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        },
                                    }}

                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={24} />
                                        </MenuItem>
                                    ) : (
                                        cursosPorUsuario &&
                                        cursosPorUsuario.map((curso) => (
                                            <MenuItem key={curso.id} onClick={() => selecionarCursoGerar(curso)}>
                                                <ListItemIcon>
                                                    <AccountBalance fontSize="small" />
                                                </ListItemIcon>
                                                <Typography>{curso.nome}</Typography>
                                            </MenuItem>
                                        ))
                                    )}
                                </Menu>
                            </div>
                        }

                    </div>
                    <Divider className="divider" />
                </>
            }


            <div className="cronogram-cursos"
                style={{
                    justifyContent: validarPermissao(OPERADOR_ENUM.MENOR, 4) ? "flex-start" : "center"
                }}

            >
                {
                    cursosPorPeriodo && cursosPorPeriodo.length > 0 ?
                        cursosPorPeriodo.map((curso) => (
                            <CursoFaseLista
                                key={curso.id}
                                curso={curso}
                                editavel={curso.editavel}
                                onClickListItemText={carregarCrogramaPorPeriodoCursoFase}
                                onClickRemoveCircleOutlineIcon={() => {
                                    abrirModal();
                                    setCursoPorPeriodoSelecionadoExclusao(curso);
                                }}
                            />
                        )) :
                        <p className="cronograma-sem-curso">Não existem cronogramas para o periodo selecionado</p>
                }


            </div>
            <Divider className="divider" />
            <div className="cronograma-container">
                {cronogramaPorPeriodoCursoFase ? <>
                    <div className="cronograma-header">
                        <h2 className="cronograma-titulo">{`${cronogramaPorPeriodoCursoFase.faseNumero}ª Fase - ${cronogramaPorPeriodoCursoFase.cursoNome} - ${cronogramaPorPeriodoCursoFase.ano}`}</h2>
                        <div className="cronograma-legenda">
                            <div className="cronograma-legenda-default" >
                                <div id="cronograma-legenda-feriado">
                                    <span></span>
                                    <p>Feriado</p>
                                </div>
                                <div id="cronograma-legenda-sem-aula">
                                    <span></span>
                                    <p>Sem Aula</p>
                                </div>
                            </div>
                            <Table className="cronograma-legenda-table">
                                <TableBody>
                                    {cronogramaPorPeriodoCursoFase.disciplinas.map((disciplina: ICronogramaDisciplina, index) => (
                                        <React.Fragment key={`${disciplina.nome}-${disciplina.professorNome}-${disciplina.cargaHoraria}-${index}`}>
                                            <TableRow
                                                className="cronograma-legenda-row"
                                                sx={{ backgroundColor: hexToRgba(disciplina.corHexadecimal, 0.3) }}
                                                key={`${disciplina.nome}1${disciplina.corHexadecimal}`}
                                            >
                                                <TableCell
                                                    className="cronograma-legenda-box-cor cronograma-legenda-row-cell"
                                                    sx={{ backgroundColor: disciplina.corHexadecimal }}
                                                    key={disciplina.corHexadecimal}
                                                >
                                                </TableCell>
                                                <TableCell
                                                    className="cronograma-legenda-row-cell"
                                                    align="center"
                                                    key={disciplina.professorNome}
                                                >
                                                    {disciplina.professorNome}
                                                </TableCell>
                                                <TableCell
                                                    className="cronograma-legenda-row-cell"
                                                    align="center"
                                                    key={disciplina.cargaHoraria}
                                                >
                                                    {disciplina.cargaHoraria}h
                                                </TableCell>
                                                <TableCell
                                                    sx={{ borderRadius: '0px 5px 5px 0px' }}
                                                    key={disciplina.nome}
                                                    className="cronograma-legenda-row-cell"
                                                >
                                                    {disciplina.nome}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow key={`spacer-${disciplina.nome}`}>
                                                <TableCell key={`fake-${disciplina.nome}`}
                                                    className="cronograma-legenda-row-cell cronograma-legenda-row-cell-fake">
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                    <div className="cronograma-content">
                        <Calendario
                            editavel={editavel}
                            periodoSelecionado={periodoSelecionado}
                            key={cronogramaPorPeriodoCursoFase.faseNumero}
                            meses={cronogramaPorPeriodoCursoFase.meses}
                            onClickConfirmar={editarCronograma}
                        />
                    </div>
                </>
                    : <div className="cronograma-sem-calendario-container">
                        <img src={semCronograma} alt="sem cronograma" className="cronograma-sem-calendario-gif" />
                    </div>
                }
            </div>
        </main >
    </>
}

export default Cronograma;