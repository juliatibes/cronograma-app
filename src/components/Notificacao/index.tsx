import React, { FC, useEffect, useState } from 'react';
import {
  Badge, IconButton, Popover, List, ListItem, ListItemText,
  Typography, Dialog, DialogTitle, DialogContent, Fade,
  AlertColor,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import "./index.css";
import { IEvento } from '../../types/evento';
import AlertaPadrao from '../AlertaPadrao';
import { apiGet, apiPut, STATUS_CODE } from '../../api/RestClient';
import { BOOLEAN_ENUM } from '../../types/enums/booleanEnum';
import { Close } from '@mui/icons-material';
import { removerUsuario } from '../../store/UsuarioStore/usuarioStore';
import { EVENTO_STATUS_ENUM, eventoStatusEnumGetLabel } from '../../types/enums/eventoStatusEnum';
import { adicionarNotificacaoSucessoSelecionada } from '../../store/SessionStore/notificacaoSessionStore';

interface NotificacaoProperties {
  carregarNotificao: boolean,
  buscarNotificacaoSucessoSelecionada: (notificacao: IEvento, estadoUnicoNotificacao: number) => void
}

const Notificacao: FC<NotificacaoProperties> = ({ carregarNotificao, buscarNotificacaoSucessoSelecionada }) => {
  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState<IEvento>();

  const [exbirModal, setExbirModal] = useState(false);

  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState<number>();

  const [eventos, setEventos] = useState<IEvento[]>();

  const open = Boolean(anchorEl);

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {//tratamento erro
    setEstadoAlerta(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const abrirNotificacoes = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const fecharNotificacoes = () => {
    setAnchorEl(null);
  };

  const selecionarNotificacao = (notificacao: IEvento) => {
    if (notificacao.visualizadoBooleanEnum === BOOLEAN_ENUM.NAO) {
      atualizarEvento(notificacao.id)
    }

    if (notificacao.eventoStatusEnum === EVENTO_STATUS_ENUM.SUCESSO) {
      buscarNotificacaoSucessoSelecionada(notificacao, Date.now());
      fecharNotificacoes();

      if(window.location.pathname !== "/cronogramas") {
        adicionarNotificacaoSucessoSelecionada(notificacao);
        window.location.href = "/cronogramas";
      }
      return;
    }

    setNotificacaoSelecionada(notificacao);
    setExbirModal(true);
  };

  const fecharModal = () => {
    setExbirModal(false);
    setTimeout(() => setNotificacaoSelecionada(undefined), 300);
  };

  const atualizarEvento = async (id: number) => {
    const response = await apiPut(`/evento/visualizar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      carregarEventos();
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado ao atualizar notificações!"], "error");//tratamento erro
    }
  }

  const contarNotificacoes = (eventos: IEvento[]) => {
    const eventosNaoVisualizados = eventos.filter((evento: IEvento) => evento.visualizadoBooleanEnum === BOOLEAN_ENUM.NAO).length;
    setNotificacoesNaoLidas(eventosNaoVisualizados);
  }

  const carregarEventos = async () => {
    const response = await apiGet('/evento/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setEventos(response.data);
      contarNotificacoes(response.data);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado ao buscar notificações!"], "error");
    }
  }

  useEffect(() => {
    carregarEventos();

    const interval = setInterval(() => {
      carregarEventos();
    }, 300000);

    return () => clearInterval(interval);
  }, [carregarNotificao]);

  return (
    <>
      <AlertaPadrao
        key={estadoAlerta ? "show" : "close"}
        estado={estadoAlerta}
        cor={corAlerta}
        mensagens={mensagensAlerta}
        onClose={() => {
          setEstadoAlerta(false);
        }}
      />

      <IconButton color="inherit" onClick={abrirNotificacoes}>
        <Badge
          badgeContent={notificacoesNaoLidas}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: "var(--dark-orange-senac)",
              color: 'var(--dark-blue-senac)',
            }
          }}
        >
          <NotificationsIcon sx={{ color: "var(--gray)" }} />
        </Badge>
      </IconButton>

      <Popover
        key={open ? "aberto" : "fechado"}
        open={open}
        anchorEl={anchorEl}
        onClose={fecharNotificacoes}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#fffcf7',
          },
        }}
      >

        <Typography className="notificacao-title" component="div" >
          <Typography component="p">Notificações</Typography>
          <Typography component="span" >clique para mais detalhes</Typography>
        </Typography>

        <List sx={{ width: 300, maxHeight: 400, overflow: 'auto', padding: "0" }}>
          {eventos && eventos?.length > 0 ? (
            eventos.map((evento) => (
              <ListItem
                key={evento.id}
                onClick={() => selecionarNotificacao(evento)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: evento.visualizadoBooleanEnum === BOOLEAN_ENUM.SIM ? '' : '#ffefde',
                  '&:hover': { backgroundColor: '#ffe8ce' },
                }}
              >
                <ListItemText
                  primary={evento.siglaCurso}
                  secondary={"Gerar cronograma: " + eventoStatusEnumGetLabel(evento.eventoStatusEnum)}
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 2, fontSize: "0.9rem" }}>Nenhuma notificação</Typography>
          )}
        </List>
      </Popover>


      <Dialog
        open={exbirModal}
        onClose={fecharModal}
        TransitionComponent={Fade}
        transitionDuration={300}
        sx={{
          '& .MuiDialog-paper': {
            minWidth: '300px',
            width: '500px',
            maxWidth: '80%',
            backgroundColor: '#fffcf7',
          },
        }}
      >
        <IconButton onClick={fecharModal} sx={{ ml: 1, position: "absolute", top: "3px", right: "4px" }}>
          <Close />
        </IconButton>
        <DialogTitle className='notificacao-modal-title'>
          <Typography component="p">{notificacaoSelecionada?.siglaCurso}</Typography>
          <Typography component="span">{notificacaoSelecionada?.data.toString()}</Typography>
        </DialogTitle>
        <DialogContent>
          <List >
            {notificacaoSelecionada?.mensagens ? (
              notificacaoSelecionada.mensagens.map((mensagem, index) => (
                <React.Fragment key={index} >
                  <ListItem sx={{ padding: 0 }} alignItems="flex-start">
                    <ListItemText
                      primary={mensagem}
                    />
                  </ListItem>
                  {notificacaoSelecionada?.mensagens.length > 1 && <Divider sx={{ margin: "5px" }} />}
                </React.Fragment>))
            ) : (
              <Typography>Nenhuma mensagem disponível.</Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Notificacao;
