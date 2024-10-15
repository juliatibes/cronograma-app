export interface IUsuarioStore {
    nome:string,
    token:string,
    niveisAcesso: INivelAcesso[],
}

export interface INivelAcesso {
    nome:string,
    rankingAcesso: number,
}