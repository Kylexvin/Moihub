import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductForm from './ProductForm';
import { Edit, Trash2, Eye, EyeOff, Plus, Search, Filter, RefreshCw } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
        'https://moihub.onrender.com/api/eshop/vendor/my-products',
        getAuthConfig()
      );
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  // Refresh products with animation
  const refreshProducts = async () => {
    setRefreshing(true);
    await fetchProducts();
    setTimeout(() => setRefreshing(false), 600); // Keep animation visible briefly
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle product availability
  const toggleAvailability = async (productId) => {
    try {
      const response = await axios.patch(
        `https://moihub.onrender.com/api/eshop/vendor/product/${productId}/toggle`,
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
  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    
    try {
      await axios.delete(
        `https://moihub.onrender.com/api/eshop/vendor/product/${productId}`,
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
    // Scroll to top on mobile when opening form
    if (window.innerWidth < 768) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  // Add new product
  const addNewProduct = () => {
    setCurrentProduct(null);
    setShowForm(true);
    // Scroll to top on mobile when opening form
    if (window.innerWidth < 768) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
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
      setProducts([updatedProduct, ...products]);
    }
    setShowForm(false);
    setCurrentProduct(null);
    toast.success(currentProduct ? 'Product updated successfully' : 'Product created successfully');
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-2 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and add button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Products</h2>
          <div className="flex items-center mt-3 md:mt-0 w-full md:w-auto">
            <button 
              onClick={refreshProducts}
              className="mr-2 p-2 rounded-full hover:bg-gray-100 text-gray-600"
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <div className="relative flex-grow md:flex-grow-0 md:w-64 mr-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-3 pl-9 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button 
              onClick={addNewProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 md:px-4 rounded flex items-center text-sm md:text-base font-medium transition duration-200"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </button>
          </div>
        </div>

        {/* Product form (conditional rendering) */}
        {showForm && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={handleFormClose}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <ProductForm 
              product={currentProduct} 
              onClose={handleFormClose} 
              onProductUpdate={handleProductUpdate}
              getAuthConfig={getAuthConfig}
            />
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Add your first product to start selling.</p>
            <button 
              onClick={addNewProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add First Product
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No products match your search.</p>
          </div>
        ) : (
          <>
            {/* Desktop table view (hidden on mobile) */}
            <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-16 w-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => editProduct(product)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleAvailability(product._id)}
                            className={`flex items-center ${
                              product.isAvailable ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            title={product.isAvailable ? 'Disable' : 'Enable'}
                          >
                            {product.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id, product.name)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view (shown only on mobile) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-0 right-0 mt-2 mr-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="mt-2 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => editProduct(product)}
                        className="flex items-center text-blue-600 font-medium"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => toggleAvailability(product._id)}
                        className={`flex items-center font-medium ${
                          product.isAvailable ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {product.isAvailable ? (
                          <><EyeOff className="h-4 w-4 mr-1" /> Disable</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-1" /> Enable</>
                        )}
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id, product.name)}
                        className="flex items-center text-red-600 font-medium"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Import ShoppingBag icon for empty state
const ShoppingBag = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default ProductList;