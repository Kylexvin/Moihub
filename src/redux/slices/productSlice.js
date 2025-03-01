import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit = ITEMS_PER_PAGE }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://markethubbackend.onrender.com/api/products/approved?page=${page}&limit=${limit}`
      );
      return { data: response.data, page };
    } catch (error) {
      return rejectWithValue('Failed to load products. Please try again later.');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredItems = state.items.filter(
        product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    resetProducts: (state) => {
      state.items = [];
      state.filteredItems = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        
        // If it's page 1, replace items, otherwise append
        if (page === 1) {
          state.items = data;
        } else {
          // Prevent duplicate items when appending
          const newItemIds = new Set(data.map(item => item._id));
          const uniqueExistingItems = state.items.filter(item => !newItemIds.has(item._id));
          state.items = [...uniqueExistingItems, ...data];
        }
        
        // Update filtered items based on current search query
        state.filteredItems = state.items.filter(
          product =>
            product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        
        state.loading = false;
        state.hasMore = data.length === ITEMS_PER_PAGE;
        state.page = page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, resetProducts } = productSlice.actions;
export default productSlice.reducer;