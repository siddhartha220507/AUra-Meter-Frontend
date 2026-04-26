import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/dashboard/Dashboard';
import Leaderboard from './pages/leaderboard';
import Arena from './pages/Arena';
import DreamFund from './pages/DreamFund';
import Settings from './pages/Settings';
import VibeCheck from './pages/VibeCheck';
import KnowledgeVault from './pages/KnowledgeVault';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminPanel from './pages/AdminPanel'; 

function App() {
  const location = useLocation(); // Ab ye error nahi dega!

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
        <Route path="/dream" element={<ProtectedRoute><DreamFund /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/vibe-check" element={<ProtectedRoute><VibeCheck /></ProtectedRoute>} />
        <Route path="/vault" element={<ProtectedRoute><KnowledgeVault /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;