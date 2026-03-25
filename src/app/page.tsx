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
import {
  getProfile,
  getSkills,
  getEducation,
  getExperience,
  getProjects,
  getTestimonials,
  getBlogPosts,
} from "@/lib/firestore";

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
      <Banner profile={profile} />

      {/* Service Cards */}
      <ServiceCards skills={skills} />

      {/* Counter Stats */}
      <CounterStats profile={profile} />

      {/* Skill Bars */}
      <SkillBars skills={skills} />

      {/* Education Timeline + Experience */}
      <EducationTimeline education={education} />
      <div className="container">
        <ExperienceSection experience={experience} />
      </div>

      {/* Portfolio Grid */}
      <PortfolioGrid projects={projects} />

      {/* Testimonial Slider */}
      <TestimonialSlider testimonials={testimonials} />

      {/* Contact Form */}
      <ContactForm />

      {/* Blog Section */}
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
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
