import { FC, useEffect, useState } from "react";
import InputPadrao from "../../components/InputPadrao";
import "./index.css";
import "../../styles/modal.css";
import SideMenu from "../../components/SideMenu";
import BotaoPadrao from "../../components/BotaoPadrao";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { IPeriodoCadastro } from "./types";

interface PeriodoProperties {}

const CadastroPeriodo: FC<PeriodoProperties> = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  // const [open, setOpen] = useState(false);
  // const [viewButton, setViewButton] = useState(false);

  // const editar = (id) => {
  //     setOpen(true)
  //     viewButton(true)
  // }

  // const visu = (id) => {
  //   setOpen(true)
  //   viewButton(false)
  // }

  // const criar = () => {
  //   setOpen(true)
  //   viewButton(true)
  // }

  const [nome, setNome] = useState<string>("");
  const [dataInicial, setDataInicial] = useState<Dayjs>(
    dayjs().locale("pt-br")
  );
  const [dataFinal, setDataFinal] = useState<Dayjs>(dayjs().locale("pt-br"));

  const salvarPeriodo = async () => {
    const periodo: IPeriodoCadastro = {
      nome,
      dataInicial: new Date(dataInicial.format("YYYY-MM-DD")), // Formatar a data inicial
      dataFinal: new Date(dataFinal.format("YYYY-MM-DD")), // Formatar a data final
    };
  };

  useEffect(() => {
    dayjs.locale("pt-br"); // Configura o locale para Day.js
  }, []);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <main style={{ width: "100%" }}>
        <SideMenu/>
        <div>
        <Button variant="contained" color="success" onClick={handleOpen}>Abrir modal</Button>
          <Modal open={open} onClose={handleClose} className="modal">
            <Box className='modal-box'>

              <Typography id="modal-modal-title" variant="h6" component="h2">
                Período
              </Typography>
              <Typography 
              id="modal-modal-description" 
              component="div"
              >
                
                <div className="cadastro-periodo">
                  <div className="cadastro-periodo-nome">
                    <TextField
                      label={"Nome do período"}
                      fullWidth
                      type={"text"}
                      value={nome}
                      onChange={(event) => {
                        if (event) {
                          setNome(event.target.value);
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="cadastro-periodo-data">
                    <DatePicker
                      label="Data inicial"
                      format="DD/MM/YYYY"
                      className="date-picker"
                      value={dataInicial}
                      onChange={(date) => {
                        if (date) {
                          setDataInicial(date);
                        }
                      }}
                    />
                    <DatePicker
                      label="Data final"
                      format="DD/MM/YYYY"
                      className="date-picker"
                      value={dataFinal}
                      onChange={(date) => {
                        if (date) {
                          setDataFinal(date);
                        }
                      }}
                    />
                  </div>
                  <div className="modal-footer">
                  <BotaoPadrao 
                  label={"Salvar"} 
                  onClick={salvarPeriodo}
                  />

                  </div>
                </div>
              </Typography>

            </Box>
          </Modal>
        </div>
         
        </main>
      </LocalizationProvider>
    </>
  );
};

export default CadastroPeriodo;
