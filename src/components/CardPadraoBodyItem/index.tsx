import { FC } from "react";

interface CardPadraoBodyItemProperties {
    icon: React.ReactNode,
    label: string,
}

const CardPadraoBodyItem: FC<CardPadraoBodyItemProperties> = ({
    icon,
    label
}) => {
    return <>
        <p>{icon}<span>{label}</span></p>
    </>
}

export default CardPadraoBodyItem;