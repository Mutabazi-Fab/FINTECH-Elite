import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="hero">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="hero-video"
      >
        <source src="/O_BG.mp4" type="video/mp4" />
      </video>
      
      <div className="hero-overlay"></div>

      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1>Rwanda’s leading bank. For everyone, anywhere.</h1>

        <div className="hero-buttons">
          <a href="/Register"><button className="btn-primary">Become an FT customer</button></a>
          <a href="/Dashboard"><button className="btn-outline">Access Your Dashboard</button></a>
        </div>
      </motion.div>
    </section>
  );
}
