import type { Skill } from "@/lib/firestore";

interface ServiceCardsProps {
  skills: Skill[];
}

export default function ServiceCards({ skills }: ServiceCardsProps) {
  // Show first 4 skills as service cards
  const serviceSkills = skills.slice(0, 4);

  return (
    <section className="service-area tmp-section-gap">
      <div className="container">
        <div className="row justify-content-center">
          {serviceSkills.map((skill, index) => (
            <div key={skill.name} className="col-lg-3 col-md-4 col-sm-6">
              <div
                className={`service-card-v1 tmp-scroll-trigger tmp-fade-in animation-order-${index + 1} tmp-link-animation`}
              >
                <div className="service-card-icon">
                  <i className={skill.icon || "fa-light fa-pen-ruler"}></i>
                </div>
                <h4 className="service-title">
                  <a href="#">{skill.name}</a>
                </h4>
                <p className="service-para">
                  {skill.projectCount ? `${skill.projectCount} Projects` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
