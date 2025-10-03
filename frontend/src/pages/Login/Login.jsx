import styles from './Login.module.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgress, Button, Paper, TextField, Typography } from '@mui/material';
import { authAPI } from '../../api.js';


function Login() {
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
            const response = await authAPI.login({
                username: formValues.current.username,
                password: formValues.current.password,
            });
            console.log(response);
            setLoading(false);
            if (response.status == 200){
                localStorage.setItem('authToken', response.data.token);
                navigate('/');
            }
            
        } catch (err) {
            console.log(err);
            setError('Неверные логин или пароль');
        } finally {
            setLoading(false);
        }
    };

   useEffect(() => {
      document.title = "Login";
   }, [])

  return (
     <>
        <Paper className={styles.paper} variant="elevation" elevation={3}>
            <Typography className={styles.typography} variant="h4">Авторизация</Typography>
            <TextField onChange={(e) => handleInputChange(e, 'username')} ref={un => formValues.current.username = un} className={styles.logpass} label="Логин" id="login" />
            <TextField type='password' onChange={(e) => handleInputChange(e, 'password')} ref={pw => formValues.current.password = pw} className={styles.logpass} label="Пароль" id="password" />
            {error && <Typography variant="body2" color="error">Неверный логин или пароль!</Typography>}
            <Button onClick={handleSubmit} className={styles.butt} variant="contained" disabled={loading}>
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Войти'
                )}
            </Button>
            <Link to="/signup">Зарегистрироваться</Link>
        </Paper>
     </>
  )
}

export default Login