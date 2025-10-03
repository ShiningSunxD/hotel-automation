import styles from './RoomCard.module.css';
import { FormGroup, Paper, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking, removeBooking } from '../../slices/bookingSlice';
import { Snackbar_component } from '@components';


function RoomCard({ room_id, room_number, room_floor, room_price, room_type_name, room_photo, existed_bookings, room_check_in = null, room_check_out = null, checked = false}) {
    
    const [disabledDates, setDisabledDates] = useState([]);

    const [selectedCheckIn, setSelectedCheckIn] = useState(room_check_in ? dayjs(room_check_in) : null);
    const [selectedCheckOut, setSelectedCheckOut] = useState(room_check_out ? dayjs(room_check_out) : null) ;
    const [selectingError, setSelectingError] = useState(0);

    const [success, setSuccess] = useState(checked);

    const dispatch = useDispatch();

    dayjs.extend(isSameOrBefore);
    dayjs.extend(isSameOrAfter);

    useEffect(() => {
        const processBookings = () => {
                const dates = [];
            
                existed_bookings.forEach(booking => {
                    const start = dayjs(booking.check_in);
                    const end = dayjs(booking.check_out);
                
                    let current = start;
                    while (current <= end) {
                        dates.push(current.toDate());
                        current = current.add(1, 'day');
                    }
                });
            
                setDisabledDates(dates);
        };
    
    processBookings();
  }, []);

  useEffect(() => {
    console.log('Success state changed:', success);
}, [success]);

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;

        const bookingData = {
            id: room_id,
            number: room_number,
            floor: room_floor,
            price: room_price,
            type_name: room_type_name,
            photo: room_photo,
            bookings: existed_bookings,
            check_in: selectedCheckIn.format('YYYY-MM-DD'),
            check_out: selectedCheckOut.format('YYYY-MM-DD'),
        }

        if (isChecked) { 
            dispatch(addBooking(bookingData));
            setSuccess(true);
        }
        else if(!isChecked){
            dispatch(removeBooking(bookingData))
        }
};

    return (
        <>
            <Paper className={styles.RoomCard} variant="elevation" elevation={3}>
                    <div className={styles.imageContainer}>
                        <img
                            src={room_photo}
                            alt={`Фото номера ${room_number}`}
                            className={styles.image}
                        />

                    <div className={styles.typographies}>
                            <Typography variant="h6">Номер: {room_number} </Typography>
                            <Typography variant="h6">Этаж: {room_floor} </Typography>
                            <Typography variant="h6">Цена: {room_price}р за ночь</Typography>
                            <Typography variant="h6">Тип номера: {room_type_name}</Typography> 
                        </div>
                    </div>

                    <div className={styles.text}>

                        
                        <div className={styles.datePickers}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker disablePast shouldDisableDate={(date) =>
                                                            disabledDates.some(disabledDate => {
                                                                return dayjs(date).isSame(disabledDate, 'day')
                                                                }) || dayjs(date).isSameOrAfter(selectedCheckOut, 'day')
                                                        }
                                
                                            label="Дата въезда" 
                                            value={selectedCheckIn}
                                            onChange={(newValue) => {
                                                setSelectedCheckIn(dayjs(newValue)); 
                                            }}
                                            onError={(newError) => setSelectingError(newError)}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                                    padding: { xs: '4px', sm: '8px', md: '12px' },
                                                    height: { xs: '40px', sm: '48px', md: '56px' }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: { xs: '12px', sm: '14px', md: '16px' }
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderWidth: '1px'
                                                },
                                            }}
                                            />
                                <DatePicker disablePast shouldDisableDate={(date) =>
                                                            disabledDates.some(disabledDate => {
                                                                return dayjs(date).isSame(disabledDate, 'day')
                                                                }) || dayjs(date).isSameOrBefore(selectedCheckIn, 'day')
                                                        }
                                            label="Дата выезда"
                                            value={selectedCheckOut}
                                            onChange={(newValue) => {
                                                setSelectedCheckOut(dayjs(newValue)); 
                                            }}
                                            onError={(newError) => 
                                                setSelectingError(newError)
                                                } 
                                                
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                                    padding: { xs: '4px', sm: '8px', md: '12px' },
                                                    height: { xs: '40px', sm: '48px', md: '56px' }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: { xs: '12px', sm: '14px', md: '16px' }
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderWidth: '1px'
                                                },
                                            }}
                                />
                            </LocalizationProvider>
                        </div>


                        <FormGroup className={styles.bookCheckbox}>
                            <FormControlLabel control={
                                <Checkbox 
                                sx={{
                                    '& .MuiSvgIcon-root': {
                                        fontSize: { xs: 15, sm: 20, md: 24 }
                                    }
                                }}
                                checked={checked}
                                />
                            } 
                            disabled={selectingError || !selectedCheckIn || !selectedCheckOut}
                            onChange={handleCheckboxChange}
                            label="Забронировать" 
                            sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' }
                                    }
                                }}
                            />
                        </FormGroup>
                    </div>

            </Paper>
        
            <Snackbar_component IsOpen={success} onClose={() => setSuccess(false)} severity='success'>
                Вы успешно выбрали номер! Перейдите на страницу бронирования, чтобы подтвердить его!
            </Snackbar_component>


        </>
    )
};

export default RoomCard