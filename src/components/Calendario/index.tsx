import { Box, Button, Divider, IconButton, Modal, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { FC, useState, MouseEvent, useEffect } from "react";
import { ICronogramaMes } from "../../types/cronograma";
import { IDiaCronograma } from "../../types/diaCronograma";
import "./index.css";
import { DATA_STATUS_ENUM } from "../../types/enums/dataStatusEnum";
import { hexToRgba } from "../../util/conversorCores";
import { Close, Event, HistoryEdu, School, SyncAlt, CloseRounded, CheckRounded } from "@mui/icons-material";
import { diaSemanaEnumGetLabel } from "../../types/enums/diaSemanaEnum";
import { IPeriodo } from "../../types/periodo";
import { STATUS_ENUM } from "../../types/enums/statusEnum";

interface CalendarioProperties {
  meses: ICronogramaMes[],
  periodoSelecionado: IPeriodo | undefined,
  editavel: boolean,
  onClickConfirmar: (idPrimeiroDiaCronograma: number | undefined, idSegundoDiaCronograma: number | undefined) => void,
}

const Calendario: FC<CalendarioProperties> = ({ meses, periodoSelecionado, editavel, onClickConfirmar }) => {
  const [exibirModal, setExibirModal] = useState(false);
  const [exibirToolTip, setExibirToolTip] = useState<boolean>(false);
  const [exibirSnackBar, setExibirSnackBar] = useState<boolean>(false);
  const [toolTipDiaCronograma, setToolTipDiaCronograma] = useState<IDiaCronograma | null>();
  const [elementoClicado, setElementoClicado] = useState<HTMLTableCellElement | null>(null);
  const [diaCronogramaTrocaSelecionadoPrimeiro, setDiaCronogramaTrocaSelecionadoPrimeiro] = useState<IDiaCronograma>();
  const [diaCronogramaTrocaSelecionadoSegundo, setDiaCronogramaTrocaSelecionadoSegundo] = useState<IDiaCronograma>();
  const [hideSnackBarAnimacao, setHideSnackBarAnimacao] = useState<boolean>(false);


  const definirBackgorundColor = (diaCronogramaCorHexadecimal: IDiaCronograma): string => {

    switch (diaCronogramaCorHexadecimal.dataStatusEnum) {
      case DATA_STATUS_ENUM.OCUPADA:
        return hexToRgba(diaCronogramaCorHexadecimal.corHexadecimal, 0.4);
      case DATA_STATUS_ENUM.DISPONIVEL:
        return "#ffffff";
      case DATA_STATUS_ENUM.BLOQUEADA:
        return hexToRgba("#ffff00", 0.4);
    }
  }

  const handleTooltipOpen = (
    event: MouseEvent<HTMLTableCellElement>,
    diaCronograma: IDiaCronograma
  ) => {
    const currentTarget = event.currentTarget;

    if (exibirToolTip && elementoClicado === currentTarget) {
      setExibirToolTip(false);
      return;
    }

    if (exibirToolTip && elementoClicado !== currentTarget) {

      setExibirToolTip(false);
      setTimeout(() => {
        setElementoClicado(currentTarget);
        setToolTipDiaCronograma(diaCronograma);
        setExibirToolTip(true);
      }, 200);

    } else {
      setElementoClicado(currentTarget);
      setToolTipDiaCronograma(diaCronograma);
      setExibirToolTip(true);
    }
  };

  const selecionarDiaCronogramaParaTrocar = (diaCronograma: IDiaCronograma) => {

    if (
      (diaCronograma.id === diaCronogramaTrocaSelecionadoPrimeiro?.id) ||
      (diaCronograma.disciplinaNome === diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome &&
      diaCronograma.professorNome === diaCronogramaTrocaSelecionadoPrimeiro?.professorNome)
    ) {
      return;
    } else if (diaCronogramaTrocaSelecionadoPrimeiro) {
      setDiaCronogramaTrocaSelecionadoSegundo(diaCronograma);
      setExibirSnackBar(false);
      abrirModal();
    } else {
      setDiaCronogramaTrocaSelecionadoPrimeiro(diaCronograma);
      setHideSnackBarAnimacao(false);
      setExibirSnackBar(true);
    }

    setExibirToolTip(false);
  }

  const handleSnackbarClose = () => {
    setDiaCronogramaTrocaSelecionadoPrimeiro(undefined);
    setHideSnackBarAnimacao(true);
    setExibirSnackBar(false);
  }

  const verificarProfessorPossuiDiaSemana = (diaCronograma: IDiaCronograma): boolean => {
    if (diaCronograma.dataStatusEnum === DATA_STATUS_ENUM.BLOQUEADA) {
      return false;
    } else if (diaCronograma.dataStatusEnum === DATA_STATUS_ENUM.DISPONIVEL) {
      if (diaCronogramaTrocaSelecionadoPrimeiro?.professorDiasSemanaEnum) {
        return diaCronogramaTrocaSelecionadoPrimeiro.professorDiasSemanaEnum
          .some((diaSemana) => diaCronograma.diaSemanaEnum === diaSemana);
      } else {
        return false;
      }
    } else {
      if (diaCronogramaTrocaSelecionadoPrimeiro?.professorDiasSemanaEnum) {
        return diaCronogramaTrocaSelecionadoPrimeiro.professorDiasSemanaEnum
          .some((diaSemana) => diaCronograma.diaSemanaEnum === diaSemana) &&
          diaCronograma.professorDiasSemanaEnum
            .some((diaSemana) => diaCronogramaTrocaSelecionadoPrimeiro.diaSemanaEnum === diaSemana) &&
          (diaCronograma.disciplinaNome !== diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome ||
            (diaCronograma.disciplinaNome === diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome &&
              diaCronograma.professorNome !== diaCronogramaTrocaSelecionadoPrimeiro?.professorNome))
      } else {
        return false;
      }
    }
  }

  const abrirModal = () => setExibirModal(true);
  const fecharModal = () => setExibirModal(false);

  const limparDiaCronogramaSelecionadoModal = () => {
    setDiaCronogramaTrocaSelecionadoSegundo(undefined);
    setDiaCronogramaTrocaSelecionadoPrimeiro(undefined);
  }

  const confirmar = () => {
    onClickConfirmar(diaCronogramaTrocaSelecionadoPrimeiro?.id, diaCronogramaTrocaSelecionadoSegundo?.id);
    fecharModal();
    limparDiaCronogramaSelecionadoModal();
  };

  const cancelar = () => {
    fecharModal();
    limparDiaCronogramaSelecionadoModal();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (exibirToolTip) {
      timer = setTimeout(() => {
        setExibirToolTip(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [exibirToolTip]);

  return (
    <>

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
            bgcolor: "#e2f0fd",
            outline: "0.2px solid var(--dark)",
            margin: '2rem 0',
            p: 3,
            borderRadius: 2,
          }}
        >

          <Box id="calendario-modal-header">

            <Typography id="calendario-modal-title" variant="h5" component="h2">
              Deseja confirmar a troca ?
            </Typography>

            <Typography component="div" id="calendario-modal-actions">
              <CloseRounded onClick={cancelar} id="iconButtonClose"/>
              <CheckRounded onClick={confirmar} id="iconButtonCheck"/>
            </Typography>
          </Box>

          <Typography id="calendario-modal-description" sx={{ mt: 2 }} component="div" >
            <Typography className="calendario-modal-container" component="div"
              sx={{
                backgroundColor: diaCronogramaTrocaSelecionadoPrimeiro &&
                  definirBackgorundColor(diaCronogramaTrocaSelecionadoPrimeiro)
              }}>
              <Typography className="calendario-modal-group" component="div" >
                <Event fontSize="large" />
                <Typography variant="h6" component="p" >
                  {
                    diaCronogramaTrocaSelecionadoPrimeiro &&
                    `${new Date(diaCronogramaTrocaSelecionadoPrimeiro.data).toLocaleDateString('pt-BR')} - 
                   ${diaSemanaEnumGetLabel(diaCronogramaTrocaSelecionadoPrimeiro?.diaSemanaEnum)}`
                  }
                </Typography>
              </Typography>
              <Typography className="calendario-modal-group" component="div" >
                <School fontSize="large" />
                <Typography variant="h6" component="p" >
                  {diaCronogramaTrocaSelecionadoPrimeiro?.professorNome}
                </Typography>
              </Typography>
              <Typography className="calendario-modal-group" component="div" >
                <HistoryEdu fontSize="large" />
                <Typography variant="h6" title={diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome} component="p" >
                  {diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome}
                </Typography>
              </Typography>
            </Typography>

            <SyncAlt className="calendario-modal-divider-icon" />

            <Typography className="calendario-modal-container" component="div"
              sx={{
                backgroundColor: diaCronogramaTrocaSelecionadoSegundo &&
                  definirBackgorundColor(diaCronogramaTrocaSelecionadoSegundo)
              }}>
              <Typography className="calendario-modal-group" component="div" >
                <Event fontSize="large" />
                <Typography variant="h6" component="p" >
                  {
                    diaCronogramaTrocaSelecionadoSegundo &&
                    `${new Date(diaCronogramaTrocaSelecionadoSegundo.data).toLocaleDateString('pt-BR')} - 
                   ${diaSemanaEnumGetLabel(diaCronogramaTrocaSelecionadoSegundo?.diaSemanaEnum)}`
                  }
                </Typography>
              </Typography>
              <Typography className="calendario-modal-group" component="div" >
                <School fontSize="large" />
                <Typography variant="h6" component="p" >
                  {diaCronogramaTrocaSelecionadoSegundo?.professorNome}
                </Typography>
              </Typography>
              <Typography className="calendario-modal-group" component="div" >
                <HistoryEdu fontSize="large" />
                <Typography variant="h6" title={diaCronogramaTrocaSelecionadoSegundo?.disciplinaNome} component="p" >
                  {diaCronogramaTrocaSelecionadoSegundo?.disciplinaNome}
                </Typography>
              </Typography>
            </Typography>

          </Typography>
        </Box>
      </Modal>

      <Snackbar
        key={diaCronogramaTrocaSelecionadoPrimeiro?.id}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={exibirSnackBar}
        className={`calendario-snackbar ${hideSnackBarAnimacao && "snackbar-hide"}`}
        ContentProps={{
          sx: {
            backgroundColor: (diaCronogramaTrocaSelecionadoPrimeiro && definirBackgorundColor(diaCronogramaTrocaSelecionadoPrimeiro)),
          },
        }}
        message={
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography variant="body2" letterSpacing={.5}>
              {diaCronogramaTrocaSelecionadoPrimeiro?.professorNome}
            </Typography>
            <Typography variant="body2" letterSpacing={.5}>
              {
                diaCronogramaTrocaSelecionadoPrimeiro?.disciplinaNome ?
                  diaCronogramaTrocaSelecionadoPrimeiro.disciplinaNome :
                  "Data Disponível"
              }
            </Typography>
            <Typography variant="body1">
              {
                diaCronogramaTrocaSelecionadoPrimeiro?.data &&
                new Date(diaCronogramaTrocaSelecionadoPrimeiro?.data).toLocaleDateString('pt-BR')
              }
            </Typography>
          </Box>
        }
        action={
          <IconButton
            className="calendario-snackbar-icon"
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={handleSnackbarClose}
          >
            <Close />
          </IconButton>
        }
      />

      <Tooltip
        PopperProps={{
          anchorEl: elementoClicado,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-37, -28],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'window',
              },
            },
          ],
        }}
        id="calendarioTooltip"
        onClose={() => setExibirToolTip(false)}
        open={exibirToolTip}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        placement="right-end"
        title={
          toolTipDiaCronograma ? (
            <div style={{ backgroundColor: definirBackgorundColor(toolTipDiaCronograma) }} className="calendario-tooltip-container">

              {
                (editavel &&
                  periodoSelecionado?.statusEnum === STATUS_ENUM.ATIVO &&
                  toolTipDiaCronograma.dataStatusEnum !== DATA_STATUS_ENUM.BLOQUEADA) &&
                <>
                  <div className="calendario-tooltip-actions">
                    <Button
                      onClick={() => selecionarDiaCronogramaParaTrocar(toolTipDiaCronograma)} className="calendario-tooltip-button"
                    >
                      <SyncAlt />
                    </Button>
                  </div>
                  <Divider sx={{ backgroundColor: "var(--dark)" }} orientation="vertical" flexItem />
                </>
              }

              <div className="calendario-tooltip-content">
                {
                  (
                    toolTipDiaCronograma.dataStatusEnum === DATA_STATUS_ENUM.BLOQUEADA ?
                      <p>Feriado</p> :
                      (
                        toolTipDiaCronograma.dataStatusEnum === DATA_STATUS_ENUM.DISPONIVEL ?
                          <p>Sem Aula</p> :
                          <>
                            <p> {toolTipDiaCronograma.professorNome}</p>
                            <p> {toolTipDiaCronograma.disciplinaNome}</p>
                          </>
                      )
                  )
                }
              </div>

            </div>
          ) : (
            ''
          )
        }
      >
        <Box sx={{ display: 'none', width: 0, height: 0 }} />
      </Tooltip>

      {
        meses.map((mes: ICronogramaMes) => (
          <TableContainer key={mes.mesEnum} className="calendario-container">
            <div><p className="calendario-mes">{mes.mesEnum}</p></div>
            <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" title="Segunda-feira">S</TableCell>
                  <TableCell align="center" title="Terça-feira">T</TableCell>
                  <TableCell align="center" title="Quarta-feira">Q</TableCell>
                  <TableCell align="center" title="Quinta-feira">Q</TableCell>
                  <TableCell align="center" title="Sexta-feira">S</TableCell>
                  <TableCell align="center" title="Sabado">S</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  meses[0] === mes &&
                  Array.from({ length: +Object.keys(mes.semanasMes)[0] - 1 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <TableCell align="center" key={`empty-${index}`}><span style={{ visibility: "hidden" }}>00</span></TableCell>
                      ))}
                    </TableRow>
                  ))
                }

                {Object.entries(mes.semanasMes).map(([semanaNumero, diasCronograma]) => {
                  let diasVazios = 0;

                  if (semanaNumero === '1' && diasCronograma.length < 6) {
                    diasVazios = 6 - diasCronograma.length;
                  }

                  return (
                    <TableRow key={semanaNumero}>
                      {Array.from({ length: diasVazios }).map((_, index) => (
                        <TableCell align="center" key={`empty-${index}`} />
                      ))}
                      {diasCronograma.map((diaCronograma: IDiaCronograma) => (
                        <TableCell
                          onClick={(evento) => handleTooltipOpen(evento, diaCronograma)}
                          className="calendario-body-cell"
                          sx={{ backgroundColor: definirBackgorundColor(diaCronograma), cursor: "pointer" }}
                          align="center" key={diaCronograma.id}>
                          <div className={verificarProfessorPossuiDiaSemana(diaCronograma) && !exibirModal ? "spinner" : ""}></div>
                          {diaCronograma.data.toString().slice(8, 10)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ))
      }
    </>
  );
};

export default Calendario;
