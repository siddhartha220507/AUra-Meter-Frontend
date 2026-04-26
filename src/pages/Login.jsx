import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff, Zap, Shield, Activity, Clock, Users } from 'lucide-react';
import api from '../utils/api';
import { AuraContext } from '../context/AuraContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const floatOrb = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(24px,-20px) scale(1.04); }
  70%      { transform: translate(-16px,12px) scale(0.97); }
`;

/* ── Page ────────────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  background: var(--bg-void);
  overflow: hidden;
  position: relative;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  animation: ${floatOrb} ${p => p.$dur} ease-in-out infinite;
  animation-delay: ${p => p.$delay};
`;

/* ── Left panel ──────────────────────────────────────────── */
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 64px;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) { display: none; }
`;

const LeftBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 56px;
`;

const BrandIcon = styled.div`
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--red);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px var(--red-glow);
`;

const BrandWord = styled.span`
  font-family: var(--f-brand);
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 4px;
  color: var(--t1);
`;

const Headline = styled.h1`
  font-family: var(--f-brand);
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.05;
  color: var(--t1);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

const RedLine = styled.span`
  color: var(--red);
  text-shadow: 0 0 32px var(--red-glow);
  display: block;
`;

const Subhead = styled.p`
  font-size: 1rem;
  color: var(--t2);
  line-height: 1.6;
  max-width: 400px;
  margin-bottom: 44px;
  font-family: 'DM Mono', monospace;
  font-weight: 300;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0.5px solid var(--b1);
  background: var(--bg-card);
  transition: all 0.22s var(--ease-expo);
  cursor: default;

  &:hover {
    border-color: var(--red-border);
    background: var(--bg-card-raise);
    transform: translateX(4px);
  }
`;

const FeatIcon = styled.div`
  width: 32px; height: 32px;
  border-radius: 8px;
  background: ${p => p.$bg};
  border: 0.5px solid ${p => p.$border};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: ${p => p.$color};
`;

const FeatText = styled.div``;
const FeatTitle = styled.div`font-size: 0.85rem; font-weight: 700; color: var(--t1); letter-spacing: 0.2px;`;
const FeatDesc  = styled.div`font-size: 0.7rem; color: var(--t3); margin-top: 1px; font-family: var(--f-mono);`;

/* ── Right panel ─────────────────────────────────────────── */
const Right = styled.div`
  width: 420px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: var(--bg-surface);
  border-left: 0.5px solid var(--b1);
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    width: 100%;
    border-left: none;
    background: transparent;
    padding: 40px 24px;
  }
`;

const Form = styled.div`width: 100%; max-width: 340px;`;

const FormTitle = styled.h2`
  font-family: var(--f-brand);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const FormSub = styled.p`
  font-size: 0.8rem;
  color: var(--t3);
  margin-bottom: 32px;
  font-family: var(--f-mono);
  letter-spacing: 0.3px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.65rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--t2);
  margin-bottom: 7px;
  font-family: var(--f-mono);
`;

const FieldWrap = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 14px;
  background: var(--bg-input);
  border: 0.5px solid var(--b1);
  border-radius: 10px;
  color: var(--t1);
  font-family: var(--f-ui);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.22s var(--ease-expo);
  letter-spacing: 0.2px;

  &::placeholder { color: var(--t3); }
  &:focus {
    border-color: var(--red-border);
    background: rgba(9,9,15,0.95);
    box-shadow: 0 0 0 3px rgba(230,57,70,0.07), 0 2px 14px rgba(0,0,0,0.35);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer;
  color: var(--t3);
  display: flex;
  transition: color 0.18s;
  &:hover { color: var(--t1); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  background: var(--red);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: var(--f-brand);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.22s var(--ease-expo);
  box-shadow: 0 4px 18px var(--red-glow);

  &:hover {
    background: #d42f3b;
    transform: translateY(-1.5px);
    box-shadow: 0 8px 28px var(--red-glow);
  }
  &:active { transform: translateY(0); box-shadow: 0 3px 10px var(--red-glow); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  svg { transition: transform 0.2s var(--ease-expo); }
  &:hover svg { transform: translateX(3px); }
`;

const Divider = styled.div`
  display: flex; align-items: center; gap: 12px;
  margin: 20px 0;
  &::before, &::after { content: ''; flex: 1; height: 0.5px; background: var(--b1); }
`;
const DivText = styled.span`
  font-family: var(--f-mono); font-size: 0.62rem;
  color: var(--t4); letter-spacing: 1px;
`;

const FootText = styled.p`
  text-align: center;
  font-size: 0.78rem;
  color: var(--t3);
  font-family: var(--f-mono);
  a { color: var(--red); text-decoration: none; font-weight: 500; margin-left: 4px; transition: opacity 0.18s; &:hover { opacity: 0.75; } }
`;

/* ── Component ───────────────────────────────────────────── */
const FEATURES = [
  { Icon: Clock,    title: 'Escalation Protocol',   desc: 'Phone call if you keep scrolling',  color:'var(--red)',     bg:'var(--red-soft)',     border:'var(--red-border)'    },
  { Icon: Activity, title: 'Aura Level System',     desc: 'XP, streaks, daily objectives',     color:'var(--violet)',  bg:'var(--violet-soft)',  border:'var(--violet-border)' },
  { Icon: Users,    title: 'The Arena',             desc: 'Proof-of-work social feed',         color:'var(--amber)',   bg:'var(--amber-soft)',   border:'rgba(245,158,11,0.2)' },
  { Icon: Shield,   title: 'Dream Fund',            desc: 'Save toward your goal visually',    color:'var(--emerald)', bg:'var(--emerald-soft)', border:'rgba(16,185,129,0.2)' },
];

const Login = () => {
  const [form, setForm]       = useState({ email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuraContext);
  const navigate    = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔴 1. NORMAL LOGIN (Email/Password wala rasta)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading('Authenticating...');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Access granted.', { id });
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.', { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
      <Page>
        <Orb style={{ width:500, height:500, background:'rgba(230,57,70,0.09)', top:'-120px', left:'-80px' }} $dur="11s" $delay="0s"/>
        <Orb style={{ width:360, height:360, background:'rgba(139,92,246,0.07)', bottom:'-80px', left:'40%' }} $dur="14s" $delay="3s"/>

        <Left>
          {/* Tumhara purana Left panel ka code yahan aayega (Brand, Headline, Features) */}
          <LeftBrand><BrandIcon><Zap size={18} color="white" strokeWidth={2.5}/></BrandIcon><BrandWord>AURA</BrandWord></LeftBrand>
          <Headline>Build Your<RedLine>Discipline.</RedLine></Headline>
          <Subhead>The only app that interrupts your doomscrolling with a phone call.</Subhead>
          <Features>
            {FEATURES.map(f => (
              <FeatureRow key={f.title}>
                <FeatIcon $bg={f.bg} $border={f.border} $color={f.color}><f.Icon size={15} strokeWidth={1.5}/></FeatIcon>
                <FeatText><FeatTitle>{f.title}</FeatTitle><FeatDesc>{f.desc}</FeatDesc></FeatText>
              </FeatureRow>
            ))}
          </Features>
        </Left>

        <Right>
          <Form>
            <FormTitle>Sign In</FormTitle>
            <FormSub>Enter your credentials to continue.</FormSub>

            {/* 🟢 NORMAL FORM START */}
            <form onSubmit={handleSubmit}>
              <FieldLabel>Email</FieldLabel>
              <FieldWrap>
                <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="agent@arena.io" required />
              </FieldWrap>

              <FieldLabel>Password</FieldLabel>
              <FieldWrap>
                <Input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                <EyeBtn type="button" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                </EyeBtn>
              </FieldWrap>

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? 'AUTHENTICATING' : 'ENTER ARENA'}
                <ArrowRight size={14} strokeWidth={2.5}/>
              </SubmitBtn>
            </form>
            {/* 🟢 NORMAL FORM END */}

            <Divider><DivText>OR</DivText></Divider>

            {/* 🔵 GOOGLE LOGIN BUTTON */}
            <GoogleOAuthProvider clientId="TUMHARA_GOOGLE_CLIENT_ID">
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <GoogleLogin
                  text="signin_with"
                  onSuccess={async (credentialResponse) => {
                    const toastId = toast.loading("Verifying identity...");
                    try {
                      const res = await api.post('/auth/google', { token: credentialResponse.credential });
                      localStorage.setItem('token', res.data.token);
                      setUser(res.data.user);
                      toast.success("Access Granted. Welcome back!", { id: toastId });
                      window.location.href = '/dashboard';
                    } catch (err) {
                      toast.error("Authentication failed.", { id: toastId });
                    }
                  }}
                  onError={() => toast.error('Google Login Failed')}
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            </GoogleOAuthProvider>
            
            <FootText>No profile?<Link to="/register">Create one</Link></FootText>
          </Form>
        </Right>
      </Page>
    </motion.div>
  );
};

export default Login;