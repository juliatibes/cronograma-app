import { STATUS_ENUM } from "./statusEnum";

export interface IFase {
    id:number,
    numero:number,
    statusEnum?:STATUS_ENUM
}

export interface IFasesRequest {
    id?:number,
    numero?:number,
    statusEnum?:STATUS_ENUM
}