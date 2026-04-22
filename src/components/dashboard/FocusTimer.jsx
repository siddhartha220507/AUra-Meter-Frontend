import styled, { keyframes, css } from 'styled-components'; 
import { useState, useEffect, useRef, useContext } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { AuraContext } from '../../context/AuraContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

/* ── Animations ─────────────────────────────────────────── */
const glowPulse = keyframes`
  0%,100% { filter: drop-shadow(0 0 6px rgba(230,57,70,0.5)); }
  50%      { filter: drop-shadow(0 0 18px rgba(230,57,70,0.85)); }
`;

const tickIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

/* ── Styled Components ───────────────────────────────────── */
const Card = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 26px 22px 22px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; animation: fade-up 0.45s var(--ease-expo) both; transition: border-color 0.3s var(--ease-expo), box-shadow 0.3s var(--ease-expo); &:hover { border-color: var(--red-border); box-shadow: var(--shadow-card), 0 0 0 1px var(--red-border), 0 12px 40px rgba(230,57,70,0.1); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--red) 50%, transparent 100%); opacity: 0.6; } `;
const Header = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; `;
const TitleGroup = styled.div``;
const Title = styled.div` font-family: var(--f-ui); font-size: 0.82rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t2); `;
const Subtitle = styled.div` font-size: 0.68rem; color: var(--t3); letter-spacing: 0.5px; margin-top: 1px; `;
const SessionBadge = styled.div` display: flex; align-items: center; gap: 5px; background: var(--red-soft); border: 0.5px solid var(--red-border); border-radius: 6px; padding: 4px 10px; font-size: 0.68rem; font-family: var(--f-mono); color: var(--red); letter-spacing: 0.5px; animation: ${tickIn} 0.3s var(--ease-spring); `;
const RingWrap = styled.div` position: relative; width: 172px; height: 172px; margin: 0 auto 22px; `;

const RingSvg = styled.svg` 
  transform: rotate(-90deg); 
  ${p => p.$running ? css`animation: ${glowPulse} 2s ease-in-out infinite;` : 'animation: none;'}
  transition: filter 0.5s; 
`;

const TimeCenter = styled.div` position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; `;
const TimeText = styled.div` font-family: var(--f-mono); font-size: 2.2rem; font-weight: 500; color: var(--t1); letter-spacing: 2px; line-height: 1; transition: color 0.3s; ${p => p.$urgent && 'color: var(--red);'} `;
const TimeLabel = styled.div` font-size: 0.6rem; letter-spacing: 3px; text-transform: uppercase; color: var(--t3); `;
const ProgressText = styled.div` font-size: 0.65rem; color: ${p => p.$running ? 'var(--red)' : 'var(--t3)'}; font-family: var(--f-mono); letter-spacing: 1px; margin-top: 3px; transition: color 0.3s; `;
const Controls = styled.div` display: flex; gap: 8px; `;
const PrimaryBtn = styled.button` flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--red); border: none; border-radius: 12px; color: white; font-family: var(--f-brand); font-size: 0.62rem; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: all 0.22s var(--ease-expo); box-shadow: 0 4px 16px var(--red-glow); &:hover { background: #d42f3b; transform: translateY(-1.5px); box-shadow: 0 8px 24px var(--red-glow); } &:active { transform: translateY(0); } `;
const IconBtn = styled.button` width: 44px; display: flex; align-items: center; justify-content: center; padding: 12px; background: var(--bg-card-raise); border: 0.5px solid var(--b1); border-radius: 12px; color: var(--t2); cursor: pointer; transition: all 0.22s var(--ease-expo); &:hover { border-color: var(--b2); color: var(--t1); background: var(--b1); } `;
const PresetRow = styled.div` display: flex; gap: 6px; margin-top: 12px; `;
const Preset = styled.button` flex: 1; padding: 6px 0; background: ${p => p.$active ? 'var(--red-soft)' : 'transparent'}; border: 0.5px solid ${p => p.$active ? 'var(--red-border)' : 'var(--b1)'}; border-radius: 8px; color: ${p => p.$active ? 'var(--red)' : 'var(--t3)'}; font-family: var(--f-mono); font-size: 0.7rem; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s var(--ease-expo); &:hover { border-color: var(--red-border); color: var(--red); background: var(--red-soft); } `;

/* ── Component ───────────────────────────────────────────── */
const PRESETS = [1, 25, 45, 60]; 

const FocusTimer = ({ onSessionComplete }) => {
  const [preset, setPreset]     = useState(45);
  const [seconds, setSeconds]   = useState(45 * 60);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const [sessionId, setSessionId] = useState(null); 
  const ref = useRef();

  const total = preset * 60;

  const toggleTimer = async () => {
    if (!running) {
      const tid = toast.loading('Initiating Deep Work...');
      try {
        const res = await api.post('/focus/start', {
          taskName: "Deep Work Protocol",
          durationSet: preset
        });
        setSessionId(res.data.session._id); 
        setRunning(true);
        toast.success(`Protocol Active for ${preset}m. Focus!`, { id: tid });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to start session', { id: tid });
      }
    } else {
      setRunning(false);
    }
  };

  const handleSessionComplete = async () => {
    if (!sessionId) return;
    const tid = toast.loading('Syncing Focus Data...');
    try {
      await api.put(`/focus/${sessionId}/complete`);
      setSessions(n => n + 1);
      toast.success('Session Completed! Aura Protected.', { id: tid });
      setSessionId(null); 
      
      onSessionComplete?.(); // Safe to call here
      
    } catch (err) {
      toast.error('Failed to sync session', { id: tid });
    }
  };

  const changePreset = (mins) => {
    setRunning(false);
    setPreset(mins);
    setSeconds(mins * 60);
    setSessionId(null);
  };

  // 🚨 FIX 1: Timer Engine (Only handles counting down safely)
  useEffect(() => {
    if (running && seconds > 0) {
      ref.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running, seconds]);

  // 🚨 FIX 2: Trigger Engine (Fires when it hits 0)
  useEffect(() => {
    if (running && seconds === 0) {
      setRunning(false);
      handleSessionComplete();
      setSeconds(total); // Reset UI
    }
  }, [seconds, running, total, sessionId]); // Depend on seconds

  const mm   = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss   = String(seconds % 60).padStart(2, '0');
  const pct  = 1 - seconds / total;
  const r    = 74;
  const circ = 2 * Math.PI * r;
  const urgent = seconds < 60 && running;

  return (
    <Card>
      <Header>
        <TitleGroup>
          <Title>Deep Work Protocol</Title>
          <Subtitle>Pomodoro — focused sessions</Subtitle>
        </TitleGroup>
        {sessions > 0 && (
          <SessionBadge>
            <Coffee size={11} />
            {sessions}×
          </SessionBadge>
        )}
      </Header>

      <RingWrap>
        <RingSvg $running={running} width="172" height="172" viewBox="0 0 172 172">
          <circle cx="86" cy="86" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7"/>
          <circle cx="86" cy="86" r={r} fill="none" stroke="rgba(230,57,70,0.08)" strokeWidth="12" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
          <circle cx="86" cy="86" r={r} fill="none" stroke={urgent ? '#ff2d3a' : 'var(--red)'} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
        </RingSvg>

        <TimeCenter>
          <TimeText $urgent={urgent}>{mm}:{ss}</TimeText>
          <TimeLabel>remaining</TimeLabel>
          <ProgressText $running={running}>
            {Math.round(pct * 100)}% complete
          </ProgressText>
        </TimeCenter>
      </RingWrap>

      <Controls>
        <PrimaryBtn onClick={toggleTimer}>
          {running
            ? <><Pause size={13} strokeWidth={2.5}/> PAUSE</>
            : <><Play  size={13} strokeWidth={2.5} fill="white"/> INITIATE</>
          }
        </PrimaryBtn>
        <IconBtn onClick={() => { setRunning(false); setSeconds(total); }}>
          <RotateCcw size={15} strokeWidth={1.5} />
        </IconBtn>
      </Controls>

      <PresetRow>
        {PRESETS.map(p => (
          <Preset key={p} $active={preset === p} onClick={() => changePreset(p)}>
            {p}m
          </Preset>
        ))}
      </PresetRow>
    </Card>
  );
};

export default FocusTimer;