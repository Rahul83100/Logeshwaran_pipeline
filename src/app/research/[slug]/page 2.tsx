import type { Metadata } from "next";
import Link from "next/link";
import { getResearchPaper, getResearchPapers } from "@/lib/firestore";
import { notFound } from "next/navigation";

interface ResearchDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResearchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getResearchPaper(slug);
  if (!paper) {
    return { title: "Paper Not Found" };
  }
  return {
    title: `${paper.title} — Dr. Logishoren`,
    description: paper.abstract,
    openGraph: {
      title: paper.title,
      description: paper.abstract,
      url: `https://logishoren.com/research/${paper.slug}`,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const papers = await getResearchPapers();
  return papers.map((paper) => ({ slug: paper.slug }));
}

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const { slug } = await params;
  const paper = await getResearchPaper(slug);

  if (!paper) {
    notFound();
  }

  return (
    <>
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">{paper.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="research-details-area tmp-section-gap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="research-details-wrapper admin-card">
                <div className="section-head text-align-left mb--30">
                  <span className="subtitle">{paper.journal} • {paper.year}</span>
                  <h2 className="title">{paper.title}</h2>
                </div>
                
                <div className="mb--30">
                  <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Authors</h4>
                  <p>{Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors || 'Unknown Authors'}</p>
                </div>

                <div className="mb--30">
                  <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Abstract</h4>
                  <p style={{ lineHeight: '1.8', opacity: 0.8 }}>{paper.abstract}</p>
                </div>

                {paper.doi && (
                  <div className="mb--30">
                    <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>DOI</h4>
                    <p><a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-color)' }}>{paper.doi}</a></p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                  {paper.pdf_url && (
                    <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="tmp-btn radius-round">
                      View Full PDF
                    </a>
                  )}
                  <Link href="/research" className="tmp-btn radius-round" style={{ background: '#f0f0f0', color: '#333' }}>
                    Back to Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
