import { useEffect, useState } from 'react';
import styles from './Rooms.module.css';
import { TopNavigation, Footer, RoomCard } from '@components';
import { Typography, Button, Select, FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import { roomsAPI, room_typesAPI } from '../../api.js'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Rooms() {
   // select fields
   const [selectedLowerPrice, setSelectedLowerPrice] = useState(undefined);
   const [selectedUpperPrice, setSelectedUpperPrice] = useState(undefined);
   const [selectedType, setSelectedType] = useState(undefined);


   // data from server
   const [typesData, setTypes] = useState();
   const [roomsData, setRooms] = useState();

   // already selected rooms
   const bookingsConfirmed = useSelector(state => state.booking.bookings);


   const navigate = useNavigate();

   useEffect(() => {
      document.title = "Rooms";
   })

   useEffect(() => {
      (async () => {
         try {
            const [roomsResponse, typesResponse] = await Promise.all([
               roomsAPI.list(),
               room_typesAPI.list()
            ]); 
            
            if(roomsResponse.status == 200){
               setRooms(roomsResponse.data);
            }
            if(typesResponse.status == 200){
               setTypes(typesResponse.data);
               console.log(typesResponse.data)
            }

         } catch (err) {
            console.log(err);
         }
      })();
      console.log(bookingsConfirmed);
   }, []);

  return (
     <>

         <TopNavigation/>

         <Typography className={styles.typography} variant="h4">Наши номера</Typography>

         <div className={styles.filterBar}>
            <FormControl className={styles.typeSelect}>
               <InputLabel id="demo-simple-select-label">Тип</InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Тип"
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
               >

                  <MenuItem value={undefined}>
                     Все типы
                  </MenuItem>
                  {typesData && typesData.map((type) => (
                     <MenuItem key={type.id} value={type.name}>
                     {type.name}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>


            <TextField
               className={styles.priceSelect}
               type="number"
               label="Цена (от)"
               value={selectedLowerPrice}
               onChange={(e) => setSelectedLowerPrice(e.target.value.replace(/[^\d]/g, ''))}
               onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && 
                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                     e.preventDefault();
                  }
                  }}

               onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  const numericPaste = pasteData.replace(/[^\d]/g, '');
                  if (numericPaste) {
                     setSelectedLowerPrice(prev => prev + numericPaste);
                  }
                  e.preventDefault();
               }}
            />

            <TextField
               className={styles.priceSelect}
               type="number"
               label="Цена (до)"
               value={selectedUpperPrice}
               onChange={(e) => setSelectedUpperPrice(e.target.value.replace(/[^\d]/g, ''))}
               onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && 
                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                     e.preventDefault();
                  }
                  }}

               onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  const numericPaste = pasteData.replace(/[^\d]/g, '');
                  if (numericPaste) {
                     setSelectedUpperPrice(prev => prev + numericPaste);
                  }
                  e.preventDefault();
               }}
            />

         </div>

         <Button onClick={() => navigate('/booking')} sx={{backgroundColor: 'green'}} disabled={bookingsConfirmed.length === 0}
         variant="contained">
         Забронировать!</Button>

         
         {bookingsConfirmed && bookingsConfirmed.map(item => {
            
         
            return (
               <RoomCard 
                  key={item.id}
                  room_id={item.id} 
                  room_number={item.number} 
                  room_floor={item.floor}
                  room_price={item.price} 
                  room_type_name={item.type_name} 
                  room_photo={item.photo}
                  existed_bookings={item.bookings}
                  room_check_in={item.check_in}
                  room_check_out={item.check_out}
                  checked={true}
               />
            );
         })}


         {roomsData && roomsData.map(item => {
            const foundObjectId = bookingsConfirmed.find(sub_item => sub_item.id === item.id);
            
            if(foundObjectId) return;

            const isTypeMatch = (selectedType === undefined) || (item.room_type_name === selectedType);
            const isPriceInRange = ((item.price >= selectedLowerPrice) || (selectedLowerPrice === undefined)) && 
                                   ((item.price <= selectedUpperPrice) || (selectedUpperPrice === undefined));

            if (!isTypeMatch || !isPriceInRange) return;

            
            return (
               <RoomCard 
                  key={item.id}
                  room_id={item.id} 
                  room_number={item.number} 
                  room_floor={item.floor}
                  room_price={item.price} 
                  room_type_name={item.room_type_name} 
                  room_photo={item.photo}
                  existed_bookings={item.bookings}
               />
            );
         })}

         <Footer/>
     </>
  )
}

export default Rooms