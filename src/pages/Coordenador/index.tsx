import { FC, useEffect, useState } from "react";
import "./index.css";
import { AlertColor, Autocomplete, Box, Button,  FormControl,  Modal,  TextField, Typography } from "@mui/material";
import { ICoordenador, ICoordenadorRequest } from "../../types/coordenador";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { apiDelete, apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { EditNote, Person, RemoveCircleOutlineOutlined, Call, AlternateEmail } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import InputPadrao from "../../components/InputPadrao";
import AlertaPadrao from "../../components/AlertaPadrao";
import { aplicarMascaraCpf, aplicarMascaraTelefone } from "../../util/mascaras";
import { removerUsuario } from "../../store/UsuarioStore/usuarioStore";
import { IProfessor } from "../../types/professor";
import LoadingContent from "../../components/LoadingContent";

const Coordenador: FC = () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregandoAssociar, setCarregandoAssociar] = useState<boolean>(false);

  const [carregandoInformacoesPagina, setCarregandoInformacoesPagina] = useState<boolean>(true);
  const [carregandoInformacoesModal, setCarregandoInformacoesModal] = useState<boolean>(true);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalAssociar, setEstadoModalAssociar] = useState(false);

  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);
  const [professores, setProfessores] = useState<IProfessor[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [professorSelecionado, setProfessorSelecionado] = useState<IProfessor | null>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoTelefone, setValidarCampoTelefone] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoEmail, setValidarCampoEmail] = useState<IValidarCampos>(valorInicialValidarCampos);
  const [validarCampoProfessorSelecionado, setValidarCampoProfessorSelecionado] =
    useState<IValidarCampos>(valorInicialValidarCampos);

  const [coordenadorExclusao, setCoordenadorExclusao] = useState<ICoordenador>();
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);

  const exibirErros = (mensagens: string[]) => {

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Nome") ||
      mensagem.includes("Telefone") ||
      mensagem.includes("CPF") ||
      mensagem.includes("Email") ||
      mensagem.includes("Professor")
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
      if (mensagem.includes("CPF")) {
        setValidarCampoCpf({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Email")) {
        setValidarCampoEmail({ existeErro: true, mensagem: mensagem });
        continue;
      }
      if (mensagem.includes("Professor")) {
        setValidarCampoProfessorSelecionado({ existeErro: true, mensagem: mensagem });

      }
    }

  }

  const exibirAlerta = (mensagens: string[], cor: AlertColor) => {
    setEstadoAlerta(false);
    setEstadoModal(false);
    setEstadoModalAssociar(false);

    setMensagensAlerta(mensagens);
    setCorAlerta(cor);
    setEstadoAlerta(true);
  }

  const limparErros = () => {
    setValidarCampoNome(valorInicialValidarCampos);
    setValidarCampoTelefone(valorInicialValidarCampos);
    setValidarCampoCpf(valorInicialValidarCampos);
    setValidarCampoEmail(valorInicialValidarCampos);
  }

  const limparErrosAssociar = () => {
    setValidarCampoProfessorSelecionado(valorInicialValidarCampos);
  };

  const limparModalAssociar = () => {
    setProfessorSelecionado(null);
  };

  const limparModal = () => {
    setId(undefined);
    setNome('');
    setTelefone('');
    setCpf('');
    setEmail('');
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
    } else if (cpf.length < 11) {
      setValidarCampoCpf({ existeErro: true, mensagem: "CPF invalido" });
      existeErro = true;
    }

    if (!telefone) {
      setValidarCampoTelefone(campoObrigatorio);
      existeErro = true;
    } else if (telefone.length < 11) {
      setValidarCampoTelefone({ existeErro: true, mensagem: "Telefone invalido" });
      existeErro = true;
    }

    if (!email) {
      setValidarCampoEmail(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const validarCamposAssociar = (): boolean => {
    let existeErro = false;

    if (!professorSelecionado) {
      setValidarCampoProfessorSelecionado(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  };

  const fecharModal = () => setEstadoModal(false);

  const fecharModalAssociar = () => setEstadoModalAssociar(false);

  const fecharModalExclusao = () => setExibirModalExclusao(false);

  const selecionarProfessor = (professor: IProfessor | null) => {
    if (professor) {
      setProfessorSelecionado(professor);
    } else {
      setProfessorSelecionado(null);
    }
  };

  const carregarCoordenador = async () => {
    setCarregandoInformacoesPagina(true);
    const response = await apiGet('/coordenador/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
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
    setCarregandoInformacoesPagina(false);
  }

  const carregarCoordenadorPorId = async (id: number) => {
    const response = await apiGet(`/coordenador/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      const coordenadorEncontrado: ICoordenador = response.data;

      setId(id);
      setNome(coordenadorEncontrado.nome);
      setEmail(coordenadorEncontrado.email);
      setTelefone(coordenadorEncontrado.telefone);
      setCpf(coordenadorEncontrado.cpf);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const carregarProfessor = async () => {
    const response = await apiGet(`professor/carregar/ativo`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.OK) {
      setProfessores(response.data);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");
    }
  }

  const salvar = async () => {
    limparErros();
    if (validarCampos()) return;

    setCarregando(true);
    const coordenadorRequest: ICoordenadorRequest = {
      id: id,
      nome: nome,
      cpf: cpf,
      email: email,
      telefone: telefone
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/coordenador/editar/${id}`, coordenadorRequest);
    } else {
      response = await apiPost(`/coordenador/criar`, coordenadorRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Coordenador criado com sucesso!`], "success");
      carregarCoordenador();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Coordenador editado com sucesso!`], "success");
      carregarCoordenador();
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

  const associar = async () => {
    limparErrosAssociar();
    if (validarCamposAssociar()) return;
    setCarregandoAssociar(true);

    const response = await apiPost(`coordenador/associar/professor/${professorSelecionado?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta(["Professor associado com sucesso!"], "success");
      carregarCoordenador();
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

    if (id) {
      await carregarCoordenadorPorId(id);
    }

    setCarregandoInformacoesModal(false);
  }

  const abrirModalAssociar = async (id?: number) => {
    setCarregandoInformacoesModal(true);
    setEstadoModalAssociar(true);
    limparModalAssociar();
    limparErrosAssociar();

    await carregarProfessor();

    setCarregandoInformacoesModal(false);
  };

  const abrirModalExclusao = () => setExibirModalExclusao(true);

  const excluirCoordenador = async () => {
    const response = await apiDelete(`/coordenador/excluir/${coordenadorExclusao?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      removerUsuario();
      window.location.href = "/login";;
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${coordenadorExclusao?.nome} excluído com sucesso!`], "success");
      carregarCoordenador();
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

  const confirmar = () => {
    excluirCoordenador();
    fecharModalExclusao();
  };

  const cancelar = () => {
    fecharModalExclusao();
  };

  useEffect(() => {
    carregarCoordenador();
  }, []);

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

    <Modal open={estadoModalAssociar} onClose={fecharModalAssociar} className="modal">
      <Box className="modal-box" sx={{ maxWidth: "400px"}}>
        <LoadingContent 
          carregandoInformacoes={carregandoInformacoesModal} 
          isModal={true} 
          circleOn={true} 
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Associar professor
        </Typography>
        <Typography id="modal-modal-description" component="div">
          <div className="modal-content">
            <div className="modal-one-form-group">
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  options={professores}
                  getOptionLabel={(professor: IProfessor) =>
                    professor.nome
                  }
                  value={professorSelecionado}
                  onChange={(event, value) => selecionarProfessor(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params} label="Professor"
                      error={validarCampoProfessorSelecionado.existeErro}
                      helperText={validarCampoProfessorSelecionado.mensagem}
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
    </Modal >

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
          Deseja confirmar a exclusão de {coordenadorExclusao?.nome}
        </Typography>

        <Box id="modal-excluir-actions">
          <Button variant="outlined" sx={{ color: "#464646", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder", border: "2px solid #464646" }} onClick={cancelar}>
            Cancelar
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#c73636", color: "#e7d8d8", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bolder" }} onClick={confirmar}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>

    <Modal open={estadoModal} onClose={fecharModal} className="modal">
      <Box className='modal-box'>
        <LoadingContent 
          carregandoInformacoes={carregandoInformacoesModal} 
          isModal={true} 
          circleOn={true}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Coordenador
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
                error={validarCampoCpf.existeErro}
                helperText={validarCampoCpf.mensagem}
              />

              < InputPadrao
                type={"text"}
                label={"Nome"}
                value={nome}
                onChange={(e) => {
                  if (e) {
                    setNome(e.target.value)
                  }
                }}
                error={validarCampoNome.existeErro}
                helperText={validarCampoNome.mensagem}
              />
            </div>
            <div className="modal-two-form-group">
              < InputPadrao
                type={"email"}
                label={"E-mail"}
                value={email}
                onChange={(e) => {
                  if (e) {
                    setEmail(e.target.value)
                  }
                }}
                error={validarCampoEmail.existeErro}
                helperText={validarCampoEmail.mensagem}
              />
              < InputPadrao
                type={"text"}
                label={"Telefone"}
                value={aplicarMascaraTelefone(telefone)}
                onChange={(e) => {
                  if (e) {
                    setTelefone(aplicarMascaraTelefone(e.target.value))
                  }
                }}
                error={validarCampoTelefone.existeErro}
                helperText={validarCampoTelefone.mensagem}
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

    <main className="page-main">
      <div className="page-main-title">
        <h2>Coordenadores</h2>
        <div className="page-main-title-actions">
          <BotaoPadrao label={"Associar"} onClick={() => abrirModalAssociar()} />
          <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
        </div>
      </div>
      <div className="grid-content">
        <LoadingContent 
          carregandoInformacoes={carregandoInformacoesPagina}
          isModal={false} 
          circleOn={true}
        />
        {coordenadores.map((coordenador) => (
          <CardPadrao
            key={coordenador.id}
            titulo={coordenador.nome}
            body={[
              <CardPadraoBodyItem icon={<Person titleAccess="CPF" />} label={aplicarMascaraCpf(coordenador.cpf)} />,
              <CardPadraoBodyItem icon={<Call titleAccess="Telefone" />} label={aplicarMascaraTelefone(coordenador.telefone)} />,
              <CardPadraoBodyItem icon={<AlternateEmail titleAccess="E-mail" />} label={coordenador.email} />,
            ]}
            actions={[
              (
                (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => abrirModal(coordenador.id)} />)
              ),
              <CardPadraoActionItem
                icon={<RemoveCircleOutlineOutlined sx={{ color: "#c73636" }} titleAccess="Excluir" />}
                onClick={() => {
                  setCoordenadorExclusao(coordenador);
                  abrirModalExclusao();
                }}
              />,
            ]}
          />
        ))}
      </div>
    </main>
  </>

};

export default Coordenador;
