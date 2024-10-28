import { FC, useEffect, useState } from "react";
import "./index.css"; 
import { apiGet, apiPost, apiPut, IDataResponse, STATUS_CODE } from "../../api/RestClient";
import { AlertColor, Autocomplete, Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, Modal, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IFase, IFasesRequest } from "../../types/fase";
import { AccountBalance, People, AutoStories, VisibilityOutlined, EditNote, ToggleOffOutlined, ToggleOnOutlined } from "@mui/icons-material";
import BotaoPadrao from "../../components/BotaoPadrao";
import CardPadrao from "../../components/CardPadrao";
import CardPadraoActionItem from "../../components/CardPadraoActionItem";
import CardPadraoBodyItem from "../../components/CardPadraoBodyItem";
import InputPadrao from "../../components/InputPadrao";
import { STATUS_ENUM } from "../../types/statusEnum";
import { campoObrigatorio, IValidarCampos, valorInicialValidarCampos } from "../../util/validarCampos";
import AlertaPadrao from "../../components/AlertaPadrao";

const Fase: FC = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(false);

  const [estadoAlerta, setEstadoAlerta] = useState<boolean>(false);
  const [mensagensAlerta, setMensagensAlerta] = useState<string[]>([]);
  const [corAlerta, setCorAlerta] = useState<AlertColor>("success");

  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalVisualizar, setEstadoModalVisualizar] = useState(false);//exemplo visualizar

  const [fases, setFases] = useState<IFase[]>([]);

  const [id, setId] = useState<number>();
  const [numero, setNumero] = useState<number>();

  const [validarCampoNumero, setValidarCampoNumero] = useState<IValidarCampos>(valorInicialValidarCampos);//tratamento erro

  const exibirErros = (mensagens: string[]) => {//tratamento erro

    const existeErroEspecifico = mensagens.some(mensagem =>
      mensagem.includes("Numero")
    );

    if (!existeErroEspecifico) {
      exibirAlerta(mensagens, "error");
      return;
    }

    for (const mensagem of mensagens) {
      if (mensagem.includes("Numero")) {
        setValidarCampoNumero({ existeErro: true, mensagem: mensagem });
        continue;
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
    setValidarCampoNumero(valorInicialValidarCampos);
  }

  const limparModal = () => {
    setId(undefined);
    setNumero(undefined);
  }

  const validarCampos = (): boolean => {//tratamento erro
    let existeErro = false;

    if (!numero) {
      setValidarCampoNumero(campoObrigatorio);
      existeErro = true;
    }

    return existeErro;
  }

  const fecharModalVisualizar = () => setEstadoModalVisualizar(false);//exemplo visualizar

  const fecharModal = () => setEstadoModal(false);

  const carregarFase = async () => {
    const response = await apiGet('/fase/carregar');

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
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

  const carregarFasePorId = async (id: number) => {
    const response = await apiGet(`/fase/carregar/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
    }

    if (response.status === STATUS_CODE.OK) {
      const faseEncontrada: IFase = response.data;

      setId(id);
      setNumero(faseEncontrada.numero);
    }

    if (response.status === STATUS_CODE.BAD_REQUEST || response.status === STATUS_CODE.UNAUTHORIZED) {
      const mensagens = response.messages;
      exibirAlerta(mensagens, "error");//tratamento erro
    }

    if (response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      exibirAlerta(["Erro inesperado!"], "error");//tratamento erro
    }
  }

  const alterarStatusFase = async (id: number, numero: number, ativar: boolean) => {
    const response = await apiPut(`/fase/${ativar ? "ativar" : "inativar"}/${id}`);

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login");
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`${numero} ${ativar ? "ativado" : "inativado"} com sucesso!`], "success");
      carregarFase();
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
    const faseRequest: IFasesRequest = {
      id: id,
      numero: numero,
    }

    let response: IDataResponse | undefined = undefined;

    if (id) {
      response = await apiPut(`/fase/editar/${id}`, faseRequest);
    } else {
      response = await apiPost(`/fase/criar`, faseRequest);
    }

    if (response.status === STATUS_CODE.FORBIDDEN) {
      navigate("/login")
    }

    if (response.status === STATUS_CODE.CREATED) {
      exibirAlerta([`Curso criado com sucesso!`], "success");
      carregarFase();
    }

    if (response.status === STATUS_CODE.NO_CONTENT) {
      exibirAlerta([`Curso editado com sucesso!`], "success");
      carregarFase();
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

    if (id) {
      carregarFasePorId(id);
    }

    setEstadoModal(true);
  }

  useEffect(() => {
    carregarFase();
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
      {numero + 'ª Fase'}
    </DialogTitle>
    <Divider />
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 2 , margin:"0px 0px 8px 0px"}}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Fase:
          </Typography>
          <Typography variant="body1">{numero + 'ª'}</Typography>
        </Box>

      </Stack>
    </DialogContent>
  </Dialog>

  <Modal open={estadoModal} onClose={fecharModal} className="modal">
    <Box className='modal-box'>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Fase
      </Typography>
      <Typography
        id="modal-modal-description"
        component="div"
      >
        <div className="modal-content">
          <div className="modal-two-form-group">
            < InputPadrao
              label={"Numero"}
              type={"number"}
              value={undefined}
              onChange={(e) => {
                if (e) {
                  setNumero(e.target.value)
                }
              }}
              error={validarCampoNumero.existeErro}//tratamento erro
              helperText={validarCampoNumero.mensagem}//tratamento erro
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
      <h2>Curso</h2>
      <BotaoPadrao label={"Adicionar"} onClick={() => abrirModal()} />
    </div>
    <div className="grid-content">
      {fases.map((fase) => (
        <CardPadrao
          key={fase.id}
          statusEnum={fase.statusEnum}
          titulo={fase.numero.toString() + "ª Fase"}
          body={[
            <CardPadraoBodyItem icon={<AutoStories titleAccess="Fase" />} label={fase.numero.toString() + 'ª'} />,
          ]}
          actions={[
            (
              fase.statusEnum === STATUS_ENUM.ATIVO ?
              (<CardPadraoActionItem icon={<EditNote titleAccess="Editar" />} onClick={() => abrirModal(fase.id)} />) :
              <></>
            ),
            (
              fase.statusEnum === STATUS_ENUM.INATIVO ?
              (
              <CardPadraoActionItem 
                icon={<ToggleOffOutlined titleAccess="Inativado" color="error" />} 
                onClick={() => alterarStatusFase(fase.id, fase.numero, true)} 
                />
              ) :
              (
              <CardPadraoActionItem 
              icon={<ToggleOnOutlined titleAccess="Ativado" />} 
              onClick={() => alterarStatusFase(fase.id, fase.numero, false)} 
              />
            )
            ),
          ]}
        />
      ))}
    </div>
  </main>
</>
};

export default Fase;
function limparErros() {
  throw new Error("Function not implemented.");
}

