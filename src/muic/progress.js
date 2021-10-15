import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Progress(props) {
  return (
    <LinearProgress color={props.color} className={props.className} id={props.id}/>
  );
}