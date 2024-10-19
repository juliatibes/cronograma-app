import { FC, useEffect, useState } from "react";
import "./index.css";
import InputPadrao from "../../components/InputPadrao";
import { Save, Visibility, VisibilityOff } from "@mui/icons-material";
import imagem_login from "../../assets/imagem_login.svg";
import { ILogin } from "../../types/login";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { INivelAcesso, IUsuarioStore } from "../../store/UsuarioStore/types";
import { adicionaUsuarioSessao, removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { AlertColor, Button } from "@mui/material";
import AlertPadrao from "../../components/AlertaPadrao";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { aplicarMascaraCpf } from "../../util/mascaras";
import { LoadingButton } from "@mui/lab";

const Login: FC = () => {
  const [exibirSenha, setExibirSenha] = useState<boolean>(false);
  const [carregando,setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("error");

  const [cpf, setCpf] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoSenha, setValidarCampoSenha] = useState<IValidarCampos>(valorInicialValidarCampos);


  const handleClickShowPassword = () => {
    setExibirSenha(!exibirSenha);
  };

  const limparErros = () => {
    setValidarCampoCpf(valorInicialValidarCampos);
    setValidarCampoSenha(valorInicialValidarCampos);
  }

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!cpf) {
      setValidarCampoCpf(campoObrigatorio);
      existeErro = true;
    } else if (cpf.length < 14) {
      setValidarCampoCpf({existeErro:true,mensagem:"CPF inválido"});
      existeErro = true;
    }

    if (!senha) {
      setValidarCampoSenha(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const exibirErros = (mensagens: string[]) => {

    for (const mensagem of mensagens) {
      if (mensagem.includes("Cpf")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Senha")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
      }
    }

  }

  const entrar = async () => {
    limparErros();
    if (validarCampos()) return;
    setCarregando(true);

    const usuario: ILogin = {
      cpf: cpf,
      senha: senha,
    }

    
    const response = await apiPost('/usuario/login', usuario);

    if (response.status === STATUS_CODE.OK) {

      const niveisAcesso: INivelAcesso[] = response.data.niveisAcesso.map((data: INivelAcesso) => {
        const nivelAcesso: INivelAcesso = {
          nome: data.nome,
          rankingAcesso: data.rankingAcesso
        }
        return nivelAcesso;
      })

      const usuario: IUsuarioStore = {
        nome: response.data.nome,
        token: response.data.token,
        niveisAcesso: niveisAcesso,
      }

      adicionaUsuarioSessao(usuario);

      window.location.href = "/cadastroprofessor";
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      setEstadoAlerta(true);
      setMensagensAlerta(["Erro inesperado!"]);
    }

    setCarregando(false);
  }

  useEffect(() => {
    removerUsuario();
  }, []);

  return <>
    <AlertPadrao
      estado={estadoAlerta}
      cor={corAlerta}
      mesnsagens={mensagensAlerta}
      onClose={() => {
        setEstadoAlerta(false);
      }}
    />
    <main className="login-content">
      <div className="login-blue-side">
        <h2>Entre na sua conta</h2>
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
                setCpf(aplicarMascaraCpf(e.target.value))
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
                setSenha(e.target.value)
              }
            }}
          />
        </div>
        <LoadingButton
          sx={{
            backgroundColor: 'var(--dark-orange-senac)',
            color: 'var(--dark-blue-senac)',
            fontWeight: 'bold',
            padding: '10px',
            width: '90px',
            '&:hover': {
              backgroundColor: 'var(--light)',
            },
          }}
          loading={carregando}
          loadingPosition="center"
          variant="outlined"
          onClick={entrar}
        >
          Entrar
        </LoadingButton>
      </div>
      <div className="login-white-side">
        <img src={imagem_login} alt="Imagem de login" className="img-login" />
      </div>
    </main>
  </>
};

export default Login;
