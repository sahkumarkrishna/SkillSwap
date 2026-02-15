import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchReviews = createAsyncThunk('reviews/fetchAll', async (userId) => {
  const { data } = await api.get(`/reviews/${userId}`);
  return data.reviews || [];
});

export const createReview = createAsyncThunk('reviews/create', async (reviewData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create review');
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { reviews: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createReview.pending, (state) => { state.loading = true; })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
