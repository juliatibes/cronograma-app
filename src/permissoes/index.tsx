import { IUsuarioStore } from "../store/UsuarioStore/types"
import { buscaUsuarioSessao } from "../store/UsuarioStore/usuarioStore"

export enum OPERADOR_ENUM {
    IGUAL = "===",
    MAIOR = ">",
    MENOR = "<",
    MAIOR_OU_IGUAL = ">=",
    MENOR_OU_IGUAL = "<=",
}

export const validarPermissao = (operador:OPERADOR_ENUM ,rankingAcesso:number) => {
    const usuarioSessao:IUsuarioStore = buscaUsuarioSessao();

    return usuarioSessao.niveisAcesso
            .some((nivelAcesso) => compararRakingAcesso(nivelAcesso.rankingAcesso, operador, rankingAcesso))
}

const compararRakingAcesso = (
    rankingAcessoPossui: number,
    operador: OPERADOR_ENUM,
    rankingAcessoNecessario: number
): boolean => {
    switch (operador) {
        case OPERADOR_ENUM.IGUAL:
            return rankingAcessoPossui === rankingAcessoNecessario;
        case OPERADOR_ENUM.MAIOR:
            return rankingAcessoPossui > rankingAcessoNecessario;
        case OPERADOR_ENUM.MENOR:
            return rankingAcessoPossui < rankingAcessoNecessario;
        case OPERADOR_ENUM.MAIOR_OU_IGUAL:
            return rankingAcessoPossui >= rankingAcessoNecessario;
        case OPERADOR_ENUM.MENOR_OU_IGUAL:
            return rankingAcessoPossui <= rankingAcessoNecessario;
        default:
            throw new Error("Operador inválido");
    }
};
