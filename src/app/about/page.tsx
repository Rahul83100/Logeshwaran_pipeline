import type { Metadata } from "next";
import Image from "next/image";
import {
  getProfile,
} from "@/lib/firestore";
// import AcademicProfileTabs from "@/components/portfolio/AcademicProfileTabs";


export const metadata: Metadata = {
  title: "About — Dr. Logishoren",
  description:
    "Learn about Dr. Logishoren's academic journey, research interests, education, and professional experience.",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <>
      {/* Breadcrumb */}
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">About Me</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <section className="tmp-section-gap">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="about-image-area">
                {profile.profileImage ? (
                  <Image
                    className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                    src={profile.profileImage}
                    alt={profile.name}
                    width={400}
                    height={400}
                    style={{ borderRadius: "10px" }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    No image
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-content">
                <div className="section-head text-align-left">
                  <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                    <span className="subtitle">About Me</span>
                  </div>
                  <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                    {profile.name}
                  </h2>
                  <h4
                    className="tmp-scroll-trigger tmp-fade-in animation-order-3"
                    style={{ color: "var(--theme-color, #6e57e0)", marginBottom: "20px" }}
                  >
                    {profile.subtitle}
                  </h4>
                </div>
                <p className="description tmp-scroll-trigger tmp-fade-in animation-order-4">
                  {profile.bio}
                </p>
                <div className="short-contact-area mt--30">
                  <div className="single-contact">
                    <i className="fa-solid fa-envelope"></i>
                    <div className="information tmp-link-animation">
                      <span style={{ marginRight: '8px', fontWeight: 600 }}>Email - </span>
                      <a href={`mailto:${profile.email}`} className="number">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <div className="single-contact">
                    <i className="fa-solid fa-phone"></i>
                    <div className="information tmp-link-animation">
                      <span style={{ marginRight: '8px', fontWeight: 600 }}>Phone - </span>
                      <a href={`tel:${profile.phone}`} className="number">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  <div className="single-contact">
                    <i className="fa-solid fa-location-dot"></i>
                    <div className="information tmp-link-animation">
                      <span style={{ marginRight: '8px', fontWeight: 600 }}>Address - </span>
                      <span className="number">{profile.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <AcademicProfileTabs profile={profile} /> */}
    </>
  );
}
