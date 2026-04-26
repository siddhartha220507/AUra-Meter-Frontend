import styled, { keyframes } from 'styled-components';
import { useState, useContext } from 'react'; // 🚨 FIX: useContext added here
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuraContext } from '../context/AuraContext'; // 🚨 FIX: AuraContext added here
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const floatOrb = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(20px,-18px) scale(1.03); }
  70%      { transform: translate(-14px,10px) scale(0.98); }
`;

const Page = styled.div` min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-void); padding: 48px 20px; position: relative; overflow: hidden; `;
const Orb = styled.div` position: absolute; border-radius: 50%; filter: blur(110px); pointer-events: none; animation: ${floatOrb} ${p => p.$dur} ease-in-out infinite; animation-delay: ${p => p.$delay}; `;
const Card = styled.div` position: relative; z-index: 1; width: 100%; max-width: 400px; background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 20px; padding: 36px 32px; box-shadow: var(--shadow-raise); overflow: hidden; &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--red), var(--violet), transparent); opacity: 0.5; } `;
const BrandRow = styled.div` display: flex; align-items: center; gap: 9px; margin-bottom: 24px; `;
const BrandIcon = styled.div` width: 28px; height: 28px; border-radius: 8px; background: var(--red); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px var(--red-glow); `;
const BrandWord = styled.span` font-family: var(--f-brand); font-size: 1rem; font-weight: 900; letter-spacing: 4px; color: var(--t1); `;
const Title = styled.h2` font-family: var(--f-brand); font-size: 1.3rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; margin-bottom: 3px; `;
const Sub = styled.p` font-size: 0.75rem; color: var(--t3); font-family: var(--f-mono); margin-bottom: 26px; `;
const Label = styled.label` display: block; font-size: 0.62rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t2); margin-bottom: 6px; font-family: var(--f-mono); `;
const FieldWrap = styled.div`position: relative; margin-bottom: 14px;`;
const Input = styled.input` width: 100%; padding: 11px 38px 11px 13px; background: var(--bg-input); border: 0.5px solid var(--b1); border-radius: 10px; color: var(--t1); font-family: var(--f-ui); font-size: 0.88rem; outline: none; transition: all 0.22s var(--ease-expo); letter-spacing: 0.2px; &::placeholder { color: var(--t3); } &:focus { border-color: var(--red-border); background: rgba(9,9,15,0.95); box-shadow: 0 0 0 3px rgba(230,57,70,0.07); } `;
const EyeBtn = styled.button` position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--t3); display: flex; transition: color 0.18s; &:hover { color: var(--t1); } `;

const StrengthRow = styled.div` display: flex; gap: 4px; margin-top: -8px; margin-bottom: 14px; `;
const StrengthBar = styled.div` flex: 1; height: 2px; border-radius: 99px; background: ${p => { if (!p.$on) return 'var(--b1)'; if (p.$lv === 'weak') return 'var(--red)'; if (p.$lv === 'medium') return 'var(--amber)'; return 'var(--emerald)'; }}; transition: background 0.3s; `;
const StrengthLabel = styled.div` font-family: var(--f-mono); font-size: 0.58rem; color: ${p => p.$lv === 'weak' ? 'var(--red)' : p.$lv === 'medium' ? 'var(--amber)' : p.$lv === 'strong' ? 'var(--emerald)' : 'var(--t4)' }; text-align: right; margin-top: 2px; margin-bottom: 10px; letter-spacing: 0.5px; text-transform: uppercase; `;

const getStrength = pwd => {
  if (pwd.length < 4) return { bars:0, lv:'weak' };
  if (pwd.length < 7) return { bars:1, lv:'weak' };
  if (pwd.length < 10) return { bars:2, lv:'medium' };
  return { bars:3, lv:'strong' };
};

const SubmitBtn = styled.button` width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; background: var(--red); border: none; border-radius: 10px; color: white; font-family: var(--f-brand); font-size: 0.62rem; font-weight: 700; letter-spacing: 2.5px; cursor: pointer; margin-top: 4px; transition: all 0.22s var(--ease-expo); box-shadow: 0 4px 18px var(--red-glow); &:hover { background: #d42f3b; transform: translateY(-1.5px); box-shadow: 0 8px 28px var(--red-glow); svg { transform: translateX(3px); } } &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; } svg { transition: transform 0.2s var(--ease-expo); } `;
const FootText = styled.p` text-align: center; font-size: 0.75rem; color: var(--t3); font-family: var(--f-mono); margin-top: 18px; a { color: var(--red); text-decoration: none; margin-left: 4px; transition: opacity 0.18s; &:hover { opacity: 0.75; } } `;

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuraContext); 

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const s = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Initializing profile...');
    
    try {
      const res = await api.post('/auth/register', form); 
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); 
      toast.success('Profile Initialized! Welcome to Aura.', { id: toastId });
      window.location.href = '/vibe-check'; 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}>
      <Page>
        <Orb style={{ width:480, height:480, background:'rgba(230,57,70,0.08)', top:'-100px', right:'-80px' }} $dur="12s" $delay="0s"/>
        <Orb style={{ width:340, height:340, background:'rgba(139,92,246,0.07)', bottom:'-80px', left:'-60px' }} $dur="9s" $delay="2s"/>

        <Card>
          <BrandRow><BrandIcon><Zap size={14} color="white" strokeWidth={2.5}/></BrandIcon><BrandWord>AURA</BrandWord></BrandRow>
          <Title>Create Profile</Title>
          <Sub>Join the discipline protocol.</Sub>

          <form onSubmit={handleSubmit}>
            <Label>Display Name</Label>
            <FieldWrap><Input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your agent name" required/></FieldWrap>

            <Label>Email</Label>
            <FieldWrap><Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="agent@arena.io" required/></FieldWrap>

            <Label>Password</Label>
            <FieldWrap>
              <Input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required/>
              <EyeBtn type="button" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={13}/> : <Eye size={13}/>}
              </EyeBtn>
            </FieldWrap>

            {form.password && (
              <>
                <StrengthRow>{[0,1,2].map(i => <StrengthBar key={i} $on={i < s.bars} $lv={s.lv}/>)}</StrengthRow>
                <StrengthLabel $lv={s.bars > 0 ? s.lv : ''}>{s.bars === 0 ? '' : s.lv}</StrengthLabel>
              </>
            )}

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'INITIALIZING' : 'INITIALIZE PROFILE'}
              <ArrowRight size={13} strokeWidth={2.5}/>
            </SubmitBtn>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--b1)' }}></div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.62rem', color: 'var(--t4)', letterSpacing: '1px' }}>OR</span>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--b1)' }}></div>
          </div>

          <GoogleOAuthProvider clientId="TUMHARA_GOOGLE_CLIENT_ID">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                text="signup_with"
                onSuccess={async (credentialResponse) => {
                  const toastId = toast.loading("Initializing secure profile...");
                  try {
                    const res = await api.post('/auth/google', { token: credentialResponse.credential });
                    localStorage.setItem('token', res.data.token);
                    setUser(res.data.user);
                    toast.success("Profile Initialized! Welcome to Aura.", { id: toastId });
                    window.location.href = '/vibe-check';
                  } catch (err) {
                    toast.error("Registration failed.", { id: toastId });
                  }
                }}
                onError={() => toast.error('Google Auth Failed')}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </GoogleOAuthProvider>

          <FootText style={{ marginTop: '24px' }}>Already registered?<Link to="/login">Sign in</Link></FootText>
        </Card>
      </Page>
    </motion.div>
  );
};

export default Register;