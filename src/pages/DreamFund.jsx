import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { Target, Plus, Zap, TrendingUp, Sparkles, Check, Trash2, Rocket, Gamepad2, Plane, Laptop, Camera } from 'lucide-react';

import api from '../utils/api';
import Sidebar from '../components/layout/Sidebar';
import { AuraContext } from '../context/AuraContext';

/* ── Layout ──────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;
const Main = styled.main` margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; `;
const HeaderGroup = styled.div` margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; `;
const HeaderText = styled.div``;
const PreTitle = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--emerald); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; `;

const AddBtn = styled.button` background: var(--emerald); color: white; border: none; padding: 10px 20px; border-radius: 12px; font-family: var(--f-brand); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(16,185,129,0.3); &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); background: #059669; } `;

/* ── Stats Strip ──────── */
const StatGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; `;
const StatCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 20px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; &::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, ${p => p.$color} 0%, transparent 60%); opacity: 0.05; pointer-events: none; } `;
const StatLabel = styled.div` font-family: var(--f-mono); font-size: 0.65rem; color: var(--t3); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; `;
const StatVal = styled.div` font-size: 2rem; font-weight: 700; font-family: var(--f-mono); color: ${p => p.$color || 'var(--t1)'}; `;

/* ── Dream Grid ──────── */
const DreamsContainer = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; `;

const DreamCard = styled(motion.div)` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 24px; padding: 24px; position: relative; overflow: hidden; box-shadow: var(--shadow-card); transition: all 0.3s; &:hover { border-color: ${p => p.$achieved ? 'var(--emerald)' : 'var(--violet)'}; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${p => p.$achieved ? 'var(--emerald)' : 'linear-gradient(90deg, var(--violet), var(--red))'}; opacity: 0.8; } `;

const CardTop = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; `;
const IconBox = styled.div` width: 48px; height: 48px; border-radius: 14px; background: ${p => p.$achieved ? 'var(--emerald-soft)' : 'var(--bg-card-raise)'}; border: 1px solid ${p => p.$achieved ? 'rgba(16,185,129,0.3)' : 'var(--b2)'}; display: flex; align-items: center; justify-content: center; color: ${p => p.$achieved ? 'var(--emerald)' : 'var(--t2)'}; box-shadow: 0 4px 12px rgba(0,0,0,0.2); `;
const DeleteBtn = styled.button` background: none; border: none; color: var(--t4); cursor: pointer; padding: 4px; border-radius: 8px; transition: all 0.2s; &:hover { color: var(--red); background: var(--red-soft); } `;

const DreamTitle = styled.h3` font-size: 1.1rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; `;
const ProgressText = styled.div` font-family: var(--f-mono); font-size: 0.75rem; color: var(--t3); display: flex; justify-content: space-between; margin-bottom: 8px; span { color: ${p => p.$achieved ? 'var(--emerald)' : 'var(--violet)'}; font-weight: 700; } `;

const ProgressBarWrap = styled.div` width: 100%; height: 10px; background: var(--bg-surface); border-radius: 10px; overflow: hidden; border: 0.5px solid var(--b1); margin-bottom: 20px; `;
const ProgressBar = styled.div` height: 100%; width: ${p => p.$pct}%; background: ${p => p.$achieved ? 'var(--emerald)' : 'linear-gradient(90deg, var(--violet), var(--red))'}; border-radius: 10px; transition: width 0.8s var(--ease-spring); box-shadow: ${p => p.$achieved ? '0 0 10px var(--emerald-glow)' : '0 0 10px rgba(139,92,246,0.4)'}; `;

const FundArea = styled.div` display: flex; gap: 8px; `;
const FundInput = styled.input` flex: 1; background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 10px; padding: 0 14px; color: var(--t1); font-family: var(--f-mono); font-size: 0.9rem; outline: none; &:focus { border-color: var(--violet); } `;
const FundBtn = styled.button` background: var(--bg-card-raise); border: 0.5px solid var(--b2); color: var(--t1); padding: 10px 16px; border-radius: 10px; font-family: var(--f-brand); font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; &:hover:not(:disabled) { background: var(--violet); color: white; border-color: var(--violet); } &:disabled { opacity: 0.5; cursor: not-allowed; } `;
const AchievedBadge = styled.div` width: 100%; padding: 10px; text-align: center; background: var(--emerald-soft); color: var(--emerald); border: 0.5px solid rgba(16,185,129,0.3); border-radius: 10px; font-family: var(--f-mono); font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 6px; `;

/* ── Modal (Add Goal) ──────── */
const Overlay = styled(motion.div)` position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; `;
const Modal = styled(motion.div)` width: 100%; max-width: 400px; background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 24px; padding: 32px; `;
const InputGroup = styled.div` margin-bottom: 20px; `;
const Label = styled.label` display: block; font-size: 0.7rem; color: var(--t3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; `;
const Input = styled.input` width: 100%; background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 12px; padding: 12px 16px; color: var(--t1); font-size: 0.95rem; outline: none; &:focus { border-color: var(--emerald); } `;
const IconGrid = styled.div` display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; `;
const IconSelect = styled.button` aspect-ratio: 1; border-radius: 12px; background: ${p => p.$selected ? 'var(--emerald-soft)' : 'var(--bg-input)'}; border: 1px solid ${p => p.$selected ? 'var(--emerald)' : 'var(--b1)'}; color: ${p => p.$selected ? 'var(--emerald)' : 'var(--t3)'}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; &:hover { background: var(--bg-card-raise); } `;
const ModalActions = styled.div` display: flex; gap: 12px; margin-top: 32px; `;
const ModalBtn = styled.button` flex: 1; padding: 12px; border-radius: 12px; font-family: var(--f-brand); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; `;
const CancelBtn = styled(ModalBtn)` background: transparent; border: 1px solid var(--b2); color: var(--t2); &:hover { background: var(--bg-card-raise); } `;
const SaveBtn = styled(ModalBtn)` background: var(--emerald); border: none; color: white; &:hover { background: #059669; } `;

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