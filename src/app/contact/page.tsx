import type { Metadata } from "next";
import ContactForm from "@/components/portfolio/ContactForm";
import { getProfile } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Contact — Dr. Logishoren",
  description:
    "Get in touch with Dr. Logishoren for research collaboration, academic partnerships, or general inquiries.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      {/* Breadcrumb */}
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">Contact Me</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="tmp-section-gap">
        <div className="container">
          <div className="row g-5 mb--50">
            <div className="col-lg-6 col-md-6">
              <div className="counter-card tmponhover">
                <div style={{ fontSize: "30px", marginBottom: "15px", color: "var(--theme-color, #6e57e0)" }}>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h3 className="counter-title" style={{ fontSize: "18px" }}>Email</h3>
                <p className="counter-para">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="counter-card tmponhover">
                <div style={{ fontSize: "30px", marginBottom: "15px", color: "var(--theme-color, #6e57e0)" }}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h3 className="counter-title" style={{ fontSize: "18px" }}>Address</h3>
                <p className="counter-para">{profile.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Map Placeholder */}
      <section className="tmp-section-gapTop">
        <div className="container">
          <div
            className="map-area"
            style={{
              background: "#f5f5f5",
              borderRadius: "10px",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "60px",
            }}
          >
            <div className="text-center" style={{ color: "#888" }}>
              <i className="fa-solid fa-map-location-dot" style={{ fontSize: "48px", marginBottom: "15px", display: "block" }}></i>
              <p>Map integration will be available soon</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
