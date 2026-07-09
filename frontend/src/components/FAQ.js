import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    { 
      q: "What types of accounts do you offer?", 
      a: "We offer a wide range of accounts tailored to your needs, including Elite Savings, Business Current Accounts, and Diaspora Accounts for our international customers." 
    },
    { 
      q: "How can I contact customer support?", 
      a: "Our support team is available 24/7. You can reach us via the AI Advisor on this platform, email us at support@fintech.rw, or visit any of our branches nationwide." 
    },
    { 
      q: "Is my financial data secure?", 
      a: "Absolutely. We use bank-grade encryption (AES-256) and multi-factor authentication to ensure your transactions and personal information are always protected." 
    },
    { 
      q: "Can I apply for a loan online?", 
      a: "Yes! Use our Loan Calculator to estimate your repayments, and you can submit your application directly through your dashboard with instant preliminary feedback." 
    },
    { 
      q: "What are the transfer limits?", 
      a: "Standard accounts have a daily transfer limit of 5,000,000 RWF. However, Elite and Business accounts can request higher limits through their Relationship Manager." 
    }
  ];

  return (
    <section className="section">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          Frequently asked questions
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {faqs.map((item, i) => (
            <motion.div 
              key={i} 
              className="glass" 
              style={{ 
                padding: '1.5rem 2rem', 
                cursor: 'pointer',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: open === i ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'
              }}
              onClick={() => setOpen(open === i ? null : i)}
              whileHover={{ scale: 1.01, background: 'rgba(255, 255, 255, 0.08)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>{item.q}</h4>
                <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{open === i ? "−" : "+"}</span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1rem' }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
