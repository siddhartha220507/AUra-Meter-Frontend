import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Sword, Target, Settings, Zap } from 'lucide-react';
import { useContext } from 'react';
import { AuraContext } from '../../context/AuraContext'; // Context Import Kiya

const Aside = styled.aside` position: fixed; top: 0; left: 0; bottom: 0; width: var(--sidebar-w); background: var(--bg-base); border-right: 0.5px solid var(--b1); display: flex; flex-direction: column; padding: 24px 0; z-index: 50; `;
const LogoWrap = styled.div` display: flex; align-items: center; gap: 10px; padding: 0 24px; margin-bottom: 40px; `;
const LogoIcon = styled.div` width: 32px; height: 32px; border-radius: 8px; background: var(--red); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px var(--red-glow); `;
const LogoText = styled.div` font-family: var(--f-brand); font-size: 1.2rem; font-weight: 900; letter-spacing: 3px; color: var(--t1); `;
const Nav = styled.nav` display: flex; flex-direction: column; gap: 6px; padding: 0 16px; flex: 1; `;
const LinkItem = styled(NavLink)` display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; color: var(--t3); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.2s var(--ease-expo); border: 1px solid transparent; &:hover { color: var(--t1); background: var(--bg-card); } &.active { color: var(--red); background: var(--red-soft); border-color: var(--red-border); box-shadow: 0 4px 12px rgba(0,0,0,0.1); } `;

const Sidebar = () => {
  // 🚨 Yahan se Dictionary Function nikala
  const { t } = useContext(AuraContext);

  return (
    <Aside>
      <LogoWrap>
        <LogoIcon><Zap size={16} color="white" strokeWidth={2.5}/></LogoIcon>
        <LogoText>AURA</LogoText>
      </LogoWrap>
      
      <Nav>
        {/* 🚨 NAMS KO t() FUNCTION SE REPLACE KIYA */}
        <LinkItem to="/dashboard"><LayoutDashboard size={18}/> {t('dashboard')}</LinkItem>
        <LinkItem to="/arena"><Sword size={18}/> {t('arena')}</LinkItem>
        <LinkItem to="/leaderboard"><Trophy size={18}/> {t('leaderboard')}</LinkItem>
        <LinkItem to="/dream"><Target size={18}/> {t('dreamFund')}</LinkItem>
      </Nav>

      <Nav style={{ flex: 'none', marginTop: 'auto' }}>
        <LinkItem to="/settings"><Settings size={18}/> Settings</LinkItem>
      </Nav>
    </Aside>
  );
};

export default Sidebar;