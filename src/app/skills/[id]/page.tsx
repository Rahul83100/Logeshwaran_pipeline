import type { Metadata } from "next";
import Link from "next/link";
import { getSkillItem } from "@/lib/firestore";
import { notFound } from "next/navigation";

interface SkillDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SkillDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const skill = await getSkillItem(id);
  if (!skill) {
    return { title: "Skill Not Found" };
  }
  return {
    title: `${skill.name} — Dr. Logishoren`,
    description: `Category: ${skill.category} | Proficiency: ${skill.percentage}%`,
    openGraph: {
      title: skill.name,
      description: `Expertise in ${skill.name} (${skill.category})`,
      url: `https://logishoren.com/skills/${skill.id}`,
      type: 'profile',
    },
  };
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { id } = await params;
  const skill = await getSkillItem(id);

  if (!skill) {
    notFound();
  }

  return (
    <>
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">{skill.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="skill-details-area tmp-section-gap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="skill-details-wrapper admin-card text-center">
                <div className="section-head mb--30">
                  <span className="subtitle">{skill.category}</span>
                  <h2 className="title">{skill.name}</h2>
                </div>
                
                <div className="mb--30">
                  <div className="proficiency-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid var(--theme-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '32px', fontWeight: 'bold', color: 'var(--theme-color)' }}>
                    {skill.percentage}%
                  </div>
                  <p style={{ marginTop: '20px', fontSize: '18px', opacity: 0.8 }}>Proficiency Level</p>
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
