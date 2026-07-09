import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: 1, name: "Food", icon: "🍔" },
  { id: 2, name: "Transport", icon: "🚗" },
  { id: 3, name: "Rent", icon: "🏠" },
  { id: 4, name: "Utilities", icon: "💡" },
  { id: 5, name: "School Fees", icon: "📚" },
  { id: 6, name: "Health", icon: "🏥" },
  { id: 7, name: "Entertainment", icon: "🎬" },
  { id: 8, name: "Shopping", icon: "🛍️" },
  { id: 9, name: "Others", icon: "✨" }
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState(CATEGORIES);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("1");
  const [date, setDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    
    // Fetch Analytics for balance check
    fetch(`http://127.0.0.1:8000/api/analytics/?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance))
      .catch(err => console.log(err));

    fetch(`http://127.0.0.1:8000/api/transactions/?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const userTransactions = data.filter(t => t.user === parseInt(userId));
        setTransactions(userTransactions);
        setLoading(false);
      })
      .catch(_err => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);


  const handleAdd = async () => {
    if (!amount || !category || !date) return alert("Please fill all fields");
    
    // Balance Restriction
    if (balance <= 0) {
      alert("Transaction Denied: You are out of money. Please deposit funds to continue.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: parseInt(userId), amount: Number(amount), category: Number(category), date, type: 'EXPENSE' })
    });
    if(res.ok) {
      setAmount("");
      setDate("");
      fetchTransactions();
    }
  };

  return (
    <>
      <Navbar />
      <main className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <motion.h1 
              className="neon-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Transaction Ledger
            </motion.h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your expenses and track your financial flow.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
            {/* ADD TRANSACTION FORM */}
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)' }}>+</span> New Entry
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Amount (RWF)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    style={{ width: '100%', margin: 0 }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    style={{ width: '100%', margin: 0 }}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Transaction Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    style={{ width: '100%', margin: 0 }}
                  />
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleAdd}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Record Transaction
                </button>
              </div>
            </motion.div>

            {/* TRANSACTIONS LIST */}
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <p>Syncing transactions...</p>
                ) : transactions.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No transactions recorded yet.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {transactions.map((t, idx) => {
                      const categoryObj = categories.find(c => c.id === t.category);
                      const catName = categoryObj?.name || "Other";
                      const catIcon = categoryObj?.icon || "💰";
                      const isIncome = t.type === 'INCOME';
                      
                      return (
                        <motion.div 
                          key={t.id || idx} 
                          className="card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: idx * 0.05 }}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '1.25rem 2rem',
                            borderLeft: `4px solid ${isIncome ? 'var(--success)' : '#ef4444'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ 
                               width: '50px', 
                               height: '50px', 
                               borderRadius: '12px', 
                               background: 'rgba(255,255,255,0.05)',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontSize: '1.5rem'
                            }}>
                              {isIncome ? "💰" : catIcon}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{isIncome ? "Deposit" : catName}</h4>
                                <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                                  {t.payment_method === 'PHONE' ? '📱 MoMo' : t.payment_method === 'CARD' ? '💳 Card' : t.payment_method === 'SALARY' ? '💼 Salary' : 'Other'}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.date}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ 
                              fontSize: '1.25rem', 
                              fontWeight: '700',
                              color: isIncome ? 'var(--success)' : '#fff' 
                            }}>
                              {isIncome ? '+' : '-'}{t.amount.toLocaleString()} RWF
                            </span>
                            <button 
                              onClick={async () => {
                                if(confirm("Are you sure you want to remove this transaction?")) {
                                  const res = await fetch(`http://127.0.0.1:8000/api/transactions/?id=${t.id}`, { method: 'DELETE' });
                                  if(res.ok) fetchTransactions();
                                }
                              }}
                              style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                border: 'none', 
                                color: '#ef4444', 
                                padding: '8px', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                fontSize: '1rem'
                              }}
                              title="Delete Transaction"
                            >
                              🗑️
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

