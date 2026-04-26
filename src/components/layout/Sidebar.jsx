import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Sword, Target, Settings, Zap, Network } from 'lucide-react';
import { useContext } from 'react';
import { AuraContext } from '../../context/AuraContext'; 

/* 🚨 SDE FIX: Responsive Sidebar (Left on PC, Bottom on Mobile) */
const Aside = styled.aside`
  position: fixed; top: 0; left: 0; bottom: 0; width: var(--sidebar-w); 
  background: var(--bg-base); border-right: 0.5px solid var(--b1); 
  display: flex; flex-direction: column; padding: 24px 0; z-index: 50; 
  transition: all 0.3s var(--ease-expo);

  @media (max-width: 768px) {
    top: auto; bottom: 0; right: 0; width: 100%; height: 60px;
    flex-direction: row; border-right: none; border-top: 0.5px solid var(--b1);
    padding: 0; align-items: center; justify-content: space-around;
    background: rgba(6,6,14,0.95); backdrop-filter: blur(10px);
  }
`;

const LogoWrap = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 0 24px; margin-bottom: 40px;
  @media (max-width: 768px) { display: none; /* Mobile par logo chhupa do */ }
`;

const LogoIcon = styled.div` width: 32px; height: 32px; border-radius: 8px; background: var(--red); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px var(--red-glow); `;
const LogoText = styled.div` font-family: var(--f-brand); font-size: 1.2rem; font-weight: 900; letter-spacing: 3px; color: var(--t1); `;

const Nav = styled.nav`
  display: flex; flex-direction: column; gap: 6px; padding: 0 16px; flex: 1;
  @media (max-width: 768px) {
    flex-direction: row; padding: 0; gap: 0; height: 100%; justify-content: space-evenly; flex: initial; width: 100%;
  }
`;

const LinkItem = styled(NavLink)`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; 
  color: var(--t3); text-decoration: none; font-size: 0.85rem; font-weight: 600; 
  transition: all 0.2s var(--ease-expo); border: 1px solid transparent; 
  
  &:hover { color: var(--t1); background: var(--bg-card); } 
  &.active { color: var(--red); background: var(--red-soft); border-color: var(--red-border); box-shadow: 0 4px 12px rgba(0,0,0,0.1); } 

  @media (max-width: 768px) {
    padding: 10px; border-radius: 10px; gap: 0; justify-content: center;
    border: none; box-shadow: none;
    
    &.active { background: transparent; box-shadow: none; border: none; color: var(--red); transform: translateY(-3px); }
  }
`;

// 🚨 NAYA: Text ko mobile par chhupane ke liye wrap kiya
const LinkText = styled.span`
  @media (max-width: 768px) { display: none; }
`;

const Sidebar = () => {
  const { t } = useContext(AuraContext);

  return (
    <Aside>
      <LogoWrap>
        <LogoIcon><Zap size={16} color="white" strokeWidth={2.5}/></LogoIcon>
        <LogoText>AURA</LogoText>
      </LogoWrap>
      
      <Nav>
        <LinkItem to="/dashboard"><LayoutDashboard size={20}/> <LinkText>{t('dashboard')}</LinkText></LinkItem>
        <LinkItem to="/arena"><Sword size={20}/> <LinkText>{t('arena')}</LinkText></LinkItem>
        <LinkItem to="/leaderboard"><Trophy size={20}/> <LinkText>{t('leaderboard')}</LinkText></LinkItem>
        <LinkItem to="/dream"><Target size={20}/> <LinkText>{t('dreamFund')}</LinkText></LinkItem>
        <LinkItem to="/vault"><Network size={20}/> <LinkText>Nibodh Vault</LinkText></LinkItem>
        
        {/* Mobile par settings ko right side me fit karne ke liye yahi dal diya */}
        <LinkItem to="/settings" className="mobile-only-settings" style={{ display: 'none' }}><Settings size={20}/></LinkItem>
      </Nav>

      {/* Ye PC wala settings hai, mobile pe hide ho jayega */}
      <Nav style={{ flex: 'none', marginTop: 'auto' }} className="desktop-settings">
        <LinkItem to="/settings"><Settings size={20}/> <LinkText>Settings</LinkText></LinkItem>
      </Nav>
      
      {/* Mobile fix ke liye global CSS */}
      <style>{`@media (max-width: 768px) { .desktop-settings { display: none !important; } .mobile-only-settings { display: flex !important; } }`}</style>
    </Aside>
  );
};

export default Sidebar;