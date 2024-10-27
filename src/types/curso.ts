import { ICoordenador } from "./coordenador";
import { IFase } from "./fase";
import { STATUS_ENUM } from "./statusEnum";

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
    find(arg0: (curso: any) => any): ICursoPorPeriodo | undefined;
    id:number,
    nome:string,
    sigla:string,
    editavel:boolean,
    fases:IFase[]
}