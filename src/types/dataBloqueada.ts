import { Dayjs } from "dayjs"
import { STATUS_ENUM } from "./enums/statusEnum"

export interface IDataBloqueada {
    id:number,
    motivo: string,
    data: Dayjs,
    statusEnum?:STATUS_ENUM,
}

export interface IDataBloqueadaRequest {
    id?: number,
    motivo: string,
    data: Dayjs | null,
}
