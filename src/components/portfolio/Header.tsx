"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const scrollToSection = (e: any, targetId: string) => {
    // Only smooth scroll if we are on the same page
    if (window.location.pathname === "/") {
      const id = targetId.replace("/#", "").replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        setMobileMenuOpen(false);
        const offset = 100; // Offset for sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      {/* Header */}
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
                    <li><Link href="/#profile" onClick={(e) => scrollToSection(e, "profile")}>Profile</Link></li>
                    <li><Link href="/#articles" onClick={(e) => scrollToSection(e, "articles")}>Journals</Link></li>
                    <li><Link href="/#books" onClick={(e) => scrollToSection(e, "books")}>Books</Link></li>
                    <li><Link href="/#conferences" onClick={(e) => scrollToSection(e, "conferences")}>Conferences</Link></li>
                    <li><Link href="/#patents" onClick={(e) => scrollToSection(e, "patents")}>Patents</Link></li>
                    <li><Link href="/#projects" onClick={(e) => scrollToSection(e, "projects")}>Projects</Link></li>
                    <li><Link href="/#workshops" onClick={(e) => scrollToSection(e, "workshops")}>Workshops</Link></li>
                    <li><Link href="/#awards" onClick={(e) => scrollToSection(e, "awards")}>Awards</Link></li>
                  </ul>
                </nav>
                <div className="tmp-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Auth Button - compact */}
                  <div className="d-none d-xl-block">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '5px 14px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: 'transparent',
                          border: '1px solid #e60000',
                          color: '#e60000',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          whiteSpace: 'nowrap',
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
                          padding: '5px 14px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: 'transparent',
                          border: '1px solid #e60000',
                          color: '#e60000',
                          borderRadius: '20px',
                          textDecoration: 'none',
                          display: 'inline-block',
                          transition: 'all 0.25s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e60000'; }}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                  <div className="actions-area">
                    <div className="tmp-side-collups-area d-none d-xl-block">
                      <button
                        className="tmp-menu-bars tmp_button_active"
                        onClick={() => setSidebarOpen(true)}
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <i className="fa-regular fa-bars-staggered"></i>
                      </button>
                    </div>
                    <div className="tmp-side-collups-area d-block d-xl-none">
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

      {/* Desktop Sidebar */}
      <div className="d-none d-xl-block">
        <div className={`tmp-sidebar-area tmp_side_bar ${sidebarOpen ? "active" : ""}`}>
          <div className="inner">
            <div className="top-area">
              <Link href="/" className="logo">
                <h3 className="logo-text-adaptive" style={{ margin: 0, fontWeight: 700, letterSpacing: '1px', fontSize: '22px' }}>Dr. Logeshwaran <span style={{ color: '#e60000' }}>J</span></h3>
              </Link>
              <div className="close-icon-area">
                <button
                  className="tmp-round-action-btn close_side_menu_active"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-sharp fa-light fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="content-wrapper">
              <div className="image-area-feature">
                <Link href="/">
                  <Image
                    src="/assets/images/logo/man.png"
                    alt="Dr. Logishoren"
                    width={200}
                    height={200}
                  />
                </Link>
              </div>
              <h5 className="title mt--30">
                Professor & Researcher delivering cutting-edge AI and ML solutions.
              </h5>
              <p className="disc">
                A dedicated researcher and professor specializing in artificial intelligence, machine learning, and computer science research.
              </p>
              <div className="short-contact-area">
                <div className="single-contact">
                  <i className="fa-solid fa-phone"></i>
                  <div className="information tmp-link-animation">
                    <span>Call Now</span>
                    <a href="#" className="number">+91 98765 43210</a>
                  </div>
                </div>
                <div className="single-contact">
                  <i className="fa-solid fa-envelope"></i>
                  <div className="information tmp-link-animation">
                    <span>Mail Us</span>
                    <a href="#" className="number">logishoren@university.edu</a>
                  </div>
                </div>
                <div className="single-contact">
                  <i className="fa-solid fa-location-crosshairs"></i>
                  <div className="information tmp-link-animation">
                    <span>My Address</span>
                    <span className="number">Department of CS, University Campus</span>
                  </div>
                </div>
              </div>
            <div className="social-wrapper mt--20">
                <span className="subtitle">Find with me</span>
                <div className="social-link">
                  <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#"><i className="fa-brands fa-twitter"></i></a>
                  <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
              </div>
              <div className="admin-link-area mt--30 pt--20" style={{ borderTop: '1px solid #2a2a3a' }}>
                <Link href="/admin/login" className="tmp-btn" style={{ width: '100%', textAlign: 'center', background: 'transparent', border: '1px solid #6c5ce7', fontSize: '14px' }}>
                  <i className="fa-solid fa-lock-keyhole" style={{ marginRight: '8px' }}></i>
                  Admin Portal
                </Link>
                {user && (
                  <button onClick={handleLogout} className="tmp-btn mt--15" style={{ width: '100%', background: '#e6000015', color: '#e60000', border: '1px solid #e60000' }}>
                    Logout (${user.email?.split('@')[0]})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {sidebarOpen && (
          <a
            className="overlay_close_side_menu close_side_menu_active"
            href="javascript:void(0);"
            onClick={() => setSidebarOpen(false)}
          ></a>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="d-block d-xl-none">
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '320px',
                height: '100vh',
                background: '#fff',
                zIndex: 99999,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                overflowY: 'auto'
              }}
            >
              <div className="inner" style={{ padding: '30px' }}>
                <div className="header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div className="logo">
                    <Link href="/" className="logo-area" onClick={() => setMobileMenuOpen(false)}>
                      <h3 className="logo-text-adaptive" style={{ margin: 0, fontWeight: 700, letterSpacing: '1px', fontSize: '20px' }}>
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
                  <li><Link href="/#profile" onClick={(e) => scrollToSection(e, "profile")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Profile</Link></li>
                  <li><Link href="/#articles" onClick={(e) => scrollToSection(e, "articles")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Journals</Link></li>
                  <li><Link href="/#books" onClick={(e) => scrollToSection(e, "books")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Books</Link></li>
                  <li><Link href="/#conferences" onClick={(e) => scrollToSection(e, "conferences")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Conferences</Link></li>
                  <li><Link href="/#patents" onClick={(e) => scrollToSection(e, "patents")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Patents</Link></li>
                  <li><Link href="/#projects" onClick={(e) => scrollToSection(e, "projects")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Projects</Link></li>
                  <li><Link href="/#workshops" onClick={(e) => scrollToSection(e, "workshops")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Workshops</Link></li>
                  <li><Link href="/#awards" onClick={(e) => scrollToSection(e, "awards")} style={{ color: '#333', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Awards</Link></li>
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
          )}
        </AnimatePresence>
        
        {/* Mobile menu backdrop overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 99998,
                backdropFilter: 'blur(4px)'
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
