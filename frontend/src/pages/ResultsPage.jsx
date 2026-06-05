import { useLocation, useNavigate } from 'react-router-dom';

const RISK_INFO = {
  0: {
    label: 'No Risk',
    color: 'var(--accent-green)',
    bg: 'rgba(0,132,94,0.1)',
    border: 'rgba(0,132,94,0.3)',
    emoji: '🚀',
    tagline: 'High cognitive performance — no significant indicators detected.',
    gradient: 'linear-gradient(135deg, var(--accent-green), #004d38)',
    glow: 'rgba(0, 132, 94, 0.4)',
  },
  1: {
    label: 'Mild Severity',
    color: 'var(--accent-yellow)',
    bg: 'rgba(255,215,0,0.1)',
    border: 'rgba(255,215,0,0.3)',
    emoji: '📡',
    tagline: 'Subtle variations detected — early intervention is beneficial.',
    gradient: 'linear-gradient(135deg, var(--accent-yellow), #b39700)',
    glow: 'rgba(255, 215, 0, 0.4)',
  },
  2: {
    label: 'Moderate Severity',
    color: 'var(--accent-orange)',
    bg: 'rgba(255,107,0,0.1)',
    border: 'rgba(255,107,0,0.3)',
    emoji: '🛰️',
    tagline: 'Clear dyslexic patterns — structured support is recommended.',
    gradient: 'linear-gradient(135deg, var(--accent-orange), #b34a00)',
    glow: 'rgba(255, 107, 0, 0.4)',
  },
  3: {
    label: 'Significant Severity',
    color: '#FF4D4D',
    bg: 'rgba(255,77,77,0.1)',
    border: 'rgba(255,77,77,0.3)',
    emoji: '🌌',
    tagline: 'Strong neural indicators — intensive specialist intervention required.',
    gradient: 'linear-gradient(135deg, #FF4D4D, #b30000)',
    glow: 'rgba(255, 77, 77, 0.4)',
  },
};

const SCORE_BARS = [
  { key: 'reading_accuracy',   label: 'Word Recognition',     unit: '%',   max: 100, transform: v => v,                 color: 'var(--accent-green)' },
  { key: 'phonological_score', label: 'Sound Blending',       unit: '%',   max: 100, transform: v => v,                 color: 'var(--accent-orange)' },
  { key: 'confusion_score',    label: 'Visual Discrimination', unit: '%',   max: 100, transform: v => v,                 color: 'var(--accent-blue)' },
  { key: 'memory_score',       label: 'Memory Retention',     unit: '%',   max: 100, transform: v => v,                 color: 'var(--accent-yellow)' },
  { key: 'writing_error_rate', label: 'Tracing Accuracy',     unit: '%',   max: 100, transform: v => 100 - v,           color: 'var(--accent-green)' },
  { key: 'response_time_variance', label: 'Reaction Stability', unit: '%', max: 100, transform: v => 100 - v,         color: 'var(--accent-blue)' },
  { key: 'reading_speed',      label: 'Processing Speed',     unit: 'WPM', max: 150, transform: v => v,                 color: 'var(--accent-blue)' },
  { key: 'eye_tracking_score', label: 'Gaze Stability',       unit: '%',   max: 100, transform: v => 100 - v,           color: 'var(--accent-green)' },
];

function ScoreBar({ label, value, max, color, unit }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 12px', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontSize: '0.82rem', textAlign: 'right' }}>
        {typeof value === 'number' ? value.toFixed(1) : '—'}{unit ? ` ${unit}` : ''}
      </span>
      <div className="score-bar-track" style={{ gridColumn: '1 / -1' }}>
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color, opacity: 0.85 }} />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const result    = state?.result;
  const scores    = state?.scores;

  if (!result) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No mission data retrieved.</p>
          <button className="btn-primary" onClick={() => navigate('/home')}>Return to Base</button>
        </div>
      </div>
    );
  }

  const info          = RISK_INFO[result.risk_level];
  const confidencePct = (result.confidence * 100).toFixed(1);
  const circumference = 2 * Math.PI * 44; 

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Background Celebration Backdrop */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.2, zIndex: 0 }}>
         <img 
            src="/celebration_backdrop.png" 
            alt="Backdrop" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
         />
      </div>

      <div className="orb orb-1" style={{ background: info.color, opacity: 0.15 }} />
      <div className="orb orb-2" style={{ top: '60%', right: '10%', background: 'var(--cyan)', opacity: 0.1 }} />

      <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <div className="navbar-inner">
          <button className="btn-ghost" onClick={() => navigate('/home')}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </button>
          <div className="logo">
             <span className="logo-text">Mission 🚀 <span style={{ color: info.color }}>Report 📊</span></span>
          </div>
          <div />
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
        
        {/* Left Column: Severity & Confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="anim-scale-in" style={{ borderRadius: 32, padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: `2px solid ${info.border}`, boxShadow: `0 0 60px ${info.bg.replace('0.1', '0.2')}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${info.color}15, transparent)` }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '4.5rem', marginBottom: 20 }}>{info.emoji}</div>
              <p className="section-label" style={{ color: info.color, marginBottom: 12, letterSpacing: '0.2em' }}>NEURAL STATUS</p>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.04em' }}>
                {result.label.split(' ')[0]} <span style={{ color: info.color }}>{result.label.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>{info.tagline}</p>

              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="180" height="180" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={info.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - result.confidence)}
                    style={{ filter: `drop-shadow(0 0 10px ${info.color})`, transition: 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{confidencePct}%</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confidence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="anim-fade-up d-100 card" style={{ padding: '32px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📊</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Score Breakdown</h3>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {SCORE_BARS.map(({ key, label, unit, max, transform, color }) => {
                  const val = transform(scores[key]);
                  const pct = Math.min(100, (val / max) * 100);
                  return (
                    <div key={key} style={{ padding: '20px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                       <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{val.toFixed(0)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{unit}</div>
                       </div>
                       <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="anim-fade-up d-200 card" style={{ padding: '40px', flex: 1, border: `1px solid ${info.border}`, background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: info.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: `0 8px 20px ${info.color}40` }}>🛡️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>Intervention Protocol</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="rec-item anim-fade-up" style={{ animationDelay: `${300 + (i * 100)}ms`, background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 20 }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>⚡</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>{rec}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: '24px', borderRadius: 20, background: info.bg, border: `1px dashed ${info.color}40`, textAlign: 'center' }}>
               <p style={{ fontSize: '0.8rem', color: info.color, fontWeight: 700 }}>AI RECOMMENDATION ENGINE v2.4</p>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>These protocols are tailored to the detected severity markers.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn-primary" onClick={() => navigate('/assessment')} style={{ flex: 1, background: 'var(--accent-orange)', boxShadow: '0 6px 0 #b34a00' }}>
               Retake Mission
            </button>
            <button className="btn-secondary" onClick={() => navigate('/home')} style={{ flex: 1, padding: '16px', borderRadius: 99 }}>
               Back to Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
