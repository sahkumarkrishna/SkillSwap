import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const { data } = await api.get('/admin/users');
  return data;
});

export const fetchStats = createAsyncThunk('admin/fetchStats', async () => {
  const { data } = await api.get('/admin/stats');
  return data;
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, userData }) => {
  const { data } = await api.put(`/admin/users/${userId}`, userData);
  return data;
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId) => {
  await api.delete(`/admin/users/${userId}`);
  return userId;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { users: [], stats: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
