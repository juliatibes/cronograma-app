import { Dayjs } from "dayjs"
import { STATUS_ENUM } from "./statusEnum"

export interface IPeriodo {
    id:number,
    nome: string,
    dataInicial: Dayjs,
    dataFinal: Dayjs,
    statusEnum?:STATUS_ENUM,
}

export interface IPeriodoRequest {
    id?: number,
    nome: string,
    dataInicial: Dayjs | null,
    dataFinal: Dayjs | null
}