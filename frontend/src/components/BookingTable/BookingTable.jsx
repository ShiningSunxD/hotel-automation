import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button } from '@mui/material';
import { Snackbar_component } from '@components';

function Row({ onError, onSuccess, row, API, setDeleted }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right" component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.room_name}</TableCell>
        <TableCell align="right">{row.check_in}</TableCell>
        <TableCell align="right">{row.check_out}</TableCell>
        <TableCell align="right">{row.status_display}</TableCell>
        <TableCell align="right">
            <Button onClick={() => {
              try{
                const response = API.destroy(row.id);
                  setDeleted(prevDeleted => [...prevDeleted, row.id]);
                  onSuccess();
              }
              catch(err){
                onError()
              }
            }} 
            sx={{backgroundColor: 'red', color: 'white'}} variant="outlined">
            Отменить
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Дополнительные сервисы
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Название сервиса</TableCell>
                    <TableCell>Количество</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.services.map((service) => (
                    <TableRow key={service.service_id}>
                      <TableCell component="th" scope="row">
                        {service.service_name}
                      </TableCell>
                      <TableCell>{service.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    </>
  );
}


function BookingTable({onSuccess, onError, header, data, API}) {
  const [deleted, setDeleted] = useState([]);

  return (
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {header.map((item, index) => (
                <TableCell key={index} align="right">{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item) => {
            const isInCollection = deleted.includes(item.id);
            if(isInCollection){
              return
            }
            else{
              return <Row onError={onError} onSuccess={onSuccess} key={item.id} row={item} API={API} setDeleted={setDeleted}/>
            }
          })}
        </TableBody>

      </Table>
  );
}

export default BookingTable;