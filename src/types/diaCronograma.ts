import { DATA_STATUS_ENUM } from "./enums/dataStatusEnum";
import { DIA_SEMANA_ENUM } from "./enums/diaSemanaEnum";

export interface IDiaCronograma {
   id:number,
   data:Date,
   diaSemanaEnum:DIA_SEMANA_ENUM,
   dataStatusEnum:DATA_STATUS_ENUM,
   professorNome:string,
   professorDiasSemanaEnum:DIA_SEMANA_ENUM[],
   disciplinaNome:string,
   corHexadecimal:string,
}