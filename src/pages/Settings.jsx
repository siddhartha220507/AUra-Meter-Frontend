import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Palette, Lock, LogOut, Save, Shield, Terminal, Moon, Headphones } from 'lucide-react';

import api from '../utils/api';
import Sidebar from '../components/layout/Sidebar';
import { AuraContext } from '../context/AuraContext';

/* ── Layout ──────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;
const Main = styled.main` margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; display: flex; justify-content: center; `;
const SettingsContainer = styled.div` width: 100%; max-width: 700px; display: flex; flex-direction: column; gap: 32px; `;

const Topbar = styled.div` display: flex; align-items: center; justify-content: space-between; animation: fade-up 0.4s var(--ease-expo) both; `;
const HeaderText = styled.div``;
const PreTitle = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--t3); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; `;

/* ── Sections ──────── */
const Section = styled(motion.div)` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 24px; padding: 32px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; `;
const SectionHeader = styled.div` display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 0.5px solid var(--b1); `;
const SectionTitle = styled.h2` font-size: 1.1rem; font-weight: 700; color: var(--t1); `;

const FormGroup = styled.div` display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; `;
const InputWrap = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const Label = styled.label` font-size: 0.75rem; color: var(--t3); text-transform: uppercase; letter-spacing: 1px; font-family: var(--f-mono); `;
const Input = styled.input` background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 12px; padding: 14px 16px; color: var(--t1); font-size: 0.95rem; outline: none; transition: all 0.2s; &:focus { border-color: var(--violet); box-shadow: 0 0 0 2px rgba(139,92,246,0.1); } &:disabled { opacity: 0.6; cursor: not-allowed; } `;

const SaveBtn = styled.button` background: var(--violet); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-family: var(--f-brand); font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(139,92,246,0.3); align-self: flex-start; &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139,92,246,0.4); background: #7c3aed; } `;

/* ── Theme Grid ──────── */
const ThemeGrid = styled.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; `;
const ThemeCard = styled.div` border: 1px solid ${p => p.$active ? p.$color : 'var(--b1)'}; background: ${p => p.$active ? `rgba(${p.$rgb}, 0.05)` : 'var(--bg-input)'}; border-radius: 16px; padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 16px; &:hover { border-color: ${p => p.$color}; transform: translateY(-2px); } `;
const ThemeIcon = styled.div` width: 40px; height: 40px; border-radius: 10px; background: ${p => p.$color}; display: flex; align-items: center; justify-content: center; color: var(--bg-void); box-shadow: 0 4px 12px rgba(${p => p.$rgb}, 0.3); `;
const ThemeInfo = styled.div` flex: 1; `;
const ThemeName = styled.div` font-weight: 700; color: var(--t1); margin-bottom: 4px; font-size: 0.9rem; `;
const ThemeDesc = styled.div` font-size: 0.7rem; color: var(--t4); line-height: 1.4; `;

/* ── Danger Zone ──────── */
const DangerZone = styled(Section)` border-color: rgba(230,57,70,0.3); background: rgba(230,57,70,0.02); `;
const LogoutBtn = styled.button` background: transparent; color: var(--red); border: 1px solid var(--red-border); padding: 12px 24px; border-radius: 12px; font-family: var(--f-brand); font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; &:hover { background: var(--red); color: white; box-shadow: 0 4px 14px var(--red-glow); } `;

const Settings = () => {
  const { user, setUser } = useContext(AuraContext);
  const [name, setName] = useState(user?.name || '');
  const [theme, setTheme] = useState(user?.themePreference || 'minimalist-dark');
  const [voice, setVoice] = useState(user?.voiceGuide || 'anime');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTheme(user.themePreference || 'minimalist-dark');
      setVoice(user.voiceGuide || 'anime');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    const tid = toast.loading('Updating Agent Intel...');
    setLoading(true);
    try {
      // 🚨 API Call mein voice send kiya
      const res = await api.put('/users/profile', { name, themePreference: theme, voiceGuide: voice });
      
      // 🚨 User context update kiya
      setUser({ ...user, name: res.data.name, themePreference: res.data.themePreference, voiceGuide: res.data.voiceGuide });
      toast.success('Profile updated successfully!', { id: tid });
    } catch (err) {
      toast.error('Failed to update profile', { id: tid });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login
  };

  const THEMES = [
    { id: 'minimalist-dark', name: 'Minimalist Dark', desc: 'Clean, professional, and distraction-free.', icon: Moon, color: '#9ca3af', rgb: '156,163,175' },
    { id: 'neon-cyber', name: 'Neon Cyberpunk', desc: 'High-contrast glowing aesthetics.', icon: Terminal, color: '#10b981', rgb: '16,185,129' },
  ];

  return (
    <Shell>
      <Sidebar />
      <Main>
        <SettingsContainer>
          <Topbar>
            <HeaderText>
              <PreTitle><Shield size={12}/> System Configuration</PreTitle>
              <Title>Agent Settings</Title>
            </HeaderText>
          </Topbar>

          {/* Profile Section */}
          <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeader>
              <User size={20} color="var(--violet)" />
              <SectionTitle>Agent Intel</SectionTitle>
            </SectionHeader>
            <FormGroup>
              <InputWrap>
                <Label>Display Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your alias" />
              </InputWrap>
              <InputWrap>
                <Label>Agent ID (Email)</Label>
                <Input value={user?.email || 'agent@aura.network'} disabled />
                <div style={{fontSize: '0.65rem', color: 'var(--t4)', marginTop: '4px'}}>Email cannot be changed once registered.</div>
              </InputWrap>
            </FormGroup>
            <SaveBtn onClick={handleUpdateProfile} disabled={loading}>
              <Save size={16} /> {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </SaveBtn>
          </Section>

          {/* Theme Section */}
          <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionHeader>
              <Palette size={20} color="var(--emerald)" />
              <SectionTitle>Interface Protocol</SectionTitle>
            </SectionHeader>
            <ThemeGrid>
              {THEMES.map(t => {
                const Icon = t.icon;
                return (
                  <ThemeCard 
                    key={t.id} 
                    $active={theme === t.id} 
                    $color={t.color} 
                    $rgb={t.rgb}
                    onClick={() => setTheme(t.id)}
                  >
                    <ThemeIcon $color={t.color} $rgb={t.rgb}><Icon size={20} strokeWidth={2}/></ThemeIcon>
                    <ThemeInfo>
                      <ThemeName>{t.name}</ThemeName>
                      <ThemeDesc>{t.desc}</ThemeDesc>
                    </ThemeInfo>
                  </ThemeCard>
                )
              })}
            </ThemeGrid>
          </Section>

          {/* 🚨 NAYA VOICE GUIDE SECTION */}
          <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionHeader>
              <Headphones size={20} color="var(--amber)" />
              <SectionTitle>AI Voice Persona</SectionTitle>
            </SectionHeader>
            <ThemeGrid>
              <ThemeCard $active={voice === 'anime'} $color="var(--amber)" $rgb="245,158,11" onClick={() => setVoice('anime')}>
                <ThemeInfo>
                  <ThemeName>Anime Companion</ThemeName>
                  <ThemeDesc>Energetic & motivating (Senpai!)</ThemeDesc>
                </ThemeInfo>
              </ThemeCard>
              <ThemeCard $active={voice === 'hardcore'} $color="var(--red)" $rgb="230,57,70" onClick={() => setVoice('hardcore')}>
                <ThemeInfo>
                  <ThemeName>Hardcore Drill</ThemeName>
                  <ThemeDesc>Aggressive accountability. No excuses.</ThemeDesc>
                </ThemeInfo>
              </ThemeCard>
              <ThemeCard $active={voice === 'calm-mentor'} $color="var(--emerald)" $rgb="16,185,129" onClick={() => setVoice('calm-mentor')}>
                <ThemeInfo>
                  <ThemeName>Calm Mentor</ThemeName>
                  <ThemeDesc>Peaceful, mindful, and focused guidance.</ThemeDesc>
                </ThemeInfo>
              </ThemeCard>
            </ThemeGrid>
          </Section>

          {/* Danger Zone */}
          <DangerZone initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionHeader style={{ borderColor: 'rgba(230,57,70,0.2)' }}>
              <Lock size={20} color="var(--red)" />
              <SectionTitle style={{ color: 'var(--red)' }}>Danger Zone</SectionTitle>
            </SectionHeader>
            <p style={{ color: 'var(--t3)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Disconnecting from the Aura Network will pause all active sessions. You will need your credentials to re-enter the Arena.
            </p>
            <LogoutBtn onClick={handleLogout}>
              <LogOut size={16} /> DISCONNECT SYSTEM
            </LogoutBtn>
          </DangerZone>

        </SettingsContainer>
      </Main>
    </Shell>
  );
};

export default Settings;