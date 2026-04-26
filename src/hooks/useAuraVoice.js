import { useContext, useEffect } from 'react';
import { AuraContext } from '../context/AuraContext';
import { getVoiceMessage } from '../constants/personas';
import toast from 'react-hot-toast';

// 🚨 1. IMPORTS HATA DIYE HAIN (Kyunki files ab public folder mein hain)
// Vite ab inhe module ki tarah resolve karne ki koshish nahi karega.

// 🚨 2. DIRECT URL PATHS LAGA DIYE (Best Practice for Audio in Vite)
const SOUNDS = {
  'calm-mentor': '/sounds/calm.mp3',
  'hardcore': '/sounds/hardcore.mp3',
  'anime': '/sounds/anime.mp3'
};

export const useAuraVoice = () => {
  const { user } = useContext(AuraContext);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const triggerVoice = (triggerType) => {
    const voice = user?.voiceGuide || 'anime';
    const message = getVoiceMessage(voice, triggerType);

    // 🚨 3. AUDIO ENGINE
    try {
      const soundUrl = SOUNDS[voice];
      if (soundUrl) {
        // Seedha URL se play hoga
        const audio = new Audio(soundUrl);
        audio.play().catch(e => console.warn("Browser blocked audio autoplay:", e));
      }
    } catch (error) {
      console.error("Audio system failed", error);
    }

    // 4. OS NOTIFICATION
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Aura System", {
        body: message,
        icon: '/vite.svg', 
        silent: true 
      });
    } else {
      toast(message, {
        icon: voice === 'hardcore' ? '🤬' : voice === 'anime' ? '✨' : '🧘‍♂️',
        style: {
          borderRadius: '10px',
          background: 'var(--bg-card-raise)',
          color: 'var(--t1)',
          border: '1px solid var(--violet)'
        }
      });
    }
  };

  return { triggerVoice };
};