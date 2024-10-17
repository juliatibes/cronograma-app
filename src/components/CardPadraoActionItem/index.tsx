import { SvgIconProps } from "@mui/material";
import { FC } from "react";

export interface CardPadraoActionItemProperties {
    icon: React.ReactElement<SvgIconProps>,
    onClick: () => void,
}

const CardPadraoActionItem: FC<CardPadraoActionItemProperties> = ({
    icon,
    onClick,
}) => {
    return <>
        <span onClick={onClick}>{icon}</span>
    </>
}

export default CardPadraoActionItem;