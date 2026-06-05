import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../api/api';
import { useAuth } from '../context/AuthContext';

const RISK_LABELS = ['No Risk', 'Mild', 'Moderate', 'Significant'];
const RISK_COLORS = ['#00845E', '#FFD700', '#FF9F43', '#FF6B00']; // Green to Orange
const RISK_BG     = ['rgba(0,132,94,0.12)', 'rgba(255,215,0,0.12)', 'rgba(255,159,67,0.12)', 'rgba(255,107,0,0.12)'];
const RISK_BORDER = ['rgba(0,132,94,0.3)', 'rgba(255,215,0,0.3)', 'rgba(255,159,67,0.3)', 'rgba(255,107,0,0.3)'];

const MODULES = [
  { icon: '📖', label: 'Reading',     desc: 'Speed & Accuracy' },
  { icon: '🔤', label: 'Spelling',    desc: 'Word Patterns'   },
  { icon: '🔁', label: 'Letters',     desc: 'b/d/p/q Test'    },
  { icon: '🗣️', label: 'Phonological', desc: 'Sound Matching'  },
  { icon: '🧠', label: 'Memory',      desc: 'Recall Test'     },
  { icon: '✍️', label: 'Writing',     desc: 'Error Rate'      },
];

function RiskBadge({ level }) {
  return (
    <span className="badge" style={{ background: RISK_BG[level], color: RISK_COLORS[level], border: `1px solid ${RISK_BORDER[level]}` }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: RISK_COLORS[level], display: 'inline-block' }} />
      {RISK_LABELS[level]}
    </span>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { userId, studentId, studentName, studentAge, studentGrade, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(!!studentId);

  useEffect(() => {
    if (!userId) { navigate('/'); return; }
    if (studentId) {
      // eslint-disable-next-line
      setLoadingHistory(true);
      getHistory(studentId)
        .then(res => setHistory(res.data || []))
        .catch(() => setHistory([]))
        .finally(() => setLoadingHistory(false));
    }
  }, [userId, studentId, navigate]);

  const latestResult = history[0];
  const totalTests   = history.length;
  const avgConf      = totalTests > 0
    ? (history.reduce((s, h) => s + h.confidence, 0) / totalTests * 100).toFixed(1)
    : null;

  return (
    <div className="page-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))' }}>
               <span style={{ fontSize: '1.2rem' }}>🚀</span>
            </div>
            <span className="logo-text" style={{ fontSize: '1.4rem', color: '#fff' }}>Dys<span style={{ color: 'var(--accent-orange)' }}>Therapy</span></span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {studentName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(124,111,255,0.1)', border: '1px solid rgba(124,111,255,0.2)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6fff, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'white' }}>
                  {studentName[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--violet-light)', fontWeight: 600 }}>
                  {studentName} · <span style={{ opacity: 0.8 }}>{studentAge}y · {studentGrade}</span>
                </span>
              </div>
            )}
            <button className="btn-secondary" onClick={logout} style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Page Header */}
        <div className="anim-fade-up" style={{ marginBottom: 36 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>📊 Dashboard Overview 🚀</p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 8 }}>
            Dyslexia Risk 🔍 <span className="gradient-text">Detection 🧠</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            AI-powered cognitive assessment — identify risks early, act with confidence ✨
          </p>
        </div>

        {/* ── Top Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Tests Taken', value: totalTests || '–', icon: '📋', color: 'var(--accent-blue)' },
            { label: 'Avg Confidence', value: avgConf ? `${avgConf}%` : '–', icon: '🎯', color: 'var(--accent-green)' },
            { label: 'Latest Risk', value: latestResult ? RISK_LABELS[latestResult.risk_level] : '–', icon: '⚡', color: RISK_COLORS[latestResult?.risk_level ?? 0] },
            { label: 'Missions', value: '6', icon: '🧩', color: 'var(--accent-orange)' },
          ].map((stat, i) => (
            <div key={stat.label} className={`stat-card anim-fade-up d-${(i+1)*100}`}>
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color, marginBottom: 4, letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Hero Section ── */}
        <div className="anim-fade-up d-100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 60, minHeight: 400 }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="section-label" style={{ color: 'var(--cyan)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 40, height: 1, background: 'var(--cyan)' }} />
              DYSLEXIA DIAGNOSTIC HUB
            </p>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24 }}>
              Empowering Every <br />
              <span style={{ color: 'var(--accent-green)' }}>Learning Journey</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: 36, maxWidth: 520 }}>
              Gamified dyslexia screening and cognitive therapy. Help your child unlock their full potential with our astronaut-guided missions.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
               <button
                className="btn-primary"
                onClick={() => navigate(studentId ? '/assessment' : '/profile')}
              >
                {studentId ? 'Start Mission' : 'Begin Journey'}
                <span style={{ fontSize: '1.4rem', marginLeft: 8 }}>🚀</span>
              </button>
              <button className="btn-secondary" style={{ padding: '18px 32px', borderRadius: 99 }}>
                Learn More
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
             <div className="anim-float" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,111,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img 
                  src="/hero_img.png" 
                  alt="Hero" 
                  style={{ width: '100%', display: 'block' }} 
                />
             </div>
             <div style={{ position: 'absolute', zIndex: -1, top: '20%', left: '20%', width: '60%', height: '60%', background: 'var(--violet)', filter: 'blur(100px)', opacity: 0.3 }} />
          </div>
        </div>

        {/* ── Stats Section ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 60 }}>
          {[
            { label: 'Completed Missions', value: totalTests || '0', icon: '🚀', color: 'var(--violet)' },
            { label: 'Neural Stability', value: avgConf ? `${avgConf}%` : 'N/A', icon: '🧠', color: 'var(--cyan)' },
            { label: 'Current Status', value: latestResult ? RISK_LABELS[latestResult.risk_level] : 'Ready', icon: '⚡', color: RISK_COLORS[latestResult?.risk_level ?? 0] },
            { label: 'Level Progress', value: 'Master', icon: '🏆', color: 'var(--neon-yellow)' },
          ].map((stat, i) => (
            <div key={stat.label} className={`stat-card anim-fade-up d-${(i+1)*100}`} style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ fontSize: '1.8rem' }}>{stat.icon}</div>
                <div style={{ padding: '4px 8px', borderRadius: 6, background: `${stat.color}20`, color: stat.color, fontSize: '0.65rem', fontWeight: 800 }}>+12%</div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Assessment Modules ── */}
        <div className="anim-fade-up d-300" style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 8 }}>🧪 Diagnostic Modules</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Clinical Assessment 📋 <span className="gradient-text">Protocol 🧬</span></h2>
            </div>
            <button className="btn-ghost">View All Protocols 🛡️ →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
            {MODULES.map((m, i) => (
              <div key={m.label} className={`module-chip anim-fade-up d-${(i+1) * 50}`}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 8 }}>
                  {m.icon}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>{m.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── History Table ── */}
        <div className="anim-fade-up d-400" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Test History</h3>
            {history.length > 0 && <span className="section-label">{history.length} record{history.length > 1 ? 's' : ''}</span>}
          </div>

          {loadingHistory ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 }}>
              <div className="spinner" style={{ width: 28, height: 28, border: '2px solid rgba(124,111,255,0.2)', borderTopColor: 'var(--violet)', borderRadius: '50%' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading records...</span>
            </div>
          ) : history.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64, gap: 12 }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>📊</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No test history found</p>
              <button className="btn-primary" onClick={() => navigate(studentId ? '/assessment' : '/profile')} style={{ padding: '10px 20px', fontSize: '0.8rem', marginTop: 4 }}>
                Take First Assessment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Risk Level</th>
                    <th>Confidence</th>
                    <th>Reading Speed</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td><RiskBadge level={item.risk_level} /></td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{(item.confidence * 100).toFixed(1)}%</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.reading_speed?.toFixed(0)} WPM</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{(item.reading_accuracy * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
