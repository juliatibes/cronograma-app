import { Alert, AlertColor, Snackbar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { FC } from "react";

interface AlertPadraoProperties {
    state:boolean,
    color: AlertColor,
    messages:string[],
    onClose: () => void,

}

const AlertPadrao: FC<AlertPadraoProperties> = ({
    state,
    color,
    messages,
    onClose,
}) => {
    return <>
        <Snackbar
            open={state}
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
                severity={color} 
                onClose={onClose}>
                {messages.map((message:string) => {
                    return <>
                        {message}.<br />
                    </>
                })}
            </Alert>
        </Snackbar>
    </>
}

export default AlertPadrao;