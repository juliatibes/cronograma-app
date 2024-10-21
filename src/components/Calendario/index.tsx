import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC } from "react";
import { ICronogramaMes } from "../../types/cronograma";
import { DIA_SEMANA_ENUM } from "../../types/diaSemanaEnum";

interface CalendarioProperties {
  meses: ICronogramaMes[]
}

const Calendario: FC<CalendarioProperties> = ({ meses }) => {

  return <>
    {meses.map((mes: ICronogramaMes) => (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S</TableCell>
            <TableCell>T</TableCell>
            <TableCell>Q</TableCell>
            <TableCell>Q</TableCell>
            <TableCell>S</TableCell>
            <TableCell>S</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          <TableRow>
          {
          mes.diasSemana.some(diaSemana => diaSemana.diaSemanaEnum === DIA_SEMANA_ENUM.SEGUNDA_FEIRA) ?  
          <TableCell>1</TableCell>:
          <TableCell>VAZIO</TableCell>
          }
            <TableCell>
              1
            </TableCell>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              1
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ))}

  </>
}

export default Calendario;