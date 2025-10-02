import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link, useNavigate } from 'react-router-dom';
import styles from './AdminTable.module.css';


function Row({ modelName, row, API_to_update, order, setDeleted }) {
  const navigate = useNavigate();
  let id;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {order.map((item, index) => {
          
              if(item == 'id'){
                id = row[item];
              }


              if( typeof row[item] === 'boolean'){
                return <TableCell align="center" key={index}> {row[item] ? 'да' : 'нет'} </TableCell>
              }
              return <TableCell className={styles.tableCell} align="center" key={index}> {row[item] ? row[item] : '-'} </TableCell>
          })}
        <TableCell sx={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems:'center'}} align="center">
            <Button onClick={() => {
              const response = API_to_update.destroy(row.id);
              console.log("response.data -", response)
              setDeleted(prevDeleted => [...prevDeleted, row.id]);
            }} 
            sx={{backgroundColor: 'red', color: 'white', width: '10vh'}} variant="outlined">
            Удалить
          </Button>

            <Button onClick={() => {
              navigate(`/edit?table=${modelName}&id=${id}`)
            }}
            sx={{backgroundColor: 'cean', color: 'black', width: '10vh'}} variant="outlined">
            Изменить
          </Button>
        </TableCell>



      </TableRow>
    </>
  );
}


function AdminTable({modelName, API, API_to_update}) {
  const [header, setHeader] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [deleted, setDeleted] = useState([]);

  let order = ['id'];


  useEffect(() => {
          setLoading(false);
          const fetchFields = async () => {
          try {
              const params = {
                  model: modelName
                  }


              const [metadataResponse, fetchResponse] = await Promise.all([
                            API.get({params}),
                            API_to_update.list()
                            ])
              let dict = {};
              metadataResponse.data.map((item) => {
                let name = item.name;
                let label = item.label;
                dict[name] = label; 
              })
              setHeader(dict);
              console.log(fetchResponse.data)
              setFields(fetchResponse.data);
              setLoading(false);
          } catch (err) {
              setError(err);
              setLoading(false);
          }
          };
  
          fetchFields();
      }, [modelName, deleted]);



  return (
      <Table aria-label="collapsible table" className={styles.tableContainer}>
        <TableHead>
          <TableRow>

            <TableCell align="center">id</TableCell>
            {Object.entries(header).map(([name, label], index) => {
              order.push(name);
              return <TableCell key={index} align="center">{label}</TableCell>
            })}
            <TableCell align="center">Действия</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((item) => {
            const isInCollection = deleted.includes(item.id);
            if(isInCollection) return

              return <Row key={item.id} modelName={modelName} row={item} API_to_update={API_to_update} order={order} setDeleted={setDeleted}/>
          })}
        </TableBody>
      </Table>
  )
}

export default AdminTable;