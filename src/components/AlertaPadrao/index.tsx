import { Alert, AlertColor, Snackbar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { FC } from "react";
import "./index.css";

interface AlertaPadraoProperties {
    estado:boolean,
    cor: AlertColor,
    mesnsagens:string[],
    onClose: () => void,

}

const AlertaPadrao: FC<AlertaPadraoProperties> = ({
    estado,
    cor,
    mesnsagens,
    onClose,
}) => {
    return <>
        <Snackbar
            open={estado}
            className="alerta-padrao"
            onClose={onClose}
        >
            <Alert 
                iconMapping={{
                    success: <CheckIcon fontSize="inherit" />,
                }} 
                severity={cor} 
                onClose={onClose}>
                {mesnsagens.map((mensagem:string) => {
                    return <>
                        {mensagem}.<br />
                    </>
                })}
            </Alert>
        </Snackbar>
    </>
}

export default AlertaPadrao;