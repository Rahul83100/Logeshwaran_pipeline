"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NavSection {
  id?: string;
  label: string;
  path: string;
  showInNavbar: boolean;
  isNew?: boolean;
  order: number;
}

const FALLBACK_SECTIONS: NavSection[] = [
  { label: 'Home', path: '/', showInNavbar: true, isNew: false, order: 0 },
  { label: 'About', path: '/#about', showInNavbar: true, isNew: false, order: 1 },
  { label: 'Projects', path: '/projects', showInNavbar: true, isNew: false, order: 2 },
  { label: 'Blog', path: '/#blog', showInNavbar: true, isNew: false, order: 3 },
  { label: 'Contact', path: '/#contact', showInNavbar: true, isNew: false, order: 4 },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sections, setSections] = useState<NavSection[]>(FALLBACK_SECTIONS);
  const { user, userData } = useAuth();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'main_navbar'), orderBy('order', 'asc')));
        if (!snap.empty) {
          setSections(snap.docs.map(d => d.data() as NavSection));
        }
      } catch (err) {
        console.warn('Failed to fetch main_navbar. Using fallback data.', err);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("sidemenu-active");
    } else {
      document.body.classList.remove("sidemenu-active");
    }
    return () => document.body.classList.remove("sidemenu-active");
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const scrollToSection = (e: any, targetPath: string) => {
    if (targetPath.startsWith('/#') && window.location.pathname === "/") {
      const id = targetPath.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        setMobileMenuOpen(false);
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  const navbarSections = sections.filter(s => s.showInNavbar);
  const allSections = sections;

  return (
    <>
      <header className="tmp-header-area-start header-one header--sticky header--transparent">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="header-content">
                <div className="logo">
                  <Link href="/">
                    <h3 style={{ margin: 0, fontWeight: 700, color: '#000', letterSpacing: '1px', fontSize: '22px' }}>Dr. Logeshwaran <span style={{ color: '#e60000' }}>J</span></h3>
                  </Link>
                </div>
                <nav className="tmp-mainmenu-nav d-none d-xl-block">
                  <ul className="tmp-mainmenu">
                    {navbarSections.map((sec) => (
                      <li key={sec.label}>
                        <Link href={sec.path} onClick={(e) => scrollToSection(e, sec.path)}>
                          {sec.label}
                          {sec.isNew && (
                            <span style={{ marginLeft: '4px', background: '#e60000', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700, verticalAlign: 'super' }}>NEW</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="tmp-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Auth Button - compact */}
                  <div className="d-none d-xl-block">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '5px 14px', fontSize: '12px', fontWeight: 500,
                          background: 'transparent', border: '1px solid #e60000', color: '#e60000',
                          borderRadius: '20px', cursor: 'pointer', transition: 'all 0.25s ease', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e60000'; }}
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        style={{
                          padding: '5px 14px', fontSize: '12px', fontWeight: 500,
                          background: 'transparent', border: '1px solid #e60000', color: '#e60000',
                          borderRadius: '20px', textDecoration: 'none', display: 'inline-block',
                          transition: 'all 0.25s ease', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e60000'; }}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                  <div className="actions-area">
                    <div className="tmp-side-collups-area">
                      <button
                        className="tmp-menu-bars humberger_menu_active"
                        onClick={() => setMobileMenuOpen(true)}
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <i className="fa-regular fa-bars-staggered"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              style={{
                position: 'fixed', top: 0, right: 0, width: '320px', height: '100vh',
                background: '#fff', zIndex: 100001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', overflowY: 'auto'
              }}
            >
              <div className="inner" style={{ padding: '30px' }}>
                <div className="header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div className="logo">
                    <Link href="/" className="logo-area" onClick={() => setMobileMenuOpen(false)}>
                      <h3 style={{ margin: 0, fontWeight: 700, letterSpacing: '1px', fontSize: '20px', color: '#1a1a2e' }}>
                        Dr. Logeshwaran <span style={{ color: '#e60000' }}>J</span>
                      </h3>
                    </Link>
                  </div>
                  <div className="close-menu">
                    <button
                      className="close-button"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333' }}
                    >
                      <i className="fa-sharp fa-light fa-xmark"></i>
                    </button>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {allSections.map((sec) => (
                    <li key={sec.label}>
                      <Link
                        href={sec.path}
                        onClick={(e) => scrollToSection(e, sec.path)}
                        style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {sec.label}
                        {sec.isNew && (
                          <span style={{ background: '#e60000', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>NEW</span>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li style={{ marginTop: '20px' }}>
                    {user ? (
                      <button onClick={handleLogout} className="tmp-btn" style={{ width: '100%', background: '#e60000', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600 }}>Logout</button>
                    ) : (
                      <Link href="/login" className="tmp-btn" style={{ width: '100%', textAlign: 'center', display: 'block', background: '#e60000', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                    )}
                  </li>
                  <li style={{ marginTop: '10px' }}>
                    <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '13px', color: '#9393a5', textAlign: 'center', display: 'block', textDecoration: 'none' }}>Admin? Click here</Link>
                  </li>
                </ul>
                <div className="social-wrapper mt--40" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <span className="subtitle" style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '15px' }}>Find with me</span>
                  <div className="social-link" style={{ display: 'flex', gap: '15px' }}>
                    <a href="#" style={{ color: '#333', fontSize: '18px' }}><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" style={{ color: '#333', fontSize: '18px' }}><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#" style={{ color: '#333', fontSize: '18px' }}><i className="fa-brands fa-twitter"></i></a>
                    <a href="#" style={{ color: '#333', fontSize: '18px' }}><i className="fa-brands fa-facebook-f"></i></a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', zIndex: 100000, backdropFilter: 'blur(4px)'
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
