import { IEvento } from "../../types/evento";

const NOTIFICACAO_SUCESSO_SELECIONADA = "notificacaoSucessoSelecionada";

export const buscarNotificacaoSucessoSelecionada = ():IEvento => {
    const notificaoSucessoSelecionada:IEvento = 
    JSON.parse(sessionStorage.getItem(NOTIFICACAO_SUCESSO_SELECIONADA) || "{}");
    return notificaoSucessoSelecionada;
}

export const adicionarNotificacaoSucessoSelecionada = (notificaoSucessoSelecionada:IEvento) => 
{sessionStorage.setItem(NOTIFICACAO_SUCESSO_SELECIONADA,JSON.stringify(notificaoSucessoSelecionada));}

export const removerNotificacaoSucessoSelecionada = 
() => (sessionStorage.removeItem(NOTIFICACAO_SUCESSO_SELECIONADA));