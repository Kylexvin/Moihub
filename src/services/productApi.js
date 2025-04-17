// src/services/productApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://markethubbackend.onrender.com/api/' 
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, searchQuery = '' }) => ({
        url: 'products/approved',
        params: { page, limit, search: searchQuery }
      }),
      // Transform the response to normalize data structure
      transformResponse: (response) => ({
        products: response.products || response, // Handle both formats
        pagination: {
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalProducts: response.totalProducts || (response.products?.length || response.length || 0),
          hasMore: response.hasMore || false
        }
      }),
      // Merge with existing data for pagination
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Merge function for handling pagination
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        
        return {
          ...newItems,
          products: [
            ...currentCache.products,
            ...newItems.products.filter(
              (newItem) => !currentCache.products.some(
                (existingItem) => existingItem._id === newItem._id
              )
            )
          ]
        };
      },
      // Only have one cache entry for all queries
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
              { type: 'Products', id: 'LIST' }
            ]
          : [{ type: 'Products', id: 'LIST' }]
    }),
  }),
});

export const { useGetProductsQuery } = productApi;