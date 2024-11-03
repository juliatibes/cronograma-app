import { ChangeEvent, FC, useEffect, useState } from "react";
import faseNaoSelecionada from "../../assets/fase-nao-selecionada.gif";
import "./index.css";
import { AccessTimeRounded, AccountBalance, School, VisibilityOutlined, EditNote, AutoStories, AlternateEmail } from "@mui/icons-material";
import { AlertColor, Divider, Stack, Pagination, Autocomplete, Box, FormControl, Modal, TextField, Typography } from "@mui/material";
import { apiGet, STATUS_CODE } from "../../api/RestClient";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import CursoFaseLista from "../../components/CursoFaseLista";
import { ICursoPorUsuario } from "../../types/curso";
import { IFase } from "../../types/fase";
import { IPaginacao, IPaginacaoResponse } from "../../types/paginacao";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { IAluno } from "../../types/aluno";
import { aplicarMascaraCpf } from "../../util/mascaras";
import InputPadrao from "../../components/InputPadrao";
import MultiSelect from "../../components/MultiSelect";


const Aluno: FC = () => {
  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);

  const [exibir] = useState<number>(6);
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

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    // setEstadoModal(false);

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

  const fecharModal = () => setEstadoModal(false);

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
      // setCursoSelecionado(response.data[0]);
      // carregarFasePorCurso(response.data[0].id);
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
    // limparModal();
    // limparErros();

    carregarCursoPorUsuario();

    // if (id) {
    //   carregarDisciplinaPorId(id);
    // }

    setEstadoModal(true);
  }

  useEffect(() => {
    carregarCursoPorUsuario();
  }, [])

  return <>
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
                label={"CPF"}
                type={"text"}
                value={aplicarMascaraCpf(cpf)}
                onChange={(e) => {
                  if (e) {
                    setCpf(aplicarMascaraCpf(e.target.value))
                  }
                }}
              // error={validarCampoCargaHoraria.existeErro}
              // helperText={validarCampoCargaHoraria.mensagem}
              />
                < InputPadrao
                label={"Nome"}
                type={"text"}
                value={nome}
                onChange={(e) => {
                  if (e) {
                    setNome(e.target.value)
                  }
                }}
              // error={validarCampoNome.existeErro}
              // helperText={validarCampoNome.mensagem}
              />
            </div>
            <div className="modal-two-form-group">
              < InputPadrao
                label={"E-mail"}
                type={"text"}
                value={email}
                onChange={(e) => {
                  if (e) {
                    setEmail(e.target.value)
                  }
                }}
              // error={validarCampoCargaHoraria.existeErro}
              // helperText={validarCampoCargaHoraria.mensagem}
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
                    // error={validarCampoCursoSelecionado.existeErro}
                    // helperText={validarCampoCursoSelecionado.mensagem}
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
              // error={validarCampoFase.existeErro}//tratamento erro
              // helperText={validarCampoFase.mensagem}//tratamento erro
              />
            </div>
          </div>
          <div className="modal-footer">
            <BotaoPadrao
              label={"Salvar"}
            // carregando={carregando}
            // onClick={salvar}
            />

          </div>
        </Typography>
      </Box>
    </Modal >

    <main className="page-main">
      <div className="page-main-title" style={{ marginBottom: 0 }}>
        <h2>Alunos</h2>
        <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
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
                    label={aluno.curso.nome}
                  />,
                  <CardPadraoBodyItem
                    icon={<AutoStories titleAccess="Fases" />}
                    label={aluno.fases.map((fase) => (fase.numero + "ª Fase")).join(', ')}
                  />,
                ]}
                actions={[
                  <CardPadraoActionItem
                    icon={<VisibilityOutlined titleAccess="Visualizar" />}
                    onClick={() => { }}
                  />,
                  <CardPadraoActionItem
                    icon={<EditNote titleAccess="Editar" />}
                    onClick={() => { }}
                  />
                ]}
              />
            ))}
          </div> :
          <div className="aluno-sem-fase-container">
            <div style={{ position: 'relative' }}>
              <p className="aluno-sem-fase-message" >Nenhuma fase Selecionada</p>
              <img src={faseNaoSelecionada} alt="sem fase selecionada" className="aluno-sem-fase-gif" />
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

