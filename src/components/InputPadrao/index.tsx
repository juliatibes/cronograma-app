import { Button, InputAdornment, TextField } from "@mui/material";
import { FC, ReactNode } from "react";
import "./index.css";
import React from "react";

interface InputPadraoProperty {
  label: string;
  value?: string;
  onChange?: (e: any) => void;
  type: React.InputHTMLAttributes<unknown>["type"];
  icon?: ReactNode;
  variant?: 'outlined' | 'filled' | 'standard';
}
const InputPadrao: FC<InputPadraoProperty> = ({ label, value, onChange, type, icon, variant }) => {
  return (
    <TextField
    className="login-imput"
      fullWidth
      id="outlined-basic"
      value={value}
      onChange={onChange}
      label={label}
      variant={variant}
      type={type}
      size="small"
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
