import { useContext, useEffect } from 'react';
import { AuraContext } from '../context/AuraContext';
import { getVoiceMessage } from '../constants/personas';
import toast from 'react-hot-toast';

// 🚨 1. DIRECT IMPORTS (Ye Vite ko force karega files dhoondhne ke liye)
import calmSound from '../assets/sounds/calm.mp3';
import hardcoreSound from '../assets/sounds/hardcore.mp3';
import animeSound from '../assets/sounds/anime.mp3';

// 🚨 2. SOUND MAP UPDATE KIYA
const SOUNDS = {
  'calm-mentor': calmSound,
  'hardcore': hardcoreSound,
  'anime': animeSound
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