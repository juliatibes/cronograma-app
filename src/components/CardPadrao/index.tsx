import {Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
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
    <Card className="card-padrao">
      <CardHeader sx={{padding:'0px'}} title={<h3 title={titulo} className="card-padrao-title">{titulo}</h3>}/>
      <CardContent sx={{padding:'0px'}}>
        <Typography className="card-padrao-body" component="div" sx={{ color: 'text.secondary' }}>
          {body.map((bodyItem, index) => (
            <React.Fragment key={index}>{bodyItem}</React.Fragment>
          ))}
        </Typography>
      </CardContent>
      <CardActions className="card-padrao-actions" sx={{ justifyContent: 'end', padding:'0px'}}>
        {actions.map((actionItem, index) => (
         <React.Fragment key={index}>{actionItem}</React.Fragment>
        ))}
      </CardActions>
    </Card>
  </>
}

export default CardPadrao;