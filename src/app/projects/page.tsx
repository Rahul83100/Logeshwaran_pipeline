import AcademicProfileTabs from "@/components/portfolio/AcademicProfileTabs";
import { getProfile } from "@/lib/firestore";
import ScrollFadeIn from "@/components/layout/ScrollFadeIn";

export default async function ProjectsPage() {
  const profile = await getProfile();

  return (
    <main>
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollFadeIn delay={0.1}>
          <AcademicProfileTabs profile={profile} />
        </ScrollFadeIn>
      </div>
    </main>
  );
}
