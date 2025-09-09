import { useEffect, useState } from 'react';
import styles from './Booking.module.css';
import { TopNavigation, Footer, BookingSummary } from '@components';
import { Paper, Typography } from '@mui/material';
import { servicesAPI } from '../../api';
import { useSelector } from 'react-redux';

function Booking() {
   const [services, setServices] = useState();
   const bookingsConfirmed = useSelector(state => state.booking.bookings);
   const state = useSelector(state => state);

   useEffect(() => {
      document.title = "Booking";
   })

   useEffect(() => {
      (async () => {
         try {
            const serviceResponse = await servicesAPI.list();
               
            if(serviceResponse.status == 200){
               setServices(serviceResponse.data);
            }
   
         } catch (err) {
            console.log(err);
         }
      })();
   }, []);


  return (
     <>
         <TopNavigation />

         <Typography className={styles.typography} variant="h3">Страница бронирования</Typography>

         <Paper className={styles.paper} variant="elevation" elevation={3}>

            <div className={styles.summaries}>
               {bookingsConfirmed.length !== 0 ? bookingsConfirmed.map(
               booking => (
                  <BookingSummary key={booking.id} booking_id={booking.id} services={services} />
               )
               ) :
                  <Typography className={styles.typography} variant="h6">Выберите номера для бронирования</Typography>
               }
            </div>

         </Paper>

         <Footer />
     </>
  )
}

export default Booking