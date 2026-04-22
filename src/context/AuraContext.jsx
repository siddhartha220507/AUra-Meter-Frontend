import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getLabel } from '../constants/dictionary';

export const AuraContext = createContext();

export const AuraProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const t = (key) => {
    return getLabel(user?.themePreference || 'minimalist-dark', key);
  };

  useEffect(() => {
    if (user?.themePreference) {
      document.documentElement.setAttribute('data-theme', user.themePreference);
    } else {
      document.documentElement.setAttribute('data-theme', 'minimalist-dark'); // Fallback
    }
  }, [user?.themePreference]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuraContext.Provider value={{ user, setUser, loading, logout, t}}>
      {children}
    </AuraContext.Provider>
  );
};