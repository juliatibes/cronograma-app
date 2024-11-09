import * as React from 'react';
import "./index.css";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { Person, Key, VisibilityOff, Visibility } from '@mui/icons-material';
import { buscaUsuarioSessao, removerUsuario } from '../../store/UsuarioStore/usuarioStore';
import { useState } from 'react';
import { AlertColor, Modal, Typography } from '@mui/material';
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from '../../util/validarCampos';
import InputPadrao from '../InputPadrao';
import BotaoPadrao from '../BotaoPadrao';
import { apiPut, STATUS_CODE } from '../../api/RestClient';
import { IRedefinirSenha } from '../../types/usuario';
import AlertaPadrao from '../AlertaPadrao';

export default function IconeLogin() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoModal, setEstadoModal] = useState(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("error");

  const [exibirSenhaAtual, setExibirSenhaAtual] = useState<boolean>(false);
  const [exibirSenha, setExibirSenha] = useState<boolean>(false);
  const [exibirConfirmarSenha, setExibirConfirmarSenha] = useState<boolean>(false);

  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');

  const [validarCampoSenhaAtual, setValidarCampoSenhaAtual] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoSenha, setValidarCampoSenha] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoConfirmarSenha, setValidarCampoConfirmarSenha] = useState<IValidarCampos>(valorInicialValidarCampos);

  const [possuiCaracterEspecial, setPossuiCaracterEspecial] = useState<boolean>(false);
  const [possuiOitoCaracteres, setPossuiOitoCaracteres] = useState<boolean>(false);
  const [possuiLetraMinuscula, setPossuiLetraMinuscula] = useState<boolean>(false);
  const [possuiLetraMaiuscula, setPossuiLetraMaiuscula] = useState<boolean>(false);
  const [possuiNumero, setPossuiNumero] = useState<boolean>(false);
  const [senhasIguais, setSenhaIguais] = useState<boolean>(false);

  const alterarEstadoExibirSenhaAtual = () => {
    setExibirSenhaAtual(!exibirSenhaAtual);
  };

  const alterarEstadoExibirSenha = () => {
    setExibirSenha(!exibirSenha);
  };

  const alterarEstadoExibirConfirmarSenha = () => {
    setExibirConfirmarSenha(!exibirConfirmarSenha);
  };

  const limparErros = () => {
    setValidarCampoSenhaAtual(valorInicialValidarCampos);
    setValidarCampoSenha(valorInicialValidarCampos);
    setValidarCampoConfirmarSenha(valorInicialValidarCampos);
  }

  const limparModal = () => {
    setSenhaAtual('');
    setSenha('');
    setConfirmarSenha('');
  }

  const limparRegrasSenha = () => {
    setPossuiCaracterEspecial(false);
    setPossuiOitoCaracteres(false);
    setPossuiLetraMinuscula(false);
    setPossuiLetraMaiuscula(false);
    setPossuiNumero(false);
    setSenhaIguais(false);
  }

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Senha") ||
      mensagem.includes("Senha atual")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Senha atual")) {
        setValidarCampoSenhaAtual({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Senha")) {
        setValidarCampoSenha({ existeErro: true, mensagem: mensagem });
      }
    }

  }

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {//tratamento erro
    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!senhaAtual) {
      setValidarCampoSenhaAtual(campoObrigatorio);
      existeErro = true;
    }

    if (!senha) {
      setValidarCampoSenha(campoObrigatorio);
      existeErro = true;
    }

    if (!confirmarSenha) {
      setValidarCampoConfirmarSenha(campoObrigatorio);
      existeErro = true;
    }

    if (
      (confirmarSenha && senha) &&
      (!possuiCaracterEspecial ||
      !possuiOitoCaracteres ||
      !possuiLetraMinuscula ||
      !possuiLetraMaiuscula ||
      !possuiNumero ||
      !senhasIguais)
    ) {
      setValidarCampoConfirmarSenha({ existeErro: true, mensagem: "Senha inválida" });
      setValidarCampoSenha({ existeErro: true, mensagem: "Senha inválida" });
    }

    return existeErro;
  }

  const validarSenha = (senhaInput: string) => {
    setPossuiCaracterEspecial(/[!@#$%^&*(),.?":{}|<>]/.test(senhaInput));
    setPossuiOitoCaracteres(/^.{8,}$/.test(senhaInput));
    setPossuiLetraMinuscula(/[a-z]/.test(senhaInput));
    setPossuiLetraMaiuscula(/[A-Z]/.test(senhaInput));
    setPossuiNumero(/\d/.test(senhaInput));
    setSenhaIguais(senha && confirmarSenha ? senhaInput === confirmarSenha : false);
  };

  const validarConfirmarSenha = (senhaConfirmarInput: string) => {
    setSenhaIguais(senha && confirmarSenha ? senhaConfirmarInput === senha : false);
  };

  const redefinir = async () => {
    limparErros();
    if (validarCampos()) return;
    setCarregando(true);

    const redefinirSenha: IRedefinirSenha = {
      senhaAtual: senhaAtual,
      senha: senha,
      confirmarSenha: confirmarSenha,
    }

    const response = await apiPut('/usuario/redefinirsenha', redefinirSenha);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta(['Senha redefinida com sucesso!'], 'success');
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(['Erro inesperado!'], 'error');
    }

    setCarregando(false);
  }

  const selecionaItemMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const fecharMenu = () => {
    setAnchorEl(null);
  };

  const deslogar = () => {
    removerUsuario();
    window.location.href = '/login';
  };

  const fecharModal = () => setEstadoModal(false);

  const abrirModal = async (id?: number) => {
    limparModal();
    limparRegrasSenha();
    limparErros();
    setEstadoModal(true);
  }


  return (
    <React.Fragment>

      <AlertaPadrao
        estado={estadoAlerta}
        cor={corAlerta}
        mensagens={mensagensAlerta}
        onClose={() => {
          setEstadoAlerta(false);
        }}
      />

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box sx={{ maxWidth: "400px", backgroundColor: 'var(--dark-blue-senac)' }} className='modal-box'>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "#fff" }}>
            Redefinir Senha
          </Typography>
          <Typography
            id="modal-modal-description"
            component="div"
          >
            <div className="modal-content">
              <div className="modal-one-form-group">
                <InputPadrao
                  label={"Senha Atual"}
                  backgroundColor="#fff"
                  type={exibirSenhaAtual ? "text" : "password"}
                  icon={
                    exibirSenhaAtual ? (
                      <VisibilityOff
                        onClick={alterarEstadoExibirSenhaAtual}
                        className="icon-clickable"
                      />
                    ) : (
                      <Visibility
                        onClick={alterarEstadoExibirSenhaAtual}
                        className="icon-clickable"
                      />
                    )
                  }
                  variant={"filled"}
                  value={senhaAtual}
                  error={validarCampoSenhaAtual.existeErro}
                  helperText={validarCampoSenhaAtual.mensagem}
                  onChange={(e) => {
                    if (e) {
                      setSenhaAtual(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="modal-one-form-group">
                <InputPadrao
                  label={"Nova Senha"}
                  backgroundColor="#fff"
                  type={exibirSenha ? "text" : "password"}
                  icon={
                    exibirSenha ? (
                      <VisibilityOff
                        onClick={alterarEstadoExibirSenha}
                        className="icon-clickable"
                      />
                    ) : (
                      <Visibility
                        onClick={alterarEstadoExibirSenha}
                        className="icon-clickable"
                      />
                    )
                  }
                  variant={"filled"}
                  value={senha}
                  error={validarCampoSenha.existeErro}
                  helperText={validarCampoSenha.mensagem}
                  onChange={(e) => {
                    if (e) {
                      validarSenha(e.target.value);
                      setSenha(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="modal-one-form-group">
                <InputPadrao
                  label={"Confirmar Nova Senha"}
                  backgroundColor="#fff"
                  type={exibirConfirmarSenha ? "text" : "password"}
                  icon={
                    exibirConfirmarSenha ? (
                      <VisibilityOff
                        onClick={alterarEstadoExibirConfirmarSenha}
                        className="icon-clickable"
                      />
                    ) : (
                      <Visibility
                        onClick={alterarEstadoExibirConfirmarSenha}
                        className="icon-clickable"
                      />
                    )
                  }
                  variant={"filled"}
                  value={confirmarSenha}
                  error={validarCampoConfirmarSenha.existeErro}
                  helperText={validarCampoConfirmarSenha.mensagem}
                  onChange={(e) => {
                    if (e) {
                      setConfirmarSenha(e.target.value);
                      validarConfirmarSenha(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="modal-one-form-group">
                <p className="redefinirsenha-regras">
                  As senhas precisam ser <span className={`redefinirsenha-regra ${senhasIguais ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`}>iguais</span> e conter no mínimo <span className={`redefinirsenha-regra ${possuiOitoCaracteres ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`}>8 caracteres</span>, letra <span className={`redefinirsenha-regra ${possuiLetraMaiuscula ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`}>maiúscula</span> e <span className={`redefinirsenha-regra ${possuiLetraMinuscula ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`} >minúscula</span>, <span className={`redefinirsenha-regra ${possuiCaracterEspecial ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`}>caracter especial</span> e <span className={`redefinirsenha-regra ${possuiNumero ? 'redefinirsenha-valida' : 'redefinirsenha-invalida'}`}>número</span>.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <BotaoPadrao
                label={"Redefinir"}
                carregando={carregando}
                onClick={redefinir}
              />
            </div>
          </Typography>
        </Box>
      </Modal>

      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', marginRight: 5, gap: 1 }}>

        <Tooltip title="Conta">
          <IconButton
            onClick={selecionaItemMenu}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}><Person /></Avatar>
          </IconButton>
        </Tooltip>
        <span style={{ color: "var(--gray)", letterSpacing: "0.5px", fontSize: "0.9rem" }}>{buscaUsuarioSessao().nome}</span>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={fecharMenu}
        onClick={fecharMenu}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >

        <MenuItem onClick={() => { abrirModal(); }}>
          <ListItemIcon>
            <Key fontSize="small" />
          </ListItemIcon>
          Redefinir Senha
        </MenuItem>
        <MenuItem onClick={deslogar}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair da conta
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}