import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ['#004B98', '#00AEEF', '#CBD5E1', '#1E3A8A', '#002D5A', '#94A3B8'];

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const url = userId 
      ? `http://127.0.0.1:8000/api/analytics/?user_id=${userId}`
      : "http://127.0.0.1:8000/api/analytics/";

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(resData => {
        const breakdownArray = resData.breakdown || [];
        const formatted = breakdownArray.map(item => ({
          name: item.category__name || "Unknown",
          value: item.total
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem' }}>
            <motion.h1 
              className="neon-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Spending Analytics
            </motion.h1>
            <p style={{ color: 'var(--text-muted)' }}>Visualizing your financial habits and category distribution.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ height: '500px' }}
            >
              <h3 style={{ marginBottom: '2rem' }}>Category Distribution</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Breakdown Details</h3>
              {loading ? <p>Loading data...</p> : 
                data.length === 0 ? <p>No data available.</p> :
                data.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    style={{ padding: '1.25rem 1.5rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></div>
                        <span style={{ fontWeight: '600' }}>{item.name}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>{item.value.toLocaleString()} RWF</span>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

