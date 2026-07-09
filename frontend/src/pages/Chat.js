import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    
    const userMsg = { role: "user", text: question };
    setHistory(prev => [...prev, userMsg]);
    setQuestion("");

    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, user_id: userId })
      });
      const data = await res.json();
      
      const aiMsg = { role: "ai", text: data.response || data.error };
      setHistory(prev => [...prev, aiMsg]);
    } catch (_err) {
      const errorMsg = { role: "ai", text: "I'm having trouble connecting to my brain. Is the backend server running?" };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="section" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <header style={{ marginBottom: '1.5rem', textAlign: 'center', flexShrink: 0 }}>
            <h1 className="neon-text" style={{ fontSize: '2.5rem', margin: 0 }}>Financial AI Advisor</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>Data-driven insights for your wealth management.</p>
          </header>
          
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', scrollBehavior: 'smooth' }}>
              {history.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5 }}>
                  <p>How can I help you optimize your RWF transactions today?</p>
                </div>
              )}
              <AnimatePresence>
                {history.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      padding: '1.25rem',
                      borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                      background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 'bold', opacity: 0.4, display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {msg.role === 'user' ? 'CLIENT' : 'FINTECH INTELLIGENCE'}
                      </span>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  style={{ display: 'flex', gap: '8px', padding: '0.5rem' }}
                >
                  <div className="dot" style={{ background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div className="dot" style={{ background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s ease-in-out' }}></div>
                  <div className="dot" style={{ background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s ease-in-out' }}></div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Fixed Bottom Input Area */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1.5rem', 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1rem', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0
            }}>
              <input 
                type="text" 
                placeholder="Ask about your savings or spending patterns..." 
                value={question} 
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1rem' }}
              />
              <button 
                className="btn-primary" 
                onClick={handleSend} 
                disabled={loading}
                style={{ padding: '0.75rem 2rem', borderRadius: '14px', background: 'var(--primary)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

