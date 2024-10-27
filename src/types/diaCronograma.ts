import { DATA_STATUS_ENUM } from "./dataStatusEnum";
import { DIA_SEMANA_ENUM } from "./diaSemanaEnum";

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