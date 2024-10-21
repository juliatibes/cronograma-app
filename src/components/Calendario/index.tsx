import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC } from "react";

const Calendario: FC = () => {

  return <>
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
  </>
}

export default Calendario;