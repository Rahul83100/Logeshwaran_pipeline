"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import type { Profile } from "@/lib/firestore";

interface CounterStatsProps {
  profile: Profile;
}

export default function CounterStats({ profile }: CounterStatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const counters = [
    { value: profile.projectsCompleted, suffix: "+", label: "Research Publications" },
    { value: 10, suffix: "+", label: "Books Published" },
    { value: profile.clientReviews, suffix: "+", label: "Patents Granted" },
    { value: profile.happyClients, suffix: "+", label: "Google Scholar Citations" },
  ];

  return (
    <section className="counter-area" ref={sectionRef}>
      <div className="container">
        <div className="row g-5">
          <div className="col-12 col-lg-6 col-xl-6 col-xxl-6">
            <div className="year-of-expariance-wrapper bg-blur-style-one tmp-scroll-trigger tmp-fade-in animation-order-1">
              <div className="year-expariance-wrap">
                <h2 className="counter year-number">
                  {isVisible ? (
                    <CountUp end={profile.yearsOfExperience} duration={2.5} />
                  ) : (
                    <span>0</span>
                  )}
                </h2>
                <h3 className="year-title">
                  Years Of <br /> Experience
                </h3>
              </div>
              <p className="year-para">
                Dedicated to advancing knowledge through innovative research, academic excellence, and mentoring the next generation of researchers and engineers.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-6 col-xxl-6">
            <div className="counter-area-right-content">
              <div className="row g-5">
                {counters.map((counter, index) => (
                  <div key={counter.label} className="col-lg-6 col-sm-6 col-12">
                    <div
                      className={`counter-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
                    >
                      <h3 className="counter counter-title">
                        {isVisible ? (
                          <CountUp end={counter.value} duration={2.5} />
                        ) : (
                          <span>0</span>
                        )}
                        {counter.suffix}
                      </h3>
                      <p className="counter-para">{counter.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
