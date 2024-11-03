export interface ICoordenador {
    id:number,
    cpf:string,
    nome:string,
    telefone:string,
    email:string
}

export interface ICoordenadorRequest {
    id?:number,
    cpf?:string,
    nome:string,
    telefone?:string,
    email?:string
}