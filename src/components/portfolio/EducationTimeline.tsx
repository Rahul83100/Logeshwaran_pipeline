import Image from "next/image";
import type { Education } from "@/lib/firestore";

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({ education }: EducationTimelineProps) {
  return (
    <section className="education-experience tmp-section-gapTop">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">Education & Experience</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            Academic Journey &<br /> Achievements
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            A distinguished academic career spanning research, teaching, and innovation in computer science and artificial intelligence.
          </p>
        </div>
        <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
          Education{" "}
          <span>
            <Image
              src="/assets/images/custom-line/custom-line.png"
              alt="custom-line"
              width={100}
              height={10}
            />
          </span>
        </h2>
        <div className="row g-5">
          {education.map((edu, index) => (
            <div key={`${edu.title}-${edu.period}`} className="col-lg-6 col-sm-6">
              <div
                className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <h4 className="edu-sub-title">{edu.title}</h4>
                <h2 className="edu-title">{edu.period}</h2>
                <p className="edu-para">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
