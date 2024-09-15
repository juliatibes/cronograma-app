import { Button } from "@mui/material";
import { FC } from "react";
import "./index.css"; 

interface ButtonPadraoProperty {
    label: string;
    variant?: 'text' | 'contained' | 'outlined';
    onClick?: () => void;
}

const BotaoPadrao: FC<ButtonPadraoProperty> = ({label, variant, onClick}) => {
    return(
        <Button 
        className="standard-button" 
         onClick={onClick}
        variant={variant}>
        {label}
        </Button>
    );
}

export default BotaoPadrao;