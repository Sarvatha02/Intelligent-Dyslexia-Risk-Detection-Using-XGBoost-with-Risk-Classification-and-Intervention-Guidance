import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssessmentContent, submitAssessment } from '../api/api';

const ASTRO_IMG = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png";

const speak = (text, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

// ─── MISSION COMPONENTS ───

function ReadingPassageTest({ passage, onComplete }) {
  const [startTime] = useState(Date.now());
  const [text, setText] = useState('');

  const finish = () => {
    const time = (Date.now() - startTime) / 1000;
    const words = text.trim().split(/\s+/).length;
    onComplete({ 
      reading_speed: (words / time) * 60,
      reading_accuracy: 95.0 
    });
  };

  return (
    <div className="mission-card anim-scale-in">
       <div className="mission-header">
          <span className="badge">Reading Mission</span>
          <h2>Neural Transmission Scan</h2>
       </div>
       <p className="passage-text" style={{ fontSize: '1.4rem', lineHeight: 1.8, marginBottom: 30, background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
         {passage}
       </p>
       <textarea 
         placeholder="Retype the passage here to test accuracy..."
         value={text}
         onChange={(e) => setText(e.target.value)}
         style={{ width: '100%', height: 150, borderRadius: 20, padding: 20, background: '#000', color: '#fff', border: '2px solid var(--accent-blue)', marginBottom: 20 }}
       />
       <button className="btn-primary" onClick={finish}>Transmit Results</button>
    </div>
  );
}

function EarlyVisualReadingMission({ questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const handlePick = (choice) => {
    const isCorrect = choice === questions[idx].answer;
    if (isCorrect) setScore(score + 1);
    
    if (idx < questions.length - 1) setIdx(idx + 1);
    else onComplete({ phonological_score: ((score + (isCorrect ? 1 : 0)) / questions.length) * 100 });
  };

  if (!questions || !questions[idx]) return <div className="spinner" />;

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center' }}>
       <h2 style={{ fontSize: '2rem', marginBottom: 40 }}>{questions[idx].question}</h2>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {questions[idx].options.map(opt => (
            <button key={opt} className="btn-secondary" onClick={() => handlePick(opt)} style={{ padding: '40px', fontSize: '1.8rem' }}>{opt}</button>
          ))}
       </div>
    </div>
  );
}

function TraceShadowMission({ items, onComplete }) {
  const [round, setRound] = useState(0);
  const [matches, setMatches] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [score, setScore] = useState(0);
  const shuffledShadows = useRef([]);

  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
         <h2 style={{ color: 'var(--accent-blue)' }}>Calibrating Visual Sensors...</h2>
         <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  // Calculate set AFTER safety check
  const currentSet = items.slice(round * 5, (round * 5) + 5);

  useEffect(() => {
    if (currentSet && currentSet.length > 0) {
      shuffledShadows.current = [...currentSet].sort(() => Math.random() - 0.5);
      speak("Drag each character to its matching shadow.", 1.0);
    }
  }, [round, currentSet.length]);

  const handleDragStart = (item) => setDraggingItem(item);
  
  const handleDrop = (target) => {
    if (!draggingItem) return;
    if (draggingItem.target === target.target) {
      setMatches(prev => [...prev, draggingItem.target]);
      setScore(s => s + 1);
      setDraggingItem(null);
      
      if (matches.length + 1 === currentSet.length) {
        const t = setTimeout(() => {
          if (round === 0 && items.length > 5) {
            setRound(1);
            setMatches([]);
          } else {
            onComplete({ confusion_score: (score / items.length) * 100 });
          }
        }, 1000);
      }
    }
  };

  return (
    <div className="mission-card anim-scale-in" style={{ padding: '40px 20px', textAlign: 'center' }}>
       <div className="mission-header" style={{ marginBottom: 40 }}>
          <span className="badge" style={{ background: 'var(--accent-blue)' }}>🧬 NEURAL ALIGNMENT</span>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: 10 }}>Match the Neural Shadows</h2>
       </div>

       <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {currentSet.map((item, i) => (
                <div 
                  key={`src-${i}`}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  style={{ 
                    fontSize: '4.5rem', 
                    width: 100, 
                    height: 100, 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'grab',
                    opacity: matches.includes(item.target) ? 0.2 : 1,
                    pointerEvents: matches.includes(item.target) ? 'none' : 'auto',
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  {item.target}
                </div>
             ))}
          </div>

          <div style={{ fontSize: '3rem', opacity: 0.2 }}>⚡</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {shuffledShadows.current.map((item, i) => (
                <div 
                  key={`shadow-${i}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(item)}
                  style={{ 
                    fontSize: '4.5rem', 
                    width: 100, 
                    height: 100, 
                    background: matches.includes(item.target) ? 'rgba(0, 255, 128, 0.1)' : 'rgba(255,255,255,0.02)', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    filter: matches.includes(item.target) ? 'none' : 'brightness(0) invert(0)',
                    opacity: matches.includes(item.target) ? 1 : 0.2,
                    border: matches.includes(item.target) ? '3px solid var(--accent-green)' : '3px dashed rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }}
                >
                  {item.target}
                </div>
             ))}
          </div>
       </div>
       <p style={{ marginTop: 40, color: 'var(--text-secondary)' }}>Hold and drag the emoji to its matching dark shadow.</p>
    </div>
  );
}

function TracingDrawMission({ questions, onComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trace guide from questions data
      if (questions[idx] && questions[idx].points) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 40;
        questions[idx].points.forEach((p, i) => {
          const x = p[0] * canvas.width;
          const y = p[1] * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
        ctx.lineWidth = 5;
        questions[idx].points.forEach((p, i) => {
          const x = p[0] * canvas.width;
          const y = p[1] * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 12;
      }
    }
  }, [idx, questions]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setPoints(prev => [...prev, { x, y }]);
  };

  const next = () => {
    if (!questions[idx]) return;
    if (idx < questions.length - 1) {
      setIdx(prev => prev + 1);
      setPoints([]);
    } else {
      onComplete({ motor_accuracy: points.length > 50 ? 95.0 : 40.0 });
    }
  };

  if (!questions || !questions[idx]) {
    return (
      <div className="mission-card" style={{ padding: '60px', textAlign: 'center' }}>
         <h2 style={{ color: 'var(--accent-orange)' }}>Initializing Kinetic Field...</h2>
         <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  const symbol = questions[idx].label || questions[idx];

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center' }}>
       <div className="mission-header" style={{ marginBottom: 20 }}>
          <span className="badge" style={{ background: 'var(--accent-orange)' }}>✍️ KINETIC TRACING</span>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginTop: 10 }}>Trace the Symbol</h2>
       </div>
       
       <div style={{ position: 'relative', width: 600, height: 400, margin: '0 auto' }}>
          <canvas 
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => setIsDrawing(false)}
            style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '32px', border: '3px solid rgba(255,255,255,0.1)', cursor: 'crosshair', width: '100%', height: '100%' }}
          />
          {/* Overlay symbol text if points fail or for extra clarity */}
          {!questions[idx].points && (
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12rem', opacity: 0.1, pointerEvents: 'none' }}>
                {questions[idx].label || questions[idx]}
             </div>
          )}
       </div>

       <div style={{ marginTop: 30 }}>
          <button className="btn-primary" onClick={next} style={{ padding: '16px 48px' }}>Capture Neural Trace</button>
       </div>
    </div>
  );
}

function ObservationSequenceMission({ questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('observe'); 
  const [input, setInput] = useState([]);
  const [score, setScore] = useState(0);
  const timerRefs = useRef([]);
  const completedRef = useRef(false);

  const clearTimers = () => {
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
  };

  useEffect(() => {
    if (phase === 'observe') {
      speak("Look closely.", 1.0);
      const timer = setTimeout(() => setPhase('input'), 3000);
      timerRefs.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [idx, phase]);

  useEffect(() => {
    return () => {
      clearTimers();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleItemClick = (item) => {
    if (phase !== 'input') return;
    if (!questions[idx] || !questions[idx].items) return;

    setInput(prev => {
      if (prev.length >= questions[idx].items.length) return prev;
      const ni = [...prev, item];
      
      if (ni.length === questions[idx].items.length) {
        const isCorrect = ni.every((val, i) => val === questions[idx].items[i].image);
        if (isCorrect) setScore(s => s + 1);
        setPhase('complete');
        
        const t = setTimeout(() => {
          if (idx < questions.length - 1) {
            setIdx(prevIdx => prevIdx + 1);
            setInput([]);
            setPhase('observe');
          } else if (!completedRef.current) {
            completedRef.current = true;
            onComplete({ memory_score: ((isCorrect ? score + 1 : score) / questions.length) * 100 });
          }
        }, 1200);
        timerRefs.current.push(t);
      }
      return ni;
    });
  };

  if (!questions || !questions[idx] || !questions[idx].items) {
    return (
      <div className="mission-card" style={{ padding: '60px', textAlign: 'center' }}>
         <h2 style={{ color: 'var(--accent-blue)' }}>Loading Neural Sequence...</h2>
         <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  // Fallback for options if missing in data
  const options = questions[idx].options || questions[idx].items.map(it => it.image);

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
       <div className="mission-header" style={{ marginBottom: 40 }}>
          <span className="badge" style={{ background: phase === 'observe' ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
             {phase === 'observe' ? '🔭 MEMORIZE SEQUENCE' : '🧠 RECALL SEQUENCE'}
          </span>
       </div>
       
       <div style={{ display: 'flex', gap: 20, justifyContent: 'center', minHeight: 120, marginBottom: 50 }}>
          {phase === 'observe' ? (
             questions[idx].items.map((it, i) => (
               <div key={i} className="seq-item anim-float" style={{ fontSize: '5rem', background: 'rgba(255,255,255,0.05)', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', border: '2px solid rgba(255,255,255,0.1)' }}>
                 {it.image}
               </div>
             ))
          ) : (
             <>
               {input.map((it, i) => (
                 <div key={i} className="seq-item anim-bounce-pop" style={{ fontSize: '5rem', background: 'var(--accent-blue)', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', boxShadow: '0 12px 24px rgba(0, 163, 224, 0.4)' }}>
                   {it}
                 </div>
               ))}
               {Array(Math.max(0, questions[idx].items.length - input.length)).fill(0).map((_, i) => (
                 <div key={`empty-${i}`} style={{ width: 110, height: 110, border: '4px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }} />
               ))}
             </>
          )}
       </div>

       {phase === 'input' && (
         <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', maxWidth: 600, margin: '0 auto' }}>
            {options.map((opt, i) => (
              <button 
                key={i} 
                className="btn-icon" 
                onClick={() => handleItemClick(opt)}
                style={{ fontSize: '4rem', width: 110, height: 110, borderRadius: '28px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {opt}
              </button>
            ))}
         </div>
       )}

       {phase === 'complete' && (
         <div className="anim-bounce-pop" style={{ marginTop: 20 }}>
            <div style={{ fontSize: '3rem', color: 'var(--accent-green)', fontWeight: 800 }}>✨ SEQUENCE CAPTURED ✨</div>
         </div>
       )}
    </div>
  );
}


function SequenceListeningTest({ rounds, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('listen'); 
  const [input, setInput] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRefs = useRef([]);
  const completedRef = useRef(false);

  const clearTimers = () => {
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
  };

  const safeSpeak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
       speak(text, 1.0);
    }
  };

  const playSequence = () => {
    if (!rounds || !rounds[idx] || !rounds[idx].sequence) return;
    setPhase('listen');
    setInput([]);
    clearTimers();

    const seq = rounds[idx].sequence;
    safeSpeak("Listen and repeat.");

    seq.forEach((dir, i) => {
      const t = setTimeout(() => {
        safeSpeak(dir);
        if (i === seq.length - 1) {
          const t2 = setTimeout(() => setPhase('input'), 1000);
          timerRefs.current.push(t2);
        }
      }, (i + 1) * 1400);
      timerRefs.current.push(t);
    });
  };

  useEffect(() => {
    if (!rounds || rounds.length === 0) return;
    playSequence();
    return () => {
      clearTimers();
      window.speechSynthesis?.cancel();
    };
  }, [idx, rounds]);

  const handlePick = (d) => {
    if (phase === 'listen') return;
    if (!rounds[idx] || !rounds[idx].sequence) return;
    
    const seq = rounds[idx].sequence;
    if (input.length >= seq.length) return;

    setInput(prev => {
      const ni = [...prev, d];
      
      if (ni.length === seq.length) {
        const isCorrect = ni.every((val, i) => val === seq[i]);
        if (isCorrect) setCorrectCount(c => c + 1);
        setPhase('listen'); 
        
        const t = setTimeout(() => {
          if (idx < rounds.length - 1) {
            setIdx(prevIdx => prevIdx + 1);
          } else if (!completedRef.current) {
            completedRef.current = true;
            onComplete({ response_time_variance: ((isCorrect ? correctCount + 1 : correctCount) / rounds.length) * 100 });
          }
        }, 1000);
        timerRefs.current.push(t);
      }
      return ni;
    });
  };

  if (!rounds || !rounds[idx] || !rounds[idx].sequence) {
    return (
      <div className="mission-card" style={{ padding: '60px', textAlign: 'center' }}>
         <h2 style={{ color: 'var(--accent-blue)' }}>Synchronizing Audio Subsystem...</h2>
         <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
       <div className="mission-header" style={{ marginBottom: 40 }}>
          <span className="badge" style={{ background: phase === 'listen' ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
             {phase === 'listen' ? '📡 LISTEN CAREFULLY' : '⌨️ TRANSMIT SEQUENCE'}
          </span>
       </div>
       
       <div style={{ display: 'flex', gap: 20, justifyContent: 'center', minHeight: 120, marginBottom: 50 }}>
          {input.map((it, i) => (
             <div key={i} className="seq-item anim-bounce-pop" style={{ fontSize: '5rem', background: 'var(--accent-blue)', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', boxShadow: '0 12px 24px rgba(0, 163, 224, 0.4)' }}>
                {it === 'UP' ? '⬆️' : it === 'DOWN' ? '⬇️' : it === 'LEFT' ? '⬅️' : '➡️'}
             </div>
          ))}
          {Array(Math.max(0, rounds[idx].sequence.length - input.length)).fill(0).map((_, i) => (
            <div key={`empty-${i}`} style={{ width: 110, height: 110, border: '4px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }} />
          ))}
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 360, margin: '0 auto' }}>
          {[
            { id: 'UP', icon: '⬆️', color: 'var(--accent-blue)' },
            { id: 'LEFT', icon: '⬅️', color: 'var(--accent-orange)' },
            { id: 'RIGHT', icon: '➡️', color: 'var(--accent-yellow)' },
            { id: 'DOWN', icon: '⬇️', color: 'var(--accent-green)' }
          ].map(dir => (
             <button 
               key={dir.id} 
               disabled={phase === 'listen' || input.length >= rounds[idx].sequence.length}
               onClick={() => handlePick(dir.id)}
               style={{ 
                 fontSize: '3.5rem', 
                 height: 110, 
                 background: 'rgba(255,255,255,0.05)', 
                 border: `2px solid ${dir.color}`, 
                 borderRadius: '32px', 
                 cursor: (phase === 'listen' || input.length >= rounds[idx].sequence.length) ? 'not-allowed' : 'pointer', 
                 opacity: (phase === 'listen' || input.length >= rounds[idx].sequence.length) ? 0.3 : 1,
                 transition: 'all 0.2s',
                 transform: (phase === 'input') ? 'scale(1)' : 'scale(0.95)'
               }}
               className="btn-direction"
             >
                {dir.icon}
             </button>
          ))}
       </div>
    </div>
  );
}

function LetterPickMission({ questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    if (questions && questions[idx]) {
      speak(`Find the image that starts with the letter ${questions[idx].letter}`, 0.8);
    }
  }, [idx, questions]);

  const handleChoice = (img) => {
    if (!questions[idx]) return;
    const isCorrect = img === questions[idx].answer;
    if (isCorrect) setCorrect(c => c + 1);
    
    if (idx < questions.length - 1) {
      setIdx(prev => prev + 1);
    } else {
      onComplete({ phonological_score: (((isCorrect ? correct + 1 : correct)) / questions.length) * 100 });
    }
  };

  if (!questions || questions.length === 0 || !questions[idx]) {
    return (
      <div className="mission-card" style={{ padding: '60px', textAlign: 'center' }}>
         <h2>Loading Phonic Mission...</h2>
         <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    );
  }

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center' }}>
       <div className="mission-header">
          <span className="badge">Phonic Identification</span>
       </div>

       <div className="float-rotate pulse-glow" style={{ fontSize: '12rem', fontWeight: 900, color: 'var(--accent-orange)', marginBottom: 60, textShadow: '0 0 40px rgba(255, 107, 0, 0.3)' }}>
         {questions[idx].letter}
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {questions[idx].images.map((img, i) => {
            const hasText = img.length > 2;
            return (
               <button 
                 key={i} 
                 onClick={() => handleChoice(img)}
                 className="btn-image-pick"
                 style={{ 
                   padding: '30px', 
                   fontSize: hasText ? '1.5rem' : '5rem', 
                   background: 'rgba(255,255,255,0.03)', 
                   border: '2px solid rgba(255,255,255,0.1)', 
                   borderRadius: '32px',
                   transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                 }}
               >
                 {img}
               </button>
            );
          })}
       </div>
       <p style={{ marginTop: 40, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Click the object that starts with <strong style={{ color: 'var(--accent-orange)' }}>{questions[idx].letter}</strong></p>
    </div>
  );
}

// ─── ERROR BOUNDARY ───

import React from 'react';

function SpeechReadingMission({ passage, onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const targetText = passage || "The architect observed the complex blueprints carefully. He saw a slight error and felt worried before he left the office.";

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Vocal sensors (Speech Recognition) not supported in this terminal.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognitionRef.current.onerror = (e) => {
      console.error("Vocal Scan Error:", e.error);
      if (e.error === 'not-allowed') setError("Microphone access denied. Please enable sensors.");
      setIsRecording(false);
    };

    return () => recognitionRef.current?.stop();
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      const words = targetText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").split(/\s+/);
      const heard = transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").split(/\s+/);
      const matches = words.filter(w => heard.includes(w)).length;
      setAccuracy((matches / words.length) * 100);
    } else {
      setTranscript('');
      setAccuracy(null);
      setError(null);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Start failed", e);
      }
    }
  };

  return (
    <div className="mission-card anim-scale-in" style={{ padding: '48px', textAlign: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40 }}>
       <h2 className="badge" style={{ marginBottom: 24, letterSpacing: '0.2em' }}>NEURAL VOCAL DIAGNOSTIC</h2>
       <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>Sector: Linguistic Processing Analysis</p>

       <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 40, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
          <p style={{ fontSize: '1.8rem', lineHeight: 1.8, color: '#fff', fontWeight: 500, letterSpacing: '-0.01em', textAlign: 'left' }}>{targetText}</p>
       </div>

       <div className={`transcript-area ${isRecording ? 'recording-active' : ''}`} style={{ minHeight: 160, padding: 32, background: 'rgba(0,0,0,0.6)', borderRadius: 24, border: `2px solid ${isRecording ? 'var(--accent-orange)' : 'var(--accent-blue)'}`, marginBottom: 40, textAlign: 'left', transition: 'all 0.4s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={isRecording ? 'pulse-red' : ''} style={{ width: 12, height: 12, borderRadius: '50%', background: isRecording ? '#ff4d4d' : '#333' }} />
                <span style={{ color: isRecording ? '#ff4d4d' : 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                   {isRecording ? 'LIVE VOCAL SIGNAL MONITOR' : 'SENSOR STANDBY'}
                </span>
             </div>
             {error && <span style={{ color: 'var(--accent-orange)', fontSize: '0.75rem', fontWeight: 800 }}>[ {error} ]</span>}
          </div>
          <p style={{ fontSize: '1.3rem', color: transcript ? '#fff' : 'rgba(255,255,255,0.2)', fontStyle: transcript ? 'normal' : 'italic', lineHeight: 1.6, minHeight: '1.6em' }}>
             {transcript || "Waiting for vocal input signal..."}
          </p>
       </div>

       {accuracy !== null && (
         <div className="anim-bounce-pop" style={{ marginBottom: 40, padding: 32, background: 'rgba(0,255,128,0.08)', borderRadius: 24, border: '1px solid rgba(0,255,128,0.3)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase' }}>Diagnostic Accuracy Metric</div>
            <h3 style={{ color: 'var(--accent-green)', fontSize: '2.5rem', fontWeight: 900 }}>{accuracy.toFixed(1)}%</h3>
         </div>
       )}

       <div style={{ display: 'flex', gap: 20 }}>
         <button 
           className={`btn-primary ${isRecording ? 'active' : ''}`} 
           onClick={toggleRecording}
           style={{ flex: 1, height: 80, fontSize: '1.3rem', fontWeight: 900, background: isRecording ? '#cc3333' : 'var(--accent-blue)', borderRadius: 24, boxShadow: isRecording ? '0 0 30px rgba(204,51,51,0.4)' : 'var(--shadow-premium)' }}
         >
            {isRecording ? 'TERMINATE SCAN' : 'INITIALIZE VOCAL SENSORS'}
         </button>
         
         {accuracy !== null && (
           <button className="btn-secondary" onClick={() => onComplete({ reading_accuracy: accuracy })} style={{ width: 100, borderRadius: 24, fontSize: '1.5rem' }}>
              ➔
           </button>
         )}
       </div>
    </div>
  );
}

function NeuralLaunchMission({ onComplete, content }) {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState('READY'); // READY, LAUNCH, PICK
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);

  const rounds = content?.rounds || [
    { gap: 800, desc: "Sector 1: Sub-Orbital" },
    { gap: 400, desc: "Sector 2: Atmospheric" },
    { gap: 200, desc: "Sector 3: Stratospheric" },
    { gap: 100, desc: "Sector 4: Deep Space" },
    { gap: 50,  desc: "Sector 5: Warp Velocity" }
  ];

  const handleLaunch = () => {
    setStage('LAUNCH');
    const first = Math.random() > 0.5 ? 'ROCKET' : 'UFO';
    const second = first === 'ROCKET' ? 'UFO' : 'ROCKET';
    setWinner(first);

    setTimeout(() => {
      const el1 = document.getElementById(`craft-${first}`);
      if (el1) el1.classList.add('launched');
      
      setTimeout(() => {
        const el2 = document.getElementById(`craft-${second}`);
        if (el2) el2.classList.add('launched');
        
        setTimeout(() => setStage('PICK'), 1500);
      }, rounds[idx].gap);
    }, 1000);
  };

  useEffect(() => {
    if (stage === 'READY') {
      const timer = setTimeout(handleLaunch, 1500);
      return () => clearTimeout(timer);
    }
  }, [idx, stage]);

  const handlePick = (pick) => {
    if (stage !== 'PICK') return;
    const isCorrect = pick === winner;
    if (isCorrect) setScore(s => s + 1);
    
    if (idx < rounds.length - 1) {
      setIdx(idx + 1);
      setStage('READY');
      setWinner(null);
      // Remove launched classes
      document.querySelectorAll('.craft').forEach(el => el.classList.remove('launched'));
    } else {
      onComplete({ response_time_variance: ((isCorrect ? score + 1 : score) / rounds.length) * 100 });
    }
  };

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: 48, overflow: 'hidden' }}>
       <h2 className="badge" style={{ marginBottom: 20 }}>NEURAL LAUNCH DIAGNOSTIC</h2>
       <p style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 60 }}>
          {rounds[idx].desc}
       </p>
       
       <div style={{ height: 300, position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 60 }}>
          {/* Finish Line */}
          <div style={{ position: 'absolute', right: 80, top: 0, bottom: 0, width: 4, background: 'repeating-linear-gradient(0deg, #fff, #fff 10px, transparent 10px, transparent 20px)', opacity: 0.2 }} />
          
          <div id="craft-ROCKET" className="craft" style={{ top: '25%' }}>🚀</div>
          <div id="craft-UFO" className="craft" style={{ top: '65%' }}>🛸</div>
       </div>

       <div style={{ minHeight: 120 }}>
          {stage === 'PICK' && (
            <div className="anim-pop-in">
               <p style={{ color: '#fff', marginBottom: 24, fontSize: '1.2rem', fontWeight: 600 }}>Which craft launched first?</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                  <button onClick={() => handlePick('ROCKET')} className="btn-secondary" style={{ padding: '20px 40px', fontSize: '2rem', borderRadius: 24 }}>🚀 ROCKET</button>
                  <button onClick={() => handlePick('UFO')} className="btn-secondary" style={{ padding: '20px 40px', fontSize: '2rem', borderRadius: 24 }}>🛸 UFO</button>
               </div>
            </div>
          )}
          {stage === 'LAUNCH' && (
             <div className="scanning-text">MONITORING LAUNCH TRAJECTORY...</div>
          )}
          {stage === 'READY' && (
             <div style={{ color: 'var(--text-muted)' }}>Synchronizing neural clocks...</div>
          )}
       </div>

       <style>{`
          .craft {
             position: absolute;
             left: 60px;
             font-size: 4rem;
             transition: left 1s cubic-bezier(0.45, 0.05, 0.55, 0.95);
             transform: translateY(-50%);
          }
          .craft.launched {
             left: calc(100% - 140px);
          }
       `}</style>

       <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {rounds.map((_, i) => (
            <div key={i} style={{ width: 40, height: 4, borderRadius: 2, background: i === idx ? 'var(--accent-blue)' : (i < idx ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'), transition: 'all 0.4s' }} />
          ))}
       </div>
    </div>
  );
}

function NeuralCategoryMission({ onComplete, rounds: propRounds }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const rounds = propRounds || [
    {
      title: "Bio-Sync Analysis",
      rule: "Identify the non-biological entity.",
      options: ['🍎', '🍌', '🍇', '🚗'],
      answer: '🚗'
    },
    {
      title: "Nutritional Filter",
      rule: "Identify the item that is not food.",
      options: ['🍔', '🍕', '🌮', '👟'],
      answer: '👟'
    },
    {
      title: "Transport Sector",
      rule: "Identify the item that cannot fly.",
      options: ['✈️', '🚀', '🚁', '🚲'],
      answer: '🚲'
    },
    {
      title: "Fauna Classification",
      rule: "Identify the non-living object.",
      options: ['🐶', '🐱', '🦁', '🧸'],
      answer: '🧸'
    },
    {
      title: "Sports Synchronization",
      rule: "Identify the item not used in sports.",
      options: ['⚽', '🏀', '🎾', '🥪'],
      answer: '🥪'
    }
  ];

  const handlePick = (choice) => {
    const isCorrect = choice === rounds[idx].answer;
    if (isCorrect) setScore(s => s + 1);
    
    if (idx < rounds.length - 1) {
      setIdx(prev => prev + 1);
    } else {
      onComplete({ confusion_score: ((isCorrect ? score + 1 : score) / rounds.length) * 100 });
    }
  };

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '48px', background: 'rgba(0,0,0,0.3)' }}>
       <h2 className="badge" style={{ marginBottom: 20 }}>NEURAL CATEGORY DIAGNOSTIC</h2>
       <div style={{ marginBottom: 40 }}>
          <p style={{ color: 'var(--accent-blue)', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            {rounds[idx].title}
          </p>
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 16, background: 'rgba(0, 255, 128, 0.1)', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 800 }}>
             {rounds[idx].rule}
          </div>
       </div>
       
       <div style={{ 
         display: 'grid', 
         gridTemplateColumns: 'repeat(2, 1fr)', 
         gap: 24, 
         maxWidth: 450, 
         margin: '0 auto 60px'
       }}>
          {rounds[idx].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handlePick(opt)}
              className="btn-secondary"
              style={{ 
                fontSize: '4.5rem', 
                height: 140, 
                borderRadius: 32, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.03)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {opt}
            </button>
          ))}
       </div>

       <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          {rounds.map((_, i) => (
            <div key={i} style={{ width: 40, height: 6, borderRadius: 3, background: i === idx ? 'var(--accent-blue)' : (i < idx ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'), transition: 'all 0.4s' }} />
          ))}
       </div>
    </div>
  );
}

function NeuralPatternRecallMission({ onComplete, levels: propLevels }) {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState('MEMORIZE'); // MEMORIZE, RECALL
  const [targetPattern, setTargetPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [score, setScore] = useState(0);

  const levels = propLevels || [
    { count: 3, time: 2000 },
    { count: 4, time: 2500 },
    { count: 5, time: 3000 },
    { count: 6, time: 3500 },
    { count: 7, time: 4000 }
  ];

  const generatePattern = () => {
    const indices = Array.from({ length: 9 }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    const newPattern = shuffled.slice(0, levels[idx].count);
    setTargetPattern(newPattern);
    setUserPattern([]);
    setStage('MEMORIZE');

    setTimeout(() => {
      setStage('RECALL');
    }, levels[idx].time);
  };

  useEffect(() => {
    generatePattern();
  }, [idx]);

  const handleCellClick = (cellIdx) => {
    if (stage !== 'RECALL' || userPattern.includes(cellIdx)) return;
    
    const newUserPattern = [...userPattern, cellIdx];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === targetPattern.length) {
      const isCorrect = targetPattern.every(p => newUserPattern.includes(p));
      if (isCorrect) setScore(s => s + 1);

      setTimeout(() => {
        if (idx < levels.length - 1) {
          setIdx(prev => prev + 1);
        } else {
          onComplete({ memory_score: ((isCorrect ? score + 1 : score) / levels.length) * 100 });
        }
      }, 800);
    }
  };

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: 48 }}>
       <h2 className="badge" style={{ marginBottom: 20 }}>NEURAL PATTERN RECALL</h2>
       <p style={{ color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 40 }}>
          {stage === 'MEMORIZE' ? 'MEMORIZE THE PATTERN' : 'REPLICATE THE NEURAL GRID'}
       </p>
       
       <div style={{ 
         display: 'grid', 
         gridTemplateColumns: 'repeat(3, 1fr)', 
         gap: 16, 
         width: 360, 
         margin: '0 auto 60px'
       }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const isTarget = targetPattern.includes(i);
            const isUserSelected = userPattern.includes(i);
            const showActive = (stage === 'MEMORIZE' && isTarget) || (stage === 'RECALL' && isUserSelected);
            
            return (
              <div
                key={i}
                onClick={() => handleCellClick(i)}
                style={{
                  height: 110,
                  borderRadius: 24,
                  background: showActive ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: showActive ? '0 0 30px var(--accent-yellow)' : 'inset 0 0 15px rgba(0,0,0,0.3)',
                  cursor: stage === 'RECALL' ? 'pointer' : 'default',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: showActive ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            );
          })}
       </div>

       <div style={{ minHeight: 40, color: 'var(--text-secondary)', fontWeight: 600 }}>
          {stage === 'MEMORIZE' ? 'Grid stabilizing...' : `Cells remaining: ${targetPattern.length - userPattern.length}`}
       </div>

       <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {levels.map((_, i) => (
            <div key={i} style={{ width: 40, height: 4, borderRadius: 2, background: i === idx ? 'var(--accent-yellow)' : (i < idx ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'), transition: 'all 0.4s' }} />
          ))}
       </div>
    </div>
  );
}

function VisualSearchMission({ onComplete, rounds: propRounds }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const rounds = propRounds || [
    { q: "Identify the incorrect spelling:", options: ["ENVIRONMENT", "ENVIORNMENT", "ENVIRONNENT", "ENVIROMENT"], a: "ENVIORNMENT" },
    { q: "Select the correctly spelled word:", options: ["NECESSARY", "NECESARY", "NECESSERY", "NECCESSARY"], a: "NECESSARY" },
    { q: "Identify the odd word out:", options: ["CHRONOLOGY", "TIMEPIECE", "CALENDAR", "TELESCOPE"], a: "TELESCOPE" },
    { q: "Which word is misspelled?", options: ["COLLEAGUE", "COLLEGE", "COLLAGE", "COLEAGUE"], a: "COLEAGUE" }
  ];

  const handlePick = (choice) => {
    const isCorrect = choice === rounds[idx].a;
    if (isCorrect) setScore(score + 1);
    
    if (idx < rounds.length - 1) setIdx(idx + 1);
    else onComplete({ spelling_score: ((score + (isCorrect ? 1 : 0)) / rounds.length) * 100 });
  };

  return (
    <div className="mission-card anim-scale-in" style={{ padding: '48px', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
       <h2 className="badge" style={{ marginBottom: 40 }}>ORTHOGRAPHIC SEARCH</h2>
       <div style={{ marginBottom: 40 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 20 }}>Visual Pattern Analysis:</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{rounds[idx].q}</h1>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {rounds[idx].options.map(opt => (
            <button key={opt} onClick={() => handlePick(opt)} className="btn-secondary" style={{ padding: '24px', fontSize: '1.2rem', borderRadius: 20 }}>
               {opt}
            </button>
          ))}
       </div>
    </div>
  );
}

function NeuralPerceptionMission({ onComplete, rounds: propRounds }) {
  const [startTime] = useState(Date.now());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  // Character sets that are commonly confused in dyslexia
  const rounds = propRounds || [
    { target: 'd', distractor: 'b', grid: 36 },
    { target: 'p', distractor: 'q', grid: 36 },
    { target: 'n', distractor: 'u', grid: 36 },
    { target: 'm', distractor: 'w', grid: 36 },
    { target: '6', distractor: '9', grid: 36 }
  ];

  const [currentRound, setCurrentRound] = useState(null);

  useEffect(() => {
    if (idx < rounds.length) {
      const r = rounds[idx];
      const items = Array(r.grid - 1).fill(r.distractor);
      const targetPos = Math.floor(Math.random() * r.grid);
      items.splice(targetPos, 0, r.target);
      setCurrentRound(items);
      speak(`Find the unique character.`, 1.0);
    }
  }, [idx]);

  const handlePick = (char) => {
    if (char === rounds[idx].target) {
      setScore(s => s + 1);
    }
    
    if (idx < rounds.length - 1) {
      setIdx(prev => prev + 1);
    } else {
      const totalTime = Date.now() - startTime;
      onComplete({ 
        ran_speed_score: totalTime,
        spelling_score: (score / rounds.length) * 100 
      });
    }
  };

  if (!currentRound) return <div className="spinner" />;

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '40px' }}>
       <h2 className="badge" style={{ marginBottom: 20 }}>NEURAL PERCEPTION DIAGNOSTIC</h2>
       <p style={{ color: 'var(--text-secondary)', marginBottom: 30, fontSize: '1.1rem' }}>Sector: Orthographic Orientation Analysis</p>
       
       <div style={{ 
         display: 'grid', 
         gridTemplateColumns: 'repeat(6, 1fr)', 
         gap: '10px', 
         background: 'rgba(0,0,0,0.3)', 
         padding: '24px', 
         borderRadius: '32px', 
         border: '1px solid rgba(255,255,255,0.1)',
         maxWidth: 500,
         margin: '0 auto'
       }}>
          {currentRound.map((char, i) => (
            <button
              key={i}
              onClick={() => handlePick(char)}
              style={{
                fontSize: '2rem',
                height: 60,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'monospace'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
            >
              {char}
            </button>
          ))}
       </div>

       <div style={{ marginTop: 30, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Round {idx + 1} / {rounds.length}
       </div>
    </div>
  );
}

function NeuralPatternMission({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('briefing');
  const [activeNode, setActiveNode] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(0);

  const rounds = [[0, 4, 8], [1, 3, 5, 7], [0, 2, 6, 8, 4]];

  useEffect(() => {
    if (phase === 'observe') {
      const seq = rounds[idx];
      let i = 0;
      const interval = setInterval(() => {
        if (i >= seq.length) {
          clearInterval(interval);
          setActiveNode(null);
          setTimeout(() => setPhase('input'), 500);
        } else {
          setActiveNode(seq[i]);
          i++;
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [idx, phase]);

  const handleNodeClick = (nodeId) => {
    if (phase !== 'input') return;
    const nextInput = [...userInput, nodeId];
    setUserInput(nextInput);
    
    if (nextInput.length === rounds[idx].length) {
      const isCorrect = JSON.stringify(nextInput) === JSON.stringify(rounds[idx]);
      if (isCorrect) setScore(s => s + 1);
      
      setTimeout(() => {
        if (idx < rounds.length - 1) {
          setIdx(idx + 1);
          setUserInput([]);
          setPhase('observe');
        } else {
          onComplete({ memory_score: ((isCorrect ? score + 1 : score) / rounds.length) * 100 });
        }
      }, 1000);
    }
  };

  if (phase === 'briefing') {
    return (
      <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.3)' }}>
         <h2 className="badge" style={{ marginBottom: 20 }}>PATTERN RECALL DIAGNOSTIC</h2>
         <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '1.2rem' }}>Observation Phase: Repeat the sequence of highlighted nodes precisely.</p>
         <button className="btn-primary" onClick={() => setPhase('observe')} style={{ padding: '20px 60px' }}>INITIALIZE TEST</button>
      </div>
    );
  }

  return (
    <div className="mission-card anim-scale-in" style={{ textAlign: 'center', padding: '40px' }}>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: 360, margin: '0 auto' }}>
          {Array.from({ length: 9 }).map((_, i) => (
             <div 
               key={i}
               onClick={() => handleNodeClick(i)}
               style={{ 
                 height: 100, 
                 borderRadius: 20, 
                 background: activeNode === i || userInput.includes(i) ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.05)',
                 border: '2px solid rgba(255,255,255,0.1)',
                 cursor: phase === 'input' ? 'pointer' : 'default',
                 transition: 'all 0.3s'
               }}
             />
          ))}
       </div>
    </div>
  );
}

class DiagnosticErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Diagnostic System Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mission-card" style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: 'var(--accent-orange)', fontSize: '2rem', marginBottom: 16 }}>SYSTEM EVALUATION FAILURE</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>The neural link for this sector was interrupted. Please recalibrate the connection.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>RECALIBRATE LINK</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── MAIN COMPONENT ───

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { studentId, studentAge, studentGrade } = useAuth();
  const [view, setView] = useState('hub'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [content, setContent] = useState(null);
  const [scores, setScores] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef(null);
  
  // Eye Tracking & Gesture States
  const [landmarker, setLandmarker] = useState(null);
  const [gazePoint, setGazePoint] = useState({ x: 0, y: 0 });
  const [gazeTrail, setGazeTrail] = useState([]); 
  const [gestures, setGestures] = useState({ blink: false, mouth: false, tilt: 0 });
  const [trackingActive, setTrackingActive] = useState(false);
  const [gazeData, setGazeData] = useState([]);
  const requestRef = useRef();

  // Branching Logic: Grade 3 and below = Early Learners (Emoji-based)
  // Grade 4 and above = Senior (Analytical-based)
  // Handles strings like "Grade 4" or "4"
  const gradeNum = parseInt(studentGrade?.toString().replace(/\D/g, '') || 1);
  const isEarly = gradeNum <= 3;

  const steps = isEarly ? [
    { id: 'early_reading', label: 'Reading', color: 'var(--accent-blue)', icon: '📖' },
    { id: 'trace_match', label: 'Match', color: 'var(--accent-green)', icon: '🧩' },
    { id: 'trace_draw', label: 'Trace', color: 'var(--accent-orange)', icon: '🖋️' },
    { id: 'sequence', label: 'Memory', color: 'var(--accent-yellow)', icon: '🧠' },
    { id: 'direction', label: 'Listen', color: 'var(--accent-blue)', icon: '🎧' },
    { id: 'letter_pick', label: 'Phonic', color: 'var(--accent-green)', icon: '🍎' }
  ] : [
    { id: 'speech_reading', label: 'Vocal Diagnostic', color: 'var(--accent-blue)', icon: 'V' },
    { id: 'visual_search', label: 'Orthographic Search', color: 'var(--accent-green)', icon: 'S' },
    { id: 'precision_track', label: 'Neural Perception Diagnostic', color: 'var(--accent-orange)', icon: '👁️' },
    { id: 'neural_pattern', label: 'Pattern Analysis', color: 'var(--accent-yellow)', icon: '▦' },
    { id: 'spatial_matrix', label: 'Neural Category Sync', color: 'var(--accent-blue)', icon: '🔍' },
    { id: 'phonic_analysis', label: 'Launch Sync', color: 'var(--accent-blue)', icon: '🚀' }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getAssessmentContent(studentAge || 8, studentId || "anonymous");
        setContent(res.data);
      } catch (e) {
        console.error("Content fetch failed, using fallback");
        setContent({
          passage: "The astronaut explored the distant galaxy.",
          early_reading_alt: [{ question: "Select CAT", options: ["CAT", "DOG"], answer: "CAT" }],
          trace_match: [{ target: "A", options: ["A", "B", "C", "D"] }],
          tracing: ["A"],
          sequencing: [{ items: [{ image: "🍎" }], options: ["🍎", "🍌"] }],
          directionality: [{ sequence: ["UP"] }],
          letter_img: [{ letter: "A", images: ["🍎", "🍌", "🍒"], answer: "🍎" }],
          phonic_replacement: [{ question: "Starts with B?", options: ["BALL", "CAT"], answer: "BALL" }]
        });
      }
    };
    fetchContent();
  }, [studentAge, studentId]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    const initTracking = async () => {
      try {
        await startCamera();
        const vision = await import('@mediapipe/tasks-vision');
        const { FaceLandmarker, FilesetResolver } = vision;
        const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        const fl = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        setLandmarker(fl);
        setTrackingActive(true);
      } catch (e) { 
        console.error("Eye Tracking Init Failed", e); 
      }
    };
    initTracking();

    return () => {
      window.speechSynthesis.cancel();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [studentAge]);

  const [sessionMetrics, setSessionMetrics] = useState({
    blinks: 0,
    tilts: [],
    gazeX: [],
    gazeY: []
  });

  const predictGaze = () => {
    if (!landmarker || !videoRef.current || videoRef.current.readyState < 3) {
      requestRef.current = requestAnimationFrame(predictGaze);
      return;
    }

    try {
      const results = landmarker.detectForVideo(videoRef.current, performance.now());
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        // Safety check for iris indices (468 and 473 are iris center landmarks)
        if (landmarks[468] && landmarks[473]) {
          const leftIris = landmarks[468];
          const rightIris = landmarks[473];
          const gazeX = (leftIris.x + rightIris.x) / 2;
          const gazeY = (leftIris.y + rightIris.y) / 2;
          const targetX = (1 - gazeX) * window.innerWidth;
          const targetY = gazeY * window.innerHeight;

          setGazePoint(prev => {
            const nx = prev.x * 0.4 + targetX * 0.6;
            const ny = prev.y * 0.4 + targetY * 0.6;
            setGazeTrail(t => [...t.slice(-12), { x: nx, y: ny }]);
            return { x: nx, y: ny };
          });

          setGazeData(prev => [...prev.slice(-150), { x: targetX, y: targetY, time: Date.now() }]);
        }

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const shapes = results.faceBlendshapes[0].categories;
          const blinkLeft = shapes.find(s => s.categoryName === 'eyeBlinkLeft')?.score || 0;
          const blinkRight = shapes.find(s => s.categoryName === 'eyeBlinkRight')?.score || 0;
          const jawOpen = shapes.find(s => s.categoryName === 'jawOpen')?.score || 0;
          const isBlinking = blinkLeft > 0.4 || blinkRight > 0.4;
          const tilt = landmarks[1] && landmarks[152] ? (landmarks[1].x - landmarks[152].x) * 100 : 0;
          
          setGestures({
            blink: isBlinking,
            mouth: jawOpen > 0.3,
            tilt: tilt
          });

          // Update Session Metrics
          if (isBlinking) {
            setSessionMetrics(prev => ({ ...prev, blinks: prev.blinks + 1 }));
          }
          const gazeCenter = landmarks[468] ? { x: landmarks[468].x, y: landmarks[468].y } : { x: 0.5, y: 0.5 };
          setSessionMetrics(prev => ({
            ...prev,
            tilts: [...prev.tilts.slice(-1000), tilt],
            gazeX: [...prev.gazeX.slice(-1000), gazeCenter.x],
            gazeY: [...prev.gazeY.slice(-1000), gazeCenter.y]
          }));
        }
      }
    } catch (err) {
      console.warn("Prediction frame skipped:", err);
    }
    requestRef.current = requestAnimationFrame(predictGaze);
  };

  useEffect(() => {
    if (trackingActive) requestRef.current = requestAnimationFrame(predictGaze);
  }, [trackingActive, landmarker]);

  const calculateEyeScore = () => {
    if (gazeData.length < 20) return 10;
    const avgX = gazeData.reduce((acc, p) => acc + p.x, 0) / gazeData.length;
    const variance = gazeData.reduce((acc, p) => acc + Math.pow(p.x - avgX, 2), 0) / gazeData.length;
    return Math.min(20, Math.floor(variance / 4000));
  };

  const [error, setError] = useState(null);

  useEffect(() => {
     console.log("Senior Diagnostic Sync:", { grade: studentGrade, isEarly });
  }, [studentGrade, isEarly]);

  const finish = async (s) => {
    if (submitting) return; 
    const ns = { ...scores, ...s };
    setScores(ns);
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    setView('hub');
  };

  const finalizeResults = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const eyeScore = calculateEyeScore();
    
    // Calculate Multi-modal variances
    const avgTilt = sessionMetrics.tilts.length > 0 ? sessionMetrics.tilts.reduce((a,b) => a+b, 0) / sessionMetrics.tilts.length : 0;
    const tiltVar = sessionMetrics.tilts.length > 0 ? sessionMetrics.tilts.reduce((acc, v) => acc + Math.pow(v - avgTilt, 2), 0) / sessionMetrics.tilts.length : 0;
    
    const avgX = sessionMetrics.gazeX.length > 0 ? sessionMetrics.gazeX.reduce((a,b) => a+b, 0) / sessionMetrics.gazeX.length : 0;
    const gazeVarX = sessionMetrics.gazeX.length > 0 ? sessionMetrics.gazeX.reduce((acc, v) => acc + Math.pow(v - avgX, 2), 0) / sessionMetrics.gazeX.length : 0;

    const avgY = sessionMetrics.gazeY.length > 0 ? sessionMetrics.gazeY.reduce((a,b) => a+b, 0) / sessionMetrics.gazeY.length : 0;
    const gazeVarY = sessionMetrics.gazeY.length > 0 ? sessionMetrics.gazeY.reduce((acc, v) => acc + Math.pow(v - avgY, 2), 0) / sessionMetrics.gazeY.length : 0;

    const finalPayload = {
      student_id: studentId || "anonymous",
      age: studentAge || 8,
      reading_speed: scores.reading_speed ?? 100.0,
      reading_accuracy: scores.reading_accuracy ?? 100.0,
      spelling_score: scores.spelling_score ?? 100.0,
      phonological_score: scores.phonological_score ?? 0.0,
      memory_score: scores.memory_score ?? 0.0,
      confusion_score: scores.confusion_score ?? 0.0,
      writing_error_rate: scores.writing_error_rate ?? 0.0,
      response_time_variance: scores.response_time_variance ?? 0.0,
      ran_speed_score: scores.ran_speed_score ?? 5000.0,
      eye_tracking_score: eyeScore,
      blink_count: sessionMetrics.blinks,
      tilt_variance: tiltVar,
      gaze_variance_x: gazeVarX,
      gaze_variance_y: gazeVarY
    };
    try {
      const res = await submitAssessment(finalPayload);
      navigate('/results', { state: { result: res.data, scores: finalPayload } });
    } catch (err) { 
      console.error("Submission failed:", err);
      setError("Telemetry link failed. Check your connection or database status.");
      setSubmitting(false); 
    }
  };

  if (!content) return <div className="page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div className="page-bg" style={{ padding: '0 0 100px 0' }}>
      {trackingActive && (
        <svg style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9998 }}>
           {gazeTrail.map((p, i) => i > 0 && (
             <line key={i} x1={gazeTrail[i-1].x} y1={gazeTrail[i-1].y} x2={p.x} y2={p.y} stroke="var(--accent-blue)" strokeWidth={2} strokeOpacity={i / gazeTrail.length} strokeDasharray="4 2" />
           ))}
           <circle cx={gazePoint.x} cy={gazePoint.y} r={12} fill="var(--accent-blue)" fillOpacity={0.3} stroke="var(--accent-blue)" strokeWidth={2} />
           <circle cx={gazePoint.x} cy={gazePoint.y} r={4} fill="var(--accent-yellow)" />
        </svg>
      )}

      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000, width: 200, padding: 12, background: 'rgba(0, 45, 58, 0.85)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-premium)' }}>
         <div style={{ width: '100%', height: 130, borderRadius: 20, background: '#000', overflow: 'hidden', border: gestures.blink ? '3px solid var(--accent-yellow)' : '2px solid var(--accent-blue)', transition: 'all 0.1s' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} muted playsInline autoPlay />
         </div>
         <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <div style={{ padding: '4px 8px', borderRadius: 8, background: gestures.blink ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.1)', color: gestures.blink ? '#000' : '#fff', fontSize: '0.6rem', fontWeight: 800 }}>BLINK</div>
            <div style={{ padding: '4px 8px', borderRadius: 8, background: gestures.mouth ? 'var(--accent-orange)' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.6rem', fontWeight: 800 }}>MOUTH</div>
         </div>
         <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.1)', marginTop: 12, borderRadius: 2 }}>
            <div style={{ height: '100%', width: '50%', background: 'var(--accent-blue)', marginLeft: `${50 + gestures.tilt}%`, transition: 'all 0.1s' }} />
         </div>
      </div>

      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0, 45, 58, 0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
         <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 220 }}>
               <div style={{ width: 56, height: 56, borderRadius: 20, background: view === 'mission' ? steps[currentStep].color : 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                  {view === 'mission' ? steps[currentStep].icon : '🚀'}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {view === 'mission' ? `Phase ${currentStep+1} / ${steps.length}` : (isEarly ? 'Mission Command Hub' : 'System Diagnostic Suite')}
                  </div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                    {view === 'mission' ? steps[currentStep].label : (isEarly ? 'Deployment Dashboard' : 'Neural Sector Overview')}
                  </h1>
               </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
               {steps.map((s, i) => (
                 <div key={s.id} style={{ width: 30, height: 10, borderRadius: 99, background: completedSteps.includes(i) ? steps[i].color : 'rgba(255,255,255,0.1)', transition: 'all 0.5s' }} />
               ))}
            </div>
         </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '30px auto 0', padding: '0 24px' }}>
         {submitting ? (
           <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <img src={ASTRO_IMG} className="astronaut-avatar anim-float-y" style={{ width: 200, height: 200, marginBottom: 40 }} alt="Astro" />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Analyzing Neural Patterns...</h2>
              <div className="spinner" style={{ margin: '20px auto' }} />
           </div>
         ) : error ? (
           <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ fontSize: '5rem', marginBottom: 24 }}>📡❌</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-orange)' }}>Link Failure</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{error}</p>
              <button className="btn-primary" onClick={finalizeResults}>Retry Transmission</button>
           </div>
         ) : view === 'hub' ? (
           <div className="anim-scale-in">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32, background: 'rgba(255,255,255,0.03)', padding: '20px 32px', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                 <img src={ASTRO_IMG} className="astronaut-avatar anim-float-y" style={{ width: 60, height: 60 }} alt="Astro" />
                 <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Welcome back, Cadet!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a neural sector to begin diagnostic mapping.</p>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
                 {steps.map((s, i) => {
                    const isDone = completedSteps.includes(i);
                    return (
                       <div 
                         key={s.id} 
                         className={`mission-card hub-card ${isDone ? 'completed' : ''}`}
                         onClick={() => {
                            if (!isDone) {
                               setCurrentStep(i);
                               setView('mission');
                            }
                         }}
                         style={{
                            padding: '32px',
                            background: isDone ? 'rgba(0, 255, 128, 0.05)' : 'rgba(255,255,255,0.02)',
                            border: isDone ? '2px solid var(--accent-green)' : '2px solid rgba(255,255,255,0.1)',
                            borderRadius: 32,
                            cursor: isDone ? 'default' : 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                         }}
                       >
                          <div style={{ width: 64, height: 64, borderRadius: 20, background: isDone ? 'var(--accent-green)' : s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 20 }}>
                             {isDone ? '✅' : s.icon}
                          </div>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>{s.label}</h3>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                             {isDone ? 'Diagnostic data successfully mapped.' : 'Neural sector pending assessment.'}
                          </p>
                          <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 12, background: isDone ? 'rgba(0, 255, 128, 0.1)' : 'rgba(255,255,255,0.05)', color: isDone ? 'var(--accent-green)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                             {isDone ? 'COMPLETED' : 'YET TO TAKE'}
                          </div>
                       </div>
                    );
                 })}
              </div>

              {completedSteps.length === steps.length && (
                <div className="anim-bounce-pop" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 163, 224, 0.1), rgba(0, 255, 128, 0.1))', padding: '48px', borderRadius: 40, border: '2px solid var(--accent-blue)' }}>
                   <div style={{ fontSize: '4rem', marginBottom: 20 }}>🌌🏆</div>
                   <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 12 }}>Assessment Complete!</h2>
                   <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                      All neural sectors have been mapped. Ready to transmit diagnostic data to Command Center.
                   </p>
                   <button className="btn-primary" onClick={finalizeResults} style={{ padding: '20px 60px', fontSize: '1.4rem' }}>
                      Finalize Neural Report 🚀
                   </button>
                </div>
              )}
           </div>
         ) : (
           <div key={currentStep}>
              <DiagnosticErrorBoundary>
                {steps[currentStep] ? (
                  <>
                   {steps[currentStep].id === 'speech_reading' && <SpeechReadingMission passage={content.passage} onComplete={finish} />}
                   {steps[currentStep].id === 'precision_track' && <NeuralPerceptionMission rounds={content.precision_track} onComplete={finish} />}
                   {steps[currentStep].id === 'visual_search' && <VisualSearchMission rounds={content.visual_search} onComplete={finish} />}
                   {steps[currentStep].id === 'neural_pattern' && <NeuralPatternRecallMission levels={content.neural_pattern} onComplete={finish} />}
                   {steps[currentStep].id === 'spatial_matrix' && <NeuralCategoryMission rounds={content.spatial_matrix} onComplete={finish} />}
                   {steps[currentStep].id === 'phonic_analysis' && <NeuralLaunchMission content={content.phonic_analysis} onComplete={finish} />}
                   {steps[currentStep].id === 'reading_passage' && <ReadingPassageTest passage={content.passage} onComplete={finish} />}
                   {steps[currentStep].id === 'trace_match' && <TraceShadowMission items={content.trace_match} onComplete={finish} />}
                   {steps[currentStep].id === 'visual_logic' && <EarlyVisualReadingMission questions={content.early_reading_alt} onComplete={finish} />}
                   {steps[currentStep].id === 'trace_draw' && <TracingDrawMission questions={content.tracing} onComplete={finish} />}
                   {steps[currentStep].id === 'sequence' && <ObservationSequenceMission questions={content.sequencing} onComplete={finish} />}
                   {steps[currentStep].id === 'direction' && <SequenceListeningTest rounds={content.directionality} onComplete={finish} />}
                   {steps[currentStep].id === 'letter_pick' && <LetterPickMission questions={content.letter_img} onComplete={finish} />}
                   {steps[currentStep].id === 'phonic_logic' && <EarlyVisualReadingMission questions={content.phonic_replacement} onComplete={finish} />}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '100px 0' }}>
                     <h2 style={{ color: 'var(--accent-orange)' }}>Mission Synchronizing...</h2>
                     <div className="spinner" style={{ margin: '20px auto' }} />
                  </div>
                )}
              </DiagnosticErrorBoundary>
           </div>
         )}
      </div>
    </div>
  );
}
