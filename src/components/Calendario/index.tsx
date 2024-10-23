import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC } from "react";
import { ICronogramaMes } from "../../types/cronograma";
import { IDiaCronograma } from "../../types/diaCronograma";
import "./index.css";

interface CalendarioProperties {
  meses: ICronogramaMes[];
}

const Calendario: FC<CalendarioProperties> = ({ meses }) => {
  return (
    <>
      {meses.map((mes: ICronogramaMes) => (
        <div className="calendario-container" key={mes.mesEnum}>
          <div><p className="calendario-mes">{mes.mesEnum}</p></div>
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
              {Object.entries(mes.semanasMes).map(([semanaNumero, diasCronograma]) => {
                let diasVazios = 0;

                if (semanaNumero === '1' && diasCronograma.length < 6) {
                  diasVazios = 6 - diasCronograma.length;
                }

                return (
                  <TableRow key={semanaNumero}>
                    {Array.from({ length: diasVazios }).map((_, index) => (
                      <TableCell  align="center" key={`empty-${index}`}/> 
                    ))}
{/* definir tamanho maximo de coluna para padronizar */}
                    {diasCronograma.map((diaCronograma: IDiaCronograma) => (
                      <TableCell sx={{backgroundColor:diaCronograma.corHexadecimal}}  align="center" key={diaCronograma.id}>
                        {diaCronograma.data.toString().slice(8, 10)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
};

export default Calendario;
