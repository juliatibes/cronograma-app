import { FC, useEffect, useState } from "react";
import "./index.css"; 
import { apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { AlertColor, Box,  Modal, Typography } from "@mui/material";
import { IFase, IFasesRequest } from "../../types/fase";
import { AutoStories,  EditNote, ToggleOff, ToggleOn } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import InputPadrao from "../../components/InputPadrao";
import { STATUS_ENUM } from "../../types/enums/statusEnum";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import AlertaPadrao from "../../components/AlertaPadrao";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { removerMascaraNumeros } from "../../util/mascaras";
import LoadingContent from "../../components/LoadingContent";

const Fase: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);

  const [fases, setFases] = useState<IFase[]>([]);

  const [id, setId] = useState<number>();
  const [numero, setNumero] = useState<string>('');

  const [validarCampoNumero, setValidarCampoNumero] = useState<IValidarCampos>(valorInicialValidarCampos);

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Número")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Número")) {
        setValidarCampoNumero({ existeErro: true, mensagem: mensagem });
        continue;
      }
    }

  }

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const limparErros = () => {
    setValidarCampoNumero(valorInicialValidarCampos);
  }

  const limparModal = () => {
    setId(undefined);
    setNumero('');
  }

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!numero) {
      setValidarCampoNumero(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const fecharModal = () => setEstadoModal(false);

  const carregarFase = async () => {
    setCarregandoInformacoesPagina(true);
    const response = await apiGet('/fase/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      setFases(response.data);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
    setCarregandoInformacoesPagina(false);
  }

  const carregarFasePorId = async (id: number) => {
    const response = await apiGet(`/fase/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      const faseEncontrada: IFase = response.data;

      setId(id);
      setNumero(faseEncontrada.numero.toString());
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const alterarStatusFase = async (id: number, numero: number, ativar: boolean) => {
    const response = await apiPut(`/fase/${ativar ? "ativar" : "inativar"}/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';;
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${numero} ${ativar ? "ativada" : "inativada"} com sucesso!`], "success");
      carregarFase();
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const salvar = async () => {
    limparErros();
    if (validarCampos()) return;

    setCarregando(true);
    const faseRequest: IFasesRequest = {
      id: id,
      numero: +numero,
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/fase/editar/${id}`, faseRequest);
    } else {
      response = await apiPost(`/fase/criar`, faseRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Fase criada com sucesso!`], "success");
      carregarFase();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Fase editada com sucesso!`], "success");
      carregarFase();
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }

    setCarregando(false);
  }

  const abrirModal = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModal(true);
    limparModal();
    limparErros();

    if (id) {
      await carregarFasePorId(id);
    }

    setCarregandoInformacoesModal(false);
  }

  useEffect(() => {
    carregarFase();
  }, []);

  return <>

  <Modal open={estadoModal} onClose={fecharModal} className="modal">
    <Box className='modal-box' sx={{maxWidth:'350px'}}>
    <LoadingContent
          carregandoInformacoes={carregandoInformacoesModal}
          isModal={true}
          circleOn={true}
        />
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Fase
      </Typography>
      <Typography
        id="modal-modal-description"
        component="div"
      >
        <div className="modal-content">
          <div className="modal-two-form-group">
            < InputPadrao
              label={"Número"}
              type={"text"}
              value={removerMascaraNumeros(numero)}
              onChange={(e) => {
                if (e) {
                  setNumero(removerMascaraNumeros(e.target.value))
                }
              }}
              error={validarCampoNumero.existeErro}
              helperText={validarCampoNumero.mensagem}
            />
          </div>
        </div>
        <div className="modal-footer">
          <BotaoPadrao
            label={"Salvar"}
            carregando={carregando}
           onClick={salvar}
          />

        </div>
      </Typography>
    </Box>
  </Modal>

  <AlertaPadrao
    key={estadoAlerta ? "show" : "close"}
    estado={estadoAlerta}
    cor={corAlerta}
    mensagens={mensagensAlerta}
    onClose={() => {
      setEstadoAlerta(false);
    }}
  />

  <main className="page-main">
    <div className="page-main-title">
      <h2>Fases</h2>
      <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
    </div>
    <div className="grid-content">
    <LoadingContent
          carregandoInformacoes={carregandoInformacoesPagina}
          isModal={false}
          circleOn={true}
        />
      {fases.map((fase) => (
        <CardPadrao
          key={fase.id}
          statusEnum={fase.statusEnum}
          titulo={fase.numero.toString() + "ª Fase"}
          body={[
            <CardPadraoBodyItem icon={<AutoStories titleAccess="Fase" />} label={fase.numero.toString()} />,
          ]}
          actions={[
            (
              fase.statusEnum === STATUS_ENUM.ATIVO ?
              (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => abrirModal(fase.id)} />) :
              <></>
            ),
            (
              fase.statusEnum === STATUS_ENUM.INATIVO ?
              (
              <CardPadraoActionItem 
                icon={<ToggleOff className="toggleOff" titleAccess="Inativado" />} 
                onClick={() => alterarStatusFase(fase.id, fase.numero, true)} 
                />
              ) :
              (
              <CardPadraoActionItem 
              icon={<ToggleOn className="toggleOn" titleAccess="Ativado" color="primary"/>} 
              onClick={() => alterarStatusFase(fase.id, fase.numero, false)} 
              />
            )
            ),
          ]}
        />
      ))}
    </div>
  </main>
</>
};

export default Fase;

