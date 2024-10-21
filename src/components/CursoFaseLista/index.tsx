import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import "./index.css";
import { FC, useState } from "react"
import { ICursoPorPeriodo } from "../../types/curso";

interface CursoFaseListaProperties {
  curso: ICursoPorPeriodo,
  editavel: boolean,
  onClickListItemText: (faseId: number, cursoId: number) => void,
  onClickRemoveCircleOutlineIcon: (cursoId: number) => void,
}


const CursoFaseLista: FC<CursoFaseListaProperties> = ({
  curso,
  editavel,
  onClickListItemText,
  onClickRemoveCircleOutlineIcon,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const onClickListaItem = (faseId: number, cursoId: number) => {
    handleClick();
    onClickListItemText(faseId, cursoId);
  }


  return (
    <List
      key={curso.id}
      className={`curso-fase-lista ${open ? "curso-fase-lista-open" : "curso-fase-lista-close"}`}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton sx={{ display: 'flex', gap: '4px' }} >
        <RemoveCircleOutlineIcon
          color="error"
          className={`curso-fase-icon ${!editavel && "curso-fase-hide"}`}
          onClick={() => { onClickRemoveCircleOutlineIcon(curso.id) }}
        />
        <ListItemText sx={{textAlign:'center'}} primary={curso.sigla} />
        <Rotate90DegreesCwIcon
          className={`curso-fase-icon ${open && "curso-fase-rotate"}`}
          onClick={handleClick}
        />
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        className="curso-fase-collapse"
      >
        <List component="div" disablePadding>
          {curso.fases.map((fase) => (
            <ListItemButton 
            key={fase.id} 
            className="curso-fase-lista-item" 
            onClick={() => { onClickListaItem(fase.id, curso.id) }}
            >
              <ListItemText primary={`${fase.numero}ª Fase`} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
}

export default CursoFaseLista;