import {Card, CardActions, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import "./index.css";
import React from "react";

interface CardPadraoProperties {
  titulo: string,
  body: React.ReactNode[],
  actions: React.ReactNode[]
}

const CardPadrao: FC<CardPadraoProperties> = ({
  titulo,
  body,
  actions
}) => {

  return <>
    <Card sx={{}}>
      <CardContent>
        <Typography id="card-padrao-title" variant="h6" component="h3">
          {titulo}
        </Typography>
        <Typography id="card-padrao-body" component="div" sx={{ color: 'text.secondary' }}>
          {body.map((bodyItem, index) => (
            <React.Fragment key={index}>{bodyItem}</React.Fragment>
          ))}
        </Typography>
      </CardContent>
      <CardActions id="card-padrao-actions" sx={{ justifyContent: 'end' }}>
        {actions.map((actionItem, index) => (
         <React.Fragment key={index}>{actionItem}</React.Fragment>
        ))}
      </CardActions>
    </Card>
  </>
}

export default CardPadrao;