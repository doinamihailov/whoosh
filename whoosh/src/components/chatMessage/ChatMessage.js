import React from 'react'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default ({ owner, message }) =>
<p>
  <Typography style={{display: "flex", justifyContent: owner/*, borderStyle: 'dotted'*/}}>
    {message}
  </Typography>
  </p>