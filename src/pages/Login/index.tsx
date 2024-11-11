import { FC, useEffect, useState } from "react";
import "./index.css";
import InputPadrao from "../../components/InputPadrao";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import imagem_login from "../../assets/imagem_login.svg";
import logo_senacplan from "../../assets/logo-senacplan.png";
import { ILogin } from "../../types/login";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { INivelAcesso, IUsuarioStore } from "../../store/UsuarioStore/types";
import {
  adicionaUsuarioSessao,
  removerUsuario,
} from "../../store/UsuarioStore/usuarioStore";
import {
  AlertColor,
  Box,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import AlertPadrao from "../../components/AlertaPadrao";
import {
  campoObrigatorio,
  IValidarCampos,
  valorInicialValidarCampos,
} from "../../util/validarCampos";
import {
  aplicarMascaraCpf,
  removerMascaraNumeros,
} from "../../util/mascaras";
import { LoadingButton } from "@mui/lab";
import BotaoPadrao from "../../components/BotaoPadrao";

const Login: FC = () => {
  const [exibirSenha, setExibirSenha] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("error");
  const [estadoModal, setEstadoModal] = useState(false);

  const [cpf, setCpf] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [cpfEsqueciSenha, setCpfEsqueciSenha] = useState<string>("");

  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );
  const [validarCampoCpfEsqueciSenha, setValidarCampoCpfEsqueciSenha] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );
  const [validarCampoSenha, setValidarCampoSenha] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const handleClickShowPassword = () => {
    setExibirSenha(!exibirSenha);
  };

  const limparErros = () => {
    setValidarCampoCpf(valorInicialValidarCampos);
    setValidarCampoSenha(valorInicialValidarCampos);
  };

  const limparErrosEsqueciSenha = () => {
    setValidarCampoCpfEsqueciSenha(valorInicialValidarCampos);
  };

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!cpf) {
      setValidarCampoCpf(campoObrigatorio);
      existeErro = true;
    } else if (cpf.length < 14) {
      setValidarCampoCpf({ existeErro: true, mensagem: "CPF inválido" });
      existeErro = true;
    }

    if (!senha) {
      setValidarCampoSenha(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  };

  const exibirErros = (mensagens: string[]) => {
    for (const mensagem of mensagens) {
      if (mensagem.includes("Cpf")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Senha")) {
        setValidarCampoSenha({ existeErro: true, mensagem: mensagem });
      }
    }
  };

  const entrar = async () => {
    limparErros();
    if (validarCampos()) return;
    setCarregando(true);

    const usuario: ILogin = {
      cpf: removerMascaraNumeros(cpf),
      senha: senha,
    };

    const response = await apiPost("/usuario/login", usuario);

    if (response.status === STATUS_CODE.OK) {
      const niveisAcesso: INivelAcesso[] = response.data.niveisAcesso.map(
        (data: INivelAcesso) => {
          const nivelAcesso: INivelAcesso = {
            nome: data.nome,
            rankingAcesso: data.rankingAcesso,
          };
          return nivelAcesso;
        }
      );

      const usuario: IUsuarioStore = {
        nome: response.data.nome,
        token: response.data.token,
        niveisAcesso: niveisAcesso,
      };

      adicionaUsuarioSessao(usuario);

      window.location.href = "/cronograma";
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      setEstadoAlerta(true);
      setMensagensAlerta(["Erro inesperado!"]);
    }

    setCarregando(false);
  };

  const enviar = async () => {
    limparErros();
    if (validarCampos()) return;
    setCarregando(true);

    const usuario: ILogin = {
      cpf: removerMascaraNumeros(cpf),
      senha: senha,
    };

    const response = await apiPost("/usuario/login", usuario);

    if (response.status === STATUS_CODE.OK) {
      const niveisAcesso: INivelAcesso[] = response.data.niveisAcesso.map(
        (data: INivelAcesso) => {
          const nivelAcesso: INivelAcesso = {
            nome: data.nome,
            rankingAcesso: data.rankingAcesso,
          };
          return nivelAcesso;
        }
      );

      const usuario: IUsuarioStore = {
        nome: response.data.nome,
        token: response.data.token,
        niveisAcesso: niveisAcesso,
      };

      adicionaUsuarioSessao(usuario);

      window.location.href = "/cronograma";
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      setEstadoAlerta(true);
      setMensagensAlerta(["Erro inesperado!"]);
    }

    setCarregando(false);
  };

  const fecharModal = () => setEstadoModal(false);

  const abrirModal = async (id?: number) => {
    limparErrosEsqueciSenha(); //tratamento erro
    limparModal();

    setEstadoModal(true);
  };

  const limparModal = () => {
    setCpfEsqueciSenha('');
  }

  useEffect(() => {
    removerUsuario();
  }, []);

  return (
    <>
      <AlertPadrao
        estado={estadoAlerta}
        cor={corAlerta}
        mensagens={mensagensAlerta}
        onClose={() => {
          setEstadoAlerta(false);
        }}
      />
      <main className="login-content">
        <div className="login-blue-side">
          <div>
          <img src={logo_senacplan} alt="logo Senac Plan" className="logo-login" />
          <h2>Entre na sua conta</h2>
          </div>
          <div className="login-email-label">
            <InputPadrao
              backgroundColor="#fff"
              error={validarCampoCpf.existeErro}
              helperText={validarCampoCpf.mensagem}
              label="CPF"
              type={"text"}
              variant={"filled"}
              value={aplicarMascaraCpf(cpf)}
              onChange={(e) => {
                if (e) {
                  setCpf(aplicarMascaraCpf(e.target.value));
                }
              }}
            />
          </div>
          <div className="login-senha-label">
            <InputPadrao
              label={"Senha"}
              backgroundColor="#fff"
              type={exibirSenha ? "text" : "password"}
              icon={
                exibirSenha ? (
                  <VisibilityOff
                    onClick={handleClickShowPassword}
                    className="icon-clickable"
                  />
                ) : (
                  <Visibility
                    onClick={handleClickShowPassword}
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
                  setSenha(e.target.value);
                }
              }}
            />
          </div>
          <LoadingButton
            sx={{
              backgroundColor: "var(--dark-orange-senac)",
              color: "var(--dark-blue-senac)",
              fontWeight: "bold",
              padding: "10px",
              width: "90px",
              "&:hover": {
                backgroundColor: "var(--light)",
              },
            }}
            loading={carregando}
            loadingPosition="center"
            variant="outlined"
            onClick={entrar}
          >
            Entrar
          </LoadingButton>
          <span className="esqueci-senha-botao" onClick={() => abrirModal()}>
          Esqueceu a senha?
          </span>
        </div>
        <div className="login-white-side">
          <img src={imagem_login} alt="Imagem de login" className="img-login" />
        </div>
      </main>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box" sx={{maxWidth: "500px"}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Esqueceu a senha?
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <p className="esqueci-senha-info">
              Informe seu CPF para que possamos enviar um e-mail de redefinição
              de senha para o endereço vinculado à sua conta.
            </p>
            <div className="modal-content">
              <div className="modal-two-form-group">
                <InputPadrao
                  label={"CPF"}
                  type={"text"}
                  value={aplicarMascaraCpf(cpfEsqueciSenha)}
                  onChange={(e) => {
                    if (e) {
                      setCpfEsqueciSenha(aplicarMascaraCpf(e.target.value));
                    }
                  }}
                  error={validarCampoCpfEsqueciSenha.existeErro}//tratamento erro
                  helperText={validarCampoCpfEsqueciSenha.mensagem}//tratamento erro
                />
              </div>
            </div>
            <div className="modal-footer" style={{borderTop: "none", marginTop: 0}}>
              <BotaoPadrao
            label={"Enviar"}
            carregando={carregando}
            // onClick={''}
          />
            </div>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Login;
