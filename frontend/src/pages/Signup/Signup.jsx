import styles from './Signup.module.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api.js';
import { CircularProgress, Button, Paper, TextField, Typography } from '@mui/material';

function Signup() {
   const formValues = useRef({
      username: '', 
      password: '',
   });

   const navigate = useNavigate();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleInputChange = (e, field) => {
        formValues.current[field] = e.target.value;
    };


   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.register({
                username: formValues.current.username,
                password: formValues.current.password,
            });
            console.log(response);
            setLoading(false);
            if (response.status == 201){
                localStorage.setItem('authToken', response.data.token);
                navigate('/');
            }
            
        } catch (err) {
            setError('Неверные логин или пароль');
        }
    };

   useEffect(() => {
      document.title = "Signup";
   })

  return (
     <>
        <Paper className={styles.paper} variant="elevation" elevation={3}>
            <Typography className={styles.typography} variant="h3">Регистрация</Typography>
            <TextField onChange={(e) => handleInputChange(e, 'username')} ref={un => formValues.current.username = un} className={styles.logpass} label="Логин" id="login" />
            <TextField type='password' onChange={(e) => handleInputChange(e, 'password')} ref={pw => formValues.current.password = pw} className={styles.logpass} label="Пароль" id="password" />
            {error && <Typography variant="body2" color="error">Неверный логин или пароль!</Typography>}
            <Button onClick={handleSubmit} className={styles.butt} variant="contained" disabled={loading}>
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Отправить'
                )}
            </Button>
        </Paper>
     </>
  )
}

export default Signup