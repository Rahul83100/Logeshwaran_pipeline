"use client";

import Image from "next/image";
import { useState } from "react";
import type { Experience } from "@/lib/firestore";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="experiences-wrapper">
      <div className="row">
        <div className="col-lg-6">
          <div className="experiences-wrap-left-content">
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
            {experience.map((exp, index) => {
              const expKey = exp.company + "-" + exp.role + "-" + index;
              const isExpanded = expandedIds.includes(expKey);
              return (
                <div
                  key={expKey}
                  className={"experience-content tmp-scroll-trigger tmp-fade-in animation-order-" + (index + 1)}
                >
                  <p className="ex-subtitle">experience</p>
                  <h2 className="ex-name">
                    {exp.company} {exp.duration ? "(" + exp.duration + ")" : ""}
                  </h2>
                  <h3 className="ex-title">{exp.role}</h3>
                  <p className="ex-para">{exp.description}</p>

                  {exp.details && exp.details.length > 0 && (
                    <div className="mt-4" style={{ background: '#1c1c24', borderRadius: '8px', overflow: 'hidden' }}>
                      <button
                        onClick={() => toggleExpand(expKey)}
                        style={{ width: '100%', padding: '12px 20px', background: '#2a2a35', color: '#fff', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <span style={{ fontWeight: 600 }}>Available Sub-Information</span>
                        <i className={"fa-solid " + (isExpanded ? "fa-minus" : "fa-plus")}></i>
                      </button>

                      {isExpanded && (
                        <div style={{ padding: '20px' }}>
                          {exp.details.map((detail, idx) => (
                            <div key={idx} style={{ marginBottom: idx !== exp.details!.length - 1 ? '15px' : '0', borderBottom: idx !== exp.details!.length - 1 ? '1px solid #2a2a35' : 'none', paddingBottom: idx !== exp.details!.length - 1 ? '15px' : '0' }}>
                              <span style={{ display: 'block', color: '#9393a5', fontSize: '13px', marginBottom: '4px' }}>{detail.label}</span>
                              <span style={{ display: 'block', color: '#e4e4e8', fontSize: '15px' }}>{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="experiences-wrap-right-content">
            <Image
              className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
              src="/assets/images/experiences/expert-img.jpg"
              alt="Professional experience"
              width={600}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
