
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { askOpenRouterMentor } from '../../services/operations/mentorAPI';
import avatar from '../../assets/ai-avatar.png';
import styles from './MiniMentorWidget.module.css';

const STORAGE_KEY = 'mini-mentor-history-v1';
const ICON_KEY = 'mini-mentor-pos';
const ICON_SIZE = 56;
const PADDING = 8;

export default function MiniMentorWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const iconRef = useRef(null);
  const endRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const [pos, setPos] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(ICON_KEY) || '{}');
    return saved.x && saved.y ? saved : { x: window.innerWidth - ICON_SIZE - 24, y: window.innerHeight - ICON_SIZE - 24 };
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20))); }, [messages]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function onPointerDown(e) {
    setDragging(true);
    const rect = iconRef.current.getBoundingClientRect();
    dragOffset.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const x = clamp(e.clientX - dragOffset.current.dx, PADDING, window.innerWidth - ICON_SIZE - PADDING);
    const y = clamp(e.clientY - dragOffset.current.dy, PADDING, window.innerHeight - ICON_SIZE - PADDING);
    setPos({ x, y });
  }

  function onPointerUp() {
    setDragging(false);
    const snapLeft = pos.x;
    const snapRight = window.innerWidth - (pos.x + ICON_SIZE);
    const x = snapLeft <= snapRight ? PADDING : window.innerWidth - ICON_SIZE - PADDING;
    const y = clamp(pos.y, PADDING, window.innerHeight - ICON_SIZE - PADDING);
    setPos({ x, y });
    localStorage.setItem(ICON_KEY, JSON.stringify({ x, y }));
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  async function sendQuestion() {
    const q = input.trim();
    if (!q) return;
    const userMsg = { from: 'user', text: q, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
  try {
    
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/openrouter-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      const json = await res.json();
      // const json = await askOpenRouterMentor(q);
      const payload = json?.mentor ? json.mentor : json;
      const mentorMsg = {
        from: 'mentor',
        text: payload?.answer || 'No response',
        follow_up: payload?.follow_up || '',
        time: new Date().toISOString()
      };
      setMessages(prev => [...prev, mentorMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { from: 'mentor', text: 'Sorry, could not get an answer.' }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  }

  function onKeyDown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuestion(); } }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sizes = useMemo(() => {
    const isMobile = window.innerWidth < 480;
    return { chatWidth: isMobile ? 300 : 360, chatMaxHeight: isMobile ? 340 : 420 };
  }, []);

  const chatStyle = useMemo(() => {
    const { chatWidth, chatMaxHeight } = sizes;
    let left = clamp(pos.x + ICON_SIZE - chatWidth, PADDING, window.innerWidth - chatWidth - PADDING);
    let top = pos.y - chatMaxHeight - 8;
    if (top < PADDING) top = clamp(pos.y - chatMaxHeight - 8, PADDING, window.innerHeight - chatMaxHeight - ICON_SIZE - 8);
    if (top < PADDING) top = window.innerHeight - chatMaxHeight - ICON_SIZE - 8 - PADDING;
    return { left, top };
  }, [pos, sizes]);

  return (
    <>
      {/* Floating Icon */}
      <div ref={iconRef} onPointerDown={onPointerDown} onClick={() => setOpen(v => !v)}
           className={`${styles.rootIcon} ${dragging ? styles.dragging : ''}`}
           style={{ left: pos.x, top: pos.y }}>
        <img src={avatar} alt="Mini Mentor" style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE/2 }} />
      </div>

      {/* Chat Window */}
      <div className={`${styles.chat} ${open ? styles.open : ''}`} style={{ left: chatStyle.left, top: chatStyle.top, width: sizes.chatWidth, maxHeight: sizes.chatMaxHeight }}>
        <div className={styles.header}>
          <div className={styles.title}>MindSmith Ai</div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
        </div>
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.row} ${m.from==='user'?styles.user:styles.mentor}`}>
              <div className={`${styles.bubble} ${m.from==='user'?styles.userBubble:styles.mentorBubble}`}>
                <div dangerouslySetInnerHTML={{ __html: (m.text||'').replace(/\n/g,'<br/>') }} />
                {m.follow_up && <div className={styles.followUp}>
                  <button onClick={() => setInput(m.follow_up)} className={styles.followUpChip}>{m.follow_up}</button>
                </div>}
              </div>
            </div>
          ))}
          {loading && <div className={styles.row} style={{ color:'#6b7280', fontSize:12 }}>Mini Mentor is typing…</div>}
          <div ref={endRef} />
        </div>
        <div className={styles.composer}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown} rows={2} placeholder="Ask a question..." className={styles.input} />
          <button onClick={sendQuestion} disabled={loading} className={styles.sendBtn}>Ask</button>
        </div>
      </div>
    </>
  );
}
