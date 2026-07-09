import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("");
  const [monthly, setMonthly] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [activeTab, setActiveTab] = useState("months");
  const [loanHistory, setLoanHistory] = useState([]);

  const fetchLoanHistory = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`http://127.0.0.1:8000/api/loans/?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setLoanHistory(data))
      .catch(err => console.error("Error fetching loans:", err));
  };

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  function calculate() {
    const P = Number(amount);
    const r = Number(rate);
    let n = Number(months);
    
    if (activeTab === "years") n = n * 12;

    if(!P || !r || !n) return;
    
    const rateMonthly = r / 100 / 12;
    const emi = (P * rateMonthly * Math.pow(1 + rateMonthly, n)) / (Math.pow(1 + rateMonthly, n) - 1);
    
    const totalAmount = emi * n;
    
    setMonthly(Math.round(emi));
    setTotalPay(Math.round(totalAmount));
    setTotalInterest(Math.round(totalAmount - P));
  }

  return (
    <section className="section" style={{ padding: '60px 5%' }}>
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-badge">Loan Offers</span>
        <h2 className="section-title">Discover Loan Options</h2>
        <p className="section-desc">
          Estimate your monthly repayments and find the perfect funding options tailored to your personal or business growth.
        </p>
      </motion.div>

      <div className="loan-container glass">
        <div className="loan-left">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Enter Loan amount and<br/>calculate</h2>
          
          <div className="loan-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={activeTab === 'months' ? 'btn-tab active' : 'btn-tab'} 
              onClick={() => setActiveTab('months')}
            >
              IN MONTHS
            </button>
            <button 
              className={activeTab === 'years' ? 'btn-tab active' : 'btn-tab'} 
              onClick={() => setActiveTab('years')}
            >
              IN YEARS
            </button>
          </div>

          <div className="loan-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-field">
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: '700' }}>Loan amount (RWF)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="e.g. 5,000,000" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
            </div>
            
            <div className="input-field">
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: '700' }}>Loan tenure ({activeTab})</label>
                <input 
                  type="number" 
                  value={months} 
                  onChange={(e) => setMonths(e.target.value)} 
                  placeholder={activeTab === 'months' ? "e.g. 24" : "e.g. 2"} 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
            </div>

            <div className="input-field">
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: '700' }}>Interest Rate (%)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)} 
                  placeholder="e.g. 15" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
            </div>

            <button className="btn-primary" onClick={calculate} style={{ marginTop: '1rem', padding: '1rem' }}>
              Calculate My Repayment
            </button>
          </div>
        </div>

        <div className="loan-divider" style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

        <div className="loan-right">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Your monthly payment will be</h2>
          
          <div className="monthly-box">
             <div className="monthly-label" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                Monthly Repayment
             </div>
             <div className="monthly-value">
                <span style={{ fontSize: '1.5rem', fontWeight: '400', verticalAlign: 'middle', marginRight: '10px' }}>RWF</span>
                {monthly.toLocaleString()}
             </div>
          </div>

          <div className="loan-summary" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                 <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total Amount to Pay</span>
                 <span style={{ fontWeight: '700' }}>RWF {totalPay.toLocaleString()}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                 <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total Interest Paid</span>
                 <span style={{ fontWeight: '700' }}>RWF {totalInterest.toLocaleString()}</span>
             </div>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.25rem', background: 'var(--success)', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                onClick={async () => {
                  if (!amount || monthly <= 0) return alert("Please calculate your loan first.");
                  
                  const userId = localStorage.getItem("userId");
                  if (!userId) return alert("Please log in to apply for a loan.");

                  const loanData = {
                    amount: Number(amount),
                    tenure_months: activeTab === 'years' ? Number(months) * 12 : Number(months),
                    interest_rate: Number(rate),
                    user: parseInt(userId)
                  };

                  try {
                    const res = await fetch("http://127.0.0.1:8000/api/loans/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(loanData)
                    });
                    if (res.ok) {
                      alert(`SUCCESS: Your loan application of RWF ${Number(amount).toLocaleString()} has been submitted and is pending admin review.`);
                      setAmount("");
                      setMonths("");
                      setRate("");
                      setMonthly(0);
                      setTotalPay(0);
                      setTotalInterest(0);
                      fetchLoanHistory();
                    } else {
                      const errorData = await res.json();
                      alert(`Error: ${JSON.stringify(errorData)}`);
                    }
                  } catch (err) {
                    alert("Error processing loan application.");
                  }
                }}
              >
                Apply for Loan Now
              </button>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="#" style={{ color: '#00AEEF', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>View Full Loan Schedule →</a>
              </div>
          </div>
        </div>
      </div>

      {/* LOAN HISTORY TABLE */}
      <div className="glass-card" style={{ marginTop: '4rem', padding: '3rem' }}>
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--primary)' }}>📋</span> Loan Request History
        </h3>
        {loanHistory.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No loan requests submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Applied Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Amount (RWF)</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Tenure</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Interest</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Details / Notes</th>
                </tr>
              </thead>
              <tbody>
                {loanHistory.map((loan) => {
                  let statusColor = '#eab308'; // Yellow for Pending
                  if (loan.status === 'APPROVED') statusColor = 'var(--success)';
                  if (loan.status === 'REJECTED') statusColor = '#ef4444'; // Red
                  
                  return (
                    <tr key={loan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>
                        {new Date(loan.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '700' }}>
                        {loan.amount.toLocaleString()} RWF
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>{loan.tenure_months} months</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{loan.interest_rate}%</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ 
                          color: statusColor, 
                          background: `${statusColor}15`, 
                          padding: '4px 10px', 
                          borderRadius: '100px', 
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          border: `1px solid ${statusColor}30`
                        }}>
                          {loan.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: loan.status === 'REJECTED' ? '#fca5a5' : 'var(--text-muted)', fontStyle: loan.rejection_reason ? 'italic' : 'normal' }}>
                        {loan.status === 'APPROVED' && 'Credited to account balance'}
                        {loan.status === 'REJECTED' && `Declined: ${loan.rejection_reason || 'No reason provided'}`}
                        {loan.status === 'PENDING' && 'Awaiting admin evaluation'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
}
