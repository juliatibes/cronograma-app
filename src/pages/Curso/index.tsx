import { FC, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import { AccountBalance, People, EditNote, AutoStories, ToggleOn, ToggleOff } from "@mui/icons-material";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import { apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { ICurso, ICursoRequest } from "../../types/curso";
import { STATUS_ENUM } from "../../types/enums/statusEnum";
import { AlertColor, Autocomplete, Box, FormControl, Modal, TextField, Typography } from "@mui/material";
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
import { IFase } from "../../types/fase";
import { ICoordenador } from "../../types/coordenador";
import MultiSelect from "../../components/MultiSelect";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import LoadingContent from "../../components/LoadingContent";

const Curso: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [fases, setFases] = useState<IFase[]>([]);
  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>('');
  const [sigla, setSigla] = useState<string>('');
  const [fasesSelecionadas, setFasesSelecionadas] = useState<IFase[]>([]);
  const [coordenadorSelecionado, setCoordenadorSelecionado] = useState<ICoordenador | null>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoSigla, setValidarCampoSigla] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoFase, setValidarCampoFase] = useState<IValidarCampos>(valorInicialValidarCampos);

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Nome") ||
      mensagem.includes("Sigla") ||
      mensagem.includes("Fase")
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
      if (mensagem.includes("Sigla")) {
        setValidarCampoSigla({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Fase")) {
        setValidarCampoFase({ existeErro: true, mensagem: mensagem });
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
    setValidarCampoNome(valorInicialValidarCampos);
    setValidarCampoSigla(valorInicialValidarCampos);
    setValidarCampoFase(valorInicialValidarCampos);
  }

  const limparModal = () => {
    setId(undefined);
    setNome('');
    setSigla('');
    setFasesSelecionadas([]);
    setCoordenadorSelecionado(null);
  }

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!nome) {
      setValidarCampoNome(campoObrigatorio);
      existeErro = true;
    }

    if (!sigla) {
      setValidarCampoSigla(campoObrigatorio);
      existeErro = true;
    } else if (sigla.length > 6) {
      setValidarCampoSigla({ existeErro: true, mensagem: "Máximo 6 caracteres" });
      existeErro = true;
    }

    if (fasesSelecionadas.length < 1) {
      setValidarCampoFase(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const fecharModal = () => setEstadoModal(false);

  const carregarCurso = async () => {
    setCarregandoInformacoesPagina(true);

    const response = await apiGet('/curso/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      setCursos(response.data);
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

  const carregarFase = async () => {
    const response = await apiGet('/fase/carregar/ativo');

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
  }

  const carregarCoordenador = async () => {
    const response = await apiGet('/coordenador/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      setCoordenadores(response.data);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const carregarCursoPorId = async (id: number) => {
    const response = await apiGet(`/curso/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      const cursoEncontrado: ICurso = response.data;

      setId(id);
      setNome(cursoEncontrado.nome);
      setSigla(cursoEncontrado.sigla);
      setFasesSelecionadas(cursoEncontrado.fases);
      setCoordenadorSelecionado(cursoEncontrado.coordenador);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const alterarStatusCurso = async (id: number, nome: string, ativar: boolean) => {
    const response = await apiPut(`/curso/${ativar ? "ativar" : "inativar"}/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${nome} ${ativar ? "ativado" : "inativado"} com sucesso!`], "success");
      carregarCurso();
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
    const cursoRequest: ICursoRequest = {
      id: id,
      nome: nome,
      sigla: sigla,
      coordenadorId: coordenadorSelecionado?.id,
      faseIds: fasesSelecionadas.map(fase => fase.id)
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/curso/editar/${id}`, cursoRequest);
    } else {
      response = await apiPost(`/curso/criar`, cursoRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Curso criado com sucesso!`], "success");
      carregarCurso();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Curso editado com sucesso!`], "success");
      carregarCurso();
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

  const selecionarFase = (fases: IFase[]) => {
    setFasesSelecionadas(fases);
  };

  const selecionarCoordenador = (coordenador: ICoordenador | null) => {
    if (coordenador) {
      setCoordenadorSelecionado(coordenador);
    } else {
      setCoordenadorSelecionado(null);
    }
  };

  const abrirModal = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModal(true);
    limparModal();
    limparErros();

    await carregarFase();
    await carregarCoordenador();

    if (id) {
      await carregarCursoPorId(id);
    }
    setCarregandoInformacoesModal(false);
  }

  useEffect(() => {
    carregarCurso();
  }, []);

  return <>

    <Modal open={estadoModal} onClose={fecharModal} className="modal">
      <Box className='modal-box'>
        <LoadingContent
          carregandoInformacoes={carregandoInformacoesModal}
          isModal={true}
          circleOn={true}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cursos
        </Typography>
        <Typography
          id="modal-modal-description"
          component="div"
        >
          <div className="modal-content">
            <div className="modal-two-form-group">
              < InputPadrao
                label={"Nome"}
                type={"text"}
                value={nome}
                onChange={(e) => {
                  if (e) {
                    setNome(e.target.value)
                  }
                }}
                error={validarCampoNome.existeErro}
                helperText={validarCampoNome.mensagem}
              />
              < InputPadrao
                type={"text"}
                width={"30%"}
                label={"Sigla"}
                value={sigla}
                onChange={(e) => {
                  if (e) {
                    setSigla(e.target.value)
                  }
                }}
                error={validarCampoSigla.existeErro}
                helperText={validarCampoSigla.mensagem}
              />
            </div>
            <div className="modal-one-form-group">
              <MultiSelect
                options={fases}
                values={fasesSelecionadas}
                label={"Fases"}
                onChange={selecionarFase}
                error={validarCampoFase.existeErro}
                helperText={validarCampoFase.mensagem}
              />
            </div>
            <div className="modal-one-form-group">
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  options={coordenadores}
                  getOptionLabel={(coordenador: ICoordenador) => coordenador.nome}
                  value={coordenadorSelecionado || null}
                  onChange={(event, value) => selecionarCoordenador(value)}
                  renderInput={(params) => <TextField {...params} label="Coordenador" />}
                />
              </FormControl>
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
      <div className="page-main-title">
        <h2>Cursos</h2>
        <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
      </div>
      <div className="grid-content">
        <LoadingContent
          carregandoInformacoes={carregandoInformacoesPagina}
          isModal={false}
          circleOn={true}
        />
        {cursos.map((curso) => (
          <CardPadrao
            key={curso.id}
            statusEnum={curso.statusEnum}
            titulo={curso.sigla}
            body={[
              <CardPadraoBodyItem icon={<AccountBalance titleAccess="Curso" />} label={curso.nome} />,
              <CardPadraoBodyItem icon={<People titleAccess="Coordenador" />} label={curso.coordenador ? curso.coordenador.nome : "Contratando..."} />,
              <CardPadraoBodyItem icon={<AutoStories titleAccess="Fases" />} label={curso.fases.map((fase) => (fase.numero + "ª Fase")).join(', ')} />,
            ]}
            actions={[
              (
                curso.statusEnum === STATUS_ENUM.ATIVO ?
                  (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => abrirModal(curso.id)} />) :
                  <></>
              ),
              (
                curso.statusEnum === STATUS_ENUM.INATIVO ?
                  (<CardPadraoActionItem
                    icon={<ToggleOff titleAccess="Inativado" className="toggleOff" />}
                    onClick={() => alterarStatusCurso(curso.id, curso.nome, true)} />
                  ) :
                  (<CardPadraoActionItem icon={<ToggleOn className="toggleOn" titleAccess="Ativado" color="primary" />} onClick={() => alterarStatusCurso(curso.id, curso.nome, false)} />)
              ),
            ]}
          />
        ))}
      </div>
    </main>
  </>
};

export default Curso;
