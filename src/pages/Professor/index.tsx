import { FC, useEffect, useRef, useState } from "react";
import "./index.css";
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
  Pagination,
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
  ToggleOff,
  ToggleOn,
  VisibilityOutlined,
} from "@mui/icons-material";
import { STATUS_ENUM } from "../../types/enums/statusEnum";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import { aplicarMascaraCpf, aplicarMascaraTelefone } from "../../util/mascaras";
import { IProfessor, IProfessorRequest } from "../../types/professor";
import {
  diaSemanaEnumAbreviado,
} from "../../types/enums/diaSemanaEnum";
import MultiSelect from "../../components/MultiSelect";
import { IPaginacao, IPaginacaoResponse } from "../../types/paginacao";
import { IDiaSemanaDisponivel } from "../../types/diaSemanaDisponivel";
import { ICoordenador } from "../../types/coordenador";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import LoadingContent from "../../components/LoadingContent";
import { OPERADOR_ENUM, validarPermissao } from "../../permissoes";

const Professor: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregandoAssociar, setCarregandoAssociar] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [exibir] = useState<number>(8);
  const [paginaInicial] = useState<number>(1);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [paginacaoResponse, setPaginacaoResponse] = useState<IPaginacaoResponse>();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalAssociar, setEstadoModalAssociar] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);

  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [diasSemanaDisponiveis, setDiasSemanaDisponiveis] = useState<IDiaSemanaDisponivel[]>([]);
  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [diasSemanaDisponiveisSelecionados, setDiasSemanaDisponiveisSelecionados] = useState<IDiaSemanaDisponivel[]>([]);
  const [coordenadorSelecionado, setCoordenadorSelecionado] = useState<ICoordenador | null>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoTelefone, setValidarCampoTelefone] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoEmail, setValidarCampoEmail] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoCoordenadorSelecionado, setValidarCampoCoordenadorSelecionado] = useState<IValidarCampos>(valorInicialValidarCampos);

  const trocarPagina = (event: React.ChangeEvent<unknown>, page: number) => {
    setCarregandoInformacoesPagina(true);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(async () => {
      await carregarProfessor(page);
    }, 300);

    setPaginaAtual(page);
  }

  const selecionarDiaSemanaDisponiveis = (diasSemanaDisponiveis: IDiaSemanaDisponivel[]) => {
    setDiasSemanaDisponiveisSelecionados(diasSemanaDisponiveis)
  };

  const selecionarCoordenador = (coordenador: ICoordenador | null) => {
    if (coordenador) {
      setCoordenadorSelecionado(coordenador);
    } else {
      setCoordenadorSelecionado(null);
    }
  };

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(
      (mensagem) =>
        mensagem.includes("Nome") ||
        mensagem.includes("Telefone") ||
        mensagem.includes("Email") ||
        mensagem.includes("Cpf") ||
        mensagem.includes("Semana") ||
        mensagem.includes("Coordenador")
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
        continue;
      }
      if (mensagem.includes("Coordenador")) {
        setValidarCampoCoordenadorSelecionado({ existeErro: true, mensagem: mensagem });
      }
    }
  };

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    setEstadoModal(false);
    setEstadoModalAssociar(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  };

  const limparErros = () => {
    setValidarCampoNome(valorInicialValidarCampos);
    setValidarCampoTelefone(valorInicialValidarCampos);
    setValidarCampoEmail(valorInicialValidarCampos);
    setValidarCampoCpf(valorInicialValidarCampos);
  };

  const limparErrosAssociar = () => {
    setValidarCampoCoordenadorSelecionado(valorInicialValidarCampos);
  };

  const limparModal = () => {
    setId(undefined);
    setNome("");
    setTelefone("");
    setEmail("");
    setCpf("");
    setDiasSemanaDisponiveisSelecionados([]);
  };

  const limparModalAssociar = () => {
    setCoordenadorSelecionado(null);
  };

  const validarCampos = (): boolean => {

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

  const validarCamposAssociar = (): boolean => {
    let existeErro = false;

    if (!coordenadorSelecionado) {
      setValidarCampoCoordenadorSelecionado(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  };

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false); //exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const fecharModalAssociar = () => setEstadoModalAssociar(false);

  const carregarCoordenador = async () => {
    const response = await apiGet("/coordenador/carregar");

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setCoordenadores(response.data);
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

  const carregarProfessor = async (page?: number) => {
    setCarregandoInformacoesPagina(true);

    const paginacao: IPaginacao = {
      exibir: exibir,
      paginaAtual: page ?? paginaInicial,
    };

    const response = await apiGet("/professor/carregar", paginacao);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setProfessores(response.data.data);
      setPaginacaoResponse(response.data);
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

  const carregarProfessorPorId = async (id: number) => {
    const response = await apiGet(`/professor/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
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
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
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
      removerUsuario();
      window.location.href = "/login";
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
      removerUsuario();
      window.location.href = "/login";
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
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }

    setCarregando(false);
  };

  const associar = async () => {
    limparErrosAssociar();
    if (validarCamposAssociar()) return;
    setCarregandoAssociar(true);

    const response = await apiPost(`professor/associar/coordenador/${coordenadorSelecionado?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta(["Coordenador associado com sucesso!"], "success");
      carregarProfessor();
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

    setCarregandoAssociar(false);
  };

  const abrirModal = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModal(true);
    limparModal();
    limparErros();

    await carregarDiasSemanaDisponiveis();

    if (id) {
      await carregarProfessorPorId(id);
    }

    setCarregandoInformacoesModal(false);
  };

  const abrirModalAssociar = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModalAssociar(true);
    limparModalAssociar();
    limparErrosAssociar();

    await carregarCoordenador();

    setCarregandoInformacoesModal(false);
  };

  const visualizar = async (id: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModalVisualizar(true);
    limparModal();
    await carregarProfessorPorId(id);
    setCarregandoInformacoesModal(false);
  };

  useEffect(() => {
    carregarProfessor();
  }, []);

  return (
    <>
      <Dialog
        open={estadoModalVisualizar}
        onClose={fecharModalVisualizar}
        fullWidth
        maxWidth="sm"
        sx={{ borderRadius: 4, padding: 2 }}
        PaperProps={{
          sx: {
            outline: "2px solid var(--dark-blue-senac)",
            justifyContent: "center",
          },
        }}
      >
        <LoadingContent
          carregandoInformacoes={carregandoInformacoesModal}
          isModal={true}
          circleOn={true}
        />
        <DialogTitle fontSize='1.6rem' sx={{ textAlign: 'center', fontWeight: 'bolder' }}>
          {nome}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, margin: "0px 0px 8px 0px", paddingTop: '2px' }}>
            <Typography className="info-modal-visualizar-fields" component="div">
              <Box component={'dl'}>
                <Typography className="info-modal-visualizar-linha" component="div">
                  <Typography component="dt">
                    CPF:
                  </Typography>
                  <Typography component="dd">
                    {aplicarMascaraCpf(cpf)}
                  </Typography>
                </Typography>

                <Typography className="info-modal-visualizar-linha" component="div">
                  <Typography component="dt">
                    Telefone:
                  </Typography>
                  <Typography component="dd">
                    {aplicarMascaraTelefone(telefone)}
                  </Typography>
                </Typography>

                <Typography className="info-modal-visualizar-linha" component="div">
                  <Typography component="dt">
                    E-mail:
                  </Typography>
                  <Typography component="dd">
                    {email}
                  </Typography>
                </Typography>

                <Typography className="info-modal-visualizar-linha" component="div">
                  <Typography component="dt">
                    Dias da semana disponíveis:
                  </Typography>
                  <Typography component="dd">
                    {diasSemanaDisponiveisSelecionados.map(
                      (diaSemana) => diaSemanaEnumAbreviado(diaSemana.diaSemanaEnum)
                    ).join(", ")}
                  </Typography>
                </Typography>
              </Box>
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      <Modal open={estadoModalAssociar} onClose={fecharModalAssociar} className="modal">
        <Box className="modal-box" sx={{ maxWidth: "400px" }}>
          <LoadingContent
            carregandoInformacoes={carregandoInformacoesModal}
            isModal={true}
            circleOn={true}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Associar coordenador
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <div className="modal-content">
              <div className="modal-one-form-group">
                <FormControl fullWidth>
                  <Autocomplete
                    size="small"
                    options={coordenadores}
                    getOptionLabel={(coordenador: ICoordenador) =>
                      coordenador.nome
                    }
                    value={coordenadorSelecionado}
                    onChange={(event, value) => selecionarCoordenador(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params} label="Coordenador"
                        error={validarCampoCoordenadorSelecionado.existeErro}
                        helperText={validarCampoCoordenadorSelecionado.mensagem}
                      />
                    )}
                  />
                </FormControl>
              </div>
            </div>
            <div className="modal-footer">
              <BotaoPadrao
                label={"Associar"}
                carregando={carregandoAssociar}
                onClick={associar}
              />
            </div>
          </Typography>
        </Box>
      </Modal>

      <Modal open={estadoModal} onClose={fecharModal} className="modal">
        <Box className="modal-box">
          <LoadingContent
            carregandoInformacoes={carregandoInformacoesModal}
            isModal={true}
            circleOn={true}
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Professor
          </Typography>
          <Typography id="modal-modal-description" component="div">
            <div className="modal-content">
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
                  error={validarCampoCpf.existeErro}
                  helperText={validarCampoCpf.mensagem}
                />
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
                <InputPadrao
                  label={"E-mail"}
                  type={"email"}
                  value={email}
                  onChange={(e) => {
                    if (e) {
                      setEmail(e.target.value);
                    }
                  }}
                  error={validarCampoEmail.existeErro}
                  helperText={validarCampoEmail.mensagem}
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
                  error={validarCampoTelefone.existeErro}
                  helperText={validarCampoTelefone.mensagem}
                />
              </div>
              <div className="modal-one-form-group">
                <MultiSelect
                  options={diasSemanaDisponiveis}
                  values={diasSemanaDisponiveisSelecionados}
                  label={"Dias da semana disponíveis"}
                  onChange={selecionarDiaSemanaDisponiveis}
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
          <h2>Professores</h2>
          <div className="page-main-title-actions">
            {
              validarPermissao(OPERADOR_ENUM.MENOR, 2) &&
              <BotaoPadrao label={"Associar"} onClick={() => abrirModalAssociar()} />
            }
            <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
          </div>
        </div>
        <div className="grid-content">
          <LoadingContent
            carregandoInformacoes={carregandoInformacoesPagina}
            isModal={false}
            circleOn={true}
          />
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
                      <ToggleOff
                        className="toggleOff" titleAccess="Inativado"
                      />
                    }
                    onClick={() =>
                      alterarStatusProfessor(professor.id, professor.nome, true)
                    }
                  />
                ) : (
                  <CardPadraoActionItem
                    icon={<ToggleOn className="toggleOn" titleAccess="Ativado" color="primary" />}
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
        {
          professores.length > 0 &&
          <div>
            <Stack spacing={2}>
              <Pagination
                count={paginacaoResponse?.totalPaginas}
                variant="outlined"
                shape="rounded"
                page={paginaAtual}
                onChange={trocarPagina}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    minWidth: '40px',
                    minHeight: '38px',
                  },
                }}
              />
            </Stack>
          </div>
        }
      </main>
    </>
  );
};

export default Professor;
