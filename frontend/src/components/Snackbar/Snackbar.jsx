import { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Snackbar_component({ severity, children, IsOpen, onClose }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        onClose();
    };

  return (
    <div>
      <Snackbar open={IsOpen} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {children}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Snackbar_component;