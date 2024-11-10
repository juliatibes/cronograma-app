export enum BOOLEAN_ENUM {
    SIM = "SIM",
    NAO = "NAO",
}

export const booleanEnumGetLabel = (booleanEnum: BOOLEAN_ENUM):string => {
    switch (booleanEnum) {
        case BOOLEAN_ENUM.SIM:
            return "Sim";
        case BOOLEAN_ENUM.NAO:
            return "Não";
        default:
            return "";
    }
}