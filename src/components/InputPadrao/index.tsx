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
  backgroundColor?: string,
  error?: boolean,
  helperText?: string,
  width?: string,
  className?:string,
}
const InputPadrao: FC<InputPadraoProperty> = ({
  label,
  value,
  onChange,
  type,
  icon,
  variant,
  backgroundColor,
  error,
  helperText,
  width,
  className,
}) => {
  return (
    <TextField
      className={`login-input ${className}`}
      fullWidth={width ? false : true}
      id="outlined-basic"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      label={label}
      variant={variant}
      type={type}
      size="small"
      sx={{ backgroundColor: backgroundColor, width:width}}
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
