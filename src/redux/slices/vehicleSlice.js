import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching matatus by route ID
export const fetchMatatus = createAsyncThunk(
  'vehicles/fetchMatatus',
  async (routeId, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://moihub.onrender.com/api/routes/matatu/${routeId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.matatus || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState: {
    matatus: [],
    selectedMatatu: null,
    lastUpdated: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSelectedMatatu: (state, action) => {
      state.selectedMatatu = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.matatus = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMatatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedMatatu } = vehicleSlice.actions;

export default vehicleSlice.reducer;