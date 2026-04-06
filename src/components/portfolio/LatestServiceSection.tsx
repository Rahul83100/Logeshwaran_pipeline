"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  services: initialServices,
  imageUrl: initialImageUrl,
  heading: initialHeading,
  description: initialDescription,
  subheading
}: LatestServiceSectionProps) {

  const [services, setServices] = useState<LatestService[]>(initialServices || []);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [heading, setHeading] = useState(initialHeading || "");
  const [description, setDescription] = useState(initialDescription || "");

  useEffect(() => {
    async function fetchFreshData() {
      try {
        // Fetch service items
        const q = query(collection(db, 'latest_services'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as LatestService)));
        }
        // Fetch global config from profile
        const profileSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profileSnap.exists()) {
          const pData = profileSnap.data();
          if (pData.latestServiceTitle) setHeading(pData.latestServiceTitle);
          if (pData.latestServiceDescription) setDescription(pData.latestServiceDescription);
          if (pData.latestServiceImage) setImageUrl(pData.latestServiceImage);
        }
      } catch (err) {
        console.warn("LatestServiceSection: client fetch failed, using SSR props", err);
      }
    }
    fetchFreshData();
  }, []);

  const finalHeading = heading || "Inspiring The World One\nProject";
  const finalSubheading = subheading || "Latest Service";
  const finalDescription = description || "Business consulting consultants provide expert advice and guide businesses to help them improve their performance, efficiency, and organizational";
  const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="latest-service-area tmp-section-gapTop">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{finalSubheading}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2" style={{ whiteSpace: 'pre-line' }}>
            {finalHeading}
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            {finalDescription}
          </p>
        </div>
        <div className="row" style={{ display: 'flex', alignItems: 'stretch' }}>
          <div className="col-lg-6" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {services.map((service, index) => (
              <div key={service.id || index} className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`} style={{ flex: 1, marginBottom: index === services.length - 1 ? 0 : '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 className="service-card-num">
                  <span>{String(index + 1).padStart(2, '0')}.</span>{service.title}
                </h2>
                <p className="service-para">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="col-lg-6" style={{ display: 'flex' }}>
            <div className="service-card-user-image" style={{ height: '100%', width: '100%' }}>
              <img 
                className="tmp-scroll-trigger tmp-zoom-in animation-order-1" 
                src={finalImageUrl} 
                alt="latest-user-image" 
                style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
