import { useState, useEffect } from 'react';
import { authAPI } from '../api'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null вместо false для обозначения "загрузки"
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await authAPI.verify();
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTokenValidity();
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuth;