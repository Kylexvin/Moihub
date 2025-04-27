// productApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://markethubbackend.onrender.com/api/',
    // Add timeout and error handling
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-cache');
      return headers;
    },
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, searchQuery = '' }) => ({
        url: `products/approved`,
        params: {
          page,
          limit,
          search: searchQuery
        },
        // Add timeout to prevent hanging requests
        timeout: 10000, // 10 seconds
      }),
      
      // Transform response to standardize the structure
      transformResponse: (response) => ({
        products: response.products || response,
        pagination: {
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          hasMore: response.hasMore || false
        }
      }),
      
      // Better cache key handling for search queries
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // If search query changes, create a new cache entry
        return `${endpointName}${queryArgs.searchQuery ? `-${queryArgs.searchQuery}` : ''}`;
      },
      
      // Improved merge function for pagination
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // For page 1 or search changes, replace the cache
          return newItems;
        }
        
        // For subsequent pages, append unique products
        const existingIds = new Set(currentCache.products.map(p => p._id));
        const uniqueNewProducts = newItems.products.filter(p => !existingIds.has(p._id));
        
        return {
          ...newItems,
          products: [...currentCache.products, ...uniqueNewProducts]
        };
      },
      
      // Only have one active subscription per search query
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.searchQuery !== previousArg?.searchQuery ||
          currentArg?.page !== previousArg?.page
        );
      },
      
      // Cache settings
      keepUnusedDataFor: 300, // 5 minutes in seconds
      
      // Provide tags for cache invalidation
      providesTags: (result) => 
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
              { type: 'Products', id: 'LIST' }
            ]
          : [{ type: 'Products', id: 'LIST' }]
    })
  })
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery 
} = productApi;