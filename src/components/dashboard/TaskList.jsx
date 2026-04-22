import styled, { keyframes, css } from 'styled-components';
import { Check, X, Circle } from 'lucide-react';

/* ── Styled Components (Same as your code) ──────────────── */
const slideIn = keyframes` from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } `;
const Empty = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 0; color: var(--t3); gap: 8px; `;
const EmptyIcon = styled.div` width: 40px; height: 40px; border: 0.5px solid var(--b1); border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface); `;
const EmptyText = styled.div` font-size: 0.8rem; color: var(--t3); letter-spacing: 0.3px; `;
const CountRow = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; `;
const CountLabel = styled.span` font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); `;
const CountPill = styled.span` font-family: var(--f-mono); font-size: 0.65rem; color: var(--red); background: var(--red-soft); border: 0.5px solid var(--red-border); padding: 2px 9px; border-radius: 99px; letter-spacing: 0.5px; `;
const Item = styled.div` display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: 0.5px solid var(--b1); background: var(--bg-surface); margin-bottom: 7px; animation: ${slideIn} 0.28s var(--ease-expo) both; position: relative; transition: all 0.2s var(--ease-expo); cursor: default; &::before { content: ''; position: absolute; left: 0; top: 22%; bottom: 22%; width: 2px; border-radius: 0 2px 2px 0; background: ${p => p.$done ? 'var(--emerald)' : 'var(--red)'}; opacity: ${p => p.$done ? 0.5 : 0.7}; transition: background 0.3s; } &:hover { border-color: var(--b2); background: var(--bg-card-raise); transform: translateX(2px); .del-btn { opacity: 1; } } ${p => p.$done && css`opacity: 0.55;`} `;
const CheckBtn = styled.button` width: 18px; height: 18px; border-radius: 5px; border: 0.5px solid ${p => p.$checked ? 'var(--emerald)' : 'var(--t4)'}; background: ${p => p.$checked ? 'var(--emerald)' : 'transparent'}; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s var(--ease-spring); box-shadow: ${p => p.$checked ? '0 0 8px var(--emerald-glow)' : 'none'}; color: white; &:hover { border-color: var(--emerald); box-shadow: 0 0 8px var(--emerald-glow); transform: scale(1.1); } `;
const TaskText = styled.span` flex: 1; font-size: 0.87rem; color: ${p => p.$done ? 'var(--t3)' : 'var(--t1)'}; text-decoration: ${p => p.$done ? 'line-through' : 'none'}; transition: all 0.25s; letter-spacing: 0.2px; `;
const DelBtn = styled.button` opacity: 0; background: none; border: none; color: var(--t3); cursor: pointer; display: flex; align-items: center; padding: 3px; border-radius: 5px; transition: all 0.18s; &:hover { background: rgba(230,57,70,0.1); color: var(--red); } `;

/* ── Component (No internal state, only props) ───────────── */
const TaskList = ({ tasks = [], onToggle, onDelete }) => {
  // MongoDB schema ke hisab se field ka naam `isCompleted` hai
  const doneCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div>
      <CountRow>
        <CountLabel>Objectives</CountLabel>
        <CountPill>{doneCount}/{tasks.length}</CountPill>
      </CountRow>

      {tasks.length === 0 ? (
        <Empty>
          <EmptyIcon><Circle size={18} strokeWidth={1} style={{color:'var(--t4)'}}/></EmptyIcon>
          <EmptyText>No active objectives</EmptyText>
        </Empty>
      ) : (
        tasks.map(task => (
          // MongoDB uses _id
          <Item key={task._id} $done={task.isCompleted}>
            <CheckBtn $checked={task.isCompleted} onClick={() => onToggle(task._id)}>
              {task.isCompleted && <Check size={10} strokeWidth={3}/>}
            </CheckBtn>
            
            {/* YAHAN FIX KIYA: task.text ki jagah task.title aayega */}
            <TaskText $done={task.isCompleted}>{task.title}</TaskText>
            
            <DelBtn className="del-btn" onClick={() => onDelete(task._id)}>
              <X size={13} strokeWidth={2}/>
            </DelBtn>
          </Item>
        ))
      )}
    </div>
  );
};

export default TaskList;