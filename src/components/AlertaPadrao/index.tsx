import { Alert, AlertColor, Snackbar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { FC } from "react";
import "./index.css";

interface AlertaPadraoProperties {
    estado:boolean,
    cor: AlertColor,
    mensagens:string[],
    onClose: () => void,
}

const AlertaPadrao: FC<AlertaPadraoProperties> = ({
    estado,
    cor,
    mensagens,
    onClose,
}) => {
    return <>
        <Snackbar
            key={estado ? "ativo": "inativo"}
            open={estado}
            className="alerta-padrao"
            onClose={onClose}
        >
            <Alert 
                iconMapping={{
                    success: <CheckIcon fontSize="inherit" />,
                }} 
                key={estado ? "ativo": "inativo"}
                severity={cor} 
                onClose={onClose}>
                {mensagens.map((mensagem:string) => {
                    return <>
                        {mensagem}<br />
                    </>
                })}
            </Alert>
        </Snackbar>
    </>
}

export default AlertaPadrao;