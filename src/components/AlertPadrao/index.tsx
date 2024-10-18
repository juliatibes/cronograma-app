import { Alert, AlertColor, Snackbar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { FC } from "react";

interface AlertPadraoProperties {
    estadoInicial:boolean,
    cor: AlertColor,
    mensagem:string[],
    onClose: () => void,

}

const AlertPadrao: FC<AlertPadraoProperties> = ({
    estadoInicial,
    cor,
    mensagem,
    onClose,
}) => {
    return <>
        <Snackbar
            open={estadoInicial}
            style={{
                position: 'fixed',
                top: '13vh',
                right: '20px',
                left: 'auto',
                bottom: 'auto',
            }}
            onClose={onClose}
        >
            <Alert 
                iconMapping={{
                    success: <CheckIcon fontSize="inherit" />,
                }} 
                severity={cor} 
                onClose={onClose}>
                {mensagem.map((mensagem:string) => {
                    return <>
                        {mensagem}.<br />
                    </>
                })}
            </Alert>
        </Snackbar>
    </>
}

export default AlertPadrao;