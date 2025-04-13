import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Edit, Trash2 } from 'lucide-react';

const ListingsCards = ({ setActiveComponent, setEditingListingId }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Get token function
  const getToken = () => {
    return localStorage.getItem('token') || 
           localStorage.getItem('vendorToken') || 
           sessionStorage.getItem('token') ||
           sessionStorage.getItem('vendorToken');
  };

  // Setup axios instance with authentication
  const api = axios.create({
    baseURL: 'https://moihub.onrender.com/api'
  });

  // Add request interceptor to include token in all requests
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchListings();
  }, [page, limit]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      const queryParams = `page=${page}&limit=${limit}`;
      
      const response = await api.get(`/food/listings/vendor?${queryParams}`);
      
      if (response.data && response.data.listings) {
        setListings(response.data.listings);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setListings([]);
        setTotalPages(1);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch listings');
      setLoading(false);
      console.error('Error fetching listings:', err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/food/listings/${id}/toggle-status`);
      
      // Update the listing in our state
      setListings(listings.map(listing => 
        listing._id === id ? { ...listing, isActive: !currentStatus } : listing
      ));
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update listing status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/food/listings/${id}`);
      
      // Remove the listing from our state
      setListings(listings.filter(listing => listing._id !== id));
      
      // If we're on a page that's now empty but not the first page, go back a page
      if (listings.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing');
    }
  };

  const handleEdit = (listingId) => {
    // Instead of navigating directly, we set the editing ID and change the active component
    setEditingListingId(listingId);
    setActiveComponent('addListing');
  };

  // Map categories to their respective colors
  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      drink: 'bg-blue-100 text-blue-800',
      dessert: 'bg-purple-100 text-purple-800',
      snack: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading your delicious menu...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="mt-3 text-red-500 font-medium">{error}</p>
          <button 
            onClick={fetchListings}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No food items</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new menu item.</p>
          <div className="mt-6">
            <button 
              onClick={() => setActiveComponent('addListing')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Food Item
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Food Cards Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div 
                key={listing._id} 
                className={`relative overflow-hidden rounded-lg shadow-md border ${listing.isActive ? 'border-gray-200' : 'border-gray-200 opacity-75'}`}
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => handleToggleStatus(listing._id, listing.isActive)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                      listing.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {listing.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  {listing.imageURL ? (
                    <img 
                      className="h-full w-full object-cover" 
                      src={listing.imageURL} 
                      alt={listing.name} 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
                      {listing.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {listing.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {listing.description || 'No description available'}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      ${listing.price ? parseFloat(listing.price).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                  <button 
                    onClick={() => handleEdit(listing._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{listings.length}</span> results
                  {totalPages > 1 && (
                    <span> (Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>)</span>
                  )}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      page === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers - only show a few */}
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    if (pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      page === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListingsCards;