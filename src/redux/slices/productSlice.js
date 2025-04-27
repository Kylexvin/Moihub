// productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
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
      // Keep cached items but reset pagination related state
      state.searching = false;
    },
    updateCacheTimestamp: (state) => {
      state.lastFetchTime = Date.now();
    }
  }
});

export const { 
  setSearchQuery, 
  resetProducts, 
  setSearching,
  updateCacheTimestamp
} = productSlice.actions;

export default productSlice.reducer;