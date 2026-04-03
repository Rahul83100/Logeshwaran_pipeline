import type { Metadata } from "next";
import Link from "next/link";
import { getExperienceItem } from "@/lib/firestore";
import { notFound } from "next/navigation";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const exp = await getExperienceItem(id);
  if (!exp) {
    return { title: "Experience Not Found" };
  }
  return {
    title: `${exp.role} — Dr. Logishoren`,
    description: `${exp.company} - ${exp.description}`,
    openGraph: {
      title: exp.role,
      description: `${exp.company} - ${exp.description}`,
      url: `https://logishoren.com/experience/${exp.id}`,
      type: 'profile',
    },
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = await params;
  const exp = await getExperienceItem(id);

  if (!exp) {
    notFound();
  }

  return (
    <>
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">{exp.role}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="experience-details-area tmp-section-gap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="experience-details-wrapper admin-card">
                <div className="section-head text-align-left mb--30">
                  <span className="subtitle">{exp.duration}</span>
                  <h2 className="title">{exp.role}</h2>
                  <h4 style={{ color: 'var(--theme-color)', marginTop: '10px' }}>{exp.company}</h4>
                </div>
                
                <div className="mb--30">
                  <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Description</h4>
                  <p style={{ lineHeight: '1.8', opacity: 0.8 }}>{exp.description}</p>
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
