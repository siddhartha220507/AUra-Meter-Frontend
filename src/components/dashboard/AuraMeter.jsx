import styled, { keyframes } from 'styled-components';
import { useContext } from 'react';
import { AuraContext } from '../../context/AuraContext';
import { Flame, Star, TrendingUp } from 'lucide-react';

const spin    = keyframes`to { transform: rotate(360deg); }`;
const spinRev = keyframes`to { transform: rotate(-360deg); }`;
const fadeUp  = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Card ────────────────────────────────────────────────── */
const Card = styled.div`
  background: var(--bg-card);
  border: 0.5px solid var(--b1);
  border-radius: 20px;
  padding: 22px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.5s var(--ease-expo) 0.1s both;
  transition: border-color 0.3s var(--ease-expo), box-shadow 0.3s;

  &:hover {
    border-color: var(--violet-border);
    box-shadow: var(--shadow-card), 0 0 0 1px var(--violet-border), 0 12px 40px rgba(139,92,246,0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--violet), transparent);
    opacity: 0.5;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const CardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--t2);
`;

const LevelTag = styled.div`
  font-family: var(--f-mono);
  font-size: 0.65rem;
  color: var(--violet);
  background: var(--violet-soft);
  border: 0.5px solid var(--violet-border);
  border-radius: 6px;
  padding: 3px 10px;
  letter-spacing: 1px;
`;

/* ── Ring ────────────────────────────────────────────────── */
const RingWrap = styled.div`
  position: relative;
  width: 148px; height: 148px;
  margin: 0 auto 18px;
`;

const OuterRing = styled.svg`
  position: absolute;
  inset: -10px;
  animation: ${spin} 12s linear infinite;
  opacity: 0.25;
`;

const InnerRing = styled.svg`
  position: absolute;
  inset: -4px;
  animation: ${spinRev} 8s linear infinite;
  opacity: 0.18;
`;

const MainRing = styled.svg`transform: rotate(-90deg);`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LevelNum = styled.div`
  font-family: var(--f-brand);
  font-size: 2.5rem;
  font-weight: 900;
  color: #a78bfa;
  line-height: 1;
  letter-spacing: -1px;
  text-shadow: 0 0 24px rgba(167,139,250,0.45);
`;

const LevelWord = styled.div`
  font-size: 0.58rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--t3);
  margin-top: 3px;
`;

/* ── XP bar ──────────────────────────────────────────────── */
const XpSection = styled.div`margin-bottom: 16px;`;

const XpRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
`;

const XpLabel = styled.span`
  font-size: 0.68rem;
  color: var(--t3);
  letter-spacing: 0.5px;
`;

const XpValue = styled.span`
  font-family: var(--f-mono);
  font-size: 0.72rem;
  color: #a78bfa;
`;

const BarTrack = styled.div`
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 99px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg, var(--violet), #a78bfa, #c4b5fd);
  border-radius: 99px;
  box-shadow: 0 0 10px rgba(167,139,250,0.5);
  transition: width 1.2s var(--ease-expo);
  position: relative;
  overflow: hidden;

  /* Shimmer */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: shimmer 2.5s ease-in-out infinite;
  }
`;

/* ── Stats ───────────────────────────────────────────────── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const Stat = styled.div`
  background: var(--bg-surface);
  border: 0.5px solid var(--b1);
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
  transition: all 0.22s var(--ease-expo);
  cursor: default;

  &:hover {
    background: var(--b3);
    border-color: var(--b2);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  color: ${p => p.$color || 'var(--t2)'};
`;

const StatVal = styled.div`
  font-family: var(--f-mono);
  font-size: 1rem;
  font-weight: 500;
  color: ${p => p.$color || 'var(--t1)'};
  line-height: 1;
`;

const StatKey = styled.div`
  font-size: 0.58rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--t3);
  margin-top: 3px;
`;

/* ── Component ───────────────────────────────────────────── */
const AuraMeter = () => {
  const { user } = useContext(AuraContext);
  const level   = user?.auraLevel    ?? 1;
  const streak  = user?.currentStreak ?? 0;
  const longest = user?.longestStreak ?? 0;
  const xp = 0; const maxXp = 100;
  const pct = Math.round((xp / maxXp) * 100);

  const r = 60; const circ = 2 * Math.PI * r;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aura Meter</CardTitle>
        <LevelTag>LVL {level}</LevelTag>
      </CardHeader>

      <RingWrap>
        {/* Outer spinning dashes */}
        <OuterRing width="168" height="168" viewBox="0 0 168 168">
          <circle cx="84" cy="84" r="80" fill="none"
            stroke="#8b5cf6" strokeWidth="1"
            strokeDasharray="3 9" strokeLinecap="round"/>
        </OuterRing>

        {/* Inner spinning dots */}
        <InnerRing width="156" height="156" viewBox="0 0 156 156">
          <circle cx="78" cy="78" r="74" fill="none"
            stroke="#8b5cf6" strokeWidth="0.8"
            strokeDasharray="1 14" strokeLinecap="round"/>
        </InnerRing>

        {/* Main progress arc */}
        <MainRing width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={r} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth="7"/>
          <circle cx="74" cy="74" r={r} fill="none"
            stroke="rgba(139,92,246,0.12)" strokeWidth="14"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)}
            style={{ transition: 'stroke-dashoffset 1.2s var(--ease-expo)' }}
          />
          <circle cx="74" cy="74" r={r} fill="none"
            stroke="url(#violetGrad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct/100)}
            style={{ transition: 'stroke-dashoffset 1.2s var(--ease-expo)' }}
          />
          <defs>
            <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6d28d9"/>
              <stop offset="100%" stopColor="#c4b5fd"/>
            </linearGradient>
          </defs>
        </MainRing>

        <Center>
          <LevelWord>Level</LevelWord>
          <LevelNum>{level}</LevelNum>
          <LevelWord style={{marginTop:'2px', color:'#6d5acd', fontSize:'0.6rem'}}>
            {xp} / {maxXp} XP
          </LevelWord>
        </Center>
      </RingWrap>

      <XpSection>
        <XpRow>
          <XpLabel>Experience Points</XpLabel>
          <XpValue>{pct}%</XpValue>
        </XpRow>
        <BarTrack><BarFill $pct={pct} /></BarTrack>
      </XpSection>

      <StatsGrid>
        <Stat>
          <StatIcon $color="var(--red)"><Flame size={14} strokeWidth={1.5}/></StatIcon>
          <StatVal $color="var(--red)">{streak}</StatVal>
          <StatKey>Streak</StatKey>
        </Stat>
        <Stat>
          <StatIcon $color="var(--emerald)"><TrendingUp size={14} strokeWidth={1.5}/></StatIcon>
          <StatVal $color="var(--emerald)">{longest}</StatVal>
          <StatKey>Best</StatKey>
        </Stat>
        <Stat>
          <StatIcon $color="#a78bfa"><Star size={14} strokeWidth={1.5}/></StatIcon>
          <StatVal $color="#a78bfa">{level}</StatVal>
          <StatKey>Rank</StatKey>
        </Stat>
      </StatsGrid>
    </Card>
  );
};

export default AuraMeter;