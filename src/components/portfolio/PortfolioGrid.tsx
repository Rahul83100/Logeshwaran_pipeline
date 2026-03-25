import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/firestore";

interface PortfolioGridProps {
  projects: PortfolioProject[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div className="latest-portfolio-area custom-column-grid tmp-section-gapTop">
      <div className="container">
        <div className="section-head mb--60">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">Latest Portfolio</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            Transforming Ideas into
            <br /> Exceptional Results
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            A collection of research projects, software tools, and innovations developed
            through years of dedicated academic work.
          </p>
        </div>
        <div className="row">
          {projects.map((project, index) => (
            <div key={project.id} className="col-lg-6 col-sm-6">
              <div
                className={`latest-portfolio-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <div className="portfoli-card-img">
                  <div className="img-box v2">
                    <Link
                      className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                      href={project.link}
                    >
                      <Image
                        className="w-100"
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={400}
                      />
                    </Link>
                  </div>
                </div>
                <div className="portfolio-card-content-wrap">
                  <div className="content-left">
                    <h3 className="portfolio-card-title">
                      <Link className="link" href={project.link}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="portfoli-card-para">{project.category}</p>
                  </div>
                  <Link href={project.link} className="tmp-arrow-icon-btn">
                    <div className="btn-inner">
                      <i className="tmp-icon fa-solid fa-arrow-up-right"></i>
                      <i className="tmp-icon-bottom fa-solid fa-arrow-up-right"></i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
