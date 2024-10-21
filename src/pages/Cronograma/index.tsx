import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardContent, Divider, IconButton, Popover, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import dayGridPlugin from '@fullcalendar/daygrid'; // Exibe o calendário no formato de grade
import interactionPlugin from '@fullcalendar/interaction'; // Permite interações, como arrastar e soltar
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import "./index.css";
import { IPeriodo } from "../../types/periodo";
import { useNavigate } from "react-router-dom";
import { apiGet, STATUS_CODE } from "../../api/RestClient";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICurso, ICursoPorPeriodo } from "../../types/curso";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Módulo de navegação
import 'swiper/css'; // CSS básico do Swiper
import 'swiper/css/navigation'; // CSS para botões de navegação
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import FullCalendar from "@fullcalendar/react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
const Cronograma: FC = () => {
    const navigate = useNavigate();
    const [periodoSelecionado, setPeriodoSelecionado] = useState<IPeriodo>();
    const [periodos, setPeriodos] = useState<IPeriodo[]>([]);
    const [cursosPorPeriodo, setCursosPorPeriodo] = useState<ICursoPorPeriodo[]>([]);
    const [cronogramaPorPeriodoCursoFase, setCronogramaPorPeriodoCursoFase] = useState<ICursoPorPeriodo[]>([]);

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
            console.log(response.data)
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            //   exibirAlerta(mensagens, "error");//tratamento erro
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            //   exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
        }
    }

    const hexToRgba = (hex: string, opacity: number): string => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    const courses = [
        { instructor: "Dayana Ricken", hours: 40, title: "Fundamentos da Pesquisa" },
        { instructor: "Fernando Gabriel", hours: 36, title: "Introdução a Computação" },
        { instructor: "Marcelo Mazon", hours: 76, title: "Modelagem de Dados" },
        { instructor: "Christine Vieira", hours: 152, title: "Introdução a Programação de Computadores" },
        { instructor: "Jossuan Diniz", hours: 76, title: "Engenharia de Requisitos" },
        { instructor: "Dayana Ricken", hours: 45, title: "Extensão em Análise e Desenvolvimento de Sistemas I" },
    ];

    const backgroundEvents = [
        {
            start: '2024-10-22',
            end: '2024-10-24',
            display: 'background',
            color: '#ff9f89',
            extendedProps: {
                info: { name: 'Evento A', description: 'Descrição do Evento A' },
            }
        },
        {
            start: '2024-12-25',
            display: 'background',
            color: '#c5cae9',
            extendedProps: {
                info: { name: 'Natal', description: 'Feriado de Natal' },
            }
        }
    ];
    interface EventInfo {
        name: string;
        description: string;
      }

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
  
    // Função para abrir o Popover na data clicada
    const handleDateClick = (info: DateClickArg) => {
      const clickedDate = info.dateStr;
  
      // Encontra o evento correspondente à data clicada
      const event = backgroundEvents.find(
        (e) => clickedDate >= (e.start as string) && clickedDate < (e.end || e.start)
      );
  
      if (event && event.extendedProps) {
        setSelectedEvent(event.extendedProps.info as EventInfo);
        setAnchorEl(info.jsEvent.target as HTMLButtonElement); // Define o elemento âncora para o Popover
      }
    };
  
    // Função para fechar o Popover
    const handleClose = () => {
      setAnchorEl(null);
      setSelectedEvent(null);
    };
  
    const open = Boolean(anchorEl);

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
                        onClickRemoveCircleOutlineIcon={() => { }}
                    />
                ))}
            </div>
            <Divider className="divider" />
            <div className="cronograma-container">
                <div className="cronograma-header">
                    <h2 className="cronograma-titulo">3ª Fase - Analise e Desenvolvimento de Sistemas</h2>
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
                                {courses.map((course, index) => (
                                    <>
                                        <TableRow
                                            className="cronograma-legenda-row"
                                            sx={{ backgroundColor: hexToRgba("#000000", 0.2) }}
                                            key={index}
                                        >
                                            <TableCell
                                                className="cronograma-legenda-box-cor cronograma-legenda-row-cell"
                                            >
                                            </TableCell>
                                            <TableCell
                                                className="cronograma-legenda-row-cell"
                                                align="center"
                                            >
                                                {course.instructor}
                                            </TableCell>
                                            <TableCell
                                                className="cronograma-legenda-row-cell"
                                                align="center"
                                            >
                                                {course.hours}h
                                            </TableCell>
                                            <TableCell
                                                sx={{ borderRadius: '0px 5px 5px 0px' }}

                                                className="cronograma-legenda-row-cell"
                                            >
                                                {course.title}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow key={`spacer-${index}`}>
                                            <TableCell
                                                className="cronograma-legenda-row-cell cronograma-legenda-row-cell-fake">
                                            </TableCell>
                                        </TableRow>

                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="cronograma-content">
                    <FullCalendar

                        plugins={[dayGridPlugin, interactionPlugin]} // Adiciona plugins necessários
                        initialView="dayGridMonth" // Define a visualização inicial como grade mensal
                        headerToolbar={{          // Define a barra de ferramentas do cabeçalho
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        }}
                        editable={false}            // Permite edição de eventos (arrastar e redimensionar)
                        selectable={false}          // Permite selecionar datas e intervalos
                        selectMirror={false}        // Visualização do seletor ao arrastar
                        dayMaxEvents={true}        // Limita o número de eventos a serem exibidos por dia
                        weekends={true}
                        locale={ptBrLocale}
                        validRange={{
                            start: '2024-01-01',
                            end: '2024-12-31'
                        }}
                        dateClick={handleDateClick}
                        events={backgroundEvents}
                    />
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2}>
                            {selectedEvent ? (
                                <>
                                    <Typography variant="h6">{selectedEvent.name}</Typography>
                                    <Typography variant="body1">{selectedEvent.description}</Typography>
                                </>
                            ) : (
                                <Typography>Nenhum evento encontrado</Typography>
                            )}
                        </Box>
                    </Popover>
            </div>
        </div>
    </main >
    </>
}

export default Cronograma;