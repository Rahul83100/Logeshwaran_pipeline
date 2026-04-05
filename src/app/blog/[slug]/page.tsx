import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/firestore";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} — Dr. Logishoren`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail],
      url: `https://logishoren.com/blog/${post.slug}`,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Blog Details */}
      <section className="blog-details-area tmp-section-gap" style={{ paddingTop: "240px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="blog-details-wrapper">
                <div className="breadcrumb-inner text-center mb--50">
                  <h1 className="title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.2 }}>{post.title}</h1>
                </div>
                {/* Blog Thumbnail */}
                <div className="blog-details-thumb mb--40">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      width={800}
                      height={450}
                      className="w-100"
                      style={{ borderRadius: "10px" }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '450px', backgroundColor: '#f0f0f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                      No image
                    </div>
                  )}
                </div>

                {/* Blog Meta */}
                <div className="blog-details-meta mb--20">
                  <ul className="blog-tags" style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
                    <li>
                      <span className="tag-icon">
                        <i className="fa-regular fa-user"></i>
                      </span>{" "}
                      {post.author}
                    </li>
                    <li>
                      <span className="tag-icon">
                        <i className="fa-solid fa-calendar-days"></i>
                      </span>{" "}
                      {post.date}
                    </li>
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <span className="tag-icon">
                          <i className="fa-solid fa-tag"></i>
                        </span>{" "}
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blog Content */}
                <div
                  className="blog-details-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Back to Blog */}
                <div className="mt--40">
                  <Link
                    href="/blog"
                    className="tmp-btn hover-icon-reverse radius-round"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Back to Blog</span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-left"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-left"></i>
                      </span>
                    </span>
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
