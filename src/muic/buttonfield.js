import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Buttonfield(propsbutton) {
  return (
      <Button variant="contained" aria-label="outlined primary button group" className={propsbutton.className} type={propsbutton.type} id={propsbutton.id} onClick={(event)=>propsbutton.submithandler(event)}>{propsbutton.value}</Button>
  );
}