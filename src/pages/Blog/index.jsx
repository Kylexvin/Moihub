import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowRight, Loader, AlertCircle } from "lucide-react";
import axios from "axios";
import "./Blog.css";

// Was hardcoded to http://localhost:5000 — worked locally, would 404 in production.
const API_BASE = "https://moihub.onrender.com/api";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/posts`);
        if (response.data.success) {
          setPosts(response.data.posts);
        }
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Blog - Moihub | Campus Stories & Updates</title>
          <meta name="description" content="Read campus stories, guides, and updates from the Moi University community on Moihub blog." />
          <link rel="canonical" href="https://moihub-silk.vercel.app/blog" />
        </Helmet>
        <div className="blog-page">
          <div className="blog-container">
            <div className="blog-loading">
              <Loader size={28} className="spinning" />
              <p>Loading posts…</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Blog - Moihub | Campus Stories & Updates</title>
          <meta name="description" content="Read campus stories, guides, and updates from the Moi University community on Moihub blog." />
          <link rel="canonical" href="https://moihub-silk.vercel.app/blog" />
        </Helmet>
        <div className="blog-page">
          <div className="blog-container">
            <div className="blog-error">
              <div className="blog-error-icon"><AlertCircle size={24} /></div>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Blog - Moihub | Campus Stories, Guides & Updates</title>
        
        {/* Meta Description */}
        <meta name="description" content="Read campus stories, guides, and updates from the Moi University community. Stay informed about campus life, events, and student experiences on Moihub blog." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Moihub Blog - Campus Stories, Guides & Updates" />
        <meta property="og:description" content="Read campus stories, guides, and updates from the Moi University community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/blog" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Moihub Blog - Campus Stories, Guides & Updates" />
        <meta name="twitter:description" content="Read campus stories, guides, and updates from the Moi University community." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/blog" />
      </Helmet>

      <div className="blog-page">
        <div className="blog-container">
          <div className="blog-header">
            <span className="blog-badge">Stories</span>
            <h1 className="blog-title">
              MoiHub <span className="blog-highlight">blog</span>
            </h1>
            <p className="blog-subtitle">Campus stories, guides, and updates from the Moi community.</p>
          </div>

          <div className="blog-grid">
            {posts.length === 0 ? (
              <p className="blog-empty">No posts yet — check back soon.</p>
            ) : (
              posts.map((post) => (
                <Link to={`/blog/${post.slug}`} className="blog-card" key={post._id}>
                  <div className="blog-card-image">
                    {post.image ? (
                      <img src={post.image} alt={post.title} />
                    ) : (
                      <div className="blog-card-image-fallback" aria-hidden="true" />
                    )}
                    {post.category && <span className="blog-card-category">{post.category}</span>}
                  </div>
                  <div className="blog-card-body">
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <span><User size={13} /> {post.author?.username || "Unknown"}</span>
                      <span><Calendar size={13} /> {new Date(post.date).toLocaleDateString()}</span>
                      <span><Clock size={13} /> {post.readTime} min</span>
                    </div>
                    <span className="blog-card-read">Read more <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;