import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
// 🚨 YAHAN FIX KIYA HAI: Saare icons import kar liye hain!
import { Image as CustomImage, Send, Flame, Zap, Shield, X, MessageSquare, Trash2, Crosshair, Radar } from 'lucide-react';

import api from '../utils/api';
import Sidebar from '../components/layout/Sidebar';
import { AuraContext } from '../context/AuraContext';

/* ── Layout ──────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;

// 🚨 Mobile fallback padding added
const Main = styled.main` 
  margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; 
  @media (max-width: 768px) { padding: 20px 16px 85px; margin-left: 0; }
`;

const LayoutGrid = styled.div` 
  display: grid; grid-template-columns: 1fr 340px; gap: 32px; max-width: 1100px; margin: 0 auto; 
  @media (max-width: 1000px) { grid-template-columns: 1fr; } 
`;
const FeedCol = styled.div` display: flex; flex-direction: column; gap: 24px; `;
const RadarCol = styled.div` 
  display: flex; flex-direction: column; gap: 20px; 
  @media (max-width: 1000px) { display: none; } 
`;

const Topbar = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; animation: fade-up 0.4s var(--ease-expo) both; `;
const HeaderText = styled.div``;
const PreTitle = styled.div` font-family: var(--f-mono); font-size: 0.62rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--red); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.6rem; font-weight: 700; color: var(--t1); letter-spacing: 0.5px; `;

/* ── Composer ──────── */
const ComposerCard = styled.div` 
  background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 20px; 
  box-shadow: var(--shadow-card); animation: fade-up 0.5s var(--ease-expo) 0.1s both; position: relative; overflow: hidden; 
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--red), transparent); opacity: 0.8; } 
  
  /* 🚨 MOBILE: Padding kam ki taaki type karne ki jagah mile */
  @media (max-width: 768px) { padding: 16px; border-radius: 16px; }
`;
const ComposeRow = styled.div` display: flex; gap: 16px; @media (max-width: 768px) { gap: 12px; } `;
const Avatar = styled.div` width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--red), var(--violet)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-family: var(--f-brand); font-size: 0.8rem; flex-shrink: 0; `;
const InputArea = styled.div` flex: 1; min-width: 0; /* 🚨 FIX: Prevents text from pushing screen width */ `;
const TextArea = styled.textarea` width: 100%; background: transparent; border: none; outline: none; color: var(--t1); font-family: var(--f-ui); font-size: 0.95rem; resize: none; min-height: 40px; margin-top: 8px; &::placeholder { color: var(--t4); } `;
const ImagePreviewWrap = styled.div` position: relative; margin-top: 12px; display: ${p => p.$show ? 'block' : 'none'}; `;
const ImagePreview = styled.img` width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px; border: 0.5px solid var(--b1); `;

const ActionRow = styled.div` 
  display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 0.5px solid var(--b1); 
`;
const AddImageBtn = styled.button` background: transparent; border: none; color: var(--t3); display: flex; align-items: center; gap: 8px; font-family: var(--f-ui); font-size: 0.8rem; cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: all 0.2s; &:hover { background: rgba(255,255,255,0.05); color: var(--emerald); } `;
const PostBtn = styled.button` background: var(--red); color: white; border: none; padding: 8px 20px; border-radius: 10px; font-family: var(--f-brand); font-size: 0.75rem; letter-spacing: 1px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px var(--red-glow); &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--red-glow); background: #d42f3b; } &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; } `;

/* ── Feed Posts ──────── */
const PostCard = styled(motion.div)` 
  background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 20px; padding: 20px; transition: all 0.3s; 
  &:hover { border-color: var(--b2); background: var(--bg-card-raise); box-shadow: 0 8px 30px rgba(0,0,0,0.4); } 
  
  /* 🚨 MOBILE: Reduce padding on posts */
  @media (max-width: 768px) { padding: 16px; border-radius: 16px; }
`;

const PostHeader = styled.div` display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; `;
const PostMeta = styled.div` display: flex; gap: 12px; align-items: center; `;
const PostName = styled.div` font-size: 0.95rem; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; `;
const LevelBadge = styled.span` font-family: var(--f-mono); font-size: 0.6rem; color: var(--amber); background: var(--amber-soft); padding: 2px 6px; border-radius: 4px; border: 0.5px solid rgba(245,158,11,0.2); `;
const DeleteBtn = styled.button` background: none; border: none; color: var(--t4); cursor: pointer; padding: 6px; border-radius: 8px; transition: all 0.2s; &:hover { color: var(--red); background: var(--red-soft); } `;
const PostContent = styled.div` font-size: 0.9rem; color: var(--t2); line-height: 1.5; margin-bottom: 16px; word-wrap: break-word; overflow-wrap: break-word; `;
const PostImage = styled.img` width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; border: 0.5px solid var(--b1); margin-bottom: 16px; `;

const PostFooter = styled.div` display: flex; align-items: center; gap: 16px; border-top: 0.5px solid var(--b1); padding-top: 16px; `;
const ActionBtn = styled.button` background: transparent; border: none; color: ${p => p.$active ? p.$color : 'var(--t3)'}; display: flex; align-items: center; gap: 6px; font-family: var(--f-mono); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; &:hover { color: ${p => p.$color}; transform: scale(1.05); } svg { fill: ${p => p.$active ? p.$color : 'transparent'}; } `;

/* ── Comments Section ──────── */
const CommentsSection = styled(motion.div)` margin-top: 16px; padding-top: 16px; border-top: 0.5px dashed var(--b1); `;
const CommentList = styled.div` display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; `;
const CommentItem = styled.div` display: flex; gap: 10px; font-size: 0.8rem; `;
const CmtAvatar = styled.div` width: 24px; height: 24px; border-radius: 6px; background: var(--b2); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; font-weight: 700; color: white; flex-shrink: 0; `;
const CmtBody = styled.div` background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 0 12px 12px 12px; border: 0.5px solid var(--b1); flex: 1; min-width: 0; word-wrap: break-word; `;
const CmtName = styled.div` font-weight: 700; color: var(--t2); margin-bottom: 2px; font-size: 0.7rem; `;
const CmtInputRow = styled.div` display: flex; gap: 8px; `;
const CmtInput = styled.input` flex: 1; min-width: 0; background: var(--bg-input); border: 0.5px solid var(--b1); padding: 8px 14px; border-radius: 8px; color: var(--t1); font-size: 0.8rem; outline: none; &:focus { border-color: var(--violet); } `;
const CmtSendBtn = styled.button` background: var(--violet); border: none; color: white; width: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s; &:hover { background: #7c3aed; } `;

/* ── Radar Panel (Gaming Theme Fillers) ──────── */
const PanelCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--b1); border-radius: 20px; padding: 20px; position: relative; overflow: hidden; box-shadow: var(--shadow-card); &::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(139,92,246,0.05), transparent 60%); pointer-events: none; } `;
const PanelTitle = styled.div` font-family: var(--f-mono); font-size: 0.65rem; color: var(--t3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; `;
const PanelStat = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(0,0,0,0.2); border: 0.5px solid var(--b1); border-radius: 12px; margin-bottom: 8px; `;
const StatL = styled.div` font-size: 0.8rem; color: var(--t2); display: flex; align-items: center; gap: 8px; `;
const StatR = styled.div` font-family: var(--f-mono); font-size: 0.9rem; color: var(--emerald); font-weight: 700; `;

const Arena = () => {
  const { user } = useContext(AuraContext);
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [radarStats, setRadarStats] = useState({ activeAgents: 0, totalHype: 0, proofsUploaded: 0 });
  
  // Comment states
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) { toast.error('Failed to load Arena Feed'); }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/posts/stats');
      setRadarStats(res.data);
    } catch (err) { console.error('Stats load fail', err); }
  };

  useEffect(() => { 
    fetchPosts(); 
    fetchStats(); // Ise call kar do
  }, []);

  const handlePostSubmit = async () => {
    if (!image) return toast.error('Proof of Work (Image) is required!');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    const toastId = toast.loading('Encrypting and Uploading to Arena...');
    setLoading(true);
    try {
      await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Proof uploaded! +5 Aura', { id: toastId });
      setCaption(''); setImage(null); setPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this proof from the Arena?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      toast.success("Post obliterated.");
    } catch (err) { toast.error("Could not delete"); }
  };

  const handleHype = async (id) => {
    try {
      const res = await api.put(`/posts/${id}/hype`);
      setPosts(posts.map(p => p._id === id ? { ...p, hypes: res.data.hypes } : p));
    } catch (err) { toast.error("Failed to Hype"); }
  };

  const handleComment = async (id) => {
    if (!commentText[id]?.trim()) return;
    try {
      const res = await api.post(`/posts/${id}/comment`, { text: commentText[id] });
      setPosts(posts.map(p => p._id === id ? res.data : p));
      setCommentText({ ...commentText, [id]: '' });
    } catch (err) { toast.error("Comm-link failed"); }
  };

  return (
    <Shell>
      <Sidebar />
      <Main>
        <Topbar>
          <HeaderText>
            <PreTitle><Shield size={12} /> Elite Zone</PreTitle>
            <Title>The Arena Feed</Title>
          </HeaderText>
        </Topbar>

        <LayoutGrid>
          {/* LEFT: MAIN FEED */}
          <FeedCol>
            <ComposerCard>
              <ComposeRow>
                <Avatar>{user?.name?.slice(0, 2).toUpperCase() || 'AG'}</Avatar>
                <InputArea>
                  <TextArea 
                    placeholder="Share your Proof of Work... (Top 10 Agents Only)"
                    value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={500}
                  />
                  <ImagePreviewWrap $show={!!preview}>
                    {preview ? <ImagePreview src={preview} alt="Preview" /> : null}
                    <button onClick={() => {setImage(null); setPreview('');}} style={{position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.6)', border:'none', color:'white', borderRadius:'50%', width:28, height:28, cursor:'pointer'}}><X size={14}/></button>
                  </ImagePreviewWrap>
                  <ActionRow>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{display:'none'}} onChange={(e) => { const f = e.target.files[0]; if(f) {setImage(f); setPreview(URL.createObjectURL(f));} }} />
                    <AddImageBtn onClick={() => fileInputRef.current?.click()}><CustomImage size={16} />{image ? 'Change Image' : 'Attach Proof'}</AddImageBtn>
                    <PostBtn onClick={handlePostSubmit} disabled={loading || !image}><Send size={14} />{loading ? 'UPLOADING...' : 'POST WORK'}</PostBtn>
                  </ActionRow>
                </InputArea>
              </ComposeRow>
            </ComposerCard>

            {posts.map((post, i) => {
              const isMine = post.user?._id === user?._id;
              const hasHyped = post.hypes?.includes(user?._id);
              const isCommentsOpen = showComments[post._id];

              return (
                <PostCard key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <PostHeader>
                    <PostMeta>
                      <Avatar style={{ width: '40px', height: '40px' }}>{post.user?.name?.slice(0, 2).toUpperCase()}</Avatar>
                      <div>
                        <PostName>{post.user?.name} <LevelBadge><Zap size={8} style={{display:'inline'}}/> LVL {post.user?.auraLevel || 1}</LevelBadge></PostName>
                        <div style={{fontSize:'0.65rem', color:'var(--t4)', marginTop:'2px'}}>{new Date(post.createdAt).toLocaleString()}</div>
                      </div>
                    </PostMeta>
                    {isMine && <DeleteBtn onClick={() => handleDelete(post._id)}><Trash2 size={16}/></DeleteBtn>}
                  </PostHeader>
                  
                  {post.caption && <PostContent>{post.caption}</PostContent>}
                  {post.imageUrl && <PostImage src={post.imageUrl} alt="Proof" loading="lazy" />}
                  
                  <PostFooter>
                    <ActionBtn $active={hasHyped} $color="var(--amber)" onClick={() => handleHype(post._id)}>
                      <Flame size={16} /> {post.hypes?.length || 0} Hype
                    </ActionBtn>
                    <ActionBtn $active={isCommentsOpen} $color="var(--violet)" onClick={() => setShowComments({...showComments, [post._id]: !isCommentsOpen})}>
                      <MessageSquare size={16} /> {post.comments?.length || 0} Comments
                    </ActionBtn>
                  </PostFooter>

                  <AnimatePresence>
                    {isCommentsOpen && (
                      <CommentsSection initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}>
                        <CommentList>
                          {post.comments?.map(cmt => (
                            <CommentItem key={cmt._id}>
                              <CmtAvatar>{cmt.user?.name?.slice(0,2).toUpperCase()}</CmtAvatar>
                              <CmtBody>
                                <CmtName>{cmt.user?.name}</CmtName>
                                <div style={{color:'var(--t2)'}}>{cmt.text}</div>
                              </CmtBody>
                            </CommentItem>
                          ))}
                        </CommentList>
                        <CmtInputRow>
                          <CmtInput placeholder="Add intel..." value={commentText[post._id] || ''} onChange={e => setCommentText({...commentText, [post._id]: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}/>
                          <CmtSendBtn onClick={() => handleComment(post._id)}><Send size={12}/></CmtSendBtn>
                        </CmtInputRow>
                      </CommentsSection>
                    )}
                  </AnimatePresence>
                </PostCard>
              );
            })}
          </FeedCol>

          {/* RIGHT: ARENA RADAR (GAMING VIBE FILLERS) */}
          <RadarCol>
            <PanelCard>
              <PanelTitle><Radar size={14} color="var(--violet)"/> Network Radar</PanelTitle>
              <PanelStat>
                <StatL><Crosshair size={14}/> Active Agents</StatL>
                {/* 🚀 REAL DATA YAHAN AAYEGA */}
                <StatR style={{color:'var(--violet)'}}>{radarStats.activeAgents}</StatR>
              </PanelStat>
              <PanelStat>
                <StatL><Flame size={14}/> Total Hype Given</StatL>
                {/* 🚀 REAL DATA YAHAN AAYEGA */}
                <StatR style={{color:'var(--amber)'}}>{radarStats.totalHype}</StatR>
              </PanelStat>
              <PanelStat>
                <StatL><CustomImage size={14}/> Proofs Uploaded</StatL>
                {/* 🚀 REAL DATA YAHAN AAYEGA */}
                <StatR>{radarStats.proofsUploaded}</StatR>
              </PanelStat>
            </PanelCard>

            <PanelCard style={{border:'0.5px solid rgba(230,57,70,0.3)', background:'rgba(230,57,70,0.03)'}}>
              <PanelTitle style={{color:'var(--red)'}}><Shield size={14}/> Current Bounty</PanelTitle>
              <div style={{fontSize:'0.85rem', color:'var(--t1)', fontWeight:'700', marginBottom:'8px'}}>The 100xDev Challenge</div>
              <div style={{fontSize:'0.75rem', color:'var(--t3)', lineHeight:'1.5', marginBottom:'16px'}}>Post 7 consecutive daily proofs to unlock the "Consistency Titan" badge and 50 XP.</div>
              <div style={{width:'100%', height:'6px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', overflow:'hidden'}}>
                <div style={{width:'42%', height:'100%', background:'var(--red)', boxShadow:'0 0 10px var(--red-glow)'}}></div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'var(--t4)', marginTop:'6px', fontFamily:'var(--f-mono)'}}>
                <span>3/7 Days</span>
                <span>IN PROGRESS</span>
              </div>
            </PanelCard>
          </RadarCol>
        </LayoutGrid>

      </Main>
    </Shell>
  );
};

export default Arena;