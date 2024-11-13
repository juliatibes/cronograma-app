import { IDiaSemanaDisponivel } from "./diaSemanaDisponivel"
import { STATUS_ENUM } from "./enums/statusEnum"

export interface IProfessor{
    id: number,
    nome: string,
    telefone: string,
    email: string,
    cpf: string,
    statusEnum?:STATUS_ENUM, 
    diasSemanaDisponiveis: IDiaSemanaDisponivel[]
}

export interface IProfessorRequest{
    id?: number,
    nome: string,
    cpf: string,
    telefone: string,
    email: string,
    diaSemanaDisponivelIds: number[]
}