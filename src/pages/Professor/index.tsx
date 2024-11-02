import { FC, useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import {
  AlertColor,
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
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
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import {
  AlternateEmail,
  EditNote,
  EventAvailable,
  LocalPhone,
  ToggleOffOutlined,
  ToggleOnOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { STATUS_ENUM } from "../../types/statusEnum";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import { aplicarMascaraCpf, aplicarMascaraTelefone } from "../../util/mascaras";
import { IProfessor, IProfessorRequest } from "../../types/professor";
import {
  diaSemanaEnumAbreviado,
} from "../../types/diaSemanaEnum";
import MultiSelect from "../../components/MultiSelect";
import { IPaginacao } from "../../types/paginacao";
import { IDiaSemanaDisponivel } from "../../types/diaSemanaDisponivel";
import { ICoordenador } from "../../types/coordenador";

const Professor: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false); //exemplo visualizar

  const [professores, setProfessores] = useState<IProfessor[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");

  const [diasSemanaDisponiveis, setDiasSemanaDisponiveis] = useState<
    IDiaSemanaDisponivel[]
  >([]);

  const [
    diasSemanaDisponiveisSelecionados,
    setDiasSemanaDisponiveisSelecionados,
  ] = useState<IDiaSemanaDisponivel[]>([]);

  const selecionarDiaSemanaDisponiveis = (
    diasSemanaDisponiveis: IDiaSemanaDisponivel[]
  ) => {
    setDiasSemanaDisponiveisSelecionados(diasSemanaDisponiveis);
  };

  const [coordenadorSelecionado, setCoordenadorSelecionado] =
    useState<ICoordenador>();
  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const [validarCampoTelefone, setValidarCampoTelefone] =
    useState<IValidarCampos>(valorInicialValidarCampos);

  const [validarCampoEmail, setValidarCampoEmail] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(
    valorInicialValidarCampos
  );

  const exibirErros = (mensagens: string[]) => {
    //tratamento erro

    const existeErroEspecifico = mensagens.some(
      (mensagem) =>
        mensagem.includes("Nome") ||
        mensagem.includes("Telefone") ||
        mensagem.includes("Email") ||
        mensagem.includes("CPF") ||
        mensagem.includes("Semana")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Nome")) {
        setValidarCampoNome({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Telefone")) {
        setValidarCampoTelefone({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Email")) {
        setValidarCampoEmail({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Cpf")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
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
    setValidarCampoTelefone(valorInicialValidarCampos);
    setValidarCampoEmail(valorInicialValidarCampos);
    setValidarCampoCpf(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setNome("");
    setTelefone("");
    setEmail("");
    setCpf("");
    setDiasSemanaDisponiveisSelecionados([]);
  };

  const validarCampos = (): boolean => {
    //tratamento erro
    let existeErro = false;

    if (!nome) {
      setValidarCampoNome(campoObrigatorio);
      existeErro = true;
    }
    if (!telefone) {
      setValidarCampoTelefone(campoObrigatorio);
      existeErro = true;
    }
    if (!email) {
      setValidarCampoEmail(campoObrigatorio);
      existeErro = true;
    }
    if (!cpf) {
      setValidarCampoCpf(campoObrigatorio);
      existeErro = true;
    }
    return existeErro;
  };

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false); //exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarCoordenador = async () => {
    const response = await apiGet("/coordenador/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setCoordenadores(response.data);
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

  const associar = async () => {


    const response = await apiPost(`professor/associar/coordenador/${coordenadorSelecionado?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setDiasSemanaDisponiveis(response.data);
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

  const carregarDiasSemanaDisponiveis = async () => {
    const response = await apiGet("/diasemanadisponivel/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setDiasSemanaDisponiveis(response.data);
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

  const carregarProfessor = async () => {
    const paginacao: IPaginacao = {
      exibir: 10,
      paginaAtual: 1,
    };

    const response = await apiGet("/professor/carregar", paginacao);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      setProfessores(response.data.data);
      console.log(response.data.data);
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

  const carregarProfessorPorId = async (id: number) => {
    const response = await apiGet(`/professor/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.OK) {
      const professorEncontrado: IProfessor = response.data;

      setId(id);
      setNome(professorEncontrado.nome);
      setTelefone(professorEncontrado.telefone);
      setEmail(professorEncontrado.email);
      setCpf(professorEncontrado.cpf);
      setDiasSemanaDisponiveisSelecionados(
        professorEncontrado.diasSemanaDisponiveis
      );
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

  const alterarStatusProfessor = async (
    id: number,
    nome: string,
    ativar: boolean
  ) => {
    const response = await apiPut(
      `/professor/${ativar ? "ativar" : "inativar"}/${id}`
    );

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta(
        [`${nome} ${ativar ? "ativado" : "inativado"} com sucesso!`],
        "success"
      );
      carregarProfessor();
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
    const professorRequest: IProfessorRequest = {
      id: id,
      nome: nome,
      telefone: telefone,
      email: email,
      cpf: cpf,
      diaSemanaDisponivelIds: diasSemanaDisponiveisSelecionados.map(
        (diaSemanaDisponivel) => diaSemanaDisponivel.id
      ),
    };

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/professor/editar/${id}`, professorRequest);
    } else {
      response = await apiPost(`/professor/criar`, professorRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Professor criado com sucesso!`], "success");
      carregarProfessor();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Professor editado com sucesso!`], "success");
      carregarProfessor();
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

    carregarCoordenador();
    carregarDiasSemanaDisponiveis();

    if (id) {
      carregarProfessorPorId(id);
    }

    setEstadoModal(true);
  };

  const visualizar = async (id: number) => {
    //exemplo visualizar
    limparModal();
    carregarProfessorPorId(id);
    setEstadoModalVisualizar(true);
  };

  useEffect(() => {
    carregarProfessor();
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
                Telefone:
              </Typography>
              <Typography variant="body1">
                {aplicarMascaraTelefone(telefone)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                E-mail:
              </Typography>
              <Typography variant="body1">{email}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                CPF:
              </Typography>
              <Typography variant="body1">{aplicarMascaraCpf(cpf)}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Dias da semana disponível(is):
              </Typography>
              {/* <Typography variant="body1">{diaSemanaDisponivelSelecionado}</Typography> */}
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Associar coordenador
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <div className="modal-content">
              <div className="modal-one-form-group">
                {/* <FormControl fullWidth>
                  <Autocomplete
                    options={coordenadores}
                    getOptionLabel={(coordenador: ICoordenador) =>
                      coordenador.nome
                    }
                    value={coordenadorSelecionado}
                    onChange={(event, value) => setCoordenadorSelecionado(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Coordenador" />
                    )}
                  />
                </FormControl> */}
              </div>
            </div>
            <div className="modal-footer">
              <BotaoPadrao
                label={"Associar"}
                carregando={carregando}
                onClick={associar}
              />
            </div>
          </Typography>
        </Box>
      </Modal>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Professor
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
                <InputPadrao
                  label={"CPF"}
                  type={"text"}
                  value={aplicarMascaraCpf(cpf)}
                  onChange={(e) => {
                    if (e) {
                      setCpf(e.target.value);
                    }
                  }}
                  error={validarCampoCpf.existeErro} //tratamento erro
                  helperText={validarCampoCpf.mensagem} //tratamento erro
                />
                <InputPadrao
                  label={"Telefone"}
                  type={"text"}
                  value={aplicarMascaraTelefone(telefone)}
                  onChange={(e) => {
                    if (e) {
                      setTelefone(e.target.value);
                    }
                  }}
                  error={validarCampoTelefone.existeErro} //tratamento erro
                  helperText={validarCampoTelefone.mensagem} //tratamento erro
                />
              </div>
              <div className="modal-one-form-group">
                <InputPadrao
                  label={"E-mail"}
                  type={"text"}
                  value={email}
                  onChange={(e) => {
                    if (e) {
                      setEmail(e.target.value);
                    }
                  }}
                  error={validarCampoEmail.existeErro} //tratamento erro
                  helperText={validarCampoEmail.mensagem} //tratamento erro
                />
              </div>

              <div className="modal-one-form-group">
                <MultiSelect
                  options={diasSemanaDisponiveis}
                  values={diasSemanaDisponiveisSelecionados}
                  label={"Dias da semana disponíveis"}
                  onChange={selecionarDiaSemanaDisponiveis}
                  // error={validarCampos.existeErro} //tratamento erro
                  // helperText={validarCampos.mensagem}//tratamento erro
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
          <h2>Professor</h2>
          <BotaoPadrao label={"Associar"} onClick={() => abrirModal()} />
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
        <div className="grid-content">
          {professores.map((professor) => (
            <CardPadrao
              key={professor.id}
              statusEnum={professor.statusEnum}
              titulo={professor.nome}
              body={[
                <CardPadraoBodyItem
                  icon={<LocalPhone titleAccess="Telefone" />}
                  label={aplicarMascaraTelefone(professor.telefone)}
                />,
                <CardPadraoBodyItem
                  icon={<AlternateEmail titleAccess="E-mail" />}
                  label={professor.email}
                />,
                <CardPadraoBodyItem
                  icon={<EventAvailable titleAccess="Dias disponíveis" />}
                  label={professor.diasSemanaDisponiveis
                    .map((dia) => diaSemanaEnumAbreviado(dia.diaSemanaEnum))
                    .join(", ")}
                />,
              ]}
              actions={[
                <CardPadraoActionItem //exemplo visualizar
                  icon={<VisibilityOutlined titleAccess="Visualizar" />}
                  onClick={() => visualizar(professor.id)}
                />,
                professor.statusEnum === STATUS_ENUM.ATIVO ? (
                  <CardPadraoActionItem
                    icon={<EditNote titleAccess="Editar" />}
                    onClick={() => abrirModal(professor.id)}
                  />
                ) : (
                  <></>
                ),
                professor.statusEnum === STATUS_ENUM.INATIVO ? (
                  <CardPadraoActionItem
                    icon={
                      <ToggleOffOutlined
                        titleAccess="Inativado"
                        color="error"
                      />
                    }
                    onClick={() =>
                      alterarStatusProfessor(professor.id, professor.nome, true)
                    }
                  />
                ) : (
                  <CardPadraoActionItem
                    icon={<ToggleOnOutlined titleAccess="Ativado" />}
                    onClick={() =>
                      alterarStatusProfessor(
                        professor.id,
                        professor.nome,
                        false
                      )
                    }
                  />
                ),
              ]}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default Professor;
