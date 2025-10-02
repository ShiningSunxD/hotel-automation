import { CircularProgress, Typography,  FormGroup, FormControlLabel, Checkbox, TextField, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from './BookingSummary.module.css';
import dayjs from 'dayjs';
import { bookingsAPI } from '../../api';
import { Snackbar_component } from '@components';

function BookingSummary({services, booking_id}) {
    const booking = useSelector(state => {
        const bookingIndex = state.booking.bookings.findIndex(booking => booking.id === booking_id)
        if (bookingIndex !== -1) {
                return state.booking.bookings[bookingIndex]
            }
    })

    const [servicesState, setServicesState] = useState();
    const [price, setPrice] = useState();

    const [checkboxState, setCheckboxState] = useState([]);


    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if(services){
            setServicesState(
                services.map(service => ({
                ...service,
                quantity: 0
            })));
            setCheckboxState(services.map(() => true))
        }
    }, [services]);

    useEffect(() => {
        if (servicesState && servicesState.length > 0) {
            const bookingPrice = dayjs(booking.check_out).diff(dayjs(booking.check_in), 'd') * booking.price;
            const totalPrice = bookingPrice + servicesState.reduce((acc, item) => {
                return acc + (item.quantity * parseInt(item.price, 10));
            }, 0);
            
            setPrice(totalPrice);
        }
        
        console.log(servicesState);
        console.log(booking);
    }, [servicesState, checkboxState]);



    const handleQuantityChange = (index, value) => {
        setServicesState(prevServices => {
        return prevServices.map((service, i) => {
            if (i === index) {
                const quantity = parseInt(value, 10);
            return {
                ...service,
                quantity: isNaN(quantity) ? 0 : quantity
            };
            }
            return service;
        });
        });
    };


    const handleCheckboxChange = (index) => {
        setCheckboxState(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            
            if (!newState[index]) {
                handleQuantityChange(index, 0);
            }
            return newState;
        });
    };


    const handleButton = async (e) => {
            e.preventDefault();
            setLoading(true);
            setSubmitError('');
            try {
                const services_data = servicesState.map(item => ({
                    service_id: item.id,
                    quantity: item.quantity
                }));

                const request = {
                    room: booking.id,
                    check_in: booking.check_in,
                    check_out: booking.check_out,
                    status: 'confirmed',
                    services_data: services_data,
                }
                console.log('request -', request)
                const response = await bookingsAPI.create(request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
                console.log(response.data);  
                setLoading(false);

            } catch (err) {
                setLoading(false);
                setSubmitError(true);
            }
        };



    return (
        <div className={styles.summaryContainer}>
            
                <div className={styles.typographies} >
                    <Typography variant="h6">Номер: {booking.number} </Typography>
                    <Typography variant="h6">Этаж: {booking.floor} </Typography>
                    <Typography variant="h6">Цена: {booking.price}р за ночь</Typography>
                    <Typography variant="h6">Тип номера: {booking.type_name}</Typography> 
                    <Typography variant="h6">Дата въезда: {booking.check_in}</Typography> 
                    <Typography variant="h6">Дата выезда: {booking.check_out}</Typography> 
                </div>
            <div className={styles.rightSide}>
                <div className={styles.servicesContainer}>
                    {servicesState && servicesState.map((item, index) => (
                    <div className={styles.serviceContainer}  key={item.id}>
                        <FormGroup sx={{display: 'inline-block'}}>
                            <FormControlLabel control={<Checkbox 

                            sx={{
                                    '& .MuiSvgIcon-root': {
                                        fontSize: { xs: 15, sm: 20, md: 24 }
                                    }
                                }}
                            checked={checkboxState[index]} onChange={() => handleCheckboxChange(index)} />}
                            
                            sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' }
                                    }
                                }}
                            
                            label={`${item.name} - ${item.price} ₽`}  />
                        </FormGroup>
                    
                        <TextField
                            className={styles.inputField}
                            disabled={!checkboxState[index]}
                            type="number"
                            label="Количество"
                            min="0"
                            value={servicesState[index].quantity}
                            onChange={(e) => {
                                    handleQuantityChange(index, e.target.value.replace(/[^\d]/g, ''));
                                }
                            }
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
                                handleQuantityChange(index, numericPaste);
                                }
                                e.preventDefault();
                                }}

                        />
                    </div>
                    ))}
                </div>
                
                <div className={styles.buttonContainer}>
                    <Typography variant="h6">Итоговая цена - {price}</Typography>
                    <Button onClick={handleButton} sx={{backgroundColor: 'green'}} variant="contained" disabled={submitError}>
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />)
                            : ('Отправить')
                        }
                    </Button>
                    {submitError && <Typography variant="body2" color="error">{submitError}</Typography>}
                </div>
            </div>
                <Snackbar_component IsOpen={success} onClose={() => setSuccess(false)} severity='success'>
                    Вы успешно забронировали номер! Перейдите в профиль, чтобы просмотреть свои бронирования.
                </Snackbar_component>

                <Snackbar_component IsOpen={submitError} onClose={() => setSubmitError(false)} severity='error'>
                    Произошла ошибка!
                </Snackbar_component>

        </div>

        
    )
};

export default BookingSummary