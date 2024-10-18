import { FC, useEffect, useState } from "react";
import "./index.css";
import InputPadrao from "../../components/InputPadrao";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import imagem_login from "../../assets/imagem_login.svg";
import { ILogin } from "../../types/login";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { INivelAcesso, IUsuarioStore } from "../../store/UsuarioStore/types";
import { adicionaUsuarioSessao, removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { AlertColor } from "@mui/material";
import { IValidField } from "../../types/validField";
import AlertPadrao from "../../components/AlertPadrao";

const Login: FC = () => {
  const initialValidField: IValidField = { hasError: false, message: "" };

  const [showPassword, setShowPassword] = useState(false);

  const [stateAlert, setStateAlert] = useState<boolean>(false);
  const [messagesAlert, setMessagesAlert] = useState<string[]>([]);
  const [colorAlert, setColorAlert] = useState<AlertColor>("error");

  const [cpf, setCpf] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const [validFieldCpf, setValidFieldCpf] = useState<IValidField>(initialValidField);
  const [validFieldSenha, setValidFieldSenha] = useState<IValidField>(initialValidField);


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const clearErrors = () => {
    setValidFieldCpf(initialValidField);
    setValidFieldSenha(initialValidField);
  }

  const validFieldsLogin = (): boolean => {
    let hasError = false;
    const isRequiredField: IValidField = { hasError: true, message: "Campo obrigatório" }

    if (!cpf) {
      setValidFieldCpf(isRequiredField);
      hasError = true;
    }
    if (!senha) {
      setValidFieldSenha(isRequiredField);
      hasError = true;
    }

    return hasError;
  }

  const entrar = async () => {
    clearErrors();
    if (validFieldsLogin()) return;

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
      const messages = response.messages;

      for (const message of messages) {
        if (message.includes("Cpf")) {
          setValidFieldCpf({ hasError: true, message: message });
          continue;
        }
        if (message.includes("Senha")) {
          setValidFieldCpf({ hasError: true, message: message });
        }
      }
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      setStateAlert(true);
      setMessagesAlert(["Login erro inesperado!"]);
    }

  }

  useEffect(() => {
    removerUsuario();
  }, []);

  return <>
    <AlertPadrao
      state={stateAlert}
      color={colorAlert}
      messages={messagesAlert}
      onClose={() => {
        setStateAlert(false);
      }}
    />
    <main className="login-content">
      <div className="login-blue-side">
        <h2>Entre na sua conta</h2>
        <div className="login-email-label">
          <InputPadrao
            backgroundColor="#fff"
            error={validFieldCpf.hasError}
            helperText={validFieldCpf.message}
            label="CPF"
            type={"text"}
            variant={"filled"}
            value={cpf}
            onChange={(e) => {
              if (e) {
                setCpf(e.target.value)
              }
            }}
          />
        </div>
        <div className="login-senha-label">
          <InputPadrao
            label={"Senha"}
            backgroundColor="#fff"
            type={showPassword ? "text" : "password"}
            icon={
              showPassword ? (
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
            error={validFieldSenha.hasError}
            helperText={validFieldSenha.message}
            onChange={(e) => {
              if (e) {
                setSenha(e.target.value)
              }
            }}
          />
        </div>
        <BotaoPadrao
          label={"Entrar"}
          onClick={entrar}
        />
      </div>
      <div className="login-white-side">
        <img src={imagem_login} alt="Imagem de login" className="img-login" />
      </div>
    </main>
  </>
};

export default Login;
