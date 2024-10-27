import { FC, useEffect, useState } from "react";
import { AlertColor, Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import "./index.css";
import { IPeriodo } from "../../types/periodo";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPut, STATUS_CODE } from "../../api/RestClient";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICurso, ICursoPorPeriodo } from "../../types/curso";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BotaoPadrao from "../../components/BotaoPadrao";
import { ICronograma, ICronogramaDisciplina } from "../../types/cronograma";
import Calendario from "../../components/Calendario";
import React from "react";
import { hexToRgba } from "../../util/conversorCores";
import AlertaPadrao from "../../components/AlertaPadrao";
import { IFase } from "../../types/fase";
import { buscaUsuarioSessao } from "../../store/UsuarioStore/usuarioStore";
import { IUsuarioStore } from "../../store/UsuarioStore/types";
import dayjs from "dayjs";

const Cronograma: FC = () => {
    const [usuarioSessao] = useState<IUsuarioStore>(buscaUsuarioSessao());

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


    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
        setEstadoAlerta(false);

        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
    }

    const carregarPeriodo = async () => {
        const response = await apiGet('/periodo/carregar/usuario');

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

    const selecionarPeriodo = async (periodo: IPeriodo) => {
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

    const primeiroCarregamento = async () => {
        const periodosEncontrados: IPeriodo[] = await carregarPeriodo();
        const ultimoPeriodo: IPeriodo | undefined = periodosEncontrados
            .sort((a, b) => dayjs(b.dataInicial).valueOf() - dayjs(a.dataInicial).valueOf())[0];

        if (ultimoPeriodo) {
            setPeriodoSelecionado(ultimoPeriodo);
            const cursosPorPeriodoEncontrados: ICursoPorPeriodo = await carregarCursoPorPeriodo(ultimoPeriodo.id);
            const primeiroCurso: ICursoPorPeriodo | undefined = cursosPorPeriodoEncontrados.find(curso => curso);
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

    useEffect(() => {
        primeiroCarregamento()
    }, []);

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
            {
             usuarioSessao.niveisAcesso.some((nivelAcesso) => nivelAcesso.rankingAcesso < 4) && 
             <>
                <div className="cronograma-periodo">
                        <Box sx={{ position: 'relative', flex:"5 0 0", margin:"0px 24px"}}>
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
                         usuarioSessao.niveisAcesso.some((nivelAcesso) => nivelAcesso.rankingAcesso < 3) &&
                         <div className="cronograma-botao">
                             <BotaoPadrao label={"Gerar"} />
                         </div>
                        }
                        
                </div>
                <Divider className="divider" />
             </>
            }

            
            <div className="cronogram-cursos" 
                style={{
                    justifyContent: 
                    usuarioSessao.niveisAcesso.some((nivelAcesso) => nivelAcesso.rankingAcesso < 4) ? "flex-start" : "center"
                }}
            
            >
                {cursosPorPeriodo.map((curso) => (
                    <CursoFaseLista
                        key={curso.id}
                        curso={curso}
                        editavel={curso.editavel}
                        onClickListItemText={carregarCrogramaPorPeriodoCursoFase}
                        onClickRemoveCircleOutlineIcon={() => { }}
                    />
                ))}
            </div>
            <Divider className="divider" />
            <div className="cronograma-container">
                {cronogramaPorPeriodoCursoFase && <>
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
                            key={cronogramaPorPeriodoCursoFase.faseNumero}
                            meses={cronogramaPorPeriodoCursoFase.meses}
                            onClickConfirmar={editarCronograma}
                        />
                    </div>
                </>}
            </div>
        </main >
    </>
}

export default Cronograma;