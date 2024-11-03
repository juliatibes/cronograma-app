export interface IPaginacao {
    exibir:number,
    paginaAtual:number,
}

export interface IPaginacaoResponse {
    exibindo:number,
    totalItens: number,
    paginaAtual: number,
    totalPaginas: number,
    existeAnterior: boolean,
    existeProxima: boolean,
    primeiraPagina: boolean,
    ultimaPagina: boolean,
}