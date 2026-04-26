import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { ShieldAlert, Users, Activity, Trash2, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { AuraContext } from '../context/AuraContext';
import { Navigate } from 'react-router-dom';

/* ── Styled Components ───────────────────────────────────── */
const Shell = styled.div` background: var(--bg-void); min-height: 100vh; display: flex; `;
const Main = styled.main` margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px 48px; min-width: 0; @media (max-width: 768px) { margin-left: 0; padding: 20px 16px 85px; } `;
const Topbar = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; `;
const Title = styled.h1` font-family: var(--f-brand); font-size: 1.8rem; font-weight: 700; color: var(--red); display: flex; align-items: center; gap: 12px; `;

const StatGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; @media (max-width: 768px) { grid-template-columns: 1fr; } `;
const StatCard = styled.div` background: var(--bg-card); border: 0.5px solid var(--red-border); border-radius: 20px; padding: 20px; box-shadow: 0 0 20px rgba(230,57,70,0.05); `;

const TableWrap = styled.div` background: var(--bg-surface); border: 0.5px solid var(--b1); border-radius: 20px; overflow: hidden; `;
const Table = styled.table` width: 100%; border-collapse: collapse; text-align: left; `;
const Th = styled.th` padding: 16px; background: rgba(0,0,0,0.2); font-size: 0.7rem; color: var(--t3); text-transform: uppercase; letter-spacing: 1px; border-bottom: 0.5px solid var(--b1); `;
const Td = styled.td` padding: 16px; font-size: 0.85rem; color: var(--t2); border-bottom: 0.5px solid var(--b1); `;
const DelBtn = styled.button` background: rgba(230,57,70,0.1); color: var(--red); border: 1px solid var(--red-border); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; &:hover { background: var(--red); color: white; } `;

const AdminPanel = () => {
  const { user } = useContext(AuraContext);
  const [users, setUsers] = useState([]);

  // 🚨 Security Check: Agar user Admin nahi hai, toh bhaga do usko!
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    // Backend se saare users mangwao (Ye route tumhe backend me banana padega)
    api.get('/admin/users').then(res => setUsers(res.data)).catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Banish this user from Aura?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User Obliterated");
    } catch (err) { toast.error("Error deleting user"); }
  };

  return (
    <Shell>
      <Sidebar />
      <Main>
        <Topbar>
          <Title><ShieldAlert size={28} /> OVERSEER PROTOCOL</Title>
        </Topbar>

        <StatGrid>
          <StatCard>
            <div style={{color:'var(--t3)', fontSize:'0.7rem', marginBottom:'8px'}}>TOTAL AGENTS</div>
            <div style={{fontSize:'2rem', color:'var(--t1)', fontFamily:'var(--f-mono)'}}>{users.length}</div>
          </StatCard>
          {/* Tum aur bhi system stats yahan dikha sakte ho */}
        </StatGrid>

        <TableWrap>
          <Table>
            <thead>
              <tr><Th>Agent Name</Th><Th>Email</Th><Th>Aura Level</Th><Th>Action</Th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <Td><strong>{u.name}</strong> {u.role === 'admin' && <ShieldCheck size={14} color="var(--emerald)" style={{display:'inline'}}/>}</Td>
                  <Td style={{fontFamily:'var(--f-mono)', fontSize:'0.75rem'}}>{u.email}</Td>
                  <Td>{u.auraLevel}</Td>
                  <Td>
                    {u.role !== 'admin' && (
                      <DelBtn onClick={() => handleDelete(u._id)}><Trash2 size={14}/></DelBtn>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Main>
    </Shell>
  );
};
export default AdminPanel;