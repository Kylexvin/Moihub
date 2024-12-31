import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

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
        if (data && data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        toast.error('Error fetching all posts');
        console.error('Error fetching all posts:', error);
      }
    };
  
    fetchAllPosts();
  }, []);

  const toggleComments = async (postId) => {
    if (showComments[postId]) {
      setShowComments({ ...showComments, [postId]: false });
      return;
    }
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      setComments({ ...comments, [postId]: response.data.post.comments });
      setShowComments({ ...showComments, [postId]: true });
    } catch (error) {
      toast.error('Error fetching comments');
      console.error('Error fetching comments:', error);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`/api/posts/${postId}/comment/${commentId}`);
      setComments({
        ...comments,
        [postId]: comments[postId].filter((comment) => comment._id !== commentId),
      });
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Error deleting comment');
      console.error('Error deleting comment:', error);
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

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Blog post successfully created!');
        setPosts(data.posts);
        setTitle('');
        setCategory('');
        setContentBlocks([]);
        setImage(null);
        setPreviewImage(null);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Error creating blog post'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
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


<button onClick={handleSubmit} className="submit-button">
  Submit Post
</button>

<div className="blog-posts-container">
  <h2 className="blog-posts-title">Blog Posts</h2>
  {posts.map(post => (
    <div key={post._id} className="post-container">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-category">{post.category}</p>
      <p className="post-content">{post.content}</p>

      <button onClick={() => toggleComments(post._id)} className="toggle-comments-button">
        {showComments[post._id] ? 'Hide Comments' : 'Show Comments'}
      </button>

      {showComments[post._id] && comments[post._id] && (
        <div className="comments-section">
          <h4 className="comments-title">Comments:</h4>
          {comments[post._id].map(comment => (
            <div key={comment._id} className="comment-container">
              <p className="comment-text">{comment.text}</p>
              <button onClick={() => deleteComment(post._id, comment._id)} className="delete-comment-button">
                Delete Comment
              </button>
            </div>
          ))}
        </div>
      )}

      <a href={`/edit/${post._id}`} className="edit-link">Edit</a>

      <button onClick={() => handleDelete(post._id)} className="delete-post-button">
        Delete Post
      </button>
    </div>
  ))}
</div>

    </div>
  );
};

export default WritersPage;
