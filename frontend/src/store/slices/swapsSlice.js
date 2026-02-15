import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSwapRequests = createAsyncThunk('swaps/fetchAll', async () => {
  const { data } = await api.get('/swaps');
  return data;
});

export const createSwapRequest = createAsyncThunk('swaps/create', async (swapData) => {
  const { data } = await api.post('/swaps', swapData);
  return data;
});

export const updateSwapStatus = createAsyncThunk('swaps/updateStatus', async ({ id, status }) => {
  const { data } = await api.patch(`/swaps/${id}`, { status });
  return data;
});

export const deleteSwapRequest = createAsyncThunk('swaps/delete', async (id) => {
  await api.delete(`/swaps/${id}`);
  return id;
});

const swapsSlice = createSlice({
  name: 'swaps',
  initialState: { swaps: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwapRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchSwapRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.swaps = action.payload;
      })
      .addCase(fetchSwapRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSwapRequest.fulfilled, (state, action) => {
        state.swaps.unshift(action.payload);
      })
      .addCase(updateSwapStatus.fulfilled, (state, action) => {
        const index = state.swaps.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.swaps[index] = action.payload;
      })
      .addCase(deleteSwapRequest.fulfilled, (state, action) => {
        state.swaps = state.swaps.filter(s => s._id !== action.payload);
      });
  },
});

export default swapsSlice.reducer;
