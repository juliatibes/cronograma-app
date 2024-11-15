import { ITokenRedefinfirSenhaStore } from "./types";

const TOKEN_REDEFINIR_SENHA_STORE = "token";

export const buscaTokenRedefinirSenhaSessao = ():ITokenRedefinfirSenhaStore => {

    const tokenRedefinirSenha:ITokenRedefinfirSenhaStore = 
    JSON.parse(sessionStorage.getItem(TOKEN_REDEFINIR_SENHA_STORE) || "{}");

    return tokenRedefinirSenha;
}

export const adicionaTokenRedefinirSenhaSessao = (tokenRedefinirSenha:ITokenRedefinfirSenhaStore) => {
    sessionStorage.setItem(TOKEN_REDEFINIR_SENHA_STORE,JSON.stringify(tokenRedefinirSenha));
}

export const removerTokenRedefinirSenhaSessao = () => (sessionStorage.removeItem(TOKEN_REDEFINIR_SENHA_STORE));



