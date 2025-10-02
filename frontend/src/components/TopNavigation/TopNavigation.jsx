import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LuggageIcon from '@mui/icons-material/Luggage';
import styles from './TopNavigation.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NewspaperIcon from '@mui/icons-material/Newspaper';


function TopNavigation() {
  
   const navigate = useNavigate();
   const [logged, setlogged] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token){
         setlogged(true);
      }
   }, [])


   return (
     <>
        <BottomNavigation className={styles.navigation}
        showLabels>
            <BottomNavigationAction onClick={() => navigate('/')} className={styles.nav_button} label="Главная" icon={<HomeIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
            <BottomNavigationAction onClick={() => navigate('/rooms')}className={styles.nav_button} label="Номера" icon={<LocalHotelIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
            <BottomNavigationAction onClick={() => navigate('/booking')} className={styles.nav_button} label="Бронирование" icon={<LuggageIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
            <BottomNavigationAction onClick={() => navigate('/news')} className={styles.nav_button} label="Новости" icon={<NewspaperIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
            
            {logged ? 
            (<BottomNavigation className={styles.navigation_login}
            showLabels>
               <BottomNavigationAction onClick={() => navigate('/account')} className={styles.nav_button} label="Профиль" icon={<AccountCircleIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
               <BottomNavigationAction onClick={() => navigate('/logout')} className={styles.nav_button} label="Выйти" icon={<ExitToAppIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />
            </BottomNavigation>
            ) 
            :
            (<BottomNavigationAction onClick={() => navigate('/login')} className={styles.nav_button} label="Войти" icon={<ExitToAppIcon sx={{ fontSize: { xs: 14, sm: 32, md: 40 } }}/>} />)
            }
            
        </BottomNavigation>


     
     </>
   )
}

export default TopNavigation;