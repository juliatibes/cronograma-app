import { FC, useEffect, useState } from "react";
import "./index.css";
import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  List,
  ListItem,
  ListItemText,
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
  apiGet,
  apiPost,
  apiPut,
  IDataResponse,
  STATUS_CODE,
} from "../../api/RestClient";
import { IPeriodo, IPeriodoRequest } from "../../types/periodo";
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import {
  EditNote,
  EventOutlined,
  WarningAmber,
} from "@mui/icons-material";
import { STATUS_ENUM } from "../../types/enums/statusEnum";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { aplicarMascaraDataPtBr } from "../../util/mascaras";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import LoadingContent from "../../components/LoadingContent";

const Periodo: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);

  const [periodos, setPeriodos] = useState<IPeriodo[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>("");
  const [dataInicial, setDataInicial] = useState<Dayjs>();
  const [dataFinal, setDataFinal] = useState<Dayjs>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const exibirErros = (mensagens: string[]) => {

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

    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  };

  const limparErros = () => {

    setValidarCampoNome(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setNome("");
    setDataInicial(undefined)
    setDataFinal(undefined)
  };

  const validarCampos = (): boolean => {

    let existeErro = false;

    if (!nome) {
      setValidarCampoNome(campoObrigatorio);
      existeErro = true;
    }
    return existeErro;
  };

  const fecharModal = () => setEstadoModal(false);

  const carregarPeriodo = async () => {
    setCarregandoInformacoesPagina(true);
    const response = await apiGet("/periodo/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      setPeriodos(response.data);
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

  const carregarPeriodoPorId = async (id: number) => {
    const response = await apiGet(`/periodo/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
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
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  };

  const salvar = async () => {
    limparErros();
    if (validarCampos()) return;

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
      removerUsuario();
      window.location.href = '/login';
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
      await carregarPeriodoPorId(id);
    }

    setCarregandoInformacoesModal(false);
  };

  useEffect(() => {
    carregarPeriodo();
  }, []);

  return (
    <>
      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box">
          <LoadingContent
            carregandoInformacoes={carregandoInformacoesModal}
            isModal={true}
            circleOn={true}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Período
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <div className="modal-content">
              {
                !id &&
                <div className="periodo-aviso">
                  <div className="periodo-aviso-header">
                    <WarningAmber sx={{ fontSize: "22px" }} color="warning" />
                    <h4>Aviso</h4>
                  </div>
                  <ul className="periodo-aviso-lista">
                    <li>Todas as Notificações serão limpas.</li>
                    <li>Todas as Datas Bloqueadas serão excluidas.</li>
                    <li>Todos os Alunos de todos os cursos serão excluidos.</li>
                    <li>Todos os dias da semana disponíveis relacionados aos Professores serão excluidos.</li>
                  </ul>
                </div>
              }
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
                  error={validarCampoNome.existeErro}
                  helperText={validarCampoNome.mensagem}
                />
              </div>
              <div className="modal-two-form-group">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data inicial"
                    format="DD/MM/YYYY"
                    sx={{ width: '100%' }}
                    className="date-picker"
                    value={dataInicial}
                    onChange={(date) => {
                      if (date) {
                        setDataInicial(date);
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
                  <DatePicker
                    label="Data final"
                    sx={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    className="date-picker"
                    value={dataFinal}
                    onChange={(date) => {
                      if (date) {
                        setDataFinal(date);
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

      <AlertPadrao
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
          <h2>Períodos</h2>
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
        <div className="grid-content">
          <LoadingContent
            carregandoInformacoes={carregandoInformacoesPagina}
            isModal={false}
            circleOn={true}
          />
          {periodos.map((periodo) => (
            <CardPadrao
              key={periodo.id}
              statusEnum={periodo.statusEnum}
              titulo={periodo.nome}
              body={[
                <CardPadraoBodyItem
                  icon={<EventOutlined titleAccess="Data Inicial" />}
                  label={aplicarMascaraDataPtBr(periodo.dataInicial)}
                />,
                <CardPadraoBodyItem
                  icon={<EventOutlined titleAccess="Data Final" />}
                  label={aplicarMascaraDataPtBr(periodo.dataFinal)}
                />,
              ]}
              actions={[
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
