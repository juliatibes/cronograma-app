import { FC } from "react";

interface CardPadraoActionItemProperties {
    icon: React.ReactNode,
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