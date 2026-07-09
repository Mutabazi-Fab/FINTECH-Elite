import { useState } from "react";
import { motion } from "framer-motion";

export default function Exchange() {
  const [amount, setAmount] = useState("");
  
  const rates = {
    USD: 1460,
    EUR: 1550,
    GBP: 1820,
    KES: 11.2
  };

  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass"
        style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', borderRadius: '32px' }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Global Exchange Rates</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Real-time conversion from Rwandan Francs (RWF) to major world currencies.
        </p>

        <div style={{ marginBottom: '3rem' }}>
          <input 
            type="number"
            placeholder="Enter Amount in RWF"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1.5rem 2rem', 
              fontSize: '1.5rem', 
              textAlign: 'center',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              color: '#fff'
            }}
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(rates).map(([currency, rate]) => (
            <motion.div 
              key={currency}
              whileHover={{ y: -5, background: 'rgba(255,255,255,0.1)' }}
              style={{ 
                padding: '2rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>{currency}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {amount ? (amount / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
              </div>
            </motion.div>
          ))}
        </div>
        
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          * Rates are indicative and may vary based on market conditions.
        </p>
      </motion.div>
    </section>
  );
}
