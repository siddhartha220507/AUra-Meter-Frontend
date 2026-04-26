import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { Target, Plus, Zap, TrendingUp, Sparkles, Check, Trash2, Rocket, Gamepad2, Plane, Laptop, Camera } from 'lucide-react';

import api from '../utils/api';
import Sidebar from '../components/layout/Sidebar';
import { AuraContext } from '../context/AuraContext';

const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;
const Main = styled.main` margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; max-width: 100%; @media (max-width: 768px) { margin-left: 0; padding: 20px 16px 48px; } `;
const HeaderText = styled.div``;
const PreTitle = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; `;
const AddBtn = styled.button` background: var(--emerald); color: white; border: none; padding: 12px 20px; border-radius: 10px; font-family: var(--f-brand); font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.3); &:hover { background: #059669; transform: translateY(-2px); } `;

/* 🚨 MOBILE FIX: Header ko stack kiya */
const HeaderGroup = styled.div` 
  margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; 
  @media (max-width: 768px) {
    flex-direction: column; align-items: flex-start; gap: 16px;
  }
`;

/* 🚨 MOBILE FIX: 3 Stats ko 1 line mein kiya */
const StatGrid = styled.div` 
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; 
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

/* 🚨 MOBILE FIX: Cards ki minimum width 320px se 280px ki taaki chote phone par aaye */
const DreamsContainer = styled.div` 
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; 
`;

/* 🚨 MOBILE FIX: Modal screen ke bahar na jaye */
const Modal = styled(motion.div)` 
  width: 95%; max-width: 400px; background: var(--bg-surface); border: 0.5px solid var(--b1); 
  border-radius: 24px; padding: 32px; 
  @media (max-width: 768px) { padding: 24px; }
`;

const StatCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 14px; padding: 16px; box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: 10px; `;
const StatLabel = styled.div` font-size: 0.7rem; color: var(--t3); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; `;
const StatVal = styled.div` font-family: var(--f-mono); font-size: 1.6rem; font-weight: 500; color: ${p => p.$color}; `;

const DreamCard = styled(motion.div)` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 16px; padding: 20px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; transition: all 0.3s; ${p => p.$achieved && `border-color: var(--emerald); background: rgba(16,185,129,0.05);`} &:hover { border-color: var(--amber); transform: translateY(-4px); } `;
const CardTop = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; `;
const IconBox = styled.div` width: 44px; height: 44px; border-radius: 10px; background: ${p => p.$achieved ? 'var(--emerald)' : 'var(--amber)'}; display: flex; align-items: center; justify-content: center; color: white; `;
const DeleteBtn = styled.button` background: transparent; border: none; color: var(--t3); cursor: pointer; transition: color 0.2s; &:hover { color: var(--red); } `;

const DreamTitle = styled.h3` font-size: 1rem; font-weight: 700; color: var(--t1); margin-bottom: 8px; `;
const ProgressText = styled.div` display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--t3); margin-bottom: 8px; ${p => p.$achieved && `color: var(--emerald);`} `;
const ProgressBarWrap = styled.div` width: 100%; height: 6px; background: var(--b1); border-radius: 3px; overflow: hidden; margin-bottom: 12px; `;
const ProgressBar = styled.div` height: 100%; width: ${p => p.$pct}%; background: ${p => p.$achieved ? 'var(--emerald)' : 'var(--amber)'}; transition: width 0.4s; `;
const AchievedBadge = styled.div` background: var(--emerald); color: white; padding: 10px; border-radius: 8px; text-align: center; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; `;
const FundArea = styled.div` display: flex; gap: 8px; `;
const FundInput = styled.input` flex: 1; background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 8px; padding: 8px 12px; color: var(--t1); font-size: 0.85rem; outline: none; &:focus { border-color: var(--amber); } `;
const FundBtn = styled.button` background: var(--amber); color: var(--bg-void); border: none; border-radius: 8px; padding: 8px 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s; &:hover:not(:disabled) { background: #d97706; } &:disabled { opacity: 0.5; cursor: not-allowed; } `;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; `;
const InputGroup = styled.div` display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; `;
const Label = styled.label` font-size: 0.75rem; color: var(--t2); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; `;
const Input = styled.input` background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 10px; padding: 12px 14px; color: var(--t1); font-size: 0.9rem; outline: none; transition: all 0.2s; &:focus { border-color: var(--emerald); box-shadow: 0 0 0 2px rgba(16,185,129,0.1); } `;
const IconGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; `;
const IconSelect = styled.button` background: ${p => p.$selected ? 'var(--emerald)' : 'var(--bg-input)'}; border: 0.5px solid ${p => p.$selected ? 'var(--emerald)' : 'var(--b1)'}; color: ${p => p.$selected ? 'white' : 'var(--t2)'}; border-radius: 10px; padding: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; &:hover { border-color: var(--emerald); } `;
const ModalActions = styled.div` display: flex; gap: 12px; margin-top: 24px; `;
const CancelBtn = styled.button` flex: 1; background: transparent; border: 0.5px solid var(--b1); color: var(--t2); border-radius: 10px; padding: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; &:hover { background: var(--bg-input); } `;
const SaveBtn = styled.button` flex: 1; background: var(--emerald); border: none; color: white; border-radius: 10px; padding: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.3); &:hover { background: #059669; } `;

const ICONS = { Target, Rocket, Gamepad2, Plane, Laptop, Camera };

/* ── Component ───────────────────────────────────────────── */
const DreamFund = () => {
  const { user } = useContext(AuraContext);
  const [dreams, setDreams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundAmounts, setFundAmounts] = useState({}); // Local state for each input
  
  // Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newIcon, setNewIcon] = useState('Target');

  const fetchDreams = async () => {
    try {
      const res = await api.get('/dreams');
      setDreams(res.data);
    } catch (err) { toast.error("Failed to load Dream Fund"); }
  };

  useEffect(() => { fetchDreams(); }, []);

  const handleAddDream = async () => {
    if (!newTitle || !newTarget) return toast.error("Please fill all fields");
    try {
      const res = await api.post('/dreams', { title: newTitle, targetAmount: Number(newTarget), icon: newIcon });
      setDreams([res.data, ...dreams]);
      setIsModalOpen(false);
      setNewTitle(''); setNewTarget(''); setNewIcon('Target');
      toast.success("Goal added! Time to work.");
    } catch (err) { toast.error("Could not create goal"); }
  };

  const handleFund = async (id) => {
    const amount = Number(fundAmounts[id]);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    
    // Check if user has enough XP/Aura (Assume user has an 'auraPoints' field, using placeholder logic)
    // if (user.allTimePoints < amount) return toast.error("Not enough XP to fund this!");

    try {
      const res = await api.put(`/dreams/${id}/fund`, { amount });
      setDreams(dreams.map(d => d._id === id ? res.data : d));
      setFundAmounts({...fundAmounts, [id]: ''}); // Clear input
      if (res.data.status === 'ACHIEVED') {
        toast.success(`🎉 BOOM! You achieved: ${res.data.title}!`, { duration: 5000, icon: '🔥' });
      } else {
        toast.success(`Funded ${amount} XP!`);
      }
    } catch (err) { toast.error("Funding failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Abandon this goal?")) return;
    try {
      await api.delete(`/dreams/${id}`);
      setDreams(dreams.filter(d => d._id !== id));
      toast.success("Goal removed.");
    } catch (err) { toast.error("Could not delete"); }
  };

  // Stats calculation
  const totalTarget = dreams.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const totalFunded = dreams.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const achievedCount = dreams.filter(d => d.status === 'ACHIEVED').length;

  return (
    <Shell>
      <Sidebar />
      <Main>
        <HeaderGroup>
          <HeaderText>
            <PreTitle><Sparkles size={12}/> The Motivation Engine</PreTitle>
            <Title>Dream Fund</Title>
          </HeaderText>
          <AddBtn onClick={() => setIsModalOpen(true)}><Plus size={16}/> NEW GOAL</AddBtn>
        </HeaderGroup>

        <StatGrid>
          <StatCard $color="var(--violet)">
            <StatLabel><Target size={14}/> Total Target XP</StatLabel>
            <StatVal $color="var(--violet)">{totalTarget.toLocaleString()}</StatVal>
          </StatCard>
          <StatCard $color="var(--emerald)">
            <StatLabel><TrendingUp size={14}/> XP Funded</StatLabel>
            <StatVal $color="var(--emerald)">{totalFunded.toLocaleString()}</StatVal>
          </StatCard>
          <StatCard $color="var(--amber)">
            <StatLabel><Check size={14}/> Goals Achieved</StatLabel>
            <StatVal $color="var(--amber)">{achievedCount}</StatVal>
          </StatCard>
        </StatGrid>

        {dreams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--t4)', background: 'var(--bg-card)', borderRadius: '24px', border: '0.5px dashed var(--b2)' }}>
            No goals set. What are you working towards?
          </div>
        ) : (
          <DreamsContainer>
            {dreams.map((dream, i) => {
              const IconComp = ICONS[dream.icon] || Target;
              const pct = Math.min((dream.currentAmount / dream.targetAmount) * 100, 100);
              const isAchieved = dream.status === 'ACHIEVED';

              return (
                <DreamCard key={dream._id} $achieved={isAchieved} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <CardTop>
                    <IconBox $achieved={isAchieved}><IconComp size={24} strokeWidth={1.5}/></IconBox>
                    <DeleteBtn onClick={() => handleDelete(dream._id)}><Trash2 size={16}/></DeleteBtn>
                  </CardTop>
                  
                  <DreamTitle>{dream.title}</DreamTitle>
                  <ProgressText $achieved={isAchieved}>
                    <div>Progress</div>
                    <span>{dream.currentAmount} / {dream.targetAmount} XP</span>
                  </ProgressText>
                  
                  <ProgressBarWrap>
                    <ProgressBar $pct={pct} $achieved={isAchieved} />
                  </ProgressBarWrap>

                  {isAchieved ? (
                    <AchievedBadge><Sparkles size={14}/> GOAL UNLOCKED!</AchievedBadge>
                  ) : (
                    <FundArea>
                      <FundInput 
                        type="number" 
                        placeholder="XP amount..." 
                        value={fundAmounts[dream._id] || ''} 
                        onChange={(e) => setFundAmounts({...fundAmounts, [dream._id]: e.target.value})}
                      />
                      <FundBtn onClick={() => handleFund(dream._id)} disabled={!fundAmounts[dream._id]}>
                        <Zap size={14} fill="currentColor"/> FUND
                      </FundBtn>
                    </FundArea>
                  )}
                </DreamCard>
              );
            })}
          </DreamsContainer>
        )}

        {/* ── Add Goal Modal ── */}
        <AnimatePresence>
          {isModalOpen && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Modal initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                <h2 style={{ fontFamily: 'var(--f-brand)', color: 'var(--t1)', marginBottom: '24px' }}>Define Your Reward</h2>
                
                <InputGroup>
                  <Label>Goal Title</Label>
                  <Input placeholder="e.g. Mechanical Keyboard" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </InputGroup>
                
                <InputGroup>
                  <Label>Target Cost (XP)</Label>
                  <Input type="number" placeholder="e.g. 5000" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
                </InputGroup>

                <InputGroup>
                  <Label>Select Icon</Label>
                  <IconGrid>
                    {Object.keys(ICONS).map(iconName => {
                      const CurrentIcon = ICONS[iconName];
                      return (
                        <IconSelect key={iconName} $selected={newIcon === iconName} onClick={() => setNewIcon(iconName)}>
                          <CurrentIcon size={20} strokeWidth={1.5}/>
                        </IconSelect>
                      )
                    })}
                  </IconGrid>
                </InputGroup>

                <ModalActions>
                  <CancelBtn onClick={() => setIsModalOpen(false)}>Cancel</CancelBtn>
                  <SaveBtn onClick={handleAddDream}>Lock Target</SaveBtn>
                </ModalActions>
              </Modal>
            </Overlay>
          )}
        </AnimatePresence>
      </Main>
    </Shell>
  );
};

export default DreamFund;