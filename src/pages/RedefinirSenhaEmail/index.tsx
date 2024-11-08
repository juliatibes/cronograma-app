import { FC, useEffect } from "react"
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";

const RedefinirSenhaEmail: FC = () => {

    useEffect(() => {
        removerUsuario();
    },[])

    return <>
    </>
}

export default RedefinirSenhaEmail;