import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductForm = ({ product, onClose, onProductUpdate, getAuthConfig }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    image: null
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        isAvailable: product.isAvailable,
        image: null
      });
      setPreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData({ ...formData, [name]: files[0] });
        setPreview(URL.createObjectURL(files[0]));
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!isEditing && !formData.image) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('isAvailable', formData.isAvailable);
      
      if (formData.image) {
        form.append('image', formData.image);
      }
      
      // Get auth headers
      const config = getAuthConfig();
      // Merge with multipart/form-data headers
      const headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      };
      
      let response;
      
      if (isEditing) {
        // Update existing product
        response = await axios.put(
          `http://localhost:5000/api/eshop/vendor/product/${product._id}`,
          form,
          { headers }
        );
      } else {
        // Create new product
        response = await axios.post(
          'http://localhost:5000/api/eshop/vendor/product/create',
          form,
          { headers }
        );
      }

      toast.success(response.data.message);
      onProductUpdate(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Product Image{!isEditing && '*'}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              accept="image/*"
              required={!isEditing}
            />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Available for purchase</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;