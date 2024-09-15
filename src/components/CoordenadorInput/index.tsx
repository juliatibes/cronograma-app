import { Stack, Autocomplete, TextField } from "@mui/material";
import { FC } from "react";

const CoordenadorInput: FC = () => {
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        fullWidth
        id="tags-outlined"
        options={top100Films}
        getOptionLabel={(option) => option.title}
        defaultValue={[top100Films[0]]} 
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label="Coordenador" placeholder="" />
        )}
      />
    </Stack>
  );
};

const top100Films = [
  { title: 'Lucas' },
  { title: 'Mariele' },
  { title: 'Georgia' },
  { title: 'Muriel' },
  { title: 'Rafael' },
];

export default CoordenadorInput;
