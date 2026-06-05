import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup as signupApi, login as loginApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = isLogin ? await loginApi(email, password) : await signupApi(email, password);
      authLogin(res.data.user_id);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" style={{ top: '70%', left: '10%' }} />

      <div className="anim-scale-in" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
           <div style={{ width: 80, height: 80, borderRadius: 28, background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 40px rgba(0,132,94,0.4)' }}>
              <span style={{ fontSize: '2.5rem' }}>🚀</span>
           </div>
           <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8, color: '#fff' }}>
             Dys<span style={{ color: 'var(--accent-orange)' }}>Therapy</span>
           </h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
             {isLogin ? 'Welcome back, Space Cadet!' : 'Begin your learning journey'}
           </p>
        </div>

        <div className="card" style={{ padding: '48px 40px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          {error && (
            <div className="anim-shake" style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: 24, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
               <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Email</label>
               <input 
                type="email" 
                className="input-field" 
                placeholder="commander@neural.link" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ padding: '16px', background: 'rgba(0,0,0,0.2)' }}
               />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
               <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Access Key</label>
               <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ padding: '16px', background: 'rgba(0,0,0,0.2)' }}
               />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 12, height: 64 }}>
              {loading ? (
                <div className="spinner" style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%' }} />
              ) : (
                isLogin ? 'Launch Dashboard' : 'Create Identity'
              )}
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button className="btn-ghost" onClick={() => setIsLogin(!isLogin)} style={{ fontSize: '0.85rem' }}>
              {isLogin ? "Don't have an identity? Register" : "Already have an identity? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
