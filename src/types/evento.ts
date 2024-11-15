import { BOOLEAN_ENUM } from "./enums/booleanEnum"
import { EVENTO_STATUS_ENUM } from "./enums/eventoStatusEnum"

export interface IEvento {
    id:number,
    data:Date,
    eventoStatusEnum:EVENTO_STATUS_ENUM
    mensagens:string[],
    siglaCurso:string,
    visualizadoBooleanEnum:BOOLEAN_ENUM
    cursoId:number,
}

