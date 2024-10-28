import { BOOLEAN_ENUM } from "./booleanEnum"

export interface IEvento {
    id:number,
    data:Date,
    eventoStatusEnum:EVENTO_STATUS_ENUM
    mensagens:string[],
    siglaCurso:string
    visualizadoBooleanEnum:BOOLEAN_ENUM
}

enum EVENTO_STATUS_ENUM {
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

