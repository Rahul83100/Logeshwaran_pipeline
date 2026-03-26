import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/firestore";

interface BannerProps {
  profile: Profile;
}

export default function Banner({ profile }: BannerProps) {
  const titles = ["Researcher.", "Professor.", "5G Expert.", "Innovator.", "Mentor."];

  return (
    <div className="tmp-banner-one-area">
      <div className="container">
        <div className="banner-one-main-wrapper">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="banner-right-content">
                <div className="image-wrapper hero-image-animated" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <Image
                    className="tmp-scroll-trigger tmp-zoom-in animation-order-1 hero-profile-img"
                    src={profile.bannerImage}
                    alt={profile.name}
                    width={450}
                    height={550}
                    priority
                    style={{
                      width: '100%',
                      maxWidth: '450px',
                      height: 'auto',
                      maxHeight: '550px',
                      objectFit: 'cover',
                      borderRadius: '20px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="inner">
                <span className="sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                  Hello
                </span>
                <h1 className="title tmp-scroll-trigger tmp-fade-in animation-order-2 mt--5">
                  I&apos;m {profile.name} a <br />
                  <span className="header-caption">
                    <span className="cd-headline clip is-full-width">
                      <span className="cd-words-wrapper">
                        {titles.map((title, index) => (
                          <b
                            key={title}
                            className={`${index === 0 ? "is-visible" : "is-hidden"} theme-gradient`}
                          >
                            {title}
                          </b>
                        ))}
                      </span>
                    </span>
                  </span>
                </h1>
                <p className="disc tmp-scroll-trigger tmp-fade-in animation-order-3">
                  {profile.bio}
                </p>
                <div className="button-area-banner-one tmp-scroll-trigger tmp-fade-in animation-order-4">
                  <Link
                    className="tmp-btn hover-icon-reverse radius-round"
                    href="/research"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">View Research</span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right"></i>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
