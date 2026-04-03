import type { Metadata } from "next";
import Link from "next/link";
import { getEducationItem } from "@/lib/firestore";
import { notFound } from "next/navigation";

interface EducationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EducationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const edu = await getEducationItem(id);
  if (!edu) {
    return { title: "Education Not Found" };
  }
  return {
    title: `${edu.title} — Dr. Logishoren`,
    description: `${edu.institution} - ${edu.description}`,
    openGraph: {
      title: edu.title,
      description: `${edu.institution} - ${edu.description}`,
      url: `https://logishoren.com/education/${edu.id}`,
      type: 'profile',
    },
  };
}

export default async function EducationDetailPage({ params }: EducationDetailPageProps) {
  const { id } = await params;
  const edu = await getEducationItem(id);

  if (!edu) {
    notFound();
  }

  return (
    <>
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">{edu.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="education-details-area tmp-section-gap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="education-details-wrapper admin-card">
                <div className="section-head text-align-left mb--30">
                  <span className="subtitle">{edu.period}</span>
                  <h2 className="title">{edu.title}</h2>
                  <h4 style={{ color: 'var(--theme-color)', marginTop: '10px' }}>{edu.institution}</h4>
                </div>
                
                <div className="mb--30">
                  <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Description</h4>
                  <p style={{ lineHeight: '1.8', opacity: 0.8 }}>{edu.description}</p>
                </div>

                <div style={{ marginTop: '40px' }}>
                  <Link href="/about" className="tmp-btn radius-round">
                    Back to About
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
