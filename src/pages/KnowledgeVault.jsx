import styled from 'styled-components';
import Sidebar from '../components/layout/Sidebar';
import { Network } from 'lucide-react'; 

/* ── Styled Components ───────────────────────────────────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;

/* 🚨 MOBILE FIX: Iframe ko bottom nav se bachane ke liye padding fix */
const Main = styled.main` 
  margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px; display: flex; flex-direction: column; height: 100vh; overflow: hidden; 
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px 16px 85px; /* 85px safe zone for Bottom Nav */
  }
`;

const Header = styled.div` 
  margin-bottom: 24px; animation: fade-up 0.4s var(--ease-expo) both; 
  @media (max-width: 768px) {
    margin-bottom: 16px; /* Mobile par thodi space bachayenge */
  }
`;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; color: var(--t1); letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 12px; `;

/* 🚨 MOBILE FIX: Border radius mobile ke hisaab se adjust kiya */
const IframeWrapper = styled.div` 
  flex: 1; 
  border-radius: 20px; 
  overflow: hidden; 
  border: 0.5px solid var(--b1); 
  box-shadow: var(--shadow-card); 
  background: var(--bg-card); 
  animation: fade-up 0.5s var(--ease-expo) 0.1s both; 
  position: relative; 
  
  @media (max-width: 768px) {
    border-radius: 16px;
  }

  &::before { 
    content: 'Initializing Nibodh Neural Network...'; 
    position: absolute; 
    inset: 0; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-family: var(--f-mono); 
    color: var(--t4); 
    font-size: 0.85rem; 
    z-index: 0; 
  } 
`;

const StyledIframe = styled.iframe` 
  width: 100%; 
  height: 100%; 
  border: none; 
  position: relative; 
  z-index: 1; 
  background: transparent; 
`;

/* ── Component ───────────────────────────────────────────── */
const KnowledgeVault = () => {
  // 🚨 YAHAN APNE NIBODH APP KA LIVE URL DAAL DO
  // Agar abhi localhost pe test kar rahe ho toh http://localhost:3001 dal do
  const VAULT_URL = "https://nibodh-frontend.vercel.app/"; 

  return (
    <Shell>
      <Sidebar />
      <Main>
        <Header>
          <Title>
            <Network size={28} color="var(--violet)" /> 
            Nibodh Vault
          </Title>
        </Header>
        
        <IframeWrapper>
          <StyledIframe 
            src={VAULT_URL} 
            title="Nibodh Knowledge Vault"
            allow="fullscreen"
          />
        </IframeWrapper>
      </Main>
    </Shell>
  );
};

export default KnowledgeVault;