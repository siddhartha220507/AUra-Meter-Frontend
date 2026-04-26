import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getLabel } from '../constants/dictionary';

export const AuraContext = createContext();

export const AuraProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚨 NAYA: THE NOTIFICATION ENGINE (Local Storage based)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('aura_notifs');
    return saved ? JSON.parse(saved) : [];
  });

  const addNotification = (text, type = 'info') => {
    setNotifications(prev => {
      const newNotifs = [{ 
        id: Date.now(), 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        type 
      }, ...prev].slice(0, 10); // Sirf top 10 notifs save karega
      localStorage.setItem('aura_notifs', JSON.stringify(newNotifs));
      return newNotifs;
    });
  };

  const t = (key) => {
    return getLabel(user?.themePreference || 'minimalist-dark', key);
  };

  useEffect(() => {
    if (user?.themePreference) {
      document.documentElement.setAttribute('data-theme', user.themePreference);
    } else {
      document.documentElement.setAttribute('data-theme', 'minimalist-dark');
    }
  }, [user?.themePreference]);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
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
    // 🚨 Yahan addNotification aur notifications ko Provider mein pass kiya
    <AuraContext.Provider value={{ user, setUser, loading, logout, t, notifications, addNotification }}>
      {children}
    </AuraContext.Provider>
  );
};