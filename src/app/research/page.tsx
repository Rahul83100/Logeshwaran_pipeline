import type { Metadata } from "next";
import ResearchCard from "@/components/portfolio/ResearchCard";
import { getResearchPapers } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Research — Dr. Logishoren",
  description:
    "Explore Dr. Logishoren's published research papers in AI, machine learning, NLP, and computer science.",
};

export default async function ResearchPage() {
  // Get ALL papers (public + private) — private ones show lock + Request Access
  const allPapers = await getResearchPapers();

  const publicPapers = allPapers.filter((p) => !p.is_private);
  const privatePapers = allPapers.filter((p) => p.is_private);

  return (
    <>
      {/* Breadcrumb */}
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">Research Papers</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Research Papers */}
      <section className="education-experience tmp-section-gap">
        <div className="container">
          <div className="section-head mb--50">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Published Research</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
              Research Papers &<br /> Publications
            </h2>
            <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
              A collection of peer-reviewed research papers published in leading journals and
              conferences in computer science and artificial intelligence.
            </p>
          </div>

          {publicPapers.length > 0 && (
            <div className="row g-5">
              {publicPapers.map((paper) => (
                <ResearchCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}

          {publicPapers.length === 0 && (
            <div className="empty-state">
              <h3>No public research papers available</h3>
              <p>Please check back later for new publications.</p>
            </div>
          )}

          {/* Private / Restricted Papers */}
          {privatePapers.length > 0 && (
            <>
              <h2
                className="custom-title mb-32 mt--50 tmp-scroll-trigger tmp-fade-in animation-order-1"
                style={{ marginTop: "60px" }}
              >
                Restricted Access Papers
              </h2>
              <p
                className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-2"
                style={{ marginBottom: "30px" }}
              >
                The following papers require special access. Click &quot;Request Access&quot; to
                submit a request for review.
              </p>
              <div className="row g-5">
                {privatePapers.map((paper) => (
                  <ResearchCard key={paper.id} paper={paper} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
