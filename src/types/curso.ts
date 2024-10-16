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