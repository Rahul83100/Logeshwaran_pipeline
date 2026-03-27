import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/firestore";
import ScrollFadeIn from "@/components/layout/ScrollFadeIn";

interface BlogCardProps {
  post: BlogPost;
  delay?: number;
}

export default function BlogCard({ post, delay = 0 }: BlogCardProps) {
  return (
    <div className="col-lg-4 col-md-6 col-sm-6">
      <ScrollFadeIn delay={delay}>
        <div className="blog-card tmp-hover-link image-box-hover tmp-scroll-trigger tmp-fade-in animation-order-1">
          <div className="img-box">
            <Link href={`/blog/${post.slug}`}>
              <Image
                className="w-100"
                src={post.thumbnail}
                alt={post.title}
                width={400}
                height={280}
              />
            </Link>
            <ul className="blog-tags">
              <li>
                <span className="tag-icon">
                  <i className="fa-regular fa-user"></i>
                </span>
                {post.author}
              </li>
              <li>
                <span className="tag-icon">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                {post.date}
              </li>
            </ul>
          </div>
          <div className="blog-content-wrap">
            <h3 className="blog-title">
              <Link className="link" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
            <div className="more-btn tmp-link-animation">
              <Link href={`/blog/${post.slug}`} className="read-more-btn">
                Read More{" "}
                <span className="read-more-icon">
                  <i className="fa-solid fa-angle-right"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </ScrollFadeIn>
    </div>
  );
}
