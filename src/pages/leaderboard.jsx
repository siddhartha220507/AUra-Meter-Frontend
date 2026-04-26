import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { Trophy, Zap, Crown, Target, Activity, X, Award, ShieldCheck, ChevronRight } from 'lucide-react';

import api from '../utils/api';
import Sidebar from '../components/layout/Sidebar';
import { AuraContext } from '../context/AuraContext';

/* ── Layout ──────────────────────────────────────────────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;

/* 🚨 MOBILE FIX: Main Padding */
const Main = styled.main` 
  margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; 
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px 16px 85px; /* Bottom Nav Safe Zone */
  }
`;

const glowRotate = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(245,158,11,0.2)); }
  50% { filter: drop-shadow(0 0 20px rgba(245,158,11,0.5)); }
  100% { filter: drop-shadow(0 0 5px rgba(245,158,11,0.2)); }
`;

/* 🚨 MOBILE FIX: Topbar Stacking */
const Topbar = styled.div` 
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; 
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const HeaderText = styled.div``;
const PreTitle = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; font-weight: 700; color: var(--t1); `;

/* 🚨 MOBILE FIX: Filter Buttons stretched to fill screen */
const FilterRow = styled.div` 
  display: flex; gap: 8px; background: var(--bg-card); padding: 5px; border-radius: 12px; border: 0.5px solid var(--b1); 
  @media (max-width: 768px) { width: 100%; justify-content: space-between; }
`;
const FilterBtn = styled.button` 
  padding: 8px 18px; border-radius: 9px; border: none; background: ${p => p.$active ? 'var(--amber-soft)' : 'transparent'}; color: ${p => p.$active ? 'var(--amber)' : 'var(--t3)'}; font-family: var(--f-ui); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; 
  @media (max-width: 768px) { flex: 1; text-align: center; } /* Dono buttons barabar jagah lenge */
`;

/* ── Table Styling ───────────────────────────────────────── */
const BoardCard = styled.div` 
  background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 24px; padding: 24px; box-shadow: var(--shadow-card); overflow: hidden; 
  @media (max-width: 768px) { padding: 16px; border-radius: 16px; }
`;

/* 🚨 MOBILE FIX: Padding aur gap reduced for tight fit */
const ItemWrap = styled(motion.div)` 
  display: flex; align-items: center; padding: 14px 20px; border-radius: 16px; margin-bottom: 8px; cursor: pointer; border: 0.5px solid transparent; transition: all 0.25s var(--ease-expo);
  
  &:hover { background: var(--bg-card-raise); border-color: var(--b2); transform: scale(1.01); }
  ${p => p.$isMe && css`background: rgba(230,57,70,0.04); border-color: rgba(230,57,70,0.15);`}
  
  /* Highlight Top 3 */
  ${p => p.$rank === 1 && css`background: linear-gradient(90deg, rgba(245,158,11,0.08), transparent); border-color: rgba(245,158,11,0.2); animation: ${glowRotate} 3s infinite;`}
  ${p => p.$rank === 2 && css`background: linear-gradient(90deg, rgba(156,163,175,0.05), transparent); border-color: rgba(156,163,175,0.15);`}
  ${p => p.$rank === 3 && css`background: linear-gradient(90deg, rgba(180,83,9,0.05), transparent); border-color: rgba(180,83,9,0.15);`}

  @media (max-width: 768px) { padding: 12px 10px; gap: 8px; border-radius: 12px; }
`;

const RankBox = styled.div` width: 45px; display: flex; align-items: center; justify-content: center; font-family: var(--f-brand); font-weight: 900; font-size: 1.1rem; color: ${p => p.$color}; @media (max-width: 768px) { width: 35px; font-size: 1rem; }`;
const AgentInfo = styled.div` flex: 1; display: flex; align-items: center; gap: 15px; @media (max-width: 768px) { gap: 10px; }`;
const Avatar = styled.div` width: 42px; height: 42px; border-radius: 12px; background: ${p => p.$grad}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-family: var(--f-brand); font-size: 0.8rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); @media (max-width: 768px) { width: 36px; height: 36px; border-radius: 10px; }`;
const Name = styled.div` 
  font-size: 1rem; font-weight: 700; color: var(--t1); 
  span { font-size: 0.65rem; color: var(--t4); margin-left: 8px; font-family: var(--f-mono); } 
  @media (max-width: 768px) { font-size: 0.85rem; }
`;

/* ── Modal (User Stats) ──────────────────────────────────── */
const Overlay = styled(motion.div)` position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; `;

/* 🚨 MOBILE FIX: Modal width and padding adjust */
const Modal = styled(motion.div)` 
  width: 100%; max-width: 420px; background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 32px; padding: 40px 32px; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5); 
  @media (max-width: 768px) { max-width: 95%; padding: 32px 20px; border-radius: 24px; }
`;

const CloseBtn = styled.button` position: absolute; top: 20px; right: 20px; background: var(--bg-card-raise); border: 0.5px solid var(--b1); color: var(--t3); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; &:hover { color: var(--red); border-color: var(--red-border); } `;

const ModalHero = styled.div` display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; `;
const LargeAvatar = styled.div` width: 80px; height: 80px; border-radius: 24px; background: ${p => p.$grad}; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; font-family: var(--f-brand); box-shadow: 0 10px 30px rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.1); `;
const ModalName = styled.h2` font-family: var(--f-brand); font-size: 1.5rem; color: var(--t1); margin-bottom: 4px; `;

const StatGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 12px; `;
const MiniCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 6px; `;
const StatVal = styled.div` font-family: var(--f-mono); font-size: 1.2rem; font-weight: 500; color: ${p => p.$color || 'var(--t1)'}; `;
const StatLabel = styled.div` font-size: 0.6rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t4); `;

/* ── Constants ───────────────────────────────────────────── */
const TOP_COLORS = ['#fbbf24', '#9ca3af', '#b45309', 'var(--t4)'];
const GRADS = ['linear-gradient(135deg,#f59e0b,#92400e)', 'linear-gradient(135deg,#64748b,#334155)', 'linear-gradient(135deg,#b45309,#78350f)', 'linear-gradient(135deg,#3b82f6,#1e3a8a)'];

const Leaderboard = () => {
  const { user } = useContext(AuraContext);
  const [filter, setFilter] = useState('weekly');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // Clicked user state

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard?type=${filter}`);
      setLeaders(res.data);
    } catch (err) { toast.error("Arena sync failed"); }
    setLoading(false);
  };

  useEffect(() => { fetchRankings(); }, [filter]);

  return (
    <Shell>
      <Sidebar />
      <Main>
        <Topbar>
          <HeaderText>
            <PreTitle><Award size={12}/> Competitive Protocol</PreTitle>
            <Title>Arena Rankings</Title>
          </HeaderText>
          <FilterRow>
            <FilterBtn $active={filter === 'weekly'} onClick={() => setFilter('weekly')}>Weekly</FilterBtn>
            <FilterBtn $active={filter === 'allTime'} onClick={() => setFilter('allTime')}>All-Time</FilterBtn>
          </FilterRow>
        </Topbar>

        <BoardCard>
          {loading ? (
            <div style={{padding:'60px', textAlign:'center', color:'var(--t4)'}}>Scanning Arena...</div>
          ) : (
            leaders.map((agent, i) => {
              const rank = i + 1;
              const isTop3 = rank <= 3;
              const grad = GRADS[i] || 'linear-gradient(135deg, #1e1e2e, #0f0f1a)';
              const isMe = user?._id === agent._id;

              return (
                <ItemWrap 
                  key={agent._id} 
                  $rank={rank} 
                  $isMe={isMe}
                  onClick={() => setSelected({ ...agent, rank, grad })}
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <RankBox $color={TOP_COLORS[i] || 'var(--t4)'}>
                    {rank === 1 ? <Crown size={20} fill="#fbbf24"/> : rank}
                  </RankBox>
                  <AgentInfo>
                    <Avatar $grad={grad}>{agent.name.slice(0,2).toUpperCase()}</Avatar>
                    <Name>{agent.name} {isMe && <span>(YOU)</span>}</Name>
                  </AgentInfo>
                  <div style={{width:'100px', textAlign:'right'}}>
                    <div style={{fontFamily:'var(--f-mono)', color:'var(--emerald)', fontSize:'1.1rem'}}>
                      {filter === 'weekly' ? agent.weeklyPoints : agent.allTimePoints}
                    </div>
                    <div style={{fontSize:'0.55rem', color:'var(--t4)', textTransform:'uppercase', letterSpacing:'1px'}}>Points</div>
                  </div>
                  <ChevronRight size={16} color="var(--t4)" style={{marginLeft:'20px'}}/>
                </ItemWrap>
              );
            })
          )}
        </BoardCard>

        {/* ── Stats Modal ── */}
        <AnimatePresence>
          {selected && (
            <Overlay 
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSelected(null)}
            >
              <Modal 
                onClick={e => e.stopPropagation()}
                initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              >
                <CloseBtn onClick={() => setSelected(null)}><X size={16}/></CloseBtn>
                
                <ModalHero>
                  <LargeAvatar $grad={selected.grad}>{selected.name.slice(0,2).toUpperCase()}</LargeAvatar>
                  <ModalName>{selected.name}</ModalName>
                  <div style={{display:'flex', gap:'8px', marginTop:'4px'}}>
                    <LevelPill style={{background:'var(--violet-soft)', color:'var(--violet)', padding:'4px 12px', borderRadius:'8px', fontSize:'0.7rem', fontFamily:'var(--f-mono)'}}>
                      <Zap size={10} fill="currentColor"/> LEVEL {selected.auraLevel}
                    </LevelPill>
                    <LevelPill style={{background:'var(--amber-soft)', color:'var(--amber)', padding:'4px 12px', borderRadius:'8px', fontSize:'0.7rem', fontFamily:'var(--f-mono)'}}>
                      RANK #{selected.rank}
                    </LevelPill>
                  </div>
                </ModalHero>

                <StatGrid>
                  <MiniCard>
                    <StatLabel><Target size={10}/> Weekly Aura</StatLabel>
                    <StatVal $color="var(--emerald)">{selected.weeklyPoints}</StatVal>
                  </MiniCard>
                  <MiniCard>
                    <StatLabel><Activity size={10}/> All-Time XP</StatLabel>
                    <StatVal $color="var(--violet)">{selected.allTimePoints}</StatVal>
                  </MiniCard>
                  <MiniCard style={{gridColumn:'span 2'}}>
                    <StatLabel><ShieldCheck size={10}/> Consistency Score</StatLabel>
                    <div style={{display:'flex', alignItems:'center', gap:'12px', marginTop:'4px'}}>
                       <div style={{flex:1, height:'6px', background:'var(--b1)', borderRadius:'10px', overflow:'hidden'}}>
                          <div style={{width:`${Math.min((selected.allTimePoints/500)*100, 100)}%`, height:'100%', background:'var(--emerald)', boxShadow:'0 0 10px var(--emerald-glow)'}} />
                       </div>
                       <StatVal style={{fontSize:'0.9rem'}}>{Math.min((selected.allTimePoints/500)*100, 100).toFixed(0)}%</StatVal>
                    </div>
                  </MiniCard>
                </StatGrid>
                
                <div style={{marginTop:'24px', textAlign:'center', color:'var(--t4)', fontSize:'0.7rem', fontFamily:'var(--f-mono)', letterSpacing:'1px'}}>
                  AGENT PROTOCOL SINCE 2026
                </div>
              </Modal>
            </Overlay>
          )}
        </AnimatePresence>
      </Main>
    </Shell>
  );
};

const LevelPill = styled.div` display: flex; align-items: center; gap: 5px; `;

export default Leaderboard;