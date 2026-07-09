import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({ income: 0, expense: 0, balance: 0 });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("PHONE");
  const [loading, setLoading] = useState(false);

  const COLORS = ['#004B98', '#00AEEF', '#CBD5E1', '#1E3A8A', '#002D5A', '#94A3B8'];

  const fetchDashboardData = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://127.0.0.1:8000/api/analytics/?user_id=${userId}`)
      .then(res => res.json())
      .then(resData => {
        const formatted = resData.breakdown.map(item => ({
          name: item.category__name || "Unknown",
          amount: item.total
        }));
        setData(formatted);
        setMetrics({
          income: resData.total_income,
          expense: resData.total_expense,
          balance: resData.balance
        });
      })
      .catch(_err => console.log(_err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) return;
    const userId = localStorage.getItem("userId");
    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: parseInt(userId),
          amount: parseFloat(depositAmount),
          category: 10, // 'Income' category ID
          date: new Date().toISOString().split('T')[0],
          type: 'INCOME',
          payment_method: depositMethod
        })
      });

      if (res.ok) {
        setShowDepositModal(false);
        setDepositAmount("");
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <motion.h1 
                className="neon-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: '3rem', margin: 0 }}
              >
                Financial Dashboard
              </motion.h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Premium wealth management and real-time tracking.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-primary" 
                onClick={() => setShowDepositModal(true)}
                style={{ padding: '0.8rem 1.5rem', background: 'var(--success)', border: 'none' }}
              >
                 <span>💵</span> Add Cash
              </button>
              <Link href="/Transactions">
                <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                   <span>+</span> Log Expense
                </button>
              </Link>
            </div>
          </header>

          <div className="grid" style={{ marginBottom: '3rem' }}>
            <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Outflow</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#f43f5e' }}>RWF {metrics.expense.toLocaleString()}</h2>
              <div style={{ color: '#f43f5e', fontSize: '0.9rem' }}>↓ Spending tracking active</div>
            </motion.div>

            <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Income</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: 'var(--success)' }}>RWF {metrics.income.toLocaleString()}</h2>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Includes Salary & Deposits</div>
            </motion.div>

            <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Balance</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>RWF {metrics.balance.toLocaleString()}</h2>
              <div style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Real-time verified funds</div>
            </motion.div>
          </div>

          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: '3rem' }}
          >
            <h3 style={{ marginBottom: '2rem' }}>Expenditure Distribution</h3>
            <div style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} 
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Deposit Modal */}
        <AnimatePresence>
          {showDepositModal && (
            <div style={modalStyles.overlay}>
              <motion.div 
                style={modalStyles.modal}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h3>Add Cash to Account</h3>
                  <button onClick={() => setShowDepositModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={modalStyles.label}>AMOUNT (RWF)</label>
                  <input 
                    type="number" 
                    style={modalStyles.input} 
                    placeholder="Enter amount" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={modalStyles.label}>DEPOSIT METHOD</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => setDepositMethod("PHONE")}
                      style={{...modalStyles.methodBtn, borderColor: depositMethod === "PHONE" ? 'var(--primary)' : 'transparent', background: depositMethod === "PHONE" ? 'rgba(0,174,239,0.2)' : 'rgba(255,255,255,0.05)'}}
                    >
                      📱 Phone (MoMo)
                    </button>
                    <button 
                      onClick={() => setDepositMethod("CARD")}
                      style={{...modalStyles.methodBtn, borderColor: depositMethod === "CARD" ? 'var(--primary)' : 'transparent', background: depositMethod === "CARD" ? 'rgba(0,174,239,0.2)' : 'rgba(255,255,255,0.05)'}}
                    >
                      💳 Bank Card
                    </button>
                    <button 
                      onClick={() => setDepositMethod("SALARY")}
                      style={{...modalStyles.methodBtn, borderColor: depositMethod === "SALARY" ? 'var(--primary)' : 'transparent', background: depositMethod === "SALARY" ? 'rgba(0,174,239,0.2)' : 'rgba(255,255,255,0.05)'}}
                    >
                      💼 Salary
                    </button>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                  onClick={handleDeposit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Deposit"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modal: {
    background: '#001529',
    padding: '2.5rem',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '1px'
  },
  input: {
    width: '100%',
    padding: '1rem',
    marginTop: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1.2rem',
    outline: 'none'
  },
  methodBtn: {
    flex: 1,
    padding: '1rem 0.5rem',
    border: '2px solid transparent',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  }
};

