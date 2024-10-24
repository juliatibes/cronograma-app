import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FC } from "react";
import { ICronogramaMes } from "../../types/cronograma";
import { IDiaCronograma } from "../../types/diaCronograma";
import "./index.css";
import { DATA_STATUS_ENUM } from "../../types/dataStatusEnum";
import { hexToRgba } from "../../util/conversorCores";

interface CalendarioProperties {
  meses: ICronogramaMes[];
}

const definirBackgorundColor = (diaCronogramaCorHexadecimal: IDiaCronograma): string => {

  switch (diaCronogramaCorHexadecimal.dataStatusEnum) {
    case DATA_STATUS_ENUM.OCUPADA:
      return hexToRgba(diaCronogramaCorHexadecimal.corHexadecimal, 0.4);
    case DATA_STATUS_ENUM.DISPONIVEL:
      return "#ffffff";
    case DATA_STATUS_ENUM.BLOQUEADA:
      return hexToRgba("#ffff00", 0.4);
  }
}

const Calendario: FC<CalendarioProperties> = ({ meses }) => {
  return (
    <>
      {meses.map((mes: ICronogramaMes) => (
        <TableContainer key={mes.mesEnum} className="calendario-container">
          <div><p className="calendario-mes">{mes.mesEnum}</p></div>
          <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" title="Segunda-feira">S</TableCell>
                <TableCell align="center" title="Terça-feira">T</TableCell>
                <TableCell align="center" title="Quarta-feira">Q</TableCell>
                <TableCell align="center" title="Quinta-feira">Q</TableCell>
                <TableCell align="center" title="Sexta-feira">S</TableCell>
                <TableCell align="center" title="Sabado">S</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                meses[0] === mes &&
                Array.from({ length: +Object.keys(mes.semanasMes)[0] - 1 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableCell align="center" key={`empty-${index}`}><span style={{visibility:"hidden"}}>00</span></TableCell>
                    ))}
                  </TableRow>
                ))
              }

              {Object.entries(mes.semanasMes).map(([semanaNumero, diasCronograma]) => {
                let diasVazios = 0;

                if (semanaNumero === '1' && diasCronograma.length < 6) {
                  diasVazios = 6 - diasCronograma.length;
                }

                return (
                  <TableRow key={semanaNumero}>
                    {Array.from({ length: diasVazios }).map((_, index) => (
                      <TableCell align="center" key={`empty-${index}`} />
                    ))}
                    {diasCronograma.map((diaCronograma: IDiaCronograma) => (
                      <TableCell className="calendario-body-cell" sx={{ backgroundColor: definirBackgorundColor(diaCronograma),cursor:"pointer"}} align="center" key={diaCronograma.id}>
                        {diaCronograma.data.toString().slice(8, 10)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};

export default Calendario;
