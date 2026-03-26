"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <div className="tmp-header-right">
                  <div className="social-share-wrapper d-none d-md-block">
                    <div className="social-link">
                      <a href="#"><i className="fa-brands fa-instagram"></i></a>
                      <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                      <a href="#"><i className="fa-brands fa-twitter"></i></a>
                      <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                  </div>
                  <div className="actions-area">
                    <div className="tmp-side-collups-area d-none d-xl-block">
                      <button
                        className="tmp-menu-bars tmp_button_active"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <i className="fa-regular fa-bars-staggered"></i>
                      </button>
                    </div>
                    <div className="tmp-side-collups-area d-block d-xl-none">
                      <button
                        className="tmp-menu-bars humberger_menu_active"
                        onClick={() => setMobileMenuOpen(true)}
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
        <div className={`tmp-popup-mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div className="inner">
            <div className="header-top">
              <div className="logo">
                <Link href="/" className="logo-area">
                  <h3 className="logo-text-adaptive" style={{ margin: 0, fontWeight: 700, letterSpacing: '1px', fontSize: '22px' }}>Dr. Logeshwaran <span style={{ color: '#e60000' }}>J</span></h3>
                </Link>
              </div>
              <div className="close-menu">
                <button
                  className="close-button tmp-round-action-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-sharp fa-light fa-xmark"></i>
                </button>
              </div>
            </div>
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
            <div className="social-wrapper mt--40">
              <span className="subtitle">Find with me</span>
              <div className="social-link">
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
