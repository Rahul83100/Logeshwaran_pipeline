import Link from "next/link";
import type { ResearchPaper } from "@/lib/firestore";

interface ResearchCardProps {
  paper: ResearchPaper;
}

export default function ResearchCard({ paper }: ResearchCardProps) {
  return (
    <div className="col-lg-6 col-md-6 col-sm-12">
      <div
        className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-1 ${paper.is_private ? "private-paper-overlay" : ""
          }`}
      >
        {paper.is_private && (
          <div className="lock-badge">
            <i className="fa-solid fa-lock"></i> Private
          </div>
        )}
        <h4 className="edu-sub-title">{paper.journal} • {paper.year}</h4>
        <h2 className="edu-title" style={{ fontSize: "20px", lineHeight: "1.4" }}>
          {paper.is_private ? (
            <span>{paper.title}</span>
          ) : (
            <Link href={`/research/${paper.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              {paper.title}
            </Link>
          )}
        </h2>
        <p className="edu-para" style={{ fontSize: "14px", marginBottom: "8px", opacity: 0.7 }}>
          <strong>Authors:</strong> {paper.authors.join(", ")}
        </p>
        <p className="edu-para">
          {paper.is_private
            ? paper.abstract.substring(0, 100) + "..."
            : paper.abstract}
        </p>
        {paper.is_private ? (
          <Link href="/request-access" className="request-access-btn" style={{ marginTop: "10px", display: "inline-flex" }}>
            <i className="fa-solid fa-lock"></i> Request Access
          </Link>
        ) : (
          <Link
            href={`/research/${paper.slug}`}
            className="read-more-btn"
            style={{ marginTop: "10px", display: "inline-block" }}
          >
            Read Full Paper{" "}
            <span className="read-more-icon">
              <i className="fa-solid fa-angle-right"></i>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
