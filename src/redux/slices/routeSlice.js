import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching routes
export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://moihub.onrender.com/api/routes");
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const routeSlice = createSlice({
  name: 'routes',
  initialState: {
    routes: [],
    filteredRoutes: [],
    selectedDestination: '',
    totalRoutes: 0,
    lastUpdated: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSelectedDestination: (state, action) => {
      state.selectedDestination = action.payload;
      state.filteredRoutes = action.payload 
        ? state.routes.filter(route => route.destination === action.payload)
        : state.routes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.routes = action.payload;
        // Reset filtered routes based on current destination
        state.filteredRoutes = state.selectedDestination
          ? action.payload.filter(route => route.destination === state.selectedDestination)
          : action.payload;
        state.totalRoutes = action.payload.length;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedDestination } = routeSlice.actions;

export default routeSlice.reducer;