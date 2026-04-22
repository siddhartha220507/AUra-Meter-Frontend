import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronRight, Sparkles, Target, Zap, ShieldAlert, Check } from 'lucide-react';

import api from '../utils/api';
import { AuraContext } from '../context/AuraContext';

/* ── Layout & Animations ──────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; `;
const ProgressLine = styled.div` position: fixed; top: 0; left: 0; height: 4px; background: var(--violet); width: ${p => (p.$step / 3) * 100}%; transition: width 0.4s var(--ease-expo); box-shadow: 0 0 15px var(--violet-glow); `;

const Container = styled(motion.div)` width: 100%; max-width: 500px; text-align: center; `;
const Question = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; color: var(--t1); margin-bottom: 12px; `;
const SubText = styled.p` color: var(--t3); font-size: 0.9rem; margin-bottom: 32px; font-family: var(--f-mono); text-transform: uppercase; letter-spacing: 1px; `;

/* ── Step 1: Options ──────── */
const OptionsGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 16px; `;
const OptionCard = styled.button` background: ${p => p.$active ? 'var(--violet-soft)' : 'var(--bg-card)'}; border: 1px solid ${p => p.$active ? 'var(--violet)' : 'var(--b1)'}; border-radius: 16px; padding: 24px 16px; color: ${p => p.$active ? 'var(--t1)' : 'var(--t2)'}; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 12px; &:hover { border-color: var(--violet); transform: translateY(-3px); } `;

/* ── Step 2: Autocomplete ──────── */
const SearchBox = styled.div` position: relative; width: 100%; `;
const Input = styled.input` width: 100%; background: var(--bg-card); border: 1px solid var(--b1); border-radius: 16px; padding: 18px 24px; color: var(--t1); font-size: 1.1rem; outline: none; transition: border-color 0.3s; &:focus { border-color: var(--violet); } `;
const SuggestList = styled.div` position: absolute; top: 110%; left: 0; right: 0; background: var(--bg-card-raise); border: 1px solid var(--b2); border-radius: 12px; overflow: hidden; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); `;
const SuggestItem = styled.div` padding: 12px 20px; color: var(--t2); cursor: pointer; text-align: left; &:hover { background: var(--violet-soft); color: var(--t1); } `;

/* ── Step 3: Themes ──────── */
const ThemeCard = styled(OptionCard)` flex-direction: row; text-align: left; padding: 20px; grid-column: span 2; gap: 20px; `;

const ContinueBtn = styled.button` background: var(--violet); color: white; border: none; padding: 16px 32px; border-radius: 14px; font-family: var(--f-brand); font-size: 0.9rem; font-weight: 700; cursor: pointer; margin-top: 40px; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px var(--violet-glow); transition: all 0.3s; &:hover { transform: scale(1.05); } &:disabled { opacity: 0.5; cursor: not-allowed; } `;

/* ── Data ──────── */
const FRUSTRATIONS = [
  { id: 'doomscroll', label: 'Doomscrolling', icon: ShieldAlert },
  { id: 'procrastinate', label: 'Procrastination', icon: Zap },
  { id: 'consistency', label: 'Inconsistency', icon: Target },
  { id: 'burnout', label: 'Mental Fog', icon: Sparkles },
];

const PASSIONS_SUGGESTIONS = ['One Piece', 'Naruto', 'Solo Leveling', 'Matrix', 'Batman', 'Interstellar', 'Star Wars', 'Cyberpunk 2077'];

const THEMES = [
  { id: 'minimalist-dark', name: 'Minimalist Peace', desc: 'No distractions. Just focus.', grad: 'linear-gradient(135deg, #1e1e2e, #0f0f1a)' },
  { id: 'neon-cyber', name: 'Neon Cyberpunk', desc: 'Hack your productivity grid.', grad: 'linear-gradient(135deg, #00f0ff, #b026ff)' },
  { id: 'one-piece', name: 'Grand Line Vibe', desc: 'Find your treasure (Success).', grad: 'linear-gradient(135deg, #ff0055, #facc15)' },
];

const VibeCheck = () => {
  const { setUser, user } = useContext(AuraContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // States for answers
  const [kryptonite, setKryptonite] = useState('');
  const [interest, setInterest] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [theme, setTheme] = useState('minimalist-dark');

  const filteredSuggest = PASSIONS_SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(interest.toLowerCase()) && interest.length > 1
  );

  const handleFinish = async () => {
    const tid = toast.loading('Calibrating your domain...');
    try {
      const res = await api.put('/users/profile', {
        mainKryptonite: kryptonite,
        themePreference: theme
      });
      setUser(res.data);
      toast.success("Identity established. Welcome Agent.", { id: tid });
      navigate('/dashboard');
    } catch (err) {
      toast.error("Calibration failed.");
    }
  };

  return (
    <Shell>
      <ProgressLine $step={step} />
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Container key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Question>What holds you back?</Question>
            <SubText>Select your primary friction point</SubText>
            <OptionsGrid>
              {FRUSTRATIONS.map(f => {
                const Icon = f.icon;
                return (
                  <OptionCard key={f.id} $active={kryptonite === f.id} onClick={() => setKryptonite(f.id)}>
                    <Icon size={24} />
                    {f.label}
                  </OptionCard>
                )
              })}
            </OptionsGrid>
            <ContinueBtn onClick={() => setStep(2)} disabled={!kryptonite}>
              CONTINUE <ChevronRight size={18}/>
            </ContinueBtn>
          </Container>
        )}

        {step === 2 && (
          <Container key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Question>What drives your spirit?</Question>
            <SubText>Type an Anime, Movie, or Lore you love</SubText>
            <SearchBox>
              <Input 
                placeholder="e.g. One Piece, Matrix..." 
                value={interest} 
                onChange={e => { setInterest(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
              />
              {showSuggest && filteredSuggest.length > 0 && (
                <SuggestList>
                  {filteredSuggest.map(s => (
                    <SuggestItem key={s} onClick={() => { setInterest(s); setShowSuggest(false); }}>{s}</SuggestItem>
                  ))}
                </SuggestList>
              )}
            </SearchBox>
            <ContinueBtn onClick={() => setStep(3)} disabled={interest.length < 2}>
              ANALYZE VIBE <ChevronRight size={18}/>
            </ContinueBtn>
          </Container>
        )}

        {step === 3 && (
          <Container key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Question>Choose your Domain</Question>
            <SubText>Based on your profile, we recommend:</SubText>
            <OptionsGrid>
              {THEMES.map(t => (
                <ThemeCard key={t.id} $active={theme === t.id} onClick={() => setTheme(t.id)}>
                  <div style={{ width: 12, height: 40, borderRadius: 4, background: t.grad }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--t1)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>{t.desc}</div>
                  </div>
                  {theme === t.id && <Check size={18} color="var(--emerald)" style={{ marginLeft: 'auto' }} />}
                </ThemeCard>
              ))}
            </OptionsGrid>
            <ContinueBtn onClick={handleFinish}>
              ENTER THE ARENA <Sparkles size={18}/>
            </ContinueBtn>
          </Container>
        )}
      </AnimatePresence>
    </Shell>
  );
};

export default VibeCheck;