import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { FC, useState } from "react"

interface CursoFaseListaProperties {
    curso:string,
    fases:string,
    editavel:boolean,
    onClickListItemText: (faseId:number, cursoId:number) => void,
    onClickRemoveCircleOutlineIcon: () => void,
}


const CursoFaseLista: FC<CursoFaseListaProperties> = ({
    curso,
    fases,
    editavel,
    onClickListItemText,
    onClickRemoveCircleOutlineIcon,
}) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClick = () => {
      setOpen(!open);
    };

    const onClickListItem = (e:any) => {
        handleClick();
        onClickListItemText(e.currentTarget.getAttribute('data-id'),2);
    }


    return (
        <List
          sx={{ width: '100%', maxWidth: 180, bgcolor: 'background.paper' , }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton sx={{display: 'flex', gap: '18px'}} >
            {
              editavel ? 
              <RemoveCircleOutlineIcon sx={{fontSize: '1.8rem'}} onClick={onClickRemoveCircleOutlineIcon} /> : 
              <RemoveCircleOutlineIcon sx={{fontSize: '1.8rem', visibility: 'hidden'}}/>
            }
            <ListItemText primary={curso} />
            {
              open ? 
              <Rotate90DegreesCcwIcon sx={{fontSize: '1.8rem'}} onClick={handleClick} /> : 
              <Rotate90DegreesCwIcon  sx={{fontSize: '1.8rem'}} onClick={handleClick} />
            }
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{textAlign: 'center'}} data-id={1} onClick={(e) => {onClickListItem(e)}}>
                <ListItemText primary="1ªFase" sx={{ pointerEvents: 'none'}}/>
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      );
}

export default CursoFaseLista;