import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, User, Heart } from "lucide-react";
import axios from "axios";
import "./Blog.css";

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://moihub.onrender.com/api/posts/${slug}`);
        if (response.data.success) {
          setPost(response.data.post);
          setRelatedPosts(response.data.relatedPosts || []);
        }
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="blog-container">
          <div className="blog-loading">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>Blog Post Not Found - Moihub</title>
          <meta name="description" content="The blog post you're looking for could not be found." />
          <link rel="canonical" href="https://moihub-silk.vercel.app/blog" />
        </Helmet>
        <div className="blog-post-page">
          <div className="blog-container">
            <div className="blog-error">{error || "Post not found"}</div>
            <Link to="/blog" className="blog-back-link">← Back to blog</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Dynamic Title */}
        <title>{post.title} - Moihub Blog</title>
        
        {/* Dynamic Meta Description */}
        <meta name="description" content={post.excerpt || `Read "${post.title}" on Moihub blog. Campus stories, guides, and updates from the Moi University community.`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || `Read "${post.title}" on Moihub blog.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://moihub-silk.vercel.app/blog/${post.slug}`} />
        <meta property="og:image" content={post.image || "https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg"} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author?.username || "Moihub"} />
        {post.category && <meta property="article:section" content={post.category} />}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || `Read "${post.title}" on Moihub blog.`} />
        <meta name="twitter:image" content={post.image || "https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg"} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://moihub-silk.vercel.app/blog/${post.slug}`} />
      </Helmet>

      <div className="blog-post-page">
        <div className="blog-container">
          <Link to="/blog" className="blog-back-link">← Back to blog</Link>

          <article className="blog-post">
            {post.image && (
              <div className="blog-post-image">
                <img src={post.image} alt={post.title} />
              </div>
            )}

            <div className="blog-post-header">
              <span className="blog-post-category">{post.category}</span>
              <h1 className="blog-post-title">{post.title}</h1>
              <div className="blog-post-meta">
                <span><User size={16} /> {post.author?.username || "Unknown"}</span>
                <span><Calendar size={16} /> {new Date(post.date).toLocaleDateString()}</span>
                <span><Clock size={16} /> {post.readTime} min read</span>
              </div>
            </div>

            <div className="blog-post-content">
              {post.content?.map((block, index) => {
                if (block.type === "header") {
                  return <h2 key={index} className="blog-post-heading">{block.text}</h2>;
                }
                if (block.type === "paragraph") {
                  return <p key={index} className="blog-post-paragraph">{block.text}</p>;
                }
                if (block.type === "list") {
                  return (
                    <ul key={index} className="blog-post-list">
                      {block.items?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  );
                }
                if (block.type === "image") {
                  return (
                    <div key={index} className="blog-post-image-block">
                      <img src={block.src} alt={block.caption || "Blog image"} />
                      {block.caption && <span className="blog-post-image-caption">{block.caption}</span>}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="blog-post-footer">
              <button className="blog-post-like">
                <Heart size={18} /> {post.likes?.length || 0} likes
              </button>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <div className="blog-related">
              <h3>Related posts</h3>
              <div className="blog-related-grid">
                {relatedPosts.map((related) => (
                  <Link to={`/blog/${related.slug}`} className="blog-related-card" key={related._id}>
                    <h4>{related.title}</h4>
                    <span>{new Date(related.date).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogPost;