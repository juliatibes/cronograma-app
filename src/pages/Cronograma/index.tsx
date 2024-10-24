import { FC, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import "./index.css";
import { IPeriodo } from "../../types/periodo";
import { useNavigate } from "react-router-dom";
import { apiGet, STATUS_CODE } from "../../api/RestClient";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICursoPorPeriodo } from "../../types/curso";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/navigation';
import BotaoPadrao from "../../components/BotaoPadrao";
import { ICronograma, ICronogramaDisciplina } from "../../types/cronograma";
import Calendario from "../../components/Calendario";
import React from "react";
import { hexToRgba } from "../../util/conversorCores";

const Cronograma: FC = () => {
    const navigate = useNavigate();
    const [periodoSelecionado, setPeriodoSelecionado] = useState<IPeriodo>();
    const [periodos, setPeriodos] = useState<IPeriodo[]>([]);
    const [cursosPorPeriodo, setCursosPorPeriodo] = useState<ICursoPorPeriodo[]>([]);
    const [cronogramaPorPeriodoCursoFase, setCronogramaPorPeriodoCursoFase] = useState<ICronograma>();

    const carregarPeriodo = async () => {
        const response = await apiGet('/periodo/carregar/usuario');

        if (response.status === STATUS_CODE.FORBIDDEN) {
            navigate("/login")
        }

        if (response.status === STATUS_CODE.OK) {
            setPeriodos(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            //   exibirAlerta(mensagens, "error");//tratamento erro
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            //   exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const carregarCursoPorPeriodo = async (id: number) => {
        const response = await apiGet(`/curso/carregar/periodo/${id}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            navigate("/login")
        }

        if (response.status === STATUS_CODE.OK) {
            setCursosPorPeriodo(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            //   exibirAlerta(mensagens, "error");//tratamento erro
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            //   exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const selecionarPeriodo = (periodo: IPeriodo) => {
        setPeriodoSelecionado(periodo);
        carregarCursoPorPeriodo(periodo.id);
    }

    const carregarCrogramaPorPeriodoCursoFase = async (faseId: number, cursoId: number) => {

        const response = await
            apiGet(`/cronograma/carregar/periodo/${periodoSelecionado?.id}/curso/${cursoId}/fase/${faseId}`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            navigate("/login")
        }

        if (response.status === STATUS_CODE.OK) {
            setCronogramaPorPeriodoCursoFase(response.data);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            //   exibirAlerta(mensagens, "error");//tratamento erro
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            //   exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    useEffect(() => {
        carregarPeriodo();
    }, []);


    return <>

        <main className="page-main">
            <div className="cronograma-periodo">
                <Box sx={{ position: 'relative', width: '55vw' }}>
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
                                    <span>{new Date(periodo.dataInicial).getFullYear()}</span>
                                    {periodo.nome}
                                </Button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <div className="cronograma-botao">
                    <BotaoPadrao label={"Gerar"} />
                </div>
            </div>
            <Divider className="divider" />
            <div className="cronogram-cursos">
                {cursosPorPeriodo.map((curso) => (
                    <CursoFaseLista
                        key={curso.id}
                        curso={curso}
                        editavel={curso.editavel}
                        onClickListItemText={carregarCrogramaPorPeriodoCursoFase}
                        onClickRemoveCircleOutlineIcon={() => {}}
                    />
                ))}
            </div>
            <Divider className="divider" />
            <div className="cronograma-container">
                {cronogramaPorPeriodoCursoFase && <>
                    <div className="cronograma-header">
                        <h2 className="cronograma-titulo">{`${cronogramaPorPeriodoCursoFase.faseNumero}ª Fase - ${cronogramaPorPeriodoCursoFase.cursoNome}`}</h2>
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
                        <Calendario meses={cronogramaPorPeriodoCursoFase.meses} />
                    </div>
                </>}
            </div>
        </main >
    </>
}

export default Cronograma;