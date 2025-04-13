import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListingForm = ({ listingId, setActiveComponent }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = !!listingId;

    // Get token function to centralize token retrieval logic
    const getToken = () => {
        // Try different common token storage names
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

    // Fetch existing data for edit mode
    useEffect(() => {
        if (isEditMode) {
            // Fetch listing data with authentication token
            api.get(`/food/listings/${listingId}`)
                .then(response => {
                    const { name, price, description, category, imageURL } = response.data.listing;
                    setFormData({
                        name,
                        price,
                        description,
                        category,
                        image: imageURL
                    });
                })
                .catch(err => {
                    console.error("Error fetching listing data:", err);
                    if (err.response?.status === 401) {
                        setError("Authentication failed. Please log in again.");
                    } else {
                        setError(err.response?.data?.message || "Failed to fetch data for editing.");
                    }
                });
        }
    }, [isEditMode, listingId]);

    // Handle input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            if (!token) {
                setError("Authentication token missing. Please log in again.");
                setLoading(false);
                return;
            }

            // Create FormData to handle both text fields and the image file
            const formDataToSend = new FormData();

            // Append form data (non-file fields)
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);

            // Append image file
            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            // Send data to backend
            const url = isEditMode
                ? `/food/listings/${listingId}`
                : '/food/listings';
            
            const method = isEditMode ? 'patch' : 'post';
            
            await api({
                method,
                url,
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            setLoading(false);
            // Instead of using navigate, we use setActiveComponent to go back to listings
            setActiveComponent('listings');
        } catch (err) {
            console.error('Error saving listing:', err);
            
            if (err.response?.status === 401) {
                setError("Authentication failed. Please log in again.");
            } else {
                setError(err.response?.data?.message || 'Failed to save listing');
            }
            
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <div className="mt-1">
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="">Select a category</option>
                                <option value="food">Food</option>
                                <option value="drink">Drink</option>
                                <option value="dessert">Dessert</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        <div className="mt-2 flex items-center">
                            {typeof formData.image === 'string' && (
                                <div className="mr-3">
                                    <img 
                                        src={formData.image} 
                                        alt="Preview" 
                                        className="h-20 w-20 object-cover rounded-md" 
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!isEditMode && !formData.image}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {formData.image instanceof File && (
                                    <p className="mt-1 text-xs text-gray-500">Selected: {formData.image.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setActiveComponent('listings')}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Listing' : 'Create Listing'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ListingForm;