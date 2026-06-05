import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

function PrivateRoute({ children }) {
  const { userId } = useAuth();
  return userId ? children : <Navigate to="/" replace />;
}

function BackgroundParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10
    }));
    setParticles(p);
  }, []);

  return (
    <div className="particle-container">
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }} 
        />
      ))}
    </div>
  );
}

function AppRoutes() {
  const { userId } = useAuth();
  return (
    <Routes>
      <Route path="/" element={userId ? <Navigate to="/home" replace /> : <AuthPage />} />
      <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/assessment" element={<PrivateRoute><AssessmentPage /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackgroundParticles />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
