// store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productApi } from '../services/productApi';
import productReducer from './slices/productSlice';
import routeReducer from './slices/routeSlice';
import vehicleReducer from './slices/vehicleSlice';

// Constants for cache handling
const CACHE_KEY = 'marketHubState';
const TIMESTAMP_KEY = 'marketHubStateTimestamp';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Load cached state from localStorage with timestamp validation
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(CACHE_KEY);
    if (!serializedState) return undefined;
    
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!timestamp) return undefined;
    
    // Check if cache is still valid
    const now = Date.now();
    const cacheAge = now - parseInt(timestamp, 10);
    
    if (cacheAge > CACHE_TTL) {
      console.log('Cache expired, fetching fresh data');
      return undefined;
    }
    
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage with timestamp
const saveState = (state) => {
  try {
    // Only cache the RTK Query data to avoid storage issues
    const stateToSave = {
      [productApi.reducerPath]: state[productApi.reducerPath],
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(stateToSave));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Create the store with preloaded state
const preloadedState = loadState();

const store = configureStore({
  reducer: {
    products: productReducer,
    routes: routeReducer,
    vehicles: vehicleReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware
    ),
  preloadedState,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Subscribe to store changes to update cache
let throttleTimeout = null;
store.subscribe(() => {
  // Throttle saving to localStorage to avoid performance issues
  if (!throttleTimeout) {
    throttleTimeout = setTimeout(() => {
      const state = store.getState();
      if (state[productApi.reducerPath]) {
        saveState(state);
      }
      throttleTimeout = null;
    }, 1000); // Save at most once per second
  }
});

// Export function to force cache refresh
export const forceRefreshCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
  store.dispatch(productApi.util.invalidateTags(['Products']));
};

export default store;