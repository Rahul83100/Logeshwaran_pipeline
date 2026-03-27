import Banner from "@/components/portfolio/Banner";
import ServiceCards from "@/components/portfolio/ServiceCards";
import CounterStats from "@/components/portfolio/CounterStats";
import SkillBars from "@/components/portfolio/SkillBars";
import EducationTimeline from "@/components/portfolio/EducationTimeline";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import TestimonialSlider from "@/components/portfolio/TestimonialSlider";
import ContactForm from "@/components/portfolio/ContactForm";
import BlogCard from "@/components/portfolio/BlogCard";
import ScrollFadeIn from "@/components/layout/ScrollFadeIn";
import {
  getProfile,
  getSkills,
  getEducation,
  getExperience,
  getProjects,
  getTestimonials,
  getBlogPosts,
} from "@/lib/firestore";
import AcademicProfileTabs from "@/components/portfolio/AcademicProfileTabs";

export default async function Home() {
  const profile = await getProfile();
  const skills = await getSkills();
  const education = await getEducation();
  const experience = await getExperience();
  const projects = await getProjects();
  const testimonials = await getTestimonials();
  const blogPosts = await getBlogPosts();

  return (
    <>
      {/* Banner / Hero */}
      <ScrollFadeIn delay={0.1}>
        <Banner profile={profile} />
      </ScrollFadeIn>

      {/* Counter Stats */}
      <ScrollFadeIn delay={0.2} yOffset={20}>
        <CounterStats profile={profile} />
      </ScrollFadeIn>

      {/* Education Timeline + Experience */}
      <ScrollFadeIn delay={0.1}>
        <EducationTimeline education={education} />
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.2}>
        <div className="container">
          <ExperienceSection experience={experience} />
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.1}>
        <div style={{ marginTop: '80px' }}>
          <AcademicProfileTabs profile={profile} />
        </div>
      </ScrollFadeIn>

      {/* Portfolio Grid */}
      <ScrollFadeIn delay={0.1}>
        <PortfolioGrid projects={projects} />
      </ScrollFadeIn>

      {/* Contact Form */}
      <ScrollFadeIn delay={0.2}>
        <ContactForm />
      </ScrollFadeIn>

      {/* Blog Section */}
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
