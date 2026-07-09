import { useState } from "react";
import { motion } from "framer-motion";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("");
  const [monthly, setMonthly] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [activeTab, setActiveTab] = useState("months");

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
                  const loanData = {
                    amount: amount,
                    category: 10, // Income/Loan category
                    date: new Date().toISOString().split('T')[0],
                    type: 'INCOME',
                    payment_method: 'LOAN',
                    user: userId
                  };

                  try {
                    const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(loanData)
                    });
                    if (res.ok) {
                      alert(`SUCCESS: RWF ${Number(amount).toLocaleString()} loan has been credited to your account!`);
                      window.location.reload(); // Refresh to show new balance
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

    </section>
  );
}
