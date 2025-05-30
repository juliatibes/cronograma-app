import { ICoordenador } from "./coordenador";
import { IFase } from "./fase";
import { STATUS_ENUM } from "./enums/statusEnum";

export interface ICurso {
    id:number,
    nome:string,
    sigla:string,
    statusEnum?:STATUS_ENUM
    coordenador:ICoordenador
    fases:IFase[]
}

export interface ICursoRequest {
    id?:number,
    nome:string,
    sigla:string,
    coordenadorId?:number
    faseIds:number[]
}

export interface ICursoPorPeriodo {
    id:number,
    nome:string,
    sigla:string,
    editavel:boolean,
    fases:IFase[]
}

export interface ICursoPorUsuario {
    id:number,
    nome:string,
    sigla:string,
    fases:IFase[]
}