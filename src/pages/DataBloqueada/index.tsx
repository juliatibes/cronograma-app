import { FC, useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import {
  AlertColor,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  Stack,
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
  AccountBalance,
  EditNote,
  EventOutlined,
  RemoveCircleOutlineOutlined,
  ToggleOffOutlined,
  ToggleOnOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { STATUS_ENUM } from "../../types/statusEnum";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { aplicarMascaraDataPtBr } from "../../util/mascaras";
import {
  IDataBloqueada,
  IDataBloqueadaRequest,
} from "../../types/dataBloqueada";

const DataBloqueada: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false); //exemplo visualizar

  const [datasBloqueadas, setDatasBloqueadas] = useState<IDataBloqueada[]>([]);

  const [id, setId] = useState<number>();
  const [motivo, setMotivo] = useState<string>("");
  const [data, setData] = useState<Dayjs>();

  const [validarCampoMotivo, setValidarCampoMotivo] = useState<IValidarCampos>(
    valorInicialValidarCampos
  ); //tratamento erro

  const exibirErros = (mensagens: string[]) => {
    //tratamento erro

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
    //tratamento erro
    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  };

  const limparErros = () => {
    //tratamento erro
    setValidarCampoMotivo(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setMotivo("");
    setData(undefined);
  };

  const validarCampos = (): boolean => {
    //tratamento erro
    let existeErro = false;

    if (!motivo) {
      setValidarCampoMotivo(campoObrigatorio);
      existeErro = true;
    }
    return existeErro;
  };

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false); //exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarDataBloqueada = async () => {
    const response = await apiGet("/databloqueada/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setDatasBloqueadas(response.data);
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error"); //tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error"); //tratamento erro
    }
  };

  const carregarDataBloqueadaPorId = async (id: number) => {
    const response = await apiGet(`/databloqueada/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
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
      exibirAlerta(mensagens, "error"); //tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error"); //tratamento erro
    }
  };

  const excluirDataBloqueada = async (id: number, motivo: string) => {
    const response = await apiDelete(`/databloqueada/excluir/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${motivo} excluído com sucesso!`], "success");
      carregarDataBloqueada();
    }

    if (
      response.status === STATUS_CODE.BAD_REQUEST ||
      response.status === STATUS_CODE.UNAUTHORIZED
    ) {
      const mensagens = response.messages;
      exibirErros(mensagens); //tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error"); //tratamento erro
    }
  };

  const salvar = async () => {
    limparErros(); //tratamento erro
    if (validarCampos()) return; //tratamento erro

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
      navigate("/login");
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
      exibirErros(mensagens); //tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error"); //tratamento erro
    }

    setCarregando(false);
  };

  const abrirModal = async (id?: number) => {
    limparModal();
    limparErros(); //tratamento erro

    if (id) {
      carregarDataBloqueadaPorId(id);
    }

    setEstadoModal(true);
  };

  const visualizar = async (id: number) => {
    //exemplo visualizar
    limparModal();
    carregarDataBloqueadaPorId(id);
    setEstadoModalVisualizar(true);
  };

  useEffect(() => {
    carregarDataBloqueada();
  }, []);

  return (
    <>
      {/*//exemplo visualizar */}
      <Dialog
        open={estadoModalVisualizar}
        onClose={fecharModalVisualizar}
        fullWidth
        maxWidth="sm"
        sx={{ borderRadius: 4, padding: 2 }}
        PaperProps={{
          sx: {
            outline: "2px solid var(--dark-blue-senac)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {motivo}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, margin: "0px 0px 8px 0px" }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Motivo:
              </Typography>
              <Typography variant="body1">{motivo}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Data:
              </Typography>
              <Typography variant="body1">
                {aplicarMascaraDataPtBr(data)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box">
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
                  error={validarCampoMotivo.existeErro} //tratamento erro
                  helperText={validarCampoMotivo.mensagem} //tratamento erro
                />
              </div>
              <div className="modal-two-form-group">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DatePicker
                    label="Data"
                    format="DD/MM/YYYY"
                    className="date-picker"
                    value={data}
                    onChange={(date) => {
                      if (date) {
                        setData(date);
                      }
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
      <AlertPadrao
        key={estadoAlerta ? "show" : "close"} //componente tratamento erro
        estado={estadoAlerta}
        cor={corAlerta}
        mensagens={mensagensAlerta}
        onClose={() => {
          setEstadoAlerta(false);
        }}
      />

      <main className="page-main">
        <div style={{ display: "flex" }}>
          <h2>Data bloqueada</h2>
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
        <div className="grid-content">
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
                // <CardPadraoActionItem //exemplo visualizar
                //   icon={<VisibilityOutlined titleAccess="Visualizar" />}
                //   onClick={() => visualizar(dataBloqueada.id)}
                // />,
                <CardPadraoActionItem
                  icon={<EditNote titleAccess="Editar" />}
                  onClick={() => abrirModal(dataBloqueada.id)}
                />,
                <CardPadraoActionItem
                  icon={<RemoveCircleOutlineOutlined titleAccess="Excluir" />}
                  onClick={() =>
                    excluirDataBloqueada(dataBloqueada.id, dataBloqueada.motivo)
                  }
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
