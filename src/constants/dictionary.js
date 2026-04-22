// src/constants/dictionary.js

export const DICTIONARY = {
  'minimalist-dark': {
    dashboard: 'Dashboard',
    leaderboard: 'Arena Leaders',
    arena: 'Arena Feed',
    dreamFund: 'Dream Fund',
    aura: 'Aura',
    points: 'XP',
    tasks: 'Objectives'
  },
  'neon-cyber': {
    dashboard: 'Mainframe',
    leaderboard: 'Top Hackers',
    arena: 'The Grid',
    dreamFund: 'Bounty Cache',
    aura: 'Cyber-Aura',
    points: 'Credits',
    tasks: 'Protocols'
  },
  'one-piece': {
    dashboard: 'Ship Deck',
    leaderboard: 'Highest Bounties',
    arena: 'Grand Line Feed',
    dreamFund: 'Pirate Treasure',
    aura: 'Haki',
    points: 'Berries',
    tasks: 'Missions'
  }
};

// Ek helper function jo current theme ke hisaab se word dega
export const getLabel = (theme, key) => {
  const currentTheme = DICTIONARY[theme] || DICTIONARY['minimalist-dark'];
  return currentTheme[key] || DICTIONARY['minimalist-dark'][key];
};