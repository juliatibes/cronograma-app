import { FC, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import { useNavigate } from "react-router-dom";
import CardPadrao from "../../components/CardPadrao";
import { AccountBalance, People, EditNote, ToggleOffOutlined, ToggleOnOutlined, AutoStories, VisibilityOutlined } from "@mui/icons-material";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import { apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { ICurso, ICursoRequest } from "../../types/curso";
import { STATUS_ENUM } from "../../types/statusEnum";
import { AlertColor, Autocomplete, Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, Modal, Stack, TextField, Typography } from "@mui/material";
import AlertPadrao from "../../components/AlertaPadrao";
import InputPadrao from "../../components/InputPadrao";
import { IFase } from "../../types/fase";
import { ICoordenador } from "../../types/coordenador";
import MultiSelect from "../../components/MultiSelect";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";

const Curso: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);//exemplo visualizar

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [fases, setFases] = useState<IFase[]>([]);
  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>('');
  const [sigla, setSigla] = useState<string>('');
  const [fasesSelecionadas, setFasesSelecionadas] = useState<IFase[]>([]);
  const [coordenadorSelecionado, setCoordenadorSelecionado] = useState<ICoordenador | null>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro
  const [validarCampoSigla, setValidarCampoSigla] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro
  const [validarCampoFase, setValidarCampoFase] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro

  const exibirErros = (mensagens: string[]) => {//tratamento erro

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

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {//tratamento erro
    setEstadoAlerta(false);
    setEstadoModal(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const limparErros = () => {//tratamento erro
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

  const validarCampos = (): boolean => {//tratamento erro
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

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false);//exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarCurso = async () => {
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
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
    }
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
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
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
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
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
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
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
      exibirErros(mensagens);//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
    }
  }

  const salvar = async () => {
    limparErros();//tratamento erro
    if (validarCampos()) return;//tratamento erro

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
      exibirErros(mensagens);//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
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
    limparModal();
    limparErros();//tratamento erro

    carregarFase();
    carregarCoordenador();

    if (id) {
      carregarCursoPorId(id);
    }

    setEstadoModal(true);
  }

  const visualizar = async (id: number) => {//exemplo visualizar
    limparModal();
    carregarCursoPorId(id);
    setEstadoModalVisualizar(true);
  }

  useEffect(() => {
    carregarCurso();
  }, []);

  return <>
    {/*//exemplo visualizar */}
    <Dialog
      open={estadoModalVisualizar}
      onClose={fecharModalVisualizar}
      fullWidth
      maxWidth="sm"
      sx={{ borderRadius: 4, padding: 2}}
      PaperProps={{
        sx: {
          outline: '2px solid var(--dark-blue-senac)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {sigla}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 , margin:"0px 0px 8px 0px"}}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Nome:
            </Typography>
            <Typography variant="body1">{nome}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Coordenador:
            </Typography>
            <Typography variant="body1">{coordenadorSelecionado?.nome ? coordenadorSelecionado.nome : "Contratando..."}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Fases:
            </Typography>
            <Typography variant="body1">
              {fasesSelecionadas.map((fase) => (fase.numero + "ª Fase")).join(', ')}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>

    <Modal open={estadoModal} onClose={fecharModal} className="modal">
      <Box className='modal-box'>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Curso
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
                error={validarCampoNome.existeErro}//tratamento erro
                helperText={validarCampoNome.mensagem}//tratamento erro
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
                error={validarCampoSigla.existeErro}//tratamento erro
                helperText={validarCampoSigla.mensagem}//tratamento erro
              />
            </div>
            <div className="modal-one-form-group">
              <MultiSelect
                options={fases}
                values={fasesSelecionadas}
                label={"Fases"}
                onChange={selecionarFase}
                error={validarCampoFase.existeErro}//tratamento erro
                helperText={validarCampoFase.mensagem}//tratamento erro
              />
            </div>
            <div className="modal-one-form-group">
              <FormControl fullWidth>
                <Autocomplete
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
              <CardPadraoActionItem //exemplo visualizar
                icon={<VisibilityOutlined titleAccess="Visualizar" />} 
                onClick={() => visualizar(curso.id)} 
              />,
              (
                curso.statusEnum === STATUS_ENUM.ATIVO ?
                (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => abrirModal(curso.id)} />) :
                <></>
              ),
              (
                curso.statusEnum === STATUS_ENUM.INATIVO ?
                (<CardPadraoActionItem icon={<ToggleOffOutlined titleAccess="Inativado" color="error" />} onClick={() => alterarStatusCurso(curso.id, curso.nome, true)} />) :
                (<CardPadraoActionItem icon={<ToggleOnOutlined titleAccess="Ativado" />} onClick={() => alterarStatusCurso(curso.id, curso.nome, false)} />)
              ),
            ]}
          />
        ))}
      </div>
    </main>
  </>
};

export default Curso;
