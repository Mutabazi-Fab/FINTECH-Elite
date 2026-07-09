import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="footer-glass" style={{ position: 'relative', overflow: 'hidden' }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.2, // Reflection effect
          zIndex: 0
        }}
      >
        <source src="/rra.mp4" type="video/mp4" />
      </video>
      
      <div className="footer-container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="neon-text">About FINTECH GROUP 4</h3>
          <p>
            FINTECH GROUP 4 is a premium financial behavior analysis platform designed to help users track, 
            categorize, and optimize their spending habits through intelligent rule-based insights.
          </p>
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="neon-text">Loan Requirements</h3>
          <ul>
            <li>• Valid National ID / Passport</li>
            <li>• Proof of steady income (last 3 months)</li>
            <li>• Minimum 6 months of active banking history</li>
            <li>• Good credit standing in behavioral data</li>
          </ul>
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="neon-text">Contact Us</h3>
          <p>📞 0783123333</p>
          <p>📧 mucyomutabazifabrice@gmail.com</p>
          <p>📍 Kigali, Rwanda</p>
        </motion.div>
      </div>
      <motion.div 
        className="footer-bottom" 
        style={{ position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <p>&copy; 2026 Fintech Auca - Group 4 Project. All Rights Reserved.</p>
      </motion.div>
    </footer>
  );
}
