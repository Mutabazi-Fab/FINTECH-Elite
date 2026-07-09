import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    // Rwandan Phone Number Validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Invalid Phone Number: Rwandan numbers must be exactly 10 digits (e.g., 0780000000).");
      return;
    }

    setLoading(true);
    setError(null);
    
    const sanitizedUsername = username.trim().replace(/\s+/g, '_');

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: sanitizedUsername, 
          email: email.trim(), 
          phone_number: phoneNumber,
          password 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("user", sanitizedUsername);
        router.push("/Login");
      } else {
        setError(data.error || "Registration failed. Please try a different username.");
        setLoading(false);
      }
    } catch (_err) {
      setError("System Error: Backend is unreachable. Please ensure Django is running.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted playsInline style={styles.bgVideo}>
        <source src="/c.mp4" type="video/mp4" />
      </video>
      <div style={styles.overlay}></div>

      {/* Custom Notification */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            style={styles.notification}
          >
            <div style={styles.notificationIcon}>⚠️</div>
            <div style={styles.notificationText}>{error}</div>
            <button onClick={() => setError(null)} style={styles.closeBtn}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.content}>
        <motion.div 
          style={styles.leftPanel}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={styles.logoContainer}>
             <div style={styles.logoBox}>FT</div>
             <h1 style={styles.welcomeText}>Join the<br/><span className="neon-text">Elite Circle</span></h1>
             <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1.5rem', fontSize: '1.1rem' }}>
               Create your account in seconds and start your journey towards financial freedom.
             </p>
          </div>
        </motion.div>

        <motion.div 
          style={styles.rightPanel}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <form style={styles.authBox} onSubmit={handleRegister}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join our premium fintech ecosystem today.</p>
            
            <div style={styles.inputGroup}>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>USERNAME</label>
                <input 
                  style={styles.input} 
                  placeholder="e.g. john_doe" 
                  required
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                />
              </div>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input 
                  style={styles.input} 
                  type="email"
                  placeholder="name@example.com" 
                  required
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>RWANDAN PHONE NUMBER</label>
                <input 
                  style={styles.input} 
                  type="tel"
                  placeholder="0780000000" 
                  required
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                />
              </div>
              <div style={styles.fieldWrapper}>
                <label style={styles.label}>PASSWORD</label>
                <input 
                  style={styles.input} 
                  placeholder="••••••••" 
                  type="password" 
                  required
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              style={{...styles.loginBtn, opacity: loading ? 0.7 : 1}} 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Get Started"}
            </button>
            
            <p style={styles.termsText}>
               By joining, you agree to our <a href="#" style={styles.link}>Terms of Service</a> and <a href="#" style={styles.link}>Privacy Policy</a>.
            </p>

            <p style={styles.registerText}>
               Already have an account? <Link href="/Login" style={styles.registerLink}>Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  notification: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10000,
    background: 'rgba(239, 68, 68, 0.95)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    minWidth: '320px',
    maxWidth: '90%'
  },
  notificationIcon: {
    fontSize: '1.25rem'
  },
  notificationText: {
    flex: 1,
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '4px'
  },
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 999
  },
  bgVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -2
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6))',
    zIndex: -1
  },
  content: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    padding: '2rem',
    gap: '4rem',
    alignItems: 'center'
  },
  leftPanel: {
    flex: 1,
    color: 'white',
    display: 'none',
    '@media (min-width: 1024px)': { display: 'block' }
  },
  logoContainer: {
    maxWidth: '500px'
  },
  logoBox: {
    width: '60px',
    height: '60px',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '900',
    marginBottom: '2rem',
    borderRadius: '16px',
    boxShadow: '0 0 30px var(--primary-glow)'
  },
  welcomeText: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-2px',
    margin: 0
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  authBox: {
    width: '100%',
    maxWidth: '450px',
    padding: '3rem 3.5rem',
    background: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '2.5rem',
    textAlign: 'center'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '1px'
  },
  input: {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    color: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  loginBtn: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1.5rem',
    fontSize: '1rem'
  },
  termsText: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: '2rem',
    lineHeight: '1.4'
  },
  registerText: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    margin: 0
  },
  registerLink: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none'
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'underline'
  }
};


