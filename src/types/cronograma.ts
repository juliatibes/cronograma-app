import { IDiaCronograma } from "./diaCronograma";
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
    mesEnum: MES_ENUM,
    semanasMes: {
        [key: number]: IDiaCronograma[];
    }
}