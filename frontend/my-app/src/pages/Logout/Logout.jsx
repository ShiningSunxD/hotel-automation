import { useEffect } from 'react';
import { authAPI } from '../../api.js';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();


      useEffect(() => {
         const logout = async () => {
         document.title = "Logout";

         try {
            const response = await authAPI.logout();
            console.log(response);
            localStorage.clear();
            navigate('/');
         } catch (err) {
            console.log('Something went wrong');
         }
      };

      logout();
      }, [])
   

  return (
     <>
     </>
  )
}

export default Logout