import type { Metadata } from "next";
import BlogCard from "@/components/portfolio/BlogCard";
import { getBlogPosts } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Blog — Dr. Logishoren",
  description:
    "Read Dr. Logishoren's latest blog posts on AI, machine learning, research methodology, and computer science education.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Breadcrumb */}
      <div className="tmp-breadcrumb-area breadcrumb-style-one bg_images">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title">Blog & Insights</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="blog-and-news-are tmp-section-gap">
        <div className="container">
          <div className="section-head mb--60">
            <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
              <span className="subtitle">Latest Posts</span>
            </div>
            <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
              Research Insights &<br /> Thought Leadership
            </h2>
          </div>
          {posts.length > 0 ? (
            <div className="row">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No blog posts yet</h3>
              <p>Stay tuned for upcoming articles and research insights.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
