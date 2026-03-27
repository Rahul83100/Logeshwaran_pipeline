import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer-area footer-style-one-wrapper bg-color-footer bg_images tmp-section-gap">
        <div className="container">
          <div className="footer-main footer-style-one">
            <div className="row g-5">
              <div className="col-lg-5 col-md-6">
                <div className="single-footer-wrapper border-right mr--20">
                  <div className="logo">
                    <Link href="/">
                      <h3 style={{ margin: 0, fontWeight: 700, color: '#000', letterSpacing: '1px', fontSize: '26px' }}>
                        Dr. Logeshwaran <span style={{ color: '#e60000' }}>J</span>
                      </h3>
                    </Link>
                  </div>
                  <p className="description" style={{ marginTop: '20px' }}>
                    <span>Get Ready</span> To Explore Research & Innovation
                  </p>
                  <form action="#" className="newsletter-form-1 mt--40">
                    <input type="email" placeholder="Email Address" />
                    <span className="form-icon">
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                  </form>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-footer-wrapper quick-link-wrap">
                  <h5 className="ft-title">Quick Link</h5>
                  <ul className="ft-link tmp-link-animation">
                    <li>
                      <Link href="/about">About Me</Link>
                    </li>
                    <li>
                      <Link href="/research">Research</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact Me</Link>
                    </li>
                    <li>
                      <Link href="/blog">Blog Posts</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-wrapper contact-wrap">
                  <h5 className="ft-title">Contact</h5>
                  <ul className="ft-link tmp-link-animation">
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-envelope"></i>
                      </span>
                      <a href="mailto:logishoren@university.edu">
                        logishoren@university.edu
                      </a>
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      Department of CS, University Campus
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-phone"></i>
                      </span>
                      <a href="tel:+919876543210">+91 98765 43210</a>
                    </li>
                  </ul>
                  <div className="social-link footer">
                    <a href="#">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright-area-one">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-wrapper">
                <p className="copy-right-para tmp-link-animation">
                  © Dr. Logishoren {currentYear} | All Rights Reserved
                </p>
                <ul className="tmp-link-animation">
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
