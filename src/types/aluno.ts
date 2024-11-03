import { ICurso } from "./curso"
import { IFase } from "./fase"

export interface IAluno {
    id:number
    cpf:string
    nome:string
    email:string
    curso:ICurso
    fases:IFase[]
}