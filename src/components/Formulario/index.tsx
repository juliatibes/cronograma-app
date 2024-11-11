import { FC, useState } from "react";
import "./index.css";
import DescriptionIcon from '@mui/icons-material/Description';
import { IProfessor } from "../../types/professor";
import { AlertColor, Box, Modal, Typography } from "@mui/material";
import { IDiaSemanaDisponivel } from "../../types/diaSemanaDisponivel";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { apiGet, apiPut, STATUS_CODE } from "../../api/RestClient";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import LoadingContent from "../LoadingContent";
import MultiSelect from "../MultiSelect";
import BotaoPadrao from "../BotaoPadrao";
import { IFormulario } from "../../types/formulario";
import AlertaPadrao from "../AlertaPadrao";

const Formulario: FC = () => {
    const [carregando, setCarregando] = useState<boolean>(false);
    const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

    const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
    const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
    const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

    const [estadoModal, setEstadoModal] = useState(false);

    const [diasSemanaDisponiveis, setDiasSemanaDisponiveis] = useState<IDiaSemanaDisponivel[]>([]);

    const [diasSemanaDisponiveisSelecionados, setDiasSemanaDisponiveisSelecionados] = useState<IDiaSemanaDisponivel[]>([]);

    const [validarCampoDiasSemanaDisponiveisSelecionados, setValidarCampoDiasSemanaDisponiveisSelecionados] = useState<IValidarCampos>(valorInicialValidarCampos);

    const selecionarDiaSemanaDisponiveis = (diasSemanaDisponiveis: IDiaSemanaDisponivel[]) => {
        setDiasSemanaDisponiveisSelecionados(diasSemanaDisponiveis)
    };

    const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
        setEstadoAlerta(false);
        setEstadoModal(false);

        setMensagensAlerta(mensagens);
        setCorAlerta(cor);
        setEstadoAlerta(true);
    };

    const limparModal = () => {
        setDiasSemanaDisponiveisSelecionados([]);
    };

    const limparErros = () => {
        setValidarCampoDiasSemanaDisponiveisSelecionados(valorInicialValidarCampos);
    };

    const fecharModal = () => setEstadoModal(false);

    const carregarDiasSemanaDisponiveis = async () => {
        const response = await apiGet("/diasemanadisponivel/carregar");

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            setDiasSemanaDisponiveis(response.data);
        }

        if (
            response.status === STATUS_CODE.BAD_REQUEST ||
            response.status === STATUS_CODE.UNAUTHORIZED
        ) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    };

    const validarCampos = (): boolean => {
        let existeErro = false;

        if (diasSemanaDisponiveisSelecionados.length < 1) {
            setValidarCampoDiasSemanaDisponiveisSelecionados(campoObrigatorio);
            existeErro = true;
        }

        return existeErro;
    };

    const carregarProfessorDiasSemanaDisponiveis = async () => {
        const response = await apiGet(`/professor/carregar/diasemanadisponivel`);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.OK) {
            const professorEncontrado: IProfessor = response.data;

            setDiasSemanaDisponiveisSelecionados(
                professorEncontrado.diasSemanaDisponiveis
            );
        }

        if (
            response.status === STATUS_CODE.BAD_REQUEST ||
            response.status === STATUS_CODE.UNAUTHORIZED
        ) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }
    };

    const abrirModal = async () => {
        setCarregandoInformacoesModal(true);
        setEstadoModal(true);
        limparModal();
        limparErros();

        await carregarDiasSemanaDisponiveis();
        await carregarProfessorDiasSemanaDisponiveis();

        setCarregandoInformacoesModal(false);
    };

    const enviar = async () => {
        limparErros();
        if (validarCampos()) return;

        setCarregando(true);
        const formulario: IFormulario = {
            diaSemanaDisponivelIds: diasSemanaDisponiveisSelecionados.map(
                (diaSemanaDisponivel) => diaSemanaDisponivel.id
            ),
        };

        const response = await apiPut(`/professor/formulario`, formulario);

        if (response.status === STATUS_CODE.FORBIDDEN) {
            removerUsuario();
            window.location.href = "/login";
        }

        if (response.status === STATUS_CODE.NO_CONTENT) {
            exibirAlerta([`Formulário enviado com sucesso!`], "success");
        }

        if (
            response.status === STATUS_CODE.BAD_REQUEST ||
            response.status === STATUS_CODE.UNAUTHORIZED
        ) {
            const mensagens = response.messages;
            exibirAlerta(mensagens, "error");
        }

        if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            exibirAlerta(["Erro inesperado!"], "error");
        }

        setCarregando(false);
    };

    return <>
        <AlertaPadrao
            key={estadoAlerta ? "show" : "close"}
            estado={estadoAlerta}
            cor={corAlerta}
            mensagens={mensagensAlerta}
            onClose={() => {
                setEstadoAlerta(false);
            }}
        />

        <Modal open={estadoModal} onClose={fecharModal} className="modal">
            <Box className="modal-box" sx={{ maxWidth: "400px" }}>
                <LoadingContent
                    carregandoInformacoes={carregandoInformacoesModal}
                    isModal={true}
                    circleOn={true}
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Formulário
                </Typography>
                <Typography id="modal-modal-description" component="div">
                    <p className="formulario-info">
                        Informe o(s) dia(s) da semana que você está disponivel no semestre atual.
                    </p>
                    <div className="modal-content">
                        <div className="modal-one-form-group">
                            <MultiSelect
                                options={diasSemanaDisponiveis}
                                values={diasSemanaDisponiveisSelecionados}
                                label={"Dias da semana disponíveis"}
                                onChange={selecionarDiaSemanaDisponiveis}
                                error={validarCampoDiasSemanaDisponiveisSelecionados.existeErro}
                                helperText={validarCampoDiasSemanaDisponiveisSelecionados.mensagem}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <BotaoPadrao
                            label={"Enviar"}
                            carregando={carregando}
                            onClick={enviar}
                        />
                    </div>
                </Typography>
            </Box>
        </Modal>

        <li onClick={abrirModal}>
            <DescriptionIcon />
            Formulário
        </li>
    </>


}

export default Formulario;