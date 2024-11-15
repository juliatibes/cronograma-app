export enum EVENTO_STATUS_ENUM {
    EXECUTANDO = "EXECUTANDO",
    ERRO = "ERRO",
    SUCESSO = "SUCESSO",
}

export const eventoStatusEnumGetLabel = (eventoStatusEnum: EVENTO_STATUS_ENUM):string => {
    switch (eventoStatusEnum) {
        case EVENTO_STATUS_ENUM.SUCESSO:
            return "Sucesso";
        case EVENTO_STATUS_ENUM.EXECUTANDO:
            return "Executando";
        case EVENTO_STATUS_ENUM.ERRO:
            return "Erro";
        default:
            return "";
    }
}