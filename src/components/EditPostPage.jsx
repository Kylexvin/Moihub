import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Link } from 'react-router-dom';
import {   
  ArrowLeft
} from 'lucide-react';


const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found! Please log in again.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }

        const data = await response.json();
        const post = data.post;

        setTitle(post.title);
        setCategory(post.category);
        setContentBlocks(post.content || []);
        setPreviewImage(post.image);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Error fetching post data.');
      }
    };

    fetchPost();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !category.trim()) {
      alert('Title and category are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    if (image) formData.append('image', image);
    formData.append('content', JSON.stringify(contentBlocks));

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No token found! Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PATCH',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Post updated successfully!');
        navigate('/post-list');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Error updating post'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleContentChange = (blockIndex, field, newValue) => {
    const updatedContent = [...contentBlocks];
    updatedContent[blockIndex][field] = newValue;
    setContentBlocks(updatedContent);
  };

  const handleAddBlock = (type) => {
    const newBlock =
      type === 'image'
        ? { type: 'image', src: '', caption: '' }
        : { type, text: type === 'list' ? '' : '', items: [] };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const handleImageBlockUpload = (blockIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedContent = [...contentBlocks];
      const reader = new FileReader();

      reader.onload = () => {
        updatedContent[blockIndex].src = reader.result;
        setContentBlocks(updatedContent);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
       <header className='writer-page-header'>
      <Link to="/post-list" className="back-to-blog">
          <ArrowLeft size={24} className="back-icon" />
          Back 
        </Link>
      </header>

      <h1 className='writer-page-header'>Edit Blog Post</h1>


      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />

      <input
        type="text"
        placeholder="Enter blog category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />

      <div>
        <input type="file" onChange={handleImageUpload} />
        {previewImage && (
          <div style={{ marginTop: '10px' }}>
            <p>Main Image Preview:</p>
            <img
              src={previewImage}
              alt="Uploaded Preview"
              style={{ width: '200px', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Content Blocks:</h2>
        {contentBlocks.map((block, blockIndex) => (
          <div key={blockIndex} style={{ marginBottom: '20px' }}>
            {block.type === 'paragraph' && (
              <textarea
                value={block.text}
                onChange={(e) => handleContentChange(blockIndex, 'text', e.target.value)}
                style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
              />
            )}
            {block.type === 'header' && (
              <input
                type="text"
                value={block.text}
                onChange={(e) => handleContentChange(blockIndex, 'text', e.target.value)}
                style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
              />
            )}
            {block.type === 'list' && (
              <textarea
                value={block.text}
                onChange={(e) => handleContentChange(blockIndex, 'text', e.target.value)}
                style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
              />
            )}
            {block.type === 'image' && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageBlockUpload(blockIndex, e)}
                  style={{ marginBottom: '5px' }}
                />
                {block.src && (
                  <img
                    src={block.src}
                    alt="Content Block"
                    style={{ width: '200px', borderRadius: '8px', marginTop: '10px' }}
                  />
                )}
                <input
                  type="text"
                  placeholder="Add caption (optional)"
                  value={block.caption || ''}
                  onChange={(e) => handleContentChange(blockIndex, 'caption', e.target.value)}
                  style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                />
              </div>
            )}
          </div>
        ))}

<div className="add-block-container">
  <button onClick={() => handleAddBlock('paragraph')} className="add-block-button">
    Add Paragraph
  </button>
  <button onClick={() => handleAddBlock('header')} className="add-block-button">
    Add Header
  </button>
  <button onClick={() => handleAddBlock('list')} className="add-block-button">
    Add List
  </button>
  <button onClick={() => handleAddBlock('image')} className="add-block-button">
    Add Image
  </button>
</div>

      </div>

      <button onClick={handleUpdate} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Update Blog Post
      </button>
    </div>
  );
};

export default EditPostPage;
