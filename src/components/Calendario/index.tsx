import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC } from "react";
import { ICronogramaMes } from "../../types/cronograma";
import { IDiaCronograma } from "../../types/diaCronograma";

interface CalendarioProperties {
  meses: ICronogramaMes[];
}

const Calendario: FC<CalendarioProperties> = ({ meses }) => {
  return (
    <>
      {meses.map((mes: ICronogramaMes) => (
        <div key={mes.mesEnum}>
          <div>{mes.mesEnum}</div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SEG</TableCell>
                <TableCell>TER</TableCell>
                <TableCell>QUA</TableCell>
                <TableCell>QUI</TableCell>
                <TableCell>SEX</TableCell>
                <TableCell>SAB</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(mes.semanasMes).map(([semanaNumero, diasCronograma]) => (
                <TableRow key={semanaNumero}>
                  {diasCronograma.map((diaCronograma: IDiaCronograma) => {

                    return (
                      
                      <TableCell key={diaCronograma.id}>{diaCronograma.data.toString().slice(8,10)}</TableCell>
                    )
})}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
};

export default Calendario;
