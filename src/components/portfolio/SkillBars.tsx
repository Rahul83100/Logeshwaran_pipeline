"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Skill } from "@/lib/firestore";

interface SkillBarsProps {
  skills: Skill[];
}

export default function SkillBars({ skills }: SkillBarsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const designSkills = skills.filter((s) => s.category === "design");
  const devSkills = skills.filter((s) => s.category === "development");

  return (
    <div className="tmp-skill-area tmp-section-gapTop" ref={sectionRef}>
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="progress-wrapper">
              <div className="content">
                <h2 className="custom-title mb--30 tmp-scroll-trigger tmp-fade-in animation-order-1">
                  Research Skills{" "}
                  <span>
                    <Image
                      src="/assets/images/custom-line/custom-line.png"
                      alt="custom-line"
                      width={100}
                      height={10}
                    />
                  </span>
                </h2>
                {designSkills.map((skill, index) => (
                  <div key={skill.name} className="progress-charts">
                    <h6 className="heading heading-h6">{skill.name.toUpperCase()}</h6>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: isVisible ? `${skill.percentage}%` : "0%",
                          transition: `width ${0.5 + index * 0.1}s ease-out ${0.3 + index * 0.1}s`,
                        }}
                        aria-valuenow={skill.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span className="percent-label">{skill.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="progress-wrapper">
              <div className="content">
                <h2 className="custom-title mb--30 tmp-scroll-trigger tmp-fade-in animation-order-1">
                  Technical Skills{" "}
                  <span>
                    <Image
                      src="/assets/images/custom-line/custom-line.png"
                      alt="custom-line"
                      width={100}
                      height={10}
                    />
                  </span>
                </h2>
                {devSkills.map((skill, index) => (
                  <div key={skill.name} className="progress-charts">
                    <h6 className="heading heading-h6">{skill.name.toUpperCase()}</h6>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: isVisible ? `${skill.percentage}%` : "0%",
                          transition: `width ${0.5 + index * 0.1}s ease-out ${0.3 + index * 0.1}s`,
                        }}
                        aria-valuenow={skill.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span className="percent-label">{skill.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
