import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft , Loader2, MessageCircle, Trash2 ,Edit } from 'lucide-react';
import { Toaster, toast} from 'react-hot-toast';
import './WritersPage.css';

const WritersPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ type: 'paragraph', text: '', items: [] });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No token found! Please log in again.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/posts/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Add a check to ensure data.posts exists and is an array
        if (Array.isArray(data?.posts)) {
          setPosts(data.posts);
        } else {
          console.error('Invalid posts data:', data);
          toast.error('Failed to load posts');
        }
      } catch (error) {
        toast.error('Error fetching all posts');
        console.error('Error fetching all posts:', error);
      }
    };
  
    fetchAllPosts();
  }, []);

  const navigate = useNavigate();

  const renderPostContent = (content) => {
    try {
      // Check if content is a string (old format) or parsed JSON (new format)
      const parsedContent = typeof content === 'string' 
        ? JSON.parse(content) 
        : content;

      if (!Array.isArray(parsedContent)) {
        return <p>Invalid content format</p>;
      }

      return parsedContent.map((block, index) => {
        switch(block.type) {
          case 'header':
            return <h3 key={index} className="block-preview-header">{block.text}</h3>;
          case 'paragraph':
            return <p key={index} className="block-preview-paragraph">{block.text}</p>;
          case 'list':
            return (
              <ul key={index} className="block-preview-list">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <div key={index} className="block-preview-image-container">
                <img 
                  src={block.src} 
                  alt={block.caption || 'Block image'} 
                  className="block-preview-image"
                />
                {block.caption && <p className="block-preview-image-caption">{block.caption}</p>}
              </div>
            );
          default:
            return null;
        }
      });
    } catch (error) {
      console.error('Error parsing post content:', error);
      return <p>Unable to render content</p>;
    }
  };

  const toggleComments = async (postId) => {
  if (showComments[postId]) {
    setShowComments({ ...showComments, [postId]: false });
    return;
  }
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No token found! Please log in again.');
      return;
    }

    const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.post.comments) {
      setComments({ ...comments, [postId]: response.data.post.comments });
      setShowComments({ ...showComments, [postId]: true });
    } else {
      toast.error('No comments found');
    }
  } catch (error) {
    console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    toast.error('Failed to fetch comments');
  }
};

const deleteComment = async (postId, commentId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No token found! Please log in again.');
      return;
    }

    await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    setComments({
      ...comments,
      [postId]: comments[postId].filter((comment) => comment._id !== commentId),
    });
    toast.success('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error.response ? error.response.data : error.message);
    toast.error('Failed to delete comment');
  }
};
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    }
  };

  const handleContentBlockImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setNewBlock(prev => ({ 
          ...prev, 
          src: reader.result,
          caption: prev.caption || '' 
        }));
        toast.success('Block image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const addBlock = () => {
    if (newBlock.type === 'list' && newBlock.items.length === 0) {
      toast.error('Please add at least one item to the list');
      return;
    }

    const isValidBlock = 
      (newBlock.type === 'paragraph' && newBlock.text.trim()) ||
      (newBlock.type === 'header' && newBlock.text.trim()) ||
      (newBlock.type === 'list' && newBlock.items.length > 0) ||
      (newBlock.type === 'image' && newBlock.src);

    if (isValidBlock) {
      setContentBlocks([...contentBlocks, newBlock]);
      setNewBlock({ 
        type: 'paragraph', 
        text: '', 
        items: [],
        src: '',
        caption: ''
      });
      toast.success('Content block added');
    } else {
      toast.error(`Please provide content for ${newBlock.type} block`);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (!image) {
      toast.error('Please upload a main image for the post');
      return;
    }

    if (contentBlocks.length === 0) {
      toast.error('Please add at least one content block');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('content', JSON.stringify(contentBlocks));

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No token found! Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Robust check for posts array
        if (Array.isArray(data?.posts)) {
          setPosts(data.posts);
          toast.success('Blog post successfully created!');
          
          // Reset form
          setTitle('');
          setCategory('');
          setContentBlocks([]);
          setImage(null);
          setPreviewImage(null);
        } else {
          // Fallback if posts array is not in the expected format
          toast.success('Blog post created, but unable to update post list');
          console.warn('Unexpected response format:', data);
        }
      } else {
        // Handle error responses
        toast.error(`Error: ${data.message || 'Error creating blog post'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No token found! Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Post deleted successfully!');
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        toast.error('Error deleting post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post.');
    }
  };

  return (
    <div className='writer-page'>
      <Toaster 
        position="top-right" 
        toastOptions={{
          success: {
            style: {
              background: '#4CAF50',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#F44336',
              color: 'white',
            },
          },
        }} 
      />
    
      <header className='writer-page-header'>
      <Link to="/blog" className="back-to-blog">
          <ArrowLeft size={24} className="back-icon" />
          Back to Blog
        </Link>
      </header>

      <h1 className='writer-page-header'>Create Blog Post</h1>

      <input
  type="text"
  placeholder="Enter blog title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="blog-title-input"
/>


<input
  type="text"
  placeholder="Enter blog category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="input-field"
/>

<div className="file-upload">
  <input type="file" onChange={handleImageUpload} className="file-input" />
  {previewImage && (
    <div className="preview-container">
      <p>Preview:</p>
      <img src={previewImage} alt="Uploaded Preview" className="preview-image" />
    </div>
  )}
</div>

<div className="select-container">
  <select
    value={newBlock.type}
    onChange={(e) => setNewBlock({ 
      type: e.target.value, 
      text: '', 
      items: [], 
      src: '', 
      caption: '' 
    })}
    className="select-input"
  >
    <option value="paragraph">Paragraph</option>
    <option value="header">Header</option>
    <option value="list">List</option>
    <option value="image">Image Block</option>
  </select>

  {newBlock.type === 'list' ? (
    <input
      type="text"
      placeholder="Enter list items, separated by commas"
      value={newBlock.items.join(', ')}
      onChange={(e) => setNewBlock({ 
        ...newBlock, 
        items: e.target.value.split(',').map(item => item.trim()) 
      })}
      className="input-field list-input"
    />
  ) : newBlock.type === 'image' ? (
    <div className="image-block">
      <input 
        type="file" 
        accept="image/*"
        onChange={handleContentBlockImageUpload}
        className="file-input"
      />
      {newBlock.src && (
        <img 
          src={newBlock.src} 
          alt="Block Preview" 
          className="block-preview-image" 
        />
      )}
      <input
        type="text"
        placeholder="Add image caption (optional)"
        value={newBlock.caption || ''}
        onChange={(e) => setNewBlock({ ...newBlock, caption: e.target.value })}
        className="input-field"
      />
    </div>
  ) : (
    <textarea
      placeholder={`Enter your ${newBlock.type} content`}
      value={newBlock.text}
      onChange={(e) => setNewBlock({ ...newBlock, text: e.target.value })}
      className="textarea-field"
    />
  )}

<button onClick={addBlock} style={{ marginBottom: '20px' }}>
          Add Content Block
        </button>
</div>
      

<div className="content-preview-container">
  {contentBlocks.length > 0 && (
    <div>
      <h2 className="content-preview-title">Content Preview:</h2>
      {contentBlocks.map((block, index) => (
        <div key={index} className="content-block">
          {block.type === 'header' && <h3 className="block-header">{block.text}</h3>}
          {block.type === 'paragraph' && <p className="block-paragraph">{block.text}</p>}
          {block.type === 'list' && (
            <ul className="block-list">
              {block.items.map((item, i) => (
                <li key={i} className="list-item">{item}</li>
              ))}
            </ul>
          )}
          {block.type === 'image' && (
            <div className="block-image-container">
              <img src={block.src} alt="Uploaded block" className="block-image" />
              {block.caption && <p className="image-caption">{block.caption}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>


<button 
        onClick={handleSubmit} 
        className="submit-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading... Please Wait
          </>
        ) : (
          'Submit Post'
        )}
      </button>


      <div className="blog-posts-container">
        <h2 className="blog-posts-title">Blog Posts</h2>
        {posts.length === 0 ? (
          <div className="no-posts-message">
            <p>No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-container">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-meta">
                  <span className="post-category">Category: {post.category}</span>
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={`${post.title} cover`} 
                      className="post-cover-image"
                    />
                  )}
                </div>
              </div>

              <div className="post-content">
              {renderPostContent(post.content)}
              </div>

              <div className="post-actions">
  <button 
    onClick={() => toggleComments(post._id)} 
    className="toggle-comments-button"
  >
    <MessageCircle size={16} />
    {showComments[post._id] ? 'Hide Comments' : 'Show Comments'}
    {comments[post._id] && ` (${comments[post._id].length})`}
  </button>

  {showComments[post._id] && comments[post._id] && (
    <div className="comments-sectionn">
      <h4 className="comments-titlee">Comments:</h4>
      {comments[post._id].length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments[post._id].map(comment => (
          <div key={comment._id} className="comment-containerr">
            <p className="comment-textt">{comment.text}</p>
            <button 
              onClick={() => deleteComment(post._id, comment._id)} 
              className="delete-comment-button"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
                      ))
                    )}
                  </div>
                )}

                <div className="post-management-actions">
                  <button 
                    onClick={() => navigate(`/edit/${post._id}`)} 
                    className="edit-post-button"
                  >
                    <Edit size={16} /> Edit
                  </button>

                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="delete-post-button"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default WritersPage;
