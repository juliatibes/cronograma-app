export enum DIA_SEMANA_ENUM {
    SEGUNDA_FEIRA = "SEGUNDA_FEIRA",
    TERCA_FEIRA = "TERCA_FEIRA",
    QUARTA_FEIRA = "QUARTA_FEIRA",
    QUINTA_FEIRA = "QUINTA_FEIRA",
    SEXTA_FEIRA = "SEXTA_FEIRA",
    SABADO = "SABADO",
}

export const diaSemanaEnumGetLabel = (diaSemana: DIA_SEMANA_ENUM):string => {
    switch (diaSemana) {
        case DIA_SEMANA_ENUM.SEGUNDA_FEIRA:
            return "Segunda-Feira";
        case DIA_SEMANA_ENUM.TERCA_FEIRA:
            return "Terça-Feira";
        case DIA_SEMANA_ENUM.QUARTA_FEIRA:
            return "Quarta-Feira";
        case DIA_SEMANA_ENUM.QUINTA_FEIRA:
            return "Quinta-Feira";
        case DIA_SEMANA_ENUM.SEXTA_FEIRA:
            return "Sexta-Feira";
        case DIA_SEMANA_ENUM.SABADO:
            return "Sábado";
        default:
            return "";
    }
}

export const diaSemanaEnumAbreviado = (diaSemana: DIA_SEMANA_ENUM):string => {
    switch (diaSemana) {
        case DIA_SEMANA_ENUM.SEGUNDA_FEIRA:
            return "Seg";
        case DIA_SEMANA_ENUM.TERCA_FEIRA:
            return "Ter";
        case DIA_SEMANA_ENUM.QUARTA_FEIRA:
            return "Qua";
        case DIA_SEMANA_ENUM.QUINTA_FEIRA:
            return "Qui";
        case DIA_SEMANA_ENUM.SEXTA_FEIRA:
            return "Sex";
        case DIA_SEMANA_ENUM.SABADO:
            return "Sáb";
        default:
            return "";
    }
}