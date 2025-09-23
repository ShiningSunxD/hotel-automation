import { useEffect, useState } from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { TopNavigation, Footer, DynamicForm, AdminTable } from '@components';
import  useAdmin  from '../../hooks/useAdmin.jsx';
import { useNavigate } from 'react-router-dom';
import { adminMetadataAPI, roomsAPI, room_typesAPI, servicesAPI, bookingsAPI, booking_serviceAPI, userAPI, articlesAPI, articleImagesAPI } from '../../api';
import styles from './Admin.module.css';
import { useSearchParams } from 'react-router-dom';

function Admin() {
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const { isAdmin, isLoading } = useAdmin();
   const [shouldRender, setShouldRender] = useState(false);

   const handleButtonClick = (table) => {
      searchParams.set('table', table);
      setSearchParams(searchParams);
   };

   const match_API = {
      'Rooms': roomsAPI,
      'Booking': bookingsAPI,
      'Room_types': room_typesAPI,
      'Service': servicesAPI,
      'User': userAPI,
      'Booking_service': booking_serviceAPI,
      'Article': articlesAPI,
      'articleImages': articleImagesAPI,
   }


   const table = searchParams.get('table') || null;

   const FetchAPI = match_API[table];

   useEffect(() => {
      document.title = "Admin panel";
   }, [])


   useEffect(() => {
    if (!isLoading) {
      if (!isAdmin) {
        navigate('/', { replace: true });
      } else {
        setShouldRender(true);
      }
    }
  }, [isAdmin, isLoading]);




   if(shouldRender){
      return (
     <>
      <TopNavigation />
      <Typography variant="h3">Admin panel</Typography>     

         <div className={styles.buttonContainer}>
            <Button variant="outlined" onClick={() => handleButtonClick('Rooms')} >Комнаты</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('Room_types')} >Типы комнат</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('User')} >Пользователи</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('Booking')} >Бронирования</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('Service')} >Сервисы</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('Booking_service')} >Сервисы бронирования</Button>
            <Button variant="outlined" onClick={() => handleButtonClick('Article')} >Статьи</Button>
         </div>
         
         {table && <DynamicForm modelName={table} API={adminMetadataAPI} API_to_update={FetchAPI} />}
         <Paper className={styles.adminTable} variant="elevation" elevation={3}>
            {table && <AdminTable modelName={table} API={adminMetadataAPI} API_to_update={FetchAPI} />}
         </Paper>
      <Footer />
     </>
   )
   }
}

export default Admin;