import styled, { keyframes } from 'styled-components';
import { useMemo, useState, useEffect } from 'react';
import { Calendar, Activity, TrendingUp, Target } from 'lucide-react';
import api from '../../utils/api';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Styled Components ───────────────────────────────────── */
const Card = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 22px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; animation: ${fadeUp} 0.5s var(--ease-expo) 0.15s both; transition: border-color 0.3s var(--ease-expo), box-shadow 0.3s; &:hover { border-color: rgba(16,185,129,0.2); box-shadow: var(--shadow-card), 0 0 0 1px rgba(16,185,129,0.1), 0 12px 40px rgba(16,185,129,0.06); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--emerald), transparent); opacity: 0.4; } `;
const Header = styled.div` display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; `;
const TitleGroup = styled.div``;
const Title = styled.div` font-size: 0.82rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t2); display: flex; align-items: center; gap: 7px; `;
const MonthBadge = styled.div` font-family: var(--f-mono); font-size: 0.68rem; color: var(--emerald); background: var(--emerald-soft); border: 0.5px solid rgba(16,185,129,0.2); border-radius: 6px; padding: 3px 10px; letter-spacing: 1px; margin-top: 4px; display: inline-block; `;
const CalGrid = styled.div`margin-top: 6px;`;
const WeekRow = styled.div` display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 5px; `;
const WeekLabel = styled.div` font-family: var(--f-mono); font-size: 0.58rem; color: var(--t4); text-align: center; letter-spacing: 0.5px; `;
const DaysGrid = styled.div` display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; `;

const COLORS = ['rgba(255,255,255,0.04)', 'rgba(16,185,129,0.18)', 'rgba(16,185,129,0.38)', 'rgba(16,185,129,0.62)', '#10b981'];
const GLOW = ['none', 'none', 'none', '0 0 6px rgba(16,185,129,0.25)', '0 0 10px rgba(16,185,129,0.5)'];

const DayCell = styled.div` aspect-ratio: 1; border-radius: 5px; background: ${p => p.$empty ? 'transparent' : COLORS[p.$level]}; box-shadow: ${p => p.$empty ? 'none' : GLOW[p.$level]}; position: relative; cursor: ${p => p.$empty ? 'default' : 'pointer'}; border: 0.5px solid ${p => p.$today ? 'rgba(230,57,70,0.6)' : p.$empty ? 'transparent' : 'rgba(255,255,255,0.04)'}; transition: transform 0.18s var(--ease-spring), box-shadow 0.18s var(--ease-expo); ${p => p.$future && 'opacity: 0.25;'} &:hover:not([data-empty]) { transform: scale(1.25); box-shadow: ${p => p.$level > 0 ? '0 0 14px rgba(16,185,129,0.65)' : '0 0 8px rgba(255,255,255,0.1)'}; z-index: 2; } `;
const DayNum = styled.div` position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-family: var(--f-mono); color: ${p => p.$level >= 3 ? 'rgba(255,255,255,0.9)' : 'var(--t3)'}; pointer-events: none; `;
const Tooltip = styled.div` position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--bg-card-raise); border: 0.5px solid var(--b2); border-radius: 8px; padding: 6px 10px; font-size: 0.65rem; color: var(--t1); white-space: nowrap; pointer-events: none; z-index: 10; box-shadow: var(--shadow-raise); font-family: var(--f-mono); `;
const LegendRow = styled.div` display: flex; align-items: center; gap: 5px; margin-top: 14px; justify-content: flex-end; `;
const LegendLabel = styled.span` font-size: 0.58rem; color: var(--t4); letter-spacing: 0.5px; `;
const LegendDot = styled.div` width: 8px; height: 8px; border-radius: 2px; background: ${p => COLORS[p.$level]}; box-shadow: ${p => GLOW[p.$level]}; `;
const StatsRow = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; `;
const StatBox = styled.div` background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 4px; transition: all 0.22s var(--ease-expo); &:hover { border-color: rgba(16,185,129,0.2); background: rgba(16,185,129,0.04); transform: translateY(-1px); } `;
const StatIcon = styled.div`color: var(--t3);`;
const StatNum = styled.div` font-family: var(--f-mono); font-size: 1rem; font-weight: 500; color: var(--emerald); line-height: 1; `;
const StatName = styled.div` font-size: 0.58rem; letter-spacing: 1px; text-transform: uppercase; color: var(--t3); `;

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ── Helper: REAL Data calculation ─────────────────────────── */
function buildMonthGrid(data = { sessions: [], tasks: [] }) {
  const { sessions = [], tasks = [] } = data; 
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1; 

  const dayStats = {}; 

  const validSessions = Array.isArray(sessions) ? sessions : [];
  validSessions.forEach(s => {
    const d = new Date(s.createdAt);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!dayStats[day]) dayStats[day] = { mins: 0, tasks: 0 };
      dayStats[day].mins += (s.durationSet || 0);
    }
  });

  const validTasks = Array.isArray(tasks) ? tasks : [];
  validTasks.forEach(t => {
    const d = new Date(t.updatedAt || t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!dayStats[day]) dayStats[day] = { mins: 0, tasks: 0 };
      dayStats[day].tasks += 1;
    }
  });

  const cells = [];
  for (let e = 0; e < firstDay; e++) cells.push({ empty: true });

  for (let d = 1; d <= daysInMonth; d++) {
    const future = d > today;
    const stats = dayStats[d] || { mins: 0, tasks: 0 };
    
    let level = 0;
    if (!future) {
      const score = (stats.mins / 30) + (stats.tasks * 2); 
      
      if (score > 0) level = 1;
      if (score >= 3) level = 2;
      if (score >= 6) level = 3;
      if (score >= 10) level = 4;
    }

    cells.push({ day: d, level, today: d === today, future, ...stats });
  }

  return { cells, month: MONTH_NAMES[month], year, today };
}

/* ── Component ───────────────────────────────────────────── */
const ActivityHeatmap = ({ refreshTrigger }) => { // PROP ADDED HERE
  const [hovered, setHovered] = useState(null);
  const [activityData, setActivityData] = useState({ sessions: [], tasks: [] });

  useEffect(() => {
    api.get('/focus/activity')
      .then(res => {
        setActivityData(res.data);
      })
      .catch(err => console.error("Could not fetch heatmap data:", err));
  }, [refreshTrigger]); // DEPENDENCY ARRAY MEIN ADD KIYA HAI

  const data = useMemo(() => buildMonthGrid(activityData), [activityData]);

  const activeDays  = data.cells.filter(c => !c.empty && !c.future && c.level > 0).length;
  const consistency = data.today > 0 ? Math.round((activeDays / data.today) * 100) : 0;
  
  const avgLevel = activeDays > 0
    ? (data.cells.filter(c => !c.empty && c.level > 0).reduce((a, c) => a + c.level, 0) / activeDays).toFixed(1)
    : '0.0';

  return (
    <Card>
      <Header>
        <TitleGroup>
          <Title>
            <Activity size={14} strokeWidth={1.5} style={{color:'var(--emerald)'}}/>
            Focus Activity
          </Title>
          <MonthBadge>{data.month} {data.year}</MonthBadge>
        </TitleGroup>
      </Header>

      <CalGrid>
        <WeekRow>
          {WEEK_DAYS.map(d => <WeekLabel key={d}>{d}</WeekLabel>)}
        </WeekRow>

        <DaysGrid>
          {data.cells.map((cell, i) => {
            if (cell.empty) return <DayCell key={`e${i}`} $empty data-empty />;
            return (
              <DayCell
                key={cell.day}
                $level={cell.level}
                $today={cell.today}
                $future={cell.future}
                onMouseEnter={() => setHovered(cell)}
                onMouseLeave={() => setHovered(null)}
              >
                <DayNum $level={cell.level}>{cell.day}</DayNum>
                {hovered?.day === cell.day && !cell.empty && (
                  <Tooltip>
                    Day {cell.day} — {cell.future ? 'Upcoming' : `${cell.mins} mins, ${cell.tasks} tasks`}
                  </Tooltip>
                )}
              </DayCell>
            );
          })}
        </DaysGrid>
      </CalGrid>

      <LegendRow>
        <LegendLabel>None</LegendLabel>
        {[0,1,2,3,4].map(l => <LegendDot key={l} $level={l}/>)}
        <LegendLabel>Max</LegendLabel>
      </LegendRow>

      <StatsRow>
        <StatBox>
          <StatIcon><Calendar size={13} strokeWidth={1.5}/></StatIcon>
          <StatNum>{activeDays}</StatNum>
          <StatName>Active Days</StatName>
        </StatBox>
        <StatBox>
          <StatIcon><TrendingUp size={13} strokeWidth={1.5}/></StatIcon>
          <StatNum>{consistency}%</StatNum>
          <StatName>Consistency</StatName>
        </StatBox>
        <StatBox>
          <StatIcon><Target size={13} strokeWidth={1.5}/></StatIcon>
          <StatNum>{avgLevel}x</StatNum>
          <StatName>Avg Intensity</StatName>
        </StatBox>
      </StatsRow>
    </Card>
  );
};

export default ActivityHeatmap;