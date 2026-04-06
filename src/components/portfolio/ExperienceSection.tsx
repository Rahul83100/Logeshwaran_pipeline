"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Experience } from "@/lib/firestore";

interface ExperienceSectionProps {
  experience: Experience[];
  imageUrl?: string;
}

export default function ExperienceSection({ experience: initialExperience, imageUrl: initialImageUrl }: ExperienceSectionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>(initialExperience || []);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");

  useEffect(() => {
    async function fetchFreshData() {
      try {
        // Use simple getDocs without orderBy to avoid excluding docs missing the 'order' field
        const snap = await getDocs(collection(db, 'experience'));
        const mapped = snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            company: data.organization || data.company,
            duration: data.year_range || data.duration,
            role: data.role,
            description: data.description,
            order: data.order ?? 999,
            ...data
          } as Experience;
        }).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        
        // Always update — if array is empty, show nothing; if it has data, show it
        setExperience(mapped);

        const profileSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profileSnap.exists() && profileSnap.data().experienceImage) {
          setImageUrl(profileSnap.data().experienceImage);
        }
      } catch (err) {
        console.warn("ExperienceSection: client fetch failed, using SSR props", err);
      }
    }
    fetchFreshData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="experiences-wrapper">
      <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
        Experiences{" "}
        <span>
          <Image
            src="/assets/images/custom-line/custom-line.png"
            alt="custom-line"
            width={100}
            height={10}
          />
        </span>
      </h2>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        {/* Left: 2x2 card grid */}
        <div style={{ flex: '1 1 55%', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', height: '100%' }}>
            {experience.slice(0, 4).map((exp, index) => {
              const expKey = exp.company + "-" + exp.role + "-" + index;
              const isExpanded = expandedIds.includes(expKey);
              return (
                <div
                  key={expKey}
                  className={`tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
                  style={{
                    background: 'var(--color-gray-2, #f5f5f5)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.3, marginBottom: '4px', color: 'var(--color-heading, #1a1a2e)' }}>
                    {exp.company} {exp.duration ? "(" + exp.duration + ")" : ""}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray, #666)', marginBottom: '8px', fontWeight: 500 }}>{exp.role}</p>
                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-gray, #888)', margin: 0, flex: 1 }}>
                    {exp.description && exp.description.length > 120
                      ? exp.description.substring(0, 120) + "..."
                      : exp.description}
                  </p>

                  {exp.details && exp.details.length > 0 && (
                    <button
                      onClick={() => toggleExpand(expKey)}
                      style={{
                        marginTop: '12px',
                        padding: '8px 14px',
                        background: 'var(--color-primary, #e60000)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                      }}
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      <i className={"fa-solid " + (isExpanded ? "fa-chevron-up" : "fa-chevron-down")} style={{ fontSize: '10px' }}></i>
                    </button>
                  )}

                  {isExpanded && exp.details && (
                    <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.04)', borderRadius: '8px' }}>
                      {exp.details.map((detail, idx) => (
                        <div key={idx} style={{ marginBottom: idx !== exp.details!.length - 1 ? '10px' : '0' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#999', marginBottom: '2px' }}>{detail.label}</span>
                          <span style={{ display: 'block', fontSize: '13px', color: 'var(--color-heading, #1a1a2e)' }}>{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Image */}
        <div style={{ flex: '0 0 40%' }}>
          <Image
            className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
            src={imageUrl || "/assets/images/experiences/expert-img.jpg"}
            alt="Professional experience"
            width={600}
            height={900}
            style={{ objectFit: 'cover', borderRadius: '20px', width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
