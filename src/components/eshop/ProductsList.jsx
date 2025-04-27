import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Configure axios with auth token
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch all products for the vendor
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/eshop/vendor/my-products',
        getAuthConfig()
      );
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle product availability
  const toggleAvailability = async (productId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/eshop/vendor/product/${productId}/toggle`,
        {},
        getAuthConfig()
      );
      toast.success(response.data.message);
      
      // Update product in state
      setProducts(products.map(product => 
        product._id === productId ? { ...product, isAvailable: !product.isAvailable } : product
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle availability');
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(
        `http://localhost:5000/api/eshop/vendor/product/${productId}`,
        getAuthConfig()
      );
      toast.success('Product deleted successfully');
      
      // Remove product from state
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Edit product
  const editProduct = (product) => {
    setCurrentProduct(product);
    setShowForm(true);
  };

  // Add new product
  const addNewProduct = () => {
    setCurrentProduct(null);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setCurrentProduct(null);
  };

  // Handle product update or creation
  const handleProductUpdate = (updatedProduct) => {
    if (currentProduct) {
      // Update existing product in state
      setProducts(products.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      ));
    } else {
      // Add new product to state
      setProducts([...products, updatedProduct]);
    }
    setShowForm(false);
    setCurrentProduct(null);
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <button 
          onClick={addNewProduct}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <ProductForm 
          product={currentProduct} 
          onClose={handleFormClose} 
          onProductUpdate={handleProductUpdate}
          getAuthConfig={getAuthConfig}
        />
      )}

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't added any products yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(product._id)}
                      className={`mr-3 ${
                        product.isAvailable ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {product.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;