export interface IValidarCampos {
    existeErro:boolean,
    mensagem:string
}

export const valorInicialValidarCampos: IValidarCampos = { existeErro: false, mensagem: "" };
export const campoObrigatorio: IValidarCampos = { existeErro: true, mensagem: "Campo obrigatório" };