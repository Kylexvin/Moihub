import React, { useState, useEffect } from "react";
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
      <div className="blog-page">
        <div className="blog-container">
          <div className="blog-loading">
            <Loader size={28} className="spinning" />
            <p>Loading posts…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-container">
          <div className="blog-error">
            <div className="blog-error-icon"><AlertCircle size={24} /></div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}

export default Blog;