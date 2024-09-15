import { FC, useState } from "react";
import "./index.css"; 
import InputPadrao from "../../components/InputPadrao";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import imagem_login from "../../assets/imagem_login.svg"




const Login: FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword); 
    };
    return (
        <main>
            <div className="login-blue-side">
            <h2>Entre na sua conta</h2> 
            <div className="login-email-label">
            <InputPadrao label="CPF" 
                         type={"number"}
                         variant={"filled"} />
            </div>
            <div className="login-senha-label">
            <InputPadrao label={"Senha"} 
                         type={showPassword ? "text" : "password"} 
                         icon={
                            showPassword ? (
                                <VisibilityOff onClick={handleClickShowPassword} 
                                 className="icon-clickable"
                                /> 
                            ) : (
                                <Visibility onClick={handleClickShowPassword} 
                                  className="icon-clickable"
                                /> 
                            )
                         }
                         variant={"filled"}/>
            </div>
            <BotaoPadrao label={"Entrar"} />
            </div>
            <div className="login-white-side">
            <img src={imagem_login} alt="Imagem de login" className="img-login" />
            </div>
        </main>
    );
}

export default Login;
