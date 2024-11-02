import { BOOLEAN_ENUM } from "./booleanEnum"
import { ICurso } from "./curso"
import { IFase } from "./fase"
import { STATUS_ENUM } from "./statusEnum"

export interface IDisciplina {
    cargaHoraria:number,
    cargaHorariaDiaria:number,
    corHexadecimal:string,
    curso:ICurso,
    extensaoBooleanEnum:BOOLEAN_ENUM,
    fase:IFase,
    id:number,
    nome:string,
    // professor:
    statusEnum:STATUS_ENUM
}