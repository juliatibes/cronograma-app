import { IDiaCronograma } from "./diaCronograma";
import { MES_ENUM } from "./enums/mesEnum";

export interface ICronograma {
    id:number
    cursoId:number,
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
    mesEnum: MES_ENUM,
    semanasMes: {
        [key: number]: IDiaCronograma[];
    }
}

export interface ICronogramaRequest {
    cursoId:number
}