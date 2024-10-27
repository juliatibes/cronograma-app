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
  TextField,
  Typography,
} from "@mui/material";
import "dayjs/locale/pt-br";
import {
  campoObrigatorio,
  IValidarCampos,
  valorInicialValidarCampos,
} from "../../util/validarCampos";
import {
  apiGet,
  apiPost,
  apiPut,
  IDataResponse,
  STATUS_CODE,
} from "../../api/RestClient";
import { IPeriodo, IPeriodoRequest } from "../../types/periodo";
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
// import DatePicker from "@mui/lab/DatePicker";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import {
  AccountBalance,
  EditNote,
  People,
  ToggleOffOutlined,
  ToggleOnOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import AutoStories from "@mui/icons-material/AutoStories";
import { STATUS_ENUM } from "../../types/statusEnum";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { aplicarMascaraDataPtBr } from "../../util/mascaras";

const Periodo: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false); //exemplo visualizar

  const [periodos, setPeriodos] = useState<IPeriodo[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>("");
  const [dataInicial, setDataInicial] = useState<Dayjs>();
  const [dataFinal, setDataFinal] = useState<Dayjs>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(
    valorInicialValidarCampos
  ); //tratamento erro

  const exibirErros = (mensagens: string[]) => {
    //tratamento erro

    const existeErroEspecifico = mensagens.some((mensagem) =>
      mensagem.includes("Nome")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Nome")) {
        setValidarCampoNome({ existeErro: true, mensagem: mensagem });
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
    setValidarCampoNome(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setNome("");
    setDataInicial(undefined)
    setDataFinal(undefined)
  };

  const validarCampos = (): boolean => {
    //tratamento erro
    let existeErro = false;

    if (!nome) {
      setValidarCampoNome(campoObrigatorio);
      existeErro = true;
    }
    return existeErro;
  };

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false); //exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarPeriodo = async () => {
    const response = await apiGet("/periodo/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setPeriodos(response.data);
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

  const carregarPeriodoPorId = async (id: number) => {
    const response = await apiGet(`/periodo/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      const periodoEncontrado: IPeriodo = response.data;

      setId(id);
      setNome(periodoEncontrado.nome);
      setDataInicial(dayjs(periodoEncontrado.dataInicial));
      setDataFinal(dayjs(periodoEncontrado.dataFinal));
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

  const alterarStatusPeriodo = async (
    id: number,
    nome: string,
    ativar: boolean
  ) => {
    const response = await apiPut(
      `/periodo/${ativar ? "ativar" : "inativar"}/${id}`
    );

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta(
        [`${nome} ${ativar ? "ativado" : "inativado"} com sucesso!`],
        "success"
      );
      carregarPeriodo();
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
    const periodoRequest: IPeriodoRequest = {
      id: id,
      nome: nome,
      dataInicial: dataInicial || null,
      dataFinal: dataFinal || null,
    };

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/periodo/editar/${id}`, periodoRequest);
    } else {
      response = await apiPost(`/periodo/criar`, periodoRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Período criado com sucesso!`], "success");
      carregarPeriodo();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Período editado com sucesso!`], "success");
      carregarPeriodo();
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
      carregarPeriodoPorId(id);
    }

    setEstadoModal(true);
  };

  const visualizar = async (id: number) => {
    //exemplo visualizar
    limparModal();
    carregarPeriodoPorId(id);
    setEstadoModalVisualizar(true);
  };

  useEffect(() => {
    carregarPeriodo();
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
            {nome}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2, margin: "0px 0px 8px 0px" }}>
              <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Nome:
            </Typography>
            <Typography variant="body1">{nome}</Typography>
          </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Data Inicial:
                </Typography>
                <Typography variant="body1">{aplicarMascaraDataPtBr(dataInicial)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Data Final:
                </Typography>
                <Typography variant="body1">{aplicarMascaraDataPtBr(dataFinal)}</Typography>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>

        <Modal open={estadoModal} onClose={fecharModal} className="modal">
          <Box className="modal-box">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Período
            </Typography>
            <Typography id="modal-modal-description" component="div">
              <div className="modal-content">
                <div className="modal-one-form-group">
                  <InputPadrao
                    label={"Nome"}
                    type={"text"}
                    value={nome}
                    onChange={(e) => {
                      if (e) {
                        setNome(e.target.value);
                      }
                    }}
                    error={validarCampoNome.existeErro} //tratamento erro
                    helperText={validarCampoNome.mensagem} //tratamento erro
                  />
                </div>
                <div className="modal-two-form-group">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data inicial"
                    format="DD/MM/YYYY"
                    className="date-picker"
                    value={dataInicial}
                    onChange={(date) => {
                      if (date) {
                        setDataInicial(date);
                      }
                    }}
                  />
                  <DatePicker
                    label="Data final"
                    format="DD/MM/YYYY"
                    className="date-picker"
                    value={dataFinal}
                    onChange={(date) => {
                      if (date) {
                        setDataFinal(date);
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
            <h2>Período</h2>
            <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
          </div>
          <div className="grid-content">
            {periodos.map((periodo) => (
              <CardPadrao
                key={periodo.id}
                statusEnum={periodo.statusEnum}
                titulo={periodo.nome}
                body={[
                  <CardPadraoBodyItem
                    icon={<AccountBalance titleAccess="Data Inicial" />}
                    label={aplicarMascaraDataPtBr(periodo.dataInicial)}
                  />,
                  <CardPadraoBodyItem
                    icon={<People titleAccess="Data Final" />}
                    label={aplicarMascaraDataPtBr(periodo.dataFinal)}
                  />,
                ]}
                actions={[
                  <CardPadraoActionItem //exemplo visualizar
                    icon={<VisibilityOutlined titleAccess="Visualizar" />}
                    onClick={() => visualizar(periodo.id)}
                  />,
                  periodo.statusEnum === STATUS_ENUM.ATIVO ? (
                    <CardPadraoActionItem
                      icon={<EditNote titleAccess="Editar" />}
                      onClick={() => abrirModal(periodo.id)}
                    />
                  ) : (
                    <></>
                  ),
                ]}
              />
            ))}
          </div>
        </main>
      
    </>
  );
};

export default Periodo;
