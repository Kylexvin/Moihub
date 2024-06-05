import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './bloghome.css';
import blogData from '../data/blogData.json';

function BlogHome() {
  const { blogs } = blogData;

  // Apply the background color to the body on component mount
  useEffect(() => {
    document.body.style.backgroundColor = 'ivory'; // Set initial color to ivory
  }, []);

  // Separate the featured blog from the rest of the blogs
  const featuredBlog = blogs.find(blog => blog.isFeatured);
  const otherBlogs = blogs.filter(blog => !blog.isFeatured);

  // Function to format date to ISO 8601 format
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString();
  };

  // JSON-LD markup for blog articles
  const jsonLdMarkup = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MoiHub Blog",
    "description": "Explore the latest blog posts on MoiHub - your source for insightful articles and stories.",
    "url": "https://moihub.co.ke/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MoiHub",
      "url": "https://moihub.co.ke",
      "logo": "https://moihub.co.ke/logo.jpg"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://moihub.co.ke/blog"
    },
    "author": {
      "@type": "Person",
      "name": "Your Name"
    },
    "datePublished": formatDate(featuredBlog.date), // Format date to ISO 8601
    "image": featuredBlog.image // URL of featured blog image
  };

  return (
    <main>
      {/* SEO Metadata */}
      <Helmet>
        <title>Explore Our Blog - MoiHub</title>
        <meta name="description" content="Explore the latest blog posts on MoiHub - your source for insightful articles and stories." />
        <link rel="canonical" href="https://moihub.co.ke/blog" /> {/* Replace with your actual canonical URL */}
        {/* JSON-LD markup */}
        <script type="application/ld+json">{JSON.stringify(jsonLdMarkup)}</script>
      </Helmet>

      <section className="featured">
        <div className="f-overlay">
          <h3 className="f-title">FEATURED</h3>
          <h3>{featuredBlog.title}</h3>
          <p className="description">{featuredBlog.description}</p>
          <div className="blog-details">
            <p className='author-ff'>{featuredBlog.author}</p>
            <Link to={`/blog/${featuredBlog.id}`} className="readmore-f">
              <button>Read More</button>
            </Link>
          </div>
        </div>
        <img src={featuredBlog.image} alt={featuredBlog.title} />
      </section>

      <section className="blog-list">
        {otherBlogs.map(blog => (
          <div className="blog-card" key={blog.id}>
            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
            </div>
            <div className="blog-content">
              <div className="blog-title">
                <h3>{blog.title}</h3>
                <p className='description'>{blog.description}</p>
              </div>
              <div className="blog-details">
                <p className='author-f'>{blog.author}</p>
                <Link to={`/blog/${blog.id}`} className="readmore">
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default BlogHome;
