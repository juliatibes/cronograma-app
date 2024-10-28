import { FC } from "react";
import "./index.css";
import { LoadingButton } from "@mui/lab";

interface ButtonPadraoProperty {
    label: string;
    variant?: 'text' | 'contained' | 'outlined';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    carregando?:boolean
}

const BotaoPadrao: FC<ButtonPadraoProperty> = ({ label, variant, onClick,carregando }) => {
    return (
        <LoadingButton
        className="standard-button"
        loading={carregando}
        loadingPosition="center"
        variant={variant}
        onClick={onClick}
      >
         {label}
      </LoadingButton>
    );
}

export default BotaoPadrao;