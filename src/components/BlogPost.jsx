import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock,
  User, 
  ArrowLeft, 
  ThumbsUp, 
  Send,  
  Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './BlogPost.css';

// Login Prompt Modal Component
const LoginPromptModal = ({ onClose }) => (
  <div className="login-modal">
    <div className="login-modal-content">
      <h2>Join the Conversation</h2>
      <p>Please login or register to interact with posts.</p>
      <div className="login-modal-actions">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="register-btn">Register</Link>
      </div>
      <button onClick={onClose} className="close-modal">Close</button>
    </div>
  </div>
);

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const { id } = useParams();


  
  const { postId } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on component mount or when postId changes
    if (location.state?.fromRelatedPost) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [postId, location]);
  // Reading Progress Tracker
  useEffect(() => {
    const calculateReadingProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', calculateReadingProgress);
    return () => window.removeEventListener('scroll', calculateReadingProgress);
  }, []);



  // Fetch Post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const currentUserId = localStorage.getItem('userId');

        const response = await axios.get(`https://moigosip.onrender.com/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const { post, relatedPosts } = response.data;
        setPost(post);
        setRelatedPosts(relatedPosts || []);
        setLikes(post.likes?.length || 0);
        setComments(post.comments || []);
        
        setLiked(post.likes?.some(likeId => likeId.toString() === currentUserId) || false);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

 
  // Copy Link to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  // Render Content
  const renderContent = (contentArray) => {
    if (!Array.isArray(contentArray)) return null;
  
    return contentArray.map((item, index) => {
      switch (item.type) {
        case 'header':
          return <h2 key={index} className="blog-section-header">{item.text}</h2>;
        case 'paragraph':
          return <p key={index} className="blog-paragraph">{item.text}</p>;
        case 'image':
          // Ensure `item.src` is being populated correctly (use `item.imagePreview` or `item.src` here)
          return (
            <div key={index} className="blog-image-container">
              <img 
                src={item.imagePreview || item.src} 
                alt={item.caption || 'Blog post image'} 
                className="blog-content-image"
              />
              {item.caption && <p className="image-caption">{item.caption}</p>}
            </div>
          );
        case 'list':
          return (
            <ul key={index} className="blog-list">
              {item.items.map((listItem, liIndex) => (
                <li key={liIndex}>{listItem}</li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };
  

  // Like Handler
const handleLike = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    setShowLoginPrompt(true);
    return;
  }

  try {
    const response = await axios.post(
      `https://moigosip.onrender.com/api/posts/${id}/like`, 
      { liked: !liked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setLikes(response.data.likeCount);
    setLiked(response.data.liked);
  } catch (err) {
    // Specifically check for unauthorized status
    if (err.response?.status === 401) {
      setShowLoginPrompt(true);
    } else {
      console.error('Error liking post:', err);
      alert(err.response?.data?.message || 'Failed to like post');
    }
  }
};

// Add Comment
const handleAddComment = async (e) => {
  e.preventDefault();
  if (!newComment.trim()) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    setShowLoginPrompt(true);
    return;
  }

  try {
    const response = await axios.post(
      `https://moigosip.onrender.com/api/posts/${id}/comment`,
      { text: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setComments(response.data);
    setNewComment('');
  } catch (err) {
    // Specifically check for unauthorized status
    if (err.response?.status === 401) {
      setShowLoginPrompt(true);
    } else {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  }
};
  // Format Comment Timestamp
  const formatCommentTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp)) + ' ago';
    } catch {
      return 'Recently';
    }
  };

  // Loading State
  if (loading) return (
    <div className="loadinggg">
      <div className="spinnerrr"></div>
    </div>
  );

  // Error State
  if (error) return (
    <div className="error">
      <div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/blog" className="return-home">
          Return to Home
        </Link>
      </div>
    </div>
  );

  // Not Found State
  if (!post) return (
    <div className="not-found">
      <div>
        <h2>Post Not Found</h2>
        <Link to="/blog" className="return-blog">
          Return to Blog
        </Link>
      </div>
    </div>
  );

  return (
    <div className="blog-post-page">
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress-bar" 
        style={{
          width: `${readingProgress}%`,
          height: '4px',
          backgroundColor: '#007bff',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          transition: 'width 0.2s'
        }}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      <div className="blog-post-header">
        <Link to="/blog" className="back-to-blog">
          <ArrowLeft size={24} className="back-icon" />
          Back to Blog
        </Link>
        
        <h1 className="blog-post-title">{post.title}</h1>
        
        <div className="blog-post-meta-container">
          <div className="blog-post-meta">
            <div className="meta-item meta-date">
              <div className="meta-icon-wrapper">
                <Calendar size={16} className="meta-icon" />
              </div>
              <div className="meta-content">
                <span className="meta-label">Published</span>
                <span className="meta-value">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="meta-divider"></div>

            <div className="meta-item meta-read-time">
              <div className="meta-icon-wrapper">
                <Clock size={16} className="meta-icon" />
              </div>
              <div className="meta-content">
                <span className="meta-label">Read Time</span>
                <span className="meta-value">{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        {post.image && (
          <div className="blog-post-featured-image">
            <img 
              src={post.image} 
              alt={post.title} 
              className="featured-image"
            />
          </div>
        )}
      </div>

      <div className="blog-post-content">
        {renderContent(post.content)}
      </div>

      <div className="interactions-section">
        <div className="like-section">
          <button 
            className={`like-button ${liked ? 'liked' : ''}`} 
            onClick={handleLike}
          >
            <ThumbsUp size={20} />
            <span>{likes} Like{likes !== 1 ? 's' : ''}</span>
          </button>
          
          <button 
            onClick={handleCopyLink} 
            className="copy-link-button"
          >
            <Copy size={20} /> Copy Link
          </button>
        </div>

       
      </div>
      <div className="comments-section">
  <h3 className="comments-title">Comments ({comments.length})</h3>
  
  <div className="comments-list">
    {comments.length ? (
      // Reverse the comments array to show the newest comments first
      comments.slice().reverse().map((comment, index) => (
        <div key={index} className="comment">
          <div className="comment-header">
            <div className="comment-user">
              {comment.user?.profilePicture ? (
                <img 
                  src={comment.user.profilePicture} 
                  alt={comment.user.username} 
                  className="user-profile-pic"
                />
              ) : (
                <User size={24} className="user-icon" />
              )}
              <strong>{comment.user?.username || 'Anonymous'}</strong>
            </div>
            <span className="comment-timestamp">
              {formatCommentTimestamp(comment.date)}
            </span>
          </div>
          <p>{comment.text}</p>
        </div>
      ))
    ) : (
      <p className="no-comments">No comments yet. Be the first to comment!</p>
    )}
  </div>

  <form onSubmit={handleAddComment} className="comment-form">
    <div className="comment-input-container">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="comment-textarea"
        rows={4}
        required
      />
      <button 
        type="submit" 
        className="submit-comment-button"
        disabled={!newComment.trim()}
      >
        <Send size={20} />
        <span>Post Comment</span>
      </button>
    </div>
  </form>
</div>

   
{relatedPosts.length > 0 && (
  <div className="related-posts-section">
    <h3 className="related-posts-title">Related Posts</h3>
    <div className="related-posts-grid">
      {relatedPosts.map((relatedPost) => (
        <Link 
        to={`/blog/${relatedPost._id}`} 
        state={{ fromRelatedPost: true }} // Add this
        key={relatedPost._id} 
        className="related-post-card"
      >
          <div className="related-post-image-wrapper">
            <img 
              src={relatedPost.image} 
              alt={relatedPost.title} 
              className="related-post-image"
            />
            <div className="related-post-overlay">
              <span className="related-post-hover-text">Read Post</span>
            </div>
          </div>
          <div className="related-post-info">
            <span className="related-post-category">{relatedPost.category}</span>
            <h4 className="related-post-title">
              {relatedPost.title.length > 50 
                ? `${relatedPost.title.substring(0, 50)}...` 
                : relatedPost.title}
            </h4>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

     
    </div>
  );
};

export default BlogPost;