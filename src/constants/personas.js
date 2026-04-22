// src/constants/personas.js

export const PERSONAS = {
  'calm-mentor': {
    missed_task: "I noticed a missed objective. Take a deep breath, recalibrate, and let's try again.",
    streak_break: "Consistency is a journey. Don't let one slip-up stop you. Restart today.",
    focus_drop: "Your focus seems to be drifting. Consider taking a short, mindful break.",
    welcome: "Welcome back. Let's make today productive and peaceful."
  },
  'hardcore': {
    missed_task: "You missed a task? Stop making excuses and get back to work, loser!",
    streak_break: "Streak broken! Are you seriously giving up that easily? Pathetic. Restart NOW.",
    focus_drop: "Wake up! You're wasting time. Get your eyes back on the screen!",
    welcome: "About time you showed up. Less talking, more grinding. Move!"
  },
  'anime': {
    missed_task: "Senpai, you missed an objective! Don't lose your way, believe in yourself!",
    streak_break: "Baka! Your streak is gone! We have to train 100x harder starting right now!",
    focus_drop: "Senpai, your focus is dropping! Use your breathing technique and concentrate!",
    welcome: "Okaeri, Senpai! Let's conquer today's missions together! ✨"
  }
};

// Helper function to get the dialogue
export const getVoiceMessage = (voiceGuide, trigger) => {
  const currentPersona = PERSONAS[voiceGuide] || PERSONAS['anime']; // Default Anime
  return currentPersona[trigger] || "Stay focused!";
};