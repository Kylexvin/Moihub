import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;