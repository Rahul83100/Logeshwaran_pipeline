"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ResearchPaper } from "@/lib/firestore";
import { useAuth } from "@/components/auth/AuthProvider";

interface ResearchCardProps {
  paper: ResearchPaper;
}

export default function ResearchCard({ paper }: ResearchCardProps) {
  const { userData, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (userData?.access_level === 'private') {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, [userData]);

  // Loading state delay to prevent flashing locked content
  if (loading) return <div className="col-lg-6 col-md-6 col-sm-12"><div className="education-experience-card" style={{ height: '300px', opacity: 0.5 }}></div></div>;

  const isLocked = paper.is_private && !hasAccess;

  return (
    <div className="col-lg-6 col-md-6 col-sm-12">
      <div
        className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-1 ${isLocked ? "private-paper-overlay" : ""
          }`}
      >
        {isLocked && (
          <div className="lock-badge">
            <i className="fa-solid fa-lock"></i> Private
          </div>
        )}
        <h4 className="edu-sub-title">{paper.journal} • {paper.year}</h4>
        <h2 className="edu-title" style={{ fontSize: "20px", lineHeight: "1.4" }}>
          {isLocked ? (
            <span>{paper.title}</span>
          ) : (
            <Link href={`/research/${paper.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              {paper.title}
            </Link>
          )}
        </h2>
        <p className="edu-para" style={{ fontSize: "14px", marginBottom: "8px", opacity: 0.7 }}>
          <strong>Authors:</strong> {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
        </p>
        <p className="edu-para">
          {isLocked
            ? paper.abstract.substring(0, 100) + "..."
            : paper.abstract}
        </p>
        {isLocked ? (
          <Link href="/signup?redirect=/request-access" className="request-access-btn" style={{ marginTop: "10px", display: "inline-flex" }}>
            <i className="fa-solid fa-lock"></i> Sign Up to Request Access
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
