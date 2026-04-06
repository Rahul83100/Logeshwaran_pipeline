"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SkillWidget {
  id?: string;
  order?: number;
  icon: string;
  title: string;
  count: number | string;
  description: string;
  link?: string;
}

const DEFAULT_SKILL_WIDGETS: SkillWidget[] = [
  { id: 'default-1', order: 0, icon: 'fa-light fa-book-open-reader', title: 'Research Publications', count: '100+', description: 'Extensive research published in top-tier journals including Nature, IEEE, and Springer.' },
  { id: 'default-2', order: 1, icon: 'fa-light fa-lightbulb', title: 'Patents Granted', count: '300+', description: 'Innovating cutting-edge technologies in IoT, 5G networks, and intelligent computation.' },
  { id: 'default-3', order: 2, icon: 'fa-light fa-user-graduate', title: 'Academic Mentoring', count: '50+', description: 'Guiding PhD scholars and postgraduate students toward academic and research excellence.' },
];

interface MySkillWidgetProps {
  widgets: SkillWidget[];
  heading?: string;
  subheading?: string;
}

export default function MySkillWidget({ 
  widgets: initialWidgets,
  heading = "Elevated Designs\nPersonalized the best Experiences",
  subheading = "My Skill"
}: MySkillWidgetProps) {

  const [widgets, setWidgets] = useState<SkillWidget[]>(
    initialWidgets && initialWidgets.length > 0 ? initialWidgets : DEFAULT_SKILL_WIDGETS
  );

  useEffect(() => {
    async function fetchFresh() {
      try {
        const snap = await getDocs(collection(db, 'skill_widgets'));
        const fresh = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as SkillWidget))
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        
        if (fresh.length > 0) {
          setWidgets(fresh);
        } else {
          setWidgets(DEFAULT_SKILL_WIDGETS);
        }
      } catch (err) {
        console.warn("MySkillWidget: client fetch failed", err);
      }
    }
    fetchFresh();
  }, []);

  if (!widgets || widgets.length === 0) return null;

  return (
    <section className="my-skill tmp-section-gapTop">
      <style jsx>{`
        .skill-hover-item {
          display: flex;
          align-items: center;
          padding: 30px 40px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
          background: transparent;
        }
        .skill-hover-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--color-primary, #ff014f);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .skill-hover-item:hover::before {
          transform: scaleX(1);
        }
        .skill-hover-item:hover .skill-icon-wrap {
          border-color: rgba(255,255,255,0.4) !important;
        }
        .skill-hover-item:hover .skill-icon-wrap i {
          color: #fff !important;
        }
        .skill-hover-item:hover .skill-title-text {
          color: #fff !important;
        }
        .skill-hover-item:hover .skill-count-text {
          color: rgba(255,255,255,0.8) !important;
        }
        .skill-hover-item:hover .skill-desc-text {
          color: rgba(255,255,255,0.85) !important;
        }
        .skill-hover-item > * {
          position: relative;
          z-index: 1;
        }
        .skill-icon-wrap {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 2px solid var(--color-border, #e0e0e0);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.4s ease;
        }
        .skill-icon-wrap i {
          font-size: 24px;
          color: var(--color-heading, #1a1a2e);
          transition: color 0.4s ease;
        }
        .skill-title-block {
          flex: 0 0 280px;
          padding: 0 30px;
        }
        .skill-title-text {
          font-size: 22px;
          font-weight: 700;
          color: var(--color-heading, #1a1a2e);
          margin: 0 0 4px;
          transition: color 0.4s ease;
        }
        .skill-count-text {
          font-size: 14px;
          color: var(--color-gray, #666);
          margin: 0;
          transition: color 0.4s ease;
        }
        .skill-desc-text {
          flex: 1;
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-gray, #666);
          margin: 0;
          transition: color 0.4s ease;
        }
        @media (max-width: 991px) {
          .skill-hover-item {
            flex-wrap: wrap;
            gap: 15px;
            padding: 20px;
          }
          .skill-title-block {
            flex: 1;
            padding: 0 15px;
          }
          .skill-desc-text {
            flex-basis: 100%;
          }
        }
      `}</style>
      <div className="container">
        <div className="section-head text-align-left mb--50">
          <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{subheading}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2" style={{ whiteSpace: 'pre-line' }}>
            {heading}
          </h2>
        </div>
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
          {widgets.map((widget, index) => (
            <div key={widget.id || index} className="skill-hover-item">
              <div className="skill-icon-wrap">
                <i className={widget.icon}></i>
              </div>
              <div className="skill-title-block">
                <h3 className="skill-title-text">{widget.title}</h3>
                <p className="skill-count-text">{widget.count} Done</p>
              </div>
              <p className="skill-desc-text">{widget.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
