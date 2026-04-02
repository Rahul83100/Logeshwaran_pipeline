"use client";

import Image from "next/image";

interface LatestService {
  id?: string;
  order?: number;
  title: string;
  description: string;
}

interface LatestServiceSectionProps {
  services: LatestService[];
  imageUrl?: string;
  heading?: string;
  subheading?: string;
  description?: string;
}

export default function LatestServiceSection({ 
  services,
  imageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
  heading = "Inspiring The World One\nProject",
  subheading = "Latest Service",
  description = "Business consulting consultants provide expert advice and guide businesses to help them improve their performance, efficiency, and organizational"
}: LatestServiceSectionProps) {
  return (
    <section className="latest-service-area tmp-section-gapTop">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{subheading}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2" style={{ whiteSpace: 'pre-line' }}>
            {heading}
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            {description}
          </p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            {services.map((service, index) => (
              <div key={service.id || index} className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                <h2 className="service-card-num">
                  <span>{String(index + 1).padStart(2, '0')}.</span>{service.title}
                </h2>
                <p className="service-para">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="col-lg-6">
            <div className="service-card-user-image">
              <img 
                className="tmp-scroll-trigger tmp-zoom-in animation-order-1" 
                src={imageUrl} 
                alt="latest-user-image" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
