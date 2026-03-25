import Image from "next/image";
import type { Experience } from "@/lib/firestore";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
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
            {experience.map((exp, index) => (
              <div
                key={`${exp.company}-${exp.role}`}
                className={`experience-content tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <p className="ex-subtitle">experience</p>
                <h2 className="ex-name">
                  {exp.company} ({exp.duration})
                </h2>
                <h3 className="ex-title">{exp.role}</h3>
                <p className="ex-para">{exp.description}</p>
              </div>
            ))}
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
