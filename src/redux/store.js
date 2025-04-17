import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productApi } from '../services/productApi';

import productReducer from './slices/productSlice'; // 👈 for searchQuery
import routeReducer from './slices/routeSlice';
import vehicleReducer from './slices/vehicleSlice';

// Load cached state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('marketHubState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save productApi cache to localStorage
const saveState = (state) => {
  try {
    const stateToSave = {
      [productApi.reducerPath]: state[productApi.reducerPath],
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('marketHubState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    products: productReducer, // 👈 still manage UI state like searchQuery
    routes: routeReducer,
    vehicles: vehicleReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
  preloadedState,
});

// Enable refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Subscribe to changes to persist productApi state
store.subscribe(() => {
  const state = store.getState();
  if (state[productApi.reducerPath]) {
    saveState(state);
  }
});

export default store;
