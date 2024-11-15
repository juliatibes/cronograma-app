import { FC, useEffect, useState } from "react";
import "./index.css";
import {
  AlertColor,
  Box,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import "dayjs/locale/pt-br";
import {
  campoObrigatorio,
  IValidarCampos,
  valorInicialValidarCampos,
} from "../../util/validarCampos";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  IDataResponse,
  STATUS_CODE,
} from "../../api/RestClient";
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import {
  EditNote,
  EventOutlined,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { aplicarMascaraDataPtBr } from "../../util/mascaras";
import {
  IDataBloqueada,
  IDataBloqueadaRequest,
} from "../../types/dataBloqueada";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import LoadingContent from "../../components/LoadingContent";

const DataBloqueada: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);

  const [datasBloqueadas, setDatasBloqueadas] = useState<IDataBloqueada[]>([]);

  const [id, setId] = useState<number>();
  const [motivo, setMotivo] = useState<string>("");
  const [data, setData] = useState<Dayjs>();

  const [dataBloqueadaSelecionadaExclusao, setDataBloqueadaSelecionadaExclusao] = useState<IDataBloqueada>();

  const [validarCampoMotivo, setValidarCampoMotivo] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const exibirErros = (mensagens: string[]) => {


    const existeErroEspecifico = mensagens.some((mensagem) =>
      mensagem.includes("Motivo")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Motivo")) {
        setValidarCampoMotivo({ existeErro: true, mensagem: mensagem });
      }
    }
  };

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  };

  const limparErros = () => {
    setValidarCampoMotivo(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setMotivo("");
    setData(undefined);
  };

  const validarCampos = (): boolean => {

    let existeErro = false;

    if (!motivo) {
      setValidarCampoMotivo(campoObrigatorio);
      existeErro = true;
    }
    return existeErro;
  };

  const fecharModal = () => setEstadoModal(false);

  const carregarDataBloqueada = async () => {
    setCarregandoInformacoesPagina(true);
    const response = await apiGet("/databloqueada/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      setDatasBloqueadas(response.data);
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
    setCarregandoInformacoesPagina(false);
  };

  const carregarDataBloqueadaPorId = async (id: number) => {
    const response = await apiGet(`/databloqueada/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      const dataBloqueadaEncontrada: IDataBloqueada = response.data;

      setId(id);
      setMotivo(dataBloqueadaEncontrada.motivo);
      setData(dayjs(dataBloqueadaEncontrada.data));
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

  const excluirDataBloqueada = async () => {
    const response = await apiDelete(`/databloqueada/excluir/${dataBloqueadaSelecionadaExclusao?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${dataBloqueadaSelecionadaExclusao?.motivo} excluído com sucesso!`], "success");
      carregarDataBloqueada();
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  };

  const salvar = async () => {
    limparErros();
    if (validarCampos()) return;

    setCarregando(true);
    const dataBloqueadaRequest: IDataBloqueadaRequest = {
      id: id,
      motivo: motivo,
      data: data || null,
    };

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(
        `/databloqueada/editar/${id}`,
        dataBloqueadaRequest
      );
    } else {
      response = await apiPost(`/databloqueada/criar`, dataBloqueadaRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Data bloqueada criada com sucesso!`], "success");
      carregarDataBloqueada();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Data bloqueada editada com sucesso!`], "success");
      carregarDataBloqueada();
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }

    setCarregando(false);
  };

  const abrirModal = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModal(true);
    limparModal();
    limparErros();

    if (id) {
     await carregarDataBloqueadaPorId(id);
    }
    setCarregandoInformacoesModal(false);
    
  };

  const fecharModalExclusao = () => setExibirModalExclusao(false);

  const abrirModalExclusao = () => setExibirModalExclusao(true);

  const confirmar = () => {
    excluirDataBloqueada();
    fecharModalExclusao();
  };

  const cancelar = () => {
    fecharModalExclusao();
  };

  useEffect(() => {
    carregarDataBloqueada();
  }, []);

  return (
    <>

      <AlertPadrao
        key={estadoAlerta ? "show" : "close"} //componente tratamento erro
        estado={estadoAlerta}
        cor={corAlerta}
        mensagens={mensagensAlerta}
        onClose={() => {
          setEstadoAlerta(false);
        }}
      />

      <Modal
        open={exibirModalExclusao}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') fecharModalExclusao();
        }}
        disableEscapeKeyDown
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: "var(--gray)",
            boxShadow: 3,
            padding: "24px 16px",
            borderRadius: 2,
            maxWidth: "350px",
            outline: 'none',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            }
          }}
        >
          <Typography id="modal-excluir-title" component="h2">
            Deseja confirmar a exclusão de {dataBloqueadaSelecionadaExclusao?.motivo}?
          </Typography>

          <Box id="modal-excluir-actions">
            <Button variant="outlined" sx={{ color:"#464646", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder", border: "2px solid #464646" }} onClick={cancelar}>
              Cancelar
            </Button>
            <Button variant="contained" sx={{ backgroundColor:"#c73636", color:"#e7d8d8" ,fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder" }} onClick={confirmar}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box" sx={{maxWidth:"450px"}}>
        <LoadingContent
          carregandoInformacoes={carregandoInformacoesModal}
          isModal={true}
          circleOn={true}
        />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Data Bloqueada
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <div className="modal-content">
              <div className="modal-one-form-group">
                <InputPadrao
                  label={"Motivo"}
                  type={"text"}
                  value={motivo}
                  onChange={(e) => {
                    if (e) {
                      setMotivo(e.target.value);
                    }
                  }}
                  error={validarCampoMotivo.existeErro}
                  helperText={validarCampoMotivo.mensagem}
                />
              </div>
              <div className="modal-one-form-group">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  
                >
                  <DatePicker
                    sx={{width:'100%'}}
                    label="Data"
                    format="DD/MM/YYYY"
                    className="date-picker"
                    value={data}
                    onChange={(date) => {
                      if (date) {
                        setData(date);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                      },
                      popper: {
                        placement: 'auto',
                      },
                    }}
                  />
                </LocalizationProvider>
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

      <main className="page-main">
        <div className="page-main-title">
          <h2>Datas Bloqueadas</h2>
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
        <div className="grid-content">
        <LoadingContent
          carregandoInformacoes={carregandoInformacoesPagina}
          isModal={false}
          circleOn={true}
        />
          {datasBloqueadas.map((dataBloqueada) => (
            <CardPadrao
              key={dataBloqueada.id}
              statusEnum={dataBloqueada.statusEnum}
              titulo={dataBloqueada.motivo}
              body={[
                <CardPadraoBodyItem
                  icon={<EventOutlined titleAccess="Data" />}
                  label={aplicarMascaraDataPtBr(dataBloqueada.data)}
                />,
              ]}
              actions={[
                <CardPadraoActionItem
                  icon={<EditNote titleAccess="Editar" />}
                  onClick={() => abrirModal(dataBloqueada.id)}
                />,
                <CardPadraoActionItem
                  icon={<RemoveCircleOutlineOutlined sx={{color:"#c73636"}} titleAccess="Excluir" />}
                  onClick={() => {
                    setDataBloqueadaSelecionadaExclusao(dataBloqueada);
                    abrirModalExclusao();
                  }}
                />,
              ]}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default DataBloqueada;
