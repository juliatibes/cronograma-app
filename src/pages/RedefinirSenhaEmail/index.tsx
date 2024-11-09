import { FC, useEffect, useState } from "react"
import "./index.css";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AlertColor } from "@mui/material";
import { apiPost, apiPostValidarToken, apiPutRedefinirSenhaEmail, STATUS_CODE } from "../../api/RestClient";
import InputPadrao from "../../components/InputPadrao";
import { IValidarCampos, valorInicialValidarCampos, campoObrigatorio } from "../../util/validarCampos";
import AlertaPadrao from "../../components/AlertaPadrao";
import imagem_login from "../../assets/imagem_login.svg";
import { IRedefinirSenhaEmail } from "../../types/usuario";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adicionaTokenRedefinirSenhaSessao, buscaTokenRedefinirSenhaSessao, removerTokenRedefinirSenhaSessao, } from "../../store/SessionStore/sessionStore";
import { ITokenRedefinfirSenhaStore } from "../../store/SessionStore/types";

const RedefinirSenhaEmail: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authToken = searchParams.get('auth');

    const [exibirSenha, setExibirSenha] = useState<boolean>(false);
    const [exibirConfirmarSenha, setExibirConfirmarSenha] = useState<boolean>(false);

    const [carregando, setCarregando] = useState<boolean>(false);

    const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
    const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
    const [corAlerta, setCorAlerta] = useState<AlertColor>("error");

    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');

    const [validarCampoSenha, setValidarCampoSenha] = useState<IValidarCampos>(valorInicialValidarCampos);
    const [validarCampoConfirmarSenha, setValidarCampoConfirmarSenha] = useState<IValidarCampos>(valorInicialValidarCampos);

    const [possuiCaracterEspecial, setPossuiCaracterEspecial] = useState<boolean>(false);
    const [possuiOitoCaracteres, setPossuiOitoCaracteres] = useState<boolean>(false);
    const [possuiLetraMinuscula, setPossuiLetraMinuscula] = useState<boolean>(false);
    const [possuiLetraMaiuscula, setPossuiLetraMaiuscula] = useState<boolean>(false);
    const [possuiNumero, setPossuiNumero] = useState<boolean>(false);
    const [senhasIguais, setSenhaIguais] = useState<boolean>(false);

    const alterarEstadoExibirSenha = () => {
        setExibirSenha(!exibirSenha);
    };

    const alterarEstadoExibirConfirmarSenha = () => {
        setExibirConfirmarSenha(!exibirConfirmarSenha);
    };

    const limparErros = () => {
        setValidarCampoSenha(valorInicialValidarCampos);
        setValidarCampoConfirmarSenha(valorInicialValidarCampos);
    }

    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {//tratamento erro
        setEstadoAlerta(false);

        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
    }

    const exibirErros = (mensagens: string[]) => {

        const existeErroEspecifico = mensagens.some(mensagem =>
            mensagem.includes("Senha")
        );

        if (!existeErroEspecifico) {
            exibirAlerta(mensagens, "error");
            return;
        }

        for (const mensagem of mensagens) {
            if (mensagem.includes("Senha")) {
                setValidarCampoSenha({ existeErro: true, mensagem: mensagem });
            }
        }

    }

    const validarCampos = (): boolean => {
        let existeErro = false;

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

        const redefinirSenhaEmail: IRedefinirSenhaEmail = {
            senha: senha,
            confirmarSenha: confirmarSenha,
        }

        const token = buscaTokenRedefinirSenhaSessao().token;

        const response = await apiPutRedefinirSenhaEmail(
            '/usuario/redefinirsenhaemail', redefinirSenhaEmail, token
        );

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerTokenRedefinirSenhaSessao();
            exibirAlerta(
                ["Tempo limite para redefinição de senha expirado!", "Você sera redirecionado para o login em breve."]
                , 'error'
            );

            setTimeout(() => {
                window.location.href = "/login";
            }, 10000);
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            exibirAlerta(["Senha redefinida com sucesso!", "Você sera redirecionado para o login em breve."], 'success');
            setTimeout(() => {
                window.location.href = "/login";
            }, 6000);
        }

        if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
            const mensagens = response.messages;
            exibirErros(mensagens);
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], 'error');
        }

        setCarregando(false);
    }

    const validarToken = async () => {

        const response = await apiPostValidarToken('/usuario/redefinirsenha/validartoken', authToken ? authToken : '');

        if (response.status === STATUS_CODE.NO_CONTENT) {

            const tokenRedefinirSenha: ITokenRedefinfirSenhaStore = {
                token: authToken ? authToken : '',
            }
            adicionaTokenRedefinirSenhaSessao(tokenRedefinirSenha);
            return;
        }

        exibirAlerta(
            ["Tempo limite para redefinição de senha expirado!", "Você sera redirecionado para o login em breve."]
            , 'error');

        setTimeout(() => {
            window.location.href = "/login";
        }, 10000);
    }

    useEffect(() => {
        removerUsuario();
        validarToken();
        if (authToken) {
            navigate(window.location.pathname, { replace: true });
        }
    }, []);

    return <>
        <AlertaPadrao
            estado={estadoAlerta}
            cor={corAlerta}
            mensagens={mensagensAlerta}
            onClose={() => {
                setEstadoAlerta(false);
            }}
        />

        <main className="redefinirsenhaemail-content">
            <div className="redefinirsenhaemail-blue-side">
                <h2>Redefinir senha</h2>
                <div className="redefinirsenhaemail-senha-label">
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
                <div className="redefinirsenhaemail-senha-label">
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
                <p className="redefinirsenhaemail-regras">
                    As senhas precisam ser <span className={`redefinirsenhaemail-regra ${senhasIguais ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`}>iguais</span> e conter no mínimo <span className={`redefinirsenhaemail-regra ${possuiOitoCaracteres ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`}>8 caracteres</span>, letra <span className={`redefinirsenhaemail-regra ${possuiLetraMaiuscula ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`}>maiúscula</span> e <span className={`redefinirsenhaemail-regra ${possuiLetraMinuscula ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`} >minúscula</span>, <span className={`redefinirsenhaemail-regra ${possuiCaracterEspecial ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`}>caracter especial</span> e <span className={`redefinirsenhaemail-regra ${possuiNumero ? 'redefinirsenhaemail-valida' : 'redefinirsenhaemail-invalida'}`}>número</span>.
                </p>
                <LoadingButton
                    sx={{
                        backgroundColor: 'var(--dark-orange-senac)',
                        color: 'var(--dark-blue-senac)',
                        fontWeight: 'bold',
                        padding: '10px',
                        width: '110px',
                        '&:hover': {
                            backgroundColor: 'var(--light)',
                        },
                    }}
                    loading={carregando}
                    loadingPosition="center"
                    variant="outlined"
                    onClick={redefinir}
                >
                    Redefinir
                </LoadingButton>
            </div>
            <div className="redefinirsenhaemail-white-side">
                <img src={imagem_login} alt="Imagem de login" className="img-redefinirsenhaemail" />
            </div>
        </main>
    </>
}

export default RedefinirSenhaEmail;