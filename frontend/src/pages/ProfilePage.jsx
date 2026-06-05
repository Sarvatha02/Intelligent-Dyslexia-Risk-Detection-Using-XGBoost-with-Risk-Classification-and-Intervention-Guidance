import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../api/api';
import { useAuth } from '../context/AuthContext';

const GRADES = [
  'Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6',
  'Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12',
  'College / University',
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId, saveStudent } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { navigate('/'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await createStudent(userId, { name, age: parseInt(age), grade });
      saveStudent(res.data.student_id, name, age, grade);
      navigate('/assessment');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="orb orb-1" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.18) 0%, transparent 70%)' }} />
      <div className="orb orb-2" />

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>

        {/* Back */}
        <button className="btn-ghost anim-fade-in" onClick={() => navigate('/home')} style={{ marginBottom: 16 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="anim-fade-up glass-strong" style={{ borderRadius: 'var(--radius-xl)', padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #f472b6, #7c6fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 24px rgba(244,114,182,0.35)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              <span className="gradient-text">Student</span> Profile 👤
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Set up the student profile before starting the cognitive assessment. 🚀
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  className="input-field"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Johnson"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="input-label">Age</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  className="input-field"
                  type="number"
                  min="5"
                  max="25"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                  placeholder="e.g. 10"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="input-label">Grade / Level</label>
              <select
                className="input-field"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                required
              >
                <option value="">Select grade level</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {error && (
              <div className="alert-error anim-fade-in">{error}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: '14px 24px', fontSize: '0.9rem', marginTop: 8 }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="anim-spin" />
                  Creating Profile...
                </>
              ) : 'Continue to Assessment →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
