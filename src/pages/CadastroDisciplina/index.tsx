import { FC, useEffect, useState } from "react";
import BotaoPadrao from "../../components/BotaoPadrao";
import SideMenu from "../../components/SideMenu";
import "./index.css";
import {
  Autocomplete,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

const CadastroDisciplina: FC = () => {
  const [nome, setNome] = useState<string>("");
  const [cargaHoraria, setCargaHoraria] = useState<number>();
  const [cargaHorariaDiaria, setCargaHorariaDiaria] = useState<number>();
  const [corHexadecimal, setCorHexadecimal] = useState<string>("");
  const [extensaoBooleanEnum, setExtensaoBooleanEnum] = useState<"SIM" | "NAO">(
    "NAO"
  );
  const [cursoId, setCursoId] = useState<number>();
  const [faseId, setFaseId] = useState<number>();
  const [professorId, setProfessorId] = useState<number>();
  const [opcoesCurso, setOpcoesCurso] = useState<
    { label: string; id: number }[]
  >([]);
  const [opcoesFase, setOpcoesFase] = useState<{ label: string; id: number }[]>(
    []
  );
  const [opcoesProfessor, setOpcoesProfessor] = useState<
    { label: string; id: number }[]
  >([]);

  useEffect(() => {}, []);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorHexadecimal(event.target.value);
  };

  return (
    <main>
      <SideMenu />
      <div className="cadastro-disciplina">
        <h2>Disciplina - Adicionar</h2>
        <div className="cadastro-disciplina-nome">
          <TextField
            label={"Nome"}
            size="small"
            value={nome}
            onChange={(event) => {
              if (event) {
                setNome(event.target.value);
              }
            }}
            required
          />
        </div>
        <div className="cadastro-disciplina-metade">
          <TextField
            label={"Carga horária total"}
            type={"number"}
            fullWidth={true}
            size="small"
            onChange={(event) => {
              if (event) {
                setCargaHoraria(parseInt(event.target.value));
              }
            }}
            required
          />
          <TextField
            label={"Carga horária/dia"}
            type={"number"}
            fullWidth={true}
            size="small"
            onChange={(event) => {
              if (event) {
                setCargaHorariaDiaria(parseInt(event.target.value));
              }
            }}
            required
          />
        </div>
        <div className="cadastro-disciplina-metade">
          <TextField
            label={"Cor da disciplina"}
            type={"color"}
            sx={{ width: 620 }}
            value={corHexadecimal} // Controla o valor atual da cor
            onChange={handleColorChange} // Atualiza o valor da cor no estado
            size="small"
          />
          <div className="radio-inputs">
            <FormGroup>
              <FormLabel>Extensão?</FormLabel>
              <RadioGroup row name="row-radio-extensao-group">
                <FormControlLabel
                  value="sim"
                  control={<Radio color="warning" size="small" />}
                  label="Sim"
                />
                <FormControlLabel
                  value="nao"
                  control={<Radio color="warning" size="small" />}
                  label="Não"
                />
              </RadioGroup>
            </FormGroup>
          </div>
        </div>
        <div className="cadastro-disciplina-metade">
          <Autocomplete
            disablePortal
            options={opcoesCurso}
            sx={{ width: 620 }}
            renderInput={(params) => (
              <TextField {...params} label="Curso" size="small" required />
            )}
          />
          <Autocomplete
            disablePortal
            options={opcoesFase}
            sx={{ width: 620 }}
            renderInput={(params) => (
              <TextField {...params} label="Fase" size="small" required />
            )}
          />
        </div>
        <div className="cadastro-disciplina-nome">
          <Autocomplete
            disablePortal
            options={opcoesProfessor}
            sx={{ width: 1250 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Professor responsável"
                size="small"
              />
            )}
          />
        </div>
        <div className="botao-salvar">
          <BotaoPadrao label={"Salvar"} />
        </div>
      </div>
    </main>
  );
};

export default CadastroDisciplina;
