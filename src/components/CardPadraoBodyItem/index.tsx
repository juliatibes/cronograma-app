import { SvgIconProps } from "@mui/material";
import { FC } from "react";

export interface CardPadraoBodyItemProperties {
    icon: React.ReactElement<SvgIconProps>,
    label: string,
}

const CardPadraoBodyItem: FC<CardPadraoBodyItemProperties> = ({
    icon,
    label
}) => {
    return <>
        <p title={label}>{icon}<span>{label}</span></p>
    </>
}

export default CardPadraoBodyItem;