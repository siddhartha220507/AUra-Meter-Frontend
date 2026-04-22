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

function App() {
  const location = useLocation(); // Ab ye error nahi dega!

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/dream" element={<DreamFund />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/vibe-check" element={<VibeCheck />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;