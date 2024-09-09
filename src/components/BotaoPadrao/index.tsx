import { Button } from "@mui/material";
import { FC } from "react";
import "./index.css"; 

interface ButtonPadraoProperty {
    label: string;
    variant?: 'text' | 'contained' | 'outlined';
}

const BotaoPadrao: FC<ButtonPadraoProperty> = ({label, variant}) => {
    return(
        <Button 
        className="standard-button" 
        variant={variant}>
        {label}
        </Button>
    );
}

export default BotaoPadrao;