import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/Login");
  };

  const navItems = [
    { name: "Dashboard", href: "/Dashboard" },
    { name: "Transactions", href: "/Transactions" },
    { name: "Analytics", href: "/Analytics" },
    { name: "Recommendations", href: "/Recommendations" },
    { name: "Consult AI", href: "/Chat" },
  ];

  return (
    <motion.header 
      className={`navbar ${scrolled ? "glass" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        padding: scrolled ? "0.75rem 5%" : "1.25rem 5%",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Logo Section */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h2 className="neon-text" style={{ fontSize: '1.75rem', letterSpacing: '-1px', margin: 0 }}>FINTECH</h2>
      </Link>

      {/* Navigation Section - Centered */}
      <nav className="nav-links" style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        <Link href="/Dashboard" className={router.pathname === "/Dashboard" ? "active" : ""}>
          Home
        </Link>
        <Link href="/Transactions" className={router.pathname === "/Transactions" ? "active" : ""}>
          Transactions
        </Link>
        <Link href="/Analytics" className={router.pathname === "/Analytics" ? "active" : ""}>
          Analytics
        </Link>
        <Link href="/Recommendations" className={router.pathname === "/Recommendations" ? "active" : ""}>
          Insights
        </Link>
        <Link href="/Chat" className={router.pathname === "/Chat" ? "active" : ""}>
          AI Advisor
        </Link>
      </nav>

      {/* Actions Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-badge-side" style={{ margin: 0, padding: '0.5rem 1.25rem' }}>
              <span className="dot" style={{ background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Welcome, <strong style={{ color: 'var(--text-main)' }}>{user}</strong>
              </span>
            </div>
            <button className="btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div className="actions" style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/Login"><button className="btn-outline" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Login</button></Link>
            <Link href="/Register"><button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Get Started</button></Link>
          </div>
        )}
      </div>
    </motion.header>
  );
}

