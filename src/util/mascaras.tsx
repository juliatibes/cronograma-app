import dayjs, { Dayjs } from "dayjs";

export const aplicarMascaraTelefone = (value: String | undefined) => {
    if (!value) return ''
    
    return value.replace(/[\D]/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})(\d+?)/, '$1')
}

export const aplicarMascaraCpf = (value: string | undefined) => {
    if (!value) return "";

    return value
        .replace(/[\D]/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

export const removerMascaraNumeros = (value: string | undefined) => {
    if (!value) return "";

    return value.replace(/\D/g, "");
}

export const aplicarMascaraDataPtBr = (value: Dayjs | undefined) => {
    if (!value) return "";

    return dayjs(value).format('DD/MM/YYYY').toString();
}