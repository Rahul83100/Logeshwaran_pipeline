import Banner from "@/components/portfolio/Banner";
import ServiceCards from "@/components/portfolio/ServiceCards";
import CounterStats from "@/components/portfolio/CounterStats";
import SkillBars from "@/components/portfolio/SkillBars";
import LatestServiceSection from "@/components/portfolio/LatestServiceSection";
import EducationTimeline from "@/components/portfolio/EducationTimeline";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import CompanyLogos from "@/components/portfolio/CompanyLogos";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import MySkillWidget from "@/components/portfolio/MySkillWidget";
import TestimonialSlider from "@/components/portfolio/TestimonialSlider";
import ContactForm from "@/components/portfolio/ContactForm";
import BlogCard from "@/components/portfolio/BlogCard";
import ScrollFadeIn from "@/components/layout/ScrollFadeIn";
import { unstable_noStore as noStore } from 'next/cache';
import {
  getProfile,
  getSkills,
  getEducation,
  getExperience,
  getProjects,
  getTestimonials,
  getBlogPosts,
  getLatestServices,
  getCompanyLogos,
  getSkillWidgets
} from "@/lib/firestore";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export default async function Home() {
  noStore();
  const profile = await getProfile();
  const skills = await getSkills();
  console.log('--- FIRESTORE SKILLS FETCHED ---', skills.map(s => `${s.name}: ${s.percentage}% (${s.category})`));
  const education = await getEducation();
  const experience = await getExperience();
  const projects = await getProjects();
  const testimonials = await getTestimonials();
  const blogPosts = await getBlogPosts();
  
  const latestServices = await getLatestServices();
  const companyLogos = await getCompanyLogos();
  const skillWidgets = await getSkillWidgets();

  return (
    <>
      <ScrollFadeIn delay={0.1}>
        <Banner profile={profile} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <ServiceCards skills={skills} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.2} yOffset={20}>
        <CounterStats profile={profile} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <SkillBars skills={skills} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <LatestServiceSection 
           services={latestServices} 
           imageUrl={profile.latestServiceImage} 
           heading={profile.latestServiceTitle} 
           description={profile.latestServiceDescription} 
        />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <EducationTimeline education={education} />
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.2}>
        <div className="container">
          <ExperienceSection experience={experience} imageUrl={profile.experienceImage} />
        </div>
      </ScrollFadeIn>




      <ScrollFadeIn delay={0.1}>
        <PortfolioGrid projects={projects} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <MySkillWidget widgets={skillWidgets} />
      </ScrollFadeIn>



      <ScrollFadeIn delay={0.2}>
        <ContactForm />
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <section className="blog-and-news-are tmp-section-gap">
        <div className="container">
          <div className="section-head mb--60">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Blog and News</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
              Latest Research Insights &<br /> Publications
            </h2>
          </div>
          <div className="row">
            {blogPosts.slice(0, 3).map((post, i) => (
              <BlogCard key={post.id} post={post} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
      </ScrollFadeIn>
    </>
  );
}
