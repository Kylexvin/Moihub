import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import { ChevronRight, UserCircle, Clock, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Blog.css';

const BlogHomepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 6;

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const postsResponse = await axios.get('https://moigosip.onrender.com/api/posts', {
        params: {
          page,
          limit: postsPerPage,
          category: currentCategory !== 'All' ? currentCategory : undefined,
        },
      });

      const fetchedPosts = postsResponse.data.posts.map((post) => ({
        ...post,
        authorName: post.author?.username || 'Unknown Author',
        excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
      }));

      // Determine if there are more posts
      setHasMore(fetchedPosts.length === postsPerPage);

      // Append or replace posts based on page and category
      setPosts((prevPosts) => {
        // If it's the first page of a new category, replace posts
        if (page === 1) {
          return fetchedPosts;
        }
        // Otherwise, append posts
        return [...prevPosts, ...fetchedPosts];
      });
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError(err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, currentCategory]);

  useEffect(() => {
    // Reset pagination when category changes
    setPage(1);
    setHasMore(true);
    fetchPosts();
  }, [currentCategory, fetchPosts]);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  
  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleCategoryChange = (category) => {
    setPosts([]); // Clear posts for new filter
    setCurrentCategory(category);
    setPage(1);
    setHasMore(true);
  };

  if (error) {
    return (
      <div className="error">
        <p>Error! Check your internet. </p>
      </div>
    );
  }

  const featuredPost = currentCategory === 'All' && posts.length > 0 ? posts[0] : null;
  const regularPosts = currentCategory === 'All' && posts.length > 0 ? posts.slice(1) : posts;

  const allCategories = ['All', ...new Set(posts.map((post) => post.category))];

  return (
    <div className="blog-homepage">
      {/* Header with Login/Register Links */}
      <div className="blog-headerr">
        <div className="auth-links">
          <Link to="/login" className="login-link">
            <LogIn size={20} />
            <span>Login</span>
          </Link>
          <Link to="/register" className="register-link">
            <UserPlus size={20} />
            <span>Register</span>
          </Link>
        </div>
      </div>

      {/* Loading Spinner for Initial Load */}
      {loading && posts.length === 0 && (
        <div className="loadinggg">
          <div className="spinnerrr"></div>
        </div>
      )}

      {posts.length > 0 && (
        <>
          {/* Show Featured Post only when not filtering */}
          {featuredPost && (
            <div className="featured-post" style={{ backgroundImage: `url(${featuredPost.image})` }}>
              <div className="featured-post-background"></div>
              <div className="featured-post-content">
                <span className="featured-tag">Featured</span>
                <h1 className="featured-title">{featuredPost.title}</h1>
                <p className="featured-excerpt">{featuredPost.excerpt}...</p>
                <div className="featured-meta">
                  <div className="meta-item">
                    <UserCircle size={16} />
                    <span>{featuredPost.authorName}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link to={`/blog/${featuredPost._id}`} className="featured-read-btn">
                  Read More
                  <ChevronRight className="btn-icon" size={20} />
                </Link>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="category-filter">
            {allCategories.map((category) => (
              <button
                key={category}
                className={`category-btn ${currentCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="blog-grid">
            {regularPosts.map((post) => (
              <div key={post._id} className="blog-card">
                <img src={post.image} alt={post.title} className="blog-card-image" />
                <div className="blog-card-content">
                  <span className="blog-card-category">{post.category}</span>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <div className="blog-card-author">
                      <UserCircle size={16} />
                      <span>{post.authorName}</span>
                    </div>
                    <Link to={`/blog/${post._id}`} className="blog-card-read-more">
                      Read More
                      <ChevronRight className="read-more-icon" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="load-more-container">
              <button 
                onClick={loadMorePosts} 
                disabled={loading} 
                className="load-more-btn"
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="no-more-posts">No more posts to load</p>
          )}
        </>
      )}
    </div>
  );
};

export default BlogHomepage;