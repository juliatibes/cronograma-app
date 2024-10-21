import { IDiaCronograma } from "./diaCronograma";
import { DIA_SEMANA_ENUM } from "./diaSemanaEnum";
import { MES_ENUM } from "./mesEnum";

export interface ICronograma {
    cursoNome:string,
    faseNumero:number,
    ano:number,
    disciplinas:ICronogramaDisciplina[],
    meses:ICronogramaMes[]
}

export interface ICronogramaDisciplina {
    nome:string,
    corHexadecimal:string,
    cargaHoraria:number,
    professorNome:string,
}

export interface ICronogramaMes {
    mesEnum:MES_ENUM,
    diasSemana:IDiasSemana[]
}

export interface IDiasSemana {
    diaSemanaEnum:DIA_SEMANA_ENUM,
    diaCronograma:IDiaCronograma[]
}