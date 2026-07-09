import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Recommendations() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/recommendations/?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setAdvice(data);
        setLoading(false);
      })
      .catch(_err => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="section">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <motion.h1 
              className="neon-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Smart Insights
            </motion.h1>
            <p style={{ color: 'var(--text-muted)' }}>Tailored financial advice based on your spending patterns and goals.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Analyzing your finances...</p>
            ) : advice.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No recommendations yet. Keep tracking your expenses!</p>
            ) : (
              advice.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary)' }}
                >
                  <div style={{ fontSize: '1.5rem' }}>💡</div>
                  <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>{item}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}

