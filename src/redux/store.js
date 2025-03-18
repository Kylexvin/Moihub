import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import routeReducer from './slices/routeSlice';
import vehicleReducer from './slices/vehicleSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    routes: routeReducer,
    vehicles: vehicleReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;