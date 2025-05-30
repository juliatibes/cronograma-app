import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import "./index.css";
import { FC, useState } from "react"
import { ICursoPorPeriodo, ICursoPorUsuario } from "../../types/curso";
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { AccountBalance } from "@mui/icons-material";
interface CursoFaseListaProperties {
  curso: ICursoPorPeriodo | ICursoPorUsuario,
  editavel: boolean,
  onClickListItemText: (faseId: number, cursoId: number, editavel:boolean) => void,
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
    onClickListItemText(faseId, cursoId, editavel);
  }


  return (
    <List
      key={curso.id}
      onClick={
        (e) => {
          const target = e.target as HTMLElement;
          ((target.localName !== "path" && target.localName !== "svg")  && handleClick());
        }
      }
      className={`curso-fase-lista ${open ? "curso-fase-lista-open" : "curso-fase-lista-close"}`}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton sx={{ display: 'flex', gap: '10px' }} >
        {
          editavel ?
          <PlaylistRemoveIcon
          className={`curso-fase-icon-delete`}
          onClick={() => { onClickRemoveCircleOutlineIcon(curso.id)}}
          /> :
          <AccountBalance/>
        }
        
        <ListItemText sx={{textAlign:'center'}} primary={curso.sigla} />
        <Rotate90DegreesCwIcon
          className={`curso-fase-icon-drop ${open && "curso-fase-rotate"}`}
          onClick={handleClick}
        />
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        className="curso-fase-collapse"
      >
        <List component="div" disablePadding style={{minHeight:'42px'}}>
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