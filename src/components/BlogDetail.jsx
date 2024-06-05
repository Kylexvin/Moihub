import React, { useEffect } from 'react'; // Import useEffect hook
import { useParams, Link } from 'react-router-dom';
import blogData from '../data/blogData.json';
import './BlogDetail.css'; // Import external CSS file for styling

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from URL parameters
  const blog = blogData.blogs.find(blog => blog.id === parseInt(id)); // Find the blog in the data

  useEffect(() => {
    scrollToTop();
  }, [id]); // Dependency array ensures useEffect runs when 'id' changes

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!blog) {
    return <div>Blog not found</div>;
  }

  // Randomly select related blogs
  const relatedBlogs = getRandomBlogs(blogData.blogs, 5); // Adjust the number of related blogs as needed

  return (
    <div>
      <div className="my-custom">
        <img src={blog.image} alt={blog.title} className="blog-image" />
      </div>
      <div className="blog-content">
        <div className="date-holder">{blog.date}</div>
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-content">{blog.blocka}</p>
        <blockquote>
          <p className="blog-quote">Quote: {blog.quote}</p>
        </blockquote>
        <p className="blog-content">{blog.blockb}</p>
        <p className="author">Author: {blog.author}</p>
      </div>

      <div className="addtoany">
  <a href="#" className="share-icon facebook"><i className='fab fa-facebook-f'></i></a>
  <a href="#" className="share-icon twitter"><i className='fab fa-twitter'></i></a>
  <a href="https://wa.me/?text=Check%20out%20this%20awesome%20blog%20post%20on%20MoiHub:%20[Insert%20Blog%20Title]%20-%20[Insert%20Blog%20URL]" target="_blank" rel="noopener noreferrer" className="share-icon whatsapp"><i className='fab fa-whatsapp'></i></a>
  <a href="mailto:?subject=Check%20out%20this%20awesome%20blog%20post%20on%20MoiHub:%20[Insert%20Blog%20Title]&body=Hi,%0A%0ACheck%20out%20this%20awesome%20blog%20post%20on%20MoiHub:%0A[Insert%20Blog%20Title]%20-%20[Insert%20Blog%20URL]%0A%0A[Insert%20your%20message%20here.]" className="share-icon gmail"><i className='far fa-envelope'></i></a>
</div>


      <div className="read-navigation">
        <Link to={`/blog/${parseInt(id) - 1}`} className="pagination-link">Previous Post</Link>
        <Link to={`/blog/${parseInt(id) + 1}`} className="pagination-link">Next Post</Link>
      </div>

      <div className="related-blogs">
        <h2>Related Blogs:</h2>
        <div className="blog-thumbnail">
          <ul>
            {relatedBlogs.map(relatedBlog => (
              <li key={relatedBlog.id}>
                <Link to={`/blog/${relatedBlog.id}`}>
                  <img src={relatedBlog.image} alt={relatedBlog.title} className="thumbnail" />
                  <span>{relatedBlog.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Function to randomly select 'n' blogs from the provided blog list
const getRandomBlogs = (blogs, n) => {
  const shuffled = blogs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default BlogDetail;
