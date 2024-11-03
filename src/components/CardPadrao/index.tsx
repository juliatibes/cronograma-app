import {Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { FC } from "react";
import "./index.css";
import React from "react";
import { CardPadraoBodyItemProperties } from "../CardPadraoBodyItem";
import { CardPadraoActionItemProperties } from "../CardPadraoActionItem";
import { STATUS_ENUM } from "../../types/statusEnum";
import { IDisciplina } from "../../types/disciplina";

interface CardPadraoProperties {
  titulo: string,
  body: React.ReactElement<CardPadraoBodyItemProperties>[],
  actions: React.ReactElement<CardPadraoActionItemProperties>[],
  statusEnum?:STATUS_ENUM,
  disciplinaCorHexadecimal?:string
}

const CardPadrao: FC<CardPadraoProperties> = ({
  titulo,
  body,
  actions,
  statusEnum,
  disciplinaCorHexadecimal
}) => {

  return <>
    <Card className={`card-padrao`}>
       {
        disciplinaCorHexadecimal && 
        <div title="Cor" className={`card-padrao-disciplina-cor ${statusEnum === STATUS_ENUM.INATIVO && "inativo" }`}>
          <span style={{backgroundColor:disciplinaCorHexadecimal}} className="card-padrao-disciplina-cor-tag"></span>
        </div>
       }
      <CardHeader className={`card-padrao-title ${statusEnum === STATUS_ENUM.INATIVO && "inativo"}`} title={<h3 title={titulo}>{titulo}</h3>}/>
      <CardContent sx={{padding:'0px'}}>
        <Typography className={`card-padrao-body ${statusEnum === STATUS_ENUM.INATIVO && "inativo"}`} component="div" sx={{ color: 'text.secondary' }}>
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