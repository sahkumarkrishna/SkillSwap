import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await api.get('/notifications');
  return data;
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id) => {
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
});

export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async () => {
  const { data } = await api.put('/notifications/read-all');
  return data;
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (id) => {
  await api.delete(`/notifications/${id}`);
  return id;
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = action.payload;
        const index = state.notifications.findIndex(n => n._id === notification._id);
        if (index !== -1) {
          state.notifications[index] = notification;
        }
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      });
  },
});

export default notificationsSlice.reducer;
