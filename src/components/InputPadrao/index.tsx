import { Button, InputAdornment, TextField } from "@mui/material";
import { FC, ReactNode } from "react";
import "./index.css";
import React from "react";

interface InputPadraoProperty {
  label: string;
  type: React.InputHTMLAttributes<unknown>["type"];
  icon?: ReactNode;
  variant?: 'outlined' | 'filled' | 'standard';
}
const InputPadrao: FC<InputPadraoProperty> = ({ label, type, icon, variant }) => {
  return (
    <TextField
    className="login-imput"
      fullWidth
      id="outlined-basic"
      label={label}
      variant={variant}
      type={type}
      slotProps={{
        input: {
          endAdornment: icon ? (
            <InputAdornment position="end">{icon}</InputAdornment>
          ) : null,
        },
      }}
    />
  );
};

export default InputPadrao;
