import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Textfield(textprops) {
  return (
    <Box
      component="div"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField className={textprops.className} type={textprops.type} id={textprops.id} label={textprops.label} variant="outlined" />
    </Box>
  );
}
