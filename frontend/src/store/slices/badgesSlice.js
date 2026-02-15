import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBadges = createAsyncThunk('badges/fetchAll', async () => {
  const { data } = await api.get('/badges');
  return data;
});

export const fetchUserBadges = createAsyncThunk('badges/fetchUser', async (userId) => {
  const { data } = await api.get(`/badges/user/${userId}`);
  return data;
});

const badgesSlice = createSlice({
  name: 'badges',
  initialState: { badges: [], userBadges: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.userBadges = action.payload;
      });
  },
});

export default badgesSlice.reducer;
