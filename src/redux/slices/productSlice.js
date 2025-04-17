import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;
const API_URL = 'https://markethubbackend.onrender.com/api/products/approved';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Create axios instance with cancellation support
const axiosInstance = axios.create();
let cancelTokenSource;

// Async thunk for fetching products (backup for non-RTK Query path)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit = ITEMS_PER_PAGE, searchQuery = '' }, { rejectWithValue, getState }) => {
    try {
      // Cancel previous requests
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Operation canceled due to new request.');
      }
      
      // Create a new cancel token for this request
      cancelTokenSource = axios.CancelToken.source();
      
      // First page and no search query? Check cache first
      if (page === 1 && !searchQuery) {
        const { lastFetchTime } = getState().products;
        const now = Date.now();
        
        // If cache is fresh (less than 5 minutes old), use it
        if (lastFetchTime && (now - lastFetchTime) < CACHE_TTL) {
          // We'll still fetch fresh data in background, but will use cache for now
          console.log('Using cached data while fetching fresh data');
          axiosInstance.get(
            `${API_URL}?page=${page}&limit=${limit}&search=${searchQuery}`,
            { cancelToken: cancelTokenSource.token }
          ).then(response => {
            // Silently update cache with new data
            return {
              data: response.data.products || response.data,
              page,
              totalPages: response.data.totalPages || 1,
              hasMore: response.data.hasMore || false,
              fromCache: false
            };
          }).catch(() => {
            // Ignore errors in background fetch
          });
          
          // Return cached data immediately
          return { 
            fromCache: true, 
            page
          };
        }
      }
      
      // Normal fetch path
      const response = await axiosInstance.get(
        `${API_URL}?page=${page}&limit=${limit}&search=${searchQuery}`,
        { cancelToken: cancelTokenSource.token }
      );
      
      return { 
        data: response.data.products || response.data, 
        page,
        totalPages: response.data.totalPages || 1,
        hasMore: response.data.hasMore || false,
        fromCache: false
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return rejectWithValue('Request canceled');
      }
      return rejectWithValue('Failed to load products. Please try again later.');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 0,
    hasMore: true,
    searchQuery: '',
    searching: false,
    lastFetchTime: null
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearching: (state, action) => {
      state.searching = action.payload;
    },
    resetProducts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        if (!state.searching) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data, page, hasMore, fromCache } = action.payload;
        
        // If using cache, don't update state except loading flag
        if (fromCache) {
          state.loading = false;
          return;
        }
         
        // If it's page 1, replace items, otherwise append
        if (page === 1) {
          state.items = data;
        } else {
          // Prevent duplicate items when appending
          const newItemIds = new Set(data.map(item => item._id));
          const uniqueExistingItems = state.items.filter(item => !newItemIds.has(item._id));
          state.items = [...uniqueExistingItems, ...data];
        }
         
        state.loading = false;
        state.hasMore = hasMore;
        state.page = page;
        state.searching = false;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // Don't set error for canceled requests
        if (action.payload !== 'Request canceled') {
          state.loading = false;
          state.error = action.payload;
          state.searching = false;
        }
      });
  },
});

export const { setSearchQuery, resetProducts, setSearching } = productSlice.actions;
export default productSlice.reducer;