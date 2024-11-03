import { BOOLEAN_ENUM } from "./booleanEnum"
import { ICurso } from "./curso"
import { IFase } from "./fase"
import { IProfessor } from "./professor"
import { STATUS_ENUM } from "./statusEnum"

export interface IDisciplina {
    id:number,
    nome:string,
    cargaHoraria:number,
    cargaHorariaDiaria:number,
    corHexadecimal:string,
    extensaoBooleanEnum:BOOLEAN_ENUM,
    curso:ICurso,
    fase:IFase,
    professor:IProfessor,
    statusEnum:STATUS_ENUM
}

export interface IDisciplinaRequest {
    id?:number,
    nome:string,
    cargaHoraria:number,
    cargaHorariaDiaria:number,
    corHexadecimal:string,
    extensaoBooleanEnum:BOOLEAN_ENUM,
    cursoId:number,
    faseId:number,
    professorId?:number,
}