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
        sx={{
            backgroundColor: 'var(--dark-orange-senac)',
            color: 'var(--dark-blue-senac)',
            fontWeight: 'bold',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: '#fca63d',
              color: 'var(--dark-blue-senac)'
            },
          }}
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