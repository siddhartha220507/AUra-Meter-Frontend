import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuraContext } from '../../context/AuraContext';
import { Timer, Flame, Zap, Ticket, Bell, ChevronRight } from 'lucide-react';
import { useAuraVoice } from '../../hooks/useAuraVoice';

import api from '../../utils/api';
import Sidebar         from '../layout/Sidebar';
import ActivityHeatmap from './ActivityHeatmap';
import FocusTimer      from './FocusTimer';
import TaskList        from './TaskList';
import TaskInput       from './TaskInput';
import AuraMeter       from './AuraMeter';

/* ── Layout & Styled Components ──────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;
const Main = styled.main` margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; max-width: 100%; `;
const Topbar = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; animation: fade-up 0.4s var(--ease-expo) both; `;
const GreetGroup = styled.div``;
const GreetPre = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--red); margin-bottom: 3px; `;
const GreetName = styled.h1` font-family: var(--f-brand); font-size: 1.4rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; `;
const TopActions = styled.div` display: flex; align-items: center; gap: 10px; `;
const IconBtn = styled.button` width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 9px; color: var(--t2); cursor: pointer; position: relative; transition: all 0.2s var(--ease-expo); &:hover { border-color: var(--b2); color: var(--t1); background: var(--bg-card-raise); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.3); } `;
const NotifDot = styled.span` position: absolute; top: 6px; right: 6px; width: 5px; height: 5px; background: var(--red); border-radius: 50%; box-shadow: 0 0 5px var(--red-glow); `;
const AvatarBtn = styled.button` height: 36px; display: flex; align-items: center; gap: 8px; background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 10px; color: var(--t2); cursor: pointer; padding: 0 12px 0 6px; transition: all 0.2s var(--ease-expo); &:hover { border-color: var(--b2); color: var(--t1); background: var(--bg-card-raise); } `;
const AvatarImg = styled.div` width: 26px; height: 26px; border-radius: 7px; background: linear-gradient(135deg, var(--red), var(--violet)); display: flex; align-items: center; justify-content: center; font-family: var(--f-brand); font-size: 0.5rem; color: white; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.4); `;
const AvatarName = styled.span` font-size: 0.82rem; font-weight: 600; color: var(--t1); letter-spacing: 0.2px; `;
const StatStrip = styled.div` display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; `;
const StatCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 14px; padding: 16px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; cursor: default; animation: fade-up 0.42s var(--ease-expo) ${p => p.$delay}ms both; transition: all 0.25s var(--ease-expo); &::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: ${p => p.$accent}; opacity: 0; transition: opacity 0.25s; } &:hover { border-color: ${p => p.$borderHover}; transform: translateY(-2px); box-shadow: var(--shadow-card), ${p => p.$hoverShadow}; &::after { opacity: 1; } .stat-icon { transform: scale(1.1); } } `;
const StatIcon = styled.div` color: ${p => p.$color}; margin-bottom: 10px; display: flex; transition: transform 0.2s var(--ease-spring); `;
const StatVal = styled.div` font-family: var(--f-mono); font-size: 1.5rem; font-weight: 500; color: ${p => p.$color}; line-height: 1; letter-spacing: -0.5px; `;
const StatName = styled.div` font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-top: 4px; `;
const StatDelta = styled.div` position: absolute; top: 14px; right: 14px; font-family: var(--f-mono); font-size: 0.6rem; color: var(--emerald); letter-spacing: 0.5px; `;
const Grid = styled.div` display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; @media (max-width: 1200px) { grid-template-columns: 1fr 1fr; } @media (max-width: 768px) { grid-template-columns: 1fr; } `;
const Col = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const TaskCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 22px; flex: 1; box-shadow: var(--shadow-card); position: relative; overflow: hidden; animation: fade-up 0.5s var(--ease-expo) 0.08s both; transition: border-color 0.3s var(--ease-expo), box-shadow 0.3s; &:hover { border-color: var(--red-border); box-shadow: var(--shadow-card), 0 0 0 1px var(--red-border); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--red), transparent); opacity: 0.5; } `;
const CardTitle = styled.div` font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t2); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; `;
const Separator = styled.div` height: 0.5px; background: var(--b1); margin: 14px 0; `;
const ArenaCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 22px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; animation: fade-up 0.5s var(--ease-expo) 0.12s both; transition: border-color 0.3s; &:hover { border-color: rgba(245,158,11,0.2); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: 0.4; } `;
const LeaderItem = styled.div` display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; margin-bottom: 5px; cursor: pointer; transition: all 0.2s var(--ease-expo); border: 0.5px solid transparent; &:hover { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.12); transform: translateX(3px); .arrow { opacity: 1; transform: translateX(0); } } `;
const RankNum = styled.div` font-family: var(--f-mono); font-size: 0.65rem; color: var(--t4); width: 16px; text-align: center; flex-shrink: 0; `;
const LeaderAvatar = styled.div` width: 30px; height: 30px; border-radius: 8px; background: ${p => p.$grad}; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; color: white; font-family: var(--f-brand); flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.35); `;
const LeaderName = styled.div` flex: 1; font-size: 0.85rem; font-weight: 600; color: var(--t1); letter-spacing: 0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const LeaderLevel = styled.div` font-family: var(--f-mono); font-size: 0.68rem; color: var(--amber); letter-spacing: 0.5px; `;
const ArrowIcon = styled.div` opacity: 0; transform: translateX(-4px); transition: all 0.2s var(--ease-expo); color: var(--t3); `;

/* ── Data ────────────────────────────────────────────────── */
const STATS = [
  { icon: Timer,  val: '45m',  name: 'Time Wallet',  color: 'var(--red)',     delay: 0,   accent: 'var(--red)',     borderHover: 'var(--red-border)',     hoverShadow: '0 8px 24px rgba(230,57,70,0.12)' },
  { icon: Flame,  val: '0',    name: 'Day Streak',   color: 'var(--amber)',   delay: 50,  accent: 'var(--amber)',   borderHover: 'rgba(245,158,11,0.2)',   hoverShadow: '0 8px 24px rgba(245,158,11,0.1)' },
  { icon: Zap,    val: '1',    name: 'Aura Level',   color: 'var(--violet)',  delay: 100, accent: 'var(--violet)', borderHover: 'var(--violet-border)',   hoverShadow: '0 8px 24px rgba(139,92,246,0.1)' },
  { icon: Ticket, val: '0',    name: 'Cheat Passes', color: 'var(--emerald)', delay: 150, accent: 'var(--emerald)', borderHover: 'rgba(16,185,129,0.2)',   hoverShadow: '0 8px 24px rgba(16,185,129,0.08)' },
];

/* ── Component ───────────────────────────────────────────── */
const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, setUser, t } = useContext(AuraContext);
  const { triggerVoice } = useAuraVoice();
  const initials = user?.name ? user.name.slice(0,2).toUpperCase() : 'AG';

  const stats = STATS.map((s, i) => {
    if (i === 1) return { ...s, val: String(user?.currentStreak ?? 0) };
    if (i === 2) return { ...s, val: String(user?.auraLevel ?? 1) };
    if (i === 3) return { ...s, val: String(user?.cheatPassesAvailable ?? 0) };
    return s;
  });

  // STATES
  const [tasks, setTasks] = useState([]);
  const [leaders, setLeaders] = useState([]); // 🚀 YAHAN REAL LEADERS AAYENGE

  // 1. Fetch Tasks & Leaders
  const fetchData = async () => {
    try {
      // Fetch Tasks
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);

      // Fetch Arena Leaders
      const leadersRes = await api.get('/leaderboard');
      
      // Data format karo (Gradient aur Initials add karo based on rank)
      const gradients = [
        'linear-gradient(135deg,#e63946,#9f0000)', // Rank 1: Red
        'linear-gradient(135deg,#8b5cf6,#4c1d95)', // Rank 2: Purple
        'linear-gradient(135deg,#f59e0b,#92400e)', // Rank 3: Amber
        'linear-gradient(135deg,#10b981,#064e3b)'  // Rank 4+: Emerald
      ];

      const formattedLeaders = leadersRes.data.map((agent, index) => ({
        _id: agent._id,
        rank: index + 1,
        name: agent.name,
        level: agent.auraLevel || 1,
        init: agent.name ? agent.name.slice(0, 2).toUpperCase() : 'AG',
        grad: gradients[index] || gradients[3]
      }));

      setLeaders(formattedLeaders);

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if(err.response?.status === 401) {
         toast.error("Session expired. Please log in again.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]); // Jab refresh trigger ho toh leaderboard bhi update ho!
  // 🚨 THE AUTOMATED PUNISHMENT ENGINE (Cron Job Listener)
  useEffect(() => {
    if (user?.missedYesterday) {
      // 1. Audio Notification Trigger karo (Gaali padegi!)
      triggerVoice('streak_break');

      // 2. Toast Alert dikhao
      toast.error("You missed yesterday's objectives. Streak reset to 0!", {
        icon: '⚠️',
        style: { border: '1px solid var(--red)' }
      });

      // 3. Frontend par user state update karo taaki loop mein gaali na baje
      setUser(prev => ({ ...prev, missedYesterday: false, currentStreak: 0 }));

      // 4. Backend se 'missedYesterday' ka flag hata do
      api.put('/users/profile', { missedYesterday: false }).catch(err => console.error("Could not reset flag:", err));
    }
  }, [user?.missedYesterday]);

  // 2. Add Task
  const handleAddTask = async (text) => {
    const toastId = toast.loading('Adding objective...');
    try {
      const res = await api.post('/tasks', { title: text });
      setTasks([res.data, ...tasks]);
      toast.success('Objective added', { id: toastId });
    } catch (err) {
      toast.error('Failed to add objective', { id: toastId });
    }
  };

  // 3. Complete Task (Gamified Logic)
  const handleToggleTask = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}/complete`);

      setTasks(tasks.map(t => 
        t._id === id ? { ...t, isCompleted: true } : t
      ));

      if (res.data.auraLevel) {
        setUser(prevUser => ({
          ...prevUser,
          auraLevel: res.data.auraLevel,
          weeklyPoints: res.data.weeklyPoints,
          currentStreak: res.data.currentStreak
        }));
      }
      
      toast.success('Objective Completed! +10 XP 🔥');
      setRefreshTrigger(prev => prev + 1);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // 4. Delete Task
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Objective removed');
    } catch (err) {
      toast.error('Failed to delete objective');
    }
  };

  return (
    <Shell>
      <Sidebar />
      <Main>
        <Topbar>
          <GreetGroup>
            <GreetPre>Focus Protocol Active</GreetPre>
            <GreetName>{user?.name || 'Agent'}</GreetName>
          </GreetGroup>
          <TopActions>
            <IconBtn onClick={() => triggerVoice('missed_task')} title="Simulate Missed Task"><Zap size={15} color="var(--amber)"/></IconBtn>
            <IconBtn onClick={() => triggerVoice('streak_break')} title="Simulate Broken Streak"><Flame size={15} color="var(--red)"/></IconBtn>
            <IconBtn><Bell size={15} strokeWidth={1.5}/><NotifDot/></IconBtn>
            <AvatarBtn>
              <AvatarImg>{initials}</AvatarImg>
              <AvatarName>{user?.name?.split(' ')[0] || 'Agent'}</AvatarName>
              <ChevronRight size={13} color="var(--t3)"/>
            </AvatarBtn>
          </TopActions>
        </Topbar>

        <StatStrip>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <StatCard key={i} $delay={s.delay} $accent={s.accent} $borderHover={s.borderHover} $hoverShadow={s.hoverShadow}>
                <StatIcon $color={s.color} className="stat-icon"><Icon size={16} strokeWidth={1.5}/></StatIcon>
                <StatVal $color={s.color}>{s.val}</StatVal>
                <StatName>{s.name}</StatName>
                {i === 0 && <StatDelta>↑ 3h today</StatDelta>}
              </StatCard>
            );
          })}
        </StatStrip>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16,1,0.3,1] }}
        >
          <Grid>
            <Col>
              <FocusTimer onSessionComplete={() => setRefreshTrigger(prev => prev + 1)} />
              <AuraMeter />
            </Col>

            <Col>
              <TaskCard>
                <CardTitle>Active {t('tasks')}</CardTitle>
                <TaskInput onAdd={handleAddTask} />
                <Separator />
                <TaskList 
                  tasks={tasks} 
                  onToggle={handleToggleTask} 
                  onDelete={handleDeleteTask} 
                />
              </TaskCard>
            </Col>

            <Col>
              <ActivityHeatmap refreshTrigger={refreshTrigger} />
              <ArenaCard>
                <CardTitle>{t('leaderboard')}</CardTitle>
                
                {/* 🚀 YAHAN MAP KIYA REAL DATA KO (Sirf top 4 dikhayenge dashboard pe) */}
                {leaders.length === 0 ? (
                  <div style={{ color: 'var(--t4)', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>
                    Fetching top agents...
                  </div>
                ) : (
                  leaders.slice(0, 4).map(p => (
                    <LeaderItem key={p._id}>
                      <RankNum>#{p.rank}</RankNum>
                      <LeaderAvatar $grad={p.grad}>{p.init}</LeaderAvatar>
                      <LeaderName>{p.name}</LeaderName>
                      <LeaderLevel>Lv {p.level}</LeaderLevel>
                      <ArrowIcon className="arrow"><ChevronRight size={13} strokeWidth={1.5}/></ArrowIcon>
                    </LeaderItem>
                  ))
                )}
                
              </ArenaCard>
            </Col>
          </Grid>
        </motion.div>
      </Main>
    </Shell>
  );
};

export default Dashboard;