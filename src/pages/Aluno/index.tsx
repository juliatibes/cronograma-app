import { FC, useEffect, useState } from "react";
import faseNaoSelecionada from "../../assets/fase-nao-selecionada.gif";
import "./index.css";
import { AccountBalance, VisibilityOutlined, EditNote, AutoStories, AlternateEmail, RemoveCircleOutlineOutlined, UploadFile } from "@mui/icons-material";
import { AlertColor, Divider, Stack, Pagination, Autocomplete, Box, FormControl, Modal, TextField, Typography, Dialog, DialogContent, DialogTitle, Button, IconButton, InputAdornment } from "@mui/material";
import { apiDelete, apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICursoPorUsuario } from "../../types/curso";
import { IFase } from "../../types/fase";
import { IPaginacao, IPaginacaoResponse } from "../../types/paginacao";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { IAluno, IAlunoRequest } from "../../types/aluno";
import { aplicarMascaraCpf } from "../../util/mascaras";
import InputPadrao from "../../components/InputPadrao";
import MultiSelect from "../../components/MultiSelect";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import AlertaPadrao from "../../components/AlertaPadrao";


const Aluno: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregandoImportar, setCarregandoImportar] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);
  const [estadoModalImportar, setEstadoModalImportar] = useState(false);//importar

  const [alunoSelecionadoExclusao, setAlunoSelecionadoExclusao] = useState<IAluno>();

  const [exibir] = useState<number>(8);
  const [paginaInicial] = useState<number>(1);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [variosClicks, setVariosClicks] = useState<boolean>(false);
  const [paginacaoResponse, setPaginacaoResponse] = useState<IPaginacaoResponse>();

  const [cursosPorUsuario, setCursosPorUsuario] = useState<ICursoPorUsuario[]>([]);
  const [fasesPorCurso, setFasesPorCurso] = useState<IFase[]>([]);
  const [alunosPorCursoFase, setAlunosPorCursoFase] = useState<IAluno[]>([]);

  const [cursoIdSelecionado, setCursoIdSelecionado] = useState<number>();
  const [faseIdSelecionada, setFaseIdSelecionada] = useState<number>();

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cursoSelecionado, setCursoSelecionado] = useState<ICursoPorUsuario | null>();
  const [fasesSelecionadas, setFasesSelecionadas] = useState<IFase[]>([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoEmail, setValidarCampoEmail] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoCursoSelecionado, setValidarCampoCursoSelecionado] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoFasesSelecionadas, setValidarCampoFasesSelecionadas] = useState<IValidarCampos>(valorInicialValidarCampos);

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    setEstadoModal(false);
    setEstadoModalImportar(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const trocarPagina = (event: React.ChangeEvent<unknown>, page: number) => {
    if (variosClicks) {
      return;
    }

    setVariosClicks(true);

    setTimeout(() => {
      setVariosClicks(false);
      (
        faseIdSelecionada && cursoIdSelecionado &&
        carregarAlunosCursoFase(faseIdSelecionada, cursoIdSelecionado, false, page)
      )
    }, 300);

    setPaginaAtual(page);
  }

  const limparModal = () => {
    setId(undefined);
    setNome('')
    setCpf('');
    setEmail('');
    setFasesSelecionadas([]);
  }

  const limparErros = () => {
    setValidarCampoNome(valorInicialValidarCampos);
    setValidarCampoCpf(valorInicialValidarCampos);
    setValidarCampoEmail(valorInicialValidarCampos);
    setValidarCampoCursoSelecionado(valorInicialValidarCampos);
    setValidarCampoFasesSelecionadas(valorInicialValidarCampos);
  }

  const validarCampos = (): boolean => {
    let existeErro = false;

    if (!nome) {
      setValidarCampoNome(campoObrigatorio);
      existeErro = true;
    }

    if (!cpf) {
      setValidarCampoCpf(campoObrigatorio);
      existeErro = true;
    }

    if (!email) {
      setValidarCampoEmail(campoObrigatorio);
      existeErro = true;
    }

    if (!cursoSelecionado) {
      setValidarCampoCursoSelecionado(campoObrigatorio);
      existeErro = true;
    }

    if (fasesSelecionadas.length < 1) {
      setValidarCampoFasesSelecionadas(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const validarCamposImportar = (): boolean => {
    let existeErro = false;

    if (!cursoSelecionado) {
      setValidarCampoCursoSelecionado(campoObrigatorio);
      existeErro = true;
    }

    if (fasesSelecionadas.length < 1) {
      setValidarCampoFasesSelecionadas(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Nome") ||
      mensagem.includes("Cpf") ||
      mensagem.includes("E-mail") ||
      mensagem.includes("Curso") ||
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
      if (mensagem.includes("Cpf")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("E-mail")) {
        setValidarCampoEmail({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Curso")) {
        setValidarCampoCursoSelecionado({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Fase")) {
        setValidarCampoFasesSelecionadas({ existeErro: true, mensagem: mensagem });
      }
    }

  }

  const fecharModal = () => setEstadoModal(false);

  const fecharModalImportar = () => setEstadoModalImportar(false);

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false);

  const carregarAlunosCursoFase = async (faseId: number, cursoId: number, editavel: boolean, page?: number) => {
    page ?? setPaginaAtual(1);

    const paginacao: IPaginacao = {
      exibir: exibir,
      paginaAtual: page ?? paginaInicial
    }

    const response = await
      apiGet(`/aluno/carregar/curso/${cursoId}/fase/${faseId}`, paginacao);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setAlunosPorCursoFase(response.data.data);
      setPaginacaoResponse(response.data);
      setCursoIdSelecionado(cursoId);
      setFaseIdSelecionada(faseId);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const carregarCursoPorUsuario = async () => {

    const response = await apiGet('/curso/carregar/usuario');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setCursosPorUsuario(response.data);
      setCursoSelecionado(response.data[0]);
      carregarFasePorCurso(response.data[0].id);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const carregarFasePorCurso = async (cursoId: number) => {
    const response = await apiGet(`fase/carregar/ativo/curso/${cursoId}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setFasesPorCurso(response.data);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const carregarAlunoPorId = async (id: number) => {
    const response = await apiGet(`/aluno/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.OK) {
      const alunoEncontrado: IAluno = response.data;

      carregarFasePorCurso(alunoEncontrado.curso.id);

      setId(id);
      setNome(alunoEncontrado.nome)
      setCpf(alunoEncontrado.cpf);
      setEmail(alunoEncontrado.email);
      setCursoSelecionado(alunoEncontrado.curso);
      setFasesSelecionadas(alunoEncontrado.fases);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const selecionarFase = (fases: IFase[]) => {
    setFasesSelecionadas(fases);
  };

  const selecionarCurso = (cursosPorUsuario: ICursoPorUsuario | null) => {
    if (cursosPorUsuario) {
      setFasesSelecionadas([]);
      setCursoSelecionado(cursosPorUsuario);
      carregarFasePorCurso(cursosPorUsuario.id);
    } else {
      setCursoSelecionado(null);
      setFasesSelecionadas([]);
      setFasesPorCurso([]);
    }
  };

  const abrirModal = async (id?: number) => {
    limparModal();
    limparErros();

    carregarCursoPorUsuario();

    if (id) {
      carregarAlunoPorId(id);
    }

    setEstadoModal(true);
  }

  const abrirModalImportar = async () => {
    limparModal();
    limparErros();
    carregarCursoPorUsuario();
    setEstadoModalImportar(true);
  }

  const salvar = async () => {
    limparErros();
    if (validarCampos()) return;

    setCarregando(true);
    const alunoRequest: IAlunoRequest = {
      nome: nome,
      cpf: cpf,
      email: email,
      cursoId: cursoSelecionado ? cursoSelecionado?.id : 0,
      faseIds: fasesSelecionadas.map(fase => fase.id)
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/aluno/editar/${id}`, alunoRequest);
    } else {
      response = await apiPost(`/aluno/criar`, alunoRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Aluno criado com sucesso!`], "success");
      carregarAlunosCursoFase(
        alunoRequest.faseIds[0],
        alunoRequest.cursoId,
        false,
        paginaAtual
      )
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Aluno editado com sucesso!`], "success");
      carregarAlunosCursoFase(
        alunoRequest.faseIds[0],
        alunoRequest.cursoId,
        false,
        paginaAtual
      )
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

  const importar = async () => {
    limparErros();
    if (validarCamposImportar()) return;

    setCarregandoImportar(true);
    const alunoRequest: IAlunoRequest = {
      nome: nome,
      cpf: cpf,
      email: email,
      cursoId: cursoSelecionado ? cursoSelecionado?.id : 0,
      faseIds: fasesSelecionadas.map(fase => fase.id)
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/aluno/editar/${id}`, alunoRequest);
    } else {
      response = await apiPost(`/aluno/criar`, alunoRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Aluno criado com sucesso!`], "success");
      carregarAlunosCursoFase(
        alunoRequest.faseIds[0],
        alunoRequest.cursoId,
        false,
        paginaAtual
      )
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirErros(mensagens);
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }

    setCarregandoImportar(false);
  }

  const excluirAluno = async () => {
    const response = await apiDelete(`/aluno/excluir/${alunoSelecionadoExclusao?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = '/login';
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${alunoSelecionadoExclusao?.nome} excluído com sucesso!`], "success");

      faseIdSelecionada && cursoIdSelecionado &&
        carregarAlunosCursoFase(faseIdSelecionada, cursoIdSelecionado, false, paginaAtual)
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

  const visualizar = async (id: number) => {
    limparModal();
    carregarAlunoPorId(id);
    setEstadoModalVisualizar(true);
  }

  const fecharModalExclusao = () => setExibirModalExclusao(false);

  const abrirModalExclusao = () => setExibirModalExclusao(true);

  const confirmar = () => {
    excluirAluno();
    fecharModalExclusao();
  };

  const cancelar = () => {
    fecharModalExclusao();
  };

  useEffect(() => {
    carregarCursoPorUsuario();
  }, [])

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

    <Dialog
      open={estadoModalVisualizar}
      onClose={fecharModalVisualizar}
      fullWidth
      maxWidth="sm"
      sx={{ borderRadius: 4, padding: 2 }}
      PaperProps={{
        sx: {
          outline: '2px solid var(--dark-blue-senac)',
        }
      }}
    >
      <DialogTitle fontSize='1.6rem' sx={{ textAlign: 'center', fontWeight: 'bolder' }}>
        {nome}
      </DialogTitle>
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
                  E-mail:
                </Typography>
                <Typography component="dd">
                  {email}
                </Typography>
              </Typography>

              <Typography className="info-modal-visualizar-linha" component="div">
                <Typography component="dt">
                  Curso:
                </Typography>
                <Typography component="dd">
                  {cursoSelecionado?.sigla}
                </Typography>
              </Typography>
              <Typography className="info-modal-visualizar-linha" component="div">
                <Typography component="dt">
                  Fase:
                </Typography>
                <Typography component="dd">
                  {fasesSelecionadas.map((fase) => (fase.numero + "ª Fase")).join(', ')}
                </Typography>
              </Typography>
            </Box>
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>

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
          Deseja confirmar a exclusão do {alunoSelecionadoExclusao?.nome}?
        </Typography>

        <Box id="modal-excluir-actions">
          <Button variant="outlined" sx={{ fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder", border: "2px solid currentColor" }} onClick={cancelar}>
            Cancelar
          </Button>
          <Button variant="contained" sx={{ fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder" }} onClick={confirmar}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>

    <Modal open={estadoModal} onClose={fecharModal} className="modal">
      <Box className='modal-box'>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Aluno
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
                label={"CPF"}
                type={"text"}
                value={aplicarMascaraCpf(cpf)}
                onChange={(e) => {
                  if (e) {
                    setCpf(aplicarMascaraCpf(e.target.value))
                  }
                }}
                error={validarCampoCpf.existeErro}
                helperText={validarCampoCpf.mensagem}
              />
            </div>
            <div className="modal-two-form-group">
              < InputPadrao
                label={"E-mail"}
                type={"email"}
                value={email}
                onChange={(e) => {
                  if (e) {
                    setEmail(e.target.value)
                  }
                }}
                error={validarCampoEmail.existeErro}
                helperText={validarCampoEmail.mensagem}
              />
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  options={cursosPorUsuario}
                  getOptionLabel={(curso: ICursoPorUsuario) => curso.sigla}
                  value={cursoSelecionado}
                  onChange={(event, value) => { selecionarCurso(value) }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Curso"
                      error={validarCampoCursoSelecionado.existeErro}
                      helperText={validarCampoCursoSelecionado.mensagem}
                    />
                  }
                />
              </FormControl>
            </div>
            <div className="modal-one-form-group">
              <MultiSelect
                options={fasesPorCurso}
                values={fasesSelecionadas}
                label={"Fases"}
                onChange={selecionarFase}
                error={validarCampoFasesSelecionadas.existeErro}
                helperText={validarCampoFasesSelecionadas.mensagem}
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
    </Modal >

    <Modal open={estadoModalImportar} onClose={fecharModalImportar} className="modal">
      <Box className='modal-box'>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Aluno
        </Typography>
        <Typography
          id="modal-modal-description"
          component="div"
        >
          <div className="modal-content">
            <div className="modal-two-form-group">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <label htmlFor="file-upload">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    // error={error}
                    // helperText={(arquivoSelecionado ? arquivoSelecionado.name : "Arquivo CSV")}
                    placeholder="Arquivo CSV"
                    value={arquivoSelecionado ? arquivoSelecionado.name : ''}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    InputProps={{
                      startAdornment: (
                        <IconButton color="primary" component="span">
                          <UploadFile />
                        </IconButton>
                      ),
                      readOnly: true,
                    }}
                  />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setArquivoSelecionado(e.target.files[0]); // Captura o primeiro arquivo selecionado
                    }
                  }}
                />
              </Box>
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  options={cursosPorUsuario}
                  getOptionLabel={(curso: ICursoPorUsuario) => curso.sigla}
                  value={cursoSelecionado}
                  onChange={(event, value) => { selecionarCurso(value) }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Curso"
                      error={validarCampoCursoSelecionado.existeErro}
                      helperText={validarCampoCursoSelecionado.mensagem}
                    />
                  }
                />
              </FormControl>
            </div>
            <div className="modal-one-form-group">
              <MultiSelect
                options={fasesPorCurso}
                values={fasesSelecionadas}
                label={"Fases"}
                onChange={selecionarFase}
                error={validarCampoFasesSelecionadas.existeErro}
                helperText={validarCampoFasesSelecionadas.mensagem}
              />
            </div>
          </div>
          <div className="modal-footer">
            <BotaoPadrao
              label={"Importar"}
              carregando={carregandoImportar}
              onClick={importar}
            />

          </div>
        </Typography>
      </Box>
    </Modal >

    <main className="page-main">
      <div className="page-main-title" style={{ marginBottom: 0 }}>
        <h2>Alunos</h2>
        <div className="page-main-title-actions">
          <BotaoPadrao label={"Importar"} onClick={() => abrirModalImportar()} />
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
      </div>
      <Divider className="divider" />
      <div className="aluno-cursos">
        {
          cursosPorUsuario && cursosPorUsuario.length > 0 ?
            cursosPorUsuario.map((curso) => (
              <CursoFaseLista
                key={curso.id}
                curso={curso}
                editavel={false}
                onClickListItemText={carregarAlunosCursoFase}
                onClickRemoveCircleOutlineIcon={() => { }}
              />
            )) :
            <p className="cronograma-sem-curso">Não existe cursos cadastrados</p>
        }
      </div>
      <Divider className="divider" />
      {
        alunosPorCursoFase.length > 0 ?
          <div className="grid-content">
            {alunosPorCursoFase.map((aluno) => (
              <CardPadrao
                key={aluno.id}
                titulo={aluno.nome}
                body={[
                  <CardPadraoBodyItem
                    icon={<AlternateEmail titleAccess="E-mail" />}
                    label={aluno.email}
                  />,
                  <CardPadraoBodyItem
                    icon={<AccountBalance titleAccess="Curso" />}
                    label={aluno.curso.sigla}
                  />,
                  <CardPadraoBodyItem
                    icon={<AutoStories titleAccess="Fases" />}
                    label={aluno.fases.map((fase) => (fase.numero + "ª Fase")).join(', ')}
                  />,
                ]}
                actions={[
                  <CardPadraoActionItem
                    icon={<VisibilityOutlined titleAccess="Visualizar" />}
                    onClick={() => visualizar(aluno.id)}
                  />,
                  <CardPadraoActionItem
                    icon={<EditNote titleAccess="Editar" />}
                    onClick={() => abrirModal(aluno.id)}
                  />,
                  <CardPadraoActionItem
                    icon={<RemoveCircleOutlineOutlined titleAccess="Excluir" />}
                    onClick={() => {
                      setAlunoSelecionadoExclusao(aluno);
                      abrirModalExclusao();
                    }}
                  />,
                ]}
              />
            ))}
          </div> :
          <div key={new Date().getSeconds()} className="aluno-sem-fase-container">
            <div style={{ position: 'relative' }}>
              <p className="aluno-sem-fase-message" >
                {(!cursoIdSelecionado && !faseIdSelecionada) ?
                  "Nenhuma fase Selecionada" :
                  "Nenhum Aluno cadastrado até o momento"}
              </p>
              <img src={`${faseNaoSelecionada}?t=${new Date().getSeconds()}`} alt="sem fase selecionada" className="aluno-sem-fase-gif" />
            </div>
          </div>
      }

      {
        alunosPorCursoFase.length > 0 &&
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

};

export default Aluno;

