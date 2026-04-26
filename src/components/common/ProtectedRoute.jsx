import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuraContext } from '../../context/AuraContext'; // Path check kar lena

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuraContext);

  // Jab tak backend se check ho raha hai ki user hai ya nahi
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-void)', color: 'var(--red)', fontFamily: 'var(--f-mono)' }}>
        INITIALIZING AURA PROTOCOL...
      </div>
    );
  }

  // Agar user nahi hai, toh seedha Login page par phek do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user asli hai, toh page dikha do
  return children;
};

export default ProtectedRoute;