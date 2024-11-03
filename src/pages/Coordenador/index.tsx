import { FC, useEffect, useState } from "react";
import "./index.css"; 
import { useNavigate } from "react-router-dom";
import { AlertColor, Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, Modal, Stack, TextField, Typography } from "@mui/material";
import { ICoordenador, ICoordenadorRequest } from "../../types/coordenador";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import { apiDelete, apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { AutoStories, EditNote, Person, RemoveCircleOutlineOutlined, Call, AlternateEmail } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import InputPadrao from "../../components/InputPadrao";
import AlertaPadrao from "../../components/AlertaPadrao";
import { aplicarMascaraCpf, aplicarMascaraTelefone } from "../../util/mascaras";

const Coordenador: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);//exemplo visualizar

  const [coordenadores, setCoordenadores] = useState<ICoordenador[]>([]);

  const [id, setId] = useState<number>();
  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [validarCampoNome, setValidarCampoNome] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro
  const [validarCampoTelefone, setValidarCampoTelefone] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro
  const [validarCampoCpf, setValidarCampoCpf] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro
  const [validarCampoEmail, setValidarCampoEmail] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro

  const [coordenadorExclusao, setCoordenadorExclusao] = useState<ICoordenador>();//excluir
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);

  const exibirErros = (mensagens: string[]) => {//tratamento erro

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Nome") ||
      mensagem.includes("Telefone") ||
      mensagem.includes("CPF") ||
      mensagem.includes("Email")
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
      }
      if (mensagem.includes("Email")) {
        setValidarCampoEmail({ existeErro: true, mensagem: mensagem });
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
    setValidarCampoTelefone(valorInicialValidarCampos);
    setValidarCampoCpf(valorInicialValidarCampos);
    setValidarCampoEmail(valorInicialValidarCampos);
  }

  const limparModal = () => {
    setId(undefined);
    setNome('');
    setTelefone('');
    setCpf('');
    setEmail('');
  }

  const validarCampos = (): boolean => {//tratamento erro
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

    return existeErro;
  }

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false);//exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarCoordenador = async () => {
    const response = await apiGet('/coordenador/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
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

  const carregarCoordenadorPorId = async (id: number) => {
    const response = await apiGet(`/coordenador/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
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
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
    }
  }

  const salvar = async () => {
    limparErros();//tratamento erro
    if (validarCampos()) return;//tratamento erro

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
      navigate("/login")
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
      exibirErros(mensagens);//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
    }

    setCarregando(false);
  }

  const abrirModal = async (id?: number) => {
    limparModal();
    limparErros();//tratamento erro

    carregarCoordenador();

    if (id) {
      carregarCoordenadorPorId(id);
    }

    setEstadoModal(true);
  }

  const excluirCoordenador = async () => {
    const response = await apiDelete(`/coordenador/excluir/${coordenadorExclusao?.id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
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
      exibirErros(mensagens); //tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error"); //tratamento erro
    }
  };

  const fecharModalExclusao = () => setExibirModalExclusao(false);//excluir

  const abrirModalExclusao = () =>  setExibirModalExclusao(true);//excluir

  const confirmar = () => {//excluir
    excluirCoordenador();
    fecharModalExclusao();
  };

  const cancelar = () => {//excluir
    fecharModalExclusao();
  };

  useEffect(() => {
    carregarCoordenador();
  }, []);

  return <>

{/* excluir */}
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
            Deseja confirmar a exclusão do {coordenadorExclusao?.nome}
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
      {nome}
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
            CPF:
          </Typography>
          <Typography variant="body1">{cpf}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Telefone:
          </Typography>
          <Typography variant="body1">{telefone}</Typography>
        </Box>

       
      </Stack>
    </DialogContent>
  </Dialog>

  <Modal open={estadoModal} onClose={fecharModal} className="modal">
    <Box className='modal-box'>
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
              error={validarCampoNome.existeErro}//tratamento erro
              helperText={validarCampoNome.mensagem}//tratamento erro
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
              error={validarCampoNome.existeErro}//tratamento erro
              helperText={validarCampoNome.mensagem}//tratamento erro
            />
          </div>
          <div className="modal-one-form-group">
          < InputPadrao
              type={"text"}
              label={"Nome"}
              value={nome}
              onChange={(e) => {
                if (e) {
                  setNome(e.target.value)
                }
              }}
              error={validarCampoNome.existeErro}//tratamento erro
              helperText={validarCampoNome.mensagem}//tratamento erro
            />
          </div>
          <div className="modal-one-form-group">
          < InputPadrao
              type={"text"}
              label={"E-mail"}
              value={email}
              onChange={(e) => {
                if (e) {
                  setEmail(e.target.value)
                }
              }}
              error={validarCampoNome.existeErro}//tratamento erro
              helperText={validarCampoNome.mensagem}//tratamento erro
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

  <AlertaPadrao
    key={estadoAlerta ? "show" : "close"} //componente tratamento erro
    estado={estadoAlerta}
    cor={corAlerta}
    mensagens={mensagensAlerta}
    onClose={() => {
      setEstadoAlerta(false);
    }}
  />

  <main className="page-main">
    <div style={{ display: 'flex' }}>
      <h2>Coordenador</h2>
      <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
    </div>
    <div className="grid-content">
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
                  icon={<RemoveCircleOutlineOutlined titleAccess="Excluir" />}
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
