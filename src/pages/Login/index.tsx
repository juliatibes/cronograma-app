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

const Login: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [cpf, setCpf] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const entrar = async () => {
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
  }

  useEffect(() => {
    removerUsuario();
  }, [])

  return (
    <main>
      <div className="login-blue-side">
        <h2>Entre na sua conta</h2>
        <div className="login-email-label">
          <InputPadrao
            backgroundColor="#fff"
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
  );
};

export default Login;
