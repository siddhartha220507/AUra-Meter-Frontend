import styled from 'styled-components';
import { useState } from 'react';
import { Plus, Mic } from 'lucide-react';

/* ── Styled Components (Same as your code) ──────────────── */
const Wrap = styled.div`display: flex; gap: 8px; align-items: center;`;
const InputWrap = styled.div` flex: 1; position: relative; display: flex; align-items: center; `;
const StyledInput = styled.input` width: 100%; padding: 11px 38px 11px 14px; background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 10px; color: var(--t1); font-family: var(--f-ui); font-size: 0.88rem; outline: none; transition: all 0.22s var(--ease-expo); letter-spacing: 0.2px; &::placeholder { color: var(--t3); } &:focus { border-color: var(--red-border); background: rgba(9,9,15,0.9); box-shadow: 0 0 0 3px rgba(230,57,70,0.07), 0 2px 12px rgba(0,0,0,0.3); } `;
const MicBtn = styled.button` position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: var(--t3); display: flex; align-items: center; padding: 3px; border-radius: 5px; transition: all 0.2s var(--ease-expo); &:hover { color: var(--red); background: var(--red-soft); } `;
const AddBtn = styled.button` width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--red); border: none; border-radius: 10px; color: white; cursor: pointer; flex-shrink: 0; transition: all 0.22s var(--ease-expo); box-shadow: 0 3px 12px var(--red-glow); &:hover { background: #d42f3b; transform: translateY(-1.5px) scale(1.04); box-shadow: 0 6px 20px var(--red-glow); } &:active { transform: scale(0.97); } `;

const TaskInput = ({ onAdd }) => {
  const [val, setVal] = useState('');

  const submit = () => {
    if (!val.trim()) return;
    onAdd?.(val.trim());
    setVal('');
  };

  return (
    <Wrap>
      <InputWrap>
        <StyledInput
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Define your primary objective..."
        />
        <MicBtn type="button" title="Voice input">
          <Mic size={13} strokeWidth={1.5}/>
        </MicBtn>
      </InputWrap>
      <AddBtn onClick={submit}>
        <Plus size={16} strokeWidth={2.5}/>
      </AddBtn>
    </Wrap>
  );
};

export default TaskInput;