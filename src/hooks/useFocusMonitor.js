import { useEffect, useRef, useContext, useState } from 'react';
import { useAuraVoice } from './useAuraVoice';
import { AuraContext } from '../context/AuraContext';
import api from '../utils/api';

export const useFocusMonitor = (isTimerRunning) => {
  const { triggerVoice } = useAuraVoice();
  const { user, setUser, addNotification } = useContext(AuraContext);
  
  const [interrogation, setInterrogation] = useState(null); 
  const leaveTime = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Agar timer off hai toh kuch mat karo
      if (!isTimerRunning) return;

      if (document.hidden) {
        // 🚨 1. USER LEFT THE TAB
        leaveTime.current = Date.now();
        console.log("[SYSTEM 👀] Agent left the tab. Background monitor started...");

        intervalRef.current = setInterval(() => {
           if (!leaveTime.current) return;
           
           const awayMinutes = Math.floor((Date.now() - leaveTime.current) / 60000);
           const walletBalance = user?.timeWalletBalance || 45;

           if (awayMinutes === walletBalance && walletBalance > 0) {
              triggerVoice('focus_drop');
              if ('Notification' in window) new Notification("AURA: TIME WALLET EMPTY!");
           }

           if (awayMinutes === 120) {
              triggerVoice('hardcore');
              if ('Notification' in window) new Notification("AURA: PROTOCOL BREACH!");
           }
        }, 60000); 

      } else {
        // ✅ 2. USER RETURNED TO THE TAB
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        if (leaveTime.current) {
          // 🚨 FIX FOR TESTING: Minutes ki jagah SECONDS calculate kar rahe hain!
          const timeAwaySeconds = Math.floor((Date.now() - leaveTime.current) / 1000);
          console.log(`[SYSTEM 🎯] Agent returned. Total time away: ${timeAwaySeconds} seconds`);
          
          // Agar 5 seconds se zyada bahar tha, toh Interrogation Modal khol do!
          if (timeAwaySeconds >= 5) {
            // UI mein dikhane ke liye minimum 1 minute bhej rahe hain
            const displayMins = Math.max(1, Math.floor(timeAwaySeconds / 60));
            setInterrogation({ timeAwayMinutes: displayMins });
          }
          leaveTime.current = null;
        }
      }
    };

    // Browser ke tab switch event ko suno
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, user]);

 const handleAnswer = async (answerType, usePass = false) => {
    if (answerType === 'chill' && interrogation) {
       const deductedMins = interrogation.timeAwayMinutes;
       
       if (usePass && user?.cheatPassesAvailable > 0) {
          // 🎟️ TICKET USED: No time deduction
          const newPassCount = user.cheatPassesAvailable - 1;
          setUser(prev => ({ ...prev, cheatPassesAvailable: newPassCount }));
          addNotification(`Cheat Pass used! ${deductedMins} mins of chilling protected.`, 'success');
          
          // 🚨 FIX: Wrap API in try/catch
          try {
            await api.put('/users/profile', { cheatPassesAvailable: newPassCount });
          } catch (err) {
            console.error("Backend Error saving Cheat Pass:", err);
          }

       } else {
          // 📉 NORMAL DEDUCTION
          const newBalance = Math.max(0, (user?.timeWalletBalance || 45) - deductedMins);
          setUser(prev => ({ ...prev, timeWalletBalance: newBalance }));
          addNotification(`-${deductedMins} mins deducted from Time Wallet.`, 'warning');
          
          // 🚨 FIX: Wrap API in try/catch
          try {
            await api.put('/users/profile', { timeWalletBalance: newBalance });
          } catch (err) {
            console.error("Backend Error saving Wallet:", err);
          }
       }
    }
    
    // 🚨 FIX: Ye hamesha chalega, chahe API fail ho ya pass! Modal kabhi nahi atkega.
    setInterrogation(null); 
  };

  return { interrogation, handleAnswer };
};