import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductForm = ({ product, onClose, onProductUpdate, getAuthConfig, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    image: null
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        image: null
      });
      setPreview(product.image || '');
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    // if (!formData.category) newErrors.category = 'Category is required';
    if (!isEditing && !formData.image) newErrors.image = 'Product image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData({ ...formData, [name]: files[0] });
        setPreview(URL.createObjectURL(files[0]));
        // Clear error if exists
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price') {
      const value = e.target.value;
      if (value === "" || (!isNaN(parseFloat(value)) && isFinite(value))) {
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear error if exists
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('category', formData.category);
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
          `https://moihub.onrender.com/api/eshop/vendor/product/${product._id}`,
          form,
          { headers }
        );
      } else {
        // Create new product
        response = await axios.post(
          'https://moihub.onrender.com/api/eshop/vendor/product/create',
          form,
          { headers }
        );
      }

      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
      onProductUpdate(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to save product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="name">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
          <input
  type="text"
  id="category"
  name="category"
  value={formData.category}
  onChange={handleChange}
  placeholder="Enter or choose category"
  list="category-options"
  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    errors.category ? 'border-red-500' : ''
  }`}
/>

<datalist id="category-options">
  {categories?.map((category) => (
    <option key={category._id || category} value={category.name || category} />
  ))}
</datalist>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category._id || category} value={category._id || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 sm:h-32 ${
                errors.description ? 'border-red-500' : ''
              }`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="price">
              Price*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.price ? 'border-red-500' : ''
              }`}
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image">
              Product Image{!isEditing && '*'}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.image ? 'border-red-500' : ''
              }`}
              accept="image/*"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
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

          <div className="flex justify-end pt-4">
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