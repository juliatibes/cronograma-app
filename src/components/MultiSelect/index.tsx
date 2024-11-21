import { Stack, Autocomplete, TextField } from "@mui/material";
import { FC } from "react";
import { diaSemanaEnumGetLabel } from "../../types/enums/diaSemanaEnum";

interface MultiSelectProperties {
  options:any[]
  values:any[],
  label:string
  onChange: (selectedValues: any[]) => void,
  error?:boolean,
  helperText?:string
} 

const MultiSelect: FC<MultiSelectProperties> = ({
  options,
  values,
  label,
  onChange,
  error,
  helperText
}) => {
  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        fullWidth
        size="small"
        id="tags-outlined"
        options={options}
        getOptionLabel={
          (option) => 
            option.nome ? option.nome : 
                (option.numero ? `${option.numero}ª Fase` : diaSemanaEnumGetLabel(option.diaSemanaEnum))
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={values} 
        filterSelectedOptions
        onChange={(event, value) => onChange(value)}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={label}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </Stack>
  );
};

export default MultiSelect;
