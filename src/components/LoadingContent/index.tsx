import { CircularProgress } from "@mui/material";
import { FC } from "react";

interface LoadingContentProperties {
    carregandoInformacoes: boolean,
    isModal: boolean
    circleOn: boolean,
}

const LoadingContent: FC<LoadingContentProperties> = ({ carregandoInformacoes, isModal, circleOn }) => {
    return <>
        {carregandoInformacoes ?
            <>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backdropFilter: 'blur(4px)',
                    zIndex: 40,
                }}>
                </div>
                {circleOn &&
                    <CircularProgress size="3rem" sx={{
                        position: 'absolute',
                        alignSelf: "center",
                        zIndex: 50,
                        right: `${isModal ? 'auto' : '50%'}`,
                        color:"var(--dark-blue-senac)"
                    }} />
                }

            </>
            : <></>
        }

    </>
}

export default LoadingContent;