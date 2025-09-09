import { useEffect, useState } from 'react';
import { bookingsAPI } from '../../api';
import { Typography, Paper } from '@mui/material';
import { TopNavigation, Footer, BookingTable } from '@components';
import  useAuth  from '../../hooks/useAuth.jsx';
import styles from './Account.module.css'
import { useNavigate } from 'react-router-dom';

function Account() {
   const navigate = useNavigate();
   const [bookingData, setBookingData] = useState([])
   const header = ['Идентификатор бронирования', 'Номер комнаты', 'Дата въезда', 'Дата выезда', 'Статус бронирования', 'Действия'];

   const { isAuthenticated, isLoading } = useAuth();
   const [shouldRender, setShouldRender] = useState(false);



   useEffect(() => {
      document.title = "Account";
   }, [])


   useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, isLoading]);


   useEffect(() => {
      if(shouldRender){
         (async () => {
         try {
            const bookingsResponse = await bookingsAPI.list();
               
            if(bookingsResponse.status == 200){
               console.log(bookingsResponse.data);
               setBookingData(bookingsResponse.data)
            }
   
         } catch (err) {
            console.log(err);
         }
         })();
      }
   }, [shouldRender]);


   if(shouldRender){
      return (
     <>
      <TopNavigation />


      <Typography variant="h3">Добро пожаловать!</Typography>
      
      <Paper className={styles.bookingTable} variant="elevation" elevation={3}>
         <BookingTable className={styles.bookingTable} data={bookingData} header={header} />
      </Paper>
        
      
      <Footer />
     </>
   )
   }
}

export default Account