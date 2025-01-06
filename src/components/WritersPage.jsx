import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageCircle, Trash2, Edit } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
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
  const [errors, setErrors] = useState({
    posts: null,
    submission: null
  });
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // Auto-save functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (title || contentBlocks.length > 0) {
        localStorage.setItem('draftPost', JSON.stringify({
          title,
          category,
          contentBlocks,
          lastSaved: new Date().toISOString()
        }));
        toast.success('Draft saved', { duration: 2000 });
      }
    }, 60000); // Save every minute

    return () => clearInterval(saveInterval);
  }, [title, category, contentBlocks]);

  // Load saved draft on initial load
  useEffect(() => {
    const savedDraft = localStorage.getItem('draftPost');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setCategory(draft.category || '');
      setContentBlocks(draft.contentBlocks || []);
    }
  }, []);

  // Fetch all posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No token found! Please log in again.');
        return;
      }

      try {
        const response = await fetch('https://moigosip.onrender.com/api/posts/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
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

  // Progress calculation
  useEffect(() => {
    let points = 0;
    if (title) points += 20;
    if (category) points += 20;
    if (image) points += 20;
    points += Math.min(40, contentBlocks.length * 10);
    setProgress(points);
  }, [title, category, image, contentBlocks]);

  // Image optimization utility
  const optimizeImage = async (file, options = {}) => {
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.8,
      maxSizeInMB = 5
    } = options;

    return new Promise((resolve, reject) => {
      if (file.size <= maxSizeInMB * 1024 * 1024) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            },
            'image/jpeg',
            quality
          );
        };
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const renderPostContent = (content) => {
    try {
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
                  loading="lazy"
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

      const response = await axios.get(`https://moigosip.onrender.com/api/posts/${postId}`, {
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

      await axios.delete(`https://moigosip.onrender.com/api/posts/${postId}/comment/${commentId}`, {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedFile = await optimizeImage(file);
        setImage(optimizedFile);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(optimizedFile);
        toast.success('Image uploaded and optimized successfully');
      } catch (error) {
        toast.error('Error processing image');
        console.error('Image optimization error:', error);
      }
    }
  };

  const handleContentBlockImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedFile = await optimizeImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setNewBlock(prev => ({
            ...prev,
            src: reader.result,
            caption: prev.caption || ''
          }));
          toast.success('Block image uploaded and optimized successfully');
        };
        reader.readAsDataURL(optimizedFile);
      } catch (error) {
        toast.error('Error processing block image');
        console.error('Block image optimization error:', error);
      }
    }
  };

  const validateBlock = (block) => {
    const errors = [];
    
    switch(block.type) {
      case 'header':
        if (!block.text.trim()) errors.push('Header text is required');
        if (block.text.length > 100) errors.push('Header text too long');
        break;
      case 'paragraph':
        if (!block.text.trim()) errors.push('Paragraph text is required');
        break;
      case 'list':
        if (!block.items.length) errors.push('List must have at least one item');
        break;
      case 'image':
        if (!block.src) errors.push('Image is required');
        if (block.caption?.length > 200) errors.push('Caption too long');
        break;
    }
    
    return errors;
  };

  const addBlock = () => {
    const blockErrors = validateBlock(newBlock);
    
    if (blockErrors.length > 0) {
      blockErrors.forEach(error => toast.error(error));
      return;
    }

    setContentBlocks([...contentBlocks, newBlock]);
    setNewBlock({
      type: 'paragraph',
      text: '',
      items: [],
      src: '',
      caption: ''
    });
    toast.success('Content block added');
  };

  const handleKeyPress = (e, blockIndex) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'ArrowUp' && blockIndex > 0) {
        const newBlocks = [...contentBlocks];
        [newBlocks[blockIndex], newBlocks[blockIndex - 1]] = 
        [newBlocks[blockIndex - 1], newBlocks[blockIndex]];
        setContentBlocks(newBlocks);
      }
      if (e.key === 'ArrowDown' && blockIndex < contentBlocks.length - 1) {
        const newBlocks = [...contentBlocks];
        [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = 
        [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
        setContentBlocks(newBlocks);
      }
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
      const response = await fetch('https://moigosip.onrender.com/api/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data?.posts)) {
          setPosts(data.posts);
          toast.success('Blog post successfully created!');
          
          // Reset form
          setTitle('');
          setCategory('');
          setContentBlocks([]);
          setImage(null);
          setPreviewImage(null);
          // Clear draft from localStorage
          localStorage.removeItem('draftPost');
        } else {
          toast.success('Blog post created, but unable to update post list');
          console.warn('Unexpected response format:', data);
        }
      } else {
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
      const response = await fetch(`https://moigosip.onrender.com/api/posts/${postId}`, {
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
 {/* Progress indicator */}
 <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {progress}%
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="blog-title-input"
        aria-label="Blog title"
      />

      <input
        type="text"
        placeholder="Enter blog category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-field"
        aria-label="Blog category"
      />

      <div className="file-upload">
        <input 
          type="file" 
          onChange={handleImageUpload} 
          className="file-input"
          accept="image/*"
          aria-label="Upload main image"
        />
        {previewImage && (
          <div className="preview-container">
            <p>Preview:</p>
            <img 
              src={previewImage} 
              alt="Uploaded Preview" 
              className="preview-image"
              loading="lazy"
            />
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
          aria-label="Content block type"
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
            aria-label="List items"
          />
        ) : newBlock.type === 'image' ? (
          <div className="image-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleContentBlockImageUpload}
              className="file-input"
              aria-label="Upload block image"
            />
            {newBlock.src && (
              <img
                src={newBlock.src}
                alt="Block Preview"
                className="block-preview-image"
                loading="lazy"
              />
            )}
            <input
              type="text"
              placeholder="Add image caption (optional)"
              value={newBlock.caption || ''}
              onChange={(e) => setNewBlock({ ...newBlock, caption: e.target.value })}
              className="input-field"
              aria-label="Image caption"
            />
          </div>
        ) : (
          <textarea
            placeholder={`Enter your ${newBlock.type} content`}
            value={newBlock.text}
            onChange={(e) => setNewBlock({ ...newBlock, text: e.target.value })}
            className="textarea-field"
            aria-label={`${newBlock.type} content`}
          />
        )}

        <button 
          onClick={addBlock} 
          style={{ marginBottom: '20px' }}
          aria-label="Add content block"
        >
          Add Content Block
        </button>
      </div>
      

      <div className="content-preview-container">
  {contentBlocks.length > 0 && (
    <div>
      <h2 className="content-preview-title">Content Preview:</h2>
      {contentBlocks.map((block, index) => (
        <div 
          key={index} 
          className="content-block"
          onKeyDown={(e) => handleKeyPress(e, index)}
          tabIndex="0"
          role="article"
          aria-label={`Content block ${index + 1} of ${contentBlocks.length}`}
        >
          {block.type === 'header' && (
            <div className="block-header-container">
              <h3 className="block-header">{block.text}</h3>
              <div className="block-controls">
                <button 
                  onClick={() => {
                    const newBlocks = [...contentBlocks];
                    newBlocks.splice(index, 1);
                    setContentBlocks(newBlocks);
                    toast.success('Block removed');
                  }}
                  className="block-delete-btn"
                  aria-label="Delete block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          
          {block.type === 'paragraph' && (
            <div className="block-paragraph-container">
              <p className="block-paragraph">{block.text}</p>
              <div className="block-controls">
                <button 
                  onClick={() => {
                    const newBlocks = [...contentBlocks];
                    newBlocks.splice(index, 1);
                    setContentBlocks(newBlocks);
                    toast.success('Block removed');
                  }}
                  className="block-delete-btn"
                  aria-label="Delete block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          
          {block.type === 'list' && (
            <div className="block-list-container">
              <ul className="block-list">
                {block.items.map((item, i) => (
                  <li key={i} className="list-item">{item}</li>
                ))}
              </ul>
              <div className="block-controls">
                <button 
                  onClick={() => {
                    const newBlocks = [...contentBlocks];
                    newBlocks.splice(index, 1);
                    setContentBlocks(newBlocks);
                    toast.success('Block removed');
                  }}
                  className="block-delete-btn"
                  aria-label="Delete block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          
          {block.type === 'image' && (
            <div className="block-image-container">
              <div className="image-wrapper">
                <img 
                  src={block.src} 
                  alt={block.caption || "Uploaded block"} 
                  className="block-image"
                  loading="lazy"
                />
                {block.caption && (
                  <p className="image-caption">{block.caption}</p>
                )}
              </div>
              <div className="block-controls">
                <button 
                  onClick={() => {
                    const newBlocks = [...contentBlocks];
                    newBlocks.splice(index, 1);
                    setContentBlocks(newBlocks);
                    toast.success('Block removed');
                  }}
                  className="block-delete-btn"
                  aria-label="Delete block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="block-move-controls">
            {index > 0 && (
              <button
                onClick={() => {
                  const newBlocks = [...contentBlocks];
                  [newBlocks[index], newBlocks[index - 1]] = 
                  [newBlocks[index - 1], newBlocks[index]];
                  setContentBlocks(newBlocks);
                  toast.success('Block moved up');
                }}
                className="block-move-btn"
                aria-label="Move block up"
              >
                ↑
              </button>
            )}
            {index < contentBlocks.length - 1 && (
              <button
                onClick={() => {
                  const newBlocks = [...contentBlocks];
                  [newBlocks[index], newBlocks[index + 1]] = 
                  [newBlocks[index + 1], newBlocks[index]];
                  setContentBlocks(newBlocks);
                  toast.success('Block moved down');
                }}
                className="block-move-btn"
                aria-label="Move block down"
              >
                ↓
              </button>
            )}
          </div>
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
