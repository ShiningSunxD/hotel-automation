import { useState, useEffect } from 'react';
import { authAPI } from '../api'

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(null); // null вместо false для обозначения "загрузки"
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        const response = await authAPI.verify_admin();
        setIsAdmin(response.status === 200);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkIsAdmin();
  }, []);

  return { isAdmin, isLoading };
};

export default useAdmin;