import { Stack, Autocomplete, TextField } from "@mui/material";
import { FC } from "react";

const DiaSemanaInput: FC = () => {
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
          <TextField {...params} label="Dia da semana" placeholder="" size="small" />
        )}
      />
    </Stack>
  );
};

const top100Films = [
  { title: 'Segunda' },
  { title: 'Terça' },
  { title: 'Quarta' },
  { title: 'Quinta' },
  { title: 'Sexta' },
];

export default DiaSemanaInput;
